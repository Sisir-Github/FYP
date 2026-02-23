import Stripe from 'stripe'
import env from '../../config/env.js'
import * as paymentService from './payment.service.js'
import Booking from '../bookings/booking.model.js'
import Payment from './payment.model.js'

const stripe = new Stripe(env.stripeSecret || '', {
  apiVersion: '2024-04-10',
})

export const createPaymentIntent = async (req, res, next) => {
  try {
    const payload = { ...req.body }
    if (payload.bookingId && !payload.booking) payload.booking = payload.bookingId
    const payment = await paymentService.createPaymentIntent(req.user.id, payload)
    res.status(201).json(payment)
  } catch (error) {
    next(error)
  }
}

export const listMyPayments = async (req, res, next) => {
  try {
    const items = await paymentService.listMyPayments(req.user.id)
    res.json(items)
  } catch (error) {
    next(error)
  }
}

export const listPayments = async (req, res, next) => {
  try {
    const result = await paymentService.listPayments(req.query)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const createCheckoutSession = async (req, res, next) => {
  try {
    if (!env.stripeSecret) {
      return res.status(500).json({ message: 'Stripe is not configured' })
    }
    const payload = { ...req.body }
    const bookingId = payload.bookingId || payload.booking
    const booking = await Booking.findById(bookingId).populate('trek', 'name')
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    const amount = Number(payload.amount || booking.totalAmount || 0)
    const currency = (payload.currency || 'usd').toLowerCase()
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' })
    }
    booking.paymentStatus = 'PROCESSING'
    booking.paymentProvider = 'stripe'
    await booking.save()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: booking.trekNameSnapshot || booking.trek?.name || 'Trek',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking._id.toString(),
        trekId: booking.trek?.toString() || '',
        trekName: booking.trekNameSnapshot || booking.trek?.name || '',
        date: booking.startDate?.toISOString?.() || '',
        people: String(booking.groupSize || 1),
        userId: req.user.id,
      },
      success_url: `${env.clientOrigin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.clientOrigin}/payment/cancel?bookingId=${booking._id}`,
    })
    return res.json({ url: session.url })
  } catch (error) {
    return next(error)
  }
}

export const handleWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature']
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      env.stripeWebhookSecret,
    )
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const bookingId = session.metadata?.bookingId
      if (bookingId) {
        const booking = await Booking.findByIdAndUpdate(bookingId, {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          transactionId: session.payment_intent || session.id,
          paidAt: new Date(),
          paymentProvider: 'stripe',
        }, { new: true })
        if (booking) {
          const existing = await Payment.findOne({
            booking: booking._id,
            providerRef: session.payment_intent || session.id,
          })
          if (!existing) {
            await Payment.create({
              booking: booking._id,
              user: booking.user,
              amount: booking.totalAmount || 0,
              method: 'STRIPE',
              status: 'SUCCESS',
              providerRef: session.payment_intent || session.id,
            })
          }
        }
      }
    }
    return res.json({ received: true })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Stripe webhook error', error)
    return res.status(400).send(`Webhook Error: ${error.message}`)
  }
}
