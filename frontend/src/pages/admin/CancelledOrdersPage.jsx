import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCancelledStats } from '../../redux/slices/orderSlice';
import { FiXCircle, FiUser, FiAlertCircle, FiBarChart2, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const CancelledOrdersPage = () => {
    const dispatch = useDispatch();
    const { cancelledStats, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(getCancelledStats());
    }, [dispatch]);

    if (loading) return <div className="p-8 animate-pulse text-xl font-bold">Loading Stats...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Risk Control</h2>
                    <p className="text-gray-500 font-medium mt-1">Audit order cancellation protocols and recursive failure metrics</p>
                </div>
                <div className="glass px-8 py-5 rounded-[2rem] border border-white/40 dark:border-white/5 flex items-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500 opacity-5 rounded-bl-[3rem]"></div>
                    <FiXCircle className="text-red-500 text-3xl mr-4" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Disruptions</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                            {cancelledStats.reduce((acc, curr) => acc + curr.cancelCount, 0)}
                        </p>
                    </div>
                </div>
            </div>

            {cancelledStats.length === 0 ? (
                <div className="glass rounded-[3rem] p-32 text-center border border-white/40 dark:border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-50"></div>
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-inner">
                            <FiCheckCircle size={40} />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">No Disruptions Detected</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">All protocols operational</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {cancelledStats.map((stat, index) => (
                        <motion.div
                            key={stat._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5 }}
                            className="glass group rounded-[3rem] p-10 border border-white/40 dark:border-white/5 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 opacity-[0.03] rounded-bl-[5rem]"></div>

                            <div className="flex justify-between items-start mb-10 pb-8 border-b border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner group-hover:bg-red-500 transition-all duration-500">
                                        <FiUser className="text-2xl text-gray-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">{stat.adminName || 'Admin'}</h3>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 line-clamp-1">{stat.adminEmail || 'admin@freshmart.com'}</p>
                                    </div>
                                </div>
                                <div className="bg-red-500 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">
                                    {stat.cancelCount} Faults
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <FiAlertCircle className="text-red-500" />
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Recurrent Protocol Failures</h4>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {Array.from(new Set(stat.reasons)).map((reason, i) => (
                                        <span key={i} className="bg-white/50 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm group-hover:border-red-500/30 transition-all">
                                            {reason}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CancelledOrdersPage;
