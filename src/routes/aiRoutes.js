const express = require('express');
const rateLimit = require('express-rate-limit');
const aiController = require('../controllers/aiController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 25,
  message: { error: 'Too many requests. Please slow down.' }
});

// Socratic AI Debugger (accessible to both authenticated & guest users)
router.post('/explain-bug', aiLimiter, optionalAuth, aiController.explainBug);

// Authenticated AI Conversation endpoints
router.use(requireAuth);
router.get('/conversations', aiController.getConversations);
router.post('/conversations', aiController.createConversation);
router.get('/conversations/:id/messages', aiController.getMessages);
router.post('/conversations/:id/messages', aiLimiter, aiController.sendMessage);
router.delete('/conversations/:id', aiController.deleteConversation);

module.exports = router;
