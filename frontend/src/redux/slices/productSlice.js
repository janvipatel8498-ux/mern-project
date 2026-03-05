import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance';

export const listProducts = createAsyncThunk(
    'products/list',
    async ({ keyword = '', pageNumber = '', category = '' } = {}, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(
                `/api/products?keyword=${keyword}&pageNumber=${pageNumber}&category=${category}`
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getProductDetails = createAsyncThunk(
    'products/details',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/products/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/update',
    async (product, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(
                `/api/products/${product._id}`,
                product
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createProductReview = createAsyncThunk(
    'products/createReview',
    async ({ productId, review }, { rejectWithValue }) => {
        try {
            await axios.post(`/api/products/${productId}/reviews`, review);
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        product: { reviews: [] },
        loading: false,
        error: null,
        page: 1,
        pages: 1,
        successReview: false,
        loadingReview: false,
        errorReview: null,
    },
    reducers: {
        resetReview: (state) => {
            state.successReview = false;
            state.loadingReview = false;
            state.errorReview = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(listProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(listProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.pages = action.payload.pages;
                state.page = action.payload.page;
            })
            .addCase(listProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getProductDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
                const index = state.products.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProductReview.pending, (state) => {
                state.loadingReview = true;
            })
            .addCase(createProductReview.fulfilled, (state) => {
                state.loadingReview = false;
                state.successReview = true;
            })
            .addCase(createProductReview.rejected, (state, action) => {
                state.loadingReview = false;
                state.errorReview = action.payload;
            });
    },
});

export const { resetReview } = productSlice.actions;
export default productSlice.reducer;
