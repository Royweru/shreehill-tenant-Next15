'use client'
import React, { useEffect, useState } from 'react';
import { 
  Home, CreditCard, Bell, Wallet, Calendar, 
  AlertCircle, CheckCircle, Clock, Smartphone, 
  RefreshCw, Building2, User, TrendingUp, 
  DollarSign, FileText, Eye, EyeOff, X,
  Wrench, Download, MessageSquare, Settings,
  AlertTriangle
} from 'lucide-react';
import { MpesaPaymentModal } from '@/components/modals/mpesaPaymentModal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card } from '@/components/dashboard/dashboardCard';
import { mockDashboardData } from '@/constants';
import { MaintenanceModal } from '@/components/modals/maintenanceModal';
import { useBills, useBillSummary } from '@/hooks/useBills';
import { useMpesaPaymentModal } from '@/modalHooks/useMpesaPaymentModal';
import { useAuth } from '@/hooks/useAuth';
import { useRecentPayments } from '@/hooks/usePayments';



// Enhanced notification component for tenant dashboard
const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'payment_success',
      title: 'Payment Confirmed',
      message: 'Your rent payment of KES 45,000 has been confirmed',
      priority: 'normal',
      isRead: false,
      timeAgo: '2 hours ago',
      actionUrl: '/payments/receipt/123'
    },
    {
      id: 2,
      type: 'maintenance_scheduled',
      title: 'Maintenance Scheduled',
      message: 'Plumbing repair scheduled for tomorrow 10 AM',
      priority: 'high',
      isRead: false,
      timeAgo: '5 hours ago',
      actionUrl: '/maintenance/456'
    }
  ]);

  const [showAll, setShowAll] = useState(false);

  const getPriorityColor = (priority:any) => {
    const colors = {
      urgent: 'text-red-600 bg-red-50 border-red-200',
      high: 'text-orange-600 bg-orange-50 border-orange-200',
      normal: 'text-blue-600 bg-blue-50 border-blue-200',
      low: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[priority as PriorityColors] || colors.normal;
  };

  const getIcon = (type:any) => {
    const icons = {
      payment_success: <CreditCard className="h-5 w-5 text-green-600" />,
      payment_failed: <AlertTriangle className="h-5 w-5 text-red-600" />,
      maintenance_scheduled: <Wrench className="h-5 w-5 text-blue-600" />,
      rent_reminder: <Calendar className="h-5 w-5 text-orange-600" />
    };
    return icons[type as IconTypes] || <Bell className="h-5 w-5 text-gray-600" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Recent Updates
        </h3>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {showAll ? 'Show Less' : 'View All'}
        </button>
      </div>

      <div className="space-y-3">
        {notifications.slice(0, showAll ? notifications.length : 3).map((notification) => (
          <div 
            key={notification.id}
            className={`p-3 rounded-lg border ${notification.isRead ? 'bg-gray-50' : 'bg-white'} ${getPriorityColor(notification.priority)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                    {notification.title}
                  </p>
                  <span className="text-xs text-gray-500">{notification.timeAgo}</span>
                </div>
                <p className={`text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                  {notification.message}
                </p>
                {notification.actionUrl && (
                  <button className="text-xs text-blue-600 hover:text-blue-700 mt-2">
                    View Details →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



// Payment Status Tracker
const PaymentTracker = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      description: 'December 2024 Rent',
      amount: 45000,
      dueDate: '2024-12-01',
      status: 'completed',
      paidDate: '2024-11-28',
      method: 'M-Pesa',
      receipt: 'QKL8X9Y2'
    },
    {
      id: 2,
      description: 'January 2025 Rent',
      amount: 45000,
      dueDate: '2025-01-01',
      status: 'overdue',
      daysOverdue: 4
    }
  ]);

  const getStatusColor = (status:string) => {
    const colors = {
      completed: 'text-green-600 bg-green-100',
      pending: 'text-yellow-600 bg-yellow-100',
      overdue: 'text-red-600 bg-red-100'
    };
    return colors[status as StatusColors] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
      <div className="space-y-3">
        {payments.map((payment) => (
          <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{payment.description}</p>
              <p className="text-sm text-gray-600">
                Due: {new Date(payment.dueDate).toLocaleDateString()}
                {payment.status === 'overdue' && (
                  <span className="text-red-600 ml-2">({payment.daysOverdue} days overdue)</span>
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">KES {payment.amount.toLocaleString()}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Fixed QuickStats Component
const QuickStats = ({ billsSummary }:{billsSummary:BillSummary|undefined}) => {
  const [showDetails, setShowDetails] = useState(false);
  // REMOVED: isClient state and useEffect that cause hydration issues

  const stats = [
    {
      label: 'Current Balance',
      value: formatCurrency(billsSummary?.current_balance),
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Total amount due'
    },
    {
      label: 'Overdue Amount',
      value: formatCurrency(billsSummary?.overdue_amount),
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Past due payments'
    },
    {
      label: 'Pending Bills',
      value: billsSummary?.pending_bills_count?.toString(),
      icon: FileText,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Awaiting payment'
    },
    {
      label: 'Total Bills',
      value: billsSummary?.total_bills?.toString(),
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'All time bills'
    }
  ];  

  // FIXED: Same content rendered on server and client
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              {showDetails && (
                <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// Quick Actions Component
const QuickActions = ({ onPaymentClick, onMaintenanceClick, onNotificationClick, onDocumentsClick }:{
    onPaymentClick:()=>void,
    onMaintenanceClick:()=>void,
    onNotificationClick:()=>void,
    onDocumentsClick:()=>void,
}) => {
  const actions = [
    {
      id: 'pay-rent',
      title: 'Pay with M-Pesa',
      description: 'Quick rent payment',
      icon: Smartphone,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: onPaymentClick
    },
    {
      id: 'maintenance',
      title: 'Report Issue',
      description: 'Submit maintenance request',
      icon: Wrench,
      color: 'bg-orange-600 hover:bg-orange-700',
      onClick: onMaintenanceClick
    },
    {
      id: 'notifications',
      title: 'Messages',
      description: 'View all notifications',
      icon: Bell,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: onNotificationClick
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Lease & receipts',
      icon: FileText,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: onDocumentsClick
    }
  ];

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`${action.color} text-white p-6 rounded-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <Icon className="h-8 w-8 mx-auto mb-3" />
              <h4 className="font-medium text-center text-white">{action.title}</h4>
              <p className="text-sm opacity-90 text-center mt-1">{action.description}</p>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

// Enhanced MpesaPayment Component with Modal
const MpesaPaymentSection = ({ 
  bills,
   onPaymentSuccess, 
   showPaymentModal,
    paymentModalOnClose,
     paymentModalOnOpen 
    }:{
      bills:PaginatedResponse<Bill>|undefined,
      onPaymentSuccess:()=>void,
       showPaymentModal:boolean,
       paymentModalOnClose:()=>void,
       paymentModalOnOpen:()=>void,
    }) => {
 
  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Smartphone className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">M-Pesa Payments</h3>
            <p className="text-sm text-gray-600">Pay instantly with your phone</p>
          </div>
          <button
            onClick={paymentModalOnOpen}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Smartphone className="h-4 w-4" />
            Pay Now
          </button>
        </div>

        {bills?.results&&bills.results.filter((bill:Bill) => bill.balance_due > 0).length > 0 ? (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Outstanding Bills:</h4>
            {bills?.results.filter((bill:Bill) => bill.balance_due > 0).slice(0, 3).map((bill:Bill) => (
              <div key={bill.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{bill.description}</p>
                  <p className="text-sm text-gray-600">Due: {formatDate(bill.due_date)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(bill.balance_due)}</p>
                  {bill.is_overdue && (
                    <span className="text-xs text-red-600 font-medium">Overdue</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600">All bills are paid up!</p>
            <p className="text-sm text-gray-500 mt-1">Great job staying current with payments</p>
          </div>
        )}
      </Card>
    </>
  );
};

// Enhanced M-Pesa Payment Modal

// Recent Bills Component
const RecentBills = ({ bills }:{bills:PaginatedResponse<Bill>|undefined}) =>{ 
  
  if(!bills) return
   <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">No bills</h3>
          <p className="text-sm text-gray-600">You dont have any bills currently</p>
        </div>
      </div>
      
    </div>
   </Card>

  return(
  <Card className="p-6">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Bills</h3>
          <p className="text-sm text-gray-600">Your latest billing statements</p>
        </div>
      </div>
      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
        View All
      </button>
    </div>
   
    <div className="space-y-4">
      {bills.results.map((bill) => (
        <div key={bill.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${
              bill.is_overdue ? 'bg-red-100' : bill.status === 'Paid' ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              {bill.is_overdue ? (
                <AlertCircle className="h-5 w-5 text-red-600" />
              ) : bill.status === 'Paid' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Clock className="h-5 w-5 text-yellow-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{bill.description}</p>
              <p className="text-sm text-gray-600">
                {bill.bill_number} • Due: {formatDate(bill.due_date)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">{formatCurrency(bill.balance_due)}</p>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              bill.is_overdue ? 'bg-red-100 text-red-800' : 
              bill.status === 'Paid' ? 'bg-green-100 text-green-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              {bill.is_overdue ? 'Overdue' : bill.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </Card>
);}

// Recent Payments Component
const RecentPayments = ({ payments }:{payments:Payment[]}) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
          <p className="text-sm text-gray-600">Your payment history</p>
        </div>
      </div>
      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
        View All
      </button>
    </div>

    <div className="space-y-4">
      {payments.map((payment:Payment) => (
        <div key={payment.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Smartphone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{payment.bill_description}</p>
              <p className="text-sm text-gray-600">
                {payment.payment_reference} • {formatDate(payment.payment_date)}
              </p>
              {payment.mpesa_receipt && (
                <p className="text-xs text-green-600 mt-1">
                  M-Pesa: {payment.mpesa_receipt}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-green-600">{formatCurrency(payment.amount_paid)}</p>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {payment.payment_method}
            </span>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// Unit Info Component
const UnitInfo = ({ unit }:{unit:Unit}) => (
  <Card className="p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-indigo-100 rounded-lg">
        <Home className="h-6 w-6 text-indigo-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">My Unit</h3>
        <p className="text-sm text-gray-600">{unit.property_name}</p>
      </div>
    </div>

    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Unit Number</p>
          <p className="text-xl font-bold text-gray-900">{unit.unit_number}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Unit Type</p>
          <p className="text-xl font-bold text-gray-900">{unit.unit_type}</p>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Monthly Rent</p>
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(unit.rent_amount)}</p>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Lease Period</p>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(unit?.current_tenant.tenancy_start_date)} - {unit.current_tenant?.tenancy_end_date ? formatDate(unit?.current_tenant?.tenancy_end_date) : 'Ongoing'}</span>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Address</p>
        <p className="text-gray-900">{unit.property_name}</p>
      </div>
    </div>
  </Card>
);

// Notifications Component
const NotificationsList = ({ notifications }:{notifications:Notification[]}) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Bell className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <p className="text-sm text-gray-600">Recent updates</p>
        </div>
      </div>
      {notifications.filter((n:Notification) => !n.is_read).length > 0 && (
        <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
          {notifications.filter((n:Notification) => !n.is_read).length} new
        </span>
      )}
    </div>

    <div className="space-y-3">
      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No new notifications</p>
        </div>
      ) : (
        notifications.map((notification:Notification) => (
          <div key={notification.id} className={`p-4 rounded-lg border-l-4 ${notification.is_read ? 'bg-gray-50 border-gray-300' : 'bg-purple-50 border-purple-500'}`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900">{notification.title}</h4>
              <span className="text-xs text-gray-500">
                {new Date(notification.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">{notification.message}</p>
            {!notification.is_read && (
              <div className="mt-2 flex justify-end">
                <button className="text-xs text-purple-600 hover:text-purple-800">
                  Mark as read
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  </Card>
);

// Payment Trends Chart Component
const PaymentTrends = ({ paymentSummary }:{paymentSummary:any[]}) => {
  const maxAmount = Math.max(...paymentSummary.map(item => item.total_paid));
  
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <TrendingUp className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
          <p className="text-sm text-gray-600">Last 6 months</p>
        </div>
      </div>

      <div className="space-y-4">
        {paymentSummary.map((month, index) => (
          <div key={month.month} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <p className="text-sm font-medium text-gray-700 w-24">{month.month_name.split(' ')[0]}</p>
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                  style={{ 
                    width: maxAmount > 0 ? `${(month.total_paid / maxAmount) * 100}%` : '0%'
                  }}
                />
              </div>
            </div>
            <div className="text-right ml-4">
              <p className="font-semibold text-gray-900">{formatCurrency(month.total_paid)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};



// Main Dashboard Component
const TenantDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const {isOpen:showPaymentModal,onClose:paymentModalOnClose,onOpen:paymentModalOnOpen}=useMpesaPaymentModal()
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);

  const {data:bills}=useBills()
  const {data:billsSummary} =useBillSummary()
  const {data:recentPayments}= useRecentPayments()
  const {user}=useAuth()
  const data = mockDashboardData;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handlePaymentSuccess = () => {
    handleRefresh();
    paymentModalOnClose()
  };

  // FIXED: Simple loading check without hydration mismatch
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                {user?.profile.profile_image ? (
                  <img 
                    src={user?.profile.profile_image} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {data.tenant_info.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                {data.is_tenancy_active && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.profile.full_name}!
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  {data.current_unit ? (
                    <>
                      <Building2 className="h-4 w-4" />
                      Unit {data.current_unit.unit_number} • {data.current_unit.property_name}
                      {data.is_tenancy_active && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active Lease
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-orange-600">No unit assigned</span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                className="relative p-2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-6 w-6" />
                {data.notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        {/* Alert Banner for Overdue Bills */}
        {billsSummary?.overdue_amount && billsSummary?.overdue_amount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <h4 className="font-medium text-red-800">Overdue Payment Alert</h4>
              <p className="text-sm text-red-700">
                You have {formatCurrency(data.bills_summary.overdue_amount)} in overdue payments. 
                Please settle these to avoid late fees.
              </p>
            </div>
            <button
              onClick={paymentModalOnOpen}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium"
            >
              Pay Now
            </button>
          </div>
        )}

        {/* FIXED: QuickStats with no hydration issues */}
        <QuickStats billsSummary={billsSummary} />
         <RecentBills bills={bills}/>
         <RecentPayments payments={(recentPayments||[])}/>
         <MpesaPaymentSection 
           onPaymentSuccess={handlePaymentSuccess} 
           showPaymentModal={showPaymentModal}
           paymentModalOnClose={paymentModalOnClose}
           paymentModalOnOpen={paymentModalOnOpen}
           bills={bills}
         />
        {/* Quick Actions */}
        <QuickActions 
          onPaymentClick={paymentModalOnOpen}
          onMaintenanceClick={() => setShowMaintenanceModal(true)}
          onNotificationClick={() => setShowNotifications(true)}
          onDocumentsClick={() => setShowDocuments(true)}
        />
      </div>

      {/* All your existing modals remain the same */}
      <MaintenanceModal 
        isOpen={showMaintenanceModal}
        onClose={() => setShowMaintenanceModal(false)}
      />

      {showPaymentModal && (
        <MpesaPaymentModal
          isOpen={showPaymentModal}
          onClose={paymentModalOnClose}
          bills={(bills?.results.filter((bill:Bill) => bill.balance_due > 0)|| [])}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Documents Modal */}
      {showDocuments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">My Documents</h3>
              <button 
                onClick={() => setShowDocuments(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Lease Agreement</span>
                </div>
                <Download className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span>Payment Receipts</span>
                </div>
                <Download className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <span>House Rules</span>
                </div>
                <Download className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TenantDashboard;