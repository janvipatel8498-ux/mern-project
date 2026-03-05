import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { FiPackage, FiMapPin, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';

const DeliveryOrderRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/delivery/requests');
            setRequests(data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const acceptHandler = async (id) => {
        try {
            await axios.put(`/api/delivery/${id}/accept`);
            toast.success('Order accepted! Check Assigned Orders.');
            fetchRequests();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Accept failed');
        }
    };

    const rejectHandler = async (id) => {
        try {
            await axios.put(`/api/delivery/${id}/reject`);
            toast.success('Request rejected');
            fetchRequests();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Reject failed');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium animate-pulse">Checking for new requests...</p>
        </div>
    );

    return (
        <div className="space-y-10 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-primary-600 to-primary-800 dark:from-white dark:via-primary-400 dark:to-primary-200">Available Shipments</h2>
                    <p className="text-gray-500 font-medium mt-1">Claim new delivery requests in your area</p>
                </div>
                <button
                    onClick={fetchRequests}
                    className="flex items-center gap-3 text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-white transition-all bg-white dark:bg-gray-800 hover:bg-primary-600 dark:hover:bg-primary-600 px-8 py-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 active:scale-95 group"
                >
                    <FiPackage className="text-xl group-hover:rotate-12 transition-transform" />
                    <span>Refresh Feed</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-6 rounded-3xl flex items-center gap-4 border border-red-100 dark:border-red-900/20 shadow-sm animate-shake">
                    <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center text-xl shrink-0">
                        <FiAlertCircle />
                    </div>
                    <div>
                        <p className="font-black uppercase text-[10px] tracking-widest opacity-70">System Error</p>
                        <p className="font-bold">{error}</p>
                    </div>
                </div>
            )}

            {requests.length === 0 ? (
                <div className="glass p-20 rounded-[3rem] text-center space-y-6 border-2 border-dashed border-gray-200 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent"></div>
                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-[2rem] flex items-center justify-center mx-auto text-gray-300 text-4xl shadow-inner relative z-10">
                        <FiPackage />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">All Clear!</h3>
                        <p className="text-gray-500 max-w-sm mx-auto text-base font-medium">There are no new delivery requests at the moment. We'll alert you as soon as a customer places an order.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-primary">
                    <AnimatePresence mode="popLayout">
                        {requests.map((order) => (
                            <motion.div
                                key={order._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                                className="glass rounded-[2.5rem] p-8 shadow-xl border border-white/40 dark:border-gray-800/60 hover:shadow-2xl transition-all relative group overflow-hidden flex flex-col h-full active:scale-[0.98]"
                            >
                                {/* Header Info */}
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                                            <FiPackage className="text-2xl" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest opacity-60">Shipment ID</p>
                                            <p className="text-lg font-black text-gray-900 dark:text-white">#{order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-primary-500 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full uppercase tracking-widest border border-primary-100 dark:border-primary-800/50">
                                        {moment(order.createdAt).fromNow()}
                                    </span>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Customer</p>
                                                <p className="font-extrabold text-xl text-gray-900 dark:text-white">{order.user?.name}</p>
                                            </div>

                                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2 flex items-center gap-1">
                                                    <FiMapPin className="text-red-500" /> Delivery Point
                                                </p>
                                                <p className="text-sm font-bold text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                                                    {order.shippingAddress.address}, {order.shippingAddress.city}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center px-2">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Earnings/COD</p>
                                            <p className="text-3xl font-black text-primary-600">₹{order.totalPrice.toFixed(0)}</p>
                                        </div>
                                        <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${order.paymentMethod === 'CashOnDelivery'
                                                ? 'bg-amber-100 text-amber-700 border-amber-200'
                                                : 'bg-green-100 text-green-700 border-green-200'
                                            }`}>
                                            {order.paymentMethod === 'CashOnDelivery' ? 'Collect COD' : 'Prepaid'}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-4">
                                    <button
                                        onClick={() => acceptHandler(order._id)}
                                        className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:shadow-2xl hover:shadow-primary-500/40 transition-all active:scale-95 group"
                                    >
                                        <FiCheck className="text-xl group-hover:scale-125 transition-transform" />
                                        Accept Job
                                    </button>
                                    <button
                                        onClick={() => rejectHandler(order._id)}
                                        className="w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[1.5rem] transition-all active:scale-95 border border-transparent hover:border-red-100"
                                        title="Skip"
                                    >
                                        <FiX className="text-2xl" />
                                    </button>
                                </div>

                                {/* Zig-zag decorative element at bottom */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-[radial-gradient(circle,transparent_20%,#f1f5f9_20%,#f1f5f9_80%,transparent_80%,transparent),radial-gradient(circle,transparent_20%,#f1f5f9_20%,#f1f5f9_80%,transparent_80%,transparent)] bg-[length:12px_12px] bg-[position:0_0,6px_6px] dark:opacity-10"></div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default DeliveryOrderRequests;
