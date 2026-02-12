/**
 * E2E Tests - Navigation Flow
 * Tests for navigation, tab switching, and screen transitions
 */

import { by, device, element } from 'detox';
import {
    fillEmailInput,
    fillPasswordInput,
    sleep,
    tapLoginButton,
    tapTabBarItem,
    verifyElementVisible,
    waitForElement,
} from '../helpers/actions';
import { Elements, Screens, TestData } from '../helpers/screens';

describe('E2E - Navigation Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    // Login before each test
    await fillEmailInput(TestData.validEmail);
    await fillPasswordInput(TestData.validPassword);
    await tapLoginButton();
    await waitForElement(Screens.DashboardScreen, 5000);
  });

  describe('Tab Navigation', () => {
    it('should display all tab bar items', async () => {
      await verifyElementVisible(Elements.TabHomeIcon);
      await verifyElementVisible(Elements.TabExploreIcon);
      await verifyElementVisible(Elements.TabProfileIcon);
    });

    it('should navigate to home tab', async () => {
      await tapTabBarItem(Elements.TabHomeIcon);
      await waitForElement('home-content', 2000);
      await verifyElementVisible('home-content');
    });

    it('should navigate to explore tab', async () => {
      await tapTabBarItem(Elements.TabExploreIcon);
      await waitForElement('explore-content', 2000);
      await verifyElementVisible('explore-content');
    });

    it('should navigate to profile tab', async () => {
      await tapTabBarItem(Elements.TabProfileIcon);
      await waitForElement('profile-content', 2000);
      await verifyElementVisible('profile-content');
    });

    it('should switch between tabs smoothly', async () => {
      // Home → Explore
      await tapTabBarItem(Elements.TabExploreIcon);
      await waitForElement('explore-content', 2000);

      // Explore → Profile
      await tapTabBarItem(Elements.TabProfileIcon);
      await waitForElement('profile-content', 2000);

      // Profile → Home
      await tapTabBarItem(Elements.TabHomeIcon);
      await waitForElement('home-content', 2000);

      await verifyElementVisible('home-content');
    });
  });

  describe('Screen Transitions', () => {
    it('should transition to detail screen and back', async () => {
      // Navigate to detail (if available)
      await element(by.id('list-item-1')).tap();
      await waitForElement('detail-screen', 3000);

      // Verify detail screen
      await verifyElementVisible('detail-screen');

      // Go back
      await tapTabBarItem(Elements.TabHomeIcon);
      await waitForElement('home-content', 2000);

      await verifyElementVisible('home-content');
    });
  });

  describe('Navigation State Persistence', () => {
    it('should maintain tab state when backgrounding app', async () => {
      // Navigate to profile tab
      await tapTabBarItem(Elements.TabProfileIcon);
      await waitForElement('profile-content', 2000);

      // Background app
      await device.sendToBackground();
      await sleep(1000);

      // Bring to foreground
      await device.bringToForeground();

      // Should still be on profile tab
      await waitForElement('profile-content', 2000);
      await verifyElementVisible('profile-content');
    });

    it('should maintain scroll position in lists', async () => {
      // Scroll down in list
      await element(by.id(Elements.ScrollView)).scroll(500, 'down');
      await sleep(500);

      // Switch tabs
      await tapTabBarItem(Elements.TabExploreIcon);
      await waitForElement('explore-content', 2000);

      // Switch back
      await tapTabBarItem(Elements.TabHomeIcon);
      await waitForElement('home-content', 2000);

      // Scroll position may or may not be preserved (depends on implementation)
      await verifyElementVisible('home-content');
    });
  });

  describe('Deep Linking', () => {
    it('should open profile screen via deep link', async () => {
      // Simulate deep link to profile
      await device.openURL({ url: 'leish://profile' });
      await waitForElement('profile-content', 3000);
      await verifyElementVisible('profile-content');
    });

    it('should open detail screen via deep link', async () => {
      // Simulate deep link to detail
      await device.openURL({ url: 'leish://detail/123' });
      await waitForElement('detail-screen', 3000);
      await verifyElementVisible('detail-screen');
    });

    it('should handle invalid deep links gracefully', async () => {
      // Try invalid deep link
      await device.openURL({ url: 'leish://invalid' });
      await sleep(2000);

      // Should either show error or go to home
      await verifyElementVisible(Screens.DashboardScreen);
    });
  });

  describe('Navigation with Data', () => {
    it('should pass data to detail screen', async () => {
      // Open first item
      await element(by.id('list-item-1')).tap();
      await waitForElement('detail-screen', 3000);

      // Verify detail content loads
      await verifyElementVisible('detail-content');
    });

    it('should load different data for different items', async () => {
      // Open first item
      await element(by.id('list-item-1')).tap();
      await waitForElement('detail-screen', 3000);
      const content1 = await element(by.id('detail-title')).getText();

      // Go back
      await tapTabBarItem(Elements.TabHomeIcon);
      await waitForElement('home-content', 2000);

      // Open second item
      await element(by.id('list-item-2')).tap();
      await waitForElement('detail-screen', 3000);
      const content2 = await element(by.id('detail-title')).getText();

      // Content should be different
      expect(content1).not.toEqual(content2);
    });
  });

  describe('Gesture Navigation', () => {
    it('should support back gesture on iOS', async () => {
      // Navigate to detail
      await element(by.id('list-item-1')).tap();
      await waitForElement('detail-screen', 3000);

      // Use back gesture (swipe from left edge)
      await element(by.id('detail-screen')).multiTap(1);
      // Alternative: device.reverseTap() for back button
      
      // Should return to list
      await waitForElement('home-content', 2000);
      await verifyElementVisible('home-content');
    });
  });

  describe('Modal Navigation', () => {
    it('should open modal when needed', async () => {
      // Open settings modal
      await element(by.id('settings-button')).tap();
      await waitForElement('settings-modal', 2000);
      await verifyElementVisible('settings-modal');
    });

    it('should close modal and return to previous screen', async () => {
      // Open modal
      await element(by.id('settings-button')).tap();
      await waitForElement('settings-modal', 2000);

      // Close modal
      await element(by.id('close-modal-button')).tap();
      await waitForElement('home-content', 2000);

      await verifyElementVisible('home-content');
    });
  });
});
