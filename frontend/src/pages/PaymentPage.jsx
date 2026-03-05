import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../redux/slices/cartSlice'; // Wait, need this in cartSlice!
import { motion } from 'framer-motion';
import { FiCreditCard } from 'react-icons/fi';

const PaymentPage = () => {
    const [paymentMethod, setPaymentMethod] = useState('Razorpay');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    useEffect(() => {
        if (!shippingAddress?.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <div className="flex justify-center min-h-[calc(100vh-8rem)] bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass rounded-3xl p-8 shadow-xl"
            >
                <h2 className="text-center text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">
                    Payment Method
                </h2>
                <form onSubmit={submitHandler} className="space-y-6">
                    <div className="space-y-4">
                        <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <input
                                type="radio"
                                className="form-radio h-5 w-5 text-primary-600"
                                name="paymentMethod"
                                value="Razorpay"
                                checked={paymentMethod === 'Razorpay'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span className="ml-3 text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                <FiCreditCard className="mr-2 text-primary-500" /> Razorpay / Credit Card
                            </span>
                        </label>
                        <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <input
                                type="radio"
                                className="form-radio h-5 w-5 text-primary-600"
                                name="paymentMethod"
                                value="CashOnDelivery"
                                checked={paymentMethod === 'CashOnDelivery'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                                Cash On Delivery (COD)
                            </span>
                        </label>
                    </div>

                    <button type="submit" className="w-full btn-primary py-3 mt-8 text-lg font-medium">
                        Continue to Summary
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default PaymentPage;
