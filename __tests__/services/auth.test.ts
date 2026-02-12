import { apiService } from '@/services/api';
import { authService } from '@/services/auth';
import { storageService } from '@/services/storage';

// Mock dependencies
jest.mock('@/services/api');
jest.mock('@/services/storage');

const mockedApi = apiService as jest.Mocked<typeof apiService>;
const mockedStorage = storageService as jest.Mocked<typeof storageService>;

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset all mocks to return default values
    mockedApi.login.mockReset();
    mockedApi.signup.mockReset();
    mockedApi.logout.mockReset();
    mockedApi.getCurrentUser.mockReset();
    mockedStorage.setAuthToken.mockReset();
    mockedStorage.setUserData.mockReset();
    mockedStorage.setUserEmail.mockReset();
    mockedStorage.getAuthToken.mockReset();
    mockedStorage.getUserData.mockReset();
    mockedStorage.clearAuth.mockReset();
  });

  describe('login', () => {
    it('logs in user and saves token', async () => {
      const mockResponse = {
        user: { id: '1', email: 'user@example.com', name: 'User' },
        token: 'authtoken123',
      };
      mockedApi.login.mockResolvedValue(mockResponse);
      mockedStorage.setAuthToken.mockResolvedValue(undefined);
      mockedStorage.setUserData.mockResolvedValue(undefined);
      mockedStorage.setUserEmail.mockResolvedValue(undefined);

      const result = await authService.login('user@example.com', 'password123');

      expect(mockedApi.login).toHaveBeenCalledWith('user@example.com', 'password123');
      expect(mockedStorage.setAuthToken).toHaveBeenCalledWith('authtoken123');
      expect(mockedStorage.setUserData).toHaveBeenCalledWith(mockResponse.user);
      expect(result).toEqual(mockResponse);
    });

    it('throws on login failure', async () => {
      const error = new Error('Invalid credentials');
      mockedApi.login.mockRejectedValue(error);

      await expect(authService.login('user@example.com', 'wrongpass')).rejects.toThrow('Invalid credentials');
      expect(mockedStorage.setAuthToken).not.toHaveBeenCalled();
    });
  });

  describe('signup', () => {
    it('signs up user and saves credentials', async () => {
      const mockResponse = {
        user: { id: '2', email: 'newuser@example.com', name: 'New User' },
        token: 'newtoken456',
      };
      mockedApi.signup.mockResolvedValue(mockResponse);
      mockedStorage.setAuthToken.mockResolvedValue(undefined);
      mockedStorage.setUserData.mockResolvedValue(undefined);
      mockedStorage.setUserEmail.mockResolvedValue(undefined);

      const result = await authService.signup('newuser@example.com', 'password123', 'New User');

      expect(mockedApi.signup).toHaveBeenCalledWith('newuser@example.com', 'password123', 'New User');
      expect(mockedStorage.setAuthToken).toHaveBeenCalledWith('newtoken456');
      expect(mockedStorage.setUserData).toHaveBeenCalledWith(mockResponse.user);
      expect(result).toEqual(mockResponse);
    });

    it('throws on signup failure', async () => {
      const error = new Error('Email already exists');
      mockedApi.signup.mockRejectedValue(error);

      await expect(authService.signup('existing@example.com', 'pass', 'Name')).rejects.toThrow('Email already exists');
    });
  });

  describe('logout', () => {
    it('calls API logout and clears storage', async () => {
      mockedApi.logout.mockResolvedValue(undefined);
      mockedStorage.clearAuth.mockResolvedValue(undefined);

      await authService.logout();

      expect(mockedApi.logout).toHaveBeenCalled();
      expect(mockedStorage.clearAuth).toHaveBeenCalled();
    });

    it('clears local data even if API call fails', async () => {
      mockedApi.logout.mockRejectedValue(new Error('Network error'));
      mockedStorage.clearAuth.mockResolvedValue(undefined);

      await authService.logout();

      expect(mockedStorage.clearAuth).toHaveBeenCalled();
    });
  });

  describe('isAuthenticated', () => {
    it('returns true when token exists', async () => {
      mockedStorage.getAuthToken.mockResolvedValue('token123');

      const result = await authService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('returns false when no token', async () => {
      mockedStorage.getAuthToken.mockResolvedValue(null);

      const result = await authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('getStoredUser', () => {
    it('returns stored user data', async () => {
      const mockUser = { id: '1', email: 'user@example.com', name: 'User' };
      mockedStorage.getUserData.mockResolvedValue(mockUser);

      const result = await authService.getStoredUser();

      expect(mockedStorage.getUserData).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('returns null when no user stored', async () => {
      mockedStorage.getUserData.mockResolvedValue(null);

      const result = await authService.getStoredUser();

      expect(result).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('calls API getCurrentUser method', async () => {
      const mockUser = { id: '1', email: 'user@example.com', name: 'User' };
      mockedApi.getCurrentUser.mockResolvedValue(mockUser);

      await authService.getCurrentUser();

      expect(mockedApi.getCurrentUser).toHaveBeenCalled();
    });

    it('returns null on API error', async () => {
      mockedApi.getCurrentUser.mockRejectedValue(new Error('Unauthorized'));

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });
});
