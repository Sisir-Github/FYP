const { body } = require('express-validator');

exports.createBookingValidator = [
  body('trekId').notEmpty().withMessage('Trek ID is required').isMongoId().withMessage('Invalid Trek ID format'),
  body('startDate').notEmpty().withMessage('Start date is required').isISO8601().withMessage('Invalid start date format'),
  body('participants').notEmpty().withMessage('Number of participants is required').isInt({ min: 1 }).withMessage('Must have at least 1 participant'),
  body('paymentMethod').optional().isIn(['Khalti', 'Cash', 'Bank Transfer']).withMessage('Invalid payment method'),
];

exports.verifyPaymentValidator = [
  body('pidx').notEmpty().withMessage('Payment index is required for verification'),
];
