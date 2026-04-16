import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiClipboardList, HiCreditCard, HiStar, HiUser } from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useAuth();

  const quickLinks = [
    { title: 'My Bookings', desc: 'View your trek bookings', icon: HiClipboardList, path: '/my-bookings', color: 'bg-blue-50 text-blue-600' },
    { title: 'Payments', desc: 'Payment history and receipts', icon: HiCreditCard, path: '/payments', color: 'bg-green-50 text-green-600' },
    { title: 'My Reviews', desc: 'Reviews you have submitted', icon: HiStar, path: '/my-reviews', color: 'bg-yellow-50 text-yellow-600' },
    { title: 'Profile', desc: 'Manage your account', icon: HiUser, path: '/profile', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-primary-500">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's your adventure overview.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link) => (
            <Link key={link.path} to={link.path} className="card p-6 hover:-translate-y-1 transition-all group">
              <div className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center mb-4`}>
                <link.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold text-primary-500 group-hover:text-accent-500 transition-colors">
                {link.title}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
