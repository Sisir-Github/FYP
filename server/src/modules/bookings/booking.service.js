import Booking from './booking.model.js'
import Trek from '../treks/trek.model.js'

export const createBooking = async (userId, payload) => {
  const trekId = payload.trek || payload.trekId
  const trek = trekId ? await Trek.findById(trekId) : null
  const groupSize = Number(payload.groupSize || 1)
  const basePrice = trek?.price ? Number(trek.price) : 0
  const totalAmount =
    payload.totalAmount ?? (basePrice ? basePrice * groupSize : 0)
  return Booking.create({
    ...payload,
    user: userId,
    totalAmount,
    trekNameSnapshot: trek?.name || payload.trekNameSnapshot || '',
    paymentStatus: 'UNPAID',
  })
}

export const listMyBookings = async (userId) =>
  Booking.find({ user: userId }).populate('trek').sort({ createdAt: -1 })

export const listBookings = async ({
  page = 1,
  limit = 20,
  status,
  paymentStatus,
  startDateFrom,
  startDateTo,
  trekId,
}) => {
  const query = {}
  if (status) query.status = status
  if (paymentStatus) query.paymentStatus = paymentStatus
  if (trekId) query.trek = trekId
  if (startDateFrom || startDateTo) {
    query.startDate = {}
    if (startDateFrom) query.startDate.$gte = new Date(startDateFrom)
    if (startDateTo) query.startDate.$lte = new Date(startDateTo)
  }
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    Booking.find(query)
      .populate('user', 'name email')
      .populate('trek', 'name')
      .skip(skip)
      .limit(Number(limit)),
    Booking.countDocuments(query),
  ])
  return { items, total, page: Number(page), limit: Number(limit) }
}

export const updateBooking = async (id, payload) =>
  Booking.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
