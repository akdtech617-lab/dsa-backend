const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many attempts. Please try again later.' }
});

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.get('/me', requireAuth, authController.getMe);
router.post('/google', authLimiter, authController.googleAuth);
router.post('/otp/send', authLimiter, authController.sendOtp);
router.post('/otp/verify', authLimiter, authController.verifyOtp);

module.exports = router;
