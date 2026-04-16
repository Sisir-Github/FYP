import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('loading'); // loading, success, error

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        const { data } = await api.get(`/auth/verify-email/${token}`);
        if (data.success) {
          setStatus('success');
          toast.success(data.message);
          login(data.data.user, data.data.accessToken);
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        }
      } catch (error) {
        setStatus('error');
        toast.error(error.response?.data?.message || 'Verification failed');
      }
    };

    if (token) {
      verifyUserEmail();
    }
  }, [token, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 px-4">
      <div className="card p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <LoadingSpinner size="lg" />
            <h1 className="text-xl font-heading font-bold text-primary-500 mt-4">Verifying Email</h1>
            <p className="text-gray-500 text-sm mt-2">Please wait while we verify your email address...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-xl font-heading font-bold text-primary-500 mt-4">Verification Successful</h1>
            <p className="text-gray-500 text-sm mt-2 mb-6">
              Your email has been verified. You are being redirected to your dashboard...
            </p>
            <Link to="/dashboard" className="btn-primary w-full">
              Go to Dashboard
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <HiXCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h1 className="text-xl font-heading font-bold text-primary-500 mt-4">Verification Failed</h1>
            <p className="text-gray-500 text-sm mt-2 mb-6">
              The verification link is invalid or has expired.
            </p>
            <Link to="/login" className="btn-primary w-full">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
