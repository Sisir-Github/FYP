import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function UserDashboard() {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="container-shell py-12">
      <div className="card-surface p-8">
        <h1 className="font-display text-3xl text-ink">
          Namaste, {user?.name || 'Traveler'}
        </h1>
        <p className="mt-2 text-slate-600">
          Track your bookings, update your profile, and share reviews for recent
          adventures.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link
            to="/user/bookings"
            className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-5 text-sm font-semibold text-blue-800"
          >
            View my bookings
          </Link>
          <Link
            to="/user/profile"
            className="rounded-xl border border-slate-200 bg-white px-4 py-5 text-sm font-semibold text-slate-700"
          >
            Update profile
          </Link>
          <Link
            to="/user/review"
            className="rounded-xl border border-slate-200 bg-white px-4 py-5 text-sm font-semibold text-slate-700"
          >
            Submit a review
          </Link>
          <Link
            to="/user/inquiry"
            className="rounded-xl border border-slate-200 bg-white px-4 py-5 text-sm font-semibold text-slate-700"
          >
            Make an inquiry
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
