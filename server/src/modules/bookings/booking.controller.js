import * as bookingService from './booking.service.js'
import Booking from './booking.model.js'
import Payment from '../payments/payment.model.js'

export const createBooking = async (req, res, next) => {
  try {
    const payload = { ...req.body }
    if (payload.trekId && !payload.trek) payload.trek = payload.trekId
    if (payload.peopleCount && !payload.groupSize) {
      payload.groupSize = payload.peopleCount
    }
    const booking = await bookingService.createBooking(req.user.id, payload)
    res.status(201).json({
      booking,
      confirmationEmailQueued: true,
      invoiceUrl: `/bookings/${booking._id}/invoice`,
    })
  } catch (error) {
    next(error)
  }
}

export const listMyBookings = async (req, res, next) => {
  try {
    const items = await bookingService.listMyBookings(req.user.id)
    res.json(items)
  } catch (error) {
    next(error)
  }
}

export const listBookings = async (req, res, next) => {
  try {
    const result = await bookingService.listBookings(req.query)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const updateBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.updateBooking(req.params.id, req.body)
    if (booking?.paymentStatus === 'PAID') {
      const existing = await Payment.findOne({ booking: booking._id })
      if (!existing) {
        await Payment.create({
          booking: booking._id,
          user: booking.user,
          amount: booking.totalAmount || 0,
          method: 'STRIPE',
          status: 'SUCCESS',
          providerRef: booking.transactionId || `MANUAL-${Date.now()}`,
        })
      }
    }
    res.json(booking)
  } catch (error) {
    next(error)
  }
}

export const getInvoice = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('trek', 'name price')
      .populate('user', 'name email')
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }
    const isOwner = booking.user?._id?.toString() === req.user.id
    const isAdmin = req.user.role === 'ADMIN'
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    const invoiceHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Everest Encounter Invoice</title>
    <style>
      body { font-family: Arial, sans-serif; color: #0a1a33; padding: 32px; }
      h1 { font-size: 24px; margin-bottom: 8px; }
      .muted { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; }
      .card { border: 1px solid #dbeafe; border-radius: 12px; padding: 16px; margin-top: 16px; }
      .row { display: flex; justify-content: space-between; margin: 8px 0; }
    </style>
  </head>
  <body>
    <h1>Payment Receipt</h1>
    <div class="muted">Everest Encounter Treks & Expedition Pvt. Ltd.</div>
    <div class="card">
      <div class="row"><span>Traveler</span><strong>${booking.user?.name || 'Traveler'}</strong></div>
      <div class="row"><span>Email</span><strong>${booking.user?.email || ''}</strong></div>
      <div class="row"><span>Trek</span><strong>${booking.trek?.name || 'Trek'}</strong></div>
      <div class="row"><span>Start Date</span><strong>${booking.startDate?.toISOString?.().slice(0, 10) || ''}</strong></div>
      <div class="row"><span>Group Size</span><strong>${booking.groupSize || 1}</strong></div>
      <div class="row"><span>Status</span><strong>${booking.status}</strong></div>
      <div class="row"><span>Payment</span><strong>${booking.paymentStatus || 'UNPAID'}</strong></div>
      <div class="row"><span>Total</span><strong>USD ${booking.totalAmount || 0}</strong></div>
    </div>
  </body>
</html>`
    res.setHeader('Content-Type', 'text/html')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="invoice-${booking._id}.html"`,
    )
    return res.send(invoiceHtml)
  } catch (error) {
    return next(error)
  }
}
