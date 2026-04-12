import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGetRegionsQuery, useGetTreksQuery } from '../api/trekApi.js'
import { useGetReviewsQuery } from '../api/reviewApi.js'
import { useGetGalleryQuery } from '../api/galleryApi.js'
import { useGetHeroSlidesQuery } from '../api/heroApi.js'
import Loader from '../components/Loader.jsx'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext.jsx'

const imageSet = {
  hero: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
  airplane:
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
  heli:
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  paraglide:
    'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
  trek: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
}

const fallbackRegions = [
  { id: 'everest', name: 'Everest', description: 'High alpine panoramas.' },
  { id: 'annapurna', name: 'Annapurna', description: 'Cultural villages.' },
  { id: 'langtang', name: 'Langtang', description: 'Quiet valleys.' },
]

const fallbackTreks = [
  { id: '1', name: 'Everest Base Camp', region: 'Everest', days: 14 },
  { id: '2', name: 'Annapurna Circuit', region: 'Annapurna', days: 16 },
  { id: '3', name: 'Langtang Valley', region: 'Langtang', days: 10 },
]

const heroSlides = [
  {
    title: 'Everest Base Camp',
    subtitle: 'High-altitude classic with Sagarmatha panoramas.',
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Annapurna Base Camp',
    subtitle: 'Snow amphitheater and warm Gurung villages.',
    image:
      'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Australian Camp',
    subtitle: 'Short alpine escape above Pokhara.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Kori Trek',
    subtitle: 'Quiet ridgelines with rhododendron forests.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Langtang Valley',
    subtitle: 'High alpine valley close to Kathmandu.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Humla Trail',
    subtitle: 'Remote western Himalaya with ancient routes.',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Rara Lake',
    subtitle: 'Azure lake in Nepal’s far west.',
    image:
      'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Sagarmatha Base Camp',
    subtitle: 'Iconic route to the world’s highest summit.',
    image:
      'https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1400&q=80',
  },
]

const MotionSection = motion.section

function Home() {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('all')
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [activeSlide, setActiveSlide] = useState(0)
  const { data: treksData, isLoading: treksLoading } = useGetTreksQuery()
  const { data: regionsData } = useGetRegionsQuery()
  const { data: reviewsData } = useGetReviewsQuery()
  const { data: galleryData } = useGetGalleryQuery()
  const { data: heroData } = useGetHeroSlidesQuery()
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const resolveImage = (src) =>
    src?.startsWith('/uploads') ? `${apiBase}${src}` : src

  const rawTreks =
    treksData?.items ?? treksData?.data?.items ?? treksData?.data ?? treksData
  const rawRegions =
    regionsData?.items ??
    regionsData?.data?.items ??
    regionsData?.data ??
    regionsData
  const treks = Array.isArray(rawTreks) ? rawTreks : fallbackTreks
  const regions = Array.isArray(rawRegions) ? rawRegions : fallbackRegions
  const reviewsRaw = reviewsData?.data ?? reviewsData ?? []
  const reviews = Array.isArray(reviewsRaw) ? reviewsRaw : []
  const galleryRaw = galleryData?.items ?? galleryData?.data?.items ?? galleryData

  const featuredTreks = useMemo(() => treks.slice(0, 3), [treks])
  const featuredGallery = useMemo(() => {
    const galleryItems = Array.isArray(galleryRaw) ? galleryRaw : []
    if (galleryItems.length === 0) {
      return [
        { title: 'High Himalayas', category: 'Everest', image: imageSet.hero },
        { title: 'Heli Access', category: 'Annapurna', image: imageSet.heli },
        { title: 'Paragliding Valleys', category: 'Pokhara', image: imageSet.paraglide },
      ]
    }
    const featured = galleryItems.filter((item) => item.isFeatured)
    return (featured.length ? featured : galleryItems).slice(0, 3)
  }, [galleryRaw])
  const heroRaw = heroData?.items ?? heroData?.data?.items ?? heroData ?? []
  const heroItems = Array.isArray(heroRaw) ? heroRaw : []
  const slides = heroItems.length
    ? heroItems.map((item) => ({
        title: item.title,
        subtitle: item.subtitle || item.description || '',
        image: resolveImage(item.image),
        ctaLabel: item.ctaLabel,
        ctaHref: item.ctaHref,
      }))
    : heroSlides

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [slides.length])

  const currentSlide = slides[activeSlide] || slides[0]

  const handleSearch = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('search', query)
    if (region !== 'all') params.set('region', region)
    navigate(`/treks?${params.toString()}`)
  }

  return (
    <div className="pb-16">
      <MotionSection
        className="relative overflow-hidden bg-mist py-16"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container-shell relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.45em] text-blue-700">
              {t('homeTagline')}
            </p>
            <h1 className="font-display text-4xl text-ink md:text-5xl">
              {t('homeTitle')}
            </h1>
            <p className="max-w-xl text-lg text-slate-600">
              {t('homeSubtitle')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/treks"
                className="rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-600"
              >
                {t('homeBook')}
              </Link>
              <Link
                to="/treks"
                className="rounded-full border border-blue-700 px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-700 hover:text-white"
              >
                {t('homeView')}
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
              <span className="rounded-full border border-blue-200 bg-white/80 px-4 py-2">
                {t('homeCertifiedGuides')}
              </span>
              <span className="rounded-full border border-blue-200 bg-white/80 px-4 py-2">
                {t('homeSafetyFirst')}
              </span>
              <span className="rounded-full border border-blue-200 bg-white/80 px-4 py-2">
                {t('homeCustomItineraries')}
              </span>
            </div>
            <form
              onSubmit={handleSearch}
              className="card-surface grid gap-4 p-6 md:grid-cols-[1.3fr_1fr_auto]"
            >
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('homeSearchPlaceholder')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none"
              />
              <select
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none"
              >
                <option value="all">{t('homeAllRegions')}</option>
                {regions.map((item) => (
                  <option key={item.id || item._id} value={item.name || item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                {t('homeExplore')}
              </button>
            </form>
          </div>
          <div className="relative">
            <div className="absolute -top-6 right-6 hidden w-24 rounded-full bg-blue-100/80 p-4 text-center text-xs font-semibold text-blue-700 shadow lg:block">
              {t('homeRoutes')}
            </div>
            <div className="relative overflow-hidden rounded-3xl bg-white/70 p-4 shadow-float">
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="h-80 w-full rounded-2xl object-cover transition duration-700"
              />
              <button
                type="button"
                onClick={() =>
                  setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)
                }
                className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow"
                aria-label="Previous slide"
              >
                &larr;
              </button>
              <button
                type="button"
                onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow"
                aria-label="Next slide"
              >
                &rarr;
              </button>
              <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/85 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-600">
                  Featured Trek
                </p>
                <p className="text-lg font-semibold text-ink">
                  {currentSlide.title}
                </p>
                <p className="text-sm text-slate-600">{currentSlide.subtitle}</p>
                {currentSlide.ctaLabel && currentSlide.ctaHref && (
                  <Link
                    to={currentSlide.ctaHref}
                    className="mt-3 inline-flex rounded-full bg-blue-700 px-4 py-2 text-xs font-semibold text-white"
                  >
                    {currentSlide.ctaLabel}
                  </Link>
                )}
              </div>
              <div className="absolute right-8 top-8 flex gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`h-2.5 w-8 rounded-full transition ${
                      index === activeSlide ? 'bg-blue-600' : 'bg-white/70'
                    }`}
                    aria-label={`Show ${slide.title}`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-blue-100 bg-white/80 p-4 text-sm text-slate-600">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-600">
                  {t('homeWeatherTitle')}
                </p>
                <p className="mt-2 font-semibold text-ink">
                  {t('homeWeatherBody')}
                </p>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-white/80 p-4 text-sm text-slate-600">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-600">
                  {t('homeBriefTitle')}
                </p>
                <p className="mt-2 font-semibold text-ink">
                  {t('homeBriefBody')}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
                {slides.slice(0, 4).map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className="overflow-hidden rounded-2xl border border-blue-100 bg-white/70"
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-16 w-full object-cover"
                    />
                  </button>
                ))}
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-blue-200/60 blur-3xl animate-float-slow" />
          <div className="absolute right-10 top-6 h-80 w-80 rounded-full bg-sky-200/60 blur-3xl animate-drift" />
        </div>
      </MotionSection>

      <MotionSection
        className="container-shell mt-16"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl text-ink">{t('homeModesTitle')}</h2>
            <p className="text-sm text-slate-600">
              {t('homeModesSubtitle')}
            </p>
          </div>
          <Link to="/treks" className="text-sm font-semibold text-blue-700">
            {t('homeSeePackages')}
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: t('homeModeFlights'), image: imageSet.airplane },
            { label: t('homeModeHeli'), image: imageSet.heli },
            { label: t('homeModeParaglide'), image: imageSet.paraglide },
            { label: t('homeModeHighAltitude'), image: imageSet.trek },
          ].map((mode) => (
            <Link
              key={mode.label}
              to="/treks"
              className="group rounded-3xl border border-blue-100 bg-white/90 p-4 shadow-float transition hover:-translate-y-1"
            >
              <img
                src={mode.image}
                alt={mode.label}
                className="h-36 w-full rounded-2xl object-cover"
              />
              <p className="mt-4 text-sm font-semibold text-ink group-hover:text-blue-700">
                {mode.label}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {t('homeModeHint')}
              </p>
            </Link>
          ))}
        </div>
      </MotionSection>

      <MotionSection
        className="container-shell mt-16"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl text-ink">{t('homeSignatureTitle')}</h2>
          <Link
            to="/treks"
            className="text-sm font-semibold text-blue-700"
          >
            {t('homeSignatureView')}
          </Link>
        </div>
        {treksLoading ? (
          <Loader label={t('homeLoadingTreks')} />
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {featuredTreks.map((trek) => (
              <Link
                key={trek.id || trek._id}
                to={`/treks/${trek.id || trek._id || 1}`}
                className="card-surface group flex flex-col gap-4 p-6 transition hover:-translate-y-1"
              >
                <div className="overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={trek.image || imageSet.trek}
                    alt={trek.name}
                    className="h-36 w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-ink group-hover:text-blue-700">
                    {trek.name}
                  </h3>
                <p className="text-sm text-slate-500">
                  {trek.region?.name || trek.region || 'Himalayan region'} -{' '}
                  {trek.days || 12} days
                </p>
              </div>
              <p className="text-sm text-slate-600">
                {t('homeSignatureBody')}
              </p>
            </Link>
          ))}
        </div>
        )}
      </MotionSection>

      <MotionSection
        className="container-shell mt-16"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-surface p-8">
            <h2 className="font-display text-3xl text-ink">
              {t('homeServicesTitle')}
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              {t('homeServicesSubtitle')}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li>- {t('homeServicesItem1')}</li>
              <li>- {t('homeServicesItem2')}</li>
              <li>- {t('homeServicesItem3')}</li>
              <li>- {t('homeServicesItem4')}</li>
            </ul>
          </div>
          <div className="card-surface p-8">
            <h3 className="text-xs uppercase tracking-[0.3em] text-blue-600">
              {t('homeTestimonials')}
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              {t('homeTestimonialsSubtitle')}
            </p>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              {reviews.slice(0, 3).map((review, index) => (
                <div key={review.id || review._id || index} className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                      {(review.user?.name || 'T')[0]}
                    </div>
                    <p className="font-semibold text-ink">
                      {review.user?.name || 'Traveler'}
                    </p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
                    {review.rating || 5} / 5
                  </p>
                  <p className="mt-2">{review.comment || 'Unforgettable experience.'}</p>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-sm text-slate-600">
                  {t('homeTestimonialsEmpty')}
                </p>
              )}
            </div>
            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-xs text-blue-700">
              {t('homeTestimonialsNote')}
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection
        className="container-shell mt-16"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="card-surface grid gap-6 p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="font-display text-3xl text-ink">
              {t('homePrepTitle')}
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              {t('homePrepSubtitle')}
            </p>
            <Link
              to="/guide"
              className="mt-4 inline-flex rounded-full bg-blue-700 px-5 py-2 text-sm font-semibold text-white"
            >
              {t('homeOpenGuide')}
            </Link>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <p>- {t('homePrepItem1')}</p>
            <p>- {t('homePrepItem2')}</p>
            <p>- {t('homePrepItem3')}</p>
          </div>
        </div>
       </MotionSection>

      <MotionSection
        className="container-shell mt-16"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl text-ink">{t('homeGalleryTitle')}</h2>
          <Link to="/gallery" className="text-sm font-semibold text-blue-700">
            {t('homeGalleryView')}
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {featuredGallery.map((item) => (
            <div key={item._id || item.title} className="card-surface p-4">
              <img
                src={resolveImage(item.image)}
                alt={item.title}
                className="h-40 w-full rounded-2xl object-cover"
              />
              <p className="mt-3 text-sm font-semibold text-ink">
                {item.title}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-blue-600">
                {item.category}
              </p>
            </div>
          ))}
        </div>
      </MotionSection>
    </div>
  )
}

export default Home
