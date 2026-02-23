import Trek from '../treks/trek.model.js'
import Booking from '../bookings/booking.model.js'
import Payment from '../payments/payment.model.js'
import Inquiry from '../inquiries/inquiry.model.js'
import User from '../users/user.model.js'
import Review from '../reviews/review.model.js'

const monthLabel = (date) =>
  date.toLocaleString('en-US', { month: 'short' })

const buildMonthlySeries = (monthsBack) => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1)
  const buckets = []
  for (let i = 0; i < monthsBack; i += 1) {
    const cursor = new Date(start.getFullYear(), start.getMonth() + i, 1)
    const key = `${cursor.getFullYear()}-${cursor.getMonth() + 1}`
    buckets.push({
      key,
      label: monthLabel(cursor),
      revenue: 0,
      bookings: 0,
      users: 0,
    })
  }
  return { start, buckets }
}

export const getAdminStats = async (req, res, next) => {
  try {
    const { start, buckets } = buildMonthlySeries(6)
    const [
      trekCount,
      bookingCount,
      inquiryCount,
      userCount,
      paymentCount,
      revenueResult,
      monthlyRevenue,
      monthlyBookings,
      monthlyUsers,
      reviewSummary,
    ] = await Promise.all([
      Trek.countDocuments(),
      Booking.countDocuments(),
      Inquiry.countDocuments(),
      User.countDocuments(),
      Payment.countDocuments(),
      Payment.aggregate([
        { $match: { status: 'SUCCESS' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Payment.aggregate([
        { $match: { status: 'SUCCESS', createdAt: { $gte: start } } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            total: { $sum: '$amount' },
          },
        },
      ]),
      Booking.aggregate([
        { $match: { createdAt: { $gte: start } } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            total: { $sum: 1 },
          },
        },
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: start } } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            total: { $sum: 1 },
          },
        },
      ]),
      Review.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            average: { $avg: '$rating' },
            good: { $sum: { $cond: [{ $gte: ['$rating', 4] }, 1, 0] } },
            bad: { $sum: { $cond: [{ $lt: ['$rating', 4] }, 1, 0] } },
          },
        },
      ]),
    ])
    const revenue = revenueResult?.[0]?.total || 0
    const monthlySeries = buckets.map((bucket) => ({ ...bucket }))
    monthlyRevenue.forEach((entry) => {
      const key = `${entry._id.year}-${entry._id.month}`
      const bucket = monthlySeries.find((item) => item.key === key)
      if (bucket) bucket.revenue = entry.total
    })
    monthlyBookings.forEach((entry) => {
      const key = `${entry._id.year}-${entry._id.month}`
      const bucket = monthlySeries.find((item) => item.key === key)
      if (bucket) bucket.bookings = entry.total
    })
    monthlyUsers.forEach((entry) => {
      const key = `${entry._id.year}-${entry._id.month}`
      const bucket = monthlySeries.find((item) => item.key === key)
      if (bucket) bucket.users = entry.total
    })
    const reviews = reviewSummary?.[0] || {
      total: 0,
      average: 0,
      good: 0,
      bad: 0,
    }
    res.json({
      treks: trekCount,
      bookings: bookingCount,
      inquiries: inquiryCount,
      users: userCount,
      payments: paymentCount,
      revenue,
      reviews,
      monthly: monthlySeries.map(({ key, ...rest }) => rest),
    })
  } catch (error) {
    next(error)
  }
}
