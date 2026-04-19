const Contact = require('../models/Contact');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { generateProjectChatReply, generateContactReplyDraft } = require('../services/aiService');

exports.chatWithAssistant = asyncHandler(async (req, res) => {
  const { message, history, pageContext } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new ApiError(400, 'A message is required.');
  }

  if (message.trim().length > 2000) {
    throw new ApiError(400, 'Message is too long. Please keep it under 2000 characters.');
  }

  const result = await generateProjectChatReply({
    message,
    history,
    pageContext,
    user: req.user || null,
  });

  res.status(200).json(new ApiResponse(200, 'AI reply generated successfully', result));
});

exports.createContactReplyDraft = asyncHandler(async (req, res) => {
  const { contactId } = req.body;

  if (!contactId) {
    throw new ApiError(400, 'contactId is required.');
  }

  const contact = await Contact.findById(contactId).lean();
  if (!contact) {
    throw new ApiError(404, 'Contact message not found.');
  }

  const draft = await generateContactReplyDraft({ contact });

  res.status(200).json(
    new ApiResponse(200, 'AI contact reply draft generated successfully', {
      subject: `Re: ${contact.subject}`,
      draft,
    })
  );
});
