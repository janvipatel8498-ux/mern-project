import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosInstance';
import { motion } from 'framer-motion';
import { FiTruck, FiBox, FiCheckCircle, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const DeliveryOverview = () => {
    const [stats, setStats] = useState({
        assignedOrders: 0,
        outForDelivery: 0,
        deliveredToday: 0,
        codCollectedToday: 0,
        requestsCount: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const { data } = await axios.get('/api/delivery/dashboard');
            setStats(data);
            setLoading(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load dashboard stats');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Available Requests', value: stats.requestsCount, icon: <FiBox />, color: 'indigo' },
        { label: 'Assigned Orders', value: stats.assignedOrders, icon: <FiTruck />, color: 'blue' },
        { label: 'Out for Delivery', value: stats.outForDelivery, icon: <FiTruck />, color: 'amber' },
        { label: 'Delivered Today', value: stats.deliveredToday, icon: <FiCheckCircle />, color: 'green' },
        { label: 'COD Collected (Today)', value: `₹${stats.codCollectedToday.toFixed(0)}`, icon: <FiDollarSign />, color: 'purple' },
    ];

    const colorClasses = {
        indigo: 'from-indigo-500/20 to-indigo-600/5 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-500/20',
        blue: 'from-blue-500/20 to-blue-600/5 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-500/20',
        green: 'from-green-500/20 to-green-600/5 text-green-600 dark:text-green-400 border-green-200/50 dark:border-green-500/20',
        amber: 'from-amber-500/20 to-amber-600/5 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20',
        purple: 'from-purple-500/20 to-purple-600/5 text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-500/20',
    };

    const iconBgClasses = {
        indigo: 'bg-indigo-500 text-white shadow-indigo-500/20',
        blue: 'bg-blue-500 text-white shadow-blue-500/20',
        green: 'bg-green-500 text-white shadow-green-500/20',
        amber: 'bg-amber-500 text-white shadow-amber-500/20',
        purple: 'bg-purple-500 text-white shadow-purple-500/20',
    };

    return (
        <div className="space-y-10 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white/40 dark:bg-gray-800/20 p-8 rounded-[2.5rem] border border-white/40 dark:border-gray-800/40 backdrop-blur-sm">
                <div>
                    <h1 className="text-4xl font-display font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Delivery Overview</h1>
                    <p className="text-gray-500 font-medium">Monitor your delivery metrics and COD earnings in real-time</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="px-6 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 rounded-2xl font-bold hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 active:scale-95 flex items-center gap-2"
                >
                    <div className={loading ? 'animate-spin' : ''}>
                        <FiCheckCircle className="w-5 h-5" />
                    </div>
                    Refresh Dashboard
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className={`group relative overflow-hidden bg-gradient-to-br ${colorClasses[stat.color]} p-6 rounded-[2rem] border backdrop-blur-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                    >
                        <div className="flex flex-col h-full justify-between items-start relative z-10">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg border-2 border-white/20 ${iconBgClasses[stat.color]}`}>
                                {stat.icon}
                            </div>
                            <div className="mt-6">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-black tracking-tight">
                                    {loading ? (
                                        <span className="flex gap-1">
                                            <span className="w-2 h-2 bg-current rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                        </span>
                                    ) : stat.value}
                                </h3>
                            </div>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-current opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass p-10 rounded-[2.5rem] shadow-xl border border-white/40 dark:border-gray-800/60 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                    <h2 className="text-2xl font-black mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <FiTruck className="w-5 h-5" />
                        </div>
                        Delivery Excellence Guide
                    </h2>

                    <div className="space-y-6 relative z-10">
                        {[
                            { step: '01', title: 'Claim Shipments', desc: 'Monitor the "Order Requests" tab for high-value deliveries near you.' },
                            { step: '02', title: 'Swift Dispatch', desc: 'Keep your status updated to "Out for Delivery" for precise tracking.' },
                            { step: '03', title: 'Secure Collection', desc: 'Ensure COD amounts are collected accurately before completion.' },
                            { step: '04', title: 'Closing Cycle', desc: 'Input collected COD data and mark as "Delivered" instantly.' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-6 group/item p-4 rounded-3xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors duration-300 border border-transparent hover:border-white/20">
                                <span className="text-4xl font-black text-gray-100 dark:text-gray-800 group-hover/item:text-primary-500/20 transition-colors uppercase font-display">{item.step}</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass p-10 rounded-[2.5rem] shadow-xl border border-white/40 dark:border-gray-800/60 flex flex-col justify-center items-center text-center space-y-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent"></div>
                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white text-4xl shadow-2xl relative z-10">
                        <FiCheckCircle />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">Agent Performance</h3>
                        <p className="text-sm text-gray-500 font-medium">You are doing great! Keep maintaining high delivery speed and COD accuracy.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryOverview;
