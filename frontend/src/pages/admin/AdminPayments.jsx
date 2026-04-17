import { useState, useEffect } from 'react';
import { HiOutlineCreditCard, HiOutlineDownload, HiOutlineCheckCircle } from 'react-icons/hi';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../context/CurrencyContext';

const AdminPayments = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await api.get('/bookings');
        // Filter for paid bookings
        const paidBookings = data.data.filter(b => b.paymentStatus === 'Paid');
        setPayments(paidBookings);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('Payment Transactions')}</h1>
          <p className="text-sm text-gray-500">{t('Track and monitor all successful payments through Khalti.')}</p>
        </div>
        <button className="btn outline flex items-center gap-2 text-sm">
          <HiOutlineDownload /> {t('Export CSV')}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">{t('Transaction ID')}</th>
                <th className="px-6 py-4 font-semibold">{t('Customer')}</th>
                <th className="px-6 py-4 font-semibold">{t('Amount')}</th>
                <th className="px-6 py-4 font-semibold">{t('Method')}</th>
                <th className="px-6 py-4 font-semibold">{t('Date')}</th>
                <th className="px-6 py-4 font-semibold text-center">{t('Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400 italic">
                    {t('No payment transactions found.')}
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-[10px] text-gray-400">
                      {payment.transactionId || payment._id.substring(0, 10).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800">{payment.user?.name}</p>
                      <p className="text-[10px] text-gray-400">{payment.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary-500">
                      {formatPrice(payment.totalAmount)}
                    </td>
                    <td className="px-6 py-4 uppercase font-medium text-[10px]">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(payment.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase">
                        <HiOutlineCheckCircle className="w-3 h-3" />
                        {t('Verified')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
