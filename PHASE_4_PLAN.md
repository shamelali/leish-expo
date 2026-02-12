# Phase 4: Coverage & E2E Testing – Implementation Plan

## Overview
Phase 4 increases test coverage to >70%, adds integration testing for critical flows, and implements E2E testing infrastructure.

## 📊 Coverage Goals

### Current Baseline (Phase 3)
- Overall: 32.09% statements
- Components: 100% ✅
- Components/UI: 73.52%
- Hooks: 60%
- Services: 9.35% ❌ (critical gap)
- Store: 35.71%
- Utils: 22.22%

### Phase 4 Targets
| Module | Current | Target | Priority |
|--------|---------|--------|----------|
| Services | 9.35% | >80% | 🔴 CRITICAL |
| Store | 35.71% | >70% | 🔴 CRITICAL |
| Hooks | 60% | >80% | 🟠 HIGH |
| Utils | 22.22% | >50% | 🟠 HIGH |
| Overall | 32.09% | >70% | 🔴 CRITICAL |

## 🎯 Implementation Roadmap

### Week 1: Service & Store Testing
- [ ] Add auth service tests (login, signup, logout, token refresh)
- [ ] Add API client tests (request/response, error handling, interceptors)
- [ ] Add storage service tests (get, set, clear operations)
- [ ] Add Zustand store tests (auth state mutations, actions)
- [ ] Target coverage: Services 80%, Store 70%

### Week 2: Integration Testing
- [ ] Full auth flow integration test (signup → login → navigate)
- [ ] API error handling integration test
- [ ] State persistence integration test
- [ ] Token refresh flow test
- [ ] Target coverage: Overall >60%

### Week 3: E2E Testing Setup
- [ ] Install and configure Detox
- [ ] Create E2E test harness
- [ ] Write basic navigation E2E tests
- [ ] Write auth flow E2E tests
- [ ] Document E2E setup and patterns

### Week 4: Performance & Polish
- [ ] Bundle size tracking in CI
- [ ] Coverage thresholds enforcement
- [ ] Performance benchmarking setup
- [ ] Polish documentation
- [ ] Target: Overall >70% coverage

## 📁 Test Files to Create

### Service Tests
```
__tests__/services/
├── api.test.ts              (auth, data endpoints, error handling)
├── auth.test.ts             (login, signup, logout, refresh)
├── storage.test.ts          (get, set, clear auth data)
```

### Store Tests
```
__tests__/store/
├── auth-store.test.ts       (actions, state mutations, selectors)
└── app-store.test.ts        (if applicable)
```

### Integration Tests
```
__tests__/integration/
├── auth-flow.test.tsx       (signup → login → profile → logout)
├── api-integration.test.ts  (API calls with store updates)
└── persistence.test.ts      (state saved/restored from storage)
```

### E2E Tests
```
e2e/
├── auth.e2e.ts             (login/signup flows)
├── navigation.e2e.ts       (tab navigation, screen transitions)
└── profile.e2e.ts          (profile view/edit)
```

## 🧪 Testing Strategy

### Unit Tests (Services/Store)
- Mock HTTP calls with Jest
- Test success and error paths
- Verify state updates
- Test edge cases

### Integration Tests
- Combine multiple units
- Test realistic user flows
- Mock only external APIs
- Use real store/services

### E2E Tests
- Run on device/emulator
- No mocking (full integration)
- Test complete user journeys
- Verify UI interactions

## 🚀 Quick Start Tasks

### Phase 4a: Core Service Tests
1. Create `__tests__/services/api.test.ts`
2. Create `__tests__/services/auth.test.ts`
3. Create `__tests__/services/storage.test.ts`
4. Create `__tests__/store/auth-store.test.ts`
5. Run: `npm test` → Target 60% coverage

### Phase 4b: Integration Tests
1. Create `__tests__/integration/auth-flow.test.tsx`
2. Create `__tests__/integration/api-integration.test.ts`
3. Create `__tests__/integration/persistence.test.ts`
4. Run: `npm test` → Target 70% coverage

### Phase 4c: E2E Setup
1. Install Detox: `npm install --save-dev detox-cli detox`
2. Create `e2e/config.json`
3. Create `e2e/auth.e2e.ts`
4. Run: `detox test`

## 📈 Success Metrics

- [ ] Overall coverage >70%
- [ ] Services coverage >80%
- [ ] All integration tests passing
- [ ] E2E tests running on device
- [ ] CI validated coverage thresholds
- [ ] Performance baseline established

## 🔍 Coverage Gaps Analysis

### Services (9.35% → Target 80%)
**Current**: Only basic API structure tested
**Missing**:
- Login/signup success & error paths
- Token refresh logic
- Request/response interceptors
- Error formatting and parsing
- Retry logic (if any)

### Store (35.71% → Target 70%)
**Current**: Store actions partially tested
**Missing**:
- State selector accuracy
- Cross-action interactions
- Error state handling
- Async action completion

### Hooks (60% → Target >80%)
**Current**: useAsync and useAuth tested
**Missing**:
- useAsync with real API calls
- useAsync cleanup on unmount
- Error recovery patterns
- Loading state transitions

## 📋 Acceptance Criteria

### Coverage
- ✅ Statements: >70%
- ✅ Branches: >60%
- ✅ Functions: >70%
- ✅ Lines: >70%

### Tests
- ✅ All existing tests still pass
- ✅ New tests add meaningful coverage (not just line coverage)
- ✅ Tests document expected behavior
- ✅ Tests are maintainable and clear

### E2E
- ✅ Can run on iOS emulator/device
- ✅ Can run on Android emulator/device
- ✅ Tests validate real user flows
- ✅ Tests are stable (low flakiness)

## 🎓 Learning Resources

- [Jest Mocking Best Practices](https://jestjs.io/docs/manual-mocks)
- [Integration Testing Patterns](https://testingjavascript.com/)
- [Detox E2E Testing](https://wix.github.io/Detox/)
- [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
