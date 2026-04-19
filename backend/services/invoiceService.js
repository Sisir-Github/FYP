const PDFDocument = require('pdfkit');

const { isInvoiceEligible } = require('../utils/bookingRules');

const COMPANY_DETAILS = {
  name: 'Everest Encounter Treks & Expedition Pvt. Ltd.',
  shortName: 'Everest Encounter Treks',
  address: 'Thamel, Kathmandu, Nepal',
  email: 'info@everestencounter.com',
  phone: '+977-1-234567890',
};

const CURRENCY_SYMBOLS = {
  NPR: 'Rs.',
  USD: '$',
  EUR: 'EUR ',
  GBP: 'GBP ',
  INR: 'Rs.',
  AUD: 'AUD ',
};

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));

const formatMoney = (amount, currency = 'NPR') => {
  const symbol = CURRENCY_SYMBOLS[currency] || `${currency} `;
  const numericValue = Number(amount || 0);
  const formattedAmount = Number.isInteger(numericValue)
    ? numericValue.toLocaleString('en-US')
    : numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  return `${symbol}${formattedAmount}`;
};

const buildInvoiceNumber = (booking) => {
  const bookingDate = new Date(booking.createdAt || Date.now()).toISOString().slice(0, 10).replace(/-/g, '');
  const bookingSuffix = String(booking._id).slice(-6).toUpperCase();
  return `EET-${bookingDate}-${bookingSuffix}`;
};

const ensureInvoiceMetadata = async (booking, options = {}) => {
  if (!booking || !isInvoiceEligible(booking)) {
    return booking;
  }

  let changed = false;

  if (!booking.invoiceNumber) {
    booking.invoiceNumber = buildInvoiceNumber(booking);
    changed = true;
  }

  if (!booking.invoiceIssuedAt) {
    booking.invoiceIssuedAt = booking.updatedAt || booking.createdAt || new Date();
    changed = true;
  }

  if (changed && options.save !== false && typeof booking.save === 'function') {
    await booking.save();
  }

  return booking;
};

const ensureInvoiceMetadataForMany = async (bookings) => {
  await Promise.all(bookings.map((booking) => ensureInvoiceMetadata(booking)));
  return bookings;
};

const getInvoiceFileName = (booking) => `${booking.invoiceNumber || buildInvoiceNumber(booking)}.pdf`;

const buildAmountRows = (booking) => {
  const displayCurrency = booking.displayCurrency || 'NPR';
  const displayTotal = booking.displayAmount || booking.totalAmount || 0;
  const unitDisplayAmount = booking.participants > 0 ? displayTotal / booking.participants : displayTotal;

  const rows = [
    {
      label: `Unit price (${displayCurrency})`,
      amount: formatMoney(unitDisplayAmount, displayCurrency),
    },
    {
      label: 'Travelers',
      amount: `${booking.participants}`,
    },
    {
      label: `Display total (${displayCurrency})`,
      amount: formatMoney(displayTotal, displayCurrency),
    },
  ];

  if (displayCurrency !== 'NPR') {
    rows.push({
      label: 'Settlement total (NPR)',
      amount: formatMoney(booking.totalAmount, 'NPR'),
    });
  }

  return rows;
};

const writeLabelValue = (doc, label, value, x, y, valueX) => {
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor('#64748b')
    .text(label, x, y)
    .font('Helvetica')
    .fillColor('#0f172a')
    .text(value, valueX, y, { width: 180 });
};

const generateInvoicePdfBuffer = async (booking) => {
  await ensureInvoiceMetadata(booking);

  const doc = new PDFDocument({
    size: 'A4',
    margin: 48,
  });

  const chunks = [];

  return new Promise((resolve, reject) => {
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const displayCurrency = booking.displayCurrency || 'NPR';
    const displayTotal = booking.displayAmount || booking.totalAmount;
    const unitDisplayAmount = booking.participants > 0 ? displayTotal / booking.participants : displayTotal;
    const paymentReference = booking.transactionId || booking.paymentId || 'N/A';

    doc
      .fillColor('#1e3a5f')
      .font('Helvetica-Bold')
      .fontSize(24)
      .text(COMPANY_DETAILS.shortName, 48, 50);

    doc
      .fillColor('#64748b')
      .font('Helvetica')
      .fontSize(10)
      .text(COMPANY_DETAILS.address, 48, 82)
      .text(COMPANY_DETAILS.phone, 48, 96)
      .text(COMPANY_DETAILS.email, 48, 110);

    doc
      .fillColor('#e8612d')
      .font('Helvetica-Bold')
      .fontSize(22)
      .text('INVOICE', 380, 50, { align: 'right' });

    writeLabelValue(doc, 'Invoice No', booking.invoiceNumber, 360, 86, 445);
    writeLabelValue(doc, 'Invoice Date', formatDate(booking.invoiceIssuedAt), 360, 102, 445);
    writeLabelValue(doc, 'Booking ID', String(booking._id), 360, 118, 445);

    doc
      .moveTo(48, 150)
      .lineTo(547, 150)
      .strokeColor('#e2e8f0')
      .stroke();

    doc
      .fillColor('#1e293b')
      .font('Helvetica-Bold')
      .fontSize(12)
      .text('Billed To', 48, 172);

    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor('#334155')
      .text(booking.user?.name || 'Customer', 48, 192)
      .text(booking.user?.email || 'No email provided', 48, 206)
      .text(booking.user?.phone || 'Phone not provided', 48, 220);

    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .fillColor('#1e293b')
      .text('Booking Details', 300, 172);

    writeLabelValue(doc, 'Package', booking.trek?.title || 'Trek package', 300, 192, 392);
    writeLabelValue(doc, 'Travel Date', formatDate(booking.startDate), 300, 208, 392);
    writeLabelValue(doc, 'Travelers', `${booking.participants}`, 300, 224, 392);
    writeLabelValue(doc, 'Payment Method', booking.paymentMethod || 'N/A', 300, 240, 392);
    writeLabelValue(doc, 'Payment Status', booking.paymentStatus || 'N/A', 300, 256, 392);
    writeLabelValue(doc, 'Booking Status', booking.status || 'N/A', 300, 272, 392);
    writeLabelValue(doc, 'Payment Ref', paymentReference, 300, 288, 392);

    doc
      .roundedRect(48, 328, 499, 34, 8)
      .fill('#f8fafc');

    doc
      .fillColor('#475569')
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('Description', 62, 340)
      .text('Amount', 470, 340, { width: 60, align: 'right' });

    const amountRows = buildAmountRows(booking);
    let currentY = 376;

    amountRows.forEach((row) => {
      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#334155')
        .text(row.label, 62, currentY, { width: 360 })
        .text(row.amount, 440, currentY, { width: 90, align: 'right' });

      currentY += 24;
    });

    doc
      .moveTo(340, currentY + 4)
      .lineTo(547, currentY + 4)
      .strokeColor('#cbd5e1')
      .stroke();

    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .fillColor('#0f172a')
      .text('Total', 360, currentY + 16)
      .text(formatMoney(booking.totalAmount, 'NPR'), 430, currentY + 16, {
        width: 100,
        align: 'right',
      });

    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor('#64748b')
      .text(
        `Quoted display amount: ${formatMoney(displayTotal, displayCurrency)}${displayCurrency !== 'NPR' ? ` | Conversion used: ${booking.conversionRateUsed || 1}` : ''}`,
        48,
        currentY + 48
      );

    if (booking.status === 'Cancelled') {
      doc
        .roundedRect(48, currentY + 76, 499, 44, 8)
        .fill('#fef2f2')
        .fillColor('#b91c1c')
        .font('Helvetica-Bold')
        .fontSize(10)
        .text('This booking has been cancelled.', 62, currentY + 90);
    }

    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor('#64748b')
      .text(
        `Generated for ${COMPANY_DETAILS.name}. This invoice reflects the booking and payment state recorded in the system on ${formatDate(new Date())}.`,
        48,
        730,
        {
          width: 499,
          align: 'center',
        }
      );

    doc.end();
  });
};

module.exports = {
  COMPANY_DETAILS,
  buildInvoiceNumber,
  ensureInvoiceMetadata,
  ensureInvoiceMetadataForMany,
  generateInvoicePdfBuffer,
  getInvoiceFileName,
  formatDate,
  formatMoney,
};
