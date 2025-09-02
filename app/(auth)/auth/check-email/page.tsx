'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CheckEmailPage() {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    // Implement resend email logic here
    setTimeout(() => {
      setIsResending(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
        <div className="text-blue-500 text-6xl mb-6">📬</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Check Your Email</h1>
        <p className="text-gray-600 mb-6">
          We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-700 text-sm font-medium mb-2">Didn't receive the email?</p>
          <ul className="text-blue-600 text-sm text-left space-y-1">
            <li>• Check your spam/junk folder</li>
            <li>• Make sure the email address is correct</li>
            <li>• Wait a few minutes for delivery</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {isResending ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Resending...
              </span>
            ) : (
              'Resend Verification Email'
            )}
          </button>
          
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}