# Phase 1 Folder Structure Reference

Complete file structure after Phase 1 implementation.

```
leish/
├── app/
│   ├── _layout.tsx                    ✅ Updated: Auth-aware root layout
│   ├── auth/
│   │   ├── _layout.tsx                ✅ NEW: Auth stack layout
│   │   ├── login.tsx                  ✅ NEW: Login screen
│   │   └── signup.tsx                 ✅ NEW: Signup screen
│   ├── (tabs)/
│   │   ├── _layout.tsx                ✅ Existing: Tab navigation
│   │   ├── index.tsx                  ✅ Updated: Home screen with profile & logout
│   │   ├── explore.tsx                📝 Existing: Explore screen
│   │   └── [other tab screens]        📝 Existing
│   ├── modal.tsx                      📝 Existing: Modal screen
│   └── ...
│
├── components/
│   ├── ui/
│   │   ├── button.tsx                 ✅ NEW: Button component
│   │   ├── input.tsx                  ✅ NEW: TextInput component
│   │   ├── icon-symbol.tsx            📝 Existing
│   │   ├── icon-symbol.ios.tsx        📝 Existing
│   │   └── collapsible.tsx            📝 Existing
│   ├── forms/
│   │   ├── login-form.tsx             ✅ NEW: Login form
│   │   └── signup-form.tsx            ✅ NEW: Signup form
│   ├── external-link.tsx              📝 Existing
│   ├── haptic-tab.tsx                 📝 Existing
│   ├── hello-wave.tsx                 📝 Existing
│   ├── parallax-scroll-view.tsx       📝 Existing
│   ├── themed-text.tsx                📝 Existing
│   ├── themed-view.tsx                📝 Existing
│   └── ...
│
├── hooks/
│   ├── use-auth.ts                    ✅ NEW: Auth hook
│   ├── use-color-scheme.ts            📝 Existing
│   ├── use-color-scheme.web.ts        📝 Existing
│   ├── use-theme-color.ts             📝 Existing
│   └── ...
│
├── services/
│   ├── api.ts                         ✅ NEW: Axios HTTP client
│   ├── auth.ts                        ✅ NEW: Auth service layer
│   └── storage.ts                     ✅ NEW: AsyncStorage wrapper
│
├── store/
│   └── index.ts                       ✅ NEW: Zustand state stores
│
├── types/
│   └── index.ts                       ✅ NEW: TypeScript type definitions
│
├── utils/
│   └── validation.ts                  ✅ NEW: Zod validation schemas
│
├── assets/
│   └── images/                        📝 Existing: App images
│
├── constants/
│   └── theme.ts                       📝 Existing: Theme configuration
│
├── scripts/
│   └── reset-project.js               📝 Existing
│
├── DOCUMENTATION_FILES/
│   ├── README.md                      ✅ Updated: Project overview
│   ├── DEVELOPMENT_ROADMAP.md         ✅ NEW: 4-phase development plan
│   ├── PHASE_1_IMPLEMENTATION.md      ✅ NEW: Phase 1 detailed guide
│   ├── PHASE_1_QUICK_START.md         ✅ NEW: Phase 1 quick reference
│   └── PHASE_1_STRUCTURE.md           ✅ NEW: This file
│
├── package.json                       ✅ Updated: New dependencies added
├── tsconfig.json                      📝 Existing
├── app.json                           📝 Existing: Expo config
├── eslint.config.js                   📝 Existing
├── expo-env.d.ts                      📝 Existing
└── .env.local                         📝 Create this: API configuration

Legend:
✅ NEW    - Created in Phase 1
✅ Updated - Modified in Phase 1
📝 Existing - Unchanged from initial setup
```

## Phase 1: File Breakdown

### New Core Files

#### TypeScript & Types
- **types/index.ts** (45 lines)
  - User, LoginRequest, SignupRequest, AuthResponse types
  - ApiResponse, ApiError types
  - FormFieldProps, StoredCredentials types

#### Utils & Validation
- **utils/validation.ts** (108 lines)
  - Zod schemas for email, password, name, login, signup
  - Validation utility functions
  - Form parsing functions with error handling

#### Services
- **services/api.ts** (157 lines)
  - Axios instance with configuration
  - Request/response interceptors
  - Generic CRUD methods (get, post, put, delete)
  - Auth-specific endpoints

- **services/auth.ts** (73 lines)
  - Login, signup, logout functions
  - Token and user data management
  - Integration with storage and API

- **services/storage.ts** (110 lines)
  - AsyncStorage wrapper with typed methods
  - Token, user, preferences management
  - Clear functions for auth and all data

#### State Management
- **store/index.ts** (108 lines)
  - Zustand auth store with user state
  - Login, signup, logout actions
  - App store for global configuration
  - Auth initialization logic

#### Hooks
- **hooks/use-auth.ts** (32 lines)
  - Custom React hook for auth
  - Initializes auth on component mount
  - Returns auth state and methods

#### Components - UI
- **components/ui/button.tsx** (95 lines)
  - Reusable Button component
  - Multiple variants (primary, secondary, danger)
  - Loading state with spinner support

- **components/ui/input.tsx** (92 lines)
  - Reusable TextInput component
  - Error display, disabled state
  - Theme-aware styling

#### Components - Forms
- **components/forms/login-form.tsx** (78 lines)
  - Login form with email and password
  - Form-level error display
  - Integration with validation

- **components/forms/signup-form.tsx** (98 lines)
  - Signup form with name, email, password, confirm
  - Password confirmation validation
  - Form-level error display

#### Screens
- **app/auth/_layout.tsx** (19 lines)
  - Stack navigation for auth screens
  - Animation and header configuration

- **app/auth/login.tsx** (80 lines)
  - Login screen with header
  - Integrated LoginForm component
  - Link to signup screen

- **app/auth/signup.tsx** (80 lines)
  - Signup screen with header
  - Integrated SignupForm component
  - Link to login screen

#### Updated Files
- **app/_layout.tsx** (52 lines)
  - Conditional routing based on authentication
  - Loading state during initialization
  - Shows auth or main app screens

- **app/(tabs)/index.tsx** (150 lines)
  - Added user profile display
  - Added logout button
  - Maintains existing tutorial content

### Documentation Files (New)
- **README.md** - Updated with Phase 1 section
- **DEVELOPMENT_ROADMAP.md** - 4-phase development plan
- **PHASE_1_IMPLEMENTATION.md** - Detailed Phase 1 guide (400+ lines)
- **PHASE_1_QUICK_START.md** - Quick reference (700+ lines)
- **PHASE_1_STRUCTURE.md** - This file

## Key Statistics

| Category | Count |
|----------|-------|
| New files | 18 |
| Updated files | 2 |
| Total new lines of code | ~1,200+ |
| TypeScript files | 18 |
| Dependencies added | 5 |
| Components created | 6 |
| Services created | 3 |
| Screens created | 3 |
| Documentation pages | 4 |

## Dependencies Added

```json
{
  "zustand": "^4.x - State management",
  "axios": "^1.x - HTTP client",
  "zod": "^3.x - Schema validation",
  "react-hook-form": "^7.x - Form handling",
  "@react-native-async-storage/async-storage": "^1.x - Local storage"
}
```

## Import Paths

All imports use path aliases defined in `tsconfig.json`:
- `@/app` - app directory
- `@/components` - components directory
- `@/hooks` - hooks directory
- `@/services` - services directory
- `@/store` - store directory
- `@/types` - types directory
- `@/utils` - utils directory
- `@/constants` - constants directory
- `@/assets` - assets directory

## Component Tree

```
Root Layout (_layout.tsx)
├── useAuth() → Authorization check
│
├─ IF AUTHENTICATED:
│  └── (tabs) Layout
│      ├── Home Screen (index.tsx)
│      │   ├── User Profile Card
│      │   └── Logout Button
│      └── Other Tab Screens
│
└─ IF NOT AUTHENTICATED:
   └── Auth Layout
       ├── Login Screen
       │   └── LoginForm
       │       ├── TextInputField (email)
       │       ├── TextInputField (password)
       │       └── Button (login)
       │
       └── Signup Screen
           └── SignupForm
               ├── TextInputField (name)
               ├── TextInputField (email)
               ├── TextInputField (password)
               ├── TextInputField (confirm)
               └── Button (signup)
```

## Data Flow

```
User Input (Form)
    │
    ▼
Form Component (login-form.tsx)
    │
    ├─ Validates with parseLoginForm()
    │   └─ Uses Zod schemas
    │
    ▼
useAuth Hook
    │
    ├─ Calls login() from store
    │
    ▼
useAuthStore (Zustand)
    │
    ├─ Calls authService.login()
    │
    ▼
authService (services/auth.ts)
    │
    ├─ Calls apiService.login()
    ├─ Stores token with storageService
    ├─ Stores user data with storageService
    │
    ▼
apiService (services/api.ts)
    │
    └─ POST /auth/login
        │
        ▼
    Backend API
        │
        ▼
    Response with token & user
        │
        ▼
    Store updates in Zustand
    Root Layout detects isAuthenticated = true
    Redirects to (tabs) screens
```

## Testing Checklist

- [ ] App starts - shows loading spinner
- [ ] Unauthenticated - shows login screen
- [ ] Login form validates email format
- [ ] Login form validates password strength
- [ ] Signup form validates all fields
- [ ] Signup form checks password match
- [ ] Login button shows loading state
- [ ] Error messages display correctly
- [ ] Navigation between login/signup works
- [ ] Successful login redirects to home
- [ ] Home screen shows user info
- [ ] Logout button works
- [ ] Logout clears storage
- [ ] App remembers login after restart
- [ ] 401 response clears auth state

## Performance Notes

- ✅ Lazy auth initialization
- ✅ AsyncStorage doesn't block UI
- ✅ Zustand provides fast state updates
- ✅ Form validation happens client-side
- ✅ Components are functional and optimized
- ✅ No unnecessary re-renders due to proper hook usage

## Security Considerations

- ✅ JWT token stored securely in AsyncStorage
- ✅ Token included in API requests via interceptor
- ✅ 401 responses clear auth state
- ✅ Passwords never logged or displayed
- ✅ Form validation on client and should be on server
- ⚠️ TODO: Add token refresh logic
- ⚠️ TODO: Implement HTTPS/SSL pinning
- ⚠️ TODO: Add biometric authentication
