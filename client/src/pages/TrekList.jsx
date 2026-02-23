import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useGetTreksQuery, useGetRegionsQuery } from '../api/trekApi.js'
import Loader from '../components/Loader.jsx'
const trekFallbackImage =
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80'
import { useCurrency } from '../contexts/CurrencyContext.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

const difficultyOptions = [
  { value: 'Easy', key: 'trekDifficulty_Easy' },
  { value: 'Moderate', key: 'trekDifficulty_Moderate' },
  { value: 'Challenging', key: 'trekDifficulty_Challenging' },
  { value: 'Extreme', key: 'trekDifficulty_Extreme' },
]
const seasonOptions = [
  { value: 'Spring', key: 'trekSeason_Spring' },
  { value: 'Summer', key: 'trekSeason_Summer' },
  { value: 'Autumn', key: 'trekSeason_Autumn' },
  { value: 'Winter', key: 'trekSeason_Winter' },
]
const durationOptions = [
  { value: 'Short (1-7)', key: 'trekDuration_Short' },
  { value: 'Medium (8-14)', key: 'trekDuration_Medium' },
  { value: 'Long (15+)', key: 'trekDuration_Long' },
]

function TrekList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { format } = useCurrency()
  const { t } = useLanguage()
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    region: searchParams.get('region') || 'all',
    difficulty: searchParams.get('difficulty') || 'all',
    price: searchParams.get('price') || 'all',
    season: searchParams.get('season') || 'all',
    duration: searchParams.get('duration') || 'all',
  })

  const params = useMemo(() => {
    const payload = {}
    if (filters.search) payload.search = filters.search
    if (filters.region !== 'all') payload.region = filters.region
    if (filters.difficulty !== 'all') payload.difficulty = filters.difficulty
    if (filters.price !== 'all') {
      if (filters.price === 'budget') payload.priceMax = 1200
      if (filters.price === 'comfort') {
        payload.priceMin = 1200
        payload.priceMax = 2200
      }
      if (filters.price === 'premium') payload.priceMin = 2200
    }
    if (filters.season !== 'all') payload.bestSeason = filters.season
    if (filters.duration !== 'all') {
      if (filters.duration === 'Short (1-7)') payload.maxDays = 7
      if (filters.duration === 'Medium (8-14)') {
        payload.minDays = 8
        payload.maxDays = 14
      }
      if (filters.duration === 'Long (15+)') payload.minDays = 15
    }
    return payload
  }, [filters])

  const { data, isLoading, error } = useGetTreksQuery(params)
  const { data: regionsData } = useGetRegionsQuery()
  const rawTreks = data?.items ?? data?.data?.items ?? data?.data ?? data
  const rawRegions =
    regionsData?.items ??
    regionsData?.data?.items ??
    regionsData?.data ??
    regionsData
  const treks = Array.isArray(rawTreks) ? rawTreks : []
  const regions = Array.isArray(rawRegions) ? rawRegions : []

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') nextParams.set(key, value)
    })
    setSearchParams(nextParams)
  }

  return (
    <div className="container-shell py-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">{t('trekListTitle')}</h1>
          <p className="text-sm text-slate-600">
            {t('trekListSubtitle')}
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="card-surface grid gap-3 p-4 md:grid-cols-4"
        >
          <input
            value={filters.search}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, search: event.target.value }))
            }
            placeholder={t('trekSearch')}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <select
            value={filters.region}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, region: event.target.value }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="all">{t('trekRegion')}</option>
            {regions.map((item) => (
              <option key={item.id || item._id} value={item.name || item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            value={filters.difficulty}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, difficulty: event.target.value }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="all">{t('trekDifficulty')}</option>
            {difficultyOptions.map((level) => (
              <option key={level.value} value={level.value}>
                {t(level.key)}
              </option>
            ))}
          </select>
          <select
            value={filters.season}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, season: event.target.value }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="all">{t('trekSeason')}</option>
            {seasonOptions.map((season) => (
              <option key={season.value} value={season.value}>
                {t(season.key)}
              </option>
            ))}
          </select>
          <select
            value={filters.duration}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, duration: event.target.value }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="all">{t('trekDuration')}</option>
            {durationOptions.map((duration) => (
              <option key={duration.value} value={duration.value}>
                {t(duration.key)}
              </option>
            ))}
          </select>
          <select
            value={filters.price}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, price: event.target.value }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="all">{t('trekPrice')}</option>
            <option value="budget">{t('trekPriceBudget')}</option>
            <option value="comfort">{t('trekPriceComfort')}</option>
            <option value="premium">{t('trekPricePremium')}</option>
          </select>
          <button
            type="submit"
            className="col-span-full rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            {t('trekApply')}
          </button>
        </form>
      </div>

      {isLoading ? (
        <Loader label={t('homeLoadingTreks')} />
      ) : error ? (
        <div className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
          {t('trekLoadError')}
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {treks.length === 0 && (
            <div className="col-span-full text-sm text-slate-600">
              {t('trekEmpty')}
            </div>
          )}
          {treks.map((trek) => (
            <Link
              key={trek.id || trek._id}
              to={`/treks/${trek.id || trek._id || 1}`}
              className="card-surface group flex flex-col gap-4 p-6 transition hover:-translate-y-1"
            >
              <div className="overflow-hidden rounded-xl bg-slate-100">
                <img
                  src={trek.image || trekFallbackImage}
                  alt={trek.name}
                  className="h-36 w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="font-semibold text-ink group-hover:text-blue-700">
                  {trek.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {trek.region?.name || trek.region || t('trekRegionFallback')} -{' '}
                  {trek.difficulty || t('trekDifficulty_Moderate')}
                </p>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>{trek.days || 12} {t('trekDays')}</span>
                <span>{format(trek.price || 1800)}</span>
              </div>
              <div className="text-xs text-slate-500">
                {t('trekAltitude')}: {trek.altitude || 0}m | {t('trekSeason')}:{' '}
                {trek.bestSeason || t('trekSeason_SpringAutumn')}
              </div>
              <p className="text-sm text-slate-600">
                {trek.overview || trek.description || t('trekCardFallback')}
              </p>
              <span className="mt-auto inline-flex w-fit rounded-full bg-blue-700 px-4 py-2 text-xs font-semibold text-white">
                {t('trekViewDetails')}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default TrekList
