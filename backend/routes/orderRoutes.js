import express from 'express';
import {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    updateOrderStatus,
    cancelOrder,
    getOrders,
    getVendorOrders,
    getVendorCancelledOrders,
    getCancelledStats,
    assignDeliveryAgent,
} from '../controllers/orderController.js';
import { protect, admin, vendor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.route('/cancelled/stats').get(protect, admin, getCancelledStats);
router.route('/vendor').get(protect, vendor, getVendorOrders);
router.route('/vendor/cancelled').get(protect, vendor, getVendorCancelledOrders);

router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/status').put(protect, vendor, updateOrderStatus);
router.route('/:id/cancel').put(protect, cancelOrder);
router.route('/:id/assign').put(protect, admin, assignDeliveryAgent);

export default router;
