import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { FiEye, FiTruck, FiMapPin, FiPhone } from 'react-icons/fi';
import moment from 'moment';

const DeliveryAssignedOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/api/delivery/assigned');
            setOrders(data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load assigned orders');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatusHandler = async (id, status) => {
        try {
            await axios.put(`/api/delivery/${id}/status`, { status });
            toast.success(`Order marked as ${status}`);
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    return (
        <div className="space-y-10 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-primary-600 to-primary-800 dark:from-white dark:via-primary-400 dark:to-primary-200">Active Assignments</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage and track your ongoing deliveries</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex items-center gap-3 text-sm font-bold text-gray-500 hover:text-primary-600 transition-all bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 active:scale-95"
                >
                    <div className={loading ? 'animate-spin' : ''}>
                        <FiTruck className="text-lg" />
                    </div>
                    <span>Refresh List</span>
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 glass rounded-[2.5rem] animate-pulse"></div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="glass p-20 rounded-[3rem] text-center space-y-6 border-2 border-dashed border-gray-200 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent"></div>
                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-[2rem] flex items-center justify-center mx-auto text-gray-300 text-4xl shadow-inner relative z-10">
                        <FiTruck />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">No active deliveries</h2>
                        <p className="text-gray-500 max-w-sm mx-auto font-medium">You currently have no orders assigned. Visit the "Order Requests" tab to claim new shipments.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {orders.map((order) => (
                        <div key={order._id} className="glass rounded-[2.5rem] p-8 shadow-xl border border-white/40 dark:border-gray-800/60 transition-all duration-300 hover:shadow-2xl relative group flex flex-col h-full hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center shadow-inner">
                                        <FiTruck className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest opacity-60">Shipment ID</p>
                                        <p className="font-mono text-sm font-black text-gray-900 dark:text-white">#{order._id.substring(0, 8).toUpperCase()}</p>
                                    </div>
                                </div>
                                <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest border shadow-sm ${order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    order.status === 'Shipped' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        order.status === 'Out for Delivery' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                            'bg-gray-50 text-gray-700 border-gray-100'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="space-y-6 flex-1">
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shrink-0 shadow-sm">
                                            <FiMapPin className="text-red-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Destination</p>
                                            <p className="font-bold text-gray-900 dark:text-white leading-tight">{order.user?.name || 'Customer'}</p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2 font-medium">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-white/40 text-center">
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Value</p>
                                        <p className="font-black text-xl text-primary-600">₹{order.totalPrice.toFixed(0)}</p>
                                    </div>
                                    <div className="bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-white/40 text-center">
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Policy</p>
                                        <p className={`font-black text-xl ${order.paymentMethod === 'CashOnDelivery' ? 'text-amber-600' : 'text-green-600'}`}>
                                            {order.paymentMethod === 'CashOnDelivery' ? 'COD' : 'PAID'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 mt-8">
                                <Link
                                    to={`/delivery/dashboard/order/${order._id}`}
                                    className="flex justify-center items-center gap-2 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                                >
                                    <FiEye className="text-base" /> View Hub Details
                                </Link>


                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeliveryAssignedOrders;
