# Phase 1 Quick Start Guide

## Getting Started with Authentication

This guide will help you quickly integrate and use the Phase 1 authentication system.

---

## 1. Initial Setup

### Install Dependencies
Dependencies have already been installed:
- `zustand` - State management
- `react-hook-form` - Form handling
- `zod` - Validation
- `axios` - HTTP client
- `@react-native-async-storage/async-storage` - Local storage

### Configure API Endpoint

Create `.env.local` in the project root:
```
EXPO_PUBLIC_API_URL=https://your-api-backend.com
```

Or in `app.json`:
```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://your-api-backend.com"
    }
  }
}
```

---

## 2. Understanding the Auth Flow

```
User Opens App
        │
        ▼
Root Layout (_layout.tsx)
  - Checks authentication status
  - Loading? → Show spinner
  - Authenticated? → Show (tabs)
  - Not authenticated? → Show auth screens
        │
        ├─ NOT AUTHENTICATED
        │   │
        │   ▼
        │  Auth Layout
        │  ├─ Login Screen
        │  │  ├─ User enters email/password
        │  │  ├─ Validation happens
        │  │  ├─ Submit to API via authService
        │  │  └─ If successful → Navigate to tabs
        │  │
        │  └─ Signup Screen
        │     └─ Similar flow
        │
        └─ AUTHENTICATED
            │
            ▼
           (tabs) Layout
           ├─ Home Screen
           │  ├─ Shows user profile
           │  └─ Logout button
           └─ Other screens
```

---

## 3. Common Use Cases

### Display User Information

```typescript
// In any screen
import { useAuth } from '@/hooks/use-auth';
import { ThemedText } from '@/components/themed-text';

export default function MyScreen() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <ThemedText>Please log in</ThemedText>;
  }

  return (
    <ThemedText>
      Welcome, {user?.name}! ({user?.email})
    </ThemedText>
  );
}
```

### Handle Login in a Custom Screen

```typescript
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { LoginForm } from '@/components/forms/login-form';

export default function LoginScreen() {
  const { login, isLoading, error } = useAuth();
  const [formError, setFormError] = useState('');

  const handleLogin = async (data) => {
    try {
      await login(data.email, data.password);
      // Automatic redirect happens via root layout
    } catch (err) {
      setFormError(err?.message || 'Login failed');
    }
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      loading={isLoading}
      error={formError || error}
    />
  );
}
```

### Call Protected API Endpoints

```typescript
import { apiService } from '@/services/api';
import { useEffect, useState } from 'react';

export default function DataScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Token is automatically included by interceptor
        const response = await apiService.get('/api/data');
        setData(response);
      } catch (err) {
        setError(err?.message || 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <ThemedText>Loading...</ThemedText>;
  if (error) return <ThemedText>Error: {error}</ThemedText>;

  return <ThemedText>{JSON.stringify(data)}</ThemedText>;
}
```

### Create a Protected API Endpoint

```typescript
// In services/api.ts, add:

async getProfile() {
  try {
    return await this.get('/user/profile');
  } catch (error) {
    throw this.handleError(error);
  }
}

async updateProfile(data: any) {
  try {
    return await this.put('/user/profile', data);
  } catch (error) {
    throw this.handleError(error);
  }
}

// Usage:
const profile = await apiService.getProfile();
await apiService.updateProfile({ name: 'New Name' });
```

### Add Sessions/Remember Me

```typescript
// In signupForm or loginForm, add checkbox:

const [rememberMe, setRememberMe] = useState(false);

// After login:
if (rememberMe) {
  await storageService.setPreference('rememberMe', true);
}

// On app start (in useAuth hook):
useEffect(() => {
  const checkRememberMe = async () => {
    const shouldRemember = await storageService.getPreference('rememberMe');
    if (shouldRemember) {
      // Auto-login logic if token exists
    }
  };
  checkRememberMe();
}, []);
```

### Logout with Confirmation

```typescript
import { Alert } from 'react-native';
import { useAuth } from '@/hooks/use-auth';

export default function SettingsScreen() {
  const { logout, isLoading } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <Button
      title="Logout"
      onPress={handleLogout}
      loading={isLoading}
      variant="danger"
    />
  );
}
```

### Store User Preferences

```typescript
import { storageService } from '@/services/storage';

// Save preference
await storageService.setPreference('theme', 'dark');
await storageService.setPreference('notifications_enabled', true);
await storageService.setPreference('language', 'es');

// Retrieve preference
const theme = await storageService.getPreference('theme');
const notificationsEnabled = await storageService.getPreference('notifications_enabled');

// Use in component
const [theme, setTheme] = useState('light');

useEffect(() => {
  const loadTheme = async () => {
    const savedTheme = await storageService.getPreference('theme');
    if (savedTheme) setTheme(savedTheme);
  };
  loadTheme();
}, []);
```

---

## 4. Form Validation Examples

### Validate Email Only

```typescript
import { validateEmail } from '@/utils/validation';

const result = validateEmail('user@example.com');
if (result.valid) {
  // OK
} else {
  console.log(result.error); // "Invalid email address"
}
```

### Validate Password Strength

```typescript
import { validatePassword } from '@/utils/validation';

const result = validatePassword('Pass123');
if (!result.valid) {
  console.log(result.error);
  // "Password must be at least 8 characters"
}

const strongResult = validatePassword('MyPassword123');
if (strongResult.valid) {
  // Password is strong
}
```

### Custom Form with Validation

```typescript
import { ThemedText, ThemedView, TextInputField, Button } from '@/components';
import { validateEmail, validatePassword } from '@/utils/validation';
import { useState } from 'react';

export default function CustomAuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    const emailResult = validateEmail(email);
    if (!emailResult.valid) newErrors.email = emailResult.error!;

    const passwordResult = validatePassword(password);
    if (!passwordResult.valid) newErrors.password = passwordResult.error!;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Proceed with login/signup
    console.log('Form is valid!');
  };

  return (
    <ThemedView>
      <TextInputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
      />
      <TextInputField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errors.password}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </ThemedView>
  );
}
```

---

## 5. Debugging

### Check Authentication State

```typescript
// Add to any screen to debug auth state
import { useAuthStore } from '@/store';

export default function DebugScreen() {
  const authStore = useAuthStore();

  return (
    <ThemedText>{JSON.stringify({
      isAuthenticated: !!authStore.user,
      user: authStore.user,
      token: authStore.token ? 'SET' : 'NONE',
      isLoading: authStore.isLoading,
      error: authStore.error,
    }, null, 2)}</ThemedText>
  );
}
```

### Check Stored Credentials

```typescript
import { storageService } from '@/services/storage';

async function debugStorage() {
  const token = await storageService.getAuthToken();
  const user = await storageService.getUserData();
  
  console.log('Stored Token:', token ? 'EXISTS' : 'NONE');
  console.log('Stored User:', user);
}

debugStorage();
```

### Monitor API Calls

Enable axios debug logging:

```typescript
// In services/api.ts
import axios from 'axios';

// Enable request logging
apiClient.interceptors.request.use((config) => {
  console.log('API Request:', {
    method: config.method,
    url: config.url,
    headers: config.headers,
  });
  return config;
});

// Enable response logging
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    throw error;
  }
);
```

---

## 6. Testing the Auth Flow

### Manual Testing Steps

1. **Start App**
   ```bash
   npm start
   ```

2. **Test Unauthenticated State**
   - App should show login screen
   - Try invalid email format
   - Try weak password
   - Verify error messages

3. **Test Signup**
   - Click "Sign up here" link
   - Fill in all fields
   - Test password confirmation mismatch
   - Submit valid data (will fail without API)

4. **Test Login** (once API is ready)
   - Return to login
   - Enter credentials
   - Should show loading state
   - On success → redirects to home screen

5. **Test Authenticated State**
   - Home screen shows user profile
   - Logout button appears
   - User data displays correctly

6. **Test Logout**
   - Click logout
   - App returns to login screen
   - LocalStorage is cleared

7. **Test Persistent Session**
   - Login successfully
   - Close app
   - Reopen app
   - Should still be authenticated

---

## 7. Backend API Requirements

Your backend API should implement:

### POST /auth/login
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://...",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### POST /auth/signup
Same structure as login

### POST /auth/logout
**Response:** 200 OK

### GET /auth/me
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://...",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Invalid token"
}
```

---

## 8. Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Login button not responding | Missing onSubmit handler | Wrap form in container with proper handler |
| Token not persisting | AsyncStorage not initialized | Check AsyncStorage permissions |
| API 401 errors | Headers not being sent | Check interceptor is adding Authorization bearer |
| Form errors not showing | Validation not being called | Call parseLoginForm/parseSignupForm before submit |
| Stuck on loading spinner | Auth initialization failing | Check useAuth hook's initialize function |
| Can't navigate after login | Root layout not updated | Ensure _layout.tsx checks isAuthenticated |

---

## Next Steps

1. Connect to your backend API
2. Test the complete auth flow
3. Add password reset functionality
4. Implement biometric authentication
5. Add social login (Google, Apple, Facebook)
6. Build user profile management
7. Add role-based access control

See [PHASE_1_IMPLEMENTATION.md](./PHASE_1_IMPLEMENTATION.md) for detailed documentation.

See [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) for Phase 2+ planning.
