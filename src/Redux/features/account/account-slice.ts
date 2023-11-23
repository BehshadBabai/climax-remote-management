import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AccountType = 'manager' | 'supervisor';
export type ReportsViewType = 'list' | 'card';

export type AccountState = {
  type: AccountType;
  loggedIn: boolean;
  view: ReportsViewType;
};

const initialState: AccountState = {
  loggedIn: false,
  type: 'manager',
  view: 'card',
};

const accountSlice = createSlice({
  name: 'account',
  initialState: initialState,
  reducers: {
    toggleLoggedIn(state) {
      state.loggedIn = !state.loggedIn;
    },
    changeType(state, action: PayloadAction<AccountType>) {
      state.type = action.payload;
    },
    changeReportsViewType(state, action: PayloadAction<ReportsViewType>) {
      state.view = action.payload;
    },
  },
});

export const { toggleLoggedIn, changeType, changeReportsViewType } =
  accountSlice.actions;
export default accountSlice.reducer;
