import express from 'express';
import {
    createTicket,
    getVendorTickets,
    getAllTickets,
    replyToTicket,
} from '../controllers/ticketController.js';
import { protect, admin, vendor } from '../middleware/authMiddleware.js';

const router = express.Router();

// Vendor routes
router.route('/vendor').get(protect, vendor, getVendorTickets);
router.route('/').post(protect, vendor, createTicket);

// Admin routes
router.route('/').get(protect, admin, getAllTickets);
router.route('/:id/reply').put(protect, admin, replyToTicket);

export default router;
