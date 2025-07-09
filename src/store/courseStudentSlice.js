
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../config";

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
  status: "idle",
  error: null,
};

const courseStudentSlice = createSlice({
  name: "courseStudent",
  initialState,
  reducers: {},
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

export default courseStudentSlice.reducer;

// Selectors
export const selectAllEnrolledCourses = (state) => state.courseStudent.enrolledCourses;
export const selectTotalEnrolledCourses = (state) => state.courseStudent.totalEnrolledCourses;
export const selectCourseStudentStatus = (state) => state.courseStudent.status;
export const selectCourseStudentError = (state) => state.courseStudent.error;
