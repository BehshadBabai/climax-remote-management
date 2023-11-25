import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AccountType = 'manager' | 'supervisor';
export type ReportsViewType = 'list' | 'card';
export type AccountInfo = {
  name: string;
  email: string;
};

export type AccountState = {
  type: AccountType;
  loggedIn: boolean;
  info: AccountInfo;
  view: ReportsViewType;
};

const initialState: AccountState = {
  loggedIn: false,
  type: 'manager',
  info: { name: '', email: '' },
  view: 'card'
};

const accountSlice = createSlice({
  name: 'account',
  initialState: initialState,
  reducers: {
    changeLoggedIn(state, action: PayloadAction<boolean>) {
      state.loggedIn = action.payload;
    },
    changeType(state, action: PayloadAction<AccountType>) {
      state.type = action.payload;
    },
    changeReportsViewType(state, action: PayloadAction<ReportsViewType>) {
      state.view = action.payload;
    },
    changeInfo(state, action: PayloadAction<AccountInfo>) {
      state.info = action.payload;
    }
  }
});

export const { changeLoggedIn, changeType, changeReportsViewType, changeInfo } =
  accountSlice.actions;
export default accountSlice.reducer;
