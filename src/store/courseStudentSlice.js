import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../config";

// ✅ Create course enrollment
export const createCourseEnrollment = createAsyncThunk(
  "courseStudent/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/courseStudent/create", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create enrollment");
    }
  }
);

// ✅ Fetch all enrolled courses
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

// ✅ Update course enrollment by ID
export const updateCourseEnrollment = createAsyncThunk(
  "courseStudent/update",
  async ({ id, enrolledCourses }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/courseStudent/${id}`, { enrolledCourses });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update enrollment");
    }
  }
);

// ✅ Delete course enrollment by ID
export const deleteCourseEnrollment = createAsyncThunk(
  "courseStudent/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/courseStudent/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete enrollment");
    }
  }
);

// ✅ Initial State
const initialState = {
  enrolledCourses: [],
  totalEnrolledCourses: 0,
  totalEnrolledUsers: 0,
  totalUniqueCourses: 0,
  status: "idle",
  error: null,
  successMessage: null,
};

const courseStudentSlice = createSlice({
  name: "courseStudent",
  initialState,
  reducers: {
    clearEnrolledCourses: (state) => {
      state.enrolledCourses = [];
      state.totalEnrolledCourses = 0;
      state.totalEnrolledUsers = 0;
      state.totalUniqueCourses = 0;
      state.status = "idle";
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ✅ FETCH
      .addCase(fetchAllCourseStudents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCourseStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.enrolledCourses = action.payload.enrolledCourses || [];
        state.totalEnrolledCourses = action.payload.summary.totalEnrolledCourses || 0;
        state.totalEnrolledUsers = action.payload.summary.totalEnrolledUsers || 0;
        state.totalUniqueCourses = action.payload.summary.totalUniqueCourses || 0;
        state.error = null;
      })
      .addCase(fetchAllCourseStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ CREATE
      .addCase(createCourseEnrollment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCourseEnrollment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.enrolledCourses.push(...(action.payload.enrolledCourses || []));
        state.successMessage = "Enrollment created successfully";
        state.error = null;
      })
      .addCase(createCourseEnrollment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ UPDATE
      .addCase(updateCourseEnrollment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCourseEnrollment.fulfilled, (state) => {
        state.status = "succeeded";
        state.successMessage = "Enrollment updated successfully";
        state.error = null;
      })
      .addCase(updateCourseEnrollment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ DELETE
      .addCase(deleteCourseEnrollment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCourseEnrollment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = "Enrollment deleted successfully";
        state.enrolledCourses = state.enrolledCourses.filter(
          (course) => course._id !== action.meta.arg
        );
        state.error = null;
      })
      .addCase(deleteCourseEnrollment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearEnrolledCourses } = courseStudentSlice.actions;
export default courseStudentSlice.reducer;
export const selectAllEnrolledCourses = (state) => state.courseStudent.enrolledCourses;
export const selectCourseStudentStatus = (state) => state.courseStudent.status;
export const selectCourseStudentError = (state) => state.courseStudent.error;
export const selectCourseStudentSuccess = (state) => state.courseStudent.successMessage;
export const selectTotalEnrolledCourses = (state) => state.courseStudent.totalEnrolledCourses;
export const selectTotalEnrolledUsers = (state) => state.courseStudent.totalEnrolledUsers;
export const selectTotalUniqueCourses = (state) => state.courseStudent.totalUniqueCourses;
