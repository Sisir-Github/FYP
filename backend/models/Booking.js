const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    trek: {
      type: mongoose.Schema.ObjectId,
      ref: 'Trek',
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    participants: {
      type: Number,
      required: [true, 'Please provide number of participants'],
      min: [1, 'Must have at least 1 participant'],
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    displayCurrency: {
      type: String,
      default: 'NPR',
    },
    displayAmount: {
      type: Number,
    },
    conversionRateUsed: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Paid', 'Refunded'],
      default: 'Unpaid',
    },
    paymentMethod: {
      type: String,
      enum: ['Khalti', 'Cash', 'Bank Transfer'],
      default: 'Khalti',
    },
    paymentId: {
      type: String, // Khalti pidx or other reference
    },
    specialRequirements: {
      type: String,
      maxlength: 500,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', BookingSchema);
