import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from "../features/navigation/navigationSlice";
import dashboardReducer from "../store/dashboardSlice";

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    dashboard: dashboardReducer,
  },
});
