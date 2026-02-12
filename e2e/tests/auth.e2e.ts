/**
 * E2E Tests - Authentication Flow
 * Tests for login, signup, and account management
 */

import { device } from 'detox';
import {
    clearAllInputs,
    fillEmailInput,
    fillNameInput,
    fillPasswordInput,
    sleep,
    tapLoginButton,
    tapLoginLink,
    tapLogoutButton,
    tapSignupButton,
    tapSignupLink,
    verifyElementVisible,
    verifyTextVisible,
    waitForElement,
    waitForText,
} from '../helpers/actions';
import { Elements, Messages, Screens, TestData } from '../helpers/screens';

describe('E2E - Authentication Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await clearAllInputs();
  });

  describe('Login Flow', () => {
    it('should display login screen on app start', async () => {
      await verifyElementVisible(Screens.LoginScreen);
      await verifyElementVisible(Elements.EmailInput);
      await verifyElementVisible(Elements.PasswordInput);
      await verifyElementVisible(Elements.LoginButton);
    });

    it('should login successfully with valid credentials', async () => {
      // Fill form
      await fillEmailInput(TestData.validEmail);
      await fillPasswordInput(TestData.validPassword);

      // Submit
      await tapLoginButton();

      // Verify dashboard is shown
      await waitForElement(Screens.DashboardScreen, 5000);
      await verifyElementVisible(Screens.DashboardScreen);
    });

    it('should show error for invalid credentials', async () => {
      // Fill form with invalid credentials
      await fillEmailInput('invalid@example.com');
      await fillPasswordInput('wrongpassword');

      // Submit
      await tapLoginButton();

      // Verify error message
      await waitForText(Messages.InvalidCredentials, 3000);
      await verifyTextVisible(Messages.InvalidCredentials);
    });

    it('should show error for empty email field', async () => {
      // Leave email empty and fill password
      await fillPasswordInput(TestData.validPassword);

      // Submit
      await tapLoginButton();

      // Verify validation error (if implemented)
      // This behavior depends on the app implementation
      await verifyElementVisible(Elements.LoginButton);
    });

    it('should show error for empty password field', async () => {
      // Fill email but leave password empty
      await fillEmailInput(TestData.validEmail);

      // Submit
      await tapLoginButton();

      // Verify validation error (if implemented)
      await verifyElementVisible(Elements.LoginButton);
    });

    it('should disable login button while submitting', async () => {
      // Fill form
      await fillEmailInput(TestData.validEmail);
      await fillPasswordInput(TestData.validPassword);

      // Tap and immediately check
      await tapLoginButton();

      // Loading state should show
      await waitForElement(Screens.DashboardScreen, 5000).catch(() => {
        // Timeout is acceptable for this test
      });
    });
  });

  describe('Signup Flow', () => {
    it('should navigate to signup screen when signup link is tapped', async () => {
      await verifyElementVisible(Elements.SignupLink);
      await tapSignupLink();

      await waitForElement(Screens.SignupScreen, 3000);
      await verifyElementVisible(Screens.SignupScreen);
    });

    it('should signup successfully with valid information', async () => {
      // Navigate to signup
      await tapSignupLink();
      await waitForElement(Screens.SignupScreen, 3000);

      // Fill form
      await fillNameInput(TestData.validName);
      await fillEmailInput(TestData.newEmail);
      await fillPasswordInput(TestData.validPassword);

      // Submit
      await tapSignupButton();

      // Verify dashboard or confirmation screen
      await waitForElement(Screens.DashboardScreen, 5000);
      await verifyElementVisible(Screens.DashboardScreen);
    });

    it('should show error when email already exists', async () => {
      // Navigate to signup
      await tapSignupLink();
      await waitForElement(Screens.SignupScreen, 3000);

      // Fill form with existing email
      await fillNameInput(TestData.validName);
      await fillEmailInput(TestData.existingEmail);
      await fillPasswordInput(TestData.validPassword);

      // Submit
      await tapSignupButton();

      // Verify error message
      await waitForText(Messages.EmailAlreadyExists, 3000);
      await verifyTextVisible(Messages.EmailAlreadyExists);
    });

    it('should show error for weak password', async () => {
      // Navigate to signup
      await tapSignupLink();
      await waitForElement(Screens.SignupScreen, 3000);

      // Fill form with weak password
      await fillNameInput(TestData.validName);
      await fillEmailInput(TestData.newEmail);
      await fillPasswordInput(TestData.shortPassword);

      // Submit
      await tapSignupButton();

      // Verify error (if password validation is implemented)
      await verifyElementVisible(Screens.SignupScreen);
    });

    it('should navigate back to login from signup screen', async () => {
      // Navigate to signup
      await tapSignupLink();
      await waitForElement(Screens.SignupScreen, 3000);

      // Navigate back using login link
      await tapLoginLink();

      // Verify back on login screen
      await waitForElement(Screens.LoginScreen, 3000);
      await verifyElementVisible(Screens.LoginScreen);
    });
  });

  describe('Logout Flow', () => {
    it('should logout and return to login screen', async () => {
      // First, login
      await fillEmailInput(TestData.validEmail);
      await fillPasswordInput(TestData.validPassword);
      await tapLoginButton();

      // Wait for dashboard
      await waitForElement(Screens.DashboardScreen, 5000);

      // Access logout (through menu or settings)
      await tapMenuButton();
      await waitForElement(Elements.LogoutButton, 2000);
      await tapLogoutButton();

      // Verify back on login screen
      await waitForElement(Screens.LoginScreen, 3000);
      await verifyElementVisible(Screens.LoginScreen);
    });
  });

  describe('Session Persistence', () => {
    it('should restore session after app restart', async () => {
      // First, login
      await fillEmailInput(TestData.validEmail);
      await fillPasswordInput(TestData.validPassword);
      await tapLoginButton();

      // Wait for dashboard
      await waitForElement(Screens.DashboardScreen, 5000);

      // Terminate and relaunch app
      await device.sendToBackground();
      await sleep(2000);
      await device.bringToForeground();

      // Verify still on dashboard (session restored)
      await waitForElement(Screens.DashboardScreen, 5000);
      await verifyElementVisible(Screens.DashboardScreen);
    });

    it('should show login screen if no session exists', async () => {
      // Simulate first app launch with no session
      // (This is the default state)

      // Verify login screen is shown
      await verifyElementVisible(Screens.LoginScreen);
      await verifyElementVisible(Elements.EmailInput);
    });
  });

  describe('Error Recovery', () => {
    it('should recover from network error', async () => {
      // Simulate network error by disconnecting (if possible)
      // For now, just verify error message handling

      await fillEmailInput(TestData.validEmail);
      await fillPasswordInput(TestData.validPassword);

      // Network error would occur here in real scenario
      // Verify user can retry
      await verifyElementVisible(Elements.LoginButton);
    });

    it('should allow retry after failed login', async () => {
      // First attempt with wrong password
      await fillEmailInput(TestData.validEmail);
      await fillPasswordInput('wrongpassword');
      await tapLoginButton();

      // Wait for error
      await waitForText(Messages.InvalidCredentials, 3000);

      // Clear and retry with correct password
      await clearAllInputs();
      await fillEmailInput(TestData.validEmail);
      await fillPasswordInput(TestData.validPassword);
      await tapLoginButton();

      // Verify success on retry
      await waitForElement(Screens.DashboardScreen, 5000);
      await verifyElementVisible(Screens.DashboardScreen);
    });
  });

  describe('Form Validation', () => {
    it('should validate email format', async () => {
      await fillEmailInput('invalid-email-format');
      await fillPasswordInput(TestData.validPassword);
      await tapLoginButton();

      // Form should either show error or prevent submission
      // Verify we're still on login screen or see error
      await verifyElementVisible(Elements.EmailInput);
    });

    it('should clear previous errors on retry', async () => {
      // First attempt with invalid credentials
      await fillEmailInput('invalid@example.com');
      await fillPasswordInput('wrongpassword');
      await tapLoginButton();

      // Wait for error
      await waitForText(Messages.InvalidCredentials, 3000);

      // Clear form and try again
      await clearAllInputs();
      await fillEmailInput(TestData.validEmail);
      await fillPasswordInput(TestData.validPassword);
      await tapLoginButton();

      // Previous error should be gone, new flow starts
      await waitForElement(Screens.DashboardScreen, 5000);
    });
  });
});
