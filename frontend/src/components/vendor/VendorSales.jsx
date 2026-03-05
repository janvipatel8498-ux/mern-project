import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVendorOrders, getVendorProducts } from '../../redux/slices/vendorSlice';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { FiTrendingUp, FiDollarSign, FiAlertTriangle, FiPackage } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const VendorSales = () => {
    const dispatch = useDispatch();
    const { orders, products, loading } = useSelector((state) => state.vendor);

    useEffect(() => {
        dispatch(getVendorOrders());
        dispatch(getVendorProducts());
    }, [dispatch]);

    // Total Earnings (Paid and not cancelled)
    const paidOrders = orders.filter(o => o.isPaid && o.status !== 'Cancelled');
    const totalEarnings = paidOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Monthly Earnings (Current Month)
    const currentMonthOrders = paidOrders.filter(
        o => moment(o.createdAt).isSame(moment(), 'month')
    );
    const monthlyEarnings = currentMonthOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Sales Performance Chart Data (Last 6 Months)
    const months = Array.from({ length: 6 }).map((_, i) => moment().subtract(i, 'months').format('MMM YYYY')).reverse();
    const monthlySalesData = new Array(6).fill(0);

    paidOrders.forEach(order => {
        const monthStr = moment(order.createdAt).format('MMM YYYY');
        const monthIndex = months.indexOf(monthStr);
        if (monthIndex !== -1) {
            monthlySalesData[monthIndex] += order.totalPrice;
        }
    });

    const salesChartData = {
        labels: months,
        datasets: [{
            label: 'Revenue (₹)',
            data: monthlySalesData,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            tension: 0.4,
            fill: true,
        }]
    };

    const chartOptions = { responsive: true, plugins: { legend: { position: 'top' } } };

    // Stock Alerts Logic
    const outOfStockProducts = products.filter(p => p.countInStock === 0);
    const lowStockProducts = products.filter(p => p.countInStock > 0 && p.countInStock <= 10);

    // Stock Overview Chart Data
    const stockChartData = {
        labels: products.map(p => p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name),
        datasets: [{
            label: 'Stock Quantity',
            data: products.map(p => p.countInStock),
            backgroundColor: 'rgba(16, 185, 129, 0.4)', // emerald
            borderColor: '#10b981',
            borderWidth: 1,
            borderRadius: 4,
        }]
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Sales & Revenue</h1>
                <p className="text-gray-500">Track your earnings and business growth.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-3xl flex items-center gap-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="w-16 h-16 bg-green-50 text-green-600 dark:bg-green-900/10 dark:text-green-400 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                        <FiDollarSign />
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Total Earnings</p>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">₹{totalEarnings.toFixed(2)}</h2>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-8 rounded-3xl flex items-center gap-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 dark:bg-blue-900/10 dark:text-blue-400 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                        <FiTrendingUp />
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">This Month</p>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">₹{monthlyEarnings.toFixed(2)}</h2>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Revenue Performance (Past 6 Months)</h2>
                    {loading ? <div className="h-72 flex items-center justify-center text-gray-400">Loading chart...</div> : (
                        <div className="h-96">
                            <Line data={salesChartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
                        </div>
                    )}
                </div>

                <div className="glass p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Current Stock Levels</h2>
                    {loading ? <div className="h-72 flex items-center justify-center text-gray-400">Loading chart...</div> : products.length === 0 ? (
                        <div className="h-96 flex flex-col items-center justify-center text-gray-400">
                            <FiPackage className="text-4xl mb-4 text-gray-300" />
                            <p>No products available yet.</p>
                        </div>
                    ) : (
                        <div className="h-96">
                            <Bar data={stockChartData} options={{ ...chartOptions, maintainAspectRatio: false, indexAxis: 'y' }} />
                        </div>
                    )}
                </div>
            </div>

            {/* Critical Stock Alerts */}
            {(outOfStockProducts.length > 0 || lowStockProducts.length > 0) && (
                <div className="glass p-8 rounded-3xl shadow-sm border border-orange-100 dark:border-orange-900/30">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                        <FiAlertTriangle className="text-orange-500" />
                        Critical Stock Alerts
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence>
                            {outOfStockProducts.map(p => (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={`os-${p._id}`} className="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl flex items-start gap-4 border border-red-100 dark:border-red-900/30">
                                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 shrink-0">
                                        <FiAlertTriangle />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-red-900 dark:text-red-100">Out of Stock</h4>
                                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                            <span className="font-bold">{p.name}</span> has run out.
                                        </p>
                                    </div>
                                    <Link to="/vendor/dashboard/inventory" className="text-sm font-bold text-red-600 hover:underline">Update</Link>
                                </motion.div>
                            ))}
                            {lowStockProducts.map(p => (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={`ls-${p._id}`} className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl flex items-start gap-4 border border-orange-100 dark:border-orange-900/30">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 shrink-0">
                                        <FiPackage />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-orange-900 dark:text-orange-100">Low Stock</h4>
                                        <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                                            Only <span className="font-bold">{p.countInStock} {p.unit}</span> left for <span className="font-bold">{p.name}</span>.
                                        </p>
                                    </div>
                                    <Link to="/vendor/dashboard/inventory" className="text-sm font-bold text-orange-600 hover:underline">Restock</Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorSales;
