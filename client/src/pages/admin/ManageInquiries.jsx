import { useGetInquiriesAdminQuery } from '../../api/adminApi.js'
import Loader from '../../components/Loader.jsx'

function ManageInquiries() {
  const { data, isLoading, error } = useGetInquiriesAdminQuery()
  const rawInquiries =
    data?.items ?? data?.data?.items ?? data?.data ?? data ?? []
  const inquiries = Array.isArray(rawInquiries) ? rawInquiries : []
  const hasInquiries = inquiries.length > 0

  return (
    <div className="space-y-6">
      <div className="admin-card p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl">Manage Inquiries</h1>
            <p className="text-sm text-slate-600">
              Respond to traveler questions and trip planning needs.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="admin-pill">Total: {inquiries.length}</span>
            <span className="admin-pill">New</span>
            <span className="admin-pill">Follow up</span>
          </div>
        </div>
      </div>
      {isLoading ? (
        <Loader label="Loading inquiries..." />
      ) : error && !hasInquiries ? (
        <div className="admin-card-soft p-4 text-sm text-blue-700">
          Unable to load inquiries.
        </div>
      ) : (
        <div className="admin-card p-4">
          {inquiries.length === 0 ? (
            <p className="text-sm text-slate-600">No inquiries yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Traveler</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id || inquiry._id}>
                    <td className="font-semibold text-ink">
                      {inquiry.subject || 'Inquiry'}
                    </td>
                    <td className="text-xs text-slate-500">
                      {inquiry.message || 'No message provided.'}
                    </td>
                    <td>{inquiry.name || inquiry.user?.name || 'Traveler'}</td>
                    <td className="text-xs text-slate-500">
                      {inquiry.createdAt?.slice(0, 10) || '-'}
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

export default ManageInquiries
