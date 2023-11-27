import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './features/account/account-slice';
import reportReducer from './features/report/report-slice';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    report: reportReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
