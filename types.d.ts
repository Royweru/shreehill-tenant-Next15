interface RegisterData {
  email: string;
  password1: string;
  password2: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role?: string;
  national_id?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}
interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    pk: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    role: string;
  };
}

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string;
  role: string;
  national_id?: string;
  profile_image?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  date_joined: string;
  current_unit?:Unit,
  unit_number?:string,
  property_name?:string,
  water_fee:any,
  role:string,
  service_charge:string,
  property_id:string,
  email_verified:boolean,
  tenancy_start_date?:any,
  tenancy_end_date?:any,
  is_active:boolean,
  outstanding_balance:any,
  rent_due_day:number,
  last_login?: string;
}

interface VerifyEmailResponse {
  message: string;
  verified: boolean;
  user_email?: string;
  redirect_to_login?: boolean;
}

interface ErrorResponse {
  error: string;
  verified: boolean;
  detail?: string;
  expired?: boolean;
}

interface UserStatus{
   permissions:{
    is_staff:boolean;
    is_superuser:boolean;
   },
   profile:UserProfile,
   email_verified:boolean;
}

interface TenantInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  profile_image?: string;
}

interface CurrentUnit {
  id: string;
  unit_number: string;
  unit_type: string;
  property_name: string;
  property_address: string;
  monthly_rent: number;
  tenancy_start: string;
  tenancy_end?: string;
  rent_due_day: number;
}


interface RecentBill {
  id: string;
  bill_number: string;
  bill_type: string;
  description: string;
  amount: number;
  due_date: string;
  status: string;
  balance_due: number;
  is_overdue: boolean;
}

interface RecentPayment {
  id: string;
  payment_reference: string;
  amount_paid: number;
  payment_method: string;
  payment_date: string;
  bill_description: string;
  mpesa_receipt?: string;
}

interface UpcomingBill {
  id: string;
  bill_number: string;
  description: string;
  amount: number;
  due_date: string;
  days_until_due: number;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  created_at: string;
}

interface PaymentSummaryItem {
  month: string;
  month_name: string;
  total_paid: number;
}

interface DashboardData {
  tenant_info: TenantInfo;
  current_unit?: CurrentUnit;
  bills_summary: BillsSummary;
  recent_bills: RecentBill[];
  recent_payments: RecentPayment[];
  upcoming_bills: UpcomingBill[];
  notifications: NotificationItem[];
  payment_summary: PaymentSummaryItem[];
  is_tenancy_active: boolean;
}

interface Bill {
  id: string;
  bill_number: string;
  bill_type: string;
  description: string;
  amount: number;
  due_date: string;
  status: string;
  balance_due: number;
  amount_paid: number;
  is_overdue: boolean;
  created_at: string;
}



interface MPesaPaymentRequest {
  bill_id: string;
  phone_number: string;
  amount: any;
}

interface MPesaPaymentResponse {
  success: boolean;
  payment_id?: string;
  payment_reference?: string;
  checkout_request_id?: string;
  merchant_request_id?: string;
  response_description?: string;
  customer_message?: string;
  amount?: number;
  phone_number?: string;
  bill_number?: string;
  message?: string;
  error?: string;
}



interface PropertyDetails {
  id: string;
  name: string;
  address: string;
  city: string;
  county: string;
  amenities: string[];
  images: string[];
  description?: string;
}

interface UnitDetails {
  id: string;
  unit_number: string;
  unit_type: string;
  floor_area?: number;
  bedrooms?: number;
  bathrooms?: number;
  rent_amount?: number;
  deposit_amount: number;
  service_charge: number;
  parking_fee: number;
  is_furnished: boolean;
  features: string[];
  images: string[];
  status: string;
  property: PropertyDetails;
}



interface Unit{
  id:string,
  property:Property,
  property_id:string,
  property_name:string,
  unit_number:string,
  unit_type:string,
  floor_area:any,
  bedrooms:number,
  bathrooms:number,
  rent_amount:any,
  deposit_amount:any,
  service_charge:any,
  water_fee:any,
  is_furnished:boolean,
  features:string[],
  status:UnitStatus,
  current_tenant:{
    id:string,
    name:string,
    email:string,
    phone_number?:string,
    tenancy_start_date?:any,
    tenancy_end_date?:any,
    monthly_rent?:any,
    deposit_paid?:any,
    is_tenant_active?:boolean
  },
  bills:Bill[]
}

type UnitStatus ="occupied" | "available"|"maintenance" | "reserved"

interface Property{
 id:string,
 name:string,
 address:string,
 county:string,
 city:string,
 occupied_units:number,
 available_units:number,
 total_units:number,
 is_active:boolean,
 units:Unit[]
}

// types/billing.ts



 interface Payment {
  id: string;
  payment_reference: string;
  amount_paid: any; // Decimal as any
  payment_method: 'mpesa' | 'bank_transfer' | 'cash' | 'card' | 'cheque';
  payment_date: string; // ISO datetime string
  payment_status: 'pending' | 'completed' | 'failed' | 'reversed';
  tenant_name?: string;
  bill_description?: string;
  processed_by_name?: string;
  mpesa_receipt?: string;
  mpesa_phone?: string;
  transaction_id?: string;
  processing_fee?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  // Detailed fields
  bill?: Bill;
  processed_by?: User;
  webhook_data?: Record<string, any>;
  checkout_request_id?: string;
  merchant_request_id?: string;
}

 interface BillSummary {
  current_balance: any; // Decimal as any
  overdue_amount: any;
  next_due_date?: any;
  total_paid_this_year: any;
  upcoming_bills: Bill[];
  recent_payments: Payment[];
  bill_counts: {
    total: number;
    pending: number;
    overdue: number;
    paid: number;
  };
}



 interface MPesaPaymentResponse {
  success: boolean;
  payment_id?: string;
  payment_reference?: string;
  checkout_request_id?: string;
  merchant_request_id?: string;
  response_description?: string;
  customer_message?: string;
  amount?: string;
  phone_number?: string;
  bill_number?: string;
  message?: string;
  error?: string;
  response_code?: string;
}

 interface PaymentStatus {
  payment_id: string;
  payment_reference: string;
  status: 'pending' | 'completed' | 'failed' | 'reversed' | 'cancelled';
  amount_paid: string;
  payment_method: string;
  mpesa_receipt?: string;
  payment_date: string;
  checkout_request_id?: string;
  bill_id: string;
  bill_number: string;
  bill_balance_remaining: string;
  notes?: string;
}

// Filter interfaces
 interface BillFilters {
  status?: string;
  bill_type?: string;
  due_date_from?: string;
  due_date_to?: string;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

 interface PaymentFilters {
  payment_method?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

// Pagination interface
 interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Dashboard stats
 interface DashboardStats extends BillSummary {
  payment_trends: {
    month: string;
    amount: string;
  }[];
  bill_type_breakdown: {
    bill_type: string;
    count: number;
    total_amount: string;
  }[];
}

// Form interfaces
 interface PaymentFormData {
  bill_id: string;
  amount: number;
  phone_number: string;
}

 interface BillSearchResult {
  bills: Bill[];
  total: number;
  has_more: boolean;
}

 interface PaymentSearchResult {
  payments: Payment[];
  total: number;
  has_more: boolean;
}

// Constants
 BILL_TYPES = {
  rent: 'Rent',
  service_charge: 'Service Charge',
  utility: 'Utility',
  penalty: 'Late Penalty',
  deposit: 'Security Deposit',
  other: 'Other'
} as const;

 BILL_STATUS = {
  pending: 'Pending',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
  partial: 'Partially Paid'
} as const;

 PAYMENT_METHODS = {
  mpesa: 'M-Pesa',
  bank_transfer: 'Bank Transfer',
  cash: 'Cash',
  card: 'Card Payment',
  cheque: 'Cheque'
} as const;

PAYMENT_STATUS = {
  pending: 'Pending',
  completed: 'Completed',
  failed: 'Failed',
  reversed: 'Reversed',
  cancelled: 'Cancelled'
} as const;


type PriorityColors ='normal'|'urgent' |'high' |'low'

type StatusColors ='completed'|'pending' |'overdue' 

type IconTypes ='payment_success'|'payment_failed' |'maintenance_scheduled'|'rent_reminder' 

//Notifications

 interface NotificationSummary {
  total_notifications: number;
  unread_count: number;
  urgent_count: number;
  recent_count: number;
  payment_notifications: number;
  maintenance_notifications: number;
}

 interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type:NotificationType;
  channel: NotificationChannel;
  priority_level: NotificationPriorityLevel;
  status:NotificationStatus;
  is_read: boolean;
  sender_name?: string;
  action_url?: string;
  action_text?: string;
  time_ago: string;
  created_at: string;
  read_at?: string;
  metadata?: Record<string, any>;
}

 interface NotificationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}

 interface NotificationPreferences {
  rent_reminder_channels: string[];
  payment_channels: string[];
  maintenance_channels: string[];
  general_channels: string[];
  emergency_channels: string[];
  quiet_hours_start: string;
  quiet_hours_end: string;
  timezone: string;
  whatsapp_number?: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
  push_enabled: boolean;
}

type NotificationType=  'rent_reminder' | 'payment_success' | 'payment_failed' | 
    'lease_expiry' | 'maintenance_scheduled' | 'maintenance_completed' | 
    'bill_generated' | 'overdue_payment' | 'welcome' | 'general' | 
    'emergency' | 'community';
type NotificationPriorityLevel = 'low' | 'normal' | 'high' | 'urgent';
type NotificationStatus ='pending' | 'sent' | 'delivered' | 'failed' | 'cancelled';
enum NotificationChannel {
  IN_APP ='in_app',
  SMS ='sms',
  EMAIL ='email',
  PUSH = 'push'
}
