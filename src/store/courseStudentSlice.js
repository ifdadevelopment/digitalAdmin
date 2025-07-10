
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../config";

// ✅ Async thunk to fetch all enrolled courses
export const fetchAllCourseStudents = createAsyncThunk(
  "courseStudent/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/courseStudent/all");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch enrolled courses");
    }
  }
);

const initialState = {
  enrolledCourses: [],
  totalEnrolledCourses: 0,
  totalEnrolledUsers: 0,
  totalUniqueCourses: 0,
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
      .addCase(fetchAllCourseStudents.fulfilled, (state, action) => {
      state.enrolledCourses = action.payload.enrolledCourses;
      state.totalEnrolledCourses = action.payload.totalEnrolledCourses;
      state.totalEnrolledUsers = action.payload.totalEnrolledUsers;
      state.totalUniqueCourses = action.payload.totalUniqueCourses;
      state.loading = false;
      state.error = null;
    })
    .addCase(fetchAllCourseStudents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(fetchAllCourseStudents.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
  },
});

// ✅ Export reducer and actions
export const { clearEnrolledCourses } = courseStudentSlice.actions;
export default courseStudentSlice.reducer;

// Selectors
export const selectAllEnrolledCourses = (state) => state.courseStudent.enrolledCourses;
export const selectCourseStudentStatus = (state) => state.courseStudent.status;
export const selectCourseStudentError = (state) => state.courseStudent.error;
export const selectTotalEnrolledCourses = (state) => state.courseStudent.totalEnrolledCourses;
export const selectTotalEnrolledUsers = (state) => state.courseStudent.totalEnrolledUsers;
export const selectTotalUniqueCourses = (state) => state.courseStudent.totalUniqueCourses;
