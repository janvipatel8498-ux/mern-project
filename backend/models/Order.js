import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        deliveryAgent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        codAmountCollected: {
            type: Number,
            default: 0,
        },
        deliveryNotes: {
            type: String,
        },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
                vendor: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            },
        ],
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            required: false,
        },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
            selected_method: { type: String },
        },
        itemsPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
        razorpayOrderId: {
            type: String,
        },
        status: {
            type: String,
            enum: ['Payment Pending', 'Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
        isCancelled: {
            type: Boolean,
            required: true,
            default: false,
        },
        cancelledAt: {
            type: Date,
        },
        cancellationReason: {
            type: String,
        },
        deliveryRejections: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
