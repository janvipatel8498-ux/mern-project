import Order from '../models/Order.js';
import User from '../models/User.js';

// @desc    Get delivery dashboard stats
// @route   GET /api/delivery/dashboard
// @access  Private/Delivery
export const getDeliveryDashboard = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const assignedOrdersCount = await Order.countDocuments({
            deliveryAgent: req.user._id,
            status: { $in: ['Processing', 'Shipped', 'Pending'] },
            isDelivered: false
        });

        const outForDeliveryCount = await Order.countDocuments({
            deliveryAgent: req.user._id,
            status: 'Out for Delivery',
            isDelivered: false
        });

        const deliveredTodayCount = await Order.countDocuments({
            deliveryAgent: req.user._id,
            status: 'Delivered',
            isDelivered: true,
            deliveredAt: { $gte: today }
        });

        const codCollectedAgg = await Order.aggregate([
            {
                $match: {
                    deliveryAgent: req.user._id,
                    status: 'Delivered',
                    paymentMethod: 'CashOnDelivery',
                    deliveredAt: { $gte: today }
                }
            },
            {
                $group: {
                    _id: null,
                    totalCOD: { $sum: '$codAmountCollected' }
                }
            }
        ]);

        const codCollectedToday = codCollectedAgg.length > 0 ? codCollectedAgg[0].totalCOD : 0;

        // Check if agent already has an active order
        const activeOrder = await Order.findOne({
            deliveryAgent: req.user._id,
            isDelivered: false,
            status: { $nin: ['Cancelled', 'Delivered'] }
        });

        let requestsCount = 0;
        if (!activeOrder) {
            requestsCount = await Order.countDocuments({
                status: 'Processing',
                deliveryAgent: null,
                isCancelled: false,
                deliveryRejections: { $ne: req.user._id }
            });
        }

        res.json({
            assignedOrders: assignedOrdersCount,
            outForDelivery: outForDeliveryCount,
            deliveredToday: deliveredTodayCount,
            codCollectedToday,
            requestsCount
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get assigned orders for delivery agent
// @route   GET /api/delivery/assigned
// @access  Private/Delivery
export const getAssignedOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({
            deliveryAgent: req.user._id,
            isDelivered: false,
            status: { $ne: 'Cancelled' }
        }).populate('user', 'name email');

        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Update delivery order status
// @route   PUT /api/delivery/:id/status
// @access  Private/Delivery
export const updateDeliveryStatus = async (req, res, next) => {
    try {
        const { status, codAmountCollected, deliveryNotes } = req.body;
        const allowedStatuses = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

        if (!allowedStatuses.includes(status)) {
            res.status(400);
            return next(new Error(`Invalid status. Must be one of: ${allowedStatuses.join(', ')}`));
        }

        const order = await Order.findOne({
            _id: req.params.id,
            deliveryAgent: req.user._id
        });

        if (!order) {
            res.status(404);
            return next(new Error('Order not found or not assigned to you'));
        }

        order.status = status;

        if (deliveryNotes) {
            order.deliveryNotes = deliveryNotes;
        }

        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            if (order.paymentMethod === 'CashOnDelivery') {
                if (codAmountCollected === undefined || codAmountCollected < 0) {
                    res.status(400);
                    return next(new Error('COD amount collected is required for delivered COD orders'));
                }
                order.codAmountCollected = codAmountCollected;
                order.isPaid = true;
                order.paidAt = Date.now();
            }
        } else if (status === 'Cancelled') {
            order.isCancelled = true;
            order.cancelledAt = Date.now();
            order.cancellationReason = 'Failed Delivery Attempt';
            // Stock restoration would happen here conceptually or handled by cron/admin later
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);

    } catch (error) {
        next(error);
    }
};

// @desc    Get delivery history
// @route   GET /api/delivery/history
// @access  Private/Delivery
export const getDeliveryHistory = async (req, res, next) => {
    try {
        const orders = await Order.find({
            deliveryAgent: req.user._id,
            $or: [
                { isDelivered: true },
                { status: 'Cancelled' } // Including failed deliveries
            ]
        }).populate('user', 'name email').sort({ updatedAt: -1 });

        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Get available order requests for delivery agent
// @route   GET /api/delivery/requests
// @access  Private/Delivery
export const getDeliveryRequests = async (req, res, next) => {
    try {
        // Check if agent already has an active order
        const activeOrder = await Order.findOne({
            deliveryAgent: req.user._id,
            isDelivered: false,
            status: { $nin: ['Cancelled', 'Delivered'] }
        });

        if (activeOrder) {
            return res.json([]); // Return empty if agent is busy
        }

        const orders = await Order.find({
            status: 'Processing',
            deliveryAgent: null,
            isCancelled: false,
            deliveryRejections: { $ne: req.user._id }
        }).populate('user', 'name email');

        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Accept a delivery request
// @route   PUT /api/delivery/:id/accept
// @access  Private/Delivery
export const acceptDelivery = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            return next(new Error('Order not found'));
        }

        if (order.deliveryAgent) {
            res.status(400);
            return next(new Error('Order already assigned to another agent'));
        }

        // Check if agent already has an active order
        const activeOrder = await Order.findOne({
            deliveryAgent: req.user._id,
            isDelivered: false,
            status: { $nin: ['Cancelled', 'Delivered'] }
        });

        if (activeOrder) {
            res.status(400);
            return next(new Error('You already have an active delivery. Complete it first.'));
        }

        order.deliveryAgent = req.user._id;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        next(error);
    }
};

// @desc    Reject a delivery request
// @route   PUT /api/delivery/:id/reject
// @access  Private/Delivery
export const rejectDelivery = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            return next(new Error('Order not found'));
        }

        if (!order.deliveryRejections.includes(req.user._id)) {
            order.deliveryRejections.push(req.user._id);
            await order.save();
        }

        res.json({ message: 'Order rejected successfully' });
    } catch (error) {
        next(error);
    }
};
