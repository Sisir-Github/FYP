import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineCurrencyDollar, HiOutlineUsers, HiOutlineMap, HiOutlineTicket } from 'react-icons/hi';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useCurrency } from '../../context/CurrencyContext';

const AdminDashboard = () => {
  const { formatPrice } = useCurrency();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data.data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="h-64 flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-800">Admin Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <HiOutlineCurrencyDollar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{t?.('Total Revenue') || 'Total Revenue'}</p>
            <h3 className="text-2xl font-bold text-gray-800">{formatPrice(stats?.totalRevenue || 0)}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
            <HiOutlineTicket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats?.totalBookings || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
            <HiOutlineUsers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats?.totalUsers || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            <HiOutlineMap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Trek Packages</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats?.totalTreks || 0}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-heading font-bold text-gray-800 flex items-center gap-2">
               Recent Bookings
            </h3>
            <Link to="/admin/bookings" className="text-sm text-accent-500 hover:text-accent-600 font-medium">View All</Link>
          </div>
          {stats?.recentBookings?.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {stats.recentBookings.map(b => (
                <div key={b._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{b.user?.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">Booked: {b.trek?.title}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary-500">{formatPrice(b.totalAmount)}</p>
                    <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full ${
                      b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-gray-500">No recent bookings</div>
          )}
        </div>

        {/* Quick Actions (Phase placeholder UI) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <h3 className="font-heading font-bold text-gray-800 mb-6">Quick Actions</h3>
           <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/treks/add" className="p-4 border border-gray-100 hover:border-primary-500 rounded-xl flex flex-col items-center justify-center gap-3 text-center transition-colors group">
                <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  <HiOutlineMap className="w-5 h-5"/>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-500">Create Trek</span>
              </Link>
              <Link to="/admin/bookings" className="p-4 border border-gray-100 hover:border-accent-500 rounded-xl flex flex-col items-center justify-center gap-3 text-center transition-colors group">
                <div className="w-10 h-10 rounded-full bg-accent-50 text-accent-500 flex items-center justify-center group-hover:bg-accent-500 group-hover:text-white transition-colors">
                  <HiOutlineTicket className="w-5 h-5"/>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-accent-500">View Bookings</span>
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
