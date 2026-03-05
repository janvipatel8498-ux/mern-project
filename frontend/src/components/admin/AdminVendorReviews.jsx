import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiStar, FiUser, FiBox, FiMessageSquare, FiArrowLeft, FiImage } from 'react-icons/fi';
import axios from '../../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';

const AdminVendorReviews = () => {
    // We already have users loaded in AdminDashboard from the redux store
    const { users, loading: usersLoading } = useSelector((state) => state.admin);
    const vendors = users.filter(user => user.role === 'vendor' && user.isApproved);

    // Local State for the 3 steps
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [vendorProducts, setVendorProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);

    // Step 1 -> 2: Select a Vendor
    const handleSelectVendor = async (vendor) => {
        setSelectedVendor(vendor);
        setLoadingProducts(true);
        try {
            const { data } = await axios.get(`/api/products/admin/vendor/${vendor._id}`);
            setVendorProducts(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load vendor products');
            setSelectedVendor(null);
        } finally {
            setLoadingProducts(false);
        }
    };

    // Step 2 -> 3: Select a Product
    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
    };

    // 3 -> 2: Back to Products
    const handleBackToProducts = () => {
        setSelectedProduct(null);
    };

    // 2 -> 1: Back to Vendors
    const handleBackToVendors = () => {
        setSelectedVendor(null);
        setSelectedProduct(null);
        setVendorProducts([]);
    };

    // Helpers
    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} className={rating >= star ? 'fill-current' : 'text-gray-300 dark:text-gray-700'} size={14} />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Review Audit</h2>
                    <p className="text-gray-500 font-medium mt-1">Inspect product feedback cycles and vendor performance metrics</p>
                </div>
            </div>

            <div className="glass p-8 rounded-[3rem] border border-white/40 dark:border-white/5 min-h-[600px] relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {/* STEP 1: VENDORS LIST */}
                    {!selectedVendor && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center gap-4 pb-6 border-b border-gray-100 dark:border-white/5">
                                <span className="bg-primary-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-lg shadow-primary-500/20">1</span>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Select Partner</h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Initial Audit Stage</p>
                                </div>
                            </div>

                            {usersLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-24 glass animate-pulse rounded-3xl"></div>)}
                                </div>
                            ) : vendors.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No authorized partners found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {vendors.map(vendor => (
                                        <motion.div
                                            key={vendor._id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleSelectVendor(vendor)}
                                            className="group cursor-pointer glass p-6 rounded-[2rem] border border-white/40 dark:border-white/5 transition-all hover:bg-white dark:hover:bg-white/5 hover:border-primary-500/30 flex items-center gap-6"
                                        >
                                            <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 text-primary-600 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                                                <FiUser size={24} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm truncate">{vendor.name}</h3>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 truncate">{vendor.email}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* STEP 2: PRODUCTS LIST */}
                    {selectedVendor && !selectedProduct && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 p-8 overflow-y-auto space-y-8"
                        >
                            <div className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-white/5">
                                <button
                                    onClick={handleBackToVendors}
                                    className="p-4 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-all active:scale-95 border border-white/20"
                                >
                                    <FiArrowLeft size={20} />
                                </button>
                                <div className="flex items-center gap-4">
                                    <span className="bg-primary-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-lg shadow-primary-500/20">2</span>
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Active Assets</h2>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Partner: {selectedVendor.name}</p>
                                    </div>
                                </div>
                            </div>

                            {loadingProducts ? (
                                <div className="flex items-center justify-center py-32">
                                    <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin shadow-lg"></div>
                                </div>
                            ) : vendorProducts.length === 0 ? (
                                <div className="text-center py-20 flex flex-col items-center">
                                    <FiBox className="text-gray-300 mb-6" size={64} />
                                    <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No indexed assets found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {vendorProducts.map(product => (
                                        <motion.div
                                            key={product._id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleSelectProduct(product)}
                                            className="group cursor-pointer glass p-6 rounded-[2rem] border border-white/40 dark:border-white/5 transition-all hover:bg-white dark:hover:bg-white/5 hover:border-primary-500/30 flex items-center gap-6"
                                        >
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/20 shadow-lg shrink-0">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-300">
                                                        <FiImage size={24} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm truncate">{product.name}</h3>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{product.category}</p>
                                            </div>
                                            <div className="text-right px-6 border-l border-gray-100 dark:border-white/5">
                                                <span className="block text-2xl font-black bg-gradient-to-br from-primary-600 to-blue-600 bg-clip-text text-transparent">{product.numReviews}</span>
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Audits</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* STEP 3: REVIEWS LIST */}
                    {selectedProduct && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 p-8 overflow-y-auto space-y-8"
                        >
                            <div className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-white/5">
                                <button
                                    onClick={handleBackToProducts}
                                    className="p-4 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-all active:scale-95 border border-white/20"
                                >
                                    <FiArrowLeft size={20} />
                                </button>
                                <div className="flex-1 min-w-0 flex items-center gap-4">
                                    <span className="bg-primary-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-lg shadow-primary-500/20">3</span>
                                    <div className="min-w-0">
                                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight truncate">Feedback Audit</h2>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5 truncate">Asset: {selectedProduct.name}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {selectedProduct.reviews.map((review) => (
                                        <motion.div
                                            key={review._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="glass p-8 rounded-[2.5rem] border border-white/40 dark:border-white/5 relative overflow-hidden group"
                                        >
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-500 to-amber-600 opacity-[0.03] rounded-bl-[4rem]"></div>

                                            <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100 dark:border-white/5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center border border-white/20 shadow-inner">
                                                        <FiUser size={18} className="text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm">{review.name}</p>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{moment(review.createdAt).format('LL')}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white/50 dark:bg-white/5 px-4 py-2 rounded-xl shadow-sm border border-white/20">
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>
                                            <div className="p-6 bg-white/30 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 italic text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                                "{review.comment}"
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 border border-white/20">
                                        <FiMessageSquare className="text-gray-300" size={32} />
                                    </div>
                                    <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No feedback cycles recorded</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminVendorReviews;
