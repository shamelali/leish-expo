import { useAuthStore } from '@/store';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const authStore = useAuthStore();
  const initialize = useAuthStore((s) => s.initialize);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      await initialize();
      setReady(true);
    };

    initAuth();
  }, [initialize]);

  return {
    user: authStore.user,
    token: authStore.token,
    isLoading: authStore.isLoading,
    isInitialized: authStore.isInitialized,
    ready,
    isAuthenticated: !!authStore.user,
    error: authStore.error,
    login: authStore.login,
    signup: authStore.signup,
    logout: authStore.logout,
    clearError: authStore.clearError,
  };
};
