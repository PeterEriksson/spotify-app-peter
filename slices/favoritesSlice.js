import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoritedItems: [],
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      state.favoritedItems = [...state.favoritedItems, action.payload];
    },
    removeFromFavorites: (state, action) => {
      let newFavorites = state.favoritedItems.filter(
        (favoriteItem) => favoriteItem.id !== action.payload
      );
      state.favoritedItems = newFavorites;
    },
    emptyFavorites: (state) => {
      state.favoritedItems = [];
    },
  },
});

export const { addToFavorites, removeFromFavorites, emptyFavorites } =
  favoritesSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.favorites.favoritedItems;

export default favoritesSlice.reducer;
