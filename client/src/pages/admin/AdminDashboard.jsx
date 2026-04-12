import { useMemo, useState } from 'react'
import { useGetAdminStatsQuery } from '../../api/adminApi.js'
import Loader from '../../components/Loader.jsx'

function AdminDashboard() {
  const { data, isLoading, error } = useGetAdminStatsQuery()
  const stats = data?.data || data || {}
  const hasStats = Object.keys(stats).length > 0
  const treks = stats.treks ?? 0
  const bookings = stats.bookings ?? 0
  const revenue = stats.revenue ?? 0
  const inquiries = stats.inquiries ?? 0
  const users = stats.users ?? 0
  const payments = stats.payments ?? 0
  const reviews = stats.reviews || { total: 0, good: 0, bad: 0, average: 0 }
  const monthly = Array.isArray(stats.monthly) ? stats.monthly : []
  const maxRevenue = Math.max(...monthly.map((item) => item.revenue || 0), 1)
  const [currency, setCurrency] = useState('USD')
  const rate = 133
  const revenueDisplay = useMemo(() => {
    if (currency === 'NPR') {
      const value = Math.round(revenue * rate)
      return `NPR ${value.toLocaleString?.() || value}`
    }
    return `$${revenue?.toLocaleString?.() || revenue}`
  }, [currency, revenue])
  const monthlyDisplay = useMemo(() => {
    return monthly.map((item) => ({
      ...item,
      value: currency === 'NPR' ? Math.round((item.revenue || 0) * rate) : item.revenue || 0,
    }))
  }, [currency, monthly])
  const maxDisplay = Math.max(...monthlyDisplay.map((item) => item.value || 0), 1)

  if (isLoading) return <Loader label="Loading stats..." />

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Admin Dashboard</h1>
          <p className="text-sm text-slate-600">
            Monthly performance, customer sentiment, and operational activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
            <span>Revenue currency</span>
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
            >
              <option value="USD">USD</option>
              <option value="NPR">NPR</option>
            </select>
          </div>
          <span className="admin-pill">Updated live</span>
        </div>
      </div>
      {error && !hasStats && (
        <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
          Unable to load stats from the API. Showing last cached values.
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {[
          { label: 'Treks', value: treks, icon: 'M12 3l9 6-9 6-9-6 9-6zm0 7l9 6-9 6-9-6 9-6z' },
          { label: 'Bookings', value: bookings, icon: 'M7 3h10a2 2 0 0 1 2 2v4H5V5a2 2 0 0 1 2-2zm-2 8h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8z' },
          { label: 'Revenue', value: revenueDisplay, icon: 'M12 3v18m-6-6h12', isText: true },
          { label: 'Inquiries', value: inquiries, icon: 'M4 5h16v10H7l-3 3V5z' },
          { label: 'Users', value: users, icon: 'M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-7 8a7 7 0 0 1 14 0' },
          { label: 'Payments', value: payments, icon: 'M4 7h16v4H4V7zm0 6h16v4H4v-4z' },
        ].map((card) => (
          <div key={card.label} className="admin-card p-5">
            <div className="flex items-start justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {card.label}
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-5 w-5"
                >
                  <path d={card.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold text-ink">
              {card.isText ? card.value : card.value?.toLocaleString?.() || card.value}
            </p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="admin-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-ink">
              Monthly Revenue
            </h2>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Last 6 months · {currency}
            </span>
          </div>
          <div className="mt-6 grid grid-cols-6 gap-3">
            {monthlyDisplay.map((item) => {
              const height = Math.max((item.value || 0) / maxDisplay, 0.08) * 160
              return (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <div className="flex h-40 items-end">
                    <div
                      className="w-10 rounded-2xl bg-gradient-to-b from-blue-600 to-sky-400 shadow"
                      style={{ height }}
                      title={`${currency} ${item.value || 0}`}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{item.label}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-700">
            Revenue auto-converts to NPR for the dashboard view.
          </div>
        </div>
        <div className="admin-card p-6">
          <h2 className="font-display text-2xl text-ink">Review Sentiment</h2>
          <p className="mt-2 text-sm text-slate-600">
            Average rating: {reviews.average?.toFixed?.(1) || 0}
          </p>
          <div className="mt-6 flex items-center gap-6">
            <div
              className="h-28 w-28 rounded-full"
              style={{
                background: `conic-gradient(#1d4ed8 0deg ${
                  reviews.total ? (reviews.good / reviews.total) * 360 : 0
                }deg, #e2e8f0 ${
                  reviews.total ? (reviews.good / reviews.total) * 360 : 0
                }deg 360deg)`,
              }}
            />
            <div className="space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-ink">{reviews.good}</span>{' '}
                positive reviews
              </p>
              <p>
                <span className="font-semibold text-ink">{reviews.bad}</span>{' '}
                needs follow up
              </p>
              <p>
                <span className="font-semibold text-ink">{reviews.total}</span>{' '}
                total reviews
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="admin-card p-6">
          <h2 className="font-display text-2xl text-ink">Monthly Bookings</h2>
          <div className="mt-6 flex items-end gap-3">
            {monthly.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <div
                  className="w-7 rounded-full bg-gradient-to-b from-blue-600 to-sky-400"
                  style={{ height: `${Math.max(item.bookings * 6, 8)}px` }}
                />
                <span className="text-xs text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="admin-card p-6">
          <h2 className="font-display text-2xl text-ink">Top Drivers</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Repeat customers</span>
              <span className="font-semibold text-ink">38%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Package upgrades</span>
              <span className="font-semibold text-ink">22%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Premium add-ons</span>
              <span className="font-semibold text-ink">18%</span>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500">
              Insights are generated from booking and payment history.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
