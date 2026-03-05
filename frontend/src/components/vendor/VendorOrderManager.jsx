import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiEye, FiCheckCircle, FiTruck, FiBox, FiClock, FiShoppingCart } from 'react-icons/fi';
import { getVendorOrders } from '../../redux/slices/vendorSlice';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const VendorOrderManager = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders, loading } = useSelector((state) => state.vendor);

    useEffect(() => {
        dispatch(getVendorOrders());
    }, [dispatch]);

    const updateStatusHandler = async (id, status) => {
        try {
            await axios.put(`/api/orders/${id}/status`, { status });
            toast.success(`Order status updated to ${status}`);
            dispatch(getVendorOrders());
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            case 'Shipped': return 'bg-purple-100 text-purple-700';
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-12 pb-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-display font-black text-gray-900 dark:text-white uppercase tracking-tight">Orders Hub</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage fulfillment and track customer satisfaction</p>
                </div>
                <div className="px-6 py-3 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm font-black text-xs text-gray-400 uppercase tracking-widest">
                    Active Shipments: <span className="text-primary-600 ml-1">{orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length}</span>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-24 glass rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="glass p-20 rounded-[3rem] text-center space-y-6 border-2 border-dashed border-gray-200 dark:border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent"></div>
                    <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-gray-300 text-4xl shadow-inner relative z-10">
                        <FiShoppingCart />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">Shelf is Empty</h3>
                        <p className="text-gray-500 max-w-sm mx-auto font-medium">New orders will materialize here once customers start checkout.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {orders.map((order) => (
                        <div key={order._id} className="glass group rounded-[2.5rem] p-8 border border-white/40 dark:border-white/5 transition-all hover:shadow-2xl hover:border-primary-500/20 active:scale-[0.99] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 flex-1">
                                <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-[2rem] flex flex-col items-center justify-center shrink-0 border border-gray-100 dark:border-white/10 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/10 transition-colors">
                                    <span className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short' })}</span>
                                    <span className="text-2xl font-black text-gray-900 dark:text-white">{new Date(order.createdAt).getDate()}</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-lg">#{order._id.toString().slice(-8).toUpperCase()}</p>
                                        <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest border shadow-sm ${order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                            order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                order.status === 'Shipped' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                    order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                                                        'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 text-[10px] font-black">
                                            {order.user?.name?.charAt(0)}
                                        </div>
                                        <p className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                            {order.user?.name}
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span className="text-xs font-medium lowercase italic opacity-60">{order.user?.email}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-10 lg:gap-16 w-full lg:w-auto">
                                <div className="min-w-[120px]">
                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1.5">Net Settlement</p>
                                    <p className="text-2xl font-black text-primary-600 tracking-tighter">₹{order.totalPrice.toFixed(0)}</p>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <button
                                        onClick={() => navigate(`/order/${order._id}`)}
                                        className="w-14 h-14 bg-white dark:bg-white/5 hover:bg-primary-600 dark:hover:bg-primary-600 hover:text-white rounded-2xl transition-all shadow-lg border border-gray-100 dark:border-white/5 group/btn flex items-center justify-center"
                                        title="Scan Details"
                                    >
                                        <FiEye className="text-xl group-hover/btn:scale-110 transition-transform" />
                                    </button>

                                    {order.status === 'Pending' && (
                                        <button
                                            onClick={() => updateStatusHandler(order._id, 'Processing')}
                                            className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all flex items-center gap-3"
                                        >
                                            <FiBox className="text-lg" /> Process Order
                                        </button>
                                    )}

                                    {order.status === 'Shipped' && (
                                        <button
                                            onClick={() => updateStatusHandler(order._id, 'Delivered')}
                                            className="h-14 px-8 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-1 transition-all flex items-center gap-3"
                                        >
                                            <FiCheckCircle className="text-lg" /> Finalize Work
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VendorOrderManager;
