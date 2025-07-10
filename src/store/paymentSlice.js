import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../config";

// Create Razorpay order
export const createPaymentOrder = createAsyncThunk(
  "payment/createPaymentOrder",
  async ({ amount, userId, cartItems }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/payment/create-order", {
        amount,
        userId,
        cartItems,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Order creation failed");
    }
  }
);

// Verify Razorpay payment
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (
    { razorpay_order_id, razorpay_payment_id, razorpay_signature, amountPaid, userId, cartItems },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post("/payment/verify", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amountPaid,
        userId,
        cartItems,
      });
      return res.data.paymentDetails;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Verification failed");
    }
  }
);

// Fetch user's past payments
export const fetchPaymentsByUser = createAsyncThunk(
  "payment/fetchPaymentsByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/payment/user/${userId}`);
      return res.data.payments;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch payments failed");
    }
  }
);

// Fetch all successful payments (admin use)
export const getAllSuccessfulPayments = createAsyncThunk(
  "payment/getAllSuccessfulPayments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/payment/successful");
      const payments = res.data.payments;
      return payments.length; 
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch all successful payments"
      );
    }
  }
);
// Initial state
const initialState = {
  order: null,
  verificationResult: null,
  pastPayments: [],
  orderSummary: null,
  allPayments: [],
  allPaymentsCount: 0,

  orderStatus: "idle",
  verificationStatus: "idle",
  fetchStatus: "idle",
  allPaymentsStatus: "idle",

  orderError: null,
  verificationError: null,
  fetchError: null,
  allPaymentsError: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPaymentState: () => initialState,
    setOrderSummary: (state, action) => {
      state.orderSummary = action.payload;
    },
    clearOrderSummary: (state) => {
      state.orderSummary = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Order
      .addCase(createPaymentOrder.pending, (state) => {
        state.orderStatus = "loading";
        state.orderError = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.orderStatus = "succeeded";
        state.order = action.payload;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.orderStatus = "failed";
        state.orderError = action.payload;
      })

      // Verification
      .addCase(verifyPayment.pending, (state) => {
        state.verificationStatus = "loading";
        state.verificationError = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.verificationStatus = "succeeded";
        state.verificationResult = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.verificationStatus = "failed";
        state.verificationError = action.payload;
      })

      // User's past payments
      .addCase(fetchPaymentsByUser.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchPaymentsByUser.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.pastPayments = action.payload;
      })
      .addCase(fetchPaymentsByUser.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload;
      })
       .addCase(getAllSuccessfulPayments.pending, (state) => {
        state.allPaymentsStatus = "loading";
        state.allPaymentsError = null;
      })
      .addCase(getAllSuccessfulPayments.fulfilled, (state, action) => {
        state.allPaymentsStatus = "succeeded";
        state.allPayments = action.payload.payments;
        state.allPaymentsCount = action.payload.totalCount;
      })
      .addCase(getAllSuccessfulPayments.rejected, (state, action) => {
        state.allPaymentsStatus = "failed";
        state.allPaymentsError = action.payload;
      });
  },
});

export const selectAllPayments = (state) => state.payment.allPayments;
export const selectAllPaymentsCount = (state) => state.payment.allPaymentsCount;
export const selectAllPaymentsStatus = (state) => state.payment.allPaymentsStatus;
export const selectAllPaymentsError = (state) => state.payment.allPaymentsError;

export const { resetPaymentState, setOrderSummary, clearOrderSummary } = paymentSlice.actions;

export default paymentSlice.reducer;
