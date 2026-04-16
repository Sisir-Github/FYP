import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCheckCircle, HiExclamation } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const VerifyEmail = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();

  // If not logged in, they shouldn't verify this way, but they could have just registered (which logs them in automatically)
  if (!isAuthenticated) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="card p-8 max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-gray-800">Please Log In</h1>
            <p className="text-gray-500 mt-2 mb-6">You must be logged in to verify your email address.</p>
            <button onClick={() => navigate('/login')} className="btn-primary w-full">Go to Login</button>
          </div>
        </div>
     );
  }

  if (user?.isVerified) {
    return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
         <div className="card p-8 max-w-md w-full text-center">
           <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto" />
           <h1 className="text-2xl font-bold text-gray-800 mt-4">Already Verified!</h1>
           <p className="text-gray-500 mt-2 mb-6">Your email address is already verified.</p>
           <button onClick={() => navigate('/dashboard')} className="btn-primary w-full">Go to Dashboard</button>
         </div>
       </div>
    );
  }

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    
    // Only take the last character typed if they try to type multiple
    const digit = value.length > 1 ? value.slice(-1) : value;
    
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Focus previous input on backspace if current is empty
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;
    
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    const focusIndex = pastedData.length < 6 ? pastedData.length : 5;
    inputRefs.current[focusIndex].focus();
  };

  const submitOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter a complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { otp: otpString });
      toast.success(data.message);
      setSuccess(true);
      if (user) {
         updateUser({ ...user, isVerified: true });
      }
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setResending(true);
    try {
      const { data } = await api.post('/auth/resend-otp');
      toast.success(data.message);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 px-4">
      <div className="card p-8 max-w-md w-full text-center">
        {success ? (
          <div className="animate-fade-in">
            <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-heading font-bold text-primary-500 mt-4">Verification Successful!</h1>
            <p className="text-gray-600 text-sm mt-2 mb-6">Your email address has been verified. Redirecting...</p>
          </div>
        ) : (
          <div className="animate-fade-in">
             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiExclamation className="w-8 h-8 text-blue-500" />
             </div>
            <h1 className="text-2xl font-heading font-bold text-gray-800">Verify Your Email</h1>
            <p className="text-gray-500 text-sm mt-2 mb-8">
              We sent a 6-digit verification code to <strong>{user?.email}</strong>. 
              Please enter it below to confirm your account.
            </p>

            <form onSubmit={submitOTP}>
              <div className="flex justify-between gap-2 mb-8" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold bg-white border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                  />
                ))}
              </div>

              <button 
                type="submit" 
                disabled={loading || otp.join('').length < 6}
                className="btn-primary w-full py-3 text-sm font-bold flex justify-center items-center"
              >
                {loading ? <LoadingSpinner size="sm"/> : 'Verify Email'}
              </button>
            </form>

            <div className="mt-8 text-sm text-gray-500">
               Didn't receive the code?{' '}
               <button 
                 onClick={resendOTP} 
                 disabled={resending}
                 className="text-primary-500 font-semibold hover:underline disabled:opacity-50 disabled:no-underline ml-1"
               >
                 {resending ? 'Sending...' : 'Resend OTP'}
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
