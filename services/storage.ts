import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  AUTH_TOKEN: '@leish:auth_token',
  USER_EMAIL: '@leish:user_email',
  USER_DATA: '@leish:user_data',
  PREFERENCES: '@leish:preferences',
};

export const storageService = {
  // Auth
  async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Failed to set auth token:', error);
      throw error;
    }
  },

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  },

  async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Failed to remove auth token:', error);
      throw error;
    }
  },

  // User Email
  async setUserEmail(email: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_EMAIL, email);
    } catch (error) {
      console.error('Failed to set user email:', error);
      throw error;
    }
  },

  async getUserEmail(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.USER_EMAIL);
    } catch (error) {
      console.error('Failed to get user email:', error);
      return null;
    }
  },

  // User Data
  async setUserData(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to set user data:', error);
      throw error;
    }
  },

  async getUserData(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  },

  // Preferences
  async setPreference(key: string, value: any): Promise<void> {
    try {
      const prefs = (await AsyncStorage.getItem(KEYS.PREFERENCES)) || '{}';
      const prefObj = JSON.parse(prefs);
      prefObj[key] = value;
      await AsyncStorage.setItem(KEYS.PREFERENCES, JSON.stringify(prefObj));
    } catch (error) {
      console.error('Failed to set preference:', error);
      throw error;
    }
  },

  async getPreference(key: string): Promise<any | null> {
    try {
      const prefs = (await AsyncStorage.getItem(KEYS.PREFERENCES)) || '{}';
      const prefObj = JSON.parse(prefs);
      return prefObj[key] ?? null;
    } catch (error) {
      console.error('Failed to get preference:', error);
      return null;
    }
  },

  // Clear all
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(KEYS));
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  },

  // Clear auth
  async clearAuth(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([KEYS.AUTH_TOKEN, KEYS.USER_EMAIL, KEYS.USER_DATA]);
    } catch (error) {
      console.error('Failed to clear auth:', error);
      throw error;
    }
  },
};
