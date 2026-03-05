import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVendorOrders, getVendorProducts } from '../../redux/slices/vendorSlice';
import { FiBell, FiPackage, FiAlertTriangle, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import moment from 'moment';
import { Link } from 'react-router-dom';

const VendorNotifications = () => {
    const dispatch = useDispatch();
    const { orders, products, loading } = useSelector((state) => state.vendor);

    useEffect(() => {
        dispatch(getVendorOrders());
        dispatch(getVendorProducts());
    }, [dispatch]);

    const outOfStockProducts = products.filter(p => p.countInStock === 0);
    const lowStockProducts = products.filter(p => p.countInStock > 0 && p.countInStock <= 10);

    // Orders placed in the last 24 hours
    const recentOrders = orders.filter(
        o => moment().diff(moment(o.createdAt), 'hours') <= 48 && o.status !== 'Cancelled'
    );

    // Sort all notifications by date (approximated for products by putting them first/last, or just using current date since they are ongoing alerts)
    // We will list alerts first, then recent orders.

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/10 rounded-2xl flex items-center justify-center text-primary-600">
                    <FiBell className="text-2xl" />
                </div>
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Notifications</h1>
                    <p className="text-gray-500">Alerts and updates for your store</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading notifications...</div>
            ) : (
                <div className="space-y-4">
                    {/* Out of stock alerts */}
                    {outOfStockProducts.map(p => (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={`oos-${p._id}`} className="glass p-6 rounded-2xl flex items-start gap-4 border-l-4 border-red-500 shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 shrink-0">
                                <FiAlertTriangle />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white">Product Out of Stock</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    <span className="font-bold">{p.name}</span> is currently out of stock. Please update your inventory to continue receiving orders.
                                </p>
                            </div>
                            <Link to="/vendor/dashboard/inventory" className="text-sm font-bold text-red-600 hover:text-red-700">Update Stock</Link>
                        </motion.div>
                    ))}

                    {/* Low stock alerts */}
                    {lowStockProducts.map(p => (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={`ls-${p._id}`} className="glass p-6 rounded-2xl flex items-start gap-4 border-l-4 border-amber-500 shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 shrink-0">
                                <FiPackage />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white">Low Stock Alert</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Only <span className="font-bold">{p.countInStock}</span> remaining for <span className="font-bold">{p.name}</span>.
                                </p>
                            </div>
                            <Link to="/vendor/dashboard/inventory" className="text-sm font-bold text-amber-600 hover:text-amber-700">Update Stock</Link>
                        </motion.div>
                    ))}

                    {/* Recent Orders */}
                    {recentOrders.map(o => (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={`ro-${o._id}`} className="glass p-6 rounded-2xl flex items-start gap-4 border-l-4 border-primary-500 shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 shrink-0">
                                <FiShoppingBag />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white">New Order Received</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    You have received a new order (<span className="font-mono text-xs">#{o._id.toString().slice(-8).toUpperCase()}</span>) formatted {moment(o.createdAt).fromNow()}.
                                </p>
                                {o.isPaid && (
                                    <p className="text-xs text-green-600 font-bold mt-2">Payment Confirmed: ₹{o.totalPrice}</p>
                                )}
                            </div>
                            <Link to={`/order/${o._id}`} className="text-sm font-bold text-primary-600 hover:text-primary-700">View Order</Link>
                        </motion.div>
                    ))}

                    {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && recentOrders.length === 0 && (
                        <div className="text-center py-16 glass rounded-3xl border border-gray-100 dark:border-gray-800">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-3xl">
                                <FiBell />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You're all caught up!</h3>
                            <p className="text-gray-500">No new alerts or notifications at this time.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VendorNotifications;
