import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  songsLongTermItems: [],
};

export const songsLongTermSlice = createSlice({
  name: "songsLongTerm",
  initialState,
  reducers: {
    setSongsLongTerm: (state, action) => {
      state.songsLongTermItems = action.payload;
    },
  },
});

export const { setSongsLongTerm } = songsLongTermSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.songsLongTerm.songsLongTermItems;

export default songsLongTermSlice.reducer;
