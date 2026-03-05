import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';
import vendorReducer from './slices/vendorSlice';
import ticketReducer from './slices/ticketSlice';
import contactTicketReducer from './slices/contactTicketSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        products: productReducer,
        order: orderReducer,
        admin: adminReducer,
        vendor: vendorReducer,
        tickets: ticketReducer,
        contactTickets: contactTicketReducer,
    },
    devTools: import.meta.env.MODE !== 'production',
});

export default store;

