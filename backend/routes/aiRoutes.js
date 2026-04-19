const express = require('express');

const { chatWithAssistant, createContactReplyDraft } = require('../controllers/aiController');
const { optionalAuth, protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/chat', optionalAuth, chatWithAssistant);
router.post('/contact-reply', protect, authorize('admin'), createContactReplyDraft);

module.exports = router;
