import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from "../features/navigation/navigationSlice";
import dashboardReducer from "../store/dashboardSlice";
import dprReducer from "./dpr";
import authReducer from "../features/navigation/authSlice";

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    dashboard: dashboardReducer,
    dpr: dprReducer,
    auth: authReducer,
  },
});
