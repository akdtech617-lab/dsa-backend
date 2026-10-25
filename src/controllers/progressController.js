const db = require('../config/db');

exports.updateProblemStatus = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!['not_started', 'attempted', 'solved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const solvedAt = status === 'solved' ? new Date() : null;

    const result = await db.query(
      `INSERT INTO user_problem_progress (user_id, problem_id, status, solved_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, problem_id)
       DO UPDATE SET status = $3, solved_at = $4, updated_at = now()
       RETURNING *`,
      [userId, problemId, status, solvedAt]
    );

    res.json({ progress: result.rows[0] });
  } catch (err) {
    console.error('updateProblemStatus error:', err);
    res.status(500).json({ error: 'Failed to update progress.' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalsResult = await db.query(
      `SELECT
         COUNT(*) AS total_problems,
         COUNT(*) FILTER (WHERE difficulty = 'easy') AS total_easy,
         COUNT(*) FILTER (WHERE difficulty = 'medium') AS total_medium,
         COUNT(*) FILTER (WHERE difficulty = 'hard') AS total_hard
       FROM problems`
    );

    const solvedResult = await db.query(
      `SELECT
         COUNT(*) AS total_solved,
         COUNT(*) FILTER (WHERE p.difficulty = 'easy') AS solved_easy,
         COUNT(*) FILTER (WHERE p.difficulty = 'medium') AS solved_medium,
         COUNT(*) FILTER (WHERE p.difficulty = 'hard') AS solved_hard
       FROM user_problem_progress upp
       JOIN problems p ON p.id = upp.problem_id
       WHERE upp.user_id = $1 AND upp.status = 'solved'`,
      [userId]
    );

    res.json({
      totals: totalsResult.rows[0],
      solved: solvedResult.rows[0]
    });
  } catch (err) {
    console.error('getDashboardStats error:', err);
    res.status(500).json({ error: 'Failed to load dashboard stats.' });
  }
};

exports.getHeatmap = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT DATE(solved_at) AS day, COUNT(*) AS count
       FROM user_problem_progress
       WHERE user_id = $1 AND status = 'solved' AND solved_at IS NOT NULL
         AND solved_at > now() - interval '371 days'
       GROUP BY DATE(solved_at)
       ORDER BY day ASC`,
      [userId]
    );

    res.json({ days: result.rows });
  } catch (err) {
    console.error('getHeatmap error:', err);
    res.status(500).json({ error: 'Failed to load activity heatmap.' });
  }
};
