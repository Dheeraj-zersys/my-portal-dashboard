import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: {
    users: 10,
    businessPlan: { current: 5, total: 25 },
    dailyProgressReport: { current: 10, total: 25 },
    geographicalArea: 10,
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
