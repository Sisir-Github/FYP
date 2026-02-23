import { useGetMyBookingsQuery } from '../../api/bookingApi.js'
import { useNavigate } from 'react-router-dom'
import { useCurrency } from '../../contexts/CurrencyContext.jsx'
import { useLanguage } from '../../contexts/LanguageContext.jsx'
import Loader from '../../components/Loader.jsx'

function MyBookings() {
  const { data, isLoading, error } = useGetMyBookingsQuery()
  const { format } = useCurrency()
  const { t } = useLanguage()
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const navigate = useNavigate()
  const bookings = data?.data || data || []

  return (
    <div className="container-shell py-12">
      <h1 className="font-display text-3xl text-ink">{t('myBookingsTitle')}</h1>
      <p className="mt-2 text-sm text-slate-600">
        {t('myBookingsSubtitle')}
      </p>
      {isLoading ? (
        <Loader label={t('bookingLoading')} />
      ) : error ? (
        <div className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
          {t('bookingLoadError')}
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {bookings.length === 0 && (
            <p className="text-sm text-slate-600">
              {t('bookingEmpty')}
            </p>
          )}
          {bookings.map((booking) => {
            const amount =
              booking.totalAmount || booking.trek?.price || booking.price || 0
            return (
              <div
                key={booking.id || booking._id}
                className="card-surface flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-ink">
                    {booking.trekName || booking.trek?.name || 'Trek itinerary'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {t('bookingStartDate')}: {booking.startDate || 'TBD'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {t('bookingAmount')}: {format(amount)}
                  </p>
                  <p className="text-sm text-slate-500">
                    {t('bookingPayment')}: {booking.paymentStatus || 'UNPAID'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                    {booking.status || t('bookingPending')}
                  </span>
                  <a
                    href={`${apiBase}/bookings/${booking._id}/invoice`}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                  >
                    {t('bookingInvoice')}
                  </a>
                  {booking.paymentStatus !== 'PAID' && (
                    <button
                      type="button"
                      onClick={() => navigate(`/payment/${booking._id}`)}
                      className="rounded-full border border-blue-200 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-700 hover:text-white"
                    >
                      {t('payNow')}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyBookings
