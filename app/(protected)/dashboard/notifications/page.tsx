'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Filter, 
  Search, 
  Settings, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Plus,
  SlidersHorizontal,
  Download,
  Archive,
  Star,
  X,
  Zap,
  Shield
} from 'lucide-react';
import { NotificationCenter } from '@/components/dashboard/notificationsCenter';
import { useNotifications, useNotificationSummary, useNotificationPreferences, useUpdateNotificationPreferences } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const NotificationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all'); // Changed from empty string
  const [showSettings, setShowSettings] = useState(false);

  const { data: summary, isLoading: summaryLoading } = useNotificationSummary();
  const { data: preferences, isLoading: preferencesLoading } = useNotificationPreferences();
  const updatePreferencesMutation = useUpdateNotificationPreferences();

  const handlePreferenceUpdate = useCallback((updates: any) => {
    updatePreferencesMutation.mutate(updates);
  }, [updatePreferencesMutation]);

  const notificationTypes = [
    { value: 'all', label: 'All Notifications', count: summary?.total_notifications || 0 },
    { value: 'payment_success', label: 'Payment Updates', count: summary?.payment_notifications || 0 },
    { value: 'maintenance_scheduled', label: 'Maintenance', count: summary?.maintenance_notifications || 0 },
    { value: 'rent_reminder', label: 'Rent Reminders', count: 0 },
    { value: 'emergency', label: 'Emergency Alerts', count: 0 },
    { value: 'community', label: 'Community Updates', count: 0 },
  ];

  const quickStats = [
    {
      title: 'Total Notifications',
      value: summary?.total_notifications || 0,
      icon: <Bell className="h-5 w-5 text-blue-600" />,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Unread',
      value: summary?.unread_count || 0,
      icon: <Clock className="h-5 w-5 text-orange-600" />,
      color: 'bg-orange-50 text-orange-700',
    },
    {
      title: 'Urgent',
      value: summary?.urgent_count || 0,
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      color: 'bg-red-50 text-red-700',
    },
    {
      title: 'Recent',
      value: summary?.recent_count || 0,
      icon: <Zap className="h-5 w-5 text-emerald-600" />,
      color: 'bg-emerald-50 text-emerald-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Notifications Center
          </h1>
          <p className="text-gray-600 mt-1">
            Stay updated with your property management activities
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Preferences
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Notification Preferences
                </DialogTitle>
                <DialogDescription>
                  Customize how and when you receive notifications
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Channel Preferences */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Communication Channels</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-blue-600" />
                        <Label htmlFor="in-app">In-App Notifications</Label>
                      </div>
                      <Switch
                        id="in-app"
                        defaultChecked={true}
                        disabled
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📧</span>
                        <Label htmlFor="email">Email</Label>
                      </div>
                      <Switch
                        id="email"
                        defaultChecked={preferences?.email_enabled}
                        onCheckedChange={(checked) => 
                          handlePreferenceUpdate({ email_enabled: checked })
                        }
                        disabled={updatePreferencesMutation.isPending}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📱</span>
                        <Label htmlFor="sms">SMS</Label>
                      </div>
                      <Switch
                        id="sms"
                        defaultChecked={preferences?.sms_enabled}
                        onCheckedChange={(checked) => 
                          handlePreferenceUpdate({ sms_enabled: checked })
                        }
                        disabled={updatePreferencesMutation.isPending}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💬</span>
                        <Label htmlFor="whatsapp">WhatsApp</Label>
                      </div>
                      <Switch
                        id="whatsapp"
                        defaultChecked={preferences?.whatsapp_enabled}
                        onCheckedChange={(checked) => 
                          handlePreferenceUpdate({ whatsapp_enabled: checked })
                        }
                        disabled={updatePreferencesMutation.isPending}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Notification Types */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Notification Types</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label htmlFor="payments" className="font-medium">Payment Notifications</Label>
                        <p className="text-sm text-gray-500">Payment confirmations, reminders, and failures</p>
                      </div>
                      <Switch id="payments" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label htmlFor="maintenance" className="font-medium">Maintenance Updates</Label>
                        <p className="text-sm text-gray-500">Scheduled maintenance and completion notices</p>
                      </div>
                      <Switch id="maintenance" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label htmlFor="community" className="font-medium">Community Announcements</Label>
                        <p className="text-sm text-gray-500">Property updates and community news</p>
                      </div>
                      <Switch id="community" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Quiet Hours */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Quiet Hours</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    No notifications will be sent during these hours (except emergencies)
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quiet-start">Start Time</Label>
                      <Select defaultValue={preferences?.quiet_hours_start || '22:00'}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return (
                              <SelectItem key={i} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="quiet-end">End Time</Label>
                      <Select defaultValue={preferences?.quiet_hours_end || '08:00'}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return (
                              <SelectItem key={i} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {quickStats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={cn("p-3 rounded-full", stat.color)}>
                  {stat.icon}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-emerald-50/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filter Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notifications..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {notificationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{type.label}</span>
                      {type.count > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {type.count}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-32">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <NotificationCenter 
          showAll={true}
          showFilters={true}
        />
      </motion.div>

      {/* Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50/50 to-blue-50/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Bell className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Stay Connected with Your Property
                </h3>
                <p className="text-gray-600 mb-4">
                  Enable multiple notification channels to never miss important updates about your payments, 
                  maintenance requests, and community announcements.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                    💡 Pro Tip: Enable WhatsApp for instant alerts
                  </Badge>
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    🔔 Set quiet hours for better sleep
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotificationsPage;