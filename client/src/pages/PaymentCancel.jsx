import { Link, useSearchParams } from 'react-router-dom'
import Stepper from '../components/Stepper.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

function PaymentCancel() {
  const [params] = useSearchParams()
  const bookingId = params.get('bookingId')
  const { t } = useLanguage()
  return (
    <div className="container-shell py-12">
      <Stepper
        steps={[t('stepBooking'), t('stepPayment'), t('stepConfirmation')]}
        current={1}
      />
      <div className="mt-6 card-surface p-8 text-center">
        <h1 className="font-display text-3xl text-ink">
          {t('paymentCancelTitle')}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          You can retry payment from your bookings page anytime.
        </p>
        <Link
          to={bookingId ? `/payment/${bookingId}` : '/bookings'}
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          {t('paymentTryAgain')}
        </Link>
      </div>
    </div>
  )
}

export default PaymentCancel
