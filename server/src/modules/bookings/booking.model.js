import mongoose from 'mongoose'

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trek: { type: mongoose.Schema.Types.ObjectId, ref: 'Trek_Package', required: true },
    trekNameSnapshot: { type: String, default: '' },
    startDate: { type: Date, required: true },
    groupSize: { type: Number, default: 1 },
    contactName: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    totalAmount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PROCESSING', 'PAID', 'FAILED'],
      default: 'UNPAID',
    },
    paymentProvider: { type: String, default: '' },
    transactionId: { type: String, default: '' },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true },
)

const Booking = mongoose.model('Booking', BookingSchema)

export default Booking
