import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance';

// Fetch all users for admin
export const getAdminUsers = createAsyncThunk('admin/getUsers', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/users');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// Update User Block Status
export const blockUser = createAsyncThunk('admin/blockUser', async ({ userId, isBlocked }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`/api/users/${userId}/block`, { isBlocked });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});


// Delete User
export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId, { rejectWithValue }) => {
    try {
        await axios.delete(`/api/users/${userId}`);
        return userId;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// Fetch all orders for admin
export const getAdminOrders = createAsyncThunk('admin/getOrders', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/orders');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// Fetch system settings
export const getSystemSettings = createAsyncThunk('admin/getSettings', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/settings');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        orders: [],
        settings: { maintenanceMode: false, commissionPercentage: 10 },
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // getUsers
            .addCase(getAdminUsers.pending, (state) => { state.loading = true; })
            .addCase(getAdminUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(getAdminUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // blockUser Update
            .addCase(blockUser.fulfilled, (state, action) => {
                const userIndex = state.users.findIndex(u => u._id === action.payload._id);
                if (userIndex !== -1) {
                    state.users[userIndex].isBlocked = action.payload.isBlocked;
                }
            })


            // deleteUser
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u._id !== action.payload);
            })

            // getOrders
            .addCase(getAdminOrders.pending, (state) => { state.loading = true; })
            .addCase(getAdminOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })

            // getSettings
            .addCase(getSystemSettings.fulfilled, (state, action) => {
                state.settings = action.payload;
            });
    }
});

export default adminSlice.reducer;
