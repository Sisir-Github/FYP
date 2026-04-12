import { useGetUsersAdminQuery } from '../../api/adminApi.js'
import Loader from '../../components/Loader.jsx'

function ManageUsers() {
  const { data, isLoading, error } = useGetUsersAdminQuery()
  const rawUsers = data?.items ?? data?.data?.items ?? data?.data ?? data ?? []
  const users = Array.isArray(rawUsers) ? rawUsers : []
  const hasUsers = users.length > 0

  return (
    <div className="space-y-6">
      <div className="admin-card p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl">Manage Users</h1>
            <p className="text-sm text-slate-600">
              Control access, roles, and traveler profiles.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="admin-pill">Total: {users.length}</span>
            <span className="admin-pill">Admins</span>
            <span className="admin-pill">Travelers</span>
          </div>
        </div>
      </div>
      {isLoading ? (
        <Loader label="Loading users..." />
      ) : error && !hasUsers ? (
        <div className="admin-card-soft p-4 text-sm text-blue-700">
          Unable to load users.
        </div>
      ) : (
        <div className="admin-card p-4">
          {users.length === 0 ? (
            <p className="text-sm text-slate-600">No users found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id || user._id}>
                    <td className="font-semibold text-ink">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="admin-badge">
                        {user.role || 'USER'}
                      </span>
                    </td>
                    <td className="text-xs text-slate-500">
                      {user.createdAt?.slice(0, 10) || '-'}
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

export default ManageUsers
