import mongoose from 'mongoose'

const PaymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['KHALTI', 'ESEWA', 'STRIPE', 'BANK'], required: true },
    status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
    providerRef: { type: String, default: '' },
  },
  { timestamps: true },
)

const Payment = mongoose.model('Payment', PaymentSchema)

export default Payment
