import { authService } from '@/services/auth';
import { storageService } from '@/services/storage';
import { useAppStore, useAuthStore } from '@/store';
import { act, renderHook } from '@testing-library/react-native';

// Mock services
jest.mock('@/services/auth');
jest.mock('@/services/storage');

const mockedAuthService = authService as jest.Mocked<typeof authService>;
const mockedStorageService = storageService as jest.Mocked<typeof storageService>;

describe('Zustand Store - Auth Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store to initial state
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: false,
      error: null,
    });
  });

  describe('Initial State', () => {
    it('initializes with null user and token', () => {
      const { result } = renderHook(() => useAuthStore());
      
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isInitialized).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Setters', () => {
    it('setUser updates user', () => {
      const { result } = renderHook(() => useAuthStore());
      const user = { id: '1', email: 'test@example.com', name: 'Test User' };

      act(() => {
        result.current.setUser(user);
      });

      expect(result.current.user).toEqual(user);
    });

    it('setToken updates token', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setToken('token123');
      });

      expect(result.current.token).toBe('token123');
    });

    it('setLoading updates loading state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('setError updates error message', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.error).toBe('Test error');
    });

    it('clearError clears error message', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('initialize', () => {
    it('loads auth state from storage on initialize', async () => {
      const user = { id: '1', email: 'test@example.com', name: 'User' };
      mockedStorageService.getAuthToken.mockResolvedValue('token123');
      mockedStorageService.getUserData.mockResolvedValue(user);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.initialize();
      });

      expect(result.current.token).toBe('token123');
      expect(result.current.user).toEqual(user);
      expect(result.current.isInitialized).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it('handles missing auth data gracefully', async () => {
      mockedStorageService.getAuthToken.mockResolvedValue(null);
      mockedStorageService.getUserData.mockResolvedValue(null);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.initialize();
      });

      expect(result.current.token).toBeNull();
      expect(result.current.user).toBeNull();
      expect(result.current.isInitialized).toBe(true);
    });

    it('handles initialize errors', async () => {
      mockedStorageService.getAuthToken.mockRejectedValue(new Error('Storage error'));

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.initialize();
      });

      expect(result.current.isInitialized).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('login', () => {
    it('logs in user and stores token', async () => {
      const user = { id: '1', email: 'test@example.com', name: 'User' };
      const response = { user, token: 'token123' };
      mockedAuthService.login.mockResolvedValue(response);

      const { result } = renderHook(() => useAuthStore());

      let returnedUser;
      await act(async () => {
        returnedUser = await result.current.login('test@example.com', 'password');
      });

      expect(result.current.user).toEqual(user);
      expect(result.current.token).toBe('token123');
      expect(result.current.isLoading).toBe(false);
      expect(returnedUser).toEqual(user);
    });

    it('handles login error', async () => {
      mockedAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        try {
          await result.current.login('test@example.com', 'wrong');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Invalid credentials');
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('signup', () => {
    it('signs up user and stores credentials', async () => {
      const user = { id: '2', email: 'new@example.com', name: 'New User' };
      const response = { user, token: 'token456' };
      mockedAuthService.signup.mockResolvedValue(response);

      const { result } = renderHook(() => useAuthStore());

      let returnedUser;
      await act(async () => {
        returnedUser = await result.current.signup('new@example.com', 'password', 'New User');
      });

      expect(result.current.user).toEqual(user);
      expect(result.current.token).toBe('token456');
      expect(returnedUser).toEqual(user);
    });

    it('handles signup error', async () => {
      mockedAuthService.signup.mockRejectedValue(new Error('Email already exists'));

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        try {
          await result.current.signup('existing@example.com', 'pass', 'Name');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Email already exists');
    });
  });

  describe('logout', () => {
    it('clears user and token', async () => {
      mockedAuthService.logout.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuthStore());

      // Set initial state
      act(() => {
        result.current.setUser({ id: '1', email: 'test@example.com', name: 'User' });
        result.current.setToken('token123');
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('handles logout error gracefully', async () => {
      mockedAuthService.logout.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isLoading).toBe(false);
    });
  });
});

describe('Zustand Store - App Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store to initial state
    useAppStore.setState({
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
      theme: 'auto',
      language: 'en',
    });
  });

  describe('Initial State', () => {
    it('initializes with default values', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.theme).toBe('auto');
      expect(result.current.language).toBe('en');
      expect(result.current.apiUrl).toBeDefined();
    });
  });

  describe('setApiUrl', () => {
    it('updates API URL', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setApiUrl('https://new-api.example.com');
      });

      expect(result.current.apiUrl).toBe('https://new-api.example.com');
    });
  });

  describe('setTheme', () => {
    it('updates theme to light', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
    });

    it('updates theme to dark', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
    });
  });

  describe('setLanguage', () => {
    it('updates language', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setLanguage('es');
      });

      expect(result.current.language).toBe('es');
    });
  });
});
