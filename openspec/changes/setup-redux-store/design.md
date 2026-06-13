# Design: Redux Setup & Slices

## Architecture Overview

We will establish a central Redux store with typed hooks and persistent state for authentication. The directory structure will look like this:

```text
src/
└── store/
    ├── index.ts        # Store configuration and root reducer
    ├── hooks.ts        # Typed useAppDispatch and useAppSelector
    └── slices/
        ├── authSlice.ts # Auth state and actions
        └── uiSlice.ts   # UI state and actions
```

## Details

### 1. Store Configuration (`index.ts`)
- Combine reducers for `auth` and `ui`.
- Wrap the root reducer (or just the auth reducer) with `persistReducer` using `redux-persist/lib/storage`.
- Configure the store with `configureStore` and ignore serializable checks for `redux-persist` actions (`FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER`).
- Export `RootState` and `AppDispatch` types.

### 2. Typed Hooks (`hooks.ts`)
- Use `useDispatch` and `useSelector` from `react-redux`.
- Export `useAppDispatch: () => AppDispatch` and `useAppSelector: TypedUseSelectorHook<RootState>`.

### 3. Slices
**`authSlice.ts`**
- **State**: `{ user: User | null, token: string | null, isAuthenticated: boolean }`
- **Actions**: `login(payload)`, `logout()`, `updateToken(token)`
- **Behavior**: Setting login updates user/token and sets `isAuthenticated` to true.

**`uiSlice.ts`**
- **State**: `{ sidebarOpen: boolean, theme: 'light' | 'dark' | 'system' }`
- **Actions**: `toggleSidebar()`, `setSidebar(isOpen)`, `setTheme(theme)`

### 4. Application Integration (`main.tsx`)
- Wrap the `<App />` component in a `<Provider store={store}>`.
- Inside the Provider, add `<PersistGate loading={null} persistor={persistor}>`.
- The `PersistGate` ensures that the UI won't render until the auth token is successfully rehydrated from `localStorage`.
