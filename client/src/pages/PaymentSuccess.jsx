import { Link } from 'react-router-dom'
import Stepper from '../components/Stepper.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

function PaymentSuccess() {
  const { t } = useLanguage()

  return (
    <div className="container-shell py-12">
      <Stepper
        steps={[t('stepBooking'), t('stepPayment'), t('stepConfirmation')]}
        current={2}
      />
      <div className="mt-6 card-surface p-8 text-center">
        <h1 className="font-display text-3xl text-ink">
          {t('paymentSuccessTitle')}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Your booking is confirmed. A receipt is available in My Bookings.
        </p>
        <Link
          to="/bookings"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          {t('paymentGoBookings')}
        </Link>
      </div>
    </div>
  )
}

export default PaymentSuccess
