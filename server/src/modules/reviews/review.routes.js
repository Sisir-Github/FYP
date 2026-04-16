import { Router } from 'express'
import { z } from 'zod'
import authMiddleware from '../../middleware/authMiddleware.js'
import roleMiddleware from '../../middleware/roleMiddleware.js'
import { listReviews, listAdminReviews, createReview } from './review.controller.js'

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body)
    next()
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors })
  }
}

const reviewSchema = z.object({
  trek: z.string().min(1).optional(),
  trekId: z.string().min(1).optional(),
  booking: z.string().min(1).optional(),
  bookingId: z.string().min(1).optional(),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().optional(),
}).refine((data) => data.trek || data.trekId, {
  message: 'trek or trekId is required',
}).refine((data) => data.booking || data.bookingId, {
  message: 'booking or bookingId is required',
})

const reviewRoutes = Router()
const adminReviewRoutes = Router()

reviewRoutes.get('/', listReviews)
reviewRoutes.post('/', authMiddleware, validate(reviewSchema), createReview)

adminReviewRoutes.use(authMiddleware, roleMiddleware('ADMIN'))
adminReviewRoutes.get('/', listAdminReviews)

export { reviewRoutes, adminReviewRoutes }
