import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance';

// Thunk: Get vendor's own products
export const getVendorProducts = createAsyncThunk(
    'vendor/getProducts',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/products/vendor');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Thunk: Get vendor's orders
export const getVendorOrders = createAsyncThunk(
    'vendor/getOrders',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/orders/vendor');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Thunk: Get vendor's cancelled orders
export const getVendorCancelledOrders = createAsyncThunk(
    'vendor/getCancelledOrders',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/orders/vendor/cancelled');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Thunk: Get vendor's product reviews
export const getVendorReviews = createAsyncThunk(
    'vendor/getReviews',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/products/vendor/reviews');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const vendorSlice = createSlice({
    name: 'vendor',
    initialState: {
        products: [],
        orders: [],
        cancelledOrders: [],
        reviews: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getVendorProducts.pending, (state) => { state.loading = true; })
            .addCase(getVendorProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(getVendorProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getVendorOrders.pending, (state) => { state.loading = true; })
            .addCase(getVendorOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(getVendorOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getVendorCancelledOrders.pending, (state) => { state.loading = true; })
            .addCase(getVendorCancelledOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.cancelledOrders = action.payload;
            })
            .addCase(getVendorCancelledOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getVendorReviews.pending, (state) => { state.loading = true; })
            .addCase(getVendorReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(getVendorReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default vendorSlice.reducer;
