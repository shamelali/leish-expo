# Welcome to Leish 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app). It's built with TypeScript, Expo Router for file-based routing, and React Navigation for seamless navigation.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Project Structure

### Core Files

- **app.json**: Expo app configuration (name, version, icons, splash screen, etc.)
- **app.tsx** (via expo-router/entry): Entry point that loads the root layout
- **tsconfig.json**: TypeScript configuration
- **package.json**: Dependencies and scripts

### Directory Overview

#### `app/` - File-Based Routing (Expo Router)

This directory contains the app's navigation structure using [Expo Router](https://docs.expo.dev/router/introduction):

- **_layout.tsx**: Root layout that wraps the entire app with navigation providers (theme, status bar)
- **modal.tsx**: Modal screen accessible from other routes
- **(tabs)/_layout.tsx**: Bottom tab navigation layout defining the main tab structure
- **(tabs)/index.tsx**: Home screen (first tab)
- **(tabs)/explore.tsx**: Explore screen (second tab)

The `(tabs)` folder uses route groups to manage tab-based navigation. Each screen file automatically becomes a route.

#### `components/` - Reusable UI Components

Organized into two categories:

**Base Components** (Theme-aware):

- **themed-text.tsx**: Text component with light/dark mode support. Supports variants: `default`, `title`, `defaultSemiBold`, `subtitle`, `link`
- **themed-view.tsx**: View container with theme-aware styling
- **parallax-scroll-view.tsx**: Animated scroll view with parallax effect
- **hello-wave.tsx**: Welcome/greeting component with wave animation

**Feature Components**:

- **external-link.tsx**: Opens external URLs with browser integration
- **haptic-tab.tsx**: Tab bar button with haptic feedback

**UI Subcomponents** (`ui/` folder):

- **collapsible.tsx**: Expandable/collapsible section component
- **icon-symbol.tsx**: Cross-platform icon rendering (SF Symbols on iOS, Material icons on Android)
- **icon-symbol.ios.tsx**: iOS-specific SF Symbols wrapper

#### `constants/` - App Configuration

- **theme.ts**: Centralized theme definitions including colors, spacing, and typography for light/dark modes

#### `hooks/` - Custom React Hooks

- **use-color-scheme.ts**: Detects and manages system color scheme (light/dark)
- **use-color-scheme.web.ts**: Web-specific color scheme implementation
- **use-theme-color.ts**: Hook to access theme colors throughout the app with fallback support

#### `assets/` - Static Resources

- **images/**: Stores app images, icons, and other visual assets

#### `scripts/` - Build & Setup Scripts

- **reset-project.js**: Utility to reset the project to a clean state for development

### Key Technologies

- **Expo Router**: File-based routing system (replaces manual navigation setup)
- **React Navigation**: Native navigation with tab bar, stack, and drawer support
- **TypeScript**: Type-safe development throughout the app
- **Expo Vector Icons**: Large icon library including Material and Feather icons
- **Haptics**: Native haptic feedback support
- **Theme System**: Light/dark mode with automatic system preference detection

## Component Usage Patterns

### Using Themed Components

```tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function MyScreen() {
  return (
    <ThemedView>
      <ThemedText type="title">Welcome!</ThemedText>
      <ThemedText>This adapts to light/dark mode automatically</ThemedText>
    </ThemedView>
  );
}
```

### Creating New Screens

Add new files in `app/` or `app/(tabs)/`:

```tsx
// app/new-screen.tsx
import { Stack } from 'expo-router';
import { ThemedText } from '@/components/themed-text';

export default function NewScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'New Screen' }} />
      <ThemedText>Your content here</ThemedText>
    </>
  );
}
```

### Using Hooks for Theme Access

```tsx
import { useThemeColor } from '@/hooks/use-theme-color';

export function CustomComponent() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  // Use colors in your styles
}
```

## Styling Approach

The app uses React Native's `StyleSheet` API with theme-aware components. Colors are centralized in `constants/theme.ts` and accessed via the `useThemeColor` hook, ensuring consistent theming across the app.

## Get a fresh project

When you're ready to start fresh, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory.

## Development Roadmap

See [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) for a comprehensive plan covering:

- **Phase 1**: Core features & infrastructure (data management, auth, forms)
- **Phase 2**: Feature development & UI expansion
- **Phase 3**: Testing, optimization, accessibility, and deployment
- **Phase 4**: Advanced features, real-time capabilities, monetization

The roadmap includes architecture guidelines, file organization patterns, best practices, and recommended libraries.

## Phase 1: Core Infrastructure ✅ Complete

**See [PHASE_1_IMPLEMENTATION.md](./PHASE_1_IMPLEMENTATION.md) for detailed documentation.**

### What's Been Implemented

**State Management**

- Zustand store for authentication state
- Global app configuration store
- Automatic auth initialization on app load

**Authentication System**

- Login & signup screens with full validation
- JWT token management and storage
- Automatic logout on 401 responses
- User profile display on home screen
- Protected routing (auth vs. app screens)

**API Integration**

- Axios HTTP client with interceptors
- Automatic token injection in requests
- Error handling and status code management
- Generic GET/POST/PUT/DELETE methods
- Auth-specific service layer

**Local Storage**

- AsyncStorage wrapper with typed methods
- Secure token and user data storage
- App preference management
- Utility functions for common operations

**Form System**

- Reusable TextInput and Button components
- Complete form validation with Zod
- Login and signup form components
- Per-field error display
- Loading states and disabled handling

**TypeScript Types**

- User and authentication types
- API response/error types
- Form data types with validation

### Key Features

- ✅ Complete authentication flow (login/signup/logout)
- ✅ Protected routes - conditionally show auth or app screens
- ✅ Persistent sessions using AsyncStorage
- ✅ Form validation with helpful error messages
- ✅ Loading states and error handling
- ✅ Theme-aware UI components
- ✅ TypeScript support throughout

### Files Created

- **Services**: `api.ts`, `auth.ts`, `storage.ts`
- **Store**: `index.ts` (Zustand stores)
- **Types**: `index.ts`
- **Utils**: `validation.ts` (Zod schemas)
- **Components**: `button.tsx`, `input.tsx`, `login-form.tsx`, `signup-form.tsx`
- **Screens**: `auth/login.tsx`, `auth/signup.tsx`, `auth/_layout.tsx`
- **Hooks**: `use-auth.ts`
- **Configuration**: Updated root layout for conditional routing

### Dependencies Added

```bash
npm install zustand react-hook-form zod axios @react-native-async-storage/async-storage
```

## Phase 2: Feature Development ✅ Complete

**See [PHASE_2_IMPLEMENTATION.md](./PHASE_2_IMPLEMENTATION.md) for detailed documentation.**

### What's Been Implemented

**Expanded UI Component Library**
- Card & ListCard components for data display
- Loader & Skeleton components for loading states
- EmptyState component for no-data scenarios
- Error & ErrorBoundary components for error handling
- Toast & ToastManager for notifications
- Modal dialog component for user confirmations

**Data Fetching & Async Operations**
- `useAsync` hook for GET requests with refetch
- `useMutation` hook for POST/PUT/DELETE operations
- Automatic loading, error, and success states
- Built-in retry and callback support

**Feature Screens**
- Settings tab with profile and app settings
- Profile edit screen with form handling
- Feature-based folder organization
- Settings navigation to profile editor

**Utility Functions**
- Error handling utilities (AppError, getErrorMessage)
- Formatting utilities (dates, currency, text)
- Network and auth error detection
- Validation error handling

**Navigation Enhancements**
- Added Settings tab to main navigation
- Feature stacks for profile management
- Improved navigation patterns and structure

### Files Created (15+ new files)

**UI Components**: card.tsx, loader.tsx, empty-state.tsx  
**Feedback**: error.tsx, toast.tsx, modal.tsx  
**Hooks**: use-async.ts  
**Features**: profile/edit.tsx, profile/_layout.tsx, (tabs)/settings.tsx  
**Utils**: errors.ts, formatting.ts  
**Documentation**: PHASE_2_IMPLEMENTATION.md

### Key Features

- ✅ Reusable UI components for common patterns
- ✅ Loading skeletons and empty states
- ✅ Error boundaries and error display
- ✅ Toast notifications  
- ✅ Modal dialogs for confirmations
- ✅ Easy data fetching (useAsync/useMutation)
- ✅ Settings and profile management
- ✅ User-friendly error messages
- ✅ Text formatting utilities

### Component Usage Examples

**Loading Data**:
```typescript
const { data, loading, error, refetch } = useAsync(
  () => apiService.get('/data')
);
```

**Mutation (Create/Update/Delete)**:
```typescript
const { mutate, loading } = useMutation(
  (data) => apiService.post('/items', data)
);
await mutate({ name: 'New Item' });
```

**Empty State**:
```typescript
<EmptyState
  title="No items"
  description="Create your first item"
  action={{ title: 'Create', onPress: () => navigate('create') }}
  fullScreen
/>
```

**Error Display**:
```typescript
<Error
  message={error}
  onRetry={() => refetch()}
/>
```

### Next Steps

Phase 3 will add:

- Unit and integration testing
- Performance optimization and bundle analysis
- Accessibility (a11y) improvements
- Analytics and error tracking (Sentry)

For more information, see [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md).

## Learn more

To learn more about developing your project with Expo:

- [Expo documentation](https://docs.expo.dev/): Fundamentals and advanced guides
- [Expo Router documentation](https://docs.expo.dev/router/introduction/): File-based routing deep dive
- [React Navigation documentation](https://reactnavigation.org/): Navigation patterns and APIs
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Step-by-step guide

## Join the community

- [Expo on GitHub](https://github.com/expo/expo): View source and contribute
- [Discord community](https://chat.expo.dev): Chat with other Expo developers
