import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  route: string;
}

const splitArray = window.location.href.split('/');
const path = splitArray[splitArray.length - 1] || '/';

const initialState: AppState = {
  route: path
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    changeRoute(state, action: PayloadAction<string>) {
      state.route = action.payload;
    }
  }
});

export const { changeRoute } = appSlice.actions;
export default appSlice.reducer;
