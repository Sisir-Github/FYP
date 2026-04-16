const express = require('express');
const { updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Apply protect middleware to all user routes
router.use(protect);

router.put('/profile', upload.single('avatar'), updateProfile);

module.exports = router;
