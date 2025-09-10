'use client'
import React, { useState, useEffect, Suspense } from 'react';
import { redirect, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Home, Mail, Lock, User, Phone, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Separate component that uses useSearchParams
function AuthPagesContent() {
  const searchParams = useSearchParams();
  const {login, isLoggingIn , register, isRegistering,isAuthenticated} = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);

  interface AuthFormData {
      email: string;
      password: string;
      confirmPassword?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
  }
  
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '', 
    firstName: '',
    lastName: '',
    phone: ''
  });

  // Handle URL parameters on component mount
  useEffect(() => {
    const verified = searchParams.get('verified');
    const email = searchParams.get('email');
    
    if (verified === 'true') {
      setShowVerificationSuccess(true);
      setIsLogin(true); // Switch to login mode
      
      // Pre-fill email if provided
      if (email) {
        setFormData(prev => ({
          ...prev,
          email: decodeURIComponent(email)
        }));
      }
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowVerificationSuccess(false);
      }, 5000);
    }
  }, [searchParams]);



  interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleInputChange = (e: InputChangeEvent) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value
      });
  };

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login ({
        email: formData.email,
        password: formData.password
      });
     
    }else{
      register({
        email: formData.email,
        password1: formData.password,
        password2: formData.confirmPassword as string,
        first_name: formData.firstName as string,
        last_name: formData.lastName as string,
        phone_number:formData.phone as string,
    });
  };
}

if(isAuthenticated) return redirect('/dashboard')
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Image with Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/auth.jpg')`
          }}
        ></div>
        
        {/* Gradient Overlay - using Shreehill colors */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(44, 85, 48, 0.8) 0%, rgba(44, 85, 48, 0.4) 50%, rgba(27, 75, 115, 0.3) 100%)`
          }}
        ></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{backgroundColor: '#2C5530'}}
            >
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Shreehill Estates</h1>
              <p className="text-white/90 text-sm">Your Dream Home Awaits</p>
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <div>
              <h2 className="text-5xl font-bold leading-tight mb-4">
                Welcome to your sweet home
              </h2>
              <p className="text-xl text-white/90 mb-2">
                Manage your living like a pro
              </p>
              <p className="text-lg text-white/80">
                visits in just a few clicks
              </p>
            </div>
            
            {/* Dots indicator - using gold accent */}
            <div className="flex space-x-2">
              <div 
                className="w-8 h-1 rounded-full"
                style={{backgroundColor: '#D4A574'}}
              ></div>
              <div className="w-2 h-1 bg-white/50 rounded-full"></div>
              <div className="w-2 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>

          {/* Bottom space */}
          <div></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div 
        className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12"
        style={{backgroundColor: '#F8F6F0'}}
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{backgroundColor: '#2C5530'}}
            >
              <Home className="w-5 h-5 text-white" />
            </div>
            <span 
              className="text-xl font-bold"
              style={{color: '#2C5530'}}
            >
              Shreehill Estates
            </span>
          </div>

          {/* Email Verification Success Banner */}
          {showVerificationSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-green-800 font-medium text-sm">Email Verified Successfully!</p>
                  <p className="text-green-700 text-xs">Your email has been confirmed. Please enter your password to continue.</p>
                </div>
              </div>
            </div>
          )}

          {/* Welcome Header */}
          <div className="mb-8 text-center">
            <h3 
              className="text-3xl font-bold mb-2"
              style={{color: '#2C5530'}}
            >
              {isLogin ? 'Welcome Back to Shreehill!' : 'Join Shreehill Estates'}
            </h3>
            <p style={{color: '#666666'}}>
              {isLogin ? 'Sign in your account' : 'Create your account to get started'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: '#333333'}}>
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{color: '#666666'}} />
                    <input
                      type="text"
                      name="firstName"
                      disabled={isLoggingIn || isRegistering}
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-neutral-800 disabled:opacity-50 disabled:pointer-events-none"
                      style={{
                        borderColor: '#E5E1D8',
                        backgroundColor: '#FFFFFF'
                      }}
                      placeholder="John"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: '#333333'}}>
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{color: '#666666'}} />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      disabled={isLoggingIn || isRegistering}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-neutral-800 disabled:opacity-50 disabled:pointer-events-none"
                      style={{
                        borderColor: '#E5E1D8',
                        backgroundColor: '#FFFFFF'
                      }}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#333333'}}>
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 
                  top-1/2 transform -translate-y-1/2 w-5 h-5"
                   style={{color: '#666666'}}
                    />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    disabled={isLoggingIn || isRegistering}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none
                     focus:ring-2 transition-all text-neutral-800 disabled:opacity-50 
                     disabled:pointer-events-none"
                    style={{
                      borderColor: '#E5E1D8',
                      backgroundColor: '#FFFFFF'
                    }}
                    placeholder="+254 700 000 000"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#333333'}}>
                Your Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{color: '#666666'}} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoggingIn || isRegistering}
                  className={`w-full pl-10 pr-4 py-3
                     border rounded-lg focus:outline-none 
                     focus:ring-2 transition-all 
                     text-neutral-800
                      disabled:opacity-50 
                      disabled:pointer-events-none ${
                    showVerificationSuccess ? 'bg-green-50 border-green-300' : ''
                  }`}
                  style={{
                    borderColor: showVerificationSuccess ? '#22C55E' : '#E5E1D8',
                    backgroundColor: showVerificationSuccess ? '#F0FDF4' : '#FFFFFF'
                  }}
                  placeholder="info.example@gmail.com"
                  required
                />
                {showVerificationSuccess && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#333333'}}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{color: '#666666'}} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoggingIn || isRegistering}
                  className="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-neutral-800 disabled:opacity-50 disabled:pointer-events-none"
                  style={{
                    borderColor: '#E5E1D8',
                    backgroundColor: '#FFFFFF'
                  }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" style={{color: '#666666'}} />
                  ) : (
                    <Eye className="w-5 h-5" style={{color: '#666666'}} />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#333333'}}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{color: '#666666'}} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    disabled={isLoggingIn || isRegistering}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-neutral-800 disabled:opacity-50 disabled:pointer-events-none"
                    style={{
                      borderColor: '#E5E1D8',
                      backgroundColor: '#FFFFFF'
                    }}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" style={{color: '#666666'}} />
                    ) : (
                      <Eye className="w-5 h-5" style={{color: '#666666'}} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 focus:ring-2"
                    style={{accentColor: '#2C5530'}}
                  />
                  <span className="ml-2 text-sm" style={{color: '#333333'}}>
                    Remember Me
                  </span>
                </label>
                <a 
                  href="#" 
                  className="text-sm hover:underline"
                  style={{color: '#1B4B73'}}
                >
                  Forgot Password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || isRegistering}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none ${isLoggingIn || isRegistering ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} cursor-pointer`}
              style={{backgroundColor: '#333333'}}
            >
              {isLogin ? 'Login' : 'Create Account'}
              { isLoggingIn || isRegistering ? (
                <span className="ml-2 animate-spin">
                  <svg className="w-5 h-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.293-6.707A8.003 8.003 0 0012 20v4c-6.627 0-12-5.373-12-12h4a7.962 7.962 0 002.293-6.707zM12 4a8 8 0 018 8h4c0-6.627-5.373-12-12-12v4zm6.707 2.293A8.003 8.003 0 0012 4V0c6.627 0 12 5.373 12 12h-4a7.962 7.962 0 00-6.707-2.293z"></path>
                  </svg>
                </span>
              ) : null}
            </button>

            {/* Toggle Login/Signup */}
            <div className="text-center mt-6">
              <p style={{color: '#666666'}}>
                {isLogin ? "Don't have any account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  disabled={isLoggingIn || isRegistering}
                  className="font-semibold hover:underline disabled:pointer-events-none"
                  style={{color: '#1B4B73'}}
                >
                  {isLogin ? 'Register' : 'Sign In'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#F8F6F0'}}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function AuthPages() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <AuthPagesContent />
    </Suspense>
  );
}