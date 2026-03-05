import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiXCircle, FiCalendar, FiUser, FiInfo } from 'react-icons/fi';
import { getVendorCancelledOrders } from '../../redux/slices/vendorSlice';
import { motion } from 'framer-motion';

const VendorCancelledOrders = () => {
    const dispatch = useDispatch();
    const { cancelledOrders, loading } = useSelector((state) => state.vendor);

    useEffect(() => {
        dispatch(getVendorCancelledOrders());
    }, [dispatch]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white text-red-600">Cancelled Orders</h1>
                <p className="text-gray-500">Monitor cancellations and feedback</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : cancelledOrders.length === 0 ? (
                    <div className="glass p-12 text-center rounded-3xl">
                        <FiXCircle className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-gray-500">No cancelled orders found</h3>
                    </div>
                ) : cancelledOrders.map((order, index) => (
                    <motion.div
                        key={order._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass p-6 rounded-3xl border-l-4 border-red-500 shadow-sm"
                    >
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">#{order._id}</span>
                                    <span className="flex items-center gap-1"><FiCalendar /> {new Date(order.cancelledAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                                        <FiUser />
                                    </div>
                                    <div>
                                        <p className="font-bold">{order.user?.name}</p>
                                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 bg-red-50/50 dark:bg-red-900/5 p-4 rounded-2xl border border-red-100 dark:border-red-900/20">
                                <div className="flex items-start gap-2">
                                    <FiInfo className="text-red-500 mt-1 shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold uppercase text-red-600 tracking-wider mb-1">Cancellation Reason</p>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 italic">
                                            "{order.cancellationReason || 'No reason provided'}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center items-end">
                                <p className="text-sm text-gray-500 mb-1">Total Loss</p>
                                <p className="text-2xl font-bold text-red-600">₹{order.totalPrice}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default VendorCancelledOrders;
