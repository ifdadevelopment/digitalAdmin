// store/courseStudentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../config";

// ✅ Async thunk to fetch all enrolled courses
export const fetchAllCourseStudents = createAsyncThunk(
  "courseStudent/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/courseStudent/all");

      if (!res.data.success) {
        return rejectWithValue(res.data.message || "Failed to fetch enrolled courses");
      }

      return {
        enrolledCourses: res.data.enrolledCourses || [],
        totalEnrolledCourses: res.data.totalEnrolledCourses || 0,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch enrolled courses"
      );
    }
  }
);

// ✅ Initial state
const initialState = {
  enrolledCourses: [],
  totalEnrolledCourses: 0,
  status: "idle",
  error: null,
};

// ✅ Redux slice
const courseStudentSlice = createSlice({
  name: "courseStudent",
  initialState,
  reducers: {
    clearEnrolledCourses: (state) => {
      state.enrolledCourses = [];
      state.totalEnrolledCourses = 0;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCourseStudents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllCourseStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.enrolledCourses = action.payload.enrolledCourses;
        state.totalEnrolledCourses = action.payload.totalEnrolledCourses;
      })
      .addCase(fetchAllCourseStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// ✅ Export reducer and actions
export const { clearEnrolledCourses } = courseStudentSlice.actions;
export default courseStudentSlice.reducer;

// ✅ Correct Selectors
export const selectAllEnrolledCourses = (state) => state.courseStudent.enrolledCourses;
export const selectTotalEnrolledCourses = (state) => state.courseStudent.totalEnrolledCourses;
export const selectCourseStudentStatus = (state) => state.courseStudent.status;
export const selectCourseStudentError = (state) => state.courseStudent.error;
