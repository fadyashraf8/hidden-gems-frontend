import { createSlice } from "@reduxjs/toolkit";

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState: { enabled: false },
  reducers: {
    toggleDarkMode: (state) => {
      state.enabled = !state.enabled;
    },
    setDarkMode: (state, action) => {
      state.enabled = action.payload;
    },
  },
});

export const { toggleDarkMode, setDarkMode } = darkModeSlice.actions;
export default darkModeSlice.reducer;
