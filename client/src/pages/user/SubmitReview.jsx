import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useGetTreksQuery, useSubmitReviewMutation } from '../../api/trekApi.js'
import Loader from '../../components/Loader.jsx'

const schema = z.object({
  trekId: z.string().min(1, 'Select a trek'),
  rating: z.string().min(1, 'Rating is required'),
  comment: z.string().min(10, 'Share a short review'),
})

function SubmitReview() {
  const { data: treksData, isLoading: treksLoading } = useGetTreksQuery()
  const rawTreks =
    treksData?.items ?? treksData?.data?.items ?? treksData?.data ?? treksData
  const treks = Array.isArray(rawTreks) ? rawTreks : []
  const [submitReview, { isLoading, isSuccess, error }] =
    useSubmitReviewMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    try {
      await submitReview(values).unwrap()
      reset()
    } catch {
      // Error handled via RTK Query error state.
    }
  }

  return (
    <div className="container-shell py-12">
      <h1 className="font-display text-3xl text-ink">Submit Review</h1>
      <p className="mt-2 text-sm text-slate-600">
        Share feedback to help other travelers plan their trek.
      </p>
      {treksLoading ? (
        <Loader label="Loading treks..." />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card-surface mt-8 space-y-4 p-6"
        >
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Trek
            </label>
            <select
              {...register('trekId')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">Select a trek</option>
              {treks.map((trek) => (
                <option key={trek.id || trek._id} value={trek.id || trek._id}>
                  {trek.name}
                </option>
              ))}
            </select>
            {errors.trekId && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.trekId.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Rating
            </label>
            <select
              {...register('rating')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">Select</option>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} stars
                </option>
              ))}
            </select>
            {errors.rating && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.rating.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Review
            </label>
            <textarea
              rows="4"
              {...register('comment')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="What stood out in your journey?"
            />
            {errors.comment && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.comment.message}
              </p>
            )}
          </div>
          {error && (
            <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
              Could not submit review. Please try again.
            </div>
          )}
          {isSuccess && (
            <div className="rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-700">
              Thank you! Your review has been submitted.
            </div>
          )}
          <button
            type="submit"
            className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}
    </div>
  )
}

export default SubmitReview
