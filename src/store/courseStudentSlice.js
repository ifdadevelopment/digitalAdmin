import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../config";

export const fetchAllCourseStudents = createAsyncThunk(
  "courseStudent/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/courseStudent/all");

      if (!res.data.success) {
        return rejectWithValue(res.data.message || "Failed to fetch enrolled courses");
      }

      const enrolledCourses = res.data.enrolledCourses || [];
      const summary = res.data.summary || {};

      const totalEnrolledCourses = summary.totalEnrolledCourses || 0;
      const totalEnrolledUsers = summary.totalEnrolledUsers || 0;
      const totalUniqueCourses = summary.totalUniqueCourses || 0;


      return {
        enrolledCourses,
        totalEnrolledCourses,
        totalEnrolledUsers,
        totalUniqueCourses,
      };
    } catch (err) {
      console.error("Error fetching enrolled courses:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch enrolled courses"
      );
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

const courseStudentSlice = createSlice({
  name: "courseStudent",
  initialState,
  reducers: {},
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

export default courseStudentSlice.reducer;
export const selectAllEnrolledCourses = (state) => state.courseStudent.enrolledCourses;
export const selectCourseStudentStatus = (state) => state.courseStudent.status;
export const selectCourseStudentError = (state) => state.courseStudent.error;
export const selectTotalEnrolledCourses = (state) => state.courseStudent.totalEnrolledCourses;
export const selectTotalEnrolledUsers = (state) => state.courseStudent.totalEnrolledUsers;
export const selectTotalUniqueCourses = (state) => state.courseStudent.totalUniqueCourses;
