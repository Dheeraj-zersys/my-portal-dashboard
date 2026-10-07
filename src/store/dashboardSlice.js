import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: {
    users: 15,
    businessPlan: { current: 15, total: 50 },
    dailyProgressReport: { current: 19, total: 50 },
    geographicalArea: 15,
  },
  status: "idle",
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardStats: (state, action) => {
      state.stats = action.payload;
    },
  },
});

export const { setDashboardStats } = dashboardSlice.actions;
export const selectDashboardStats = (state) => state.dashboard.stats;
export default dashboardSlice.reducer;
