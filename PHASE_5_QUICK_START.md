# Phase 5: E2E Testing - Quick Start Reference

## 🚀 Quick Start (5 minutes)

### Prerequisites Check
```bash
# Verify Node.js version
node --version          # Should be 18+

# Verify npm
npm --version           # Any recent version

# Verify Xcode
xcode-select -p         # Should show /Applications/Xcode.app/...
```

### Installation
```bash
# Install Detox
npm install --save-dev detox detox-cli

# Or if already installed
npm install
```

### First Test Run
```bash
# Build framework and app
npm run e2e:build:ios

# Run E2E tests
npm run e2e:test:ios

# Or with watch mode (reruns on changes)
npm run e2e:test:ios -- --watch
```

## 📁 File Structure

```
e2e/
├── config/
│   └── jest.config.js           ← Jest config for E2E tests
├── helpers/
│   ├── actions.ts               ← 40+ reusable test functions
│   └── screens.ts               ← Screen IDs, test data
└── tests/
    ├── auth.e2e.ts              ← 17 auth flow tests
    ├── navigation.e2e.ts        ← 13+ navigation tests
    ├── dashboard.e2e.ts         ← Dashboard tests (template)
    └── performance.e2e.ts       ← Performance tests (template)

detox.config.js                  ← Main Detox configuration
```

## 📝 Test Examples

### Simple Login Test
```typescript
it('should login successfully', async () => {
  // Fill form
  await fillEmailInput('test@example.com');
  await fillPasswordInput('password123');
  
  // Submit
  await tapLoginButton();
  
  // Verify success
  await waitForElement(Screens.DashboardScreen, 5000);
  await verifyElementVisible(Screens.DashboardScreen);
});
```

### Navigation Test
```typescript
it('should switch between tabs', async () => {
  // Navigate to explore
  await tapTabBarItem(Elements.TabExploreIcon);
  await waitForElement('explore-content', 2000);
  
  // Navigate to profile
  await tapTabBarItem(Elements.TabProfileIcon);
  await waitForElement('profile-content', 2000);
  
  // Verify
  await verifyElementVisible('profile-content');
});
```

## 🔧 Common Commands

| Command | Description |
|---------|-------------|
| `npm run e2e:build:ios` | Build framework and app for iOS |
| `npm run e2e:test:ios` | Run all E2E tests on iOS simulator |
| `npm run e2e:test:ios -- --watch` | Run tests in watch mode |
| `detox test e2e/tests/auth.e2e.ts --configuration ios.sim.debug` | Run single test file |
| `detox test e2e/tests/auth.e2e.ts --configuration ios.sim.debug -t "Login"` | Run single test suite |

## 🆔 Test IDs Required

Add these to your app components before running tests:

### Auth Screens
```typescript
testID="email-input"
testID="password-input"
testID="login-button"
testID="signup-button"
testID="login-screen"
testID="signup-screen"
```

### Navigation
```typescript
testID="tab-icon-home"
testID="tab-icon-explore"
testID="tab-icon-profile"
testID="dashboard-screen"
```

## 🐛 Troubleshooting

### Tests timeout
```bash
# Increase timeout in test
await waitForElement('element-id', 10000)  # 10 seconds instead of 5
```

### Build fails
```bash
# Clean and rebuild
rm -rf ios/build
npm run e2e:build:ios
```

### Simulator issues
```bash
# List simulators
xcrun simctl list

# Boot specific simulator
xcrun simctl boot "iPhone 15"

# Erase simulator
xcrun simctl erase all
```

### Element not found
1. Verify test ID is added to component
2. Check element ID spelling in test
3. Verify screen has loaded (use waitForElement first)
4. Add `console.log` to debug

## 📊 Test Statistics

| Category | Count | Status |
|----------|-------|--------|
| Auth Tests | 17 | ✅ Ready |
| Navigation Tests | 13+ | ✅ Ready |
| Helper Functions | 40+ | ✅ Ready |
| Documentation | 4 docs | ✅ Complete |

## 📚 Documentation

- **E2E_SETUP_GUIDE.md** - Complete setup and troubleshooting
- **PHASE_5_PLAN.md** - Detailed planning and scope
- **PHASE_5_PROGRESS.md** - Progress tracking and next steps
- **PHASE_4_TO_PHASE_5_TRANSITION.md** - Transition summary

## 💡 Tips & Best Practices

### Good Test Practices
```typescript
✅ Use explicit waits: waitForElement('id', 5000)
✅ Clear state: beforeEach(() => { clearAllInputs() })
✅ Meaningful assertions: verifyElementVisible('id')
✅ Test critical paths: login, logout, main flows
❌ Don't hardcode timeouts
❌ Don't test implementation details
❌ Don't create flaky waits without reasons
```

### Test Organization
```typescript
describe('Feature', () => {
  describe('Sub-Feature', () => {
    it('should test specific scenario', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## 🎯 Next Phase

### Immediate (Today)
- [ ] Add test IDs to components
- [ ] Run `npm run e2e:build:ios`
- [ ] Execute `npm run e2e:test:ios`

### This Week
- [ ] Fix failing tests
- [ ] Add more scenarios
- [ ] Document results

### Next Phase
- [ ] Dashboard feature tests
- [ ] Performance benchmarks
- [ ] CI/CD integration

## 📞 Quick Reference

### Helper Functions Available
```typescript
// Input
fillEmailInput(email)
fillPasswordInput(password)
fillNameInput(name)

// Buttons
tapLoginButton()
tapSignupButton()
tapTabBarItem(id)

// Wait
waitForElement(id, timeout)
waitForText(text, timeout)

// Verify
verifyElementVisible(id)
verifyTextVisible(text)

// Device
clearAllInputs()
dismissKeyboard()
sleep(ms)
```

### Screen Identifiers
```typescript
Screens.LoginScreen
Screens.SignupScreen
Screens.DashboardScreen
Screens.ExploreScreen
Screens.ProfileScreen
```

### Test Data
```typescript
TestData.validEmail        // 'test@example.com'
TestData.validPassword     // 'Password123!'
TestData.validName         // 'Test User'
```

---

## 🎉 You're Ready!

Phase 5 E2E Testing framework is complete and ready to use.

**Next Step**: Add test IDs to app components and run your first E2E test!

```bash
npm run e2e:test:ios
```

Questions? Check E2E_SETUP_GUIDE.md or PHASE_5_PROGRESS.md
