import express from 'express';
import {
    getDeliveryDashboard,
    getAssignedOrders,
    updateDeliveryStatus,
    getDeliveryHistory,
    getDeliveryRequests,
    acceptDelivery,
    rejectDelivery,
} from '../controllers/deliveryController.js';
import { protect, delivery } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/dashboard').get(protect, delivery, getDeliveryDashboard);
router.route('/assigned').get(protect, delivery, getAssignedOrders);
router.route('/history').get(protect, delivery, getDeliveryHistory);
router.route('/requests').get(protect, delivery, getDeliveryRequests);
router.route('/:id/status').put(protect, delivery, updateDeliveryStatus);
router.route('/:id/accept').put(protect, delivery, acceptDelivery);
router.route('/:id/reject').put(protect, delivery, rejectDelivery);

export default router;
