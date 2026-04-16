const express = require('express');
const {
  createBooking,
  verifyPayment,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/bookingController');

const { protect, authorize } = require('../middleware/auth');
const { createBookingValidator, verifyPaymentValidator } = require('../validators/bookingValidator');
const validate = require('../middleware/validate');

const router = express.Router();

// Publicly triggerable hook for verification, but requires token
router.post('/verify-payment', protect, verifyPaymentValidator, validate, verifyPayment);

// User protected routes
router.route('/me').get(protect, getMyBookings);

router.route('/')
  .post(protect, createBookingValidator, validate, createBooking)
  .get(protect, authorize('admin'), getAllBookings);

router.route('/:id')
  .put(protect, authorize('admin'), updateBookingStatus)
  .delete(protect, authorize('admin'), deleteBooking);

module.exports = router;
