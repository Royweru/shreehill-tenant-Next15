
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/providers/AuthContext';


const ProtectedLayout = ({children}:{
    children:React.ReactNode
}) => {
    const { isAuthenticated, isLoading } = useAuthContext();
    const router   = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
 
}

export default ProtectedLayout