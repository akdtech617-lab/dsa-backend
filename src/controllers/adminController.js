const db = require('../config/db');
const { invalidateCourseTreeCache } = require('./courseController');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ---------------- COURSES ----------------

exports.createCourse = async (req, res) => {
  try {
    const { title, description, icon, is_active, display_order } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required.' });

    const slug = slugify(title);
    const result = await db.query(
      `INSERT INTO courses (title, slug, description, icon, is_active, display_order)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, slug, description || null, icon || null, is_active !== false, display_order || 0]
    );
    invalidateCourseTreeCache();
    res.status(201).json({ course: result.rows[0] });
  } catch (err) {
    console.error('createCourse error:', err);
    res.status(500).json({ error: 'Failed to create course.' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon, is_active, display_order } = req.body;

    const result = await db.query(
      `UPDATE courses SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         icon = COALESCE($3, icon),
         is_active = COALESCE($4, is_active),
         display_order = COALESCE($5, display_order),
         updated_at = now()
       WHERE id = $6 RETURNING *`,
      [title, description, icon, is_active, display_order, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Course not found.' });
    invalidateCourseTreeCache();
    res.json({ course: result.rows[0] });
  } catch (err) {
    console.error('updateCourse error:', err);
    res.status(500).json({ error: 'Failed to update course.' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM courses WHERE id = $1', [id]);
    invalidateCourseTreeCache();
    res.json({ message: 'Course deleted.' });
  } catch (err) {
    console.error('deleteCourse error:', err);
    res.status(500).json({ error: 'Failed to delete course.' });
  }
};

// ---------------- TOPICS ----------------

exports.createTopic = async (req, res) => {
  try {
    const { course_id, title, description, display_order } = req.body;
    if (!course_id || !title) return res.status(400).json({ error: 'course_id and title are required.' });

    const slug = slugify(title);
    const result = await db.query(
      `INSERT INTO topics (course_id, title, slug, description, display_order)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [course_id, title, slug, description || null, display_order || 0]
    );
    invalidateCourseTreeCache();
    res.status(201).json({ topic: result.rows[0] });
  } catch (err) {
    console.error('createTopic error:', err);
    res.status(500).json({ error: 'Failed to create topic.' });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, display_order } = req.body;
    const result = await db.query(
      `UPDATE topics SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         display_order = COALESCE($3, display_order),
         updated_at = now()
       WHERE id = $4 RETURNING *`,
      [title, description, display_order, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Topic not found.' });
    invalidateCourseTreeCache();
    res.json({ topic: result.rows[0] });
  } catch (err) {
    console.error('updateTopic error:', err);
    res.status(500).json({ error: 'Failed to update topic.' });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    await db.query('DELETE FROM topics WHERE id = $1', [req.params.id]);
    invalidateCourseTreeCache();
    res.json({ message: 'Topic deleted.' });
  } catch (err) {
    console.error('deleteTopic error:', err);
    res.status(500).json({ error: 'Failed to delete topic.' });
  }
};

// ---------------- SUBTOPICS ----------------

exports.createSubtopic = async (req, res) => {
  try {
    const { topic_id, title, description, content, video_url, display_order } = req.body;
    if (!topic_id || !title) return res.status(400).json({ error: 'topic_id and title are required.' });

    const slug = slugify(title);
    const result = await db.query(
      `INSERT INTO subtopics (topic_id, title, slug, description, content, video_url, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [topic_id, title, slug, description || null, content || null, video_url || null, display_order || 0]
    );
    invalidateCourseTreeCache();
    res.status(201).json({ subtopic: result.rows[0] });
  } catch (err) {
    console.error('createSubtopic error:', err);
    res.status(500).json({ error: 'Failed to create subtopic.' });
  }
};

exports.updateSubtopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, video_url, display_order } = req.body;
    const result = await db.query(
      `UPDATE subtopics SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         content = COALESCE($3, content),
         video_url = COALESCE($4, video_url),
         display_order = COALESCE($5, display_order),
         updated_at = now()
       WHERE id = $6 RETURNING *`,
      [title, description, content, video_url, display_order, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Subtopic not found.' });
    invalidateCourseTreeCache();
    res.json({ subtopic: result.rows[0] });
  } catch (err) {
    console.error('updateSubtopic error:', err);
    res.status(500).json({ error: 'Failed to update subtopic.' });
  }
};

exports.deleteSubtopic = async (req, res) => {
  try {
    await db.query('DELETE FROM subtopics WHERE id = $1', [req.params.id]);
    invalidateCourseTreeCache();
    res.json({ message: 'Subtopic deleted.' });
  } catch (err) {
    console.error('deleteSubtopic error:', err);
    res.status(500).json({ error: 'Failed to delete subtopic.' });
  }
};

// ---------------- PROBLEMS ----------------

exports.createProblem = async (req, res) => {
  try {
    const { subtopic_id, title, description, category, difficulty, platform_url, external_link, hints, examples, approach, solution_code, display_order } = req.body;
    if (!subtopic_id || !title || !description) {
      return res.status(400).json({ error: 'subtopic_id, title, and description are required.' });
    }

    const slug = slugify(title);
    const result = await db.query(
      `INSERT INTO problems (subtopic_id, title, slug, description, category, difficulty, platform_url, external_link, hints, examples, approach, solution_code, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [subtopic_id, title, slug, description, category || 'interview', difficulty || 'easy', platform_url || null, external_link || null, hints || null, examples || null, approach || null, solution_code || null, display_order || 0]
    );
    invalidateCourseTreeCache();
    res.status(201).json({ problem: result.rows[0] });
  } catch (err) {
    console.error('createProblem error:', err);
    res.status(500).json({ error: 'Failed to create problem.' });
  }
};

exports.updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, difficulty, platform_url, external_link, hints, examples, approach, solution_code, display_order } = req.body;
    const result = await db.query(
      `UPDATE problems SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         category = COALESCE($3, category),
         difficulty = COALESCE($4, difficulty),
         platform_url = COALESCE($5, platform_url),
         external_link = COALESCE($6, external_link),
         hints = COALESCE($7, hints),
         examples = COALESCE($8, examples),
         approach = COALESCE($9, approach),
         solution_code = COALESCE($10, solution_code),
         display_order = COALESCE($11, display_order),
         updated_at = now()
       WHERE id = $12 RETURNING *`,
      [title, description, category, difficulty, platform_url, external_link, hints, examples, approach, solution_code, display_order, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Problem not found.' });
    invalidateCourseTreeCache();
    res.json({ problem: result.rows[0] });
  } catch (err) {
    console.error('updateProblem error:', err);
    res.status(500).json({ error: 'Failed to update problem.' });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    await db.query('DELETE FROM problems WHERE id = $1', [req.params.id]);
    invalidateCourseTreeCache();
    res.json({ message: 'Problem deleted.' });
  } catch (err) {
    console.error('deleteProblem error:', err);
    res.status(500).json({ error: 'Failed to delete problem.' });
  }
};

// ---------------- SITE CONTENT (homepage editable cards) ----------------

exports.createSiteContent = async (req, res) => {
  try {
    const { title, description, display_order } = req.body;
    if (!title || !description) return res.status(400).json({ error: 'Title and description are required.' });

    const result = await db.query(
      `INSERT INTO site_content (title, description, display_order)
       VALUES ($1, $2, $3) RETURNING *`,
      [title, description, display_order || 0]
    );
    res.status(201).json({ content: result.rows[0] });
  } catch (err) {
    console.error('createSiteContent error:', err);
    res.status(500).json({ error: 'Failed to create content.' });
  }
};

exports.updateSiteContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, display_order } = req.body;
    const result = await db.query(
      `UPDATE site_content SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         display_order = COALESCE($3, display_order),
         updated_at = now()
       WHERE id = $4 RETURNING *`,
      [title, description, display_order, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Content not found.' });
    res.json({ content: result.rows[0] });
  } catch (err) {
    console.error('updateSiteContent error:', err);
    res.status(500).json({ error: 'Failed to update content.' });
  }
};

exports.deleteSiteContent = async (req, res) => {
  try {
    await db.query('DELETE FROM site_content WHERE id = $1', [req.params.id]);
    res.json({ message: 'Content deleted.' });
  } catch (err) {
    console.error('deleteSiteContent error:', err);
    res.status(500).json({ error: 'Failed to delete content.' });
  }
};

// ---------------- ADMIN: USERS OVERVIEW ----------------

exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC`
    );
    res.json({ users: result.rows });
  } catch (err) {
    console.error('getAllUsers error:', err);
    res.status(500).json({ error: 'Failed to load users.' });
  }
};
