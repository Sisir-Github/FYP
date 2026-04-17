import { useState, useEffect } from 'react';
import { HiOutlineBell, HiOutlineUserGroup, HiOutlineTicket, HiOutlineStar } from 'react-icons/hi';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';

const AdminNotifications = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const [usersRes, bookingsRes, reviewsRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/bookings'),
          api.get('/reviews')
        ]);

        const recentUsers = (usersRes.data.data || []).map(u => ({
          id: u._id,
          type: 'USER',
          title: t('New User Registered'),
          desc: `${u.name} (${u.email})`,
          time: new Date(u.createdAt),
          icon: HiOutlineUserGroup,
          color: 'blue'
        }));

        const recentBookings = (bookingsRes.data.data || []).map(b => ({
          id: b._id,
          type: 'BOOKING',
          title: t('New Booking Received'),
          desc: `${b.user?.name} booked ${b.trek?.title}`,
          time: new Date(b.createdAt),
          icon: HiOutlineTicket,
          color: 'green'
        }));

        const recentReviews = (reviewsRes.data.data || []).map(r => ({
          id: r._id,
          type: 'REVIEW',
          title: t('New Review Posted'),
          desc: `${r.user?.name} gave ${r.rating} stars to ${r.trek?.title}`,
          time: new Date(r.createdAt),
          icon: HiOutlineStar,
          color: 'orange'
        }));

        const combined = [...recentUsers, ...recentBookings, ...recentReviews]
          .sort((a, b) => b.time - a.time)
          .slice(0, 20);

        setNotifications(combined);
      } catch (error) {
        console.error('Failed to fetch activity feed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [t]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <HiOutlineBell className="text-accent-500" /> {t('System Notifications')}
          </h1>
          <p className="text-sm text-gray-500">{t('Real-time updates on site activity and user interactions.')}</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-gray-100 hidden sm:block"></div>
        
        <div className="space-y-6">
          {notifications.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 text-gray-500">
              {t('No recent activity recorded.')}
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="relative flex items-start gap-4 sm:gap-6 group">
                <div className={`w-16 h-16 rounded-2xl bg-${n.color}-50 text-${n.color}-500 flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110 shadow-sm border border-${n.color}-100`}>
                   <n.icon className="w-8 h-8" />
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex-1 hover:border-accent-200 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-800">{n.title}</h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {n.time.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{n.desc}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                      {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
