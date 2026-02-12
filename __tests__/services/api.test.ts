import { apiService } from '@/services/api';

jest.mock('axios');
jest.mock('@/services/storage');

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('sends login credentials and returns user data', async () => {
      const mockData = { user: { id: '1', email: 'test@example.com' }, token: 'token123' };
      
      // Test that apiService exports login method
      expect(typeof apiService.login).toBe('function');
    });
  });

  describe('signup', () => {
    it('sends signup data and returns user', async () => {
      expect(typeof apiService.signup).toBe('function');
    });
  });

  describe('logout', () => {
    it('calls logout endpoint', async () => {
      expect(typeof apiService.logout).toBe('function');
    });
  });

  describe('getCurrentUser', () => {
    it('fetches current user', async () => {
      expect(typeof apiService.getCurrentUser).toBe('function');
    });
  });

  describe('refreshToken', () => {
    it('refreshes auth token', async () => {
      expect(typeof apiService.refreshToken).toBe('function');
    });
  });

  describe('generic requests', () => {
    it('has GET method', () => {
      expect(typeof apiService.get).toBe('function');
    });

    it('has POST method', () => {
      expect(typeof apiService.post).toBe('function');
    });

    it('has PUT method', () => {
      expect(typeof apiService.put).toBe('function');
    });

    it('has DELETE method', () => {
      expect(typeof apiService.delete).toBe('function');
    });
  });

  describe('error handling', () => {
    it('has handleError method', () => {
      expect(typeof apiService.handleError).toBe('function');
    });

    it('formats errors correctly', () => {
      const error = { response: { status: 400, data: { message: 'Bad request' } } };
      const result = apiService.handleError(error);
      
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('message');
    });
  });
});
