const db = require('../config/db');

exports.getAllCourses = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM courses ORDER BY display_order ASC, title ASC`
    );
    res.json({ courses: result.rows });
  } catch (err) {
    console.error('getAllCourses error:', err);
    res.status(500).json({ error: 'Failed to load courses.' });
  }
};

exports.getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const courseResult = await db.query('SELECT * FROM courses WHERE slug = $1', [slug]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found.' });
    }
    const course = courseResult.rows[0];

    const topicsResult = await db.query(
      `SELECT * FROM topics WHERE course_id = $1 ORDER BY display_order ASC`,
      [course.id]
    );

    res.json({ course, topics: topicsResult.rows });
  } catch (err) {
    console.error('getCourseBySlug error:', err);
    res.status(500).json({ error: 'Failed to load course.' });
  }
};

// In-memory cache for course trees to eliminate repeated remote DB roundtrips
const courseTreeCache = new Map();
const fetchPromises = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache

async function fetchAndCacheCourseTree(slug) {
  const courseResult = await db.query('SELECT * FROM courses WHERE slug = $1', [slug]);
  if (courseResult.rows.length === 0) {
    return null;
  }
  const course = courseResult.rows[0];

  const rows = await db.query(
    `SELECT
       t.id AS topic_id, t.title AS topic_title, t.description AS topic_description, t.display_order AS topic_order,
       s.id AS subtopic_id, s.title AS subtopic_title, s.video_url AS subtopic_video_url, s.display_order AS subtopic_order,
       p.id AS problem_id, p.title AS problem_title, p.difficulty AS problem_difficulty,
       p.description AS problem_description, p.hints AS problem_hints,
       p.examples AS problem_examples, p.approach AS problem_approach, p.solution_code AS problem_solution_code,
       p.platform_url AS problem_platform_url, p.external_link AS problem_external_link,
       p.display_order AS problem_order
     FROM topics t
     LEFT JOIN subtopics s ON s.topic_id = t.id
     LEFT JOIN problems p ON p.subtopic_id = s.id
     WHERE t.course_id = $1
     ORDER BY t.display_order, t.title, s.display_order, s.title, p.display_order, p.title`,
    [course.id]
  );

  const topicsMap = new Map();
  for (const row of rows.rows) {
    if (!topicsMap.has(row.topic_id)) {
      topicsMap.set(row.topic_id, {
        id: row.topic_id,
        title: row.topic_title,
        description: row.topic_description,
        subtopics: new Map(),
        totalProblems: 0,
        solvedProblems: 0
      });
    }
    const topic = topicsMap.get(row.topic_id);

    if (row.subtopic_id && !topic.subtopics.has(row.subtopic_id)) {
      topic.subtopics.set(row.subtopic_id, {
        id: row.subtopic_id,
        title: row.subtopic_title,
        video_url: row.subtopic_video_url,
        problems: []
      });
    }

    if (row.problem_id) {
      topic.subtopics.get(row.subtopic_id).problems.push({
        id: row.problem_id,
        title: row.problem_title,
        difficulty: row.problem_difficulty,
        description: row.problem_description,
        hints: row.problem_hints,
        examples: row.problem_examples,
        approach: row.problem_approach,
        solution_code: row.problem_solution_code,
        platform_url: row.problem_platform_url,
        external_link: row.problem_external_link,
        user_status: 'not_started'
      });
      topic.totalProblems += 1;
    }
  }

  const topics = Array.from(topicsMap.values()).map((t) => ({
    ...t,
    subtopics: Array.from(t.subtopics.values())
  }));

  const entry = { timestamp: Date.now(), course, topics };
  courseTreeCache.set(slug, entry);
  return entry;
}

async function getOrFetchCourseTree(slug) {
  const now = Date.now();
  const cached = courseTreeCache.get(slug);
  if (cached && (now - cached.timestamp <= CACHE_TTL_MS)) {
    return cached;
  }

  // If a fetch is already in flight for this slug, coalesce requests into the same promise
  if (fetchPromises.has(slug)) {
    return await fetchPromises.get(slug);
  }

  const promise = fetchAndCacheCourseTree(slug).finally(() => {
    fetchPromises.delete(slug);
  });
  fetchPromises.set(slug, promise);
  return await promise;
}

// Helper to pre-warm cache on server startup
exports.warmCourseTreeCache = async (slug = 'dsa') => {
  try {
    const entry = await getOrFetchCourseTree(slug);
    if (entry) {
      console.log(`[Cache] Course tree for "${slug}" pre-warmed successfully.`);
    }
  } catch (err) {
    console.error(`[Cache] Failed to pre-warm course tree for "${slug}":`, err.message);
  }
};

// Helper to invalidate cache when needed (e.g., after admin inserts)
exports.invalidateCourseTreeCache = (slug = null) => {
  if (slug) {
    courseTreeCache.delete(slug);
  } else {
    courseTreeCache.clear();
  }
};

// GET /api/courses/:slug/tree — full nested Topics -> Subtopics -> Problems
// in one call, with the user's solved-status on each problem if logged in.
exports.getCourseTree = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user ? req.user.id : null;

    const cached = await getOrFetchCourseTree(slug);
    if (!cached) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    // If no user is logged in, serve the cached course tree directly (<1ms)
    if (!userId) {
      return res.json({ course: cached.course, topics: cached.topics });
    }

    // If user is logged in, fetch only their progress (<5ms) and overlay onto cloned structure
    const userProgressRes = await db.query(
      'SELECT problem_id, status FROM user_problem_progress WHERE user_id = $1',
      [userId]
    );
    const progressMap = new Map();
    for (const r of userProgressRes.rows) {
      progressMap.set(r.problem_id, r.status);
    }

    const userTopics = cached.topics.map((t) => {
      let solvedCount = 0;
      const subtopics = t.subtopics.map((s) => ({
        ...s,
        problems: s.problems.map((p) => {
          const status = progressMap.get(p.id) || 'not_started';
          if (status === 'solved') solvedCount++;
          return { ...p, user_status: status };
        })
      }));
      return {
        ...t,
        solvedProblems: solvedCount,
        subtopics
      };
    });

    res.json({ course: cached.course, topics: userTopics });
  } catch (err) {
    console.error('getCourseTree error:', err);
    res.status(500).json({ error: 'Failed to load course.' });
  }
};

exports.getSubtopicsForTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const result = await db.query(
      `SELECT * FROM subtopics WHERE topic_id = $1 ORDER BY display_order ASC`,
      [topicId]
    );
    res.json({ subtopics: result.rows });
  } catch (err) {
    console.error('getSubtopicsForTopic error:', err);
    res.status(500).json({ error: 'Failed to load subtopics.' });
  }
};

exports.getSubtopicById = async (req, res) => {
  try {
    const { subtopicId } = req.params;
    const result = await db.query('SELECT * FROM subtopics WHERE id = $1', [subtopicId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subtopic not found.' });
    }
    res.json({ subtopic: result.rows[0] });
  } catch (err) {
    console.error('getSubtopicById error:', err);
    res.status(500).json({ error: 'Failed to load subtopic.' });
  }
};

exports.getProblemsForSubtopic = async (req, res) => {
  try {
    const { subtopicId } = req.params;
    const userId = req.user ? req.user.id : null;

    const result = await db.query(
      `SELECT p.*, upp.status AS user_status
       FROM problems p
       LEFT JOIN user_problem_progress upp
         ON upp.problem_id = p.id AND upp.user_id = $2
       WHERE p.subtopic_id = $1
       ORDER BY p.display_order ASC`,
      [subtopicId, userId]
    );
    res.json({ problems: result.rows });
  } catch (err) {
    console.error('getProblemsForSubtopic error:', err);
    res.status(500).json({ error: 'Failed to load problems.' });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user ? req.user.id : null;

    const result = await db.query(
      `SELECT p.*, upp.status AS user_status
       FROM problems p
       LEFT JOIN user_problem_progress upp
         ON upp.problem_id = p.id AND upp.user_id = $2
       WHERE p.id = $1`,
      [problemId, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Problem not found.' });
    }
    res.json({ problem: result.rows[0] });
  } catch (err) {
    console.error('getProblemById error:', err);
    res.status(500).json({ error: 'Failed to load problem.' });
  }
};
