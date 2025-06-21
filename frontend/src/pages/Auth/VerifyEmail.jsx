import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FiCheckCircle, FiXCircle, FiLoader, FiMail } from 'react-icons/fi';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState({
    loading: true,
    success: null,
    message: 'Verifying your email...',
    email: searchParams.get('email') || ''
  });

  useEffect(() => {
    const verifyEmailToken = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus({
          loading: false,
          success: false,
          message: 'Invalid verification link. Please check your email for the complete link.',
          email
        });
        return;
      }

      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
        const response = await axios.get(`${baseUrl}/auth/verify-email`, {
          params: { token, email }
        });

        setStatus({
          loading: false,
          success: true,
          message: 'Verification completed. You can now sign in.',
          email
        });
      } catch (error) {
        console.error('Verification error:', error);

        let errorMessage = 'Verification failed. The token may be invalid or expired.';
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        setStatus({
          loading: false,
          success: false,
          message: errorMessage,
          email
        });
      }
    };

    verifyEmailToken();
  }, [searchParams]);

  const StatusIcon = () => {
    if (status.loading) return <FiLoader className="animate-spin" size={48} />;
    if (status.success) return <FiCheckCircle size={48} className="text-green-500" />;
    return <FiXCircle size={48} className="text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-center">
          <FiMail className="mx-auto text-white" size={40} />
          <h1 className="text-xl font-bold text-white mt-2">Email Verification</h1>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <StatusIcon />
            <h2 className={`text-xl font-semibold ${
              status.loading ? 'text-blue-600' :
              status.success ? 'text-green-600' : 'text-red-600'
            }`}>
              {status.loading ? 'Verifying...' :
               status.success ? 'Success!' : 'Verification Failed'}
            </h2>
            <p className="text-gray-700 text-center">{status.message}</p>
            {status.email && (
              <p className="text-gray-500 text-sm">{status.email}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
