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

const app = express()

app.use(cors({ origin: env.clientOrigin, credentials: true }))
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use('/uploads', express.static(path.resolve('server/uploads')))

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/auth', authRoutes)
app.use('/regions', regionRoutes)
app.use('/treks', trekRoutes)
app.use('/bookings', bookingRoutes)
app.use('/reviews', reviewRoutes)
app.use('/inquiries', inquiryRoutes)
app.use('/gallery', galleryRoutes)
app.use('/hero', heroRoutes)

app.use('/admin/regions', adminRegionRoutes)
app.use('/admin/treks', adminTrekRoutes)
app.use('/admin/bookings', adminBookingRoutes)
app.use('/admin/reviews', adminReviewRoutes)
app.use('/admin/inquiries', adminInquiryRoutes)
app.use('/admin/gallery', adminGalleryRoutes)
app.use('/admin/hero', adminHeroRoutes)

// API aliases for production-ready endpoints
app.use('/api/treks', trekRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/hero', heroRoutes)
app.use('/api/admin/treks', adminTrekRoutes)
app.use('/api/admin/bookings', adminBookingRoutes)
app.use('/api/admin/gallery', adminGalleryRoutes)
app.use('/api/admin/hero', adminHeroRoutes)

app.use(errorMiddleware)

export default app
