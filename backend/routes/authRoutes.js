const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  refreshToken,
  verifyEmail,
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
router.get('/verify-email/:token', verifyEmail);

module.exports = router;
