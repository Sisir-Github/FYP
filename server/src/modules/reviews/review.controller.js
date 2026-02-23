import * as reviewService from './review.service.js'

export const listReviews = async (req, res, next) => {
  try {
    const items = await reviewService.listReviews(req.query)
    res.json(items)
  } catch (error) {
    next(error)
  }
}

export const listAdminReviews = async (req, res, next) => {
  try {
    const result = await reviewService.listAdminReviews(req.query)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const createReview = async (req, res, next) => {
  try {
    const payload = { ...req.body }
    if (payload.trekId && !payload.trek) payload.trek = payload.trekId
    if (payload.bookingId && !payload.booking) payload.booking = payload.bookingId
    const review = await reviewService.createReview(req.user.id, payload)
    res.status(201).json(review)
  } catch (error) {
    next(error)
  }
}
