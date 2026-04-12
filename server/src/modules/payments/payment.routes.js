import { Router } from 'express'
import { z } from 'zod'
import authMiddleware from '../../middleware/authMiddleware.js'
import roleMiddleware from '../../middleware/roleMiddleware.js'
import {
  createPaymentIntent,
  createCheckoutSession,
  handleWebhook,
  listMyPayments,
  listPayments,
} from './payment.controller.js'

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body)
    next()
  } catch (error) {
    res.status(400).json({ message: 'Validation error', errors: error.errors })
  }
}

const paymentSchema = z.object({
  booking: z.string().min(1).optional(),
  bookingId: z.string().min(1).optional(),
  amount: z.coerce.number().min(1),
  currency: z.string().optional(),
  method: z.enum(['KHALTI', 'ESEWA', 'STRIPE', 'BANK']),
}).refine((data) => data.booking || data.bookingId, {
  message: 'booking or bookingId is required',
})

const paymentRoutes = Router()
const adminPaymentRoutes = Router()

// Stripe webhook (raw body handled in app.js)
paymentRoutes.post('/webhook', handleWebhook)

paymentRoutes.use(authMiddleware)
paymentRoutes.post('/intent', validate(paymentSchema), createPaymentIntent)
paymentRoutes.post(
  '/create-checkout-session',
  validate(paymentSchema),
  createCheckoutSession,
)
paymentRoutes.get('/me', listMyPayments)

adminPaymentRoutes.use(authMiddleware, roleMiddleware('ADMIN'))
adminPaymentRoutes.get('/', listPayments)

export { paymentRoutes, adminPaymentRoutes }
