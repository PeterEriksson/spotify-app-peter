import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  songsShortTermItems: [],
};

export const songsShortTermSlice = createSlice({
  name: "songsShortTerm",
  initialState,
  reducers: {
    setSongsShortTerm: (state, action) => {
      state.songsShortTermItems = action.payload;
    },
  },
});

export const { setSongsShortTerm } = songsShortTermSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.songsShortTerm.songsShortTermItems;

export default songsShortTermSlice.reducer;
