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

interface User {
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
   user:User,
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

interface BillsSummary {
  current_balance: number;
  overdue_amount: number;
  total_bills: number;
  pending_bills_count: number;
  overdue_bills_count: number;
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

interface Payment {
  id: string;
  payment_reference: string;
  amount_paid: number;
  payment_method: string;
  payment_date: string;
  payment_status: string;
  bill_description: string;
  mpesa_receipt?: string;
  transaction_id?: string;
}

interface MPesaPaymentRequest {
  bill_id: string;
  phone_number: string;
  amount: number;
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

interface PaymentStatus {
  payment_id: string;
  payment_reference: string;
  status: string;
  amount_paid: number;
  payment_method: string;
  mpesa_receipt?: string;
  payment_date: string;
  checkout_request_id?: string;
  bill_id: string;
  bill_number: string;
  bill_balance_remaining: number;
  notes?: string;
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