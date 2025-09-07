import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * Handles Django REST API errors and returns user-friendly messages
 * @param error - The error object from the API request
 * @returns A formatted error message string
 */
export const handleDjangoError = (error: any): string => {
  // If no error object, return generic message
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  // Handle network errors (no response from server)
  if (!error.response) {
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      return 'Network error. Please check your internet connection and try again.';
    }
    return 'Unable to connect to server. Please try again later.';
  }

  const { status, data } = error.response;

  // Handle different HTTP status codes
  switch (status) {
    case 400: // Bad Request
      return handleBadRequest(data);
    
    case 401: // Unauthorized
      return handleUnauthorized(data);
    
    case 403: // Forbidden
      return handleForbidden(data);
    
    case 404: // Not Found
      return 'The requested resource was not found.';
    
    case 409: // Conflict
      return handleConflict(data);
    
    case 429: // Too Many Requests
      return 'Too many requests. Please wait a moment before trying again.';
    
    case 500: // Internal Server Error
      return 'Server error. Please try again later or contact support if the problem persists.';
    
    case 503: // Service Unavailable
      return 'Service temporarily unavailable. Please try again later.';
    
    default:
      return handleGenericError(data) || `An error occurred (${status}). Please try again.`;
  }
};

/**
 * Handles 400 Bad Request errors (validation errors)
 */
const handleBadRequest = (data: any): string => {
  if (!data) return 'Invalid request. Please check your input and try again.';

  // Handle Django REST Framework validation errors
  if (data.detail) {
    return String(data.detail);
  }

  // Handle field-specific validation errors
  if (typeof data === 'object') {
    const errors: string[] = [];

    // Extract field errors
    Object.keys(data).forEach(field => {
      const fieldErrors = data[field];
      
      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach(error => {
          if (field === 'non_field_errors') {
            errors.push(String(error));
          } else {
            errors.push(`${formatFieldName(field)}: ${error}`);
          }
        });
      } else if (typeof fieldErrors === 'string') {
        if (field === 'non_field_errors') {
          errors.push(fieldErrors);
        } else {
          errors.push(`${formatFieldName(field)}: ${fieldErrors}`);
        }
      }
    });

    if (errors.length > 0) {
      return errors.join('. ');
    }
  }

  return 'Invalid request. Please check your input and try again.';
};

/**
 * Handles 401 Unauthorized errors
 */
const handleUnauthorized = (data: any): string => {
  if (data?.detail) {
    const detail = String(data.detail).toLowerCase();
    
    if (detail.includes('invalid') && detail.includes('credentials')) {
      return 'Invalid email or password. Please try again.';
    }
    
    if (detail.includes('token') && detail.includes('invalid')) {
      return 'Your session has expired. Please log in again.';
    }
    
    if (detail.includes('not verified') || detail.includes('email') && detail.includes('verify')) {
      return 'Please verify your email address before logging in.';
    }
  }

  return 'Authentication failed. Please log in and try again.';
};

/**
 * Handles 403 Forbidden errors
 */
const handleForbidden = (data: any): string => {
  if (data?.detail) {
    return String(data.detail);
  }
  
  return 'You do not have permission to perform this action.';
};

/**
 * Handles 409 Conflict errors
 */
const handleConflict = (data: any): string => {
  if (data?.detail) {
    const detail = String(data.detail).toLowerCase();
    
    if (detail.includes('email') && detail.includes('already')) {
      return 'An account with this email address already exists.';
    }
    
    if (detail.includes('username') && detail.includes('already')) {
      return 'This username is already taken.';
    }
  }

  return 'A conflict occurred. The resource may already exist.';
};

/**
 * Handles generic errors by trying to extract meaningful messages
 */
const handleGenericError = (data: any): string | null => {
  if (!data) return null;

  // Try to find a meaningful error message
  if (data.detail) return String(data.detail);
  if (data.message) return String(data.message);
  if (data.error) return String(data.error);
  
  // If data is a string, return it
  if (typeof data === 'string') return data;

  return null;
};

/**
 * Formats field names to be more user-friendly
 */
const formatFieldName = (field: string): string => {
  // Handle common Django field patterns
  const fieldMap: Record<string, string> = {
    'email': 'Email',
    'password': 'Password',
    'password1': 'Password',
    'password2': 'Confirm Password',
    'first_name': 'First Name',
    'last_name': 'Last Name',
    'phone_number': 'Phone Number',
    'date_of_birth': 'Date of Birth',
    'confirm_password': 'Confirm Password',
  };

  if (fieldMap[field]) {
    return fieldMap[field];
  }

  // Convert snake_case to Title Case
  return field
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Enhanced error handler that also handles common Django authentication errors
 */
export const handleAuthError = (error: any): string => {
  if (!error?.response?.data) {
    return handleDjangoError(error);
  }

  const { status, data } = error.response;

  // Handle specific authentication error patterns
  if (status === 400) {
    // Handle dj-rest-auth specific errors
    if (data.email) {
      return 'Please enter a valid email address.';
    }
    
    if (data.password1) {
      return Array.isArray(data.password1) ? data.password1[0] : data.password1;
    }
    
    if (data.password2) {
      return 'Password confirmation does not match.';
    }
    
    if (data.non_field_errors) {
      const errors = Array.isArray(data.non_field_errors) 
        ? data.non_field_errors 
        : [data.non_field_errors];
      return errors.join('. ');
    }
  }

  // Fall back to general handler
  return handleDjangoError(error);
};

/**
 * Type definitions for better TypeScript support
 */
export interface DjangoErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
  [key: string]: any;
}

export interface ApiError {
  response?: {
    status: number;
    data: DjangoErrorResponse;
  };
  message?: string;
  code?: string;
}



export const formatCurrency = (amount:any) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString:any) => {
  return new Date(dateString).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};


export const tenantQueryKeys = {
  dashboard: ['tenant', 'dashboard'] as const,
  bills: {
    all: ['tenant', 'bills'] as const,
    list: (params?: any) => ['tenant', 'bills', 'list', params] as const,
    detail: (id: string) => ['tenant', 'bills', 'detail', id] as const,
    overdue: (params?: any) => ['tenant', 'bills', 'overdue', params] as const,
    summary: ['tenant', 'bills', 'summary'] as const,
  },
  payments: {
    all: ['tenant', 'payments'] as const,
    list: (params?: any) => ['tenant', 'payments', 'list', params] as const,
    detail: (id: string) => ['tenant', 'payments', 'detail', id] as const,
    recent: ['tenant', 'payments', 'recent'] as const,
    status: (id: string) => ['tenant', 'payments', 'status', id] as const,
  },
  property: {
    my: ['tenant', 'property', 'my'] as const,
    unit: ['tenant', 'unit', 'my'] as const,
  },
  notifications: {
    all: ['tenant', 'notifications'] as const,
    list: (params?: any) => ['tenant', 'notifications', 'list', params] as const,
  },
};