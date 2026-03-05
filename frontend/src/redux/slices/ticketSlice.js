import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance';

export const createTicket = createAsyncThunk(
    'tickets/create',
    async (ticketData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/api/tickets', ticketData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getVendorTickets = createAsyncThunk(
    'tickets/getVendorTickets',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/tickets/vendor');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getAllTickets = createAsyncThunk(
    'tickets/getAllTickets',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/tickets');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const replyToTicket = createAsyncThunk(
    'tickets/reply',
    async ({ id, adminReply, status }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`/api/tickets/${id}/reply`, { adminReply, status });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const ticketSlice = createSlice({
    name: 'tickets',
    initialState: {
        tickets: [],
        loading: false,
        error: null,
        successCreate: false,
        successReply: false,
    },
    reducers: {
        resetTicketState: (state) => {
            state.successCreate = false;
            state.successReply = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createTicket.pending, (state) => { state.loading = true; })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.loading = false;
                state.successCreate = true;
                state.tickets.unshift(action.payload);
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Vendor Tickets
            .addCase(getVendorTickets.pending, (state) => { state.loading = true; })
            .addCase(getVendorTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload;
            })
            .addCase(getVendorTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get All Tickets
            .addCase(getAllTickets.pending, (state) => { state.loading = true; })
            .addCase(getAllTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload;
            })
            .addCase(getAllTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Reply
            .addCase(replyToTicket.pending, (state) => { state.loading = true; })
            .addCase(replyToTicket.fulfilled, (state, action) => {
                state.loading = false;
                state.successReply = true;
                // Update specific ticket in array
                const index = state.tickets.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.tickets[index] = action.payload;
                }
            })
            .addCase(replyToTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetTicketState } = ticketSlice.actions;
export default ticketSlice.reducer;
