const db = require('../config/db');

exports.getSiteContent = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM site_content ORDER BY display_order ASC, created_at ASC`
    );
    res.json({ content: result.rows });
  } catch (err) {
    console.error('getSiteContent error:', err);
    res.status(500).json({ error: 'Failed to load site content.' });
  }
};
