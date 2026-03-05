import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance';

export const createOrder = createAsyncThunk(
    'orders/create',
    async (order, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/api/orders', order);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getOrderDetails = createAsyncThunk(
    'orders/details',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/orders/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getMyOrders = createAsyncThunk(
    'orders/mine',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/orders/mine');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const payOrder = createAsyncThunk(
    'orders/pay',
    async ({ orderId, paymentResult }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'orders/cancel',
    async ({ orderId, reason }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`/api/orders/${orderId}/cancel`, { reason });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getCancelledStats = createAsyncThunk(
    'orders/cancelledStats',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/orders/cancelled/stats');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


const orderSlice = createSlice({
    name: 'order',
    initialState: {
        order: null,
        orders: [],
        cancelledOrders: [],
        cancelledStats: [],
        loading: false,
        error: null,
        success: false,
        razorpayOrder: null,
    },
    reducers: {
        resetOrderState: (state) => {
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload.order;
                state.razorpayOrder = action.payload.razorpayOrder;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getOrderDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(payOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(payOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload; // updated order object
                state.razorpayOrder = null; // Clear after payment
            })
            .addCase(payOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getMyOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(getMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(cancelOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload;
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getCancelledStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCancelledStats.fulfilled, (state, action) => {
                state.loading = false;
                state.cancelledStats = action.payload;
            })
            .addCase(getCancelledStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { resetOrderState } = orderSlice.actions;

export default orderSlice.reducer;
