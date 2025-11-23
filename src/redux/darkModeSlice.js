import { createSlice } from "@reduxjs/toolkit";

const getInitialDarkMode = () => {
  if (typeof window !== "undefined") {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  }
  return false;
};

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState: { enabled: getInitialDarkMode() },
  reducers: {
    toggleDarkMode: (state) => {
      state.enabled = !state.enabled;
      localStorage.setItem("darkMode", JSON.stringify(state.enabled));
    },
    setDarkMode: (state, action) => {
      state.enabled = action.payload;
      localStorage.setItem("darkMode", JSON.stringify(state.enabled));
    },
  },
});

export const { toggleDarkMode, setDarkMode } = darkModeSlice.actions;
export default darkModeSlice.reducer;
