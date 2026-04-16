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

export const updateBooking = async (id, payload) => {
  const update = { ...payload }
  if (update.status === 'CANCELLED') {
    update.cancelledAt = new Date()
  } else if (update.status && update.status !== 'CANCELLED') {
    update.cancelledAt = undefined
  }
  return Booking.findByIdAndUpdate(id, update, { new: true, runValidators: true })
}

export const deleteBooking = async (id) =>
  Booking.findByIdAndDelete(id)

export const getBookingById = async (id) =>
  Booking.findById(id).populate('user').populate('trek')

export const cancelMyBooking = async (userId, bookingId) => {
  const booking = await Booking.findById(bookingId)
  if (!booking) {
    const error = new Error('Booking not found')
    error.status = 404
    throw error
  }

  if (booking.user.toString() !== userId) {
    const error = new Error('Forbidden')
    error.status = 403
    throw error
  }

  if (booking.paymentStatus !== 'UNPAID') {
    const error = new Error('Only unpaid bookings can be cancelled')
    error.status = 400
    throw error
  }

  booking.status = 'CANCELLED'
  booking.cancelledAt = new Date()
  await booking.save()
  return booking
}
