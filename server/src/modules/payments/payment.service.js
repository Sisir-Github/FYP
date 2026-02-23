import Payment from './payment.model.js'
import Booking from '../bookings/booking.model.js'

export const createPaymentIntent = async (userId, payload) => {
  const bookingId = payload.booking || payload.bookingId
  const booking = bookingId ? await Booking.findById(bookingId) : null
  if (!booking) {
    const error = new Error('Booking not found')
    error.status = 404
    throw error
  }
  const amount =
    Number(payload.amount) || Number(booking.totalAmount) || 0
  if (!amount) {
    const error = new Error('Payment amount is required')
    error.status = 400
    throw error
  }
  const method =
    typeof payload.method === 'string'
      ? payload.method.toUpperCase()
      : payload.method
  if (!method) {
    const error = new Error('Payment method is required')
    error.status = 400
    throw error
  }
  const payment = await Payment.create({
    booking: booking._id,
    user: userId,
    amount,
    method,
    status: 'SUCCESS',
    providerRef: `SIM-${String(method).toUpperCase()}-${Date.now()}`,
  })
  booking.paymentStatus = 'PAID'
  await booking.save()
  return payment
}

export const listMyPayments = async (userId) =>
  Payment.find({ user: userId }).populate('booking').sort({ createdAt: -1 })

export const listPayments = async ({ page = 1, limit = 20 }) => {
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    Payment.find({})
      .populate('user', 'name email')
      .populate('booking', 'status')
      .skip(skip)
      .limit(Number(limit)),
    Payment.countDocuments(),
  ])
  return { items, total, page: Number(page), limit: Number(limit) }
}
