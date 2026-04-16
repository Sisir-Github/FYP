const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  refreshToken,
  verifyEmailOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const { registerValidator, loginValidator } = require('../validators/authValidator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/logout', protect, logout);
router.post('/refresh-token', refreshToken);
router.get('/me', protect, getMe);
router.post('/verify-otp', protect, verifyEmailOTP);
router.post('/resend-otp', protect, resendOTP);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

module.exports = router;
