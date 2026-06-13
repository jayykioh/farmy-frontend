# Tasks: Redux Setup & Slices

## 1. Setup & Dependencies
- [x] Install Redux Toolkit and React Redux: `npm install @reduxjs/toolkit react-redux`
- [x] Install Redux Persist: `npm install redux-persist`
- [x] Install types if needed: `npm install -D @types/react-redux` (Note: RTK includes types, but sometimes react-redux types are needed depending on the version)

## 2. Implement Slices
- [x] Create `src/store/slices/authSlice.ts`
  - Define `AuthState` interface.
  - Implement `login`, `logout`, and `updateToken` reducers.
- [x] Create `src/store/slices/uiSlice.ts`
  - Define `UIState` interface.
  - Implement `toggleSidebar`, `setSidebar`, and `setTheme` reducers.

## 3. Configure Store & Hooks
- [x] Create `src/store/index.ts`
  - Combine reducers.
  - Configure `redux-persist` with `localStorage` for the `auth` slice.
  - Create the Redux store with `configureStore` and handle serializable checks middleware.
  - Export `RootState` and `AppDispatch` types.
  - Export `persistor`.
- [x] Create `src/store/hooks.ts`
  - Export typed `useAppDispatch` and `useAppSelector`.

## 4. Integrate with Application
- [x] Update `src/main.tsx` (or `src/App.tsx` depending on routing setup)
  - Import `Provider` from `react-redux` and `PersistGate` from `redux-persist/integration/react`.
  - Import `store` and `persistor` from `src/store`.
  - Wrap the main application component tree with `<Provider store={store}>` and `<PersistGate loading={null} persistor={persistor}>`.
