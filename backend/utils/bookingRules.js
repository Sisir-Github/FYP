const normalizeUtcDay = (value) => {
  const date = new Date(value);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

const getBookingCancellationEligibility = (booking) => {
  if (!booking) {
    return {
      canCancel: false,
      reason: 'Booking not found.',
    };
  }

  if (booking.status === 'Cancelled') {
    return {
      canCancel: false,
      reason: 'This booking has already been cancelled.',
    };
  }

  if (booking.status === 'Completed') {
    return {
      canCancel: false,
      reason: 'Completed bookings can no longer be cancelled.',
    };
  }

  if (!['Pending', 'Confirmed'].includes(booking.status)) {
    return {
      canCancel: false,
      reason: `Bookings with status "${booking.status}" cannot be cancelled.`,
    };
  }

  const today = normalizeUtcDay(new Date());
  const travelDate = normalizeUtcDay(booking.startDate);

  if (travelDate <= today) {
    return {
      canCancel: false,
      reason: 'Bookings can only be cancelled before the travel date.',
    };
  }

  return {
    canCancel: true,
    reason: null,
  };
};

const isInvoiceEligible = (booking) =>
  Boolean(
    booking?.invoiceNumber ||
      booking?.paymentStatus === 'Paid' ||
      booking?.paymentStatus === 'Refunded' ||
      ['Confirmed', 'Completed'].includes(booking?.status)
  );

module.exports = {
  normalizeUtcDay,
  getBookingCancellationEligibility,
  isInvoiceEligible,
};
