import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import contactTicketRoutes from './routes/contactTicketRoutes.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Basic route
app.get('/', (req, res) => {
    res.send('FreshMart API is running...');
});

// Setup Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/contact-tickets', contactTicketRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/api/config/razorpay', (req, res) =>
    res.send({ clientId: process.env.RAZORPAY_KEY_ID })
);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Backend Error:", err);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message || err.error?.description || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        details: err
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
