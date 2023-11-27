import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AccountType = 'manager' | 'supervisor';
export type ReportsViewType = 'list' | 'grid';
export type AccountInfo = {
  name: string;
  email: string;
};

export type AccountState = {
  type: AccountType;
  loggedIn: boolean;
  info: AccountInfo;
  view: ReportsViewType;
  id: string;
  connectionId: string;
};

const initialState: AccountState = {
  loggedIn: false,
  type: 'manager',
  info: { name: '', email: '' },
  view: 'grid',
  id: '',
  connectionId: ''
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
    },
    changeUserId(state, action: PayloadAction<string>) {
      state.id = action.payload;
    },
    changeConnectionId(state, action: PayloadAction<string>) {
      state.connectionId = action.payload;
    }
  }
});

export const {
  changeLoggedIn,
  changeType,
  changeReportsViewType,
  changeInfo,
  changeUserId,
  changeConnectionId
} = accountSlice.actions;
export default accountSlice.reducer;
