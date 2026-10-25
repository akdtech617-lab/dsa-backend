const express = require('express');
const rateLimit = require('express-rate-limit');
const codeController = require('../controllers/codeController');

const router = express.Router();

// Rate limit: 20 executions per minute per IP
const executionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many code executions. Please wait a moment.' },
});

router.post('/execute', executionLimiter, codeController.executeCode);
router.get('/boilerplate/:language', codeController.getBoilerplate);

module.exports = router;
