import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from "../features/navigation/navigationSlice";
import dprReducer from "./dpr";
import authReducer from "../features/navigation/authSlice";

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    dpr: dprReducer,
    auth: authReducer,
  },
});
