import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';

// A mock report generation component based on the orders and products passed
const ReportsView = () => {
    const { orders, products } = useOutletContext();

    const handleExportCSV = () => {
        if (!orders || orders.length === 0) {
            toast.error('No data to export');
            return;
        }

        // Basic CSV transformation
        const headers = 'OrderID,Date,Customer,Total,Status\n';
        const rows = orders.map(o => `${o._id},${new Date(o.createdAt).toLocaleDateString()},${o.user?.name || 'Unknown'},${o.totalPrice},${o.isPaid ? 'Paid' : 'Pending'}`).join('\n');

        const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sales_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("CSV Downloaded");
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Data Audit</h2>
                    <p className="text-gray-500 font-medium mt-1">Export high-level operational metrics and financial ledger logs</p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl flex items-center transition-all shadow-lg shadow-primary-500/20 font-black uppercase tracking-widest text-[10px] active:scale-95 border-b-4 border-primary-800"
                >
                    <FiDownload className="mr-3" size={16} /> Export Master CSV
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-10 rounded-[3rem] border border-white/40 dark:border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-bl-[5rem]"></div>
                    <div className="relative z-10 uppercase tracking-tight">
                        <h3 className="text-xl font-black mb-8 border-b border-gray-100 dark:border-white/5 pb-6 text-gray-900 dark:text-white">Revenue Assets</h3>
                        <div className="space-y-4">
                            {products && products.slice(0, 5).map((p, idx) => (
                                <div key={p._id} className="flex justify-between items-center p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm group-hover:translate-x-2 transition-transform duration-300">
                                    <div className="flex items-center gap-4">
                                        <span className="text-primary-600 font-black text-xs">{idx + 1}.</span>
                                        <span className="font-black text-gray-800 dark:text-gray-200 text-xs truncate max-w-[180px]">{p.name}</span>
                                    </div>
                                    <span className="text-emerald-600 font-black text-sm">₹{p.price.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="glass p-10 rounded-[3rem] border border-white/40 dark:border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[5rem]"></div>
                    <div className="relative z-10 uppercase tracking-tight h-full flex flex-col">
                        <h3 className="text-xl font-black mb-8 border-b border-gray-100 dark:border-white/5 pb-6 text-gray-900 dark:text-white">Fiscal Summary</h3>
                        <div className="space-y-6 flex-1 flex flex-col justify-center">
                            {[
                                { label: 'Accumulated Wealth', value: orders.reduce((acc, o) => acc + (o.isPaid ? o.totalPrice : 0), 0), color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
                                { label: 'Average Unit Value', value: (orders.length > 0 ? (orders.reduce((acc, o) => acc + o.totalPrice, 0) / orders.length) : 0), color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
                                { label: 'Pending Settlement', value: orders.reduce((acc, o) => acc + (!o.isPaid ? o.totalPrice : 0), 0), color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/10' },
                            ].map((item, i) => (
                                <div key={i} className={`flex justify-between items-center p-6 rounded-[2rem] border border-white/20 shadow-inner ${item.bg}`}>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
                                    <span className={`text-xl font-black ${item.color}`}>₹{item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ReportsView;
