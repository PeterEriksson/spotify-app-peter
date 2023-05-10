import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    removeFromFavorites: (state, action) => {
      let newFavorites = state.items.filter(
        (favoriteItem) => favoriteItem.id !== action.payload
      );
      state.items = newFavorites;
    },
    emptyFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { addToFavorites, removeFromFavorites, emptyFavorites } =
  favoritesSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.favorites.items;

export default favoritesSlice.reducer;
