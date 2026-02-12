/**
 * E2E Test Screens
 * Screen identifiers and element locators
 */

export const Screens = {
  // Auth Screens
  LoginScreen: 'login-screen',
  SignupScreen: 'signup-screen',
  
  // Main Screens
  DashboardScreen: 'dashboard-screen',
  ExploreScreen: 'explore-screen',
  ProfileScreen: 'profile-screen',
  SettingsScreen: 'settings-screen',
  
  // Components
  LoadingSpinner: 'loading-spinner',
  ErrorMessage: 'error-message',
};

export const Elements = {
  // Auth Elements
  EmailInput: 'email-input',
  PasswordInput: 'password-input',
  NameInput: 'name-input',
  LoginButton: 'login-button',
  SignupButton: 'signup-button',
  LoginLink: 'login-link',
  SignupLink: 'signup-link',
  LogoutButton: 'logout-button',
  
  // Navigation
  BackButton: 'back-button',
  MenuButton: 'menu-button',
  TabHomeIcon: 'tab-icon-home',
  TabExploreIcon: 'tab-icon-explore',
  TabProfileIcon: 'tab-icon-profile',
  
  // Common
  ScrollView: 'scroll-view',
  SettingItem: 'setting-item',
  ListItem: 'list-item',
};

export const Messages = {
  // Error Messages
  InvalidCredentials: 'Invalid credentials',
  EmailAlreadyExists: 'Email already exists',
  InvalidEmail: 'Invalid email address',
  PasswordTooShort: 'Password must be at least 8 characters',
  NetworkError: 'Network error. Please try again.',
  ServerError: 'Server error. Please try again later.',
  
  // Success Messages
  LoginSuccess: 'Login successful',
  SignupSuccess: 'Account created successfully',
  LogoutSuccess: 'Logged out',
  
  // Loading Messages
  Logging: 'Logging in...',
  Signing: 'Creating account...',
};

export const TestData = {
  validEmail: 'test@example.com',
  validPassword: 'Password123!',
  validName: 'Test User',
  invalidEmail: 'invalid-email',
  shortPassword: '12345',
  existingEmail: 'existing@example.com',
  newEmail: 'newuser@example.com',
};
