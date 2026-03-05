import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('cartItems')
    ? {
        cartItems: JSON.parse(localStorage.getItem('cartItems')),
        shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
        paymentMethod: localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')) : 'Razorpay'
    }
    : { cartItems: [], shippingAddress: {}, paymentMethod: 'Razorpay' };

const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        clearCartItems: (state, action) => {
            state.cartItems = [];
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod));
        },
    },
});

export const { addToCart, removeFromCart, clearCartItems, saveShippingAddress, savePaymentMethod } = cartSlice.actions;

export default cartSlice.reducer;
