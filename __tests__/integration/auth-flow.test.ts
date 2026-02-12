import { apiService } from '@/services/api';
import { authService } from '@/services/auth';
import { storageService } from '@/services/storage';
import { useAuthStore } from '@/store';
import { act, renderHook } from '@testing-library/react-native';

// Mock all services
jest.mock('@/services/auth');
jest.mock('@/services/storage');
jest.mock('@/services/api');

const mockedAuthService = authService as jest.Mocked<typeof authService>;
const mockedStorageService = storageService as jest.Mocked<typeof storageService>;
const mockedApiService = apiService as jest.Mocked<typeof apiService>;

describe('Integration Tests - Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: false,
      error: null,
    });
  });

  describe('Complete Login Flow', () => {
    it('logs in user and updates all stores', async () => {
      const user = { id: '1', email: 'test@example.com', name: 'Test User' };
      const response = { user, token: 'auth-token-123' };
      
      mockedAuthService.login.mockResolvedValue(response);
      mockedStorageService.setAuthToken.mockResolvedValue(undefined);
      mockedStorageService.setUserData.mockResolvedValue(undefined);
      mockedStorageService.setUserEmail.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuthStore());

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'password123');
      });

      // Verify store state updated
      expect(result.current.user).toEqual(user);
      expect(result.current.token).toBe('auth-token-123');
      expect(result.current.isLoading).toBe(false);
      expect(loginResult).toEqual(user);

      // Verify auth service called
      expect(mockedAuthService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('handles login failure and clears auth state', async () => {
      const error = new Error('Invalid credentials');
      mockedAuthService.login.mockRejectedValue(error);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        try {
          await result.current.login('wrong@example.com', 'wrong-password');
        } catch (e) {
          // Expected to throw
        }
      });

      // Verify error state
      expect(result.current.error).toBe('Invalid credentials');
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Complete Signup Flow', () => {
    it('signs up user and persists data', async () => {
      const user = { id: '2', email: 'newuser@example.com', name: 'New User' };
      const response = { user, token: 'new-token-456' };

      mockedAuthService.signup.mockResolvedValue(response);
      mockedStorageService.setAuthToken.mockResolvedValue(undefined);
      mockedStorageService.setUserData.mockResolvedValue(undefined);
      mockedStorageService.setUserEmail.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuthStore());

      let signupResult;
      await act(async () => {
        signupResult = await result.current.signup('newuser@example.com', 'password', 'New User');
      });

      expect(result.current.user).toEqual(user);
      expect(result.current.token).toBe('new-token-456');
      expect(signupResult).toEqual(user);
      expect(mockedAuthService.signup).toHaveBeenCalledWith('newuser@example.com', 'password', 'New User');
    });
  });

  describe('Complete Logout Flow', () => {
    it('clears all auth data on logout', async () => {
      mockedAuthService.logout.mockResolvedValue(undefined);
      mockedStorageService.clearAuth.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuthStore());

      // Set initial authenticated state
      act(() => {
        result.current.setUser({ id: '1', email: 'test@example.com', name: 'User' });
        result.current.setToken('auth-token-123');
      });

      expect(result.current.user).not.toBeNull();
      expect(result.current.token).not.toBeNull();

      // Logout
      await act(async () => {
        await result.current.logout();
      });

      // Verify all auth data cleared
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(mockedAuthService.logout).toHaveBeenCalled();
    });
  });

  describe('Initialize and Restore Session', () => {
    it('restores user session from storage on initialize', async () => {
      const storedUser = { id: '1', email: 'test@example.com', name: 'Test User' };
      mockedStorageService.getAuthToken.mockResolvedValue('stored-token-123');
      mockedStorageService.getUserData.mockResolvedValue(storedUser);

      const { result } = renderHook(() => useAuthStore());

      expect(result.current.isInitialized).toBe(false);

      await act(async () => {
        await result.current.initialize();
      });

      expect(result.current.token).toBe('stored-token-123');
      expect(result.current.user).toEqual(storedUser);
      expect(result.current.isInitialized).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('initializes with no auth data if not logged in', async () => {
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
  });

  describe('Error Recovery', () => {
    it('recovers from login error with clearError', async () => {
      mockedAuthService.login.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        try {
          await result.current.login('test@example.com', 'password');
        } catch (e) {
          // Expected
        }
      });

      expect(result.current.error).toBe('Network error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('clears previous error on successful login after failure', async () => {
      mockedAuthService.login.mockRejectedValueOnce(new Error('First error'));

      const { result } = renderHook(() => useAuthStore());

      // First failed login
      await act(async () => {
        try {
          await result.current.login('test@example.com', 'wrong-password');
        } catch (e) {
          // Expected
        }
      });

      expect(result.current.error).toBe('First error');

      // Second successful login
      const user = { id: '1', email: 'test@example.com', name: 'User' };
      mockedAuthService.login.mockResolvedValueOnce({ user, token: 'new-token' });

      await act(async () => {
        await result.current.login('test@example.com', 'correct-password');
      });

      expect(result.current.error).toBeNull();
      expect(result.current.user).toEqual(user);
    });
  });

  describe('Concurrent Operations', () => {
    it('handles multiple state updates correctly', async () => {
      const user = { id: '1', email: 'test@example.com', name: 'User' };
      mockedAuthService.login.mockResolvedValue({ user, token: 'token' });

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setLoading(true);
        result.current.setError(null);
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();

      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });

      expect(result.current.user).toEqual(user);
      expect(result.current.token).toBe('token');
    });
  });

  describe('Session Persistence', () => {
    it('preserves user state across store updates', async () => {
      const user = { id: '1', email: 'test@example.com', name: 'Test User' };

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setUser(user);
        result.current.setToken('token123');
      });

      // Update other parts of state
      act(() => {
        result.current.setLoading(false);
        result.current.setError(null);
      });

      // User and token should persist
      expect(result.current.user).toEqual(user);
      expect(result.current.token).toBe('token123');
    });
  });

  describe('Error Messages', () => {
    it('preserves specific error messages from auth service', async () => {
      const specificError = new Error('Email not found');
      mockedAuthService.login.mockRejectedValue(specificError);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        try {
          await result.current.login('nonexistent@example.com', 'password');
        } catch (e) {
          // Expected
        }
      });

      expect(result.current.error).toBe('Email not found');
    });

    it('falls back to generic message when error is missing message', async () => {
      mockedAuthService.signup.mockRejectedValue(new Error());

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        try {
          await result.current.signup('test@example.com', 'password', 'User');
        } catch (e) {
          // Expected
        }
      });

      expect(result.current.error).toBe('Signup failed');
    });
  });

  describe('State Immutability', () => {
    it('does not mutate previous user object', async () => {
      const originalUser = { id: '1', email: 'test@example.com', name: 'User' };
      const newUser = { id: '2', email: 'new@example.com', name: 'New User' };

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setUser(originalUser);
      });

      const firstUser = result.current.user;

      act(() => {
        result.current.setUser(newUser);
      });

      // Original reference should be different
      expect(firstUser).toEqual(originalUser);
      expect(result.current.user).toEqual(newUser);
      expect(result.current.user).not.toBe(firstUser);
    });
  });
});
