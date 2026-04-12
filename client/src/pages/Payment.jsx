import { useParams, useNavigate } from 'react-router-dom'
import { useGetMyBookingsQuery } from '../api/bookingApi.js'
import { useCreateCheckoutSessionMutation } from '../api/paymentApi.js'
import Stepper from '../components/Stepper.jsx'
import Loader from '../components/Loader.jsx'
import { useToast } from '../contexts/ToastContext.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

function Payment() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useGetMyBookingsQuery()
  const [createCheckout, { isLoading: processing }] =
    useCreateCheckoutSessionMutation()
  const { pushToast } = useToast()
  const { t } = useLanguage()
  const bookings = data?.data || data || []
  const booking = bookings.find((item) => item._id === bookingId)

  const handlePay = async () => {
    if (!booking) return
    try {
      const response = await createCheckout({
        bookingId,
        amount: booking.totalAmount,
        currency: 'usd',
        method: 'STRIPE',
      }).unwrap()
      window.location.href = response.url
    } catch {
      pushToast({ type: 'error', message: t('paymentTryAgain') })
    }
  }

  if (isLoading) return <Loader label={t('paymentLoading')} />

  if (!booking) {
    return (
      <div className="container-shell py-12">
        <p className="text-sm text-slate-600">{t('paymentNotFound')}</p>
      </div>
    )
  }

  return (
    <div className="container-shell py-12">
      <Stepper
        steps={[t('stepBooking'), t('stepPayment'), t('stepConfirmation')]}
        current={1}
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card-surface p-6">
          <h1 className="font-display text-3xl text-ink">{t('paymentTitle')}</h1>
          <p className="mt-2 text-sm text-slate-600">
            {t('paymentSubtitle')}
          </p>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Trek</span>
              <strong>{booking.trekNameSnapshot || booking.trek?.name}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>{t('paymentPeople')}</span>
              <strong>{booking.groupSize || 1}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>{t('paymentPricePerPerson')}</span>
              <strong>USD {booking.totalAmount / (booking.groupSize || 1)}</strong>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span>{t('paymentTotal')}</span>
              <strong>USD {booking.totalAmount}</strong>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-xs text-blue-700">
              {t('paymentStatus')}: {booking.paymentStatus || 'UNPAID'}
            </div>
          </div>
          <button
            type="button"
            onClick={handlePay}
            className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            disabled={processing}
          >
            {processing ? t('paymentProcessing') : t('paymentPayNow')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/bookings')}
            className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600"
          >
            {t('paymentBack')}
          </button>
        </div>
        <div className="card-surface p-6">
          <h2 className="font-display text-2xl text-ink">
            {t('paymentDetails')}
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>- Stripe checkout with secure card payments</li>
            <li>- Booking status updates automatically after payment</li>
            <li>- Receipt available in My Bookings</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Payment
