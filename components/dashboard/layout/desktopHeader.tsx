'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getPageTitle } from '@/constants';
import { cn } from '@/lib/utils';
import { Bell, ChevronDown, Search, Settings, User, X, CheckCircle, Clock } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useNotifications, useNotificationSummary, useUnreadCount, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useBillSummary } from '@/hooks/useBills';


interface DesktopHeaderProps {
  isScrolled: boolean;
  setShowNotifications: (show: boolean) => void;
  showNotifications: boolean;
  user: UserProfile|null;
  showProfile: boolean;
  setShowProfile: (show: boolean) => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  isScrolled,
  setShowNotifications,
  showNotifications,
  user,
  showProfile,
  setShowProfile
}) => {
  const pathname = usePathname();
  const notificationRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch real notification data
  const { data: notificationsData, isLoading: notificationsLoading } = useNotifications({ page: 1 });
  const { data: unreadCount } = useUnreadCount();
  const {data:billSummary} =useBillSummary()
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const notifications = notificationsData?.slice(0, 5) || [];
  const unreadNotifications = notifications.filter(n => !n.is_read);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, setShowNotifications]);

  const getNotificationIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      payment_success: '💳',
      payment_failed: '❌',
      rent_reminder: '📅',
      maintenance_scheduled: '🔧',
      maintenance_completed: '✅',
      bill_generated: '📄',
      overdue_payment: '⚠️',
      welcome: '🏠',
      general: '📢',
      emergency: '🚨',
      community: '👥',
    };
    return iconMap[type] || '🔔';
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsReadMutation.mutateAsync(notification.id);
    }
    
    if (notification.action_url) {
      setShowNotifications(false);
      window.location.href = notification.action_url;
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadNotifications.length > 0) {
      await markAllAsReadMutation.mutateAsync();
    }
  };

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
        <div className="flex items-center justify-center gap-4 ml-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl
           bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100/50">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <div className="text-xs">
              <p className="text-gray-500">Balance</p>
              <p className="font-semibold text-emerald-600">KES 
                <span className=' ml-2'>
               {billSummary?.current_balance}
                </span>
                
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl
           bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100/50">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="text-xs">
              <p className="text-gray-500">Next Due</p>
              <p className="font-semibold text-blue-600">
                {user?.rent_due_day}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 ml-2">
        {/* Enhanced Search */}
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties, payments..."
            className="pl-10 pr-4 py-2.5 w-64 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 text-sm backdrop-blur-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div> */}

        {/* Real Notifications Dropdown */}
        <div className="relative" ref={notificationRef}>
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:from-emerald-50 hover:to-blue-50 hover:border-emerald-200 text-gray-600 hover:text-emerald-600 transition-all duration-300 hover:shadow-md hover:shadow-emerald-500/10"
          >
            <Bell className="w-5 h-5" />
            <AnimatePresence>
              {(unreadCount?.unread_count || 0) > 0 && (
                <>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-medium text-white"
                  >
                    {(unreadCount &&unreadCount?.unread_count > 9) ? '9+' :unreadCount && unreadCount.unread_count}
                  </motion.span>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 rounded-full animate-ping"></span>
                </>
              )}
            </AnimatePresence>
          </Button>

          {/* Enhanced Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 py-2 z-50 max-h-[32rem] overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </h3>
                    <div className="flex items-center gap-2">
                      {unreadNotifications.length > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {unreadNotifications.length} new
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNotifications(false)}
                        className="h-6 w-6 p-0 hover:bg-gray-100"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {unreadNotifications.length > 0 && (
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        {unreadNotifications.length} unread notifications
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllRead}
                        disabled={markAllAsReadMutation.isPending}
                        className="text-xs text-emerald-600 hover:text-emerald-700 h-6"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark all read
                      </Button>
                    </div>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notificationsLoading ? (
                    <div className="p-4 space-y-3">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-8 px-4">
                      <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium mb-1">No notifications yet</p>
                      <p className="text-sm text-gray-400">
                        We'll notify you about payments, maintenance, and updates
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification:Notification, index:number) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                          "flex items-start gap-3 p-3 mx-2 my-1 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50",
                          !notification.is_read && "bg-blue-50/50 border border-blue-100"
                        )}
                      >
                        <div className="flex-shrink-0 text-2xl">
                          {getNotificationIcon(notification.notification_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className={cn(
                              "text-sm font-medium truncate",
                              notification.is_read ? "text-gray-600" : "text-gray-900"
                            )}>
                              {notification.title}
                            </p>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {notification.time_ago}
                              </span>
                            </div>
                          </div>
                          <p className={cn(
                            "text-sm line-clamp-2",
                            notification.is_read ? "text-gray-500" : "text-gray-700"
                          )}>
                            {notification.message}
                          </p>
                          {notification.action_text && (
                            <p className="text-xs text-emerald-600 mt-1 font-medium">
                              {notification.action_text} →
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50">
                  <Link href="/dashboard/notifications">
                    <Button
                      variant="ghost"
                      className="w-full text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                      onClick={() => setShowNotifications(false)}
                    >
                      View all notifications →
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced User Profile - keeping existing code */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gradient-to-r
             hover:from-emerald-50 hover:to-blue-50 hover:shadow-md hover:shadow-emerald-500/10 transition-all duration-300 border border-transparent hover:border-emerald-200/50"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">
                {user?.first_name?.charAt(0) || 'U'}{user?.last_name?.charAt(0) || 'S'}
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">
                {user?.first_name || 'User'} {user?.last_name || ''}
              </p>
              <p className="text-xs text-gray-500">Tenant</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl 
            border border-gray-200/60 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400
                   to-blue-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">
                      {user?.first_name?.charAt(0) || 'U'}{user?.last_name?.charAt(0) || 'S'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user?.first_name || 'User'} {user?.last_name || ''}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
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
  );
};