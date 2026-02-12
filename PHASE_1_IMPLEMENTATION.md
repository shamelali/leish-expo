# Phase 1: Core Infrastructure Implementation Guide

## ✅ Completed Components

This document details all the Phase 1 infrastructure that has been implemented for the Leish application.

---

## 1. Data Management Layer

### 1.1 State Management (Zustand)

**Location**: [store/index.ts](../store/index.ts)

**Includes**:
- `useAuthStore` - Authentication state management
  - `user` - Current authenticated user
  - `token` - JWT authentication token
  - `isLoading` - Loading state for async operations
  - `isInitialized` - Whether auth has been initialized
  - `error` - Error messages

- `useAppStore` - Global app configuration
  - `apiUrl` - API endpoint configuration
  - `theme` - Theme preference (light/dark/auto)
  - `language` - Language setting

**Usage**:
```typescript
import { useAuthStore } from '@/store';

const { user, token, login, logout } = useAuthStore();
```

### 1.2 API Integration

**Location**: [services/api.ts](../services/api.ts)

**Features**:
- Axios instance with automatic token injection
- Request/response interceptors
- Error handling and status code management
- 401 unauthorized handling (clears local auth)
- Generic GET, POST, PUT, DELETE methods
- Auth-specific endpoints (login, signup, logout, getCurrentUser, refreshToken)

**Configuration**:
```typescript
// Set via environment variable
EXPO_PUBLIC_API_URL=https://api.example.com
```

**Usage**:
```typescript
import { apiService } from '@/services/api';

const response = await apiService.login(email, password);
const data = await apiService.get('/endpoint');
```

### 1.3 Local Storage

**Location**: [services/storage.ts](../services/storage.ts)

**Features**:
- AsyncStorage wrapper with typed methods
- Utilities for auth data, user data, and preferences
- Clear auth and clear all functions
- Namespaced keys to prevent conflicts

**Available Methods**:
- `setAuthToken(token)` - Store JWT token
- `getAuthToken()` - Retrieve JWT token
- `removeAuthToken()` - Clear JWT token
- `setUserData(userData)` - Store user object
- `getUserData()` - Retrieve user object
- `setPreference(key, value)` - Store app preferences
- `getPreference(key)` - Get preference value
- `clearAuth()` - Clear all auth data
- `clearAll()` - Clear everything

**Usage**:
```typescript
import { storageService } from '@/services/storage';

await storageService.setAuthToken(token);
const token = await storageService.getAuthToken();
```

---

## 2. Authentication System

### 2.1 Auth Service

**Location**: [services/auth.ts](../services/auth.ts)

**Methods**:
- `login(email, password)` - Login and store credentials
- `signup(email, password, name)` - Create account and store credentials
- `logout()` - Clear auth state locally and API-side
- `getCurrentUser()` - Fetch current user from API
- `isAuthenticated()` - Check if token exists
- `getStoredUser()` - Get cached user data

### 2.2 Auth Hook

**Location**: [hooks/use-auth.ts](../hooks/use-auth.ts)

**Provides**:
- `user` - Current user object
- `token` - JWT token
- `isLoading` - Loading state
- `isInitialized` - Auth initialization complete
- `ready` - Hook is ready to use
- `isAuthenticated` - Boolean auth status
- `error` - Error message
- `login(email, password)` - Trigger login
- `signup(email, password, name)` - Trigger signup
- `logout()` - Trigger logout
- `clearError()` - Clear error state

**Usage**:
```typescript
import { useAuth } from '@/hooks/use-auth';

const { user, login, isLoading, error } = useAuth();

await login(email, password);
```

### 2.3 Auth Screens

**Login Screen**: [app/auth/login.tsx](../app/auth/login.tsx)
- Email and password input fields
- Form validation with error display
- Link to signup screen
- Loading state feedback

**Signup Screen**: [app/auth/signup.tsx](../app/auth/signup.tsx)
- Full name, email, password, confirm password inputs
- Comprehensive validation
- Link to login screen
- Loading state feedback

**Auth Layout**: [app/auth/_layout.tsx](../app/auth/_layout.tsx)
- Stack navigation for login/signup screens
- Header and animation configuration

---

## 3. Form System

### 3.1 Validation Utilities

**Location**: [utils/validation.ts](../utils/validation.ts)

**Schemas** (using Zod):
- `emailSchema` - Email validation
- `passwordSchema` - Strong password validation (8+ chars, uppercase, lowercase, number)
- `nameSchema` - Name validation (2-50 chars)
- `loginSchema` - Login form validation
- `signupSchema` - Signup form with password confirmation

**Utility Functions**:
- `validateEmail(email)` - Validate single email
- `validatePassword(password)` - Validate single password
- `validateName(name)` - Validate single name
- `parseLoginForm(data)` - Parse and validate login form
- `parseSignupForm(data)` - Parse and validate signup form

**Exported Types**:
- `LoginFormData` - Typed login form data
- `SignupFormData` - Typed signup form data

### 3.2 Form Components

**TextInputField**: [components/ui/input.tsx](../components/ui/input.tsx)
- Labeled text input with error display
- Support for email, password, numeric inputs
- Disabled state
- Multiline support
- Theme-aware styling

**Button**: [components/ui/button.tsx](../components/ui/button.tsx)
- Multiple variants (primary, secondary, danger)
- Multiple sizes (small, medium, large)
- Loading state with spinner
- Disabled state
- Theme-aware colors

**LoginForm**: [components/forms/login-form.tsx](../components/forms/login-form.tsx)
- Email and password inputs
- Form-level error display
- Integration with validation
- Loading state management

**SignupForm**: [components/forms/signup-form.tsx](../components/forms/signup-form.tsx)
- Full name, email, password, confirm password inputs
- Password confirmation validation
- Form-level error display
- Loading state management

---

## 4. TypeScript Types

**Location**: [types/index.ts](../types/index.ts)

**User & Auth**:
- `User` - User object structure
- `LoginRequest` - Login API request
- `SignupRequest` - Signup API request
- `AuthResponse` - Auth API response

**API**:
- `ApiResponse<T>` - Generic API response wrapper
- `ApiError` - Error response structure

**Forms**:
- `FormFieldProps` - Reusable form field properties

**Storage**:
- `StoredCredentials` - Stored credentials structure

---

## 5. Navigation & Routing

### 5.1 Conditional Authentication Routing

**Location**: [app/_layout.tsx](../app/_layout.tsx)

**Features**:
- Checks authentication state before rendering
- Shows loading spinner during initialization
- Renders auth screens when not authenticated
- Renders main app when authenticated
- Automatic redirect based on auth status

**Flow**:
1. App loads → check auth store
2. If loading → show spinner
3. If authenticated → show (tabs) navigation
4. If not authenticated → show auth screens

---

## 6. Enhanced Home Screen

**Location**: [app/(tabs)/index.tsx](../app/(tabs)/index.tsx)

**Features**:
- Displays logged-in user information
- Shows user name and email
- Logout button with loading state
- Integrated with auth hook
- Maintains existing UI tutorial content

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    App Root Layout                      │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  useAuth() Hook - Read auth state                 │ │
│  │  ├─ isAuthenticated → show (tabs) or auth screens │ │
│  │  └─ isLoading → show spinner                      │ │
│  └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┬─┘
                                                         │
                    ┌────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
   ┌────▼─────┐          ┌─────▼──────┐
   │   Auth    │          │  Main App  │
   │  Screens  │          │  (tabs)    │
   │           │          │            │
   │ ┌───────┐ │          │ ┌────────┐ │
   │ │ Login │ │          │ │ Home   │ │
   │ └───────┘ │          │ ├────────┤ │
   │ ┌───────┐ │          │ │Explore │ │
   │ │Signup │ │          │ └────────┘ │
   │ └───────┘ │          │            │
   └───────────┘          └────────────┘
        │                      │
        └──────────┬───────────┘
                   │
        ┌──────────▼────────────┐
        │    useAuthStore       │
        │  (Zustand State)      │
        │                       │
        │ ├─ user              │
        │ ├─ token             │
        │ ├─ isLoading         │
        │ ├─ login()           │
        │ ├─ signup()          │
        │ └─ logout()          │
        └──────────┬────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    ┌───▼──────┐        ┌────▼────┐
    │ apiService│       │ Storage  │
    │           │       │  Service │
    │ ├─ login()        │          │
    │ ├─ signup()       │ ├─ Token │
    │ ├─ logout()       │ ├─ User  │
    │ └─ get/post(...)  │ └─ Prefs │
    └───────────┘       └──────────┘
```

---

## Usage Examples

### Login Flow

```typescript
import { useAuth } from '@/hooks/use-auth';

function LoginComponent() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // User will be redirected automatically by root layout
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <LoginForm onSubmit={handleLogin} loading={isLoading} error={error} />
  );
}
```

### Using API Service

```typescript
import { apiService } from '@/services/api';

// Generic request
const users = await apiService.get('/users');

// With error handling
try {
  const user = await apiService.post('/users', userData);
} catch (error) {
  console.error('API error:', error.message);
}
```

### Form Validation

```typescript
import { parseLoginForm, validateEmail } from '@/utils/validation';

// Validate single field
const { valid, error } = validateEmail('user@example.com');

// Validate entire form
try {
  const validData = parseLoginForm({ email, password });
  // Use validData...
} catch (errors) {
  // Handle validation errors
  console.error(errors); // { email: 'Invalid email', password: '...' }
}
```

### Local Storage

```typescript
import { storageService } from '@/services/storage';

// Save token after login
await storageService.setAuthToken(token);

// Retrieve on app start
const savedToken = await storageService.getAuthToken();

// Save user preferences
await storageService.setPreference('theme', 'dark');
const theme = await storageService.getPreference('theme');
```

---

## Environment Variables

Create a `.env.local` file:
```
EXPO_PUBLIC_API_URL=https://your-api.com
```

Or in `app.json` for Expo-specific config:
```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://your-api.com"
    }
  }
}
```

---

## File Structure Summary

```
leish/
├── app/
│   ├── _layout.tsx                    # Root layout with auth routing
│   ├── auth/
│   │   ├── _layout.tsx                # Auth stack layout
│   │   ├── login.tsx                  # Login screen
│   │   └── signup.tsx                 # Signup screen
│   ├── (tabs)/
│   │   ├── index.tsx                  # Home screen (with profile)
│   │   └── ...
│
├── components/
│   ├── ui/
│   │   ├── button.tsx                 # Button component
│   │   └── input.tsx                  # TextInput component
│   ├── forms/
│   │   ├── login-form.tsx             # Login form component
│   │   └── signup-form.tsx            # Signup form component
│   └── ...
│
├── hooks/
│   ├── use-auth.ts                    # Auth hook
│   └── ...
│
├── services/
│   ├── api.ts                         # API client (axios)
│   ├── auth.ts                        # Auth service
│   └── storage.ts                     # Storage service
│
├── store/
│   └── index.ts                       # Zustand stores
│
├── types/
│   └── index.ts                       # TypeScript types
│
├── utils/
│   └── validation.ts                  # Form validation (Zod)
│
└── ...
```

---

## Key Dependencies Added

- **zustand** - State management
- **axios** - HTTP client
- **zod** - Schema validation
- **react-hook-form** - Form handling (ready for Phase 2)
- **@react-native-async-storage/async-storage** - Local storage

---

## Next Steps (Phase 2)

1. **API Integration**: Connect to actual backend API
2. **Error Handling**: Enhanced error boundaries and retry logic
3. **Additional Screens**: Profile, settings, data management screens
4. **Advanced Forms**: Multi-step forms, date pickers, file uploads
5. **Real-time Features**: WebSockets, push notifications
6. **Testing**: Unit tests, integration tests, E2E tests

---

## Common Tasks

### Add a Protected API Endpoint

```typescript
// In services/api.ts
async getProfile() {
  try {
    return await this.get('/user/profile');
  } catch (error) {
    throw this.handleError(error);
  }
}
```

### Create a New Form

1. Define validation schema in `utils/validation.ts`
2. Create form component in `components/forms/`
3. Integrate validation in form component
4. Use in screen with `useAuth()` or similar hook

### Add New Auth Store Action

```typescript
// In store/index.ts
resetPassword: async (email: string) => {
  set({ isLoading: true });
  try {
    await authService.resetPassword(email);
    set({ isLoading: false });
  } catch (error: any) {
    set({ error: error?.message, isLoading: false });
  }
}
```

---

## Troubleshooting

### Auth State Not Persisting
- Check that `storageService` methods are working
- Verify AsyncStorage is properly initialized
- Check for storage permission errors

### API Requests Failing
- Verify `EXPO_PUBLIC_API_URL` is set correctly
- Check Authorization header in network tab
- Ensure token is being stored/retrieved correctly

### Form Validation Not Working
- Verify Zod schema is correctly defined
- Check error object structure in form component
- Ensure `parseLoginForm`/`parseSignupForm` is being called

---

## Resources

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Axios Documentation](https://axios-http.com/)
- [Zod Documentation](https://zod.dev/)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
