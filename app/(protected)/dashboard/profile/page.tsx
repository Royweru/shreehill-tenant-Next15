'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Home,
  Shield,
  Camera,
  Edit3,
  CheckCircle,
  AlertCircle,
  FileText,
  CreditCard,
  Clock,
  Settings,
  Download,
  Eye,
  Building
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useAuthContext } from '@/providers/AuthContext';
import { useAuth } from '@/hooks/useAuth';

const UserProfilePage = () => {

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const {user:userData} = useAuthContext()
  const {updateUserProfile,resendVerification}= useAuth()
  
  // User data state
 
  // Edit form data
  const [editData, setEditData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
  });

  // Fetch user data
  



  const handleEditSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response =updateUserProfile(editData)  
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const response = await resendVerification()
    } catch (error) {
      toast.error("Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString:any) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name:string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
 if (!userData) return(
    <div className='w-full min-h-screen items-center justify-center'>
     <h2>
        Oopsy seems like we don't have any user data to work with 
     </h2>
    </div>
 )
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl shadow-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-gray-600">Manage your personal information and preferences</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/settings">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-6 text-white">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                      <AvatarImage src={userData.profile_image} />
                      <AvatarFallback className="bg-white text-emerald-600 text-xl font-bold">
                        {getInitials(userData.full_name || userData.first_name + ' ' + userData.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white text-emerald-600 hover:bg-gray-100"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-bold">{userData.full_name || `${userData.first_name} ${userData.last_name}`}</h2>
                  <p className="text-emerald-100 mb-2">Tenant</p>
                  <Badge 
                    variant={userData.email_verified ? "default" : "destructive"}
                    className={userData.email_verified ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {userData.email_verified ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Unverified
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 space-y-3">
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Edit3 className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your personal information
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit_first_name">First Name</Label>
                          <Input
                            id="edit_first_name"
                            value={editData.first_name}
                            onChange={(e) => setEditData({...editData, first_name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit_last_name">Last Name</Label>
                          <Input
                            id="edit_last_name"
                            value={editData.last_name}
                            onChange={(e) => setEditData({...editData, last_name: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="edit_phone">Phone Number</Label>
                        <Input
                          id="edit_phone"
                          value={editData.phone_number}
                          onChange={(e) => setEditData({...editData, phone_number: e.target.value})}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                {!userData.email_verified && (
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={handleResendVerification}
                    disabled={loading}
                  >
                    <Mail className="h-4 w-4" />
                    {loading ? 'Sending...' : 'Verify Email'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Mail className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{userData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Phone className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{userData.phone_number || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">{formatDate(userData.date_joined)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Status</p>
                      <Badge variant={userData.is_active ? "default" : "secondary"}>
                        {userData.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Unit Information */}
          {userData.current_unit && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Current Unit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Building className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Unit Number</p>
                        <p className="font-medium">{userData.current_unit.unit_number}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <MapPin className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Property</p>
                        <p className="font-medium">{userData?.current_unit?.property_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CreditCard className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Monthly Rent</p>
                        <p className="font-medium">KSH {userData.current_unit.rent_amount?.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Clock className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Rent Due Day</p>
                        <p className="font-medium">{userData.rent_due_day} of each month</p>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-100 rounded-lg">
                          <FileText className="h-4 w-4 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Tenancy Period</p>
                          <p className="font-medium">
                            {formatDate(userData.tenancy_start_date)} - {formatDate(userData.tenancy_end_date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">Tenancy Status:</p>
                      <Badge variant={userData.is_active? "default" : "secondary"}>
                        {userData.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      View Contract
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Account Statistics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">2</div>
                    <div className="text-sm text-gray-600">Active Bills</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
                    <div className="text-sm text-gray-600">Payments Made</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">98%</div>
                    <div className="text-sm text-gray-600">Payment Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;