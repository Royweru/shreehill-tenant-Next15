'use client'

import { getPageTitle, NotificationItem, notifications } from '@/constants'
import { cn } from '@/lib/utils'
import { Bell, ChevronDown, Search, Settings, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'

export const DesktopHeader = ({
    isScrolled,
     setShowNotifications,
     showNotifications,
  
     user:UserStatus,
     showProfile,
     setShowProfile
}:{

    user:UserStatus|null,
    showNotifications:boolean,
    setShowNotifications:(showNotification:boolean)=>void,
    isScrolled:boolean,
    showProfile:boolean,
    setShowProfile:(showProfile:boolean)=>void
}) => {
    const pathname = usePathname()
  return (
     <div 
          className={cn(
            "hidden lg:flex items-center justify-between transition-all duration-300 ease-in-out px-8 py-5",
            isScrolled 
              ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-emerald-100/50" 
              : "bg-white/80 backdrop-blur-sm"
          )}
        >
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {getPageTitle(pathname)}
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Welcome back to Shreehill Estates
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 ml-8">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100/50">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <div className="text-xs">
                  <p className="text-gray-500">Balance</p>
                  <p className="font-semibold text-emerald-600">KES 0</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100/50">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="text-xs">
                  <p className="text-gray-500">Next Due</p>
                  <p className="font-semibold text-blue-600">Dec 1st</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Enhanced Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties, payments..."
                className="pl-10 pr-4 py-2.5 w-64 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 text-sm backdrop-blur-sm"
              />
            </div>

            {/* Enhanced Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:from-emerald-50 hover:to-blue-50 hover:border-emerald-200 text-gray-600 hover:text-emerald-600 transition-all duration-300 hover:shadow-md hover:shadow-emerald-500/10"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white shadow-lg"></span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full font-medium">
                        {notifications.length} new
                      </span>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:shadow-md hover:shadow-emerald-500/10 transition-all duration-300 border border-transparent hover:border-emerald-200/50"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">
                    {UserStatus?.profile?.first_name?.charAt(0) || 'U'}{UserStatus?.profile?.last_name?.charAt(0) || 'S'}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {UserStatus?.profile?.first_name || 'User'} {UserStatus?.profile?.last_name || ''}
                  </p>
                  <p className="text-xs text-gray-500">Tenant</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-sm">
                          {UserStatus?.profile.first_name?.charAt(0) || 'U'}{UserStatus?.profile.last_name?.charAt(0) || 'S'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {UserStatus?.profile.first_name || 'UserStatus'} {UserStatus?.profile.last_name || ''}
                        </p>
                        <p className="text-sm text-gray-500">{UserStatus?.profile.email || 'user@example.com'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-emerald-50/50 hover:text-emerald-700 transition-colors duration-200 flex items-center gap-3">
                      <User className="h-4 w-4" />
                      Profile Settings
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-emerald-50/50 hover:text-emerald-700 transition-colors duration-200 flex items-center gap-3">
                      <Settings className="h-4 w-4" />
                      Account Preferences
                    </button>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button className="w-full px-4 py-2.5 text-center text-sm font-medium text-red-600 hover:bg-red-50/50 rounded-xl transition-colors duration-200">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
  )
}
