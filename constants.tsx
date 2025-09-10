import { 
  Home, 
  CreditCard, 
  Wrench, 
  Bell, 
  User, 
  FileText, 
  MessageSquare, 

} from 'lucide-react';
import { useNotificationSummary } from './hooks/useNotifications';
import { useBillSummary } from './hooks/useBills';

export function getPageTitle(pathname: string) {
 
  if (pathname.includes('/dashboard/overview')) return 'Dashboard Overview';
  if (pathname.includes('/dashboard/settings')) return 'Settings';
  if (pathname.includes('/dashboard/payments')) return 'Payments';
  if (pathname.includes('/dashboard/maintenance')) return 'Maintenance Requests';
  if (pathname.includes('/dashboard/notifications')) return 'Notifications';
 
  return 'Dashboard';
}
// Mock navigation data - replace with your actual constants
export const navigation=() =>{ 
   const {data:notificationSummary,isLoading:notificationSummaryLoading}=useNotificationSummary()
   const {data:billSummary,isLoading:billSummaryLoading}=useBillSummary()
  return[
  { 
    label: 'Dashboard', 
    link: '/dashboard/overview', 
    icon: Home, 
    active: true,
    description: 'Overview & insights'
  },
  { 
    label: 'Payments', 
    link: '/dashboard/payments', 
    icon: CreditCard, 
    badge:billSummaryLoading? 'loading..':`${billSummary?.bill_counts.overdue} due`,
    badgeColor: 'bg-red-500',
    description: 'Rent & utilities'
  },
  { 
    label: 'Maintenance', 
    link: '/dashboard/maintenance', 
    icon: Wrench,
    badgeColor: 'bg-blue-500',
    description: 'Service requests'
  },
  { 
    label: 'Notifications', 
    link: '/dashboard/notifications', 
    icon: Bell,
    badge:notificationSummaryLoading?'loading..': `${notificationSummary?.recent_count} new`,
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
}






