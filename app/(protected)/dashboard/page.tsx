'use client';

import React from 'react'
import { useAuthContext } from '@/providers/AuthContext';
const DashboardPage = () => {
      const { user:userStatus, logout } = useAuthContext();
  return (
     <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Welcome, {userStatus?.user?.first_name}!</h1>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Email:</span> {userStatus?.user.email}
            </div>
            <div>
              <span className="font-medium">Role:</span> {userStatus?.user?.role }
            </div>
            <div>
              <span className="font-medium">Phone:</span> {userStatus?.user.phone_number}
            </div>
            <div>
              <span className="font-medium">Joined:</span> {new Date(userStatus?.user?.date_joined || '').toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage