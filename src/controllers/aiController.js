const db = require('../config/db');
const { getMentorReply, explainBug } = require('../services/aiService');

// Safe runtime migration to ensure image_data column exists
let columnChecked = false;
async function ensureImageColumn() {
  if (columnChecked) return;
  try {
    await db.query(`ALTER TABLE ai_messages ADD COLUMN IF NOT EXISTS image_data TEXT;`);
    columnChecked = true;
  } catch (err) {
    console.warn('Could not auto-add image_data column (may already exist):', err.message);
  }
}

exports.getConversations = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM ai_conversations WHERE user_id = $1 ORDER BY updated_at DESC`,
      [req.user.id]
    );
    res.json({ conversations: result.rows });
  } catch (err) {
    console.error('getConversations error:', err);
    res.status(500).json({ error: 'Failed to load conversations.' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    await ensureImageColumn();
    const { id } = req.params;

    const convo = await db.query(
      `SELECT * FROM ai_conversations WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );
    if (convo.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    const messages = await db.query(
      `SELECT id, conversation_id, role, content, image_data, created_at 
       FROM ai_messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
      [id]
    );
    res.json({ conversation: convo.rows[0], messages: messages.rows });
  } catch (err) {
    console.error('getMessages error:', err);
    res.status(500).json({ error: 'Failed to load messages.' });
  }
};

exports.createConversation = async (req, res) => {
  try {
    const { title, context_problem_id } = req.body;
    const result = await db.query(
      `INSERT INTO ai_conversations (user_id, title, context_problem_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, title || 'New Conversation', context_problem_id || null]
    );
    res.status(201).json({ conversation: result.rows[0] });
  } catch (err) {
    console.error('createConversation error:', err);
    res.status(500).json({ error: 'Failed to create conversation.' });
  }
};

exports.sendMessage = async (req, res) => {
  await ensureImageColumn();
  const { id } = req.params;
  const { content, image_data } = req.body;

  const textContent = (content && content.trim())
    ? content.trim()
    : (image_data ? 'Please analyze this problem or code from the attached image and guide me through it.' : '');

  if (!textContent && !image_data) {
    return res.status(400).json({ error: 'Message content or an attached image is required.' });
  }

  try {
    const convo = await db.query(
      `SELECT * FROM ai_conversations WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );
    if (convo.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    const insertedUserMsg = await db.query(
      `INSERT INTO ai_messages (conversation_id, role, content, image_data) 
       VALUES ($1, 'user', $2, $3) RETURNING *`,
      [id, textContent, image_data || null]
    );

    const historyResult = await db.query(
      `SELECT role, content, image_data FROM ai_messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
      [id]
    );

    let assistantReply;
    try {
      assistantReply = await getMentorReply(historyResult.rows);
    } catch (aiErr) {
      console.error('AI provider error:', aiErr.message);
      return res.status(502).json({
        error: 'The AI mentor is temporarily unavailable. Please try again in a moment.',
        canRetry: true
      });
    }

    const savedReply = await db.query(
      `INSERT INTO ai_messages (conversation_id, role, content) VALUES ($1, 'assistant', $2) RETURNING *`,
      [id, assistantReply]
    );

    await db.query(`UPDATE ai_conversations SET updated_at = now() WHERE id = $1`, [id]);

    res.json({ reply: savedReply.rows[0], userMessage: insertedUserMsg.rows[0] });
  } catch (err) {
    console.error('sendMessage error:', err);
    res.status(500).json({ error: 'Something went wrong sending your message.' });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const convo = await db.query(
      `SELECT * FROM ai_conversations WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );
    if (convo.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    await db.query(`DELETE FROM ai_messages WHERE conversation_id = $1`, [id]);
    await db.query(`DELETE FROM ai_conversations WHERE id = $1 AND user_id = $2`, [id, req.user.id]);

    res.json({ success: true, message: 'Conversation deleted.' });
  } catch (err) {
    console.error('deleteConversation error:', err);
    res.status(500).json({ error: 'Failed to delete conversation.' });
  }
};

exports.explainBug = async (req, res) => {
  try {
    const { code, language, problemTitle, stdin, expectedOutput, actualOutput, status, errorMessage } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Code is required to explain bug.' });
    }

    const explanation = await explainBug({
      code,
      language,
      problemTitle,
      stdin,
      expectedOutput,
      actualOutput,
      status,
      errorMessage
    });

    res.json({ explanation });
  } catch (err) {
    console.error('explainBug error:', err);
    res.status(500).json({ error: err.message || 'Failed to analyze code bug.' });
  }
};
