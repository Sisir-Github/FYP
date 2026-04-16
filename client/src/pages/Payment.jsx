import { useParams, useNavigate } from 'react-router-dom'
import { useGetMyBookingsQuery } from '../api/bookingApi.js'
import { useInitiateKhaltiPaymentMutation } from '../api/paymentApi.js'
import Stepper from '../components/Stepper.jsx'
import Loader from '../components/Loader.jsx'
import { useToast } from '../contexts/ToastContext.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

function Payment() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useGetMyBookingsQuery()
  const [initiateKhalti, { isLoading: processing }] =
    useInitiateKhaltiPaymentMutation()
  const { pushToast } = useToast()
  const { t } = useLanguage()
  const bookings = data?.data || data || []
  const booking = bookings.find((item) => item._id === bookingId)

  const handlePay = async () => {
    if (!booking) return
    try {
      const depositAmount = Math.round(booking.totalAmount * 0.1) // 10% deposit
      const response = await initiateKhalti({
        bookingId,
        amount: depositAmount,
        method: 'KHALTI',
      }).unwrap()
      window.location.href = response.url
    } catch (error) {
      pushToast({
        type: 'error',
        message:
          error?.data?.message ||
          error?.data?.details?.detail ||
          t('paymentTryAgain'),
      })
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
              <strong>NPR {booking.totalAmount / (booking.groupSize || 1)}</strong>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span>{t('paymentTotal')}</span>
              <span className="text-slate-500 line-through">NPR {booking.totalAmount}</span>
            </div>
            <div className="flex items-center justify-between font-bold text-lg text-ink">
              <span>Deposit to Pay (10%)</span>
              <strong>NPR {Math.round(booking.totalAmount * 0.1)}</strong>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-xs text-blue-700">
              {t('paymentStatus')}: {booking.paymentStatus || 'UNPAID'}
            </div>
          </div>
          <button
            type="button"
            onClick={handlePay}
            className="mt-6 w-full rounded-xl bg-purple-700 hover:bg-purple-800 px-4 py-3 text-sm font-semibold text-white shadow-md transition-colors"
            disabled={processing}
          >
            {processing ? t('paymentProcessing') : 'Pay with Khalti'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/user/bookings')}
            className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {t('paymentBack')}
          </button>
        </div>
        <div className="card-surface p-6">
          <h2 className="font-display text-2xl text-ink">
            Payment Security
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li className="flex items-center"><span className="mr-2">✓</span> Payment is smoothly processed via standard Khalti secure gateway.</li>
            <li className="flex items-center"><span className="mr-2">✓</span> Booking status updates automatically on successful transactions.</li>
            <li className="flex items-center"><span className="mr-2">✓</span> You will receive your receipt under My Bookings dashboard.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Payment
