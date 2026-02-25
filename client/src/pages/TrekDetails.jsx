import { useParams, Link, useNavigate } from 'react-router-dom'
import { useGetTrekByIdQuery, useGetTrekAvailabilityQuery, useSubmitInquiryMutation } from '../api/trekApi.js'
import { useCreateBookingMutation } from '../api/bookingApi.js'
import { useGetReviewsQuery } from '../api/reviewApi.js'
import Loader from '../components/Loader.jsx'
import { useMemo, useState } from 'react'
const trekFallbacks = {
  hero: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
  map: 'https://images.unsplash.com/photo-1456428199391-a3b1cb5e93ab?auto=format&fit=crop&w=1200&q=80',
  elevation:
    'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1200&q=80',
}
import { useCurrency } from '../contexts/CurrencyContext.jsx'

const fallbackItinerary = [
  'Arrival in Kathmandu and briefing',
  'Scenic flight to Lukla, trek to Phakding',
  'Acclimatization in Namche Bazaar',
  'Trek to Tengboche monastery',
  'Reach Base Camp and return via Dingboche',
]

function TrekDetails() {
  const { id } = useParams()
  const { data, isLoading, error } = useGetTrekByIdQuery(id)
  const { data: availabilityData } = useGetTrekAvailabilityQuery(id)
  const { data: reviewsData } = useGetReviewsQuery({ trekId: id })
  const [submitInquiry, { isLoading: inquiryLoading, isSuccess: inquirySuccess }] =
    useSubmitInquiryMutation()
  const [createBooking, { isLoading: bookingLoading, isSuccess }] =
    useCreateBookingMutation()
  const [startDate, setStartDate] = useState('')
  const [groupSize, setGroupSize] = useState(1)
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredNotes, setPreferredNotes] = useState('')
  const { format } = useCurrency()
  const [confirmation, setConfirmation] = useState(null)
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const navigate = useNavigate()

  const trek = data?.data || data || {
    name: 'Signature Himalayan Trek',
    region: 'Everest',
    difficulty: 'Challenging',
    days: 14,
    price: 2200,
  }
  const itinerary = trek.itinerary?.length
    ? trek.itinerary
    : fallbackItinerary.map((item, index) => ({
        day: index + 1,
        title: item,
        description: 'Altitude gain, acclimatization, and scenic ridgelines.',
      }))
  const included = trek.included?.length
    ? trek.included
    : [
        'Licensed mountain guide and support crew',
        'Trekking permits and national park fees',
        'Airport transfers and ground transport',
        'Lodging during the trek',
      ]
  const excluded = trek.excluded?.length
    ? trek.excluded
    : [
        'International flights',
        'Travel insurance and rescue coverage',
        'Personal gear and tips',
      ]
  const equipment = trek.equipment?.length
    ? trek.equipment
    : [
        'Warm down jacket and base layers',
        'Trekking boots with ankle support',
        'Sleeping bag rated to -10C',
        'Headlamp, water bottles, and sun protection',
      ]
  const faqs = trek.faqs?.length
    ? trek.faqs
    : [
        {
          question: 'How difficult is this trek?',
          answer:
            'Expect long hiking days with steady elevation gain. Moderate fitness is required.',
        },
        {
          question: 'What is the best season?',
          answer:
            'Spring (Mar-May) and Autumn (Sep-Nov) deliver clear skies and stable weather.',
        },
        {
          question: 'Do I need prior trekking experience?',
          answer:
            'No, but prior hiking experience is helpful. We provide pacing and acclimatization support.',
        },
      ]
  const reviewsRaw = reviewsData?.data ?? reviewsData ?? []
  const reviews = Array.isArray(reviewsRaw) ? reviewsRaw : []
  const availability = availabilityData?.availability || []
  const totalCost = useMemo(
    () => Number(trek.price || 0) * Number(groupSize || 1),
    [trek.price, groupSize],
  )

  const handleBooking = async (event) => {
    event.preventDefault()
    if (!startDate || !contactName || !contactPhone) return
    try {
      const response = await createBooking({
        trekId: id,
        startDate,
        groupSize,
        contactName,
        contactPhone,
      }).unwrap()
      setConfirmation(response)
      if (response?.booking?._id) {
        navigate(`/payment/${response.booking._id}`)
      }
    } catch {
      // Handled by UI state below.
    }
  }

  const handlePreferredDate = async (event) => {
    event.preventDefault()
    if (!preferredDate) return
    try {
      await submitInquiry({
        subject: `Preferred date request: ${trek.name}`,
        message: `Preferred date: ${preferredDate}. Notes: ${preferredNotes}`,
      }).unwrap()
      setPreferredDate('')
      setPreferredNotes('')
    } catch {
      // Error handled by UI state below.
    }
  }

  if (isLoading) return <Loader label="Loading trek details..." />
  if (error) {
    return (
      <div className="container-shell py-12">
        <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
          Trek details are unavailable right now.
        </div>
      </div>
    )
  }

  return (
    <div className="container-shell py-12">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-float">
            <div className="overflow-hidden rounded-2xl bg-slate-100">
              <img
                src={trek.image || trekFallbacks.hero}
                alt={trek.name}
                className="h-56 w-full object-cover"
              />
            </div>
            <div className="mt-6">
              <h1 className="font-display text-3xl text-ink">{trek.name}</h1>
              <p className="mt-2 text-sm text-slate-600">
                {trek.region?.name || trek.region || 'Himalayan region'} -{' '}
                {trek.difficulty} - {trek.days} days
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Altitude: {trek.altitude || 0}m | Best season:{' '}
                {trek.bestSeason || 'Spring/Autumn'}
              </p>
              <p className="mt-4 text-slate-600">
                {trek.overview ||
                  'Elevation gains, ridge walks, and monastery stops blended into an expertly paced adventure.'}
              </p>
            </div>
          </div>
          <section className="card-surface p-6">
            <h2 className="font-display text-2xl text-ink">Itinerary</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {itinerary.map((day) => (
                <li key={`${day.day}-${day.title}`}>
                  <strong className="text-ink">Day {day.day}:</strong>{' '}
                  {day.title} - {day.description}
                </li>
              ))}
            </ul>
          </section>
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="card-surface p-6">
              <h2 className="font-display text-2xl text-ink">Route Map</h2>
              <img
                src={trek.mapImage || trekFallbacks.map}
                alt="Trek map"
                className="mt-4 rounded-2xl"
              />
              <p className="mt-3 text-sm text-slate-600">
                Follow the classic trailheads, river valleys, and alpine passes.
              </p>
            </div>
            <div className="card-surface p-6">
              <h2 className="font-display text-2xl text-ink">Elevation Chart</h2>
              <img
                src={trek.elevationChart || trekFallbacks.elevation}
                alt="Elevation chart"
                className="mt-4 rounded-2xl"
              />
              <p className="mt-3 text-sm text-slate-600">
                Gradual altitude gain with built-in acclimatization days.
              </p>
            </div>
          </section>
          <section className="card-surface p-6">
            <h2 className="font-display text-2xl text-ink">
              Included / Excluded
            </h2>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
                  Included
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {included.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
                  Excluded
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {excluded.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          <section className="card-surface p-6">
            <h2 className="font-display text-2xl text-ink">
              Preparation & Equipment
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
                  Accommodation
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {trek.accommodation ||
                    'Hand-picked teahouses and lodges with daily meals.'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
                  Difficulty & Season
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {trek.difficulty || 'Moderate'} -{' '}
                  {trek.bestSeason || 'Spring and Autumn'}
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {equipment.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>
          <section className="card-surface p-6">
            <h2 className="font-display text-2xl text-ink">FAQs</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <p className="font-semibold text-ink">{faq.question}</p>
                  <p className="mt-1">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="card-surface p-6">
            <h2 className="font-display text-2xl text-ink">Traveler Reviews</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              {reviews.length === 0 && (
                <p>No reviews yet. Be the first to share your experience.</p>
              )}
              {reviews.slice(0, 3).map((review, index) => (
                <div
                  key={review.id || review._id || index}
                  className="rounded-xl bg-slate-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                      {((review.user?.name || review.user || 'T')[0] || 'T')}
                    </div>
                    <p className="font-semibold text-ink">
                      {review.user?.name || review.user || 'Traveler'}
                    </p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
                    {review.rating || 5} / 5
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {review.comment || 'A breathtaking journey!'}
                  </p>
                </div>
              ))}
            </div>
            <Link
              to="/user/review"
              className="mt-4 inline-flex text-sm font-semibold text-blue-700"
            >
              Submit a review &gt;
            </Link>
          </section>
        </div>
        <aside className="space-y-6">
          <div className="card-surface p-6">
            <h3 className="font-display text-xl text-ink">Book this trek</h3>
            <p className="mt-2 text-sm text-slate-600">
              Starting from {format(trek.price)}
            </p>
            <form onSubmit={handleBooking} className="mt-4 space-y-3">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Contact name
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Full name"
              />
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Contact phone
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(event) => setContactPhone(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="+977 98xxxxxx"
              />
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Preferred start date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Group size
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={groupSize}
                onChange={(event) =>
                  setGroupSize(Number(event.target.value || 1))
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <p className="text-sm text-slate-600">
                Estimated total: {format(totalCost)}
              </p>
              <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-xs text-blue-700">
                Secure payments supported: Stripe (card), bank transfer, and
                Khalti mobile wallets.
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Submitting...' : 'Request Booking'}
              </button>
              {isSuccess && (
                <p className="text-sm text-blue-700">
                  Booking request sent. Confirmation email is queued.
                </p>
              )}
              {confirmation?.invoiceUrl && (
                <a
                  href={`${apiBase}${confirmation.invoiceUrl}`}
                  className="text-sm font-semibold text-blue-700"
                >
                  Download payment receipt
                </a>
              )}
            </form>
          </div>
          <div className="card-surface p-6">
            <h3 className="font-display text-xl text-ink">
              Availability Calendar
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Real-time spots for the next 60 days.
            </p>
            <div className="mt-4 grid max-h-64 gap-2 overflow-y-auto pr-2 text-xs text-slate-600">
              {availability.slice(0, 20).map((slot) => (
                <div
                  key={slot.date}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2"
                >
                  <span>{slot.date}</span>
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">
                    {slot.status} - {slot.remaining} left ({slot.season})
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={handlePreferredDate} className="mt-4 space-y-3">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Request preferred date
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(event) => setPreferredDate(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <textarea
                rows="3"
                value={preferredNotes}
                onChange={(event) => setPreferredNotes(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Group size, flexibility, or special requests"
              />
              <button
                type="submit"
                className="w-full rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-700 hover:text-white"
                disabled={inquiryLoading}
              >
                {inquiryLoading ? 'Sending...' : 'Send request'}
              </button>
              {inquirySuccess && (
                <p className="text-sm text-blue-700">
                  Request sent. Our team will confirm availability.
                </p>
              )}
            </form>
          </div>
          <div className="card-surface p-6">
            <h3 className="font-display text-xl text-ink">Need advice?</h3>
            <p className="mt-2 text-sm text-slate-600">
              Send your questions to our team and receive personalized guidance.
            </p>
            <Link
              to="/user/inquiry"
              className="mt-4 inline-flex rounded-full border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-700 hover:text-white"
            >
              Start inquiry
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default TrekDetails
