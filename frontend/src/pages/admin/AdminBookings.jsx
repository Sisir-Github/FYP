import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { HiCheck, HiX } from 'react-icons/hi';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/bookings');
      setBookings(data.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, statusType, newValue) => {
    try {
      await api.put(`/bookings/${id}`, {
        [statusType]: newValue
      });
      toast.success(`${statusType} updated successfully`);
      fetchBookings(); // refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update booking');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you certain you want to remove this booking?')) {
      try {
        await api.delete(`/bookings/${id}`);
        toast.success('Booking deleted successfully');
        fetchBookings();
      } catch (error) {
        toast.error('Failed to delete booking');
      }
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-800">Manage Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">Review, confirm, or cancel user trek bookings.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : bookings.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No bookings found in the system.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4 font-medium rounded-tl-xl">Customer</th>
                  <th className="px-6 py-4 font-medium">Trek Package</th>
                  <th className="px-6 py-4 font-medium">Date & Details</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Payment State</th>
                  <th className="px-6 py-4 font-medium text-right">Booking Status</th>
                  <th className="px-6 py-4 font-medium text-center rounded-tr-xl">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{booking.user?.name}</p>
                      <p className="text-xs text-gray-500">{booking.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                       <p className="font-semibold text-gray-800 line-clamp-1">{booking.trek?.title}</p>
                    </td>
                    <td className="px-6 py-4">
                       <p className="font-medium text-gray-700">{new Date(booking.startDate).toLocaleDateString()}</p>
                       <p className="text-xs text-gray-500">{booking.participants} pax</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      ${booking.totalAmount}
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        className={`text-xs pl-2 pr-6 py-1 rounded-full border border-gray-200 outline-none ${
                          booking.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' :
                          booking.paymentStatus === 'Refunded' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-gray-50 text-gray-600'
                        }`}
                        value={booking.paymentStatus}
                        onChange={(e) => handleStatusChange(booking._id, 'paymentStatus', e.target.value)}
                      >
                        <option value="Unpaid">Unpaid</option>
                        <option value="Paid">Paid</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase">{booking.paymentMethod}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <select 
                        className={`text-xs pl-2 pr-6 py-1 rounded-full border outline-none ${
                          booking.status === 'Confirmed' ? 'bg-green-500 text-white border-green-600' :
                          booking.status === 'Cancelled' ? 'bg-red-500 text-white border-red-600' :
                          booking.status === 'Completed' ? 'bg-blue-500 text-white border-blue-600' :
                          'bg-accent-500 text-white border-accent-600'
                        }`}
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, 'status', e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <button 
                         onClick={() => handleDelete(booking._id)}
                         className="text-red-400 hover:text-red-600 transition-colors"
                         title="Delete Booking"
                       >
                         <HiX className="w-5 h-5 mx-auto" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
