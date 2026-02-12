# Phase 5: E2E Testing Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ (for Detox compatibility)
- Xcode 14+ (for iOS testing)
- iOS Simulator (bundled with Xcode)
- Java & Android SDK (for Android testing, optional)

### Installation Steps

#### 1. Install Detox Dependencies
```bash
npm install --save-dev detox detox-cli
```

#### 2. Install Detox CLI Globally (Optional)
```bash
npm install -g detox-cli
```

#### 3. Build Detox Framework
```bash
# For iOS
npm run e2e:build:ios

# For Android (if configured)
npm run e2e:build:android
```

#### 4. Run First E2E Test
```bash
# Run all E2E tests on iOS simulator
npm run e2e:test:ios

# Or with watch mode
npm run e2e:test:ios -- --watch
```

## Configuration Overview

### Detox Config Structure
```
Project Root
├── detox.config.js           ← Main Detox configuration
├── e2e/
│   ├── config/
│   │   └── jest.config.js    ← Jest config for E2E tests
│   ├── helpers/
│   │   ├── actions.ts        ← Common test actions
│   │   ├── screens.ts        ← Screen identifiers
│   │   └── matchers.ts       ← Custom matchers (if needed)
│   └── tests/
│       ├── auth.e2e.ts       ← Authentication tests
│       ├── navigation.e2e.ts ← Navigation tests
│       ├── dashboard.e2e.ts  ← Dashboard tests
│       └── performance.e2e.ts ← Performance tests
```

## Understanding detox.config.js

### Configurations Section
Defines test environments (combinations of device + app)

```javascript
configurations: {
  'ios.sim.debug': {        // Configuration name
    device: { ... },        // Device settings
    app: 'ios.debug'        // Which app to use
  }
}
```

### Apps Section
Defines how to build the app for testing

```javascript
apps: {
  'ios.debug': {
    type: 'ios.app',
    binaryPath: '...',      // Path to built app
    build: '...'            // Build command
  }
}
```

## Test Structure

### Test File Organization
```typescript
describe('Feature Name', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Sub-feature', () => {
    it('should do something', async () => {
      // Test code
    });
  });
});
```

### Common Test Patterns

#### 1. User Input & Submission
```typescript
await fillEmailInput('test@example.com');
await fillPasswordInput('password123');
await tapLoginButton();
```

#### 2. Wait for Element
```typescript
await waitForElement('dashboard-screen', 5000);
await verifyElementVisible('dashboard-screen');
```

#### 3. Assertions
```typescript
await detoxExpect(element(by.id('element-id'))).toBeVisible();
```

#### 4. Navigation
```typescript
await tapTabBarItem('tab-home');
await waitForElement('home-content', 2000);
```

## Available Test Helpers

### Input Actions
- `fillEmailInput(email)` - Fill email field
- `fillPasswordInput(password)` - Fill password field
- `fillNameInput(name)` - Fill name field

### Button Actions
- `tapLoginButton()` - Tap login button
- `tapSignupButton()` - Tap signup button
- `tapLogoutButton()` - Tap logout button
- `tapTabBarItem(id)` - Tap tab bar item

### Wait Actions
- `waitForElement(id, timeout)` - Wait for element visibility
- `waitForText(text, timeout)` - Wait for text visibility
- `waitForElementToDisappear(id, timeout)` - Wait for disappearance

### Assertions
- `verifyElementVisible(id)` - Verify element is visible
- `verifyTextVisible(text)` - Verify text is visible
- `verifyElementNotVisible(id)` - Verify hidden

### Device Actions
- `sleep(ms)` - Wait without checking
- `dismissKeyboard()` - Close keyboard
- `clearAllInputs()` - Clear all input fields

## Running E2E Tests

### Commands

#### Run All Tests
```bash
npm run e2e:test:ios
```

#### Run Specific Test File
```bash
detox test e2e/tests/auth.e2e.ts --configuration ios.sim.debug
```

#### Run Single Test Suite
```bash
detox test e2e/tests/auth.e2e.ts --configuration ios.sim.debug -t "Login Flow"
```

#### Watch Mode (Auto-rerun on file change)
```bash
detox test e2e/tests/auth.e2e.ts --configuration ios.sim.debug --watch
```

#### Cleanup After Tests
```bash
detox test e2e/tests --configuration ios.sim.debug --cleanup
```

#### Record Video on Failure
```bash
detox test e2e/tests --configuration ios.sim.debug --record-logs all
```

## Screen Identifiers

All test IDs must be added to your app components:

```typescript
// Login Screen
<TextInput testID="email-input" />
<TextInput testID="password-input" />
<Button testID="login-button" />

// Dashboard Screen
<View testID="dashboard-screen">
  {/* content */}
</View>
```

### Required Test IDs for Auth Tests
```
// Authentication
email-input
password-input
name-input
login-button
signup-button
logout-button
login-link
signup-link

// Screens
login-screen
signup-screen
dashboard-screen

// Navigation
tab-icon-home
tab-icon-explore
tab-icon-profile
```

## Troubleshooting

### Common Issues

#### Build Fails
```bash
# Clean and rebuild
rm -rf ios/build
npm run e2e:build:ios
```

#### Tests Timeout
- Increase timeout in test (last parameter of `waitFor`)
- Verify test IDs exist in app
- Check app is running correctly

#### Simulator Issues
```bash
# List available simulators
xcrun simctl list

# Erase simulator
xcrun simctl erase all

# Boot specific simulator
xcrun simctl boot "iPhone 15"
```

#### App Not Launching
- Verify app compiles: `cd ios && xcodebuild -workspace leish.xcworkspace -scheme leish`
- Check binary path in `detox.config.js`
- Restart simulator

## Adding Test IDs to App

### For Input Components
```typescript
<TextInput
  testID={`${screenName}-${fieldName}`}
  {...props}
/>
```

### For Buttons
```typescript
<TouchableOpacity
  testID={'login-button'}
  onPress={handleLogin}
>
  <Text>Login</Text>
</TouchableOpacity>
```

### For Screens
```typescript
<View testID="login-screen">
  {/* Screen content */}
</View>
```

## Performance Optimization

### Best Practices
1. **Reuse helpers** - Use the provided action helpers
2. **Minimal waits** - Use specific wait times, not default timeouts
3. **Atomic tests** - Each test should be independent
4. **Fail fast** - Don't continue if initial step fails

### Test Execution Time
- Single test: 30-120 seconds
- Full suite: 5-10 minutes (depends on device)
- Can run parallel with `--workers` flag (experimental)

## CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  e2e:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm run e2e:build:ios
      - run: npm run e2e:test:ios
```

## Next Steps

1. **Add test IDs** to all app components
2. **Run first test**: `npm run e2e:test:ios`
3. **Debug failures** using video/logs
4. **Expand tests** with more scenarios
5. **Integrate CI/CD** with GitHub Actions

## Resources

- [Detox Documentation](https://wix.github.io/Detox/)
- [Detox API Reference](https://wix.github.io/Detox/docs/master/api/overview)
- [Best Practices](https://wix.github.io/Detox/docs/master/guide/best-practices)
- [Troubleshooting](https://wix.github.io/Detox/docs/master/guide/troubleshooting)

---

## Current Status

- ✅ Detox configured
- ✅ Helper functions created
- ✅ Auth tests template ready
- ✅ Navigation tests template ready
- ⏳ Needs: Application test IDs
- ⏳ Needs: Build configuration for actual app
- ⏳ Needs: Local testing & validation

**Next Phase**: Add test IDs to app components, then validate E2E tests locally
