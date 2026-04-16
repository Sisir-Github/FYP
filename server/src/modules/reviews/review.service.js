import Review from './review.model.js'
import Booking from '../bookings/booking.model.js'

export const listReviews = async ({ trekId }) => {
  const query = trekId ? { trek: trekId } : {}
  return Review.find(query).populate('user', 'name').sort({ createdAt: -1 })
}

export const listAdminReviews = async ({ page = 1, limit = 20 }) => {
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    Review.find({})
      .populate('user', 'name email')
      .populate('trek', 'name')
      .skip(skip)
      .limit(Number(limit)),
    Review.countDocuments(),
  ])
  return { items, total, page: Number(page), limit: Number(limit) }
}

export const createReview = async (userId, payload) => {
  const booking = await Booking.findOne({
    _id: payload.booking,
    user: userId,
    trek: payload.trek,
    status: 'COMPLETED',
  })
  if (!booking) {
    const error = new Error('Review requires a completed booking')
    error.status = 400
    throw error
  }
  const existing = await Review.findOne({ booking: booking._id })
  if (existing) {
    const error = new Error('Review already submitted for this booking')
    error.status = 400
    throw error
  }
  return Review.create({ ...payload, user: userId })
}
