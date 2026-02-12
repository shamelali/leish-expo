# Phase 2 Structure Guide

Complete overview of Phase 2 file organization and architecture.

---

## Phase 2 Additions Overview

Phase 2 expanded the application with:
- **UI Component Library**: 6 new reusable components for consistent UI
- **Data Fetching Hooks**: Generic hooks for async operations
- **Error Handling**: Error boundaries and error display components
- **Toast Notifications**: User feedback system
- **Feature Screens**: Profile editing and settings management
- **Utilities**: Error handling and text formatting helpers

---

## Directory Structure

### components/ui/ - UI Components

```
components/ui/
├── button.tsx          [PHASE 1] Reusable button with variants
├── input.tsx           [PHASE 1] TextInput with validation
├── card.tsx            [PHASE 2] Card containers for content
├── loader.tsx          [PHASE 2] Loading spinner and skeleton
├── empty-state.tsx     [PHASE 2] Empty state display
└── index.ts            Export all components
```

**Phase 2 New Components:**

**card.tsx** (~75 lines)
- `Card`: Generic container with theme support
- `ListCard`: List item with title, subtitle, actions
- Props: children, padding, gap, onPress, style
- Usage: Wraps content in themed containers

**loader.tsx** (~50 lines)
- `Loader`: Activity indicator with optional message
- `Skeleton`: Placeholder for loading content
- Props: size, message, duration, width, height, borderRadius
- Usage: Show progress during data loading

**empty-state.tsx** (~60 lines)
- `EmptyState`: Display when no data available
- Props: icon, title, description, action, fullScreen
- Integrates with Feather icons and Button component
- Usage: Show helpful message with CTA

### components/feedback/ - Feedback Components

```
components/feedback/
├── error.tsx           [PHASE 2] Error display and boundary
├── toast.tsx           [PHASE 2] Toast notifications
├── modal.tsx           [PHASE 2] Modal dialogs
└── index.ts            Export all components
```

**error.tsx** (~90 lines)
- `Error`: Error message with retry button
- `ErrorBoundary`: React error boundary class
- Props: title, message, details, onRetry, dismissible
- Usage: Display API errors, catch component errors

**toast.tsx** (~80 lines)
- `Toast`: Individual toast notification
- `ToastManager`: Manages multiple toasts
- Props: message, type (success|error|info|warning), duration
- Features: Auto-dismiss, stackable, animated

**modal.tsx** (~65 lines)
- `ModalDialog`: Dialog with overlay and actions
- Props: visible, title, content, actionButtons, onClose
- Variants: default, danger, primary for action buttons
- Usage: Confirmations, alerts, simple dialogs

**components/forms/ - Form Components (Phase 1)**

```
components/forms/
├── login-form.tsx      [PHASE 1] Login form component
└── signup-form.tsx     [PHASE 1] Signup form component
```

### hooks/ - Custom Hooks

```
hooks/
├── use-auth.ts         [PHASE 1] Authentication state and operations
├── use-color-scheme.ts [INITIAL] Theme detection
├── use-color-scheme.web.ts [INITIAL] Web theme detection
├── use-theme-color.ts  [INITIAL] Theme color accessor
└── use-async.ts        [PHASE 2] Data fetching and mutations
```

**use-async.ts** (~90 lines)
- `useAsync<T>`: Generic hook for GET requests
- `useMutation<T>`: Generic hook for mutations (POST/PUT/DELETE)
- Features: Loading, error, data states, refetch, callbacks
- Usage: All data fetching operations

### features/ - Feature Modules

```
features/
├── profile/
│   ├── _layout.tsx     [PHASE 2] Profile stack navigation
│   ├── edit.tsx        [PHASE 2] Profile edit screen
│   └── index.tsx       [IF CREATED] Profile view
└── settings/
    └── index.tsx       [PHASE 2] Settings feature screen
```

**profile/edit.tsx** (~70 lines)
- Form for editing user profile
- Fields: name, email
- Integrates: useAuth hook, form validation, error display
- Navigation: Back after successful save

**settings/index.tsx** (~80 lines)
- Settings interface with sections
- Sections: Account, Preferences, Support, Logout
- Integrates: useAuth for logout, Link for navigation

### app/ - App Screens

```
app/
├── _layout.tsx         [UPDATED] Auth-aware root layout
├── modal.tsx           [INITIAL] Modal presentation strategy
├── auth/               [PHASE 1] Auth stack screens
│   ├── _layout.tsx
│   ├── login.tsx
│   └── signup.tsx
├── (tabs)/
│   ├── _layout.tsx     [UPDATED] Bottom tabs navigation
│   ├── index.tsx       [INITIAL] Home screen
│   ├── explore.tsx     [INITIAL] Explore screen
│   └── settings.tsx    [PHASE 2] Settings tab
└── expo-env.d.ts       [INITIAL] Expo types
```

**app/(tabs)/_layout.tsx** (Updated)
- Added Settings tab to bottom navigation
- Tabs: Home, Explore, Settings
- Icons: home, compass, settings (Feather icons)

**app/(tabs)/settings.tsx** (New)
- New tab screen for settings
- Content: Account, Preferences, Support sections
- Links: Profile editor, theme, language, logout

### utils/ - Utility Functions

```
utils/
├── validation.ts       [PHASE 1] Form validation schemas
├── errors.ts           [PHASE 2] Error handling utilities
└── formatting.ts       [PHASE 2] Text and date formatting
```

**errors.ts** (~65 lines)
- `AppError`: Custom error class
- `getErrorMessage()`: User-friendly error strings
- `isNetworkError()`: Network error detection
- `isAuthError()`: Auth error detection
- `isValidationError()`: Validation error detection
- Usage: All error handling and user messaging

**formatting.ts** (~80 lines)
- `formatDate()`: Date to "MMM DD, YYYY"
- `formatDateTime()`: Full date and time format
- `formatTime()`: Time only format
- `formatRelativeTime()`: "1h ago" format
- `formatCurrency()`: Currency formatting ($ or €)
- `truncateText()`: Truncate with ellipsis
- `capitalize()`: Capitalize first letter
- `slugify()`: Convert to URL slug
- Usage: Display formatted data to users

### services/ - Business Logic (Phase 1)

```
services/
├── api.ts              [PHASE 1] HTTP client with interceptors
├── auth.ts             [PHASE 1] Auth business logic
└── storage.ts          [PHASE 1] AsyncStorage wrapper
```

### store/ - State Management (Phase 1)

```
store/
├── index.ts            [PHASE 1] Zustand stores (auth, app)
└── types.ts            [IF EXISTS] Store type definitions
```

### types/ - TypeScript Types (Phase 1)

```
types/
└── index.ts            [PHASE 1] All app type definitions
```

### Config Files

```
.
├── app.json            [INITIAL] Expo configuration
├── package.json        [UPDATED] Dependencies and scripts
├── tsconfig.json       [INITIAL] TypeScript config
├── eslint.config.js    [INITIAL] ESLint rules
├── expo-env.d.ts       [INITIAL] Expo env types
└── README.md           [UPDATED] Project documentation
```

---

## Component Hierarchy

### UI Components Usage

```
Screen
  └── ThemedView (theme wrapper)
      ├── Card (data containers)
      │   ├── ListCard (list items)
      │   └── children (custom content)
      ├── Button (actions)
      ├── TextInputField (form inputs)
      ├── Loader (loading state)
      ├── Skeleton (loading placeholders)
      ├── EmptyState (no data state)
      └── Error (error state)
```

### Feedback Components Usage

```
Screen/Layout
  ├── ErrorBoundary (wraps entire screen)
  │   └── Screen content
  ├── ToastManager (at root level)
  │   └── Toasts array
  └── ModalDialog (multiple allowed)
      └── Modal content
```

### Feature Module Structure

```
Feature Module
  ├── _layout.tsx (navigation)
  ├── index.tsx or screens (main UI)
  ├── components/ (feature-specific)
  ├── hooks/ (feature-specific)
  ├── types/ (feature-specific)
  └── utils/ (feature-specific)
```

---

## Data Flow Architecture

### Async Data Loading

```
Component/Screen
  ↓
useAsync Hook
  ├─ loading state → shows Loader
  ├─ error state → shows Error with retry
  └─ data state → shows content or EmptyState
  ↓
API Service
  ├─ Request with interceptors
  ├─ Token injection
  └─ Error handling
  ↓
Zustand Store (if needed for global state)
```

### Form Submission

```
Form Component
  ↓
handleSubmit()
  ├─ Validate form
  └─ call useMutation
  ↓
useMutation Hook
  ├─ loading state → disable button
  ├─ error state → show Error or Toast
  └─ success → callback
  ↓
API Service
  ├─ POST/PUT/DELETE request
  └─ Error handling
  ↓
Zustand Store (update global state if needed)
  ↓
Toast Notification (success/error feedback)
```

### Error Handling Flow

```
API Error
  ↓
Service Layer
  ├─ Catch and analyze
  └─ Extract message
  ↓
Hook/Component
  ├─ getErrorMessage() → user-friendly text
  ├─ isNetworkError() → "Check internet"
  ├─ isAuthError() → "Session expired"
  └─ isValidationError() → "Invalid input"
  ↓
UI Display
  ├─ Error component (with retry)
  ├─ Toast notification
  └─ Form field errors
```

---

## Key Patterns Introduced in Phase 2

### 1. Loading, Error, Empty, Success (LEES) Pattern

Every data-loading screen follows:
```
if (loading) return <Loader />
if (error) return <Error onRetry />
if (empty) return <EmptyState />
return <Content />
```

### 2. Form Validation Pattern

Forms validate and handle errors:
```
validateForm()
  → hasErrors? → show field errors and toast
  → submit with useMutation
  → onSuccess → navigate
  → onError → show error toast
```

### 3. Feature Module Pattern

Each feature is self-contained:
```
features/feature-name/
  → _layout.tsx (navigation)
  → index.tsx (main screen)
  → components/ (UI)
  → hooks/ (logic)
  → utils/ (helpers)
```

### 4. Hook Composition Pattern

Hooks compose together:
```
useAsync + useEffect = auto-fetch on mount
useMutation + handleSubmit = form submission
useAuth + Zustand = global auth state
```

---

## Dependencies Added in Phase 2

None new - Phase 2 uses only Phase 1 dependencies:
- `zustand` - State management
- `zod` - Validation
- `axios` - HTTP requests
- `react-hook-form` - Form handling
- `@react-native-async-storage/async-storage` - Persistence

---

## File Statistics

| Category | Count | Size |
|----------|-------|------|
| UI Components | 3 new | ~185 lines |
| Feedback Components | 3 new | ~235 lines |
| Hooks | 1 new | ~90 lines |
| Feature Screens | 3 new | ~170 lines |
| Utilities | 2 new | ~145 lines |
| Navigation Updates | 1 updated | ~30 lines |
| **Total Phase 2** | **13 new** | **~855 lines** |

Plus Phase 1:
| Category | Count | Size |
|----------|-------|------|
| Services | 3 | ~340 lines |
| State Management | 1 | ~108 lines |
| Types | 1 | ~45 lines |
| UI Components | 2 | ~187 lines |
| Forms | 2 | ~176 lines |
| Auth Screens | 3 | ~179 lines |
| **Total Phase 1** | **13** | **~1,035 lines** |

**Combined Phases 1 & 2: ~1,890 lines of production code**

---

## Naming Conventions

### Files
- Screens: `kebab-case.tsx` (e.g., `profile-edit.tsx`, `settings.tsx`)
- Components: `PascalCase.tsx` (e.g., `Card.tsx`, `Loader.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-async.ts`, `use-auth.ts`)
- Utilities: `kebab-case.ts` (e.g., `errors.ts`, `formatting.ts`)

### Exports
- Components: Named exports - `export function Card() {}`
- Hooks: Named exports - `export function useAsync() {}`
- Functions: Named exports - `export function formatDate() {}`

### Imports
```typescript
// Components
import { Card } from '@/components/ui/card';
import { Error } from '@/components/feedback/error';

// Hooks
import { useAsync } from '@/hooks/use-async';
import { useAuth } from '@/hooks/use-auth';

// Utils
import { getErrorMessage } from '@/utils/errors';
import { formatDate } from '@/utils/formatting';

// Types
import type { User } from '@/types';
```

---

## Adding New Features

### Step 1: Create Feature Structure
```bash
mkdir -p features/new-feature/components
mkdir -p features/new-feature/hooks
mkdir -p features/new-feature/utils
```

### Step 2: Create Navigation
```typescript
// features/new-feature/_layout.tsx
export default function NewFeatureLayout() {
  return <Stack />;
}
```

### Step 3: Create Main Screen
```typescript
// features/new-feature/index.tsx
import { useAsync } from '@/hooks/use-async';
import { Loader } from '@/components/ui/loader';
import { Error } from '@/components/feedback/error';
import { EmptyState } from '@/components/ui/empty-state';

export default function NewFeatureScreen() {
  const { data, loading, error, refetch } = useAsync(
    () => apiService.get('/data')
  );

  if (loading) return <Loader />;
  if (error) return <Error onRetry={refetch} />;
  if (!data?.length) return <EmptyState />;
  
  return <List data={data} />;
}
```

### Step 4: Add Navigation Link
```typescript
// app/(tabs)/_layout.tsx or features/_layout.tsx
<Tabs.Screen
  name="new-feature"
  options={{ title: 'New Feature' }}
/>
```

### Step 5: Add Route
```typescript
// app.json - if needed for deep linking
{
  "route": "new-feature",
  "destination": "features/new-feature"
}
```

---

## Debugging Tips

### Component Not Rendering
- ✅ Check imports are correct
- ✅ Verify component is exported
- ✅ Ensure parent is rendering

### Hook Not Working
- ✅ Verify it's inside a component
- ✅ Check dependencies array
- ✅ Verify correct hook usage (hooks at top level)

### Data Not Loading
- ✅ Check network tab in debugger
- ✅ Verify API endpoint
- ✅ Check error message in console
- ✅ Use refetch() to retry

### Styling Issues
- ✅ Use ThemedView for theme consistency
- ✅ Check useThemeColor hook
- ✅ Verify theme colors in constants/theme.ts

### Error Not Showing
- ✅ Wrap in ErrorBoundary
- ✅ Check error component is imported
- ✅ Verify error state is true
- ✅ Check catch handler exists

---

## Testing Guidelines

### Component Testing
```typescript
import { render } from '@testing-library/react-native';
import { Card } from '@/components/ui/card';

describe('Card', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Card><Text>Content</Text></Card>
    );
    expect(getByText('Content')).toBeTruthy();
  });
});
```

### Hook Testing
```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { useAsync } from '@/hooks/use-async';

describe('useAsync', () => {
  it('loads data', async () => {
    const mockFn = jest.fn().mockResolvedValue([{ id: 1 }]);
    const { result } = renderHook(() => useAsync(mockFn));
    
    await waitFor(() => {
      expect(result.current.data).toEqual([{ id: 1 }]);
    });
  });
});
```

---

## Related Documentation

- [Phase 2 Implementation](./PHASE_2_IMPLEMENTATION.md) - Detailed implementation guide
- [Phase 2 Quick Reference](./PHASE_2_QUICK_START.md) - Code examples and patterns
- [Phase 2 Complete](./PHASE_2_COMPLETE.md) - Completion summary and metrics
- [Phase 1 Structure](./PHASE_1_STRUCTURE.md) - Phase 1 foundation overview

---

*Phase 2 Structure Guide - Reference Architecture*
