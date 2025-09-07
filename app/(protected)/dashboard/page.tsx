'use client';

import React from 'react'
import { useAuthContext } from '@/providers/AuthContext';
import { redirect } from 'next/navigation';
import { FullScreenLoading } from '@/components/ui/loadingSpinner';

const DashboardPage = () => {
     const{user, isLoading, isAuthenticated} =useAuthContext();
      if(isLoading) return <FullScreenLoading />
     if(!isLoading&&!isAuthenticated) return redirect('/auth')
      return redirect('/dashboard/overview/')
}

export default DashboardPage