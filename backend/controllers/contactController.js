const Contact = require('../models/Contact');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const sendEmail = require('../utils/sendEmail');
const emailTemplates = require('../utils/emailTemplates');

/**
 * @desc    Submit a contact message
 * @route   POST /api/contact
 * @access  Public
 */
exports.submitContact = asyncHandler(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    throw new ApiError(400, 'All fields are required');
  }

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  });

  // Send email to admin
  try {
    await sendEmail({
      to: process.env.SMTP_USER, // Sending to the configured SMTP user as admin
      subject: `New Contact Message: ${subject}`,
      html: emailTemplates.adminContactNotification({
        name,
        email,
        subject,
        message,
      }),
    });
  } catch (err) {
    console.error('Email sending failed:', err);
    // We don't throw error here to avoid rolling back the DB entry
  }

  res.status(201).json(new ApiResponse(201, 'Message sent successfully', contact));
});

/**
 * @desc    Get all contact messages
 * @route   GET /api/contact
 * @access  Private/Admin
 */
exports.getAllContacts = asyncHandler(async (req, res, next) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, 'Contact messages fetched', contacts));
});

/**
 * @desc    Get single contact message
 * @route   GET /api/contact/:id
 * @access  Private/Admin
 */
exports.getContactById = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    throw new ApiError(404, 'Contact message not found');
  }

  // Mark as read if it's new
  if (contact.status === 'new') {
    contact.status = 'read';
    await contact.save();
  }

  res.status(200).json(new ApiResponse(200, 'Contact message fetched', contact));
});

/**
 * @desc    Update contact status
 * @route   PATCH /api/contact/:id
 * @access  Private/Admin
 */
exports.updateContactStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    throw new ApiError(404, 'Contact message not found');
  }

  contact.status = status;
  await contact.save();

  res.status(200).json(new ApiResponse(200, 'Contact status updated', contact));
});

/**
 * @desc    Delete contact message
 * @route   DELETE /api/contact/:id
 * @access  Private/Admin
 */
exports.deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    throw new ApiError(404, 'Contact message not found');
  }

  await contact.deleteOne();

  res.status(200).json(new ApiResponse(200, 'Contact message deleted', {}));
});
