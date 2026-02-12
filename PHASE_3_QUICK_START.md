# Phase 3 Quick Start Guide

## What's New in Phase 3?

Phase 3 adds **testing infrastructure** and **CI/CD pipeline** to ensure code quality and reliability.

## Key Features

✅ **Complete Jest Setup**: React Native preset with mocks for native modules  
✅ **11 Passing Tests**: Unit tests for hooks, components, and utilities  
✅ **GitHub Actions CI**: Automated testing on push/PR  
✅ **Code Coverage Reports**: Track test coverage metrics  
✅ **Bundle Analysis**: Monitor source size and dependencies  

## Getting Started

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Run Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Analyze bundle size
npm analyze
```

### 3. Pre-commit Checks
```bash
# Run full validation (lint + typescript + tests + coverage)
npm run check
```

## Test Files

```
__tests__/
├── components/
│   ├── button.test.tsx        ✅ 2 tests
│   ├── card.test.tsx          ✅ 2 tests
│   └── input.test.tsx         ✅ 2 tests
├── hooks/
│   ├── use-async.test.tsx     ✅ 1 test
│   └── use-auth.test.tsx      ✅ 2 tests
└── utils/
    └── formatting.test.ts     ✅ 2 tests
```

## CI/CD Pipeline

GitHub Actions automatically:
1. Runs on every push & PR
2. Installs dependencies
3. Checks TypeScript
4. Runs ESLint
5. Runs Jest tests with coverage
6. Uploads coverage to Codecov (optional)

File: `.github/workflows/test.yml`

## Coverage Summary

| Area | Coverage | Status |
|------|----------|--------|
| Components | 100% | ✅ |
| Components/UI | 73.52% | ✅ |
| Hooks | 60% | ⚠️ Needs more tests |
| Utils | 22.22% | ❌ Low coverage |
| Services | 9.35% | ❌ Very low coverage |

**Goal**: Reach >70% coverage in Phase 4.

## Writing Tests

### Component Test Template
```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import { MyComponent } from '@/components/my-component';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<MyComponent />);
    expect(getByTestId('test-id')).toBeTruthy();
  });
});
```

### Hook Test Template
```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useMyHook } from '@/hooks/use-my-hook';

describe('useMyHook', () => {
  it('initializes correctly', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBeDefined();
  });
});
```

## Running Specific Tests

```bash
# Run a single file
npx jest __tests__/components/button.test.tsx

# Run tests matching a name pattern
npx jest --testNamePattern="fetches data"

# Run tests in a specific directory
npx jest __tests__/hooks

# Run with verbose output
npx jest --verbose
```

## Debugging Tests

```bash
# Run with detailed debug output
npx jest --verbose --no-coverage

# Run a single test interactively
npx jest --testNamePattern="specific test" --watch
```

## Performance & Bundle Analysis

Monitor your app's bundle size:
```bash
npm analyze
```

Output shows:
- Directory sizes (source, components, hooks, etc.)
- File type count distribution
- Performance recommendations

## Next Steps

Phase 4 will focus on:
- Increasing test coverage to >70%
- Integration testing
- Performance optimization
- E2E testing with Detox

## Troubleshooting

### Tests timeout
- Increase timeout: `it('test', async () => {...}, 10000)`
- Check for infinite loops or hanging async operations

### Module not found errors
- Check `jest.config.js` has correct `moduleNameMapper` for `@/` alias
- Verify path alias in `tsconfig.json` matches

### React version mismatch
- We use `react-test-renderer@19.1.0` to match React 19
- If you get `ReactCurrentOwner` errors, ensure the version matches

### Coverage seems low
- Initial baseline coverage is expected to be low
- Add more tests in Phase 4 to improve coverage metrics

## Resources

- [Jest Docs](https://jestjs.io/)
- [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Code Coverage Best Practices](https://www.typescriptlang.org/docs/handbook/testing.html)
