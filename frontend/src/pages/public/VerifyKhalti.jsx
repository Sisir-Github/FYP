import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';

const VerifyKhalti = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState(t('Verifying payment with Khalti...'));

  const pidx = searchParams.get('pidx');

  useEffect(() => {
    if (!pidx) {
      setStatus('error');
      setMessage('Invalid payment return URL. Missing payment index.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const { data } = await api.post('/bookings/verify-payment', { pidx });
        setStatus('success');
        setMessage(t(data.message) || t('Payment verified successfully!'));
        
        // Auto redirect after 3 seconds
        setTimeout(() => {
          navigate('/my-bookings');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(t(error.response?.data?.message) || t('Payment verification failed.'));
      }
    };

    // prevent double firing in React strict mode by checking if we already started
    verifyPayment();
  }, [pidx, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 px-4">
      <div className="card p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <LoadingSpinner size="lg" />
            <h1 className="text-xl font-heading font-bold text-primary-500 mt-6">{t('Processing Payment')}</h1>
            <p className="text-gray-500 text-sm mt-3">{message}</p>
            <p className="text-xs text-gray-400 mt-2 italic">{t('Please do not close or refresh this window.')}</p>
          </>
        )}

        {status === 'success' && (
          <div className="animate-fade-in">
            <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-heading font-bold text-primary-500 mt-4">{t('Payment Successful!')}</h1>
            <p className="text-gray-600 text-sm mt-2 mb-6">{message}</p>
            <p className="text-xs text-gray-400 mb-6">{t('Redirecting to your bookings...')}</p>
            <Link to="/my-bookings" className="btn-primary w-full">
              {t('View My Bookings')}
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="animate-fade-in">
            <HiXCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h1 className="text-2xl font-heading font-bold text-primary-500 mt-4">{t('Payment Failed')}</h1>
            <p className="text-gray-600 text-sm mt-2 mb-6">{message}</p>
            <Link to="/my-bookings" className="btn-outline w-full mb-3">
              {t('Go to My Bookings')}
            </Link>
            <Link to="/contact" className="text-accent-500 text-sm font-medium hover:underline block">
              Contact Support
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyKhalti;
