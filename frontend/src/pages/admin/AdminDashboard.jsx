import { HiUsers, HiCollection, HiClipboardList, HiCurrencyDollar, HiTrendingUp, HiEye } from 'react-icons/hi';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '0', icon: HiUsers, color: 'bg-blue-500', change: '+0%' },
    { title: 'Trek Packages', value: '0', icon: HiCollection, color: 'bg-green-500', change: '+0%' },
    { title: 'Total Bookings', value: '0', icon: HiClipboardList, color: 'bg-purple-500', change: '+0%' },
    { title: 'Revenue', value: 'Rs. 0', icon: HiCurrencyDollar, color: 'bg-accent-500', change: '+0%' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome to the admin panel.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                <HiTrendingUp className="w-3 h-3" /> {stat.change}
              </span>
            </div>
            <p className="text-2xl font-heading font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-heading font-semibold text-gray-800 mb-4">Recent Bookings</h3>
          <div className="text-center py-10 text-gray-400 text-sm">
            No bookings yet. Data will appear here as the system is used.
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-heading font-semibold text-gray-800 mb-4">Recent Users</h3>
          <div className="text-center py-10 text-gray-400 text-sm">
            No users yet. Data will appear here as users register.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
