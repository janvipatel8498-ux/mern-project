import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import moment from 'moment';

const DeliveryHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const { data } = await axios.get('/api/delivery/history');
            setOrders(data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load delivery history');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div className="space-y-10 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-primary-600 to-primary-800 dark:from-white dark:via-primary-400 dark:to-primary-200">Delivery Log</h2>
                    <p className="text-gray-500 font-medium mt-1">Review your completed and failed delivery attempts</p>
                </div>
                <div className="px-6 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-bold text-gray-500 text-sm">
                    Total Records: <span className="text-primary-600 ml-1">{orders.length}</span>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-24 glass rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="glass p-20 rounded-[3rem] text-center space-y-6 border-2 border-dashed border-gray-200 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent"></div>
                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-[2rem] flex items-center justify-center mx-auto text-gray-300 text-4xl shadow-inner relative z-10">
                        <FiClock />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">Empty Log</h3>
                        <p className="text-gray-500 max-w-sm mx-auto font-medium">Your delivery history will appear here once you complete or close your first order.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="glass group rounded-[2rem] p-6 border border-white/40 dark:border-gray-800/60 transition-all hover:shadow-xl hover:border-primary-500/20 active:scale-[0.99] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-gray-100 dark:border-gray-700 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/10 transition-colors">
                                    <span className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">{moment(order.deliveredAt || order.updatedAt).format('MMM')}</span>
                                    <span className="text-xl font-black text-gray-900 dark:text-white">{moment(order.deliveredAt || order.updatedAt).format('DD')}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight">#{order._id.slice(-8).toUpperCase()}</p>
                                        <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-widest border ${order.status === 'Delivered'
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : 'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-500">Customer: <span className="text-gray-900 dark:text-gray-300 ml-1">{order.user?.name || 'Unknown'}</span></p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-8 md:gap-12 w-full md:w-auto">
                                <div className="min-w-[100px]">
                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Revenue/COD</p>
                                    <p className="text-lg font-black text-primary-600">₹{order.totalPrice.toFixed(0)}</p>
                                </div>
                                <div className="min-w-[120px]">
                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Payment Method</p>
                                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">{order.paymentMethod === 'CashOnDelivery' ? 'Cash on Delivery' : 'Prepaid'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeliveryHistory;
