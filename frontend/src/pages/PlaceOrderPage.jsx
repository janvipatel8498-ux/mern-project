import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, payOrder, resetOrderState } from '../redux/slices/orderSlice';
import { clearCartItems } from '../redux/slices/cartSlice';
import { toast } from 'react-hot-toast';
import { FiMapPin, FiCreditCard, FiPackage } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';

const PlaceOrderPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);
    const { shippingAddress, paymentMethod, cartItems } = cart;

    const orderCreate = useSelector((state) => state.order);
    const { order, success, error, loading, razorpayOrder } = orderCreate;

    const auth = useSelector((state) => state.auth);
    const { userInfo } = auth;

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        } else if (!paymentMethod) {
            navigate('/payment');
        }
    }, [shippingAddress.address, paymentMethod, navigate]);

    useEffect(() => {
        if (success && order) {
            if (paymentMethod === 'Razorpay' && razorpayOrder) {
                // Handle Razorpay Payment Initialization
                const loadRazorpay = async () => {
                    const { data: { clientId } } = await axios.get('/api/config/razorpay');

                    if (!clientId || clientId === 'your_razorpay_key_id') {
                        // Redirect to the mock payment gateway if user hasn't put in real API keys yet
                        toast.success('Redirecting to Mock Payment Gateway...');
                        navigate(`/mock-payment/${order._id}`);
                        return;
                    }

                    const options = {
                        key: clientId,
                        amount: razorpayOrder.amount,
                        currency: "INR",
                        name: "FreshMart",
                        description: "Transaction for Order",
                        order_id: razorpayOrder.id,
                        handler: async function (response) {
                            dispatch(payOrder({ orderId: order._id, paymentResult: response }));
                            toast.success('Payment Successful');
                            dispatch(clearCartItems());
                            navigate(`/order/${order._id}`);
                        },
                        prefill: {
                            name: userInfo.name,
                            email: userInfo.email,
                        },
                        theme: { color: "#8b5cf6" },
                        modal: {
                            ondismiss: function () {
                                toast.error("Payment cancelled. Order created as unpaid.");
                                dispatch(clearCartItems());
                                navigate(`/order/${order._id}`);
                            }
                        }
                    };
                    const rzp = new window.Razorpay(options);
                    rzp.open();
                }
                loadRazorpay();
            } else {
                toast.success('Order placed successfully');
                dispatch(clearCartItems());
                navigate(`/order/${order._id}`);
            }
            dispatch(resetOrderState());
        }
        if (error) {
            toast.error(error);
            dispatch(resetOrderState());
        }
    }, [success, error, navigate, order, paymentMethod, dispatch, userInfo, razorpayOrder]);

    const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);
    const itemsPrice = addDecimals(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    const shippingPrice = addDecimals(itemsPrice > 500 ? 0 : 50);
    const taxPrice = addDecimals(Number((0.05 * itemsPrice).toFixed(2))); // 5% tax
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

    const placeOrderHandler = () => {
        if (!window.Razorpay && paymentMethod === 'Razorpay') {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => place();
            document.body.appendChild(script);
        } else {
            place();
        }
    };

    const place = () => {
        dispatch(
            createOrder({
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            })
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-dark-bg min-h-screen py-10">
            <div className="container mx-auto px-4 lg:max-w-6xl">
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">
                    Place Order
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3 space-y-6">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold mb-4 flex items-center text-primary-600 dark:text-primary-400">
                                <FiMapPin className="mr-2" /> Shipping Details
                            </h2>
                            <div className="text-gray-700 dark:text-gray-300">
                                <p className="font-medium">{userInfo.name}</p>
                                <p>{shippingAddress.address}</p>
                                <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                                <p>{shippingAddress.country}</p>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold mb-4 flex items-center text-primary-600 dark:text-primary-400">
                                <FiCreditCard className="mr-2" /> Payment Method
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 font-medium">{paymentMethod}</p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold mb-4 flex items-center text-primary-600 dark:text-primary-400">
                                <FiPackage className="mr-2" /> Order Items
                            </h2>
                            {cartItems.length === 0 ? (
                                <p>Your cart is empty</p>
                            ) : (
                                <div className="space-y-4">
                                    {cartItems.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                                            <div className="flex-grow">
                                                <Link to={`/product/${item._id}`} className="font-medium hover:text-primary-600 dark:hover:text-primary-400 line-clamp-1">{item.name}</Link>
                                            </div>
                                            <div className="font-medium whitespace-nowrap">
                                                {item.qty} x ₹{item.price} = ₹{(item.qty * item.price).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    <div className="lg:w-1/3">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-3xl p-8 sticky top-24 shadow-lg border border-primary-100 dark:border-primary-900/30">
                            <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">Order Summary</h2>

                            <div className="space-y-4 mb-6 text-gray-700 dark:text-gray-300">
                                <div className="flex justify-between"><span>Items</span><span>₹{itemsPrice}</span></div>
                                <div className="flex justify-between"><span>Shipping</span><span>₹{shippingPrice}</span></div>
                                <div className="flex justify-between"><span>Tax</span><span>₹{taxPrice}</span></div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-gray-900 dark:text-white text-lg">Total</span>
                                    <span className="text-3xl font-display font-black text-primary-600">₹{totalPrice}</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="w-full btn-primary py-4 text-lg font-bold rounded-xl flex justify-center items-center"
                                disabled={cartItems.length === 0 || loading}
                                onClick={placeOrderHandler}
                            >
                                {loading ? 'Processing...' : (paymentMethod === 'Razorpay' ? 'Pay & Place Order' : 'Place Order')}
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderPage;
