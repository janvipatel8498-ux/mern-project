import { describe, it, expect, vi, beforeEach } from 'vitest';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { updateOrderToPaid } from '../controllers/orderController.js';
import Order from '../models/Order.js';

// Mock the models and external packages
vi.mock('../models/Order.js');
vi.mock('../models/Product.js');
vi.mock('../models/TaxConfig.js');
vi.mock('razorpay');

describe('Razorpay Payment Verification Test Case', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.RAZORPAY_KEY_SECRET = 'i7BFB0bOGn9DcFCKYz8eLpbg';
    });

    it('should verify Razorpay signature successfully', async () => {
        const mockOrder = {
            _id: 'sample_order_id',
            isPaid: false,
            save: vi.fn().mockResolvedValue(true),
            orderItems: []
        };

        Order.findById.mockResolvedValue(mockOrder);

        const razorpay_order_id = 'order_test_id';
        const razorpay_payment_id = 'pay_test_id';
        
        // Generate a valid signature for the test
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const req = {
            params: { id: 'sample_order_id' },
            body: {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature: expectedSignature
            },
            user: { email: 'test@example.com' }
        };

        const res = {
            json: vi.fn(),
            status: vi.fn().mockReturnThis()
        };
        const next = vi.fn((err) => {
            if (err) console.error('Next called with error:', err);
        });

        await updateOrderToPaid(req, res, next);

        if (next.mock.calls.length > 0) {
            console.error('Test failed because next was called:', next.mock.calls[0][0]);
        }

        expect(res.json).toHaveBeenCalled();
        expect(mockOrder.isPaid).toBe(true);
        expect(next).not.toHaveBeenCalled();
    });

    it('should fail if Razorpay signature is invalid', async () => {
        const mockOrder = {
            _id: 'sample_order_id',
            isPaid: false,
            save: vi.fn()
        };

        Order.findById.mockResolvedValue(mockOrder);

        const req = {
            params: { id: 'sample_order_id' },
            body: {
                razorpay_order_id: 'order_test_id',
                razorpay_payment_id: 'pay_test_id',
                razorpay_signature: 'invalid_signature'
            }
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        await updateOrderToPaid(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).toHaveBeenCalled();
        const error = next.mock.calls[0][0];
        expect(error.message).toBe('Invalid payment signature');
    });
});
