import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance';

export const createUserTicket = createAsyncThunk(
    'contactTickets/create',
    async (ticketData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/api/contact-tickets', ticketData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getUserTickets = createAsyncThunk(
    'contactTickets/getUserTickets',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/contact-tickets/my-tickets');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getAllUserTickets = createAsyncThunk(
    'contactTickets/getAllUserTickets',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/contact-tickets');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const replyToUserTicket = createAsyncThunk(
    'contactTickets/reply',
    async ({ id, adminReply, status }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`/api/contact-tickets/${id}/reply`, { adminReply, status });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const contactTicketSlice = createSlice({
    name: 'contactTickets',
    initialState: {
        tickets: [],
        loading: false,
        error: null,
        successCreate: false,
        successReply: false,
    },
    reducers: {
        resetContactTicketState: (state) => {
            state.successCreate = false;
            state.successReply = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createUserTicket.pending, (state) => { state.loading = true; })
            .addCase(createUserTicket.fulfilled, (state, action) => {
                state.loading = false;
                state.successCreate = true;
                state.tickets.unshift(action.payload);
            })
            .addCase(createUserTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get User Tickets
            .addCase(getUserTickets.pending, (state) => { state.loading = true; })
            .addCase(getUserTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload;
            })
            .addCase(getUserTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get All Tickets
            .addCase(getAllUserTickets.pending, (state) => { state.loading = true; })
            .addCase(getAllUserTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload;
            })
            .addCase(getAllUserTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Reply
            .addCase(replyToUserTicket.pending, (state) => { state.loading = true; })
            .addCase(replyToUserTicket.fulfilled, (state, action) => {
                state.loading = false;
                state.successReply = true;
                // Update specific ticket in array
                const index = state.tickets.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.tickets[index] = action.payload;
                }
            })
            .addCase(replyToUserTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetContactTicketState } = contactTicketSlice.actions;
export default contactTicketSlice.reducer;
