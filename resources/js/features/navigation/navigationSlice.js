import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMasterDataOpen: true,
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    toggleMasterData: (state) => {
      state.isMasterDataOpen = !state.isMasterDataOpen;
    },
  },
});

export const { toggleMasterData } = navigationSlice.actions;
export default navigationSlice.reducer;
