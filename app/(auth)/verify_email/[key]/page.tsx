'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function VerifyEmailPage() {
  const { key } = useParams();
  const router = useRouter();
  const { verifyEmail, isVerifying, verificationError, verificationData } = useAuth();

  useEffect(() => {
    if (key && typeof key === 'string') {
      verifyEmail(key);
    }
  }, [key, verifyEmail]);

  useEffect(() => {
    // If verification is successful, redirect to login with email pre-filled
    if (verificationData && !verificationError) {
      setTimeout(() => {
        const email = verificationData.user_email;
        // Pass email as query parameter to auto-fill login form
        router.push(`/auth?verified=true&email=${encodeURIComponent(email || '')}`);
      }, 3000);
    }
  }, [verificationData, verificationError, router]);

  if (!key) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid Verification Link</h1>
          <p className="text-gray-600">The verification link is invalid or missing.</p>
        </div>
      </div>
    );
  }

  if (verificationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h1>
          <p className="text-gray-600 mb-6">
            {(verificationError as any)?.response?.data?.detail || 'Email verification failed. The link may be expired or invalid.'}
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="relative mb-6">
            <div className="animate-spin w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl">📧</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifying Your Email</h1>
          <p className="text-gray-600 mb-4">Please wait while we verify your email address...</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
        <div className="text-green-500 text-5xl mb-4 animate-bounce">✅</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Verified!</h1>
        <p className="text-gray-600 mb-6">
          Your email has been successfully verified. You'll be redirected to login with your email pre-filled.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-700 text-sm">
            Redirecting to login page in a few seconds...
          </p>
          {verificationData?.user_email && (
            <p className="text-green-600 text-xs mt-1">
              Email: {verificationData.user_email}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            const email = verificationData?.user_email;
            router.push(`/auth/login?verified=true&email=${encodeURIComponent(email || '')}`);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full"
        >
          Continue to Login
        </button>
      </div>
    </div>
  );
}