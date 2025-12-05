import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import darkModeReducer from "./darkModeSlice";
import wishlistReducer from "./wishlistSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    darkMode: darkModeReducer,
    wishlist : wishlistReducer,
  },
});
