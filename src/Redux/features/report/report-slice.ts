import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type Report = {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  description: string;
  date: string;
  time: string;
  reply: string;
  videoUrl: string;
  imageUrls: string[];
};

export type ReportState = {
  reports: Report[];
};

const initialState: ReportState = {
  reports: null
};

const reportSlice = createSlice({
  name: 'report',
  initialState: initialState,
  reducers: {
    changeReports(state, action: PayloadAction<Report[]>) {
      state.reports = action.payload;
    }
  }
});

export const { changeReports } = reportSlice.actions;
export default reportSlice.reducer;
