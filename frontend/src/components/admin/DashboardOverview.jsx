import React from 'react';
import { motion } from 'framer-motion';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { FiUsers, FiShoppingBag, FiDollarSign, FiPackage, FiClock, FiUserCheck } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useOutletContext } from 'react-router-dom';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const DashboardOverview = () => {
    const { orders, users, products } = useOutletContext();

    // Analytics Derived Data
    const totalSales = (orders || []).reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);
    const pendingOrdersCount = (orders || []).filter(o => !o.isDelivered).length;
    const customersCount = (users || []).filter(u => u.role === 'user').length;
    const vendorsCount = (users || []).filter(u => u.role === 'vendor').length;
    const productsCount = (products || []).length;

    // Updated colors for a more premium look
    const purpleGradient = (ctx) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.5)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
        return gradient;
    };

    const salesData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Revenue',
                data: [12000, 19000, 30000, 50000, 20000, totalSales > 0 ? totalSales : 45000],
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderColor: '#8B5CF6',
                borderWidth: 4,
                pointBackgroundColor: '#8B5CF6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                tension: 0.4,
                fill: true,
            }
        ]
    };

    const ordersData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Orders',
                data: [120, 190, 130, 250, 120, orders.length > 0 ? orders.length : 180],
                backgroundColor: 'rgba(56, 189, 248, 0.8)',
                borderRadius: 12,
                hoverBackgroundColor: '#0EA5E9',
            }
        ]
    };

    const topProductsData = {
        labels: ['Organic', 'Bakery', 'Dairy', 'Produce'],
        datasets: [
            {
                data: [35, 25, 20, 20],
                backgroundColor: [
                    'rgba(139, 92, 246, 0.9)',
                    'rgba(56, 189, 248, 0.9)',
                    'rgba(34, 197, 94, 0.9)',
                    'rgba(249, 115, 22, 0.9)',
                ],
                borderWidth: 0,
                hoverOffset: 15,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                displayColors: false,
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(0,0,0,0.03)', drawBorder: false },
                ticks: { color: '#94a3b8', font: { weight: 'bold', size: 10 } }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8', font: { weight: 'bold', size: 10 } }
            }
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {[
                    { label: 'Revenue', value: `₹${totalSales.toLocaleString()}`, icon: <FiDollarSign />, color: 'from-emerald-600 to-teal-500', bg: 'bg-emerald-500/10' },
                    { label: 'Orders', value: orders.length.toLocaleString(), icon: <FiShoppingBag />, color: 'from-blue-600 to-primary-500', bg: 'bg-primary-500/10' },
                    { label: 'Waitlist', value: pendingOrdersCount, icon: <FiClock />, color: 'from-amber-600 to-orange-500', bg: 'bg-amber-500/10' },
                    { label: 'Civilians', value: customersCount.toLocaleString(), icon: <FiUsers />, color: 'from-purple-600 to-indigo-500', bg: 'bg-purple-500/10' },
                    { label: 'Partners', value: vendorsCount, icon: <FiUserCheck />, color: 'from-pink-600 to-rose-500', bg: 'bg-pink-500/10' },
                    { label: 'Assets', value: productsCount.toLocaleString(), icon: <FiPackage />, color: 'from-cyan-600 to-blue-500', bg: 'bg-cyan-500/10' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="glass relative overflow-hidden group p-8 rounded-[2.5rem] border border-white/40 dark:border-white/5 shadow-2xl transition-all duration-500"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-[0.04] group-hover:opacity-[0.1] transition-opacity rounded-bl-[5rem]`}></div>
                        <div className="relative z-10 space-y-5">
                            <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center text-2xl border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                {React.cloneElement(stat.icon, { className: `bg-gradient-to-br ${stat.color} bg-clip-text text-transparent` })}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{stat.value}</h3>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                <div className="glass p-10 rounded-[3.5rem] border border-white/40 dark:border-white/5 shadow-2xl col-span-1 lg:col-span-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary-500/10 transition-all duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Financial Trajectory</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Global revenue performance index</p>
                            </div>
                            <div className="px-5 py-2.5 bg-emerald-500/10 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-pulse border border-emerald-500/20">
                                Live Telemetry
                            </div>
                        </div>
                        <div className="h-96">
                            <Line data={salesData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                <div className="glass p-10 rounded-[3.5rem] border border-white/40 dark:border-white/5 shadow-2xl col-span-1 relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-10">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Market Domain</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Category asset distribution</p>
                        </div>
                        <div className="flex-1 flex items-center justify-center min-h-[300px]">
                            <Pie
                                data={topProductsData}
                                options={{
                                    ...chartOptions,
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'bottom',
                                            labels: { usePointStyle: true, pointStyle: 'circle', padding: 25, font: { weight: '900', size: 10 } }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="glass p-10 rounded-[3.5rem] border border-white/40 dark:border-white/5 shadow-2xl col-span-1 lg:col-span-3 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Operational Load</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Monthly transaction throughput</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50"></div>
                            </div>
                        </div>
                        <div className="h-80">
                            <Bar data={ordersData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DashboardOverview;
