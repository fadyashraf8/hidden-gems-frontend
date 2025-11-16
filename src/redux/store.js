import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import darkModeReducer from "./darkModeSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    darkMode: darkModeReducer,
  },
});
