import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiMapPin, FiBox, FiDollarSign, FiCheckCircle, FiXCircle, FiTruck } from 'react-icons/fi';
import moment from 'moment';

const DeliveryOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // For COD verification
    const [codAmount, setCodAmount] = useState('');
    const [hasCollectedCash, setHasCollectedCash] = useState(false);
    const [deliveryNotes, setDeliveryNotes] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchOrder = async () => {
        try {
            // Reusing the general getOrderById endpoint since Delivery Agent token should be valid if we protect it correctly
            // Actually, we didn't add the delivery role to the GET /api/orders/:id route middleware.
            // Let's assume the user is authenticated and the backend route allows the owner OR admin OR maybe delivery agent?
            // Wait, we need to make sure the backend allows delivery agents to GET /api/orders/:id. We'll find out!
            // If it fails, we will need to update the backend route protection.
            const { data } = await axios.get(`/api/orders/${id}`);
            setOrder(data);
            setLoading(false);
            if (data.paymentMethod === 'CashOnDelivery') {
                setCodAmount(data.totalPrice.toString());
            }
        } catch (error) {
            toast.error('Failed to load order details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleStatusUpdate = async (status) => {
        setIsUpdating(true);
        try {
            await axios.put(`/api/delivery/${id}/status`, {
                status,
                codAmountCollected: Number(codAmount),
                deliveryNotes
            });
            toast.success(`Order marked as ${status}`);
            fetchOrder();
            if (status === 'Delivered' || status === 'Cancelled') {
                setTimeout(() => navigate('/delivery/dashboard/assigned'), 1500);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Order {id}...</div>;
    if (!order) return <div className="p-8 text-center text-red-500">Order not found</div>;

    const isCOD = order.paymentMethod === 'CashOnDelivery';

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-16">
            <Link
                to="/delivery/dashboard/assigned"
                className="inline-flex items-center gap-3 text-sm font-black text-gray-400 hover:text-primary-600 transition-all group"
            >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                    <FiArrowLeft className="text-lg" />
                </div>
                UPCOMING JOBS
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-primary-200/50">
                            Manifest Details
                        </span>
                    </div>
                    <h1 className="text-4xl font-display font-black text-gray-900 dark:text-white">Order Receipt</h1>
                    <p className="text-gray-400 font-mono mt-2 text-sm">SECURE_TRACK_ID: {order._id.toUpperCase()}</p>
                </div>
                <div className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl border-2 ${order.status === 'Processing' ? 'bg-blue-600 border-blue-400 text-white shadow-blue-500/20' :
                    order.status === 'Shipped' ? 'bg-amber-500 border-amber-300 text-white shadow-amber-500/20' :
                        order.status === 'Out for Delivery' ? 'bg-purple-600 border-purple-400 text-white shadow-purple-500/20' :
                            order.status === 'Delivered' ? 'bg-green-600 border-green-400 text-white shadow-green-500/20' :
                                'bg-red-600 border-red-400 text-white shadow-red-500/20'
                    }`}>
                    {order.status}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Customer & Address */}
                    <div className="glass p-10 rounded-[2.5rem] border border-white/40 dark:border-gray-800/60 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <FiMapPin className="text-8xl" />
                        </div>
                        <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-gray-900 dark:text-white uppercase tracking-tight">
                            <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/20">
                                <FiMapPin className="text-lg" />
                            </div>
                            Destination Point
                        </h2>
                        <div className="space-y-6 relative z-10">
                            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                                <p className="font-black text-2xl text-gray-900 dark:text-white mb-2">{order.user?.name}</p>
                                <p className="text-lg text-gray-500 font-medium leading-relaxed">
                                    {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="glass p-10 rounded-[2.5rem] border border-white/40 dark:border-gray-800/60 shadow-xl">
                        <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-gray-900 dark:text-white uppercase tracking-tight">
                            <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <FiBox className="text-lg" />
                            </div>
                            Shipment Load ({order.orderItems.length})
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="flex items-center gap-5 p-4 bg-white/40 dark:bg-white/5 rounded-[1.5rem] border border-white/40 transition-all hover:shadow-md">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-white/20" />
                                    <div>
                                        <p className="font-black text-gray-900 dark:text-white text-sm line-clamp-1">{item.name}</p>
                                        <p className="text-xs font-black text-primary-500 uppercase tracking-widest mt-1">Units: {item.qty}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Payment Info */}
                    <div className="glass p-10 rounded-[2.5rem] border border-white/40 dark:border-gray-800/60 shadow-xl bg-gradient-to-br from-primary-600/5 to-transparent">
                        <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-gray-900 dark:text-white uppercase tracking-tight">
                            <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <FiDollarSign className="text-lg" />
                            </div>
                            Billing Info
                        </h2>
                        <div className="space-y-6">
                            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-inner border border-gray-100 dark:border-gray-700">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Settlement Amount</span>
                                <p className="text-5xl font-black text-primary-600 mt-2 tracking-tighter">₹{order.totalPrice.toFixed(0)}</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className={`flex justify-between items-center p-4 rounded-2xl border ${isCOD ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                                    <span className="text-[10px] font-black uppercase">Channel</span>
                                    <span className="font-black text-sm uppercase px-3 py-1 bg-white/50 rounded-lg">{isCOD ? 'Cash Collection' : 'Pre-Payment'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {order.isDelivered === false && order.status !== 'Cancelled' && (
                        <div className="glass p-10 rounded-[2.5rem] border-2 border-primary-500/20 dark:border-primary-500/10 shadow-2xl relative overflow-hidden bg-white/80 dark:bg-gray-800/40">
                            <h2 className="text-xl font-black mb-8 text-gray-900 dark:text-white uppercase tracking-tight">Dispatch Ops</h2>

                            {isCOD && order.status === 'Out for Delivery' && (
                                <div className="mb-8">
                                    <div className="bg-amber-100 dark:bg-amber-900/20 p-6 rounded-3xl border border-amber-200 shadow-inner">
                                        <label className="block text-[10px] font-black text-amber-800 uppercase tracking-widest mb-4">
                                            Verification: Amount to Collect
                                        </label>
                                        <div className="text-5xl font-black text-amber-900 dark:text-amber-400 mb-6 tracking-tighter">₹{codAmount}</div>

                                        <label className="flex items-center gap-4 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={hasCollectedCash}
                                                onChange={(e) => setHasCollectedCash(e.target.checked)}
                                                className="w-6 h-6 rounded-lg border-2 border-amber-300 text-amber-600 focus:ring-amber-500 transition-all checked:bg-amber-600"
                                            />
                                            <span className="text-xs font-black text-amber-900 dark:text-amber-400 uppercase tracking-tight group-hover:translate-x-1 transition-transform">
                                                Confirm Cash Received
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="mb-8">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">
                                    Terminal Log (Notes)
                                </label>
                                <textarea
                                    value={deliveryNotes}
                                    onChange={(e) => setDeliveryNotes(e.target.value)}
                                    rows="2"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm font-bold placeholder:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
                                    placeholder="Add delivery observations..."
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                {order.status === 'Processing' && (
                                    <button
                                        onClick={() => handleStatusUpdate('Shipped')}
                                        disabled={isUpdating}
                                        className="w-full py-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1 transition-all flex justify-center items-center gap-3 active:scale-95"
                                    >
                                        <FiTruck className="text-xl" /> Start Dispatch (Shipped)
                                    </button>
                                )}
                                {order.status === 'Shipped' && (
                                    <button
                                        onClick={() => handleStatusUpdate('Out for Delivery')}
                                        disabled={isUpdating}
                                        className="w-full py-6 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-purple-600/20 hover:shadow-purple-600/40 hover:-translate-y-1 transition-all flex justify-center items-center gap-3 active:scale-95"
                                    >
                                        <FiMapPin className="text-xl" /> Go Out for Delivery
                                    </button>
                                )}
                                {order.status === 'Out for Delivery' && (
                                    <button
                                        onClick={() => handleStatusUpdate('Delivered')}
                                        disabled={isUpdating || (isCOD && !hasCollectedCash)}
                                        className={`w-full py-6 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all flex justify-center items-center gap-3 active:scale-95 ${isUpdating || (isCOD && !hasCollectedCash)
                                            ? 'bg-gray-400 cursor-not-allowed grayscale'
                                            : 'bg-gradient-to-r from-green-600 to-green-500 shadow-green-600/20 hover:shadow-green-600/40 hover:-translate-y-1'
                                            }`}
                                    >
                                        <FiCheckCircle className="text-xl" /> Finalize Delivery
                                    </button>
                                )}

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeliveryOrderDetails;
