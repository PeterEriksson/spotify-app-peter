import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./slices/favoritesSlice";

/* THE GLOBAL STORE SETUP */
export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
  },
});
