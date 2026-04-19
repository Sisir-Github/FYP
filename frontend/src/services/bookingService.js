import api from './api';

const getFilenameFromDisposition = (disposition, fallback) => {
  const match = disposition?.match(/filename="?([^"]+)"?/i);
  return match?.[1] || fallback;
};

const bookingService = {
  getMyBookings: async () => {
    const { data } = await api.get('/bookings/me');
    return data;
  },

  cancelBooking: async (bookingId) => {
    const { data } = await api.patch(`/bookings/${bookingId}/cancel`);
    return data;
  },

  getInvoice: async (bookingId, options = {}) => {
    const { download = false } = options;
    const response = await api.get(`/bookings/${bookingId}/invoice`, {
      params: { download },
      responseType: 'blob',
    });

    return {
      blob: response.data,
      fileName: getFilenameFromDisposition(
        response.headers['content-disposition'],
        `invoice-${bookingId}.pdf`
      ),
    };
  },
};

export default bookingService;
