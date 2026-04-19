const normalizeUtcDay = (value) => {
  const date = new Date(value);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

export const canCancelBooking = (booking) => {
  if (!booking) return false;
  if (booking.status === 'Cancelled' || booking.status === 'Completed') return false;
  if (!['Pending', 'Confirmed'].includes(booking.status)) return false;

  const today = normalizeUtcDay(new Date());
  const travelDate = normalizeUtcDay(booking.startDate);

  return travelDate > today;
};

export const canViewInvoice = (booking) =>
  Boolean(
    booking?.invoiceNumber ||
      booking?.paymentStatus === 'Paid' ||
      booking?.paymentStatus === 'Refunded' ||
      ['Confirmed', 'Completed'].includes(booking?.status)
  );

export const getBookingStatusClasses = (status, variant = 'soft') => {
  const styles = {
    Confirmed: {
      soft: 'bg-green-100 text-green-700',
      solid: 'bg-green-500 text-white border-green-600',
    },
    Cancelled: {
      soft: 'bg-red-100 text-red-700',
      solid: 'bg-red-500 text-white border-red-600',
    },
    Completed: {
      soft: 'bg-blue-100 text-blue-700',
      solid: 'bg-blue-500 text-white border-blue-600',
    },
    Pending: {
      soft: 'bg-amber-100 text-amber-700',
      solid: 'bg-accent-500 text-white border-accent-600',
    },
  };

  return styles[status]?.[variant] || styles.Pending[variant];
};

export const getPaymentStatusClasses = (status, variant = 'soft') => {
  const styles = {
    Paid: {
      soft: 'bg-green-50 text-green-700 border-green-200',
      text: 'text-green-600',
    },
    Refunded: {
      soft: 'bg-orange-50 text-orange-700 border-orange-200',
      text: 'text-orange-600',
    },
    Unpaid: {
      soft: 'bg-gray-50 text-gray-600 border-gray-200',
      text: 'text-accent-500',
    },
  };

  return styles[status]?.[variant] || styles.Unpaid[variant];
};

export const getWhatsAppUrl = (rawNumber) => {
  const sanitizedNumber = String(rawNumber || '').replace(/\D/g, '');
  return sanitizedNumber ? `https://wa.me/${sanitizedNumber}` : '';
};
