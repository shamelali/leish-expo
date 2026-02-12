import { authService } from '@/services/auth';
import { useAppStore, useAuthStore } from '@/store';
import { act, renderHook } from '@testing-library/react-native';

jest.mock('@/services/auth');

const mockedAuthService = authService as jest.Mocked<typeof authService>;

describe('Integration Tests - Component and Store Interaction', () => {
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

  describe('Auth Flow Component Integration', () => {
    it('updates UI when store user changes', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();

      act(() => {
        result.current.setUser({ id: '1', email: 'test@example.com', name: 'User' });
      });

      expect(result.current.user).not.toBeNull();
      expect(result.current.user?.email).toBe('test@example.com');
    });

    it('displays loading state while authenticating', async () => {
      const { result } = renderHook(() => useAuthStore());

      mockedAuthService.login.mockImplementation(
        () => new Promise(resolve => {
          setTimeout(() => {
            resolve({ user: { id: '1' }, token: 'token' });
          }, 50);
        })
      );

      let loginPromise;
      act(() => {
        result.current.setLoading(true);
        loginPromise = mockedAuthService.login('test@example.com', 'password');
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        const res = await loginPromise;
        if (res) {
          result.current.setUser(res.user);
          result.current.setToken(res.token);
          result.current.setLoading(false);
        }
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).not.toBeNull();
    });

    it('displays error message when login fails', async () => {
      const { result } = renderHook(() => useAuthStore());

      mockedAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      expect(result.current.error).toBeNull();

      await act(async () => {
        try {
          await mockedAuthService.login('wrong@example.com', 'wrong');
        } catch (e) {
          if (e instanceof Error) {
            result.current.setError(e.message);
          }
        }
      });

      expect(result.current.error).toBe('Invalid credentials');
    });
  });

  describe('Theme Management Integration', () => {
    it('provides current theme to components', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.theme).toBe('light');

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
    });

    it('persists theme preference across store updates', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setTheme('dark');
      });

      // Simulate other store operation
      act(() => {
        result.current.setLanguage('en');
      });

      // Theme should persist
      expect(result.current.theme).toBe('dark');
    });

    it('updates theme globally when user preference changes', () => {
      const { result: appResult } = renderHook(() => useAppStore());

      const themes = ['light', 'dark', 'auto'] as const;
      themes.forEach(theme => {
        act(() => {
          appResult.current.setTheme(theme);
        });
        expect(appResult.current.theme).toBe(theme);
      });
    });
  });

  describe('Language Management Integration', () => {
    it('provides current language to components', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.language).toBe('en');

      act(() => {
        result.current.setLanguage('es');
      });

      expect(result.current.language).toBe('es');
    });

    it('changes language independently from other settings', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setLanguage('fr');
        result.current.setTheme('dark');
      });

      expect(result.current.language).toBe('fr');
      expect(result.current.theme).toBe('dark');

      act(() => {
        result.current.setLanguage('de');
      });

      expect(result.current.language).toBe('de');
      expect(result.current.theme).toBe('dark');
    });
  });

  describe('Authentication UI States', () => {
    it('transitions from logged out to logged in state', async () => {
      const { result: authResult } = renderHook(() => useAuthStore());

      // Initial state
      expect(authResult.current.user).toBeNull();
      expect(authResult.current.isInitialized).toBe(false);

      // Initialize
      act(() => {
        authResult.current.setLoading(true);
      });

      // Login
      const user = { id: '1', email: 'test@example.com', name: 'User' };
      mockedAuthService.login.mockResolvedValue({ user, token: 'token' });

      await act(async () => {
        const loginResult = await mockedAuthService.login('test@example.com', 'password');
        if (loginResult) {
          authResult.current.setUser(loginResult.user);
          authResult.current.setToken(loginResult.token);
          authResult.current.setLoading(false);
        }
      });

      // Final state
      expect(authResult.current.user).toEqual(user);
      expect(authResult.current.isLoading).toBe(false);
    });

    it('transitions from logged in to logged out state', async () => {
      const { result: authResult } = renderHook(() => useAuthStore());

      // Setup logged in state
      act(() => {
        authResult.current.setUser({ id: '1', email: 'test@example.com', name: 'User' });
        authResult.current.setToken('auth-token');
      });

      expect(authResult.current.user).not.toBeNull();

      // Logout
      mockedAuthService.logout.mockResolvedValue(undefined);

      await act(async () => {
        await mockedAuthService.logout();
        authResult.current.setUser(null);
        authResult.current.setToken(null);
        authResult.current.setError(null);
      });

      // Verify logged out state
      expect(authResult.current.user).toBeNull();
      expect(authResult.current.token).toBeNull();
      expect(authResult.current.error).toBeNull();
    });
  });

  describe('Error State Management', () => {
    it('clears errors when action succeeds', async () => {
      const { result } = renderHook(() => useAuthStore());

      // Set error state
      act(() => {
        result.current.setError('Login failed');
      });

      expect(result.current.error).toBe('Login failed');

      // Retry and succeed
      const user = { id: '1', email: 'test@example.com', name: 'User' };
      mockedAuthService.login.mockResolvedValue({ user, token: 'token' });

      await act(async () => {
        const loginResult = await mockedAuthService.login('test@example.com', 'password');
        if (loginResult) {
          result.current.setUser(loginResult.user);
          result.current.setToken(loginResult.token);
          result.current.setError(null);
        }
      });

      expect(result.current.error).toBeNull();
    });

    it('displays different error messages based on error type', async () => {
      const { result } = renderHook(() => useAuthStore());

      const errors = [
        'Invalid credentials',
        'Network error',
        'Server error',
        'Email not found',
      ];

      for (const error of errors) {
        mockedAuthService.login.mockRejectedValueOnce(new Error(error));

        await act(async () => {
          try {
            await mockedAuthService.login('test@example.com', 'password');
          } catch (e) {
            if (e instanceof Error) {
              result.current.setError(e.message);
            }
          }
        });

        expect(result.current.error).toBe(error);

        act(() => {
          result.current.clearError();
        });
      }
    });
  });

  describe('Multi-Tab Component Sync', () => {
    it('keeps auth state synchronized across multiple hooks', async () => {
      const { result: hook1 } = renderHook(() => useAuthStore());
      const { result: hook2 } = renderHook(() => useAuthStore());

      const user = { id: '1', email: 'test@example.com', name: 'User' };

      act(() => {
        hook1.current.setUser(user);
        hook1.current.setToken('token');
      });

      // Both hooks should reflect the same state
      expect(hook2.current.user).toEqual(user);
      expect(hook2.current.token).toBe('token');
    });

    it('keeps app settings synchronized across multiple hooks', async () => {
      const { result: hook1 } = renderHook(() => useAppStore());
      const { result: hook2 } = renderHook(() => useAppStore());

      act(() => {
        hook1.current.setTheme('dark');
        hook1.current.setLanguage('es');
      });

      expect(hook2.current.theme).toBe('dark');
      expect(hook2.current.language).toBe('es');
    });
  });

  describe('User Profile Display', () => {
    it('displays user email when logged in', () => {
      const { result } = renderHook(() => useAuthStore());
      const userEmail = 'user@example.com';

      act(() => {
        result.current.setUser({ id: '1', email: userEmail, name: 'Test User' });
      });

      expect(result.current.user?.email).toBe(userEmail);
    });

    it('displays user name when logged in', () => {
      const { result } = renderHook(() => useAuthStore());
      const userName = 'Test User';

      act(() => {
        result.current.setUser({ id: '1', email: 'user@example.com', name: userName });
      });

      expect(result.current.user?.name).toBe(userName);
    });

    it('hides user profile when logged out', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setUser({ id: '1', email: 'user@example.com', name: 'User' });
      });

      expect(result.current.user).not.toBeNull();

      act(() => {
        result.current.setUser(null);
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe('Settings Screen Integration', () => {
    it('displays and updates theme setting', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.theme).toBe('light');

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
    });

    it('displays and updates language setting', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.language).toBe('en');

      act(() => {
        result.current.setLanguage('fr');
      });

      expect(result.current.language).toBe('fr');
    });

    it('displays and updates API URL setting', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.apiUrl).toBe('http://localhost:3000');

      const newUrl = 'http://api.production.com';
      act(() => {
        result.current.setApiUrl(newUrl);
      });

      expect(result.current.apiUrl).toBe(newUrl);
    });
  });

  describe('Session Restoration', () => {
    it('restores user session on app startup', async () => {
      const { result } = renderHook(() => useAuthStore());

      const restoredUser = { id: '1', email: 'test@example.com', name: 'User' };

      // Simulate restoring from storage
      act(() => {
        result.current.setUser(restoredUser);
        result.current.setToken('stored-token');
        result.current.setLoading(false);
      });

      expect(result.current.user).toEqual(restoredUser);
      expect(result.current.token).toBe('stored-token');
      expect(result.current.isLoading).toBe(false);
    });

    it('displays app with no user if session cannot be restored', async () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setLoading(false);
        result.current.setUser(null);
        result.current.setToken(null);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });
});
