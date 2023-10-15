import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./slices/favoritesSlice";
import songsShortTermReducer from "./slices/songsShortTermSlice";
import songsMediumTermReducer from "./slices/songsMediumTermSlice";
import songsLongTermReducer from "./slices/songsLongTermSlice";

/* THE GLOBAL STORE SETUP */
export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    songsShortTerm: songsShortTermReducer,
    songsMediumTerm: songsMediumTermReducer,
    songsLongTerm: songsLongTermReducer,
  },
});
