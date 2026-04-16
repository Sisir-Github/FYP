import { useSubmitInquiryMutation } from '../api/trekApi.js'
import { useState } from 'react'

function Contact() {
  const [submitInquiry, { isLoading, isSuccess }] = useSubmitInquiryMutation()
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.message) return
    try {
      await submitInquiry({
        subject: `Contact request from ${form.name || 'Traveler'}`,
        message: `${form.message}\nContact: ${form.email}`,
      }).unwrap()
      setForm({ name: '', email: '', message: '' })
    } catch {
      // Handled by UI state.
    }
  }

  return (
    <div className="container-shell py-12">
      <h1 className="font-display text-3xl text-ink">Contact Us</h1>
      <p className="mt-2 text-sm text-slate-600">
        Reach our expedition desk for custom itineraries and travel assistance.
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="card-surface space-y-4 p-6">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Full name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Email address
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Message
            </label>
            <textarea
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Tell us about your preferred dates, group size, and interests."
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send message'}
          </button>
          {isSuccess && (
            <p className="text-sm text-blue-700">
              Thank you! Our team will respond shortly.
            </p>
          )}
        </form>
        <div className="card-surface space-y-4 p-6 text-sm text-slate-600">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
              Visit
            </p>
            <p>Thamel, Kathmandu, Nepal</p>
            <p>Business Hours: 9:00 AM - 6:00 PM</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
              Call or Email
            </p>
            <p>+977 01 4440000</p>
            <p>info@everestencounter.com</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
              Messaging
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full border border-blue-200 px-3 py-1 text-xs text-blue-700"
              >
                WhatsApp
              </button>
              <button
                type="button"
                className="rounded-full border border-blue-200 px-3 py-1 text-xs text-blue-700"
              >
                Telegram
              </button>
              <button
                type="button"
                className="rounded-full border border-blue-200 px-3 py-1 text-xs text-blue-700"
              >
                Viber
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
