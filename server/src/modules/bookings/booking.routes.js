import { Router } from 'express'
import { z } from 'zod'
import authMiddleware from '../../middleware/authMiddleware.js'
import roleMiddleware from '../../middleware/roleMiddleware.js'
import {
  createBooking,
  listMyBookings,
  listBookings,
  updateBooking,
  deleteBooking,
  getBooking,
  getInvoice,
  cancelMyBooking,
} from './booking.controller.js'

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body)
    next()
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors })
  }
}

const bookingSchema = z.object({
  trek: z.string().min(1).optional(),
  trekId: z.string().min(1).optional(),
  startDate: z.coerce.date(),
  groupSize: z.coerce.number().min(1).max(20).optional(),
  peopleCount: z.coerce.number().min(1).max(20).optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  notes: z.string().optional(),
  totalAmount: z.coerce.number().optional(),
}).refine((data) => data.trek || data.trekId, {
  message: 'trek or trekId is required',
})

const bookingUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']).optional(),
  paymentStatus: z.string().optional(),
})

const bookingRoutes = Router()
const adminBookingRoutes = Router()

bookingRoutes.use(authMiddleware)
bookingRoutes.post('/', validate(bookingSchema), createBooking)
bookingRoutes.get('/me', listMyBookings)
bookingRoutes.get('/:id/invoice', getInvoice)
bookingRoutes.patch('/:id/cancel', cancelMyBooking)

adminBookingRoutes.use(authMiddleware, roleMiddleware('ADMIN'))
adminBookingRoutes.get('/', listBookings)
adminBookingRoutes.get('/:id', getBooking)
adminBookingRoutes.put('/:id', validate(bookingUpdateSchema), updateBooking)
adminBookingRoutes.delete('/:id', deleteBooking)

export { bookingRoutes, adminBookingRoutes }
