import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { HiMail } from 'react-icons/hi';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success(data.message || 'Password reset link sent');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 pb-12 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-4">🔑</span>
          <h1 className="text-2xl font-heading font-bold text-primary-500">Forgot Password</h1>
          <p className="text-gray-500 text-sm mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-6 border-2 border-dashed border-green-100 rounded-xl bg-green-50">
            <h3 className="text-綠-600 font-semibold mb-2">Check your email</h3>
            <p className="text-gray-600 text-sm px-4">
              We've sent a password reset link to <strong className="text-gray-800">{email}</strong>
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 text-sm text-accent-500 font-medium hover:underline"
            >
              Try another email address
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-gray-500">
          Remembered your password?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-500 hover:text-primary-600 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
