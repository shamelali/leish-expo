# Phase 2 Quick Reference Guide

Essential patterns and examples for Phase 2 components and hooks.

---

## UI Components Quick Reference

### Card - Container Component
```typescript
import { Card } from '@/components/ui/card';

// Basic card
<Card>
  <ThemedText>Content</ThemedText>
</Card>

// Custom padding and gap
<Card padding={20} gap={12}>
  <ThemedText>Content</ThemedText>
</Card>
```

### Loader - Loading Spinner
```typescript
import { Loader } from '@/components/ui/loader';

// Inline with message
<Loader size="small" message="Loading..." />

// Full screen
<Loader size="large" message="Fetching data..." fullScreen />
```

### Skeleton - Loading Placeholder
```typescript
import { Skeleton } from '@/components/ui/loader';

// Text skeleton
<Skeleton width="100%" height={16} />

// Avatar skeleton
<Skeleton width={48} height={48} borderRadius={24} />

// Custom size
<Skeleton width="80%" height={20} borderRadius={10} />
```

### EmptyState - No Data Display
```typescript
import { EmptyState } from '@/components/ui/empty-state';

// Basic empty state
<EmptyState
  title="No items"
  description="You haven't created any items yet"
/>

// With action button
<EmptyState
  icon="inbox"
  title="No items found"
  description="Create your first item to get started"
  action={{
    title: 'Create Item',
    onPress: () => navigate('create'),
  }}
  fullScreen
/>
```

### Error - Error Display
```typescript
import { Error } from '@/components/feedback/error';

// Basic error
<Error
  message="Failed to load data"
  onRetry={() => refetch()}
/>

// With custom title and details
<Error
  title="Connection Error"
  message="Check your internet connection"
  details="Network timeout after 10s"
  onRetry={() => retry()}
/>
```

### ErrorBoundary - Error Catcher
```typescript
import { ErrorBoundary } from '@/components/feedback/error';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Toast - Notification
```typescript
import { Toast, ToastManager } from '@/components/feedback/toast';

const [toasts, setToasts] = useState<ToastProps[]>([]);

// Add toast
const addToast = (message: string, type: 'success' | 'error' | 'info') => {
  setToasts(prev => [...prev, { message, type, duration: 3000 }]);
};

// Render
<ToastManager 
  toasts={toasts}
  onRemove={(idx) => setToasts(toasts.filter((_, i) => i !== idx))}
/>

// Usage
addToast('Saved successfully!', 'success');
addToast('Something went wrong', 'error');
```

### Modal - Dialog
```typescript
import { ModalDialog } from '@/components/feedback/modal';

const [open, setOpen] = useState(false);

<ModalDialog
  visible={open}
  title="Delete Item?"
  onClose={() => setOpen(false)}
  actionButtons={[
    {
      title: 'Delete',
      onPress: handleDelete,
      variant: 'danger',
    },
  ]}
>
  <ThemedText>This action cannot be undone.</ThemedText>
</ModalDialog>
```

---

## Data Fetching Hooks

### useAsync - Data Loading
```typescript
import { useAsync } from '@/hooks/use-async';

// Immediate fetch
const { data, loading, error, refetch } = useAsync(
  () => apiService.get('/items'),
  true // immediate
);

// Lazy fetch
const { data, loading, execute } = useAsync(
  () => apiService.get('/items'),
  false // not immediate
);

// With callbacks
const { data, loading, error } = useAsync(
  () => apiService.get('/items'),
  true,
  {
    onSuccess: (items) => console.log('Loaded:', items),
    onError: (err) => console.error('Failed:', err),
  }
);

// Render pattern
if (loading) return <Loader />;
if (error) return <Error message={error} onRetry={refetch} />;
return <List data={data} />;
```

### useMutation - Form Submission
```typescript
import { useMutation } from '@/hooks/use-async';

const { mutate, loading, error, data } = useMutation(
  (formData) => apiService.post('/items', formData),
  {
    onSuccess: (result) => console.log('Created:', result),
    onError: (err) => console.error('Failed:', err),
  }
);

// Usage
const handleSubmit = async (item) => {
  try {
    await mutate(item);
    showToast('Created successfully!', 'success');
  } catch (err) {
    showToast(getErrorMessage(err), 'error');
  }
};

// Render
<Button 
  title="Save" 
  onPress={() => handleSubmit(formData)}
  loading={loading}
/>
```

---

## Utility Functions

### Error Handling
```typescript
import { 
  getErrorMessage, 
  isNetworkError, 
  isAuthError,
  isValidationError,
  AppError 
} from '@/utils/errors';

try {
  await apiService.get('/data');
} catch (error) {
  const message = getErrorMessage(error);
  
  if (isNetworkError(error)) {
    showToast('Check your internet connection', 'error');
  } else if (isAuthError(error)) {
    // Token expired, logout user
    logout();
  } else if (isValidationError(error)) {
    // Show form errors
  } else {
    showToast(message, 'error');
  }
}

// Throw custom errors
throw new AppError('INVALID_INPUT', 'Email is required', 400);
```

### Text Formatting
```typescript
import {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatCurrency,
  truncateText,
  capitalize,
  slugify,
} from '@/utils/formatting';

// Date/Time
formatDate(new Date('2026-02-12')); // "Feb 12, 2026"
formatDateTime(new Date('2026-02-12T14:30:00')); // "Feb 12, 2026 2:30 PM"
formatTime(new Date('2026-02-12T14:30:00')); // "2:30 PM"

// Relative time
formatRelativeTime(new Date(Date.now() - 3600000)); // "1h ago"

// Currency
formatCurrency(99.99); // "$99.99"
formatCurrency(99.99, 'EUR'); // "€99.99"

// Text
truncateText('This is a very long text...', 20); // "This is a very lo..."
capitalize('john doe'); // "John doe"
slugify('My Blog Post Title'); // "my-blog-post-title"
```

---

## Common Patterns

### Loading, Error, Empty, Success Pattern
```typescript
export default function ItemsScreen() {
  const { data: items, loading, error, refetch } = useAsync(
    () => apiService.get('/items')
  );

  // Loading
  if (loading) {
    return <Loader message="Loading items..." fullScreen />;
  }

  // Error
  if (error) {
    return (
      <Error
        message={error}
        onRetry={refetch}
      />
    );
  }

  // Empty
  if (!items?.length) {
    return (
      <EmptyState
        title="No items"
        description="Create your first item"
        action={{
          title: 'Create',
          onPress: () => navigate('create'),
        }}
        fullScreen
      />
    );
  }

  // Success
  return <List items={items} />;
}
```

### Form Submission Pattern
```typescript
export default function CreateItemScreen() {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate, loading } = useMutation(
    (data) => apiService.post('/items', data),
    {
      onSuccess: () => {
        showToast('Item created!', 'success');
        navigate('items');
      },
    }
  );

  const handleSubmit = async () => {
    setErrors({});
    
    // Validate
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit
    try {
      await mutate(formData);
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  return (
    <ThemedView>
      <TextInputField
        label="Name"
        value={formData.name}
        onChangeText={(name) => setFormData({ ...formData, name })}
        error={errors.name}
        disabled={loading}
      />
      <TextInputField
        label="Description"
        value={formData.description}
        onChangeText={(description) => setFormData({ ...formData, description })}
        error={errors.description}
        disabled={loading}
        multiline
      />
      <Button
        title="Create"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
      />
    </ThemedView>
  );
}
```

### Settings Screen Pattern
```typescript
<ScrollView>
  <ThemedView style={{ padding: 16, gap: 24 }}>
    {/* Section */}
    <View>
      <ThemedText type="subtitle">Account</ThemedText>
      <Card>
        <Link href="/features/profile/edit">
          <ListCard
            title="Edit Profile"
            subtitle="Update your info"
            rightElement={<Icon />}
          />
        </Link>
      </Card>
    </View>

    {/* Section */}
    <View>
      <ThemedText type="subtitle">Preferences</ThemedText>
      <Card>
        <ListCard title="Theme" rightElement={<Text>Auto</Text>} />
      </Card>
      <Card>
        <ListCard title="Language" rightElement={<Text>English</Text>} />
      </Card>
    </View>

    {/* Action */}
    <Button title="Logout" onPress={logout} variant="danger" />
  </ThemedView>
</ScrollView>
```

---

## Tips & Best Practices

### Do's
- ✅ Always handle loading, error, and empty states
- ✅ Use useAsync for all data fetching
- ✅ Use useMutation for form submissions
- ✅ Show loading spinners during operations
- ✅ Display helpful error messages
- ✅ Use error boundaries in features
- ✅ Format dates and currency properly
- ✅ Wrap API errors with getErrorMessage()

### Don'ts
- ❌ Don't skip loading states
- ❌ Don't ignore errors
- ❌ Don't use fetch directly (use apiService)
- ❌ Don't show raw error messages
- ❌ Don't forget empty state handling
- ❌ Don't nest Modals
- ❌ Don't use multiple Loaders

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Empty state not showing | Check data?.length condition |
| Error not displaying | Verify error prop is passed |
| Loading spinner missing | Ensure loading state is checked |
| Toast not appearing | Check ToastManager is in root layout |
| Modal not closing | Verify onClose callback is called |
| useAsync not retrying | Use refetch() function |
| useMutation variable wrong | Check mutation function parameters |

---

## File Organization for Features

```
features/
└── feature-name/
    ├── _layout.tsx        - Stack navigation (if multi-screen)
    ├── index.tsx          - Main screen
    ├── create.tsx         - Create/edit screen
    ├── detail.tsx         - Detail view (if needed)
    ├── components/        - Feature-specific components
    ├── hooks/             - Feature-specific hooks
    ├── types/             - Feature-specific types
    └── utils/             - Feature-specific utilities
```

---

## Testing Common Scenarios

1. **Loading State**
   - Start app, screen shows Loader
   - Data loads after 1-2 seconds

2. **Error State**
   - Network down, Error appears
   - Retry button works
   - Message is helpful

3. **Empty State**
   - No items in list
   - Empty state shows with action
   - Action button works

4. **Modal**
   - Modal opens and closes
   - Clicks outside closes it
   - Action buttons work

5. **Toast**
   - Toast appears on action
   - Auto-dismisses after 3s
   - Multiple toasts stack

6. **Form Submission**
   - Validation works
   - Loading state shows
   - Success/error handled

---

## Performance Tips

- Use React.memo for expensive components
- Memoize callbacks with useCallback
- Lazy load heavy screens with React.lazy
- Use FlatList for large lists
- Optimize images with proper sizing
- Cancel async requests on unmount

---

## Security Tips

- Never log sensitive data
- Always use HTTPS
- Validate on server
- Sanitize inputs
- Don't expose error details
- Use error boundaries
- Keep tokens secure

---

## Accessibility Tips

- Add alt text to images
- Use semantic HTML
- Test with screen readers
- Ensure good color contrast
- Make buttons keyboard accessible
- Use clear, descriptive labels
- Support text scaling

---

## Resources

- [Phase 2 Implementation](./PHASE_2_IMPLEMENTATION.md)
- [Phase 2 Complete](./PHASE_2_COMPLETE.md)
- [Component API Reference](#)
- [React Hooks Documentation](https://react.dev/reference/react)

---

## Next Steps

- ✅ Use these patterns in your screens
- ✅ Create feature folders for new screens
- ✅ Test all states (loading, error, empty)
- ✅ Handle errors gracefully
- ✅ Format data appropriately
- ✅ Review error boundaries

---

*Phase 2 Quick Reference - Ready for Development*
