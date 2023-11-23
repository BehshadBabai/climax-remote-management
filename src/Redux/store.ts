import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './features/account/account-slice';
import appReducer from './features/app/app-slice';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    app: appReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
