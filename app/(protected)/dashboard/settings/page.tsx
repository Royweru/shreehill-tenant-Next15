'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Key,
  Lock,
  Save,
  AlertCircle,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Home
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
const SettingsPage = () => {

  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    first_name: 'John',
    last_name: 'Warui',
    email: 'john.warui@example.com',
    phone_number: '+254712345678',
    profile_image: null,
    is_verified: true
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password1: '',
    new_password2: ''
  });

  // Notification preferences
  const [notificationSettings, setNotificationSettings] = useState({
    email_enabled: true,
    sms_enabled: false,
    whatsapp_enabled: true,
    payment_notifications: true,
    maintenance_notifications: true,
    community_notifications: false,
    marketing_notifications: false
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: true,
    allow_contact: true,
    data_sharing: false
  });

  const handleProfileUpdate = async (e:React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/accounts/profile/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        toast.success("Your profile has been updated successfully.");
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e:React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new_password1 !== passwordData.new_password2) {
      toast.error("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/accounts/password/change/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(passwordData)
      });

      if (response.ok) {
        toast.success("Your password has been updated successfully.");
        setPasswordData({
          old_password: '',
          new_password1: '',
          new_password2: ''
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to change password');
      }
    } catch (error:any) {
      toast.error("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/accounts/resend-verification/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        toast.error("Please check your email for verification instructions.");
      } else {
        throw new Error('Failed to send verification email');
      }
    } catch (error) {
      toast.error("Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="p-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl shadow-lg">
          <Settings className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-gray-600">Manage your account preferences and security settings</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Email Verification Alert */}
                  {!profileData.is_verified && (
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800">
                        Your email address is not verified.{' '}
                        <Button
                          variant="link"
                          className="p-0 h-auto text-orange-600 underline"
                          onClick={handleResendVerification}
                          disabled={loading}
                        >
                          Resend verification email
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={profileData.first_name}
                        onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={profileData.last_name}
                        onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                        placeholder="Enter your last name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          placeholder="Enter your email"
                        />
                        {profileData.is_verified && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          className="pl-10"
                          value={profileData.phone_number}
                          onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
                          placeholder="+254712345678"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <Button type="submit" disabled={loading} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current_password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.old_password}
                        onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                        placeholder="Enter current password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new_password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new_password"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.new_password1}
                        onChange={(e) => setPasswordData({...passwordData, new_password1: e.target.value})}
                        placeholder="Enter new password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.new_password2}
                        onChange={(e) => setPasswordData({...passwordData, new_password2: e.target.value})}
                        placeholder="Confirm new password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Make sure your password is at least 8 characters long and includes a mix of letters, numbers, and symbols.
                    </AlertDescription>
                  </Alert>

                  <Button type="submit" disabled={loading} className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    {loading ? 'Changing Password...' : 'Change Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-4">Communication Channels</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <div>
                          <Label htmlFor="email-notifs">Email Notifications</Label>
                          <p className="text-xs text-gray-500">Receive notifications via email</p>
                        </div>
                      </div>
                      <Switch
                        id="email-notifs"
                        checked={notificationSettings.email_enabled}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, email_enabled: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-green-500" />
                        <div>
                          <Label htmlFor="sms-notifs">SMS Notifications</Label>
                          <p className="text-xs text-gray-500">Receive notifications via SMS</p>
                        </div>
                      </div>
                      <Switch
                        id="sms-notifs"
                        checked={notificationSettings.sms_enabled}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, sms_enabled: checked})
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-4">Notification Types</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="payment-notifs">Payment Notifications</Label>
                        <p className="text-xs text-gray-500">Rent reminders and payment confirmations</p>
                      </div>
                      <Switch
                        id="payment-notifs"
                        checked={notificationSettings.payment_notifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, payment_notifications: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="maintenance-notifs">Maintenance Updates</Label>
                        <p className="text-xs text-gray-500">Maintenance requests and schedules</p>
                      </div>
                      <Switch
                        id="maintenance-notifs"
                        checked={notificationSettings.maintenance_notifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, maintenance_notifications: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="community-notifs">Community Updates</Label>
                        <p className="text-xs text-gray-500">Property news and announcements</p>
                      </div>
                      <Switch
                        id="community-notifs"
                        checked={notificationSettings.community_notifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, community_notifications: checked})
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control your privacy and data sharing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="profile-visibility">Profile Visibility</Label>
                      <p className="text-xs text-gray-500">Allow others to see your basic profile information</p>
                    </div>
                    <Switch
                      id="profile-visibility"
                      checked={privacySettings.profile_visibility}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, profile_visibility: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allow-contact">Allow Contact</Label>
                      <p className="text-xs text-gray-500">Allow property management to contact you</p>
                    </div>
                    <Switch
                      id="allow-contact"
                      checked={privacySettings.allow_contact}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, allow_contact: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="data-sharing">Data Sharing</Label>
                      <p className="text-xs text-gray-500">Share anonymized data for service improvements</p>
                    </div>
                    <Switch
                      id="data-sharing"
                      checked={privacySettings.data_sharing}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, data_sharing: checked})
                      }
                    />
                  </div>
                </div>

                <Separator />

                <Button variant="outline" className="w-full">
                  Download My Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default SettingsPage;