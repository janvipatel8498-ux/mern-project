import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPackage, FiShoppingBag, FiTrendingUp, FiXCircle } from 'react-icons/fi';
import { getVendorProducts, getVendorOrders } from '../../redux/slices/vendorSlice';
import { motion } from 'framer-motion';
import { FiStar, FiClock } from 'react-icons/fi';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import moment from 'moment';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);
const VendorOverview = () => {
    const dispatch = useDispatch();
    const { products, orders, loading } = useSelector((state) => state.vendor);

    useEffect(() => {
        dispatch(getVendorProducts());
        dispatch(getVendorOrders());
    }, [dispatch]);

    // Calculations
    const totalRevenue = orders
        .filter(order => order.isPaid && order.status !== 'Cancelled')
        .reduce((acc, order) => acc + order.totalPrice, 0);

    const pendingOrders = orders.filter(
        (o) => o.status === 'Pending' || o.status === 'Processing'
    ).length;

    const productSales = {};
    orders.forEach(order => {
        if (order.status !== 'Cancelled' && order.isPaid) {
            order.orderItems.forEach(item => {
                if (item.product) {
                    productSales[item.product] = (productSales[item.product] || 0) + item.qty;
                }
            });
        }
    });

    let bestSellingProduct = 'N/A';
    let maxSales = 0;
    Object.entries(productSales).forEach(([id, qty]) => {
        if (qty > maxSales) {
            maxSales = qty;
            const prod = products.find(p => p._id === id);
            if (prod) bestSellingProduct = prod.name;
        }
    });

    // Chart Data
    const months = Array.from({ length: 6 }).map((_, i) => moment().subtract(i, 'months').format('MMM YYYY')).reverse();
    const monthlySalesData = new Array(6).fill(0);
    const monthlyOrdersData = new Array(6).fill(0);

    orders.forEach(order => {
        if (order.status !== 'Cancelled') {
            const monthStr = moment(order.createdAt).format('MMM YYYY');
            const monthIndex = months.indexOf(monthStr);
            if (monthIndex !== -1) {
                monthlyOrdersData[monthIndex] += 1;
                if (order.isPaid) {
                    monthlySalesData[monthIndex] += order.totalPrice;
                }
            }
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

    const ordersChartData = {
        labels: months,
        datasets: [{
            label: 'Number of Orders',
            data: monthlyOrdersData,
            backgroundColor: '#8b5cf6',
            borderRadius: 4,
        }]
    };

    const topProducts = Object.entries(productSales)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id, qty]) => {
            const prod = products.find(p => p._id === id);
            return { name: prod ? prod.name : 'Unknown Product', qty };
        });

    const pieChartData = {
        labels: topProducts.length > 0 ? topProducts.map(p => p.name) : ['No Data'],
        datasets: [{
            data: topProducts.length > 0 ? topProducts.map(p => p.qty) : [1],
            backgroundColor: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
            borderWidth: 0,
        }]
    };

    const chartOptions = { responsive: true, plugins: { legend: { position: 'top' } } };

    const stats = [
        { label: 'Total Products', value: products.length, icon: <FiPackage />, color: 'from-blue-600 to-blue-400', shadow: 'shadow-blue-500/20' },
        { label: 'Total Orders', value: orders.length, icon: <FiShoppingBag />, color: 'from-emerald-600 to-emerald-400', shadow: 'shadow-emerald-500/20' },
        { label: 'Total Revenue', value: `₹${totalRevenue.toFixed(0)}`, icon: <FiTrendingUp />, color: 'from-violet-600 to-violet-400', shadow: 'shadow-violet-500/20' },
        { label: 'Pending Orders', value: pendingOrders, icon: <FiClock />, color: 'from-orange-600 to-orange-400', shadow: 'shadow-orange-500/20' },
        { label: 'Best Seller', value: bestSellingProduct === 'N/A' || bestSellingProduct.length < 15 ? bestSellingProduct : bestSellingProduct.substring(0, 15) + '...', icon: <FiStar />, color: 'from-rose-600 to-rose-400', shadow: 'shadow-rose-500/20' },
    ];

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-display font-black text-gray-900 dark:text-white uppercase tracking-tight">Business Intel</h1>
                    <p className="text-gray-500 font-medium mt-1">Real-time performance metrics and store insights</p>
                </div>
                <div className="px-6 py-3 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm font-black text-xs text-gray-400 uppercase tracking-widest">
                    Last Sync: <span className="text-primary-600 ml-1">{moment().format('HH:mm')}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass group p-8 rounded-[2.5rem] border border-white/40 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700`}></div>

                        <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-500`}>
                            {stat.icon}
                        </div>

                        <div className="mt-8">
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-1">
                                {loading ? (
                                    <div className="h-8 w-16 bg-gray-200 dark:bg-white/10 animate-pulse rounded-lg"></div>
                                ) : stat.value}
                            </h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-10 rounded-[3rem] border border-white/40 dark:border-white/5 shadow-2xl relative overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Revenue Stream</h2>
                        <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-widest">
                            Growth: +12.5%
                        </div>
                    </div>
                    <div className="h-80">
                        <Line
                            data={salesChartData}
                            options={{
                                ...chartOptions,
                                plugins: { ...chartOptions.plugins, legend: { display: false } },
                                scales: {
                                    y: { grid: { display: false }, border: { display: false } },
                                    x: { grid: { display: false }, border: { display: false } }
                                }
                            }}
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-10 rounded-[3rem] border border-white/40 dark:border-white/5 shadow-2xl"
                >
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Order Volume</h2>
                        <select className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-gray-400 outline-none cursor-pointer">
                            <option>Last 6 Months</option>
                            <option>Last 12 Months</option>
                        </select>
                    </div>
                    <div className="h-80">
                        <Bar
                            data={ordersChartData}
                            options={{
                                ...chartOptions,
                                plugins: { ...chartOptions.plugins, legend: { display: false } },
                                scales: {
                                    y: { grid: { display: false }, border: { display: false } },
                                    x: { grid: { display: false }, border: { display: false } }
                                }
                            }}
                        />
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-10 rounded-[3rem] border border-white/40 dark:border-white/5 shadow-2xl lg:col-span-1"
                >
                    <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-10">Inventory Share</h2>
                    <div className="h-72 flex justify-center relative">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
                                <p className="text-2xl font-black text-gray-900 dark:text-white">{products.length}</p>
                            </div>
                        </div>
                        <Pie
                            data={pieChartData}
                            options={{
                                ...chartOptions,
                                plugins: { ...chartOptions.plugins, legend: { display: false } },
                                cutout: '75%'
                            }}
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-10 rounded-[3rem] border border-white/40 dark:border-white/5 shadow-2xl lg:col-span-2 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                        <FiTrendingUp className="text-8xl" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8">Performance Leaderboard</h2>
                    <div className="space-y-4">
                        {topProducts.map((product, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/40 dark:bg-white/5 rounded-2xl border border-white/40 dark:border-white/5 group hover:bg-white/60 dark:hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-600 font-black text-xs">
                                        {i + 1}
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{product.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-primary-600 text-sm">{product.qty} Sales</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default VendorOverview;
