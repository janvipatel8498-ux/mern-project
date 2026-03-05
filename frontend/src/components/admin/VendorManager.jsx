import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { blockUser, deleteUser } from '../../redux/slices/adminSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiTrash2, FiLock, FiUnlock, FiEye, FiCheckCircle, FiXCircle, FiBox } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import axios from '../../utils/axiosInstance';

const VendorManager = () => {
    const { users, products } = useOutletContext();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');

    // Filter for approved vendors only
    const [selectedVendorForView, setSelectedVendorForView] = useState(null);

    const vendors = users.filter(user => user.role === 'vendor' && user.isApproved);

    const filteredVendors = vendors.filter(user =>
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getVendorProducts = (vendorId) => {
        return products.filter(p => p.vendor === vendorId || p.vendor?._id === vendorId);
    };

    // Group products by category
    const getGroupedProducts = (vendorId) => {
        const vendorProducts = getVendorProducts(vendorId);
        return vendorProducts.reduce((acc, product) => {
            const category = product.category || 'Uncategorized';
            if (!acc[category]) acc[category] = [];
            acc[category].push(product);
            return acc;
        }, {});
    };

    const handleBlockToggle = (id, currentStatus) => {
        dispatch(blockUser({ userId: id, isBlocked: !currentStatus }));
        toast.success(`Vendor ${!currentStatus ? 'blocked' : 'unblocked'} successfully`);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this vendor? All their products will also be removed.")) {
            dispatch(deleteUser(id));
            toast.success("Vendor and their products deleted");
            setTimeout(() => window.location.reload(), 1000);
        }
    };

    const handleApproval = async (id, isApproved) => {
        try {
            await axios.put(`/api/users/${id}/approve`, { isApproved });
            toast.success(isApproved ? 'Vendor Approved' : 'Vendor Approval Rejected');
            window.location.reload();
        } catch (err) {
            toast.error('Operation failed');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Partner Hub</h2>
                    <p className="text-gray-500 font-medium mt-1">Manage marketplace vendors and monitor storefront activity</p>
                </div>
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search partners..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none font-bold text-sm shadow-sm transition-all text-gray-900 dark:text-white"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <FiSearch size={18} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredVendors.length === 0 ? (
                    <div className="col-span-full glass p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200 dark:border-white/10">
                        <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No partners identified</p>
                    </div>
                ) : filteredVendors.map(vendor => {
                    const vendorProducts = getVendorProducts(vendor._id);
                    return (
                        <motion.div
                            key={vendor._id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="glass group rounded-[2.5rem] p-8 border border-white/40 dark:border-white/5 transition-all hover:shadow-2xl hover:border-primary-500/20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-600 to-orange-500 opacity-[0.02] rounded-bl-[5rem]"></div>

                            <div className="relative z-10 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner relative group-hover:scale-110 transition-transform duration-500">
                                            <span className="text-2xl font-black bg-gradient-to-br from-amber-600 to-orange-500 bg-clip-text text-transparent">
                                                {vendor.name.charAt(0).toUpperCase()}
                                            </span>
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 border-2 border-white dark:border-dark-bg rounded-full shadow-sm"></div>
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-lg leading-tight line-clamp-1">{vendor.name}</h3>
                                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1 bg-amber-50 dark:bg-amber-900/10 px-2 py-0.5 rounded w-fit">{vendor.vendorId || 'ID Pending'}</p>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg border-b-2 flex items-center justify-center min-w-[110px] whitespace-nowrap ml-4 shrink-0 ${vendor.isBlocked
                                        ? 'bg-red-500 text-white border-red-700 shadow-red-500/20'
                                        : 'bg-emerald-500 text-white border-emerald-700 shadow-emerald-500/20'
                                        }`}>
                                        {vendor.isBlocked ? 'Lockdown' : 'Operational'}
                                    </span>
                                </div>

                                <div className="p-6 bg-white/50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-inner">
                                    <div className="flex justify-between items-end mb-4">
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Inventory Status</p>
                                        <span className="text-xl font-black text-gray-900 dark:text-white">{vendorProducts.length} <span className="text-[10px] text-gray-400 uppercase">Items</span></span>
                                    </div>
                                    <div className="flex gap-1.5 overflow-hidden">
                                        {vendorProducts.slice(0, 4).map((p, idx) => (
                                            <div key={idx} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 border border-white/20 shadow-sm overflow-hidden flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500">
                                                <img src={p.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                        {vendorProducts.length > 4 && (
                                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-dark-surface border border-white/20 shadow-sm flex items-center justify-center text-[10px] font-black text-gray-500">
                                                +{vendorProducts.length - 4}
                                            </div>
                                        )}
                                        {vendorProducts.length === 0 && <p className="text-[10px] text-gray-400 italic">No products listed</p>}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Store Registry</p>
                                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{vendor.email}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setSelectedVendorForView(vendor)}
                                            className="w-12 h-12 flex items-center justify-center bg-white/50 dark:bg-white/5 text-gray-500 hover:text-primary-600 rounded-2xl transition-all shadow-sm active:scale-95 border border-white/40 dark:border-white/5"
                                            title="View Store Front"
                                        >
                                            <FiEye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleBlockToggle(vendor._id, vendor.isBlocked)}
                                            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-lg active:scale-95 border-b-4 ${vendor.isBlocked ? 'bg-emerald-500 text-white shadow-emerald-500/20 border-emerald-700' : 'bg-orange-500 text-white shadow-orange-500/20 border-orange-700'}`}
                                            title={vendor.isBlocked ? "Invoke Unlock" : "Enforce Lockdown"}
                                        >
                                            {vendor.isBlocked ? <FiUnlock size={18} /> : <FiLock size={18} />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(vendor._id)}
                                            className="w-12 h-12 flex items-center justify-center bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95 border-b-4 border-red-700"
                                            title="Revoke Partnership"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Vendor Products Modal */}
            <AnimatePresence>
                {selectedVendorForView && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 lg:p-12 bg-black/70 backdrop-blur-md"
                        onClick={() => setSelectedVendorForView(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.98, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.98, opacity: 0, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-[#0A0A0B] w-full max-w-7xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.5)] border border-white/20 relative flex flex-col"
                        >
                            {/* Premium Header Protocol */}
                            <div className="px-10 py-8 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/50 dark:bg-white/5 backdrop-blur-3xl sticky top-0 z-20">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-500/20 font-black text-2xl">
                                        {selectedVendorForView.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                                            {selectedVendorForView.name}
                                            <span className="text-[10px] bg-primary-50 dark:bg-primary-900/10 text-primary-600 px-2 py-0.5 rounded border border-primary-200/20 tracking-widest">Active Vendor</span>
                                        </h2>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Catalog Audit Protocol • {getVendorProducts(selectedVendorForView._id).length} Active SKU</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="hidden lg:block text-right">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Registry ID</p>
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{selectedVendorForView.email}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedVendorForView(null)}
                                        className="p-4 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 rounded-2xl transition-all border border-white/20 active:scale-95 group"
                                    >
                                        <FiXCircle size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>

                            {/* Catalog Grid Stream */}
                            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                                {Object.keys(getGroupedProducts(selectedVendorForView._id)).length === 0 ? (
                                    <div className="text-center py-40">
                                        <FiBox className="mx-auto text-gray-200 dark:text-white/5 mb-6" size={80} />
                                        <h4 className="text-lg font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">No Registered SKU</h4>
                                    </div>
                                ) : (
                                    <div className="space-y-16">
                                        {Object.entries(getGroupedProducts(selectedVendorForView._id)).map(([category, prods]) => (
                                            <div key={category} className="space-y-8">
                                                <div className="flex items-center gap-6">
                                                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] px-4 py-1.5 bg-gray-50 dark:bg-white/5 rounded-xl border border-white/20">{category}</h3>
                                                    <div className="h-px flex-1 bg-gradient-to-r from-gray-100 dark:from-white/10 to-transparent"></div>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{prods.length} Units</span>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                                    {prods.map(product => (
                                                        <motion.div
                                                            key={product._id}
                                                            whileHover={{ y: -5 }}
                                                            className="glass p-5 rounded-[2.5rem] border border-white/40 dark:border-white/5 group transition-all hover:bg-white dark:hover:bg-white/5 hover:border-amber-500/30 shadow-sm"
                                                        >
                                                            <div className="relative aspect-square rounded-[1.8rem] overflow-hidden border border-white/10 shadow-lg mb-6">
                                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/95 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 shadow-xl">
                                                                    <span className="text-sm font-black text-amber-600">₹{product.price}</span>
                                                                </div>
                                                                <div className={`absolute bottom-4 left-4 w-2 h-2 rounded-full ${product.countInStock > 5 ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]'}`}></div>
                                                            </div>
                                                            <div className="px-2">
                                                                <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-xs mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">{product.name}</h4>
                                                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">In Stock: {product.countInStock}</p>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default VendorManager;
