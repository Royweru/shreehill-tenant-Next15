import api from '@/lib/api';
import Cookies from 'js-cookie';

class AuthService {
  // Register user
  register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/api/users/auth/registration/', data);
    return response.data;
  }

  // Login user
  login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/api/users/auth/login/', data);
    const { access, refresh, user } = response.data;
    
    // Store tokens in cookies using the centralized method
    this.setTokens(access, refresh);
    
    return response.data;
  }

  // Verify email
  verifyEmail = async (key: string): Promise<VerifyEmailResponse> => {
    // Use GET request to your custom endpoint
    const response = await api.get(`/api/users/confirm-email/${key}/`);
    return response.data;
  }

  // Optional: Add resend verification method
  resendEmailVerification = async (): Promise<{ message: string }> => {
    const response = await api.post('/api/users/resend-verification/');
    return response.data;
  }

  // Get current user profile
  getCurrentUser = async (): Promise<User> => {
    const response = await api.get('/api/users/status/');
    console.log('Current user data:', response.data);
    return response.data;
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
  refreshToken = async (): Promise<AuthResponse> => {
    const { refresh } = this.getTokens();
    
    if (!refresh) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/api/users/auth/token/refresh/', {
      refresh: refresh
    });

    // Update tokens with new access token using centralized method
    const { access, refresh: newRefresh } = response.data;
    this.setTokens(access, newRefresh || refresh);
    
    console.log('Token refreshed successfully');
    return response.data;
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
        await api.post('/api/users/auth/logout/', { refresh: refreshToken });
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
}

export const authService = new AuthService();