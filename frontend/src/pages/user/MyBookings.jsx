import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineCalendar,
  HiOutlineUsers,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineDownload,
  HiOutlineXCircle,
} from 'react-icons/hi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import bookingService from '../../services/bookingService';
import {
  canCancelBooking,
  canViewInvoice,
  getBookingStatusClasses,
  getPaymentStatusClasses,
} from '../../utils/booking';
import { useCurrency } from '../../context/CurrencyContext';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState({ bookingId: null, action: null });
  const { formatPrice } = useCurrency();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await bookingService.getMyBookings();
      setBookings(data.data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelTarget) return;

    setCancelLoading(true);
    try {
      await bookingService.cancelBooking(cancelTarget._id);
      toast.success('Booking cancelled successfully');
      setCancelTarget(null);
      await fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleInvoiceAction = async (bookingId, action) => {
    setInvoiceLoading({ bookingId, action });
    try {
      const { blob, fileName } = await bookingService.getInvoice(bookingId, {
        download: action === 'download',
      });

      const fileUrl = URL.createObjectURL(blob);

      if (action === 'view') {
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
        setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
      } else {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(fileUrl);
      }
    } catch (error) {
      let message = 'Failed to generate invoice';

      if (error.response?.data instanceof Blob) {
        try {
          const parsed = JSON.parse(await error.response.data.text());
          message = parsed.message || message;
        } catch {
          message = 'Failed to generate invoice';
        }
      } else {
        message = error.response?.data?.message || message;
      }

      toast.error(message);
    } finally {
      setInvoiceLoading({ bookingId: null, action: null });
    }
  };

  if (loading) {
    return <div className="pt-32 pb-20"><LoadingSpinner /></div>;
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-primary-500">My Bookings</h1>
          <p className="text-gray-500 mt-1">Manage all your trek adventures and payment statuses.</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <span className="text-5xl block mb-4">🥾</span>
            <h3 className="text-xl font-heading font-bold text-gray-800 mb-2">No past or upcoming treks</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't booked any adventures yet!</p>
            <Link to="/treks" className="btn-primary">Explore Packages</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                
                {/* Trek Image Thumbnail */}
                <div className="md:w-1/4 h-48 md:h-auto relative bg-gray-100">
                  <img 
                    src={booking.trek?.images?.[0]?.url || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&q=80'} 
                    alt={booking.trek?.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <span className={`badge border-none ${getBookingStatusClasses(booking.status, 'solid')}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="p-6 md:w-3/4 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-gray-800 hover:text-primary-500 transition-colors">
                        <Link to={`/treks/${booking.trek?.slug}`}>{booking.trek?.title}</Link>
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">Booking ID: {booking._id}</p>
                      {booking.invoiceNumber && (
                        <p className="text-xs text-primary-500 mt-1 font-medium">Invoice: {booking.invoiceNumber}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                      <p className="text-xl font-bold text-primary-500">{formatPrice(booking.totalAmount)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                        <HiOutlineCalendar /> Start Date
                      </div>
                      <p className="font-semibold text-gray-800">{new Date(booking.startDate).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                        <HiOutlineUsers /> Travelers
                      </div>
                      <p className="font-semibold text-gray-800">{booking.participants} Person(s)</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                        <HiOutlineClock /> Duration
                      </div>
                      <p className="font-semibold text-gray-800">{booking.trek?.duration} Days</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                        <HiOutlineCheckCircle /> Payment
                      </div>
                      <p className={`font-semibold ${getPaymentStatusClasses(booking.paymentStatus, 'text')}`}>
                        {booking.paymentStatus} ({booking.paymentMethod})
                      </p>
                    </div>
                  </div>

                  {/* Actions/Footer */}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                      {booking.cancelledAt && (
                        <p className="text-xs text-red-500 mt-1">
                          Cancelled on {new Date(booking.cancelledAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap justify-end gap-3">
                      {booking.paymentStatus === 'Unpaid' && booking.paymentMethod === 'Khalti' && booking.status !== 'Cancelled' && (
                        <button 
                          onClick={() => toast('Payment resumption will be available via Khalti portal directly.')}
                          className="btn-outline btn-sm"
                        >
                          Retry Payment
                        </button>
                      )}
                      {canViewInvoice(booking) && (
                        <>
                          <button
                            onClick={() => handleInvoiceAction(booking._id, 'view')}
                            disabled={invoiceLoading.bookingId === booking._id}
                            className="btn-outline btn-sm"
                          >
                            <HiOutlineDocumentText />
                            {invoiceLoading.bookingId === booking._id && invoiceLoading.action === 'view'
                              ? 'Opening...'
                              : 'View Invoice'}
                          </button>
                          <button
                            onClick={() => handleInvoiceAction(booking._id, 'download')}
                            disabled={invoiceLoading.bookingId === booking._id}
                            className="btn-outline btn-sm"
                          >
                            <HiOutlineDownload />
                            {invoiceLoading.bookingId === booking._id && invoiceLoading.action === 'download'
                              ? 'Downloading...'
                              : 'Download Invoice'}
                          </button>
                        </>
                      )}
                      {canCancelBooking(booking) && (
                        <button
                          onClick={() => setCancelTarget(booking)}
                          className="btn btn-sm bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <HiOutlineXCircle />
                          Cancel Booking
                        </button>
                      )}
                      {booking.status === 'Confirmed' && (
                        <button className="btn-primary btn-sm bg-green-500 border-none hover:bg-green-600">
                          Download Itinerary
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        title="Cancel this booking?"
        message={
          cancelTarget
            ? `This will mark your booking for ${cancelTarget.trek?.title || 'this trek'} as cancelled. Paid bookings stay on record and can still be referenced for invoices or refund handling.`
            : ''
        }
        confirmLabel="Yes, Cancel Booking"
        cancelLabel="Keep Booking"
        confirmTone="danger"
        loading={cancelLoading}
        onConfirm={handleCancelBooking}
        onClose={() => !cancelLoading && setCancelTarget(null)}
      />
    </div>
  );
};

export default MyBookings;
