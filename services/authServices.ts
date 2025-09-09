import Cookies from 'js-cookie';
import { apiClient } from '@/lib/apiClient';

class AuthService {
  // Register user
  register = async (data: RegisterData): Promise<AuthResponse> => {
    return await apiClient.post<AuthResponse>('/api/users/auth/registration/', data);
  }

  // Login user
  login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/users/auth/login/', data);
    const { access, refresh } = response;
    
    // Store tokens in cookies using the centralized method
    this.setTokens(access, refresh);
    
    return response;
  }

  // Verify email
  verifyEmail = async (key: string): Promise<VerifyEmailResponse> => {
    return await apiClient.get<VerifyEmailResponse>(`/api/users/confirm-email/${key}/`);
  }

  // Resend verification email
  resendEmailVerification = async (): Promise<{ message: string }> => {
    return await apiClient.post<{ message: string }>('/api/users/resend-verification/');
  }

  // Get current user profile
  getCurrentUser = async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/api/users/profile/');
    return response;
  }
 updateUserProfile= async (userData:Partial<UserProfile>) => {
  const response = await apiClient.patch('/api/users/profile/', userData)
 }
  getTokens = (): { access: string | null, refresh: string | null } => {
    return {
      access: Cookies.get('access_token') || null,
      refresh: Cookies.get('refresh_token') || null
    };
  }

  // Remove tokens (for logout)
  clearTokens = (): void => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  }

  // Refresh access token method
  refreshToken = async (): Promise<boolean> => {
    const { refresh } = this.getTokens();
    
    if (!refresh) {
      console.log('No refresh token available');
      return false;
    }

    try {
      const response = await apiClient.post<{ access: string; refresh?: string }>('/api/users/auth/token/refresh/', {
        refresh: refresh
      });

      // Update tokens with new access token using centralized method
      const { access, refresh: newRefresh } = response;
      this.setTokens(access, newRefresh || refresh);
      
      console.log('Token refreshed successfully');
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  // Check if user is authenticated
  isAuthenticated = (): boolean => {
    const { access } = this.getTokens();
    return !!access;
  }

  // Logout
  logout = async (): Promise<void> => {
    try {
      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        await apiClient.post('/api/users/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  // Centralized token management - single source of truth
  setTokens = (access: string, refresh: string): void => {
    try {
      console.log('Setting tokens:', { access: !!access, refresh: !!refresh });
      
      // Set cookies with the secure flag in production
      Cookies.set('access_token', access, {
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      
      Cookies.set('refresh_token', refresh, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    } catch (error) {
      console.error('Error setting tokens:', error);
    }
  }

  getAccessToken = (): string | undefined => {
    return Cookies.get('access_token');
  }

  // Get stored tokens for interceptor
  getStoredTokens = () => {
    return {
      access: Cookies.get('access_token'),
      refresh: Cookies.get('refresh_token')
    };
  }

  // Clear auth data
  clearAuthData = () => {
    this.clearTokens();
  }
}

export const authService = new AuthService();