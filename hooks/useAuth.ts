import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authServices';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { handleDjangoError } from '@/lib/utils';


export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Get current user - FIXED: queryFn should call the function
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery<UserStatus>({
    queryKey: ['user'], 
    queryFn: () => authService.getCurrentUser(), // Fixed: Call the function
    enabled: authService.isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      toast.success('Registration successful! Please check your email to verify your account.');
      router.push('/auth/check-email');
    },
    onError: (error: any) => {
      const message = handleDjangoError(error);
      toast.error(message);
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      console.log('Mutation success:', data);
      queryClient.setQueryData(['user'], data.user);
      toast.success('Login successful!');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      const message = handleDjangoError(error);
      console.error('Login error:', message);
      toast.error(message);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/auth/login');
    },
    onError: (error: any) => {
      console.error('Logout error:', error);
      // Clear local state even if API call fails
      authService.clearTokens();
      queryClient.clear();
      router.push('/auth/login');
    },
  });

  // Email verification mutation
  const verifyEmailMutation = useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: (data) => {
      toast.success(data.message || 'Email verified successfully!');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      const message = handleDjangoError(error);
      console.error('Email verification error:', message);
      toast.error(message);
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: authService.resendEmailVerification,
    onSuccess: (data) => {
      toast.success(data.message || 'Verification email sent!');
    },
    onError: (error: any) => {
      const message = handleDjangoError(error);
      toast.error(message);
    },
  });

  return {
    user,
    isLoadingUser,
    isAuthenticated: authService.isAuthenticated(),
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    isVerifying: verifyEmailMutation.isPending,
    verificationError: verifyEmailMutation.isError,
    verifyEmail: verifyEmailMutation.mutate,
    verificationData: verifyEmailMutation.data,
    resendVerification: resendVerificationMutation.mutate,
    isResending: resendVerificationMutation.isPending,
  };
}