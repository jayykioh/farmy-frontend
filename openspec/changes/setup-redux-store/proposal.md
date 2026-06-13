# Proposal: Add Redux Toolkit & Persist Setup

## Problem
The application currently lacks a robust global state management solution for complex client-side state. Specifically, managing user authentication state, session persistence, and global UI state (like sidebars or themes) requires a centralized approach that scales well as the application grows. While `zustand` is present in dependencies, the requirements specifically call for slices, `PersistGate`, and typed hooks, pointing towards Redux.

## Solution
Implement Redux Toolkit (RTK) along with Redux Persist for state management. This change will:
- Introduce an `authSlice` to manage authentication tokens and user information securely.
- Introduce a `uiSlice` to handle global UI state toggles.
- Use `redux-persist` and `PersistGate` to ensure that authentication state survives page reloads.
- Provide custom typed hooks (`useAppDispatch`, `useAppSelector`) to ensure type safety throughout the codebase.

## Value
- **Reliable State Persistence**: `PersistGate` ensures the app waits for local storage to rehydrate before rendering, preventing flicker or incorrect unauthorized redirects.
- **Type Safety**: Typed hooks remove the need to constantly declare types for dispatch and state in components.
- **Scalability**: Redux slices provide a clear structure for adding more complex state (like `diary` or `plant_scan` slices) in the future.

## Open Questions
- Do we want to uninstall `zustand` to keep our dependency tree clean, or is it still being used for any specific components?
- Which storage engine should `redux-persist` use? We'll default to `localStorage` for now.
