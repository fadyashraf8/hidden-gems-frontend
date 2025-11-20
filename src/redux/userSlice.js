import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoggedIn: false,
  userInfo: null,
  loading: true,
  error: null,
};

// Async thunk to check authentication status
export const checkAuth = createAsyncThunk("user/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get("http://localhost:3000/auth/me", {
      withCredentials: true,
    });
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Failed to authenticate");
  }
});

// Async thunk to logout
export const logoutUser = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
  try {
    await axios.post("http://localhost:3000/auth/logout", {}, {
      withCredentials: true,
    });
    return;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Logout failed");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userInfo = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.userInfo = action.payload;
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.userInfo = null;
        state.loading = false;
      })
      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.userInfo = null;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { login, clearUser } = userSlice.actions;
export default userSlice.reducer;
