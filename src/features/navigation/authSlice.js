import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  password: "",
  rememberMe: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    toggleRememberMe: (state) => {
      state.rememberMe = !state.rememberMe;
    },
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state) => {
      state.isLoading = false;
    },
  },
});

export const { setField, toggleRememberMe, loginStart, loginSuccess } =
  authSlice.actions;
export default authSlice.reducer;
