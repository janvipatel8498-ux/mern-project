import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
            localStorage.setItem('expirationTime', new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
        },
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('expirationTime');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
