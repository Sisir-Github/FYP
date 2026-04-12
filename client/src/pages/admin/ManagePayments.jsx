import { useGetPaymentsAdminQuery } from '../../api/adminApi.js'
import Loader from '../../components/Loader.jsx'

function ManagePayments() {
  const { data, isLoading, error } = useGetPaymentsAdminQuery()
  const rawPayments =
    data?.items ?? data?.data?.items ?? data?.data ?? data ?? []
  const payments = Array.isArray(rawPayments) ? rawPayments : []
  const hasPayments = payments.length > 0

  return (
    <div className="space-y-6">
      <div className="admin-card p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl">Manage Payments</h1>
            <p className="text-sm text-slate-600">
              Track payment intents and completed transactions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="admin-pill">Total: {payments.length}</span>
            <span className="admin-pill">Stripe</span>
            <span className="admin-pill">Khalti</span>
          </div>
        </div>
      </div>
      {isLoading ? (
        <Loader label="Loading payments..." />
      ) : error && !hasPayments ? (
        <div className="admin-card-soft p-4 text-sm text-blue-700">
          Unable to load payments.
        </div>
      ) : (
        <div className="admin-card p-4">
          {payments.length === 0 ? (
            <p className="text-sm text-slate-600">No payments logged.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Traveler</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id || payment._id}>
                    <td className="font-semibold text-ink">
                      {payment.traveler || payment.user?.name || 'Traveler'}
                    </td>
                    <td>USD {payment.amount || 0}</td>
                    <td>{payment.method || 'Card'}</td>
                    <td>
                      <span className="admin-badge">
                        {payment.status || 'Pending'}
                      </span>
                    </td>
                    <td className="text-xs">
                      {payment.transactionId || payment.reference || '-'}
                    </td>
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

export default ManagePayments
