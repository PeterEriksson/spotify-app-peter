import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  songsMediumTermItems: [],
};

export const songsMediumTermSlice = createSlice({
  name: "songsMediumTerm",
  initialState,
  reducers: {
    setSongsMediumTerm: (state, action) => {
      state.songsMediumTermItems = action.payload;
    },
  },
});

export const { setSongsMediumTerm } = songsMediumTermSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) =>
  state.songsMediumTerm.songsMediumTermItems;

export default songsMediumTermSlice.reducer;
