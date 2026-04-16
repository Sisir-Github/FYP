import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import path from 'path'
import env from './config/env.js'
import errorMiddleware from './middleware/errorMiddleware.js'
import authRoutes from './modules/auth/auth.routes.js'
import {
  regionRoutes,
  adminRegionRoutes,
} from './modules/regions/region.routes.js'
import {
  trekRoutes,
  adminTrekRoutes,
} from './modules/treks/trek.routes.js'
import {
  bookingRoutes,
  adminBookingRoutes,
} from './modules/bookings/booking.routes.js'
import {
  paymentRoutes,
  adminPaymentRoutes,
} from './modules/payments/payment.routes.js'
import { reviewRoutes, adminReviewRoutes } from './modules/reviews/review.routes.js'
import {
  inquiryRoutes,
  adminInquiryRoutes,
} from './modules/inquiries/inquiry.routes.js'
import {
  galleryRoutes,
  adminGalleryRoutes,
} from './modules/gallery/gallery.routes.js'
import { heroRoutes, adminHeroRoutes } from './modules/hero/hero.routes.js'
import { userRoutes, adminUserRoutes } from './modules/users/user.routes.js'
import { chatRoutes, adminChatRoutes } from './modules/chat/chat.routes.js'

const app = express()

app.use(cors({ 
  origin: true,
  credentials: true 
}))
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use('/uploads', express.static(path.resolve('server/uploads')))

app.get('/health', (req, res) => res.json({ status: 'ok' }))
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use('/auth', authRoutes)
app.use('/regions', regionRoutes)
app.use('/treks', trekRoutes)
app.use('/bookings', bookingRoutes)
app.use('/payments', paymentRoutes)
app.use('/reviews', reviewRoutes)
app.use('/inquiries', inquiryRoutes)
app.use('/gallery', galleryRoutes)
app.use('/hero', heroRoutes)
app.use('/users', userRoutes)
app.use('/chat', chatRoutes)

app.use('/admin/regions', adminRegionRoutes)
app.use('/admin/treks', adminTrekRoutes)
app.use('/admin/bookings', adminBookingRoutes)
app.use('/admin/payments', adminPaymentRoutes)
app.use('/admin/reviews', adminReviewRoutes)
app.use('/admin/inquiries', adminInquiryRoutes)
app.use('/admin/gallery', adminGalleryRoutes)
app.use('/admin/hero', adminHeroRoutes)
app.use('/admin/users', adminUserRoutes)
app.use('/admin/chat', adminChatRoutes)

// API aliases for production-ready endpoints
app.use('/api/treks', trekRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/hero', heroRoutes)
app.use('/api/regions', regionRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/users', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/admin/treks', adminTrekRoutes)
app.use('/api/admin/bookings', adminBookingRoutes)
app.use('/api/admin/payments', adminPaymentRoutes)
app.use('/api/admin/gallery', adminGalleryRoutes)
app.use('/api/admin/hero', adminHeroRoutes)
app.use('/api/admin/regions', adminRegionRoutes)
app.use('/api/admin/inquiries', adminInquiryRoutes)
app.use('/api/admin/users', adminUserRoutes)
app.use('/api/admin/chat', adminChatRoutes)

app.use(errorMiddleware)

export default app
