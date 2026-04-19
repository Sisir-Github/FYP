const axios = require('axios');
const Booking = require('../models/Booking');
const Trek = require('../models/Trek');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const sendEmail = require('../utils/sendEmail');
const emailTemplates = require('../utils/emailTemplates');
const { getBookingCancellationEligibility, isInvoiceEligible } = require('../utils/bookingRules');
const {
  ensureInvoiceMetadata,
  ensureInvoiceMetadataForMany,
  generateInvoicePdfBuffer,
  getInvoiceFileName,
} = require('../services/invoiceService');

/**
 * Helper to call Khalti API
 */
const initiateKhaltiPayment = async (purchaseOrderId, purchaseOrderName, amount, returnUrl) => {
  const payload = {
    return_url: returnUrl,
    website_url: process.env.CLIENT_URL,
    amount: amount * 100, // Khalti requires amount in Paisa
    purchase_order_id: purchaseOrderId,
    purchase_order_name: purchaseOrderName,
  };

  const response = await axios.post(
    'https://a.khalti.com/api/v2/epayment/initiate/',
    payload,
    {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

const userBookingPopulate = [
  {
    path: 'trek',
    select: 'title images duration startPoint endPoint slug price',
  },
];

const invoicePopulate = [
  {
    path: 'trek',
    select: 'title images duration startPoint endPoint slug price',
  },
  {
    path: 'user',
    select: 'name email phone',
  },
];

const adminBookingPopulate = [
  {
    path: 'user',
    select: 'name email phone',
  },
  {
    path: 'trek',
    select: 'title price',
  },
];

const populateBookingDocument = async (booking, populateConfig) => {
  if (!booking) return booking;
  await booking.populate(populateConfig);
  return booking;
};

/**
 * @desc    Create new booking and initialize payment
 * @route   POST /api/bookings
 * @access  Private
 */
exports.createBooking = asyncHandler(async (req, res, next) => {
  const { 
    trekId, 
    startDate, 
    participants, 
    specialRequirements, 
    paymentMethod,
    displayCurrency,
    displayAmount,
    conversionRateUsed
  } = req.body;

  const trek = await Trek.findById(trekId);
  if (!trek) {
    throw new ApiError(404, 'Trek not found');
  }

  // Calculate total amount in NPR (base currency)
  const totalAmount = trek.price * participants;

  // Verify user's email
  if (!req.user.isVerified) {
    throw new ApiError(403, 'Please verify your email before booking');
  }

  // Create pending booking with currency tracking
  const booking = await Booking.create({
    user: req.user.id,
    trek: trekId,
    startDate,
    participants,
    totalAmount,
    displayCurrency: displayCurrency || 'NPR',
    displayAmount: displayAmount || totalAmount,
    conversionRateUsed: conversionRateUsed || 1,
    specialRequirements,
    paymentMethod,
    status: 'Pending',
    paymentStatus: 'Unpaid',
  });

  let paymentResponse = null;

  // Handle Khalti Payment (Always in NPR)
  if (paymentMethod === 'Khalti') {
    try {
      const returnUrl = `${process.env.CLIENT_URL}/payments/verify`;
      
      const khaltiData = await initiateKhaltiPayment(
        booking._id.toString(),
        trek.title,
        totalAmount, // This is always NPR
        returnUrl
      );

      // Save the pidx to booking
      booking.paymentId = khaltiData.pidx;
      await booking.save();

      paymentResponse = {
        payment_url: khaltiData.payment_url,
        pidx: khaltiData.pidx,
      };
    } catch (error) {
      console.error('Khalti Init Error:', error.response?.data || error.message);
      throw new ApiError(500, 'Failed to initialize payment gateway');
    }
  }

  res.status(201).json(
    new ApiResponse(201, 'Booking created successfully', {
      booking,
      payment: paymentResponse,
    })
  );
});

/**
 * @desc    Verify Khalti Payment
 * @route   POST /api/bookings/verify-payment
 * @access  Private
 */
exports.verifyPayment = asyncHandler(async (req, res, next) => {
  const { pidx } = req.body;

  if (!pidx) {
    throw new ApiError(400, 'Payment Index (pidx) is required');
  }

  // Find booking
  const booking = await Booking.findOne({ paymentId: pidx })
    .populate('trek')
    .populate('user');
  if (!booking) {
    throw new ApiError(404, 'Booking not found for this payment request');
  }

  if (booking.paymentStatus === 'Paid') {
    await ensureInvoiceMetadata(booking);
    return res.status(200).json(new ApiResponse(200, 'Payment already verified', booking));
  }

  try {
    // Check status via Khalti lookup
    const response = await axios.post(
      'https://a.khalti.com/api/v2/epayment/lookup/',
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { status, total_amount, transaction_id } = response.data;

    if (status === 'Completed') {
      booking.paymentStatus = 'Paid';
      booking.status = 'Confirmed';
      booking.transactionId = transaction_id || booking.transactionId;
      ensureInvoiceMetadata(booking, { save: false });
      await booking.save();

      // Send confirmation email
      try {
        await sendEmail({
          to: booking.user.email,
          subject: 'Booking Confirmation - Everest Encounter Treks',
          html: `<h1>Booking Confirmed!</h1>
                 <p>Thank you ${booking.user.name}, your payment of Rs. ${total_amount / 100} was successful.</p>
                 <p>You are now booked for <strong>${booking.trek.title}</strong> starting on ${new Date(booking.startDate).toDateString()}.</p>
                 <p>Your invoice reference is <strong>${booking.invoiceNumber}</strong>.</p>`,
        });
      } catch (err) {
        console.error('Email failed but booking confirmed');
      }

      res.status(200).json(new ApiResponse(200, 'Payment verified and booking confirmed', booking));
    } else {
      res.status(400).json(new ApiResponse(400, `Payment status is ${status}`, booking));
    }
  } catch (error) {
    console.error('Khalti Verify Error:', error.response?.data || error.message);
    throw new ApiError(500, 'Payment verification failed at gateway');
  }
});

/**
 * @desc    Get user's logged in bookings
 * @route   GET /api/bookings/me
 * @access  Private
 */
exports.getMyBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate(userBookingPopulate)
    .sort('-createdAt');

  await ensureInvoiceMetadataForMany(bookings);

  res.status(200).json(new ApiResponse(200, 'User bookings fetched', bookings));
});

/**
 * @desc    Cancel booking for the current user
 * @route   PATCH /api/bookings/:id/cancel
 * @access  Private
 */
exports.cancelMyBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.user.toString() !== req.user.id) {
    throw new ApiError(403, 'You are not allowed to cancel this booking.');
  }

  const cancellation = getBookingCancellationEligibility(booking);
  if (!cancellation.canCancel) {
    throw new ApiError(400, cancellation.reason);
  }

  booking.status = 'Cancelled';
  booking.cancelledAt = new Date();
  booking.cancelledBy = 'user';
  ensureInvoiceMetadata(booking, { save: false });
  await booking.save();
  await populateBookingDocument(booking, userBookingPopulate);

  res.status(200).json(new ApiResponse(200, 'Booking cancelled successfully', booking));
});

/**
 * @desc    Get booking invoice PDF
 * @route   GET /api/bookings/:id/invoice
 * @access  Private (owner or admin)
 */
exports.getBookingInvoice = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  const isOwner = booking.user.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You are not allowed to access this invoice.');
  }

  await populateBookingDocument(booking, invoicePopulate);

  if (!isInvoiceEligible(booking)) {
    throw new ApiError(400, 'Invoice is not available for this booking yet.');
  }

  const invoiceBuffer = await generateInvoicePdfBuffer(booking);
  const shouldDownload = `${req.query.download || ''}`.toLowerCase() === 'true';
  const fileName = getInvoiceFileName(booking);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Length', invoiceBuffer.length);
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader(
    'Content-Disposition',
    `${shouldDownload ? 'attachment' : 'inline'}; filename="${fileName}"`
  );

  res.status(200).send(invoiceBuffer);
});

/**
 * @desc    Get all bookings (Admin)
 * @route   GET /api/bookings
 * @access  Private/Admin
 */
exports.getAllBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find()
    .populate(adminBookingPopulate)
    .sort('-createdAt');

  await ensureInvoiceMetadataForMany(bookings);

  res.status(200).json(new ApiResponse(200, 'All bookings fetched', bookings));
});

/**
 * @desc    Update booking status (Admin)
 * @route   PUT /api/bookings/:id
 * @access  Private/Admin
 */
exports.updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { status, paymentStatus } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;

  if (booking.paymentStatus === 'Refunded' && !status) {
    booking.status = 'Cancelled';
  }

  if (booking.status === 'Cancelled') {
    booking.cancelledAt = booking.cancelledAt || new Date();
    booking.cancelledBy = booking.cancelledBy || 'admin';
  } else {
    booking.cancelledAt = undefined;
    booking.cancelledBy = undefined;
  }

  ensureInvoiceMetadata(booking, { save: false });

  await booking.save();

  res.status(200).json(new ApiResponse(200, 'Booking updated successfully', booking));
});

/**
 * @desc    Delete booking
 * @route   DELETE /api/bookings/:id
 * @access  Private/Admin
 */
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  await booking.deleteOne();

  res.status(200).json(new ApiResponse(200, 'Booking deleted successfully', {}));
});
