import { 
  Home, 
  CreditCard, 
  Wrench, 
  Bell, 
  User, 
  FileText, 
  MessageSquare, 

} from 'lucide-react';

// Mock navigation data - replace with your actual constants
export const navigation = [
  { 
    label: 'Dashboard', 
    link: '/dashboard', 
    icon: Home, 
    active: true,
    description: 'Overview & insights'
  },
  { 
    label: 'Payments', 
    link: '/dashboard/payments', 
    icon: CreditCard, 
    badge: '2 due',
    badgeColor: 'bg-red-500',
    description: 'Rent & utilities'
  },
  { 
    label: 'Maintenance', 
    link: '/dashboard/maintenance', 
    icon: Wrench,
    badge: '1 open',
    badgeColor: 'bg-blue-500',
    description: 'Service requests'
  },
  { 
    label: 'Notifications', 
    link: '/dashboard/notifications', 
    icon: Bell,
    badge: '5 new',
    badgeColor: 'bg-emerald-500',
    description: 'Updates & alerts'
  },
  { 
    label: 'Documents', 
    link: '/documents', 
    icon: FileText,
    description: 'Leases & contracts'
  },

  { 
    label: 'My Profile', 
    link: '/profile', 
    icon: User,
    description: 'Personal settings'
  },
];

export function getPageTitle(pathname: string) {
 
  if (pathname.includes('/dashboard')) return 'Dashboard';
  if (pathname.includes('/dashboard/overview')) return 'Overview';
  if (pathname.includes('/dashboard/settings')) return 'Settings';
  if (pathname.includes('/dashboard/payments')) return 'Payments';
  if (pathname.includes('/dashboard/maintenance')) return 'Maintenance Requests';
  if (pathname.includes('/dashboard/notifications')) return 'Notifications';
 
  return 'Dashboard';
}

  // Mock notifications - replace with real data
export  const notifications = [
    { 
      id: 1, 
      message: "Your rent payment is due in 3 days", 
      time: "5 min ago", 
      type: "payment",
      urgent: true 
    },
    { 
      id: 2, 
      message: "Maintenance request approved - Work starts tomorrow", 
      time: "1 hour ago", 
      type: "maintenance" 
    },
    { 
      id: 3, 
      message: "New property announcement posted", 
      time: "2 hours ago", 
      type: "info" 
    }
  ];

export  const NotificationItem = ({ notification }:{notification:any}) => (
    <div className={`p-3 border-l-4 ${
      notification.urgent 
        ? 'border-red-400 bg-red-50/80' 
        : notification.type === 'maintenance' 
        ? 'border-blue-400 bg-blue-50/80'
        : 'border-emerald-400 bg-emerald-50/80'
    } hover:bg-opacity-100 transition-all duration-200 cursor-pointer group`}>
      <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
        {notification.message}
      </p>
      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
    </div>
  );

export const mockDashboardData = {
  tenant_info: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+254712345678',
    profile_image: null
  },
  current_unit: {
    id: '1',
    unit_number: 'A12',
    unit_type: '2 Bedroom',
    property_name: 'Shreehill Apartments',
    property_address: 'Westlands, Nairobi',
    monthly_rent: 45000,
    tenancy_start: '2024-01-01',
    tenancy_end: '2024-12-31',
    rent_due_day: 5
  },
  bills_summary: {
    current_balance: 67500,
    overdue_amount: 22500,
    total_bills: 12,
    pending_bills_count: 3,
    overdue_bills_count: 1
  },
  recent_bills: [
    {
      id: '1',
      bill_number: 'BL-001',
      bill_type: 'Rent',
      description: 'Monthly Rent - December 2024',
      amount: 45000,
      due_date: '2024-12-05',
      status: 'Pending',
      balance_due: 45000,
      is_overdue: false
    },
    {
      id: '2',
      bill_number: 'BL-002',
      bill_type: 'Service Charge',
      description: 'Service Charge - December 2024',
      amount: 15000,
      due_date: '2024-12-05',
      status: 'Pending',
      balance_due: 15000,
      is_overdue: false
    },
    {
      id: '3',
      bill_number: 'BL-003',
      bill_type: 'Utility',
      description: 'Water & Electricity - November 2024',
      amount: 7500,
      due_date: '2024-11-30',
      status: 'Overdue',
      balance_due: 7500,
      is_overdue: true
    }
  ],
  recent_payments: [
    {
      id: '1',
      payment_reference: 'PAY-001',
      amount_paid: 45000,
      payment_method: 'M-Pesa',
      payment_date: '2024-11-05',
      bill_description: 'Monthly Rent - November 2024',
      mpesa_receipt: 'QGH7XY89'
    },
    {
      id: '2',
      payment_reference: 'PAY-002',
      amount_paid: 15000,
      payment_method: 'M-Pesa',
      payment_date: '2024-11-03',
      bill_description: 'Service Charge - November 2024',
      mpesa_receipt: 'QGH8ZX12'
    }
  ],
  upcoming_bills: [
    {
      id: '3',
      bill_number: 'BL-003',
      description: 'Monthly Rent - January 2025',
      amount: 45000,
      due_date: '2025-01-05',
      days_until_due: 15
    }
  ],
  notifications: [
    {
      id: '1',
      title: 'Rent Due Soon',
      message: 'Your rent payment is due in 3 days',
      notification_type: 'rent_reminder',
      created_at: '2024-12-02T10:30:00Z',
      is_read: false
    },
    {
      id: '2',
      title: 'Maintenance Complete',
      message: 'Your plumbing request has been completed',
      notification_type: 'maintenance',
      created_at: '2024-12-01T15:20:00Z',
      is_read: true
    }
  ],
  payment_summary: [
    { month: '2024-07', month_name: 'July 2024', total_paid: 60000 },
    { month: '2024-08', month_name: 'August 2024', total_paid: 60000 },
    { month: '2024-09', month_name: 'September 2024', total_paid: 60000 },
    { month: '2024-10', month_name: 'October 2024', total_paid: 60000 },
    { month: '2024-11', month_name: 'November 2024', total_paid: 60000 },
    { month: '2024-12', month_name: 'December 2024', total_paid: 0 }
  ],
  is_tenancy_active: true
};