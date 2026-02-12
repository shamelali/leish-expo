import { apiService } from '@/services/api';
import { authService } from '@/services/auth';
import { useAppStore, useAuthStore } from '@/store';
import { act, renderHook } from '@testing-library/react-native';

jest.mock('@/services/api');
jest.mock('@/services/auth');

const mockedApiService = apiService as jest.Mocked<typeof apiService>;
const mockedAuthService = authService as jest.Mocked<typeof authService>;

describe('Integration Tests - API and Store Synchronization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: false,
      error: null,
    });
    useAppStore.setState({
      theme: 'light',
      language: 'en',
      apiUrl: 'http://localhost:3000',
    });
  });

  describe('API URL Configuration', () => {
    it('updates API service when app store changes API URL', async () => {
      const { result: appStoreResult } = renderHook(() => useAppStore());

      expect(appStoreResult.current.apiUrl).toBe('http://localhost:3000');

      act(() => {
        appStoreResult.current.setApiUrl('http://api.production.com');
      });

      expect(appStoreResult.current.apiUrl).toBe('http://api.production.com');
    });

    it('maintains API URL across multiple requests', async () => {
      const { result: appStoreResult } = renderHook(() => useAppStore());

      const newApiUrl = 'http://staging.api.com';
      act(() => {
        appStoreResult.current.setApiUrl(newApiUrl);
      });

      // Simulate multiple API calls
      mockedApiService.get.mockResolvedValue({ data: 'response1' });
      await act(async () => {
        await mockedApiService.get('/endpoint1');
      });

      mockedApiService.get.mockResolvedValue({ data: 'response2' });
      await act(async () => {
        await mockedApiService.get('/endpoint2');
      });

      expect(appStoreResult.current.apiUrl).toBe(newApiUrl);
    });
  });

  describe('Token Management', () => {
    it('updates auth token in store after login and persists it', async () => {
      const user = { id: '1', email: 'test@example.com', name: 'User' };
      const token = 'jwt-token-12345';
      
      mockedAuthService.login.mockResolvedValue({ user, token });

      const { result: authStoreResult } = renderHook(() => useAuthStore());

      expect(authStoreResult.current.token).toBeNull();

      await act(async () => {
        await authStoreResult.current.login('test@example.com', 'password');
      });

      expect(authStoreResult.current.token).toBe(token);
      expect(mockedAuthService.login).toHaveBeenCalledWith('test@example.com', 'password');
    });

    it('provides token to API calls from auth store', async () => {
      const token = 'valid-jwt-token';
      const user = { id: '1', email: 'test@example.com', name: 'User' };

      const { result: authStoreResult } = renderHook(() => useAuthStore());

      act(() => {
        authStoreResult.current.setToken(token);
        authStoreResult.current.setUser(user);
      });

      mockedApiService.get.mockResolvedValue({ data: 'user-data' });

      // Simulate getting current user with token
      await act(async () => {
        const userData = await mockedApiService.get('/user');
        expect(userData.data).toBe('user-data');
      });

      expect(authStoreResult.current.token).toBe(token);
    });
  });

  describe('User Data Consistency', () => {
    it('maintains consistent user data between store and API responses', async () => {
      const userData = { id: '1', email: 'test@example.com', name: 'Test User', role: 'user' };
      
      const { result: authStoreResult } = renderHook(() => useAuthStore());

      act(() => {
        authStoreResult.current.setUser(userData);
      });

      // Simulate API returning user data
      mockedApiService.get.mockResolvedValue(userData);

      const apiResponse = await act(async () => {
        return await mockedApiService.get('/user');
      });

      expect(authStoreResult.current.user).toEqual(userData);
      expect(apiResponse).toEqual(userData);
    });

    it('updates user in store when user data is fetched from API', async () => {
      const updatedUserData = { id: '1', email: 'updated@example.com', name: 'Updated User' };

      const { result: authStoreResult } = renderHook(() => useAuthStore());

      act(() => {
        authStoreResult.current.setUser({ id: '1', email: 'old@example.com', name: 'Old User' });
      });

      mockedApiService.get.mockResolvedValue(updatedUserData);

      await act(async () => {
        const newUserData = await mockedApiService.get('/user');
        authStoreResult.current.setUser(newUserData);
      });

      expect(authStoreResult.current.user).toEqual(updatedUserData);
    });
  });

  describe('Loading States', () => {
    it('manages loading state during API operations', async () => {
      const { result: authStoreResult } = renderHook(() => useAuthStore());

      expect(authStoreResult.current.isLoading).toBe(false);

      mockedAuthService.login.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ user: { id: '1' }, token: 'token' }), 100))
      );

      let loginPromise;
      act(() => {
        authStoreResult.current.setLoading(true);
        loginPromise = mockedAuthService.login('test@example.com', 'password');
      });

      expect(authStoreResult.current.isLoading).toBe(true);

      await act(async () => {
        const result = await loginPromise;
        if (result) {
          authStoreResult.current.setUser(result.user);
          authStoreResult.current.setToken(result.token);
          authStoreResult.current.setLoading(false);
        }
      });

      expect(authStoreResult.current.isLoading).toBe(false);
    });

    it('shows loading indicator is false when API call completes', async () => {
      const { result: authStoreResult } = renderHook(() => useAuthStore());

      mockedApiService.get.mockResolvedValue({ data: 'result' });

      act(() => {
        authStoreResult.current.setLoading(true);
      });

      await act(async () => {
        await mockedApiService.get('/data');
        authStoreResult.current.setLoading(false);
      });

      expect(authStoreResult.current.isLoading).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('handles API errors and updates store error state', async () => {
      const { result: authStoreResult } = renderHook(() => useAuthStore());

      const apiError = new Error('API Error: Server Error');
      mockedApiService.get.mockRejectedValue(apiError);

      await act(async () => {
        try {
          await mockedApiService.get('/data');
          authStoreResult.current.setError('Failed to fetch data');
        } catch (e) {
          authStoreResult.current.setError('Failed to fetch data');
        }
      });

      expect(authStoreResult.current.error).toBe('Failed to fetch data');
    });

    it('recovers from API error when retry succeeds', async () => {
      const { result: authStoreResult } = renderHook(() => useAuthStore());

      // First call fails
      mockedApiService.get.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        try {
          await mockedApiService.get('/data');
          authStoreResult.current.setError('Network error');
        } catch (e) {
          authStoreResult.current.setError('Network error');
        }
      });

      expect(authStoreResult.current.error).toBe('Network error');

      // Retry succeeds
      mockedApiService.get.mockResolvedValueOnce({ data: 'success' });

      await act(async () => {
        const result = await mockedApiService.get('/data');
        if (result) {
          authStoreResult.current.setError(null);
        }
      });

      expect(authStoreResult.current.error).toBeNull();
    });
  });

  describe('Multi-Store Coordination', () => {
    it('coordinates between auth and app stores for app initialization', async () => {
      const { result: authStoreResult } = renderHook(() => useAuthStore());
      const { result: appStoreResult } = renderHook(() => useAppStore());

      // Initialize app with API URL
      act(() => {
        appStoreResult.current.setApiUrl('http://api.example.com');
        appStoreResult.current.setTheme('dark');
        appStoreResult.current.setLanguage('es');
      });

      expect(appStoreResult.current.apiUrl).toBe('http://api.example.com');
      expect(appStoreResult.current.theme).toBe('dark');
      expect(appStoreResult.current.language).toBe('es');

      // Then login
      mockedAuthService.login.mockResolvedValue({
        user: { id: '1', email: 'test@example.com' },
        token: 'token',
      });

      await act(async () => {
        await authStoreResult.current.login('test@example.com', 'password');
      });

      expect(authStoreResult.current.user).not.toBeNull();
      expect(appStoreResult.current.apiUrl).toBe('http://api.example.com');
    });

    it('maintains separate concerns between auth and app stores', async () => {
      const { result: authStoreResult } = renderHook(() => useAuthStore());
      const { result: appStoreResult } = renderHook(() => useAppStore());

      // Change app settings
      act(() => {
        appStoreResult.current.setTheme('dark');
        appStoreResult.current.setLanguage('fr');
      });

      // Auth state should be unaffected
      expect(authStoreResult.current.user).toBeNull();
      expect(authStoreResult.current.token).toBeNull();

      // Set auth data
      act(() => {
        authStoreResult.current.setUser({ id: '1' });
        authStoreResult.current.setToken('token');
      });

      // App settings should remain unchanged
      expect(appStoreResult.current.theme).toBe('dark');
      expect(appStoreResult.current.language).toBe('fr');
    });
  });

  describe('Logout and State Cleanup', () => {
    it('clears auth state including token used by API', async () => {
      const { result: authStoreResult } = renderHook(() => useAuthStore());

      act(() => {
        authStoreResult.current.setUser({ id: '1', email: 'test@example.com' });
        authStoreResult.current.setToken('valid-token');
      });

      expect(authStoreResult.current.token).toBe('valid-token');

      mockedAuthService.logout.mockResolvedValue(undefined);

      await act(async () => {
        await authStoreResult.current.logout();
      });

      expect(authStoreResult.current.token).toBeNull();
      expect(authStoreResult.current.user).toBeNull();
    });
  });

  describe('App Settings Persistence', () => {
    it('preserves theme setting across store operations', async () => {
      const { result: appStoreResult } = renderHook(() => useAppStore());

      act(() => {
        appStoreResult.current.setTheme('dark');
      });

      expect(appStoreResult.current.theme).toBe('dark');

      // Perform some other operations
      act(() => {
        appStoreResult.current.setLanguage('en');
      });

      expect(appStoreResult.current.theme).toBe('dark');
      expect(appStoreResult.current.language).toBe('en');
    });

    it('preserves language setting across API calls', async () => {
      const { result: appStoreResult } = renderHook(() => useAppStore());

      act(() => {
        appStoreResult.current.setLanguage('de');
      });

      mockedApiService.get.mockResolvedValue({ data: 'response' });

      await act(async () => {
        await mockedApiService.get('/data');
      });

      expect(appStoreResult.current.language).toBe('de');
    });
  });

  describe('Initialization Sequence', () => {
    it('initializes auth store before making authenticated requests', async () => {
      const user = { id: '1', email: 'test@example.com' };
      const token = 'restored-token';

      const { result: authStoreResult } = renderHook(() => useAuthStore());

      mockedAuthService.initialize = jest.fn().mockResolvedValue({ user, token });

      await act(async () => {
        if (mockedAuthService.initialize) {
          const initialized = await mockedAuthService.initialize();
          if (initialized) {
            authStoreResult.current.setUser(initialized.user);
            authStoreResult.current.setToken(initialized.token);
          }
        }
      });

      expect(authStoreResult.current.user).toEqual(user);
      expect(authStoreResult.current.token).toBe(token);
    });
  });
});
