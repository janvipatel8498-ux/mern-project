import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes
export const protect = async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            if (!req.user) {
                console.log('Protect: User not found for token');
                res.status(401);
                return next(new Error('Not authorized, user not found'));
            }
            next();
        } catch (error) {
            console.error('Protect: Token verification failed:', error.message);
            res.status(401);
            next(new Error('Not authorized, token failed'));
        }
    } else {
        console.log('Protect: No token found in cookies');
        res.status(401);
        next(new Error('Not authorized, no token'));
    }
};

// Admin middleware
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        console.log('Admin: Access denied for role:', req.user?.role);
        res.status(401);
        next(new Error('Not authorized as an admin'));
    }
};

// Vendor middleware
export const vendor = (req, res, next) => {
    if (req.user && (req.user.role === 'admin')) {
        return next();
    }

    if (req.user && req.user.role === 'vendor') {
        if (req.user.isApproved) {
            next();
        } else {
            console.log('Vendor: Approval pending for:', req.user.email);
            res.status(403);
            next(new Error('Access denied. Your vendor account is pending administrator approval.'));
        }
    } else {
        console.log('Vendor: Access denied for role:', req.user?.role);
        res.status(401);
        next(new Error('Not authorized as a vendor'));
    }
};

// Delivery middleware
export const delivery = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'delivery')) {
        next();
    } else {
        console.log('Delivery: Access denied for role:', req.user?.role);
        res.status(401);
        next(new Error('Not authorized as a delivery agent'));
    }
};
