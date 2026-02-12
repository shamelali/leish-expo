import axios, { AxiosError, AxiosInstance, isAxiosError } from 'axios';
import { storageService } from './storage';

// Configure your API base URL here
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to headers
apiClient.interceptors.request.use(
  async (config) => {
    const token = await storageService.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle 401 - unauthorized
    if (error.response?.status === 401) {
      await storageService.clearAuth();
      // Trigger logout or redirect to login
      // This will be handled by the auth store
    }

    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth endpoints
  async login(email: string, password: string) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async signup(email: string, password: string, name: string) {
    try {
      const response = await apiClient.post('/auth/signup', {
        email,
        password,
        name,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async refreshToken() {
    try {
      const response = await apiClient.post('/auth/refresh');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Generic GET request
  async get<T = any>(endpoint: string, config?: any): Promise<T> {
    try {
      const response = await apiClient.get<T>(endpoint, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Generic POST request
  async post<T = any>(endpoint: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await apiClient.post<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Generic PUT request
  async put<T = any>(endpoint: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await apiClient.put<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Generic DELETE request
  async delete<T = any>(endpoint: string, config?: any): Promise<T> {
    try {
      const response = await apiClient.delete<T>(endpoint, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Error handling
  handleError(error: any) {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      return {
        status,
        message,
        code: error.response?.data?.code,
      };
    }

    return {
      status: 500,
      message: 'An unexpected error occurred',
    };
  },
};

export default apiClient;
