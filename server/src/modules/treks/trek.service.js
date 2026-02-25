import Trek from './trek.model.js'
import Booking from '../bookings/booking.model.js'

export const listTreks = async ({
  page = 1,
  limit = 12,
  search = '',
  region,
  difficulty,
  bestSeason,
  minDays,
  maxDays,
  priceMin,
  priceMax,
}) => {
  const query = { isActive: true }
  if (search) {
    query.name = { $regex: search, $options: 'i' }
  }
  if (region) {
    query.region = region
  }
  if (difficulty) {
    query.difficulty = difficulty
  }
  if (bestSeason) {
    query.bestSeason = { $regex: bestSeason, $options: 'i' }
  }
  if (minDays || maxDays) {
    query.days = {}
    if (minDays) query.days.$gte = Number(minDays)
    if (maxDays) query.days.$lte = Number(maxDays)
  }
  if (priceMin || priceMax) {
    query.price = {}
    if (priceMin) query.price.$gte = Number(priceMin)
    if (priceMax) query.price.$lte = Number(priceMax)
  }
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    Trek.find(query).populate('region').skip(skip).limit(Number(limit)),
    Trek.countDocuments(query),
  ])
  return { items, total, page: Number(page), limit: Number(limit) }
}

export const getTrekById = async (id) =>
  Trek.findById(id).populate('region')

const buildDateKey = (date) => date.toISOString().slice(0, 10)

export const getTrekAvailability = async (id) => {
  const trek = await Trek.findById(id)
  if (!trek) {
    const error = new Error('Trek not found')
    error.status = 404
    throw error
  }
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const days = 60
  const end = new Date(start)
  end.setDate(end.getDate() + days)
  const bookings = await Booking.find({
    trek: trek._id,
    startDate: { $gte: start, $lte: end },
    status: { $ne: 'CANCELLED' },
  }).select('startDate groupSize')
  const bookedByDate = bookings.reduce((acc, booking) => {
    const key = buildDateKey(booking.startDate)
    acc[key] = (acc[key] || 0) + (booking.groupSize || 1)
    return acc
  }, {})
  const availability = []
  for (let i = 0; i < days; i += 1) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    const key = buildDateKey(date)
    const booked = bookedByDate[key] || 0
    const remaining = Math.max((trek.maxGroupSize || 12) - booked, 0)
    const month = date.getMonth() + 1
    const isPeakSeason = [3, 4, 5, 9, 10, 11].includes(month)
    availability.push({
      date: key,
      remaining,
      status: remaining === 0 ? 'FULL' : remaining <= 4 ? 'LIMITED' : 'OPEN',
      season: isPeakSeason ? 'PEAK' : 'OFF',
    })
  }
  return {
    trekId: trek._id,
    maxGroupSize: trek.maxGroupSize || 12,
    availability,
  }
}

export const createTrek = async (payload) => Trek.create(payload)

export const updateTrek = async (id, payload) =>
  Trek.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

export const deleteTrek = async (id) => Trek.findByIdAndDelete(id)
