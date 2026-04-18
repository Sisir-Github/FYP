import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {
  HiViewGrid,
  HiUsers,
  HiCollection,
  HiClipboardList,
  HiCreditCard,
  HiStar,
  HiCog,
  HiBell,
  HiLogout,
  HiMenu,
  HiX,
  HiChevronLeft,
  HiChatAlt,
  HiNewspaper,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import NotificationDropdown from '../admin/NotificationDropdown';

const AdminLayout = () => {
  const { t } = useTranslation();
  
  const adminNavItems = [
    { name: t('Dashboard'), path: '/admin', icon: HiViewGrid, end: true },
    { name: t('Users'), path: '/admin/users', icon: HiUsers },
    { name: t('Trek Packages'), path: '/admin/treks', icon: HiCollection },
    { name: t('Bookings'), path: '/admin/bookings', icon: HiClipboardList },
    { name: t('Payments'), path: '/admin/payments', icon: HiCreditCard },
    { name: t('Blogs'), path: '/admin/blogs', icon: HiNewspaper },
    { name: t('Reviews'), path: '/admin/reviews', icon: HiStar },
    { name: t('Notifications'), path: '/admin/notifications', icon: HiBell },
    { name: t('Contact Messages'), path: '/admin/contacts', icon: HiChatAlt },
    { name: t('Settings'), path: '/admin/settings', icon: HiCog },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e3a5f',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-primary-900 text-white transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="text-xl">⛰️</span>
              <div>
                <h2 className="text-sm font-heading font-bold">Admin Panel</h2>
                <p className="text-[9px] text-white/50 tracking-wider uppercase">Everest Encounter</p>
              </div>
            </Link>
            <button
              className="lg:hidden text-white/70 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent-500 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-3 py-4 border-t border-white/10">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              <HiChevronLeft className="w-4 h-4" /> {t('Back to Website')}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-gray-600 hover:text-gray-800"
              onClick={() => setSidebarOpen(true)}
            >
              <HiMenu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-heading font-semibold text-gray-800">
              {t('Admin Dashboard')}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <HiLogout className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
