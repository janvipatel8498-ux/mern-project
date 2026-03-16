import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Link, useOutletContext } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiAlertTriangle, FiX, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { listProducts } from '../../redux/slices/productSlice';

const ProductManager = () => {
    const { products, page, pages, productsLoading } = useOutletContext();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/categories');
                setCategories(data.map(c => c.name));
            } catch (err) {
                console.error('Failed to fetch categories', err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch products whenever search or category changes
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(listProducts({ keyword: searchTerm, category: categoryFilter }));
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [dispatch, searchTerm, categoryFilter]);

    const handlePageChange = (pageNumber) => {
        dispatch(listProducts({ keyword: searchTerm, category: categoryFilter, pageNumber }));
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`/api/products/${id}`, { withCredentials: true });
                toast.success('Product Deleted');
                dispatch(listProducts({ keyword: searchTerm, category: categoryFilter, pageNumber: page }));
            } catch (err) {
                toast.error(typeof err === 'string' ? err : (err.response?.data?.message || err.message || 'Delete failed'));
            }
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight font-display">Product Lib</h2>
                    <p className="text-gray-500 font-medium mt-1">Audit inventory levels and manage marketplace catalog</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full sm:w-64 pl-6 pr-10 py-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl outline-none font-black text-[10px] uppercase tracking-widest shadow-sm transition-all text-gray-700 dark:text-gray-300 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-no-repeat bg-[right_1rem_center] focus:ring-2 focus:ring-primary-500/20"
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="relative flex-1 sm:w-72">
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

            {productsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-80 glass rounded-[2.5rem] animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                        {products.length === 0 ? (
                            <div className="col-span-full glass p-24 rounded-[3rem] text-center border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center gap-4">
                                <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center text-gray-300">
                                    <FiAlertTriangle size={40} />
                                </div>
                                <div>
                                    <p className="text-gray-900 dark:text-white font-black uppercase tracking-tight text-xl">No assets identified</p>
                                    <p className="text-gray-500 font-medium text-sm mt-1">Try refining your search or category filters</p>
                                </div>
                                <button
                                    onClick={() => { setSearchTerm(''); setCategoryFilter(''); }}
                                    className="mt-4 px-6 py-3 bg-gray-100 dark:bg-white/5 rounded-xl font-black uppercase text-[10px] tracking-widest text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : products.map(product => (
                            <motion.div
                                key={product._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -10 }}
                                className="glass group rounded-[2.5rem] p-6 border border-white/40 dark:border-white/5 transition-all hover:shadow-2xl hover:border-primary-500/20 relative flex flex-col h-full bg-white dark:bg-dark-surface"
                            >
                                <div className="aspect-square rounded-[2rem] overflow-hidden bg-gray-50 dark:bg-white/5 mb-6 relative border border-gray-100 dark:border-white/5 shadow-inner">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-4 py-1.5 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-gray-900 dark:text-white border border-white/20 shadow-lg">
                                            {product.category}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="px-4 py-2 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-2xl text-lg font-black text-primary-600 border border-white/20 shadow-xl font-display">
                                            ₹{product.price}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-base leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        {product.vendor && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="w-4 h-4 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                                                    <FiUser size={8} className="text-primary-600" />
                                                </div>
                                                <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                                    Part: {product.vendor.name}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5 mt-auto">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Inventory</p>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${product.countInStock > 10 ? 'bg-emerald-500 animate-pulse' : product.countInStock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${product.countInStock > 10 ? 'text-emerald-600' : product.countInStock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                                                    {product.countInStock > 0 ? `${product.countInStock} ${product.unit || 'Units'}` : 'Stock Out'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            <Link
                                                to={`/admin/product/${product._id}/edit`}
                                                className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-100 transition-all shadow-sm border border-blue-100/50"
                                            >
                                                <FiEdit2 size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl hover:bg-red-100 transition-all shadow-sm border border-red-100/50"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination Context */}
                    {pages > 1 && (
                        <div className="flex justify-center mt-16 gap-3">
                            <button
                                onClick={() => handlePageChange(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="px-6 py-4 glass rounded-2xl font-black uppercase text-[10px] tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-white/5 transition-all border border-gray-100 dark:border-white/5 shadow-sm"
                            >
                                Previous
                            </button>
                            {[...Array(pages).keys()].map((x) => (
                                <button
                                    key={x + 1}
                                    onClick={() => handlePageChange(x + 1)}
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all shadow-lg ${x + 1 === page
                                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-primary-500/20 scale-110'
                                        : 'glass border border-gray-100 dark:border-white/5 text-gray-400 hover:text-primary-600'
                                        }`}
                                >
                                    {x + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(Math.min(pages, page + 1))}
                                disabled={page === pages}
                                className="px-6 py-4 glass rounded-2xl font-black uppercase text-[10px] tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-white/5 transition-all border border-gray-100 dark:border-white/5 shadow-sm"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </motion.div>
    );
};

export default ProductManager;
