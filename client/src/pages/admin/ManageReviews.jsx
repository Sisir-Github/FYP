import { useGetReviewsAdminQuery } from '../../api/adminApi.js'
import Loader from '../../components/Loader.jsx'

function ManageReviews() {
  const { data, isLoading, error } = useGetReviewsAdminQuery()
  const rawReviews =
    data?.items ?? data?.data?.items ?? data?.data ?? data ?? []
  const reviews = Array.isArray(rawReviews) ? rawReviews : []
  const hasReviews = reviews.length > 0

  return (
    <div className="space-y-6">
      <div className="admin-card p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl">Manage Reviews</h1>
            <p className="text-sm text-slate-600">
              Moderate traveler feedback and ratings.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="admin-pill">Total: {reviews.length}</span>
            <span className="admin-pill">Positive</span>
            <span className="admin-pill">Needs review</span>
          </div>
        </div>
      </div>
      {isLoading ? (
        <Loader label="Loading reviews..." />
      ) : error && !hasReviews ? (
        <div className="admin-card-soft p-4 text-sm text-blue-700">
          Unable to load reviews.
        </div>
      ) : (
        <div className="admin-card p-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-slate-600">No reviews yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Trek</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Traveler</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id || review._id}>
                    <td className="font-semibold text-ink">
                      {review.trekName || review.trek?.name || 'Trek review'}
                    </td>
                    <td>
                      <span className="admin-badge">
                        {review.rating || 5} / 5
                      </span>
                    </td>
                    <td className="text-xs text-slate-500">
                      {review.comment || 'No comment provided.'}
                    </td>
                    <td>{review.user?.name || 'Traveler'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default ManageReviews
