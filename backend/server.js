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
import taxRoutes from './routes/taxRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
    'https://mern-project-f1de.onrender.com',
    'https://mern-project-ij3crx109-janvipatel8498-uxs-projects.vercel.app',
    'http://localhost:5173',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

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
app.use('/api/tax', taxRoutes);
app.use('/api/categories', categoryRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/api/config/razorpay', (req, res) =>
    res.send({ clientId: process.env.RAZORPAY_KEY_ID })
);

// Serve Static Assets in Production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    // Any route that is not API will serve index.html
    app.get('/(.*)', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
        }
    });
} else {
    // Basic route for development
    app.get('/', (req, res) => {
        res.send('FreshMart API is running...');
    });
}

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
