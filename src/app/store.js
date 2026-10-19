import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from "../features/navigation/navigationSlice";
import dashboardReducer from "../store/dashboardSlice";
// import dprReducer from "../dprSlice";

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    dashboard: dashboardReducer,
    dpr: dprReducer,
  },
});
