import axios from 'axios'
import env from '../../config/env.js'
import * as paymentService from './payment.service.js'
import Booking from '../bookings/booking.model.js'
import Payment from './payment.model.js'
import { sendEmail } from '../../utils/email.js'

const buildClientRedirect = (path, params = {}) => {
  const search = new URLSearchParams(params).toString()
  return `${env.clientOrigin}${path}${search ? `?${search}` : ''}`
}

const resolveKhaltiPaymentUrl = (paymentUrl, pidx) => {
  const isDev = env.khaltiApiUrl.includes('dev.khalti.com')
  const sandboxBase = 'https://test-pay.khalti.com'
  const productionBase = 'https://pay.khalti.com'

  if (!paymentUrl && pidx) {
    return `${isDev ? sandboxBase : productionBase}/?pidx=${pidx}`
  }
  if (!paymentUrl) return paymentUrl

  if (isDev && paymentUrl.includes('pay.khalti.com')) {
    return paymentUrl.replace('https://pay.khalti.com', sandboxBase)
  }

  if (!isDev && paymentUrl.includes('test-pay.khalti.com')) {
    return paymentUrl.replace('https://test-pay.khalti.com', productionBase)
  }

  return paymentUrl
}

export const initiateKhaltiPayment = async (req, res, next) => {
  try {
    const payload = { ...req.body }
    const bookingId = payload.bookingId || payload.booking
    const booking = await Booking.findById(bookingId)
      .populate('trek', 'name price')
      .populate('user', 'name email isEmailVerified')
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }
    if (booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    if (!booking.user.isEmailVerified) {
      return res.status(403).json({ message: 'Please verify your email before paying.' })
    }
    if (booking.paymentStatus === 'PAID') {
      return res.status(400).json({ message: 'Booking is already paid.' })
    }

    const amount = Number(payload.amount || Math.round(Number(booking.totalAmount || 0) * 0.1) || 0)
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' })
    }

    const amountInPaisa = Math.round(amount * 100)
    const purchaseOrderId = booking._id.toString()

    try {
      const khaltiResponse = await axios.post(
        `${env.khaltiApiUrl}/epayment/initiate/`,
        {
          return_url: `${env.serverOrigin}/api/payments/khalti/callback`,
          website_url: env.clientOrigin,
          amount: amountInPaisa,
          purchase_order_id: purchaseOrderId,
          purchase_order_name: booking.trekNameSnapshot || booking.trek?.name || 'Trek Booking',
          customer_info: {
            name: req.user.name || booking.user.name || 'User',
            email: req.user.email || booking.user.email || 'user@example.com',
            phone: booking.contactPhone || '9800000000',
          },
        },
        {
          headers: {
            Authorization: `Key ${env.khaltiSecretKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      await Payment.create({
        booking: booking._id,
        user: req.user.id,
        amount,
        method: 'KHALTI',
        status: 'PENDING',
        pidx: khaltiResponse.data.pidx,
        purchaseOrderId,
      })

      booking.paymentStatus = 'PROCESSING'
      booking.paymentProvider = 'khalti'
      await booking.save()

      const resolvedPaymentUrl = resolveKhaltiPaymentUrl(
        khaltiResponse.data.payment_url,
        khaltiResponse.data.pidx,
      )

      return res.json({
        url: resolvedPaymentUrl,
        pidx: khaltiResponse.data.pidx,
        expiresAt: khaltiResponse.data.expires_at,
      })

    } catch (kError) {
      console.error('Khalti Initiate Error:', kError.response?.data || kError.message)
      return res.status(500).json({
        message: 'Error initiating Khalti payment',
        details: kError.response?.data || kError.message,
      })
    }
  } catch (error) {
    return next(error)
  }
}

export const khaltiCallback = async (req, res, next) => {
  try {
    const { pidx, transaction_id, amount, status, purchase_order_id } = req.query

    if (status === 'Completed' && pidx) {
      try {
        const lookupRes = await axios.post(
          `${env.khaltiApiUrl}/epayment/lookup/`,
          { pidx },
          {
            headers: {
              Authorization: `Key ${env.khaltiSecretKey}`,
              'Content-Type': 'application/json',
            },
          }
        )

        if (lookupRes.data.status === 'Completed') {
          const resolvedTransactionId = lookupRes.data.transaction_id || transaction_id || ''
          const resolvedAmount = Number(lookupRes.data.total_amount || Number(amount || 0)) / 100

          await Payment.findOneAndUpdate(
            { pidx },
            {
              status: 'SUCCESS',
              transactionId: resolvedTransactionId,
              purchaseOrderId: purchase_order_id,
            },
          )

          const updatedBooking = await Booking.findByIdAndUpdate(
            purchase_order_id,
            {
              paymentStatus: 'PAID',
              paymentProvider: 'khalti',
              paymentStatusUpdatedAt: new Date(),
              transactionId: resolvedTransactionId,
              paidAt: new Date(),
              status: 'CONFIRMED',
            },
            { new: true },
          ).populate('user', 'email name').populate('trek', 'name')

          if (updatedBooking?.user?.email) {
            await sendEmail({
              to: updatedBooking.user.email,
              subject: 'Payment Successful - Booking Confirmed',
              html: `<h2>Thank you ${updatedBooking.user.name}!</h2><p>Your payment of NPR ${resolvedAmount} was successful. Your trek booking is now confirmed.</p>`,
            }).catch((err) => console.error('Email send failed:', err))
          }

          const adminEmail = process.env.ADMIN_EMAIL || 'admin@everestencounter.com'
          await sendEmail({
            to: adminEmail,
            subject: 'New Khalti Payment Received!',
            html: `
              <h2>Payment Confirmation</h2>
              <p>A new payment of NPR ${resolvedAmount} was completed.</p>
              <p><b>User:</b> ${updatedBooking?.user?.name} (${updatedBooking?.user?.email})</p>
              <p><b>Transaction ID:</b> ${resolvedTransactionId}</p>
            `,
          }).catch((err) => console.error('Admin Email send failed:', err))

          return res.redirect(
            buildClientRedirect('/payment/success', {
              bookingId: purchase_order_id,
              pidx,
              transaction_id: resolvedTransactionId,
              amount: lookupRes.data.total_amount || amount,
            }),
          )
        }
      } catch (lookupErr) {
        console.error('Khalti Lookup Error:', lookupErr.response?.data || lookupErr.message)
      }
    }

    await Payment.findOneAndUpdate({ pidx }, { status: 'FAILED' })
    if (purchase_order_id) {
      await Booking.findByIdAndUpdate(purchase_order_id, {
        paymentStatus: 'FAILED',
        paymentProvider: 'khalti',
      })
    }

    return res.redirect(
      buildClientRedirect('/payment/cancel', {
        bookingId: purchase_order_id || '',
        pidx: pidx || '',
      }),
    )
  } catch (error) {
    return next(error)
  }
}

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
