import express from 'express';
import {
    createUserTicket,
    getUserTickets,
    getAllUserTickets,
    replyToUserTicket,
} from '../controllers/contactTicketController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes - protected by 'protect'
router.route('/my-tickets').get(protect, getUserTickets);
router.route('/').post(protect, createUserTicket);

// Admin routes - protected by 'protect' and 'admin'
router.route('/').get(protect, admin, getAllUserTickets);
router.route('/:id/reply').put(protect, admin, replyToUserTicket);

export default router;
