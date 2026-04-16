import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import Stepper from '../components/Stepper.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

function PaymentSuccess() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const bookingId = params.get('bookingId')
  const pidx = params.get('pidx')
  const transactionId = params.get('transaction_id')
  const amount = params.get('amount')

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/user/bookings')
    }, 3000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="container-shell py-12">
      <Stepper
        steps={[t('stepBooking'), t('stepPayment'), t('stepConfirmation')]}
        current={2}
      />
      <div className="mt-6 card-surface p-8 text-center">
        <h1 className="font-display text-3xl text-ink">
          {t('paymentSuccessTitle') || 'Payment Successful'}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Your booking is confirmed. A receipt is available in My Bookings.
        </p>
        <div className="mt-5 grid gap-2 rounded-2xl bg-slate-50 p-4 text-left text-sm text-slate-700 md:grid-cols-2">
          <div><span className="font-semibold text-ink">Booking ID:</span> {bookingId || '-'}</div>
          <div><span className="font-semibold text-ink">Pidx:</span> {pidx || '-'}</div>
          <div><span className="font-semibold text-ink">Transaction ID:</span> {transactionId || '-'}</div>
          <div><span className="font-semibold text-ink">Paid Amount:</span> NPR {amount ? Number(amount) / 100 : '-'}</div>
        </div>
        <p className="mt-4 text-xs tracking-wider text-slate-400">Redirecting to your bookings...</p>
        <Link
          to="/user/bookings"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          {t('paymentGoBookings') || 'Go to Bookings Now'}
        </Link>
      </div>
    </div>
  )
}

export default PaymentSuccess
