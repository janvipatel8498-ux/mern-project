import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Helper function to reduce stock
const reduceStock = async (items) => {
    for (const item of items) {
        const product = await Product.findById(item.product);
        if (product) {
            product.countInStock -= item.qty;
            await product.save();
        }
    }
};

// Helper function to restore stock
const restoreStock = async (items) => {
    for (const item of items) {
        const product = await Product.findById(item.product);
        if (product) {
            product.countInStock += item.qty;
            await product.save();
        }
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res, next) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
        } else if (!paymentMethod) {
            res.status(400);
            throw new Error('Payment method is required');
        } else {
            // Check stock availability first
            for (const item of orderItems) {
                const product = await Product.findById(item._id);
                if (!product) {
                    res.status(404);
                    throw new Error(`Product not found: ${item.name}`);
                }
                if (product.countInStock < item.qty) {
                    res.status(400);
                    throw new Error(`Insufficient stock for ${item.name}. Available: ${product.countInStock}`);
                }
            }

            // Calculate prices server-side to ensure accuracy
            const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
            const shippingPrice = itemsPrice > 500 ? 0 : 50;
            const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
            const totalPrice = itemsPrice + shippingPrice + taxPrice;

            const order = new Order({
                orderItems: orderItems.map((x) => ({
                    ...x,
                    product: x._id,
                    _id: undefined,
                })),
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                status: paymentMethod === 'CashOnDelivery' ? 'Processing' : 'Payment Pending'
            });

            const createdOrder = await order.save();

            // If COD, reduce stock immediately as it's already "Processing"
            if (paymentMethod === 'CashOnDelivery') {
                await reduceStock(createdOrder.orderItems);
            }

            // If payment is Razorpay, generate an order ID from Razorpay
            if (paymentMethod === 'Razorpay') {
                if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id') {
                    console.log('Mocking Razorpay order due to placeholder API keys');
                    createdOrder.razorpayOrderId = `mock_order_${createdOrder._id}`;
                    await createdOrder.save();

                    return res.status(201).json({
                        order: createdOrder,
                        razorpayOrder: {
                            id: createdOrder.razorpayOrderId,
                            amount: Math.round(totalPrice * 100),
                            currency: "INR"
                        }
                    });
                }

                const razorpay = new Razorpay({
                    key_id: process.env.RAZORPAY_KEY_ID,
                    key_secret: process.env.RAZORPAY_KEY_SECRET,
                });

                const options = {
                    amount: Math.round(totalPrice * 100), // amount in smallest currency unit
                    currency: "INR",
                    receipt: `receipt_order_${createdOrder._id}`,
                };

                const razorpayOrder = await razorpay.orders.create(options);
                createdOrder.razorpayOrderId = razorpayOrder.id;
                await createdOrder.save();

                return res.status(201).json({
                    order: createdOrder,
                    razorpayOrder
                });
            }

            res.status(201).json({ order: createdOrder });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('deliveryAgent', 'name email phone');

        if (order) {
            res.json(order);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            // Verify Razorpay Payment Signature
            if (req.body.razorpay_payment_id) {
                const body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
                const expectedSignature = crypto
                    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                    .update(body.toString())
                    .digest("hex");

                if (expectedSignature !== req.body.razorpay_signature) {
                    res.status(400);
                    throw new Error('Invalid payment signature');
                }
            }

            order.isPaid = true;
            order.paidAt = Date.now();
            order.status = 'Processing';
            order.paymentResult = {
                id: req.body.razorpay_payment_id || req.body.id,
                status: req.body.status || 'Success',
                update_time: req.body.update_time || new Date().toISOString(),
                email_address: req.body.email_address || req.user.email,
                selected_method: req.body.selected_method
            };

            const updatedOrder = await order.save();

            // Reduce stock when payment is successful
            await reduceStock(updatedOrder.orderItems);

            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'id name email')
            .populate('deliveryAgent', 'id name email');
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

        if (!allowedStatuses.includes(status)) {
            res.status(400);
            throw new Error(`Invalid status. Must be one of: ${allowedStatuses.join(', ')}`);
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        // Check authorization: must be admin
        if (req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to update this order');
        }

        order.status = status;

        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        // Authorization check: Only the order owner or admin can cancel
        const isOwner = order.user && order.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            res.status(403);
            throw new Error('Not authorized to cancel this order');
        }

        // Restriction: Cannot cancel if already Shipped or Delivered
        if (order.status === 'Shipped' || order.status === 'Delivered') {
            res.status(400);
            throw new Error('Cannot cancel order after it has been shipped or delivered');
        }

        if (order.isCancelled) {
            res.status(400);
            throw new Error('Order is already cancelled');
        }

        const { reason } = req.body;
        if (!reason) {
            res.status(400);
            throw new Error('Cancellation reason is required');
        }

        order.status = 'Cancelled';
        order.isCancelled = true;
        order.cancelledAt = Date.now();
        order.cancellationReason = reason;

        const cancelledOrder = await order.save();

        // Restore stock only if it was actually reduced:
        // Stock is reduced at order creation for COD OR at payment for online methods
        if (order.paymentMethod === 'CashOnDelivery' || order.isPaid) {
            await restoreStock(order.orderItems);
        }

        res.json(cancelledOrder);
    } catch (error) {
        next(error);
    }
};

// @desc    Assign delivery agent to order
// @route   PUT /api/orders/:id/assign
// @access  Private/Admin
export const assignDeliveryAgent = async (req, res, next) => {
    try {
        const { deliveryAgentId } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        order.deliveryAgent = deliveryAgentId || null;

        const updatedOrder = await order.save();

        const populatedOrder = await Order.findById(updatedOrder._id)
            .populate('user', 'name email')
            .populate('deliveryAgent', 'name email');

        res.json(populatedOrder);
    } catch (error) {
        next(error);
    }
};


// @desc    Get orders for vendor (orders containing vendor's products)
// @route   GET /api/orders/vendor
// @access  Private/Vendor
export const getVendorOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({
            'orderItems.vendor': req.user._id,
        }).populate('user', 'name email');
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Get cancelled orders for vendor
// @route   GET /api/orders/vendor/cancelled
// @access  Private/Vendor
export const getVendorCancelledOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({
            'orderItems.vendor': req.user._id,
            isCancelled: true,
        }).populate('user', 'name email');
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Get cancellation statistics
// @route   GET /api/orders/cancelled/stats
// @access  Private/Admin
export const getCancelledStats = async (req, res, next) => {
    try {
        const stats = await Order.aggregate([
            { $match: { isCancelled: true } },
            { $unwind: '$orderItems' },
            {
                $group: {
                    _id: '$orderItems.vendor',
                    cancelCount: { $sum: 1 },
                    reasons: { $push: '$cancellationReason' },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'vendorInfo',
                },
            },
            { $unwind: { path: '$vendorInfo', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    cancelCount: 1,
                    reasons: 1,
                    vendorName: '$vendorInfo.name',
                    vendorEmail: '$vendorInfo.email',
                },
            },
        ]);
        res.json(stats);
    } catch (error) {
        next(error);
    }
};