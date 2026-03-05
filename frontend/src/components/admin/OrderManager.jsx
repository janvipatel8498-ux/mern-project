import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiFilter, FiCheck, FiX, FiEye, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';

const OrderManager = () => {
    const { orders, handleOrderUpdate } = useOutletContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All'); // All, Paid, Pending, Delivered

    const handleDeliver = async (id) => {
        try {
            await axios.put(`/api/orders/${id}/deliver`, {}, { withCredentials: true });
            toast.success('Order marked as Delivered');
            if (handleOrderUpdate) handleOrderUpdate(); // trigger refresh
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    };

    const downloadInvoice = (order) => {
        const doc = new jsPDF();

        // --- Header / Branding ---
        doc.setFontSize(22);
        doc.setTextColor(37, 99, 235); // Blue-600
        doc.text('FRESHMART', 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Your Fresh Daily Essential Store', 14, 25);
        doc.text('123 Green Valley, Organic City, India', 14, 30);
        doc.text('Support: support@freshmart.com', 14, 35);

        // --- Horizontal Line ---
        doc.setDrawColor(200);
        doc.line(14, 40, 196, 40);

        // --- Bill To & Order Info ---
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.setFont('helvetica', 'bold');
        doc.text('BILL TO:', 14, 50);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(order.user?.name || 'Customer', 14, 55);
        doc.text(order.user?.email || 'N/A', 14, 60);
        doc.text(`${order.shippingAddress.address}`, 14, 65);
        doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, 14, 70);
        doc.text(`${order.shippingAddress.country}`, 14, 75);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('ORDER INFO:', 120, 50);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Invoice No: INV-${order._id.substring(order._id.length - 8).toUpperCase()}`, 120, 55);
        doc.text(`Order Date: ${moment(order.createdAt).format('DD MMM YYYY')}`, 120, 60);
        doc.text(`Payment: ${order.paymentMethod || 'Paid'}`, 120, 65);
        doc.text(`Status: ${order.status}`, 120, 70);

        // --- Recalculate itemsPrice if it's 0 (failsafe for old orders) ---
        const calcItemsPrice = order.itemsPrice > 0 ? order.itemsPrice :
            order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
        const calcShippingPrice = order.shippingPrice > 0 ? order.shippingPrice :
            (calcItemsPrice > 500 ? 0 : 50);
        const calcTaxPrice = order.taxPrice > 0 ? order.taxPrice :
            Number((0.05 * calcItemsPrice).toFixed(2));
        const calcTotalPrice = order.totalPrice > 0 ? order.totalPrice :
            (calcItemsPrice + calcShippingPrice + calcTaxPrice);

        // --- Table ---
        const tableColumn = ["Product Description", "Price (INR)", "Qty", "Amount (INR)"];
        const tableRows = order.orderItems.map(item => [
            item.name,
            item.price.toFixed(2),
            item.qty,
            (item.qty * item.price).toFixed(2)
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 85,
            theme: 'striped',
            headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
            styles: { fontSize: 9, cellPadding: 3 },
            columnStyles: {
                0: { cellWidth: 80 },
                1: { halign: 'center' },
                2: { halign: 'center' },
                3: { halign: 'right' }
            }
        });

        // --- Summary ---
        const finalY = doc.lastAutoTable.finalY + 10;
        const summaryX = 135; // Moved slightly left to avoid overlap

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Subtotal:', summaryX, finalY);
        doc.text('Shipping:', summaryX, finalY + 7);
        doc.text('Tax (GST):', summaryX, finalY + 14);

        doc.setTextColor(0);
        doc.text(`Rs. ${calcItemsPrice.toFixed(2)}`, 196, finalY, { align: 'right' });
        doc.text(`Rs. ${calcShippingPrice.toFixed(2)}`, 196, finalY + 7, { align: 'right' });
        doc.text(`Rs. ${calcTaxPrice.toFixed(2)}`, 196, finalY + 14, { align: 'right' });

        doc.setLineWidth(0.5);
        doc.setDrawColor(37, 99, 235);
        doc.line(summaryX, finalY + 18, 196, finalY + 18);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Total Amount:', summaryX, finalY + 25);
        doc.text(`Rs. ${calcTotalPrice.toFixed(2)}`, 196, finalY + 25, { align: 'right' });

        // --- Footer ---
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for shopping with FreshMart!', 105, pageHeight - 20, { align: 'center' });
        doc.text('This is a computer generated invoice.', 105, pageHeight - 15, { align: 'center' });

        doc.save(`FreshMart_Invoice_${order._id.substring(order._id.length - 6)}.pdf`);
    };

    let filteredOrders = orders;

    if (filter === 'Paid') filteredOrders = filteredOrders.filter(o => o.isPaid);
    if (filter === 'Pending') filteredOrders = filteredOrders.filter(o => !o.isPaid);
    if (filter === 'Delivered') filteredOrders = filteredOrders.filter(o => o.isDelivered);

    if (searchTerm) {
        filteredOrders = filteredOrders.filter(order =>
            order._id.includes(searchTerm) ||
            (order.user && order.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Order Feed</h2>
                    <p className="text-gray-500 font-medium mt-1">Track system throughput and manage customer fulfillment</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="flex glass p-1 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        {['All', 'Paid', 'Pending', 'Delivered'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                                    : 'text-gray-500 hover:text-primary-600'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="relative flex-1 sm:w-64">
                        <input
                            type="text"
                            placeholder="Search hash..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none font-bold text-sm shadow-sm transition-all text-gray-900 dark:text-white"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <FiSearch size={18} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredOrders.length === 0 ? (
                    <div className="col-span-full glass p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200 dark:border-white/10">
                        <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No transactions identified</p>
                    </div>
                ) : filteredOrders.map(order => (
                    <motion.div
                        key={order._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5 }}
                        className="glass group rounded-[2.5rem] p-8 border border-white/40 dark:border-white/5 transition-all hover:shadow-2xl hover:border-primary-500/20 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 opacity-[0.02] rounded-bl-[5rem]"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">TX Hash</p>
                                    <h3 className="font-mono font-black text-gray-900 dark:text-white text-lg">#{order._id.substring(18).toUpperCase()}</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                        {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${order.isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                                        {order.isPaid ? 'Settled' : 'Pending'}
                                    </span>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${order.isDelivered ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}>
                                        {order.isDelivered ? 'Dispatched' : 'Processing'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 bg-white/50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-inner">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Beneficiary</p>
                                        <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight">{order.user?.name || 'Guest User'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Volume</p>
                                        <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight">{order.orderItems.length} SKU</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end border-t border-gray-100 dark:border-white/5 pt-4">
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Total Valuation</p>
                                    <span className="text-2xl font-black bg-gradient-to-br from-primary-600 to-blue-600 bg-clip-text text-transparent">₹{order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="pt-6 flex items-center justify-end">

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => downloadInvoice(order)}
                                        className="p-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-all shadow-sm"
                                        title="Generate Manifest"
                                    >
                                        <FiDownload size={16} />
                                    </button>
                                    {!order.isDelivered && order.isPaid && (
                                        <button
                                            onClick={() => handleDeliver(order._id)}
                                            className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all shadow-sm"
                                            title="Mark Dispatched"
                                        >
                                            <FiCheck size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default OrderManager;
