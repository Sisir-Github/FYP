import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSubmitInquiryMutation } from '../../api/trekApi.js'

const schema = z.object({
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Please share your question'),
})

function InquiryForm() {
  const [submitInquiry, { isLoading, isSuccess, error }] =
    useSubmitInquiryMutation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    try {
      await submitInquiry(values).unwrap()
      reset()
    } catch {
      // Error handled via RTK Query error state.
    }
  }

  return (
    <div className="container-shell py-12">
      <h1 className="font-display text-3xl text-ink">Inquiry Form</h1>
      <p className="mt-2 text-sm text-slate-600">
        Our team responds within 24 hours with customized advice.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-surface mt-8 space-y-4 p-6"
      >
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Subject
          </label>
          <input
            type="text"
            {...register('subject')}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="Trek timing, permits, gear"
          />
          {errors.subject && (
            <p className="mt-1 text-xs text-rose-600">
              {errors.subject.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Message
          </label>
          <textarea
            rows="5"
            {...register('message')}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="Share dates, group size, and experience level."
          />
          {errors.message && (
            <p className="mt-1 text-xs text-rose-600">
              {errors.message.message}
            </p>
          )}
        </div>
        {error && (
          <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
            Unable to send inquiry. Please try again.
          </div>
        )}
        {isSuccess && (
          <div className="rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-700">
            Inquiry received. Our team will reply shortly.
          </div>
        )}
        <button
          type="submit"
          className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Inquiry'}
        </button>
      </form>
    </div>
  )
}

export default InquiryForm
