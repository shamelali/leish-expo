import { AuthResponse, User } from '@/types';
import { apiService } from './api';
import { storageService } from './storage';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiService.login(email, password);

      // Store credentials
      if (response.token) {
        await storageService.setAuthToken(response.token);
      }
      if (response.user) {
        await storageService.setUserData(response.user);
        await storageService.setUserEmail(email);
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const response = await apiService.signup(email, password, name);

      // Store credentials
      if (response.token) {
        await storageService.setAuthToken(response.token);
      }
      if (response.user) {
        await storageService.setUserData(response.user);
        await storageService.setUserEmail(email);
      }

      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout API error (non-blocking):', error);
    } finally {
      // Always clear local storage even if API call fails
      await storageService.clearAuth();
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiService.getCurrentUser();
      return response.user || null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await storageService.getAuthToken();
    return !!token;
  },

  async getStoredUser(): Promise<User | null> {
    return await storageService.getUserData();
  },
};
