import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../redux/slices/orderSlice';
import { FiPackage, FiChevronRight, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import moment from 'moment';

const MyOrdersPage = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(getMyOrders());
    }, [dispatch]);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Payment Pending': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
            case 'Delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
            case 'Shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
            case 'Processing': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">My Orders</h1>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 glass animate-pulse rounded-2xl"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="bg-red-100 text-red-700 p-4 rounded-xl">{error}</div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 glass rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-4">No orders found</h2>
                    <Link to="/products" className="btn-primary inline-block">Start Shopping</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order, index) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link to={`/order/${order._id}`} className="block group">
                                <div className="glass p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 group-hover:border-primary-200 dark:group-hover:border-primary-900/50">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400">
                                                <FiPackage className="text-2xl" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 uppercase font-black tracking-widest">Order #{order._id.substring(order._id.length - 8)}</div>
                                                <div className="font-bold text-gray-900 dark:text-white">{moment(order.createdAt).format('DD MMM YYYY')}</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                                            <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${getStatusStyles(order.status)}`}>
                                                {order.status || 'Pending'}
                                            </div>

                                            <div className="flex flex-col items-end flex-grow md:flex-grow-0">
                                                <div className="text-xl font-display font-black text-gray-900 dark:text-white">₹{order.totalPrice.toFixed(2)}</div>
                                                <div className="text-xs font-bold text-gray-400 underline uppercase tracking-widest group-hover:text-primary-600 transition-colors">Details <FiChevronRight className="inline" /></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview items */}
                                    <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800/50 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                        {order.orderItems.map((item, i) => (
                                            <img key={i} src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-md border border-gray-100 dark:border-gray-800" />
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;
