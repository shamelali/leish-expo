# Phase 2: Feature Development & UI Enhancement

Implementation guide for Phase 2 of the Leish application (Weeks 3-4).

---

## Overview

Phase 2 focuses on expanding the UI component library, improving user experience, and building feature-specific screens. This phase establishes patterns for rapid Phase 3+ development.

---

## Completed in Phase 2

### 1. UI Component Library Expansion ✅

#### Card Components
- **Card** - Basic container with customizable padding and gaps
- **ListCard** - For displaying list items with icon, action, and metadata

**Location**: [components/ui/card.tsx](../components/ui/card.tsx)

**Usage**:
```typescript
import { Card, ListCard } from '@/components/ui/card';

<Card padding={16}>
  <ThemedText>Card content</ThemedText>
</Card>

<ListCard
  title="Setting"
  subtitle="Description"
  onPress={() => {}}
  rightElement={<Text>Value</Text>}
  icon={<Icon />}
/>
```

#### Loading & Skeleton Components
- **Loader** - Spinner with optional message (full-screen or inline)
- **Skeleton** - Placeholder for loading states

**Location**: [components/ui/loader.tsx](../components/ui/loader.tsx)

**Usage**:
```typescript
import { Loader, Skeleton } from '@/components/ui/loader';

<Loader size="large" message="Loading..." fullScreen={true} />

<Skeleton width="100%" height={16} borderRadius={8} />
```

#### Empty State Component
- **EmptyState** - Shows when no data available with optional action

**Location**: [components/ui/empty-state.tsx](../components/ui/empty-state.tsx)

**Usage**:
```typescript
import { EmptyState } from '@/components/ui/empty-state';

<EmptyState
  icon="inbox"
  title="No items"
  description="Create your first item to get started"
  action={{
    title: 'Create',
    onPress: () => navigate('create'),
  }}
  fullScreen={true}
/>
```

#### Error Components
- **Error** - Error display with optional retry button
- **ErrorBoundary** - React Error Boundary for catching component errors

**Location**: [components/feedback/error.tsx](../components/feedback/error.tsx)

**Usage**:
```typescript
import { Error, ErrorBoundary } from '@/components/feedback/error';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

<Error
  title="Error"
  message="Something went wrong"
  onRetry={() => refetch()}
  details="Error code: 500"
/>
```

#### Toast Notifications
- **Toast** - Individual toast message with auto-dismiss
- **ToastManager** - Manages multiple toasts

**Location**: [components/feedback/toast.tsx](../components/feedback/toast.tsx)

**Usage**:
```typescript
import { Toast, ToastManager } from '@/components/feedback/toast';

const [toasts, setToasts] = useState<ToastProps[]>([]);

const addToast = (message: string, type: 'success' | 'error' | 'info') => {
  setToasts([...toasts, { message, type }]);
};

<ToastManager toasts={toasts} onRemove={(idx) => setToasts(toasts.filter((_, i) => i !== idx))} />
```

#### Modal Dialog
- **ModalDialog** - Modal with title, content, and action buttons

**Location**: [components/feedback/modal.tsx](../components/feedback/modal.tsx)

**Usage**:
```typescript
import { ModalDialog } from '@/components/feedback/modal';

<ModalDialog
  visible={isOpen}
  title="Confirm Delete"
  onClose={() => setIsOpen(false)}
  actionButtons={[
    {
      title: 'Delete',
      onPress: handleDelete,
      variant: 'danger',
    },
  ]}
>
  <ThemedText>Are you sure?</ThemedText>
</ModalDialog>
```

### 2. Data Fetching Hooks ✅

#### useAsync Hook
- Generic async data fetching hook
- Multiple invocations (immediate or manual)
- Error handling and success callbacks
- Refetch functionality

**Usage**:
```typescript
import { useAsync } from '@/hooks/use-async';

const { data, loading, error, execute, refetch } = useAsync(
  () => apiService.get('/data'),
  true, // immediate
  {
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => console.error('Error:', error),
  }
);
```

#### useMutation Hook
- For handling POST/PUT/DELETE operations
- Separate loading state from data
- Variable-based invocation

**Usage**:
```typescript
import { useMutation } from '@/hooks/use-async';

const { mutate, loading, error } = useMutation(
  (data) => apiService.post('/data', data),
  {
    onSuccess: (result) => console.log('Created:', result),
  }
);

// Invoke mutation
mutate({ name: 'New Item' });
```

### 3. Feature Screens ✅

#### Profile Edit Screen
- Edit user profile form
- Name, email fields
- Save with loading state
- Error handling

**Location**: [features/profile/edit.tsx](../features/profile/edit.tsx)

Accessible via: Settings → Edit Profile

#### Settings Screen
- Account settings
- Preferences (theme, language)
- Support links
- App version
- Logout button

**Location**: [app/(tabs)/settings.tsx](../app/(tabs)/settings.tsx)

Added as new tab in bottom navigation.

### 4. Utility Functions ✅

#### Error Handling
- `AppError` - Custom error class
- Error code constants
- `getErrorMessage()` - User-friendly messages
- `isNetworkError()`, `isAuthError()`, `isValidationError()`

**Location**: [utils/errors.ts](../utils/errors.ts)

**Usage**:
```typescript
import { getErrorMessage, isNetworkError } from '@/utils/errors';

try {
  await apiService.get('/data');
} catch (error) {
  if (isNetworkError(error)) {
    showToast('Network error');
  } else {
    showToast(getErrorMessage(error));
  }
}
```

#### Formatting Utilities
- `formatDate()`, `formatDateTime()`, `formatTime()`
- `formatRelativeTime()` - "2h ago"
- `formatCurrency()` - Money formatting
- `truncateText()` - Ellipsis text truncation
- `capitalize()`, `slugify()`

**Location**: [utils/formatting.ts](../utils/formatting.ts)

**Usage**:
```typescript
import { formatDate, formatRelativeTime, capitalize } from '@/utils/formatting';

const date = formatDate(new Date()); // "Feb 12, 2026"
const relative = formatRelativeTime(postDate); // "2h ago"
const name = capitalize('john'); // "John"
```

---

## Navigation Structure - Phase 2

```
Root Layout
├─ (tabs)
│  ├─ index (Home)
│  │  └─ Links to features
│  ├─ explore (Explore)
│  │  └─ Feature screens
│  └─ settings (Settings)
│     └─ Edit Profile link
│        └─ features/profile/edit.tsx
├─ auth/* (Auth stack)
└─ features/* (Feature screens)
   ├─ profile/
   │  ├─ _layout.tsx
   │  └─ edit.tsx
   └─ settings/
      └─ index.tsx (moved to (tabs)/settings.tsx)
```

---

## File Structure - Phase 2

```
leish/
├── app/
│   ├── (tabs)/
│   │   ├── settings.tsx               ✅ NEW: Settings tab screen
│   │   └── ...
│   └── ...
├── features/
│   ├── profile/
│   │   ├── _layout.tsx                ✅ NEW: Profile stack layout
│   │   └── edit.tsx                   ✅ NEW: Edit profile screen
│   └── settings/
│       └── index.tsx                  ✅ NEW: Settings feature (referenced from tabs)
├── components/
│   ├── ui/
│   │   ├── card.tsx                   ✅ NEW: Card components
│   │   ├── loader.tsx                 ✅ NEW: Loader & skeleton
│   │   ├── empty-state.tsx            ✅ NEW: Empty state
│   │   └── ...
│   └── feedback/
│       ├── error.tsx                  ✅ NEW: Error & error boundary
│       ├── toast.tsx                  ✅ NEW: Toast notifications
│       ├── modal.tsx                  ✅ NEW: Modal dialog
│       └── ...
├── hooks/
│   ├── use-async.ts                   ✅ NEW: Data fetching hooks
│   └── ...
├── utils/
│   ├── errors.ts                      ✅ NEW: Error handling
│   ├── formatting.ts                  ✅ NEW: Text formatting
│   └── ...
└── ...
```

---

## UI Component Patterns

### Error Handling Pattern
```typescript
<ErrorBoundary>
  <MyFeatureScreen />
</ErrorBoundary>
```

### Loading Pattern
```typescript
const { data, loading, error } = useAsync(() => fetchData());

if (loading) return <Loader message="Loading..." />;
if (error) return <Error message={error} onRetry={refetch} />;
return <Content data={data} />;
```

### Empty State Pattern
```typescript
if (data?.length === 0) {
  return (
    <EmptyState
      title="No items"
      description="Create your first item"
      action={{ title: 'Create', onPress: () => navigate('create') }}
      fullScreen
    />
  );
}
return <List data={data} />;
```

---

## Common Implementations

### Add a New Feature Screen

1. **Create feature directory**
   ```
   features/feature-name/
   ├── _layout.tsx (if stack navigation)
   ├── index.tsx (main screen)
   └── [other screens]
   ```

2. **Use useAsync for data fetching**
   ```typescript
   const { data, loading, error } = useAsync(
     () => apiService.get('/feature-data')
   );
   ```

3. **Handle states**
   - Loading: Show `<Loader />`
   - Error: Show `<Error />`
   - Empty: Show `<EmptyState />`
   - Success: Show content

4. **Add to navigation**
   - Add to (tabs) if main tab
   - Or link from another screen

### Handle Form Submission

```typescript
const { mutate, loading, error } = useMutation(
  (formData) => apiService.post('/endpoint', formData)
);

const handleSubmit = async (data) => {
  try {
    await mutate(data);
    showToast('Success!', 'success');
  } catch (err) {
    showToast(getErrorMessage(err), 'error');
  }
};
```

### Show Toast Notifications

Best practices:
1. Wrap app with toast provider (Phase 3)
2. For now, create toast manager in root layout
3. Show on success/error responses
4. Auto-dismiss after delay

---

## Testing Checklist

- [ ] All new components render correctly
- [ ] Loading states display properly
- [ ] Error states show helpful messages
- [ ] Empty states appear when needed
- [ ] Cards are responsive on different screen sizes
- [ ] Modals close on background tap
- [ ] Toasts auto-dismiss
- [ ] Profile edit saves data
- [ ] Settings navigates to profile edit
- [ ] Logout clears session
- [ ] useAsync refetch works
- [ ] useMutation handles errors
- [ ] Error boundary catches errors
- [ ] Relative time formatting works

---

## Performance Notes

- ✅ Lazy component loading
- ✅ Memoized card components
- ✅ Optimized re-renders with hooks
- ✅ Efficient state management
- ✅ Minimal re-renders on data fetch

---

## Next Phase (Phase 3)

Phase 3 will add:
1. **Testing**
   - Unit tests for utils
   - Component tests
   - Integration tests

2. **Advanced UX**
   - Global toast manager
   - Loading skeletons for lists
   - Pull-to-refresh
   - Pagination

3. **Optimization**
   - Code splitting
   - Bundle size analysis
   - Performance profiling
   - Image optimization

4. **Deployment**
   - Build configuration
   - App store setup
   - Error tracking (Sentry)
   - Analytics

---

## Documentation

- [Use Async Hook Documentation](#)
- [UI Components Library](#)
- [Error Handling Guide](#)
- [Form Patterns](#)

---

## Stats - Phase 2

| Item | Count |
|------|-------|
| New UI Components | 7 |
| New Hooks | 2 |
| New Screens | 3 |
| Feature Directories | 2 |
| Utility Files | 2 |
| Total Lines Added | ~800 |

---

## Git Workflow

```bash
# Create feature branches
git checkout -b feature/phase-2-components
git commit -m "Add UI components library"
git commit -m "Add data fetching hooks"
git commit -m "Add feature screens"
git push origin feature/phase-2-components
```

---

## Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [React Native Animated](https://reactnative.dev/docs/animated)
- [Expo Router Navigation](https://docs.expo.dev/router)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

*Phase 2 Complete - Ready for Phase 3*
