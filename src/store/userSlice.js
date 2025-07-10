// store/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../config";

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/user/all", {
        withCredentials: true,
      });

      if (!res.data.success) {
        return rejectWithValue(res.data.message || "Failed to fetch users");
      }

      return {
        users: res.data.users,
        totalUsers: res.data.count || res.data.users.length,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
    }
  }
);

const initialState = {
  allUsers: [],
  totalUsers: 0,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsers(state) {
      state.allUsers = [];
      state.totalUsers = 0;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allUsers = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearUsers } = userSlice.actions;
export default userSlice.reducer;

// ✅ Selectors
export const selectAllUsers = (state) => state.users.allUsers;
export const selectTotalUsers = (state) => state.users.totalUsers;
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;
