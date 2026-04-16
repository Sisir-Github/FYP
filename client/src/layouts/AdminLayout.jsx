import { NavLink, Outlet } from 'react-router-dom'
import { useMemo } from 'react'
import { useGetAdminChatUsersQuery } from '../api/chatApi.js'

const navItems = [
  {
    label: 'Dashboard',
    to: '/admin',
    icon: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',
  },
  {
    label: 'Treks',
    to: '/admin/treks',
    icon: 'M12 3l9 6-9 6-9-6 9-6zm0 7l9 6-9 6-9-6 9-6z',
  },
  {
    label: 'Add Trek',
    to: '/admin/treks/new',
    icon: 'M12 5v14M5 12h14',
  },
  {
    label: 'Regions',
    to: '/admin/regions',
    icon: 'M12 2l4 8 8 1-6 6 2 8-8-4-8 4 2-8-6-6 8-1 4-8z',
  },
  {
    label: 'Bookings',
    to: '/admin/bookings',
    icon: 'M7 3h10a2 2 0 0 1 2 2v4H5V5a2 2 0 0 1 2-2zm-2 8h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8z',
  },
  {
    label: 'Payments',
    to: '/admin/payments',
    icon: 'M4 7h16v4H4V7zm0 6h16v4H4v-4z',
  },
  {
    label: 'Gallery',
    to: '/admin/gallery',
    icon: 'M4 5h16v14H4zM8 13l3-3 5 6',
  },
  {
    label: 'Hero Carousel',
    to: '/admin/hero',
    icon: 'M3 7h18M3 12h18M3 17h18',
  },
  {
    label: 'Users',
    to: '/admin/users',
    icon: 'M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-7 8a7 7 0 0 1 14 0',
  },
  {
    label: 'Chat',
    to: '/admin/chat',
    icon: 'M4 5h16v10H7l-3 3V5z',
  },
  {
    label: 'Reviews',
    to: '/admin/reviews',
    icon: 'M12 3l2 4 4 .5-3 3 .7 4.5-3.7-2-3.7 2 .7-4.5-3-3 4-.5 2-4z',
  },
  {
    label: 'Inquiries',
    to: '/admin/inquiries',
    icon: 'M4 5h16v10H7l-3 3V5z',
  },
]

function AdminLayout() {
  const { data: chatUsersData } = useGetAdminChatUsersQuery(undefined, {
    pollingInterval: 5000,
  })
  const adminUnreadCount = useMemo(() => {
    const items = Array.isArray(chatUsersData) ? chatUsersData : chatUsersData?.data || []
    return items.reduce(
      (sum, item) => sum + Number(item?.unreadForAdmin || 0),
      0,
    )
  }, [chatUsersData])

  return (
    <div className="admin-shell">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <span className="admin-brand-title">Everest Encounter</span>
            <span className="admin-brand-sub">Admin Console</span>
          </div>
          <nav className="admin-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `admin-nav-link${isActive ? ' active' : ''}`
                }
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/80 text-slate-500">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="h-5 w-5"
                    >
                      <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>{item.label}</span>
                </span>
                <span className="flex items-center gap-2 text-xs text-slate-400">
                  {item.to === '/admin/chat' && adminUnreadCount > 0 && (
                    <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {adminUnreadCount > 99 ? '99+' : adminUnreadCount}
                    </span>
                  )}
                  <span>&rarr;</span>
                </span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="admin-main">
          <div className="admin-topbar">
            <div>
              <p className="admin-topbar-sub">Control Center</p>
              <p className="admin-topbar-title">Operations & Performance</p>
            </div>
            <span className="admin-pill">Live</span>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
