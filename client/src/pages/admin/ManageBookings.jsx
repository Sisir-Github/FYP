import {
  useGetBookingsAdminQuery,
  useUpdateBookingMutation,
} from '../../api/adminApi.js'
import Loader from '../../components/Loader.jsx'
import Modal from '../../components/Modal.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

function ManageBookings() {
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
  })
  const { data, isLoading, error } = useGetBookingsAdminQuery(filters)
  const [updateBooking, { isLoading: saving }] = useUpdateBookingMutation()
  const { pushToast } = useToast()
  const rawBookings =
    data?.items ?? data?.data?.items ?? data?.data ?? data ?? []
  const bookings = Array.isArray(rawBookings) ? rawBookings : []
  const hasBookings = bookings.length > 0
  const [selected, setSelected] = useState(null)

  const schema = z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
    paymentStatus: z.enum(['UNPAID', 'PROCESSING', 'PAID', 'FAILED']),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const openEdit = (booking) => {
    setSelected(booking)
    reset({
      status: booking.status || 'PENDING',
      paymentStatus: booking.paymentStatus || 'UNPAID',
    })
  }

  const onSubmit = async (values) => {
    try {
      await updateBooking({ id: selected._id, payload: values }).unwrap()
      pushToast({ type: 'success', message: 'Booking updated successfully.' })
      setSelected(null)
    } catch {
      pushToast({ type: 'error', message: 'Please fix highlighted fields.' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="admin-card p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl">Manage Bookings</h1>
            <p className="text-sm text-slate-600">
              Review booking requests and update status.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="admin-pill">Total: {bookings.length}</span>
            <span className="admin-pill">Pending</span>
            <span className="admin-pill">Confirmed</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <select
            value={filters.status}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, status: event.target.value }))
            }
            className="admin-input"
          >
            <option value="">All status</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
          <select
            value={filters.paymentStatus}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                paymentStatus: event.target.value,
              }))
            }
            className="admin-input"
          >
            <option value="">All payments</option>
            <option value="UNPAID">UNPAID</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="PAID">PAID</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
      </div>
      {isLoading ? (
        <Loader label="Loading bookings..." />
      ) : error && !hasBookings ? (
        <div className="admin-card-soft p-4 text-sm text-blue-700">
          Unable to load bookings.
        </div>
      ) : (
        <div className="admin-card p-4">
          {bookings.length === 0 ? (
            <p className="text-sm text-slate-600">No bookings yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Traveler</th>
                  <th>Trek</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Amount</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id || booking._id}>
                    <td className="font-semibold text-ink">
                      {booking.traveler || booking.user?.name || 'Traveler'}
                    </td>
                    <td>{booking.trekName || booking.trek?.name || 'Trek request'}</td>
                    <td>{booking.startDate || 'TBD'}</td>
                    <td>
                      <span className="admin-badge">
                        {booking.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <span className="admin-badge">
                        {booking.paymentStatus || 'UNPAID'}
                      </span>
                    </td>
                    <td>USD {booking.totalAmount || 0}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => openEdit(booking)}
                        className="admin-button-secondary"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      <Modal
        open={Boolean(selected)}
        title="Edit Booking"
        onClose={() => setSelected(null)}
      >
        <form
          onSubmit={handleSubmit(onSubmit, () =>
            pushToast({ type: 'error', message: 'Fix highlighted fields.' }),
          )}
          className="space-y-4"
        >
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Status
            </label>
            <select {...register('status')} className="admin-input w-full">
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
            {errors.status && (
              <p className="text-xs text-rose-600">{errors.status.message}</p>
            )}
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Payment status
            </label>
            <select {...register('paymentStatus')} className="admin-input w-full">
              <option value="UNPAID">UNPAID</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="PAID">PAID</option>
              <option value="FAILED">FAILED</option>
            </select>
            {errors.paymentStatus && (
              <p className="text-xs text-rose-600">
                {errors.paymentStatus.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="admin-pill"
            >
              Cancel
            </button>
            <button type="submit" className="admin-button" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ManageBookings
