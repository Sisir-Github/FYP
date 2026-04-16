const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.ObjectId,
      ref: 'Booking',
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    pidx: {
      type: String, // Khalti specific payment index
      unique: true,
      sparse: true,
    },
    transactionId: {
      type: String, // Khalti successful transaction id or bank string
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Khalti', 'Cash', 'Bank Transfer'],
      default: 'Khalti',
    },
    status: {
      type: String,
      enum: ['Pending', 'Initiated', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', PaymentSchema);
