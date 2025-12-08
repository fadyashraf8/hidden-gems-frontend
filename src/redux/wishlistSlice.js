import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_Base_URL;


export const fetchWishlistCount = createAsyncThunk(
  "wishlist/fetchCount",  
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/wishlist/counter`, {
        withCredentials: true,
      });
      return response.data.count;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist count"
      );
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/add", 
  async (gemId, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/wishlist/add`,
        { gemId },
        { withCredentials: true }
      );
      dispatch(fetchWishlistCount()); 
      return response.data;  
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to wishlist"
      );
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove", 
  async (gemId, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`${BASE_URL}/wishlist/remove/${gemId}`, {
        withCredentials: true,
      });
      dispatch(fetchWishlistCount()); 
      return gemId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from wishlist",
        gemId
      );
    }
  }
);

export const clearWishlist = createAsyncThunk(
  "wishlist/clear", 
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`${BASE_URL}/wishlist/clear`, {
        withCredentials: true,
      });
      dispatch(fetchWishlistCount()); 
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear wishlist"
      );
    }
  }
);

export const fetchWishlistItems = createAsyncThunk(
  "wishlist/fetchItems", 
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/wishlist`, {
        withCredentials: true,
      });
      
      console.log("Wishlist API response:", response.data);

      return response.data.userWishList || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWishlistCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlistCount.fulfilled, (state, action) => {
        state.count = action.payload;
        state.loading = false;
      })
      .addCase(fetchWishlistCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(  
          (item) => item.gemId._id !== action.payload
        );
        state.loading = false;//fady

      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWishlistItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchWishlistItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = [];  
        state.count = 0;
        state.loading = false; //fady

      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
