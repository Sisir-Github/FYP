import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineBriefcase, HiOutlineCurrencyDollar, HiOutlineLocationMarker } from 'react-icons/hi';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../context/CurrencyContext';

const Dashboard = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingTrips: 0,
    totalSpent: 0,
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const { data } = await api.get('/bookings/me');
        const allBookings = data.data;
        
        const upcomingTrips = allBookings.filter(b => b.status === 'Confirmed' && new Date(b.startDate) > new Date());
        
        const totalSpent = allBookings
          .filter(b => b.paymentStatus === 'Paid')
          .reduce((sum, b) => sum + b.totalAmount, 0);

        setStats({
          totalBookings: allBookings.length,
          upcomingTrips: upcomingTrips.length,
          totalSpent: totalSpent,
          recentBookings: allBookings.slice(0, 3)
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, []);

  if (loading) {
    return <div className="pt-32 pb-20"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="pt-24 pb-16 min-h-[80vh] bg-gray-50">
      <div className="container-custom max-w-5xl">
        
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-800">{t('Welcome back')}, {user?.name.split(' ')[0]}!</h1>
          <p className="text-gray-500 mt-1">{t('Ready for your next adventure in the Himalayas?')}</p>
        </div>

        {/* Top Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
             <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
               <HiOutlineBriefcase className="w-6 h-6" />
             </div>
             <div>
               <p className="text-sm font-medium text-gray-500">{t('Total Bookings')}</p>
               <h3 className="text-2xl font-bold text-gray-800">{stats.totalBookings}</h3>
             </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
             <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-50 text-accent-500 flex items-center justify-center">
               <HiOutlineLocationMarker className="w-6 h-6" />
             </div>
             <div>
               <p className="text-sm font-medium text-gray-500">{t('Upcoming Trips')}</p>
               <h3 className="text-2xl font-bold text-gray-800">{stats.upcomingTrips}</h3>
             </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
             <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
               <HiOutlineCurrencyDollar className="w-6 h-6" />
             </div>
             <div>
               <p className="text-sm font-medium text-gray-500">{t('Total Spent')}</p>
               <h3 className="text-2xl font-bold text-gray-800">{formatPrice(stats.totalSpent)}</h3>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-8">
            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-heading font-bold text-gray-800">{t('Recent Activity')}</h2>
                 <Link to="/my-bookings" className="text-sm font-medium text-accent-500 hover:text-accent-600">{t('View All')}</Link>
              </div>

              {stats.recentBookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t('You have no recent booking activity.')}</p>
                  <Link to="/treks" className="btn-primary mt-4 inline-block">{t('Find a Trek')}</Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {stats.recentBookings.map(b => (
                    <div key={b._id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                       <div className="flex items-center gap-4 pr-4">
                         <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 hidden sm:block">
                           <img src={b.trek?.images?.[0]?.url || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=200&q=80'} className="w-full h-full object-cover" alt="Trek" />
                         </div>
                         <div>
                           <Link to={`/treks/${b.trek?.slug}`} className="font-bold text-gray-800 hover:text-primary-500 transition-colors line-clamp-1">{b.trek?.title}</Link>
                           <p className="text-xs text-gray-500 mt-1">Start: {new Date(b.startDate).toLocaleDateString()}</p>
                         </div>
                       </div>
                       <div className="text-right shrink-0">
                         <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                           {b.status}
                         </span>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-primary-900 rounded-2xl p-6 text-white text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
               <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-accent-500/20 blur-xl"></div>
               <div className="relative z-10">
                 <h3 className="font-heading font-bold text-xl mb-2">{t('Need Assistance?')}</h3>
                 <p className="text-white/80 text-sm mb-6">{t('Our travel experts are ready to help you plan the perfect Himalayan expedition.')}</p>
                 <Link to="/contact" className="btn bg-white text-primary-900 hover:bg-gray-100 w-full">{t('Contact Support')}</Link>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
