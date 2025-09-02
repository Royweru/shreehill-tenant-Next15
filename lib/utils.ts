export const handleDjangoError = (error: any): string => {
  const errorData = error.response?.data;
  
  if (!errorData) {
    return 'An unexpected error occurred. Please try again.';
  }

  // Priority order for error extraction:
  // 1. non_field_errors (general validation)
  // 2. detail (DRF standard)
  // 3. field-specific errors
  // 4. fallback message

  if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
    return errorData.non_field_errors[0];
  }

  if (errorData.detail) {
    return errorData.detail;
  }

  // Handle field-specific errors
  const fieldErrorKeys = Object.keys(errorData).filter(key => 
    key !== 'detail' && key !== 'non_field_errors'
  );

  if (fieldErrorKeys.length > 0) {
    const firstField = fieldErrorKeys[0];
    const fieldError = errorData[firstField];
    
    if (Array.isArray(fieldError)) {
      return `${firstField}: ${fieldError[0]}`;
    } else if (typeof fieldError === 'string') {
      return `${firstField}: ${fieldError}`;
    }
  }

  return 'Validation failed. Please check your input and try again.';
};


// Query keys
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