import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiAlertTriangle, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { listProducts } from '../../redux/slices/productSlice';

const CATEGORIES = ['Groceries', 'Fruits', 'Vegetables', 'Dairy & Bakery', 'Meat & Seafood', 'Snacks & Beverages', 'Household', 'Personal Care', 'Other'];

const ProductManager = () => {
    const { products } = useOutletContext();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                // In a real scenario, this should be a Redux action to update the central store,
                // but directly modifying here and re-fetching for demo purposes.
                await axios.delete(`/api/products/${id}`, { withCredentials: true });
                toast.success('Product Deleted');
                dispatch(listProducts());
            } catch (err) {
                toast.error(typeof err === 'string' ? err : (err.response?.data?.message || err.message || 'Delete failed'));
            }
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Product Lib</h2>
                    <p className="text-gray-500 font-medium mt-1">Audit inventory levels and manage marketplace catalog</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="pl-6 pr-10 py-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl outline-none font-bold text-xs uppercase tracking-widest shadow-sm transition-all text-gray-700 dark:text-gray-300 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-no-repeat bg-[right_1rem_center]"
                    >
                        <option value="">All Categories</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="relative flex-1 sm:w-64">
                        <input
                            type="text"
                            placeholder="Search catalog..."
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

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-full glass p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200 dark:border-white/10">
                        <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No assets identified</p>
                    </div>
                ) : filteredProducts.map(product => (
                    <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -10 }}
                        className="glass group rounded-[2.5rem] p-6 border border-white/40 dark:border-white/5 transition-all hover:shadow-2xl hover:border-primary-500/20 relative flex flex-col h-full"
                    >
                        <div className="aspect-square rounded-[2rem] overflow-hidden bg-gray-50 dark:bg-white/5 mb-6 relative border border-gray-100 dark:border-white/5">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-gray-900 dark:text-white border border-white/20 shadow-sm">
                                    {product.category}
                                </span>
                            </div>
                            <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="p-3 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-2xl text-lg font-black text-primary-600 border border-white/20 shadow-xl font-display">
                                    ₹{product.price}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-lg leading-tight line-clamp-1 group-hover:text-primary-600 transition-colors">
                                    {product.name}
                                </h3>
                                {product.vendor && (
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                        Partner: {product.vendor.name}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5 mt-auto">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Inventory</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${product.countInStock > 10 ? 'bg-emerald-500' : product.countInStock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                        <span className={`text-xs font-black uppercase tracking-widest ${product.countInStock > 10 ? 'text-emerald-600' : product.countInStock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                                            {product.countInStock > 0 ? `${product.countInStock} Units` : 'Depleted'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    <Link
                                        to={`/admin/product/${product._id}/edit`}
                                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all shadow-sm"
                                    >
                                        <FiEdit2 size={16} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all shadow-sm"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default ProductManager;
