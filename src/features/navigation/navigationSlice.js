import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeItem: "Dashboard",
  isMasterDataOpen: true,
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setActiveItem: (state, action) => {
      state.activeItem = action.payload;
    },
    toggleMasterData: (state) => {
      state.isMasterDataOpen = !state.isMasterDataOpen;
    },
  },
});

export const { setActiveItem, toggleMasterData } = navigationSlice.actions;
export default navigationSlice.reducer;
