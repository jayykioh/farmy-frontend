import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import { baseApi } from './api/baseApi';

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const createLocalStorage = () => {
  return {
    getItem(key: string) {
      return Promise.resolve(window.localStorage.getItem(key));
    },
    setItem(key: string, value: any) {
      window.localStorage.setItem(key, value);
      return Promise.resolve(value);
    },
    removeItem(key: string) {
      window.localStorage.removeItem(key);
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== 'undefined' ? createLocalStorage() : createNoopStorage();

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'], // Only persist auth slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
