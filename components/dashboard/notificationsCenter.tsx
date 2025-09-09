'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  CreditCard, 
  AlertTriangle, 
  Wrench, 
  Calendar, 
  Home, 
  MessageSquare,
  Clock,
  CheckCircle,
  X,
  Filter,
  MoreHorizontal,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications, useNotificationSummary, useMarkNotificationAsRead, useMarkAllNotificationsAsRead, useBulkNotificationAction } from '@/hooks/useNotifications';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface NotificationCenterProps {
  showAll?: boolean;
  maxItems?: number;
  showFilters?: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  showAll = false, 
  maxItems = 5,
  showFilters = false 
}) => {
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Fetch notifications and summary
  const { data: notificationsData, isLoading, error } = useNotifications({
    page: 1,
    is_read: showUnreadOnly ? false : undefined,
    notification_type: filterType || undefined,
    priority_level: filterPriority || undefined,
  });

  const { data: summary } = useNotificationSummary();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const bulkActionMutation = useBulkNotificationAction();

  const notifications = notificationsData || [];
  const displayNotifications = showAll ? notifications : notifications.slice(0, maxItems);

  const getNotificationIcon = (type: string) => {
    const iconMap = {
      payment_success: <CreditCard className="h-4 w-4 text-green-600" />,
      payment_failed: <AlertTriangle className="h-4 w-4 text-red-600" />,
      rent_reminder: <Calendar className="h-4 w-4 text-orange-600" />,
      maintenance_scheduled: <Wrench className="h-4 w-4 text-blue-600" />,
      maintenance_completed: <CheckCircle className="h-4 w-4 text-green-600" />,
      bill_generated: <CreditCard className="h-4 w-4 text-purple-600" />,
      overdue_payment: <AlertTriangle className="h-4 w-4 text-red-600" />,
      welcome: <Home className="h-4 w-4 text-blue-600" />,
      general: <MessageSquare className="h-4 w-4 text-gray-600" />,
      emergency: <AlertTriangle className="h-4 w-4 text-red-600" />,
      community: <MessageSquare className="h-4 w-4 text-indigo-600" />,
    };
    return iconMap[type as keyof typeof iconMap] || <Bell className="h-4 w-4 text-gray-600" />;
  };

  const getPriorityColor = (priority: string) => {
    const colorMap = {
      urgent: 'border-l-red-500 bg-red-50/50',
      high: 'border-l-orange-500 bg-orange-50/50',
      normal: 'border-l-blue-500 bg-blue-50/50',
      low: 'border-l-gray-500 bg-gray-50/50',
    };
    return colorMap[priority as keyof typeof colorMap] || colorMap.normal;
  };

  const getPriorityBadge = (priority: string) => {
    const badgeMap = {
      urgent: <Badge variant="destructive" className="text-xs">Urgent</Badge>,
      high: <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">High</Badge>,
      normal: <Badge variant="secondary" className="text-xs">Normal</Badge>,
      low: <Badge variant="outline" className="text-xs">Low</Badge>,
    };
    return badgeMap[priority as keyof typeof badgeMap];
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsReadMutation.mutateAsync(notification.id);
    }
    
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  };

  const handleSelectNotification = (notificationId: string, checked: boolean) => {
    if (checked) {
      setSelectedNotifications(prev => [...prev, notificationId]);
    } else {
      setSelectedNotifications(prev => prev.filter(id => id !== notificationId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(displayNotifications.map(n => n.id));
    } else {
      setSelectedNotifications([]);
    }
  };

  const handleBulkAction = async (action: 'mark_read' | 'mark_unread' | 'delete') => {
    if (selectedNotifications.length === 0) return;
    
    await bulkActionMutation.mutateAsync({
      notification_ids: selectedNotifications,
      action,
    });
    
    setSelectedNotifications([]);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load notifications</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-6 w-6 text-emerald-600" />
              {summary && summary?.unread_count > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 
                rounded-full text-xs text-white flex items-center justify-center">
                  {summary.unread_count > 9 ? '9+' : summary.unread_count}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {showAll ? 'All Notifications' : 'Recent Updates'}
              </h3>
              <p className="text-sm text-gray-500">
                {summary?.unread_count || 0} unread • {summary?.total_notifications || 0} total
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {summary && summary?.unread_count > 0 && !showAll && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
                className="text-emerald-600 hover:text-emerald-700"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
            
            {!showAll && (
              <Link href="/dashboard/notifications">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View All
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Filters and Bulk Actions (for full page view) */}
        {showAll && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedNotifications.length === displayNotifications.length && displayNotifications.length > 0}
                onCheckedChange={handleSelectAll}
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
              <span className="text-sm text-gray-600">
                {selectedNotifications.length > 0 && `${selectedNotifications.length} selected`}
              </span>
              
              {selectedNotifications.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBulkAction('mark_read')}
                    disabled={bulkActionMutation.isPending}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Mark Read
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBulkAction('mark_unread')}
                    disabled={bulkActionMutation.isPending}
                  >
                    <EyeOff className="h-4 w-4 mr-1" />
                    Mark Unread
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                    disabled={bulkActionMutation.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                className={cn(
                  "text-sm",
                  showUnreadOnly ? "bg-emerald-50 text-emerald-700" : "text-gray-600"
                )}
              >
                <Filter className="h-4 w-4 mr-1" />
                {showUnreadOnly ? 'Show All' : 'Unread Only'}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterPriority('urgent')}>
                    Urgent Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('payment_success')}>
                    Payment Updates
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('maintenance_scheduled')}>
                    Maintenance Updates
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setFilterType(''); setFilterPriority(''); }}>
                    Clear Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {displayNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-2">No notifications yet</p>
              <p className="text-sm text-gray-400">
                We'll notify you about payments, maintenance, and important updates
              </p>
            </div>
          ) : (
            displayNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-start gap-3 p-4 border-l-4 transition-all duration-200 cursor-pointer hover:bg-gray-50",
                  getPriorityColor(notification.priority_level),
                  !notification.is_read && "bg-blue-50/30 border-l-blue-500"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                {showAll && (
                  <div className="pt-1">
                    <Checkbox
                      checked={selectedNotifications.includes(notification.id)}
                      onCheckedChange={(checked) => handleSelectNotification(notification.id, !!checked)}
                      onClick={(e) => e.stopPropagation()}
                      className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                  </div>
                )}
                
                <div className="flex-shrink-0 mt-1 p-2 rounded-full bg-white shadow-sm">
                  {getNotificationIcon(notification.notification_type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        notification.is_read ? "text-gray-600" : "text-gray-900"
                      )}>
                        {notification.title}
                      </p>
                      {notification.priority_level !== 'normal' && getPriorityBadge(notification.priority_level)}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notification.time_ago}
                      </span>
                    </div>
                  </div>
                  
                  <p className={cn(
                    "text-sm mb-2 line-clamp-2",
                    notification.is_read ? "text-gray-500" : "text-gray-700"
                  )}>
                    {notification.message}
                  </p>
                  
                  {notification.sender_name && (
                    <p className="text-xs text-gray-400 mb-2">
                      From: {notification.sender_name}
                    </p>
                  )}
                  
                  {notification.action_text && notification.action_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-emerald-600 hover:text-emerald-700 h-6 px-2 -ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = notification.action_url!;
                      }}
                    >
                      {notification.action_text} →
                    </Button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer for dashboard widget */}
      {!showAll && notifications.length > maxItems && (
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <Link href="/dashboard/notifications">
            <Button variant="ghost" className="w-full text-emerald-600 hover:text-emerald-700">
              View {notifications.length - maxItems} more notifications →
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};