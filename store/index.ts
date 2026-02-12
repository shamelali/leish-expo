import { authService } from '@/services/auth';
import { storageService } from '@/services/storage';
import { User } from '@/types';
import { create } from 'zustand';

export interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Auth actions
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, name: string) => Promise<User>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  // Setters
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Initialize auth state from storage
  initialize: async () => {
    set({ isLoading: true });
    try {
      const token = await storageService.getAuthToken();
      const userData = await storageService.getUserData();

      if (token && userData) {
        set({ token, user: userData });
      }
    } catch (error) {
      console.error('Initialize auth error:', error);
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  // Login
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);
      set({
        user: response.user,
        token: response.token,
        isLoading: false,
      });
      return response.user;
    } catch (error: any) {
      const errorMessage = error?.message || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Signup
  signup: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.signup(email, password, name);
      set({
        user: response.user,
        token: response.token,
        isLoading: false,
      });
      return response.user;
    } catch (error: any) {
      const errorMessage = error?.message || 'Signup failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({ user: null, token: null, isLoading: false });
    } catch (error) {
      console.error('Logout error:', error);
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

// App state store for global settings
export interface AppState {
  apiUrl: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  setApiUrl: (url: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setLanguage: (lang: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
  theme: 'auto',
  language: 'en',
  setApiUrl: (url) => set({ apiUrl: url }),
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
}));
