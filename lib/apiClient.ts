import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class TenantApiClient {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = Cookies.get('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor with improved token refresh handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Only handle 401 errors and avoid infinite loops
        if (error.response?.status === 401 && !originalRequest._retry) {
          // Prevent multiple refresh attempts
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.axiosInstance(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            console.log('Attempting token refresh due to 401...');
            const refreshToken = Cookies.get('refresh_token');
            
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/api/users/auth/token/refresh/`, {
                refresh: refreshToken,
              });

              const { access, refresh: newRefresh } = response.data;
              
              // Update tokens
              Cookies.set('access_token', access, {
                expires: 1,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
              });
              
              if (newRefresh) {
                Cookies.set('refresh_token', newRefresh, {
                  expires: 7,
                  secure: process.env.NODE_ENV === 'production',
                  sameSite: 'lax'
                });
              }

              console.log('Token refresh successful, retrying failed requests...');
              // Process all queued requests
              this.processQueue(null);
              
              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${access}`;
              return this.axiosInstance(originalRequest);
            } else {
              throw new Error('No refresh token available');
            }
          } catch (refreshError) {
            console.error('Token refresh error:', refreshError);
            this.processQueue(refreshError);
            this.redirectToLogin();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
    
    this.failedQueue = [];
  }

  private redirectToLogin() {
    if (typeof window !== 'undefined') {
      // Clear auth data before redirecting
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      window.location.href = '/auth/login';
    }
  }

  async get<T>(endpoint: string, params?: any): Promise<T> {
    const config: AxiosRequestConfig = {};
    if (params && Object.keys(params).length > 0) {
      config.params = params;
    }
    
    const response: AxiosResponse<T> = await this.axiosInstance.get(endpoint, config);
    return response.data;
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(endpoint, data);
    return response.data;
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(endpoint);
    return response.data;
  }
}

export const apiClient = new TenantApiClient(API_BASE_URL);