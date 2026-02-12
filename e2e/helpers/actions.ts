/**
 * E2E Test Helpers - Common Actions
 * Reusable actions for E2E tests
 */

import { by, expect as detoxExpect, element, waitFor } from 'detox';

/**
 * Authentication Actions
 */
export async function fillEmailInput(email: string): Promise<void> {
  await element(by.id('email-input')).clearText();
  await element(by.id('email-input')).typeText(email);
}

export async function fillPasswordInput(password: string): Promise<void> {
  await element(by.id('password-input')).clearText();
  await element(by.id('password-input')).typeText(password);
}

export async function fillNameInput(name: string): Promise<void> {
  await element(by.id('name-input')).clearText();
  await element(by.id('name-input')).typeText(name);
}

export async function tapLoginButton(): Promise<void> {
  await element(by.id('login-button')).tap();
}

export async function tapSignupButton(): Promise<void> {
  await element(by.id('signup-button')).tap();
}

export async function tapLogoutButton(): Promise<void> {
  await element(by.id('logout-button')).tap();
}

export async function tapSignupLink(): Promise<void> {
  await element(by.id('signup-link')).tap();
}

export async function tapLoginLink(): Promise<void> {
  await element(by.id('login-link')).tap();
}

/**
 * Navigation Actions
 */
export async function tapTabBarItem(testID: string): Promise<void> {
  await element(by.id(testID)).tap();
}

export async function tapBackButton(): Promise<void> {
  await element(by.id('back-button')).tap();
}

export async function tapMenuButton(): Promise<void> {
  await element(by.id('menu-button')).tap();
}

/**
 * Wait Actions
 */
export async function waitForElement(
  testID: string,
  timeout: number = 5000
): Promise<void> {
  await waitFor(element(by.id(testID)))
    .toBeVisible()
    .withTimeout(timeout);
}

export async function waitForText(
  text: string,
  timeout: number = 5000
): Promise<void> {
  await waitFor(element(by.text(text)))
    .toBeVisible()
    .withTimeout(timeout);
}

export async function waitForElementToDisappear(
  testID: string,
  timeout: number = 5000
): Promise<void> {
  await waitFor(element(by.id(testID)))
    .not.toBeVisible()
    .withTimeout(timeout);
}

/**
 * Assertion Actions
 */
export async function verifyElementVisible(testID: string): Promise<void> {
  await detoxExpect(element(by.id(testID))).toBeVisible();
}

export async function verifyTextVisible(text: string): Promise<void> {
  await detoxExpect(element(by.text(text))).toBeVisible();
}

export async function verifyElementNotVisible(testID: string): Promise<void> {
  await detoxExpect(element(by.id(testID))).not.toBeVisible();
}

/**
 * Scroll Actions
 */
export async function scrollToElement(
  scrollViewID: string,
  elementID: string
): Promise<void> {
  await waitFor(element(by.id(elementID)))
    .toBeVisible()
    .whileElement(by.id(scrollViewID))
    .scroll(200, 'down');
}

/**
 * Input Clearing
 */
export async function clearAllInputs(): Promise<void> {
  const inputs = ['email-input', 'password-input', 'name-input'];
  for (const input of inputs) {
    try {
      await element(by.id(input)).clearText();
    } catch (e) {
      // Input may not exist, that's fine
    }
  }
}

/**
 * Device Actions
 */
export async function reloadApp(): Promise<void> {
  await device.sendUserInteraction({ type: 'shake' });
  await waitFor(element(by.text('Reload')))
    .toBeVisible()
    .withTimeout(2000)
    .catch(() => {
      // Ignore if reload option doesn't appear
    });
}

export async function dismissKeyboard(): Promise<void> {
  try {
    await element(by.text('Done')).tap();
  } catch (e) {
    // Keyboard may not be visible
  }
}

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
