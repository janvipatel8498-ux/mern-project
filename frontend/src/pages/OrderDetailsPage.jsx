import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, cancelOrder } from '../redux/slices/orderSlice';
import { createProductReview, resetReview } from '../redux/slices/productSlice';
import axios from '../utils/axiosInstance';
import Rating from '../components/Rating';
import { FiDownload, FiCheckCircle, FiClock, FiMapPin, FiCreditCard, FiXCircle, FiAlertCircle, FiStar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import toast from 'react-hot-toast';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const [showCancelModal, setShowCancelModal] = React.useState(false);
    const [cancelReason, setCancelReason] = React.useState('');

    const { order, loading, error } = useSelector((state) => state.order);
    const { userInfo } = useSelector((state) => state.auth);
    const { successReview, loadingReview, errorReview } = useSelector((state) => state.products);

    const [deliveryAgents, setDeliveryAgents] = React.useState([]);
    const [selectedAgent, setSelectedAgent] = React.useState('');
    const [isAssigning, setIsAssigning] = React.useState(false);

    const [showReviewModal, setShowReviewModal] = React.useState(false);
    const [reviewProductId, setReviewProductId] = React.useState('');
    const [reviewRating, setReviewRating] = React.useState(0);
    const [reviewComment, setReviewComment] = React.useState('');

    useEffect(() => {
        dispatch(getOrderDetails(id));
        if (userInfo?.role === 'admin') {
            fetchDeliveryAgents();
        }
    }, [dispatch, id, userInfo]);

    useEffect(() => {
        if (successReview) {
            toast.success('Review submitted successfully');
            setReviewRating(0);
            setReviewComment('');
            setShowReviewModal(false);
            dispatch(resetReview());
            dispatch(getOrderDetails(id));
        }
        if (errorReview) {
            toast.error(errorReview);
            dispatch(resetReview());
        }
    }, [successReview, errorReview, dispatch, id]);

    const fetchDeliveryAgents = async () => {
        try {
            const { data } = await axios.get('/api/users?role=delivery');
            setDeliveryAgents(data);
        } catch (err) {
            console.error('Failed to fetch delivery agents');
        }
    };

    const handleAssignAgent = async () => {
        if (!selectedAgent) {
            toast.error('Please select an agent');
            return;
        }
        setIsAssigning(true);
        try {
            await axios.put(`/api/orders/${id}/assign`, { deliveryAgentId: selectedAgent });
            toast.success('Agent assigned successfully');
            dispatch(getOrderDetails(id));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Assignment failed');
        } finally {
            setIsAssigning(false);
        }
    };

    const submitReviewHandler = () => {
        if (reviewRating === 0) {
            toast.error('Please select a rating');
            return;
        }
        dispatch(createProductReview({
            productId: reviewProductId,
            review: { rating: reviewRating, comment: reviewComment }
        }));
    };

    const handleCancelOrder = () => {
        if (!cancelReason.trim()) {
            toast.error('Please enter a reason for cancellation');
            return;
        }
        dispatch(cancelOrder({ orderId: id, reason: cancelReason }))
            .unwrap()
            .then(() => {
                toast.success('Order cancelled successfully');
                setShowCancelModal(false);
                setCancelReason('');
            })
            .catch((err) => {
                toast.error(err);
            });
    };

    const downloadInvoice = () => {
        if (!order) return;
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

    if (loading) return <div className="text-center py-20 animate-pulse text-2xl font-bold">Loading Order Details...</div>;
    if (error) return <div className="text-red-500 text-center py-20">{error}</div>;
    if (!order) return null;

    return (
        <div className="bg-gray-50 dark:bg-dark-bg min-h-screen py-10">
            <div className="container mx-auto px-4 lg:max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                        Order Details
                    </h1>
                    <span className="text-gray-500 font-medium">#{order._id}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3 space-y-6">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold mb-4 flex items-center text-primary-600 dark:text-primary-400">
                                <FiMapPin className="mr-2" /> Shipping Details
                            </h2>
                            <div className="text-gray-700 dark:text-gray-300 mb-4">
                                <p className="font-medium text-lg text-gray-900 dark:text-white mb-2">{order.user.name}</p>
                                <p><a href={`mailto:${order.user.email}`} className="text-primary-600 hover:underline">{order.user.email}</a></p>
                                <p className="mt-2">{order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                            </div>
                            {order.isDelivered ? (
                                <div className="bg-green-100 text-green-800 px-4 py-3 rounded-xl flex items-center font-medium mb-4">
                                    <FiCheckCircle className="mr-2" /> Delivered on {moment(order.deliveredAt).format('MMM DD, YYYY')}
                                </div>
                            ) : (
                                <div className={`px-4 py-3 rounded-xl flex items-center font-medium mb-4 ${order.status === 'Payment Pending' ? 'bg-red-100 text-red-800' : order.status === 'Cancelled' ? 'bg-gray-100 text-gray-800' : 'bg-orange-100 text-orange-800'}`}>
                                    {order.status === 'Cancelled' ? <FiXCircle className="mr-2" /> : <FiClock className="mr-2" />}
                                    Current Status: {order.status}
                                </div>
                            )}

                            {order.isCancelled && (
                                <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-6">
                                    <div className="flex items-center text-red-700 font-bold mb-1">
                                        <FiAlertCircle className="mr-2" /> Order Cancelled
                                    </div>
                                    <p className="text-red-600 text-sm"><span className="font-bold">Reason:</span> {order.cancellationReason}</p>
                                    <p className="text-red-400 text-[10px] mt-1">Cancelled on {moment(order.cancelledAt).format('DD MMM YYYY, hh:mm A')}</p>
                                </div>
                            )}

                            {/* Role-based Cancel Button */}
                            {!order.isCancelled && order.status !== 'Shipped' && order.status !== 'Delivered' && (
                                userInfo._id === order.user._id || userInfo.role === 'admin'
                            ) && (
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        className="mb-6 flex items-center bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-all font-bold text-sm border border-red-100 dark:border-red-900/30 shadow-sm"
                                    >
                                        <FiXCircle className="mr-2" /> Cancel Order
                                    </button>
                                )}

                            <div className="relative mt-8 mb-4">
                                <div className="flex justify-between mb-2">
                                    {[
                                        { status: 'Payment Pending', label: 'Ordered' },
                                        { status: 'Pending', label: 'Confirmed' },
                                        { status: 'Processing', label: 'Processing' },
                                        { status: 'Shipped', label: 'Shipped' },
                                        { status: 'Out for Delivery', label: 'Out for Delivery' },
                                        { status: 'Delivered', label: 'Delivered' }
                                    ].map((step, index) => {
                                        const statuses = ['Payment Pending', 'Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
                                        const currentIndex = statuses.indexOf(order.status);
                                        const stepIndex = statuses.indexOf(step.status);
                                        const isActive = order.isDelivered || (currentIndex >= stepIndex && order.status !== 'Cancelled');

                                        return (
                                            <div key={step.status} className="flex flex-col items-center flex-1 relative">
                                                {/* Line */}
                                                {index !== 0 && (
                                                    <div className={`absolute left-[-50%] top-1 mt-[7px] w-full h-1 z-0 ${isActive ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-800'}`}></div>
                                                )}
                                                {/* Point */}
                                                <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full z-10 border-2 ${isActive ? 'bg-primary-500 border-primary-500' : 'bg-white dark:bg-dark-bg border-gray-300 dark:border-gray-700'}`}></div>
                                                {/* Label */}
                                                <span className={`mt-2 text-[7px] sm:text-[9px] uppercase font-bold text-center leading-tight h-8 flex items-center justify-center px-1 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Admin Assignment UI */}
                            {userInfo?.role === 'admin' && !order.isDelivered && order.status !== 'Cancelled' && (
                                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Assign Delivery Agent</h3>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <select
                                            value={selectedAgent || (order.deliveryAgent?._id || '')}
                                            onChange={(e) => setSelectedAgent(e.target.value)}
                                            className="flex-1 input-field bg-white"
                                        >
                                            <option value="">Select Delivery Agent</option>
                                            {deliveryAgents.map(agent => (
                                                <option key={agent._id} value={agent._id}>
                                                    {agent.name} {agent.isOnline === false ? '(Offline)' : '(Online)'}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleAssignAgent}
                                            disabled={isAssigning}
                                            className="btn-primary px-8 py-3 rounded-xl shadow-lg"
                                        >
                                            {isAssigning ? 'Assigning...' : 'Assign Agent'}
                                        </button>
                                    </div>
                                    {order.deliveryAgent && (
                                        <p className="mt-3 text-sm text-primary-600 font-bold">
                                            Currently assigned to: {order.deliveryAgent.name}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Delivery Info for Non-Admins */}
                            {order.deliveryAgent && userInfo?.role !== 'admin' && (
                                <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-900/20">
                                    <h3 className="text-sm font-bold text-primary-700 dark:text-primary-400 uppercase tracking-wider mb-2">Delivery Partner</h3>
                                    <p className="text-gray-900 dark:text-white font-bold">{order.deliveryAgent.name}</p>
                                    {order.deliveryNotes && (
                                        <p className="mt-2 text-xs text-gray-500 italic"><span className="font-bold">Notes:</span> {order.deliveryNotes}</p>
                                    )}
                                </div>
                            )}
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold mb-4 flex items-center text-primary-600 dark:text-primary-400">
                                <FiCreditCard className="mr-2" /> Payment Method
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 font-medium mb-4">
                                {order.paymentMethod} {order.paymentResult?.selected_method && `(${order.paymentResult.selected_method})`}
                            </p>
                            {order.isPaid ? (
                                <div className="bg-green-100 text-green-800 px-4 py-3 rounded-xl flex items-center font-medium">
                                    <FiCheckCircle className="mr-2" /> Paid on {moment(order.paidAt).format('MMM DD, YYYY, hh:mm A')}
                                </div>
                            ) : (
                                <div className="bg-red-100 text-red-800 px-4 py-3 rounded-xl flex items-center font-medium">
                                    <FiClock className="mr-2" /> Not Paid
                                </div>
                            )}
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <h2 className="text-xl font-bold mb-6 flex items-center text-primary-600 dark:text-primary-400 px-2">
                                Order Items
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 text-xs uppercase tracking-widest font-bold">
                                            <th className="px-2 pb-4">Product</th>
                                            <th className="px-2 pb-4 text-center">Quantity</th>
                                            <th className="px-2 pb-4 text-center">Price</th>
                                            <th className="px-2 pb-4 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                        {order.orderItems.map((item, index) => (
                                            <tr key={index} className="group">
                                                <td className="py-4 px-2">
                                                    <div className="flex items-center gap-4">
                                                        <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform" />
                                                        <Link to={`/product/${item.product}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 max-w-[200px]">{item.name}</Link>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-2 text-center font-medium text-gray-600 dark:text-gray-400">{item.qty}</td>
                                                <td className="py-4 px-2 text-center font-medium text-gray-600 dark:text-gray-400">₹{item.price.toFixed(2)}</td>
                                                <td className="py-4 px-2 text-right font-bold text-gray-900 dark:text-white">
                                                    <div>₹{(item.qty * item.price).toFixed(2)}</div>
                                                    {order.isDelivered && (
                                                        <button
                                                            onClick={() => {
                                                                setReviewProductId(item.product);
                                                                setShowReviewModal(true);
                                                            }}
                                                            className="mt-2 text-xs text-primary-600 hover:underline font-bold"
                                                        >
                                                            Rate Product
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:w-1/3">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-3xl p-8 sticky top-24 shadow-lg border border-primary-100 dark:border-primary-900/30">
                            <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">Order Summary</h2>

                            <div className="space-y-4 mb-6 text-gray-700 dark:text-gray-300">
                                <div className="flex justify-between font-medium"><span>Items Subtotal</span><span>₹{order.itemsPrice.toFixed(2)}</span></div>
                                <div className="flex justify-between text-sm"><span>Shipping Fee</span><span>₹{order.shippingPrice.toFixed(2)}</span></div>
                                <div className="flex justify-between text-sm"><span>Tax (GST 5%)</span><span>₹{order.taxPrice.toFixed(2)}</span></div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-8">
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 text-sm font-medium">Final Price</span>
                                        <span className="font-bold text-gray-900 dark:text-white text-xl">Grand Total</span>
                                    </div>
                                    <span className="text-4xl font-display font-black text-primary-600">₹{order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {(order.isPaid ||
                                userInfo.role === 'admin' ||
                                order.paymentMethod === 'CashOnDelivery' ||
                                order.orderItems.some(item => item.user === userInfo._id)) && (
                                    <button
                                        onClick={downloadInvoice}
                                        className="w-full btn-secondary bg-white dark:bg-dark-surface border-2 border-primary-600 text-primary-600 dark:text-primary-400 py-4 text-lg font-bold rounded-xl flex justify-center items-center hover:bg-primary-50 dark:hover:bg-gray-800 transition-all"
                                    >
                                        <FiDownload className="mr-3" /> Download Invoice
                                    </button>
                                )}
                        </motion.div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showCancelModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCancelModal(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white dark:bg-dark-surface rounded-3xl p-8 shadow-2xl max-w-md w-full border border-gray-100 dark:border-gray-800"
                        >
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                                <FiAlertCircle className="mr-3 text-red-500" /> Cancel Order?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                We're sorry to see you cancel. Please tell us the reason why:
                            </p>

                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="E.g., Ordered by mistake, found better price elsewhere..."
                                className="w-full h-32 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all mb-6 resize-none"
                            ></textarea>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 py-3 px-6 rounded-xl font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 transition-all"
                                >
                                    Go Back
                                </button>
                                <button
                                    onClick={handleCancelOrder}
                                    className="flex-1 py-3 px-6 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200 dark:shadow-none transition-all"
                                >
                                    Confirm Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Review Modal */}
            <AnimatePresence>
                {showReviewModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowReviewModal(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white dark:bg-dark-surface rounded-3xl p-8 shadow-2xl max-w-md w-full border border-gray-100 dark:border-gray-800"
                        >
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Rate Product</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">How was your experience with this item?</p>

                            <div className="flex justify-center gap-2 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setReviewRating(star)}
                                        className={`text-4xl transition-all ${reviewRating >= star ? 'text-yellow-400 scale-110' : 'text-gray-300 dark:text-gray-700'}`}
                                    >
                                        <FiStar className={reviewRating >= star ? 'fill-current' : ''} />
                                    </button>
                                ))}
                            </div>

                            <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder="Tell us more about the product quality..."
                                className="w-full h-32 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all mb-6 resize-none"
                            ></textarea>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowReviewModal(false)}
                                    className="flex-1 py-3 px-6 rounded-xl font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitReviewHandler}
                                    disabled={loadingReview}
                                    className="flex-1 py-3 px-6 rounded-xl font-bold bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-200 dark:shadow-none transition-all"
                                >
                                    {loadingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderDetailsPage;
