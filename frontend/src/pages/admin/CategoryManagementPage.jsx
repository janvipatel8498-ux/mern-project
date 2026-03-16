import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiAlertCircle, FiTag } from 'react-icons/fi';
import axios from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const CategoryManagementPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [name, setName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/categories');
            setCategories(data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await axios.put(`/api/categories/${editingCategory._id}`, { name }, { withCredentials: true });
                toast.success('Category updated successfully');
            } else {
                await axios.post('/api/categories', { name }, { withCredentials: true });
                toast.success('Category created successfully');
            }
            setShowModal(false);
            resetForm();
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category? Products using this category will still show it, but new products cannot be assigned to it.')) {
            try {
                await axios.delete(`/api/categories/${id}`, { withCredentials: true });
                toast.success('Category deleted');
                fetchCategories();
            } catch (err) {
                toast.error(err.response?.data?.message || 'Delete failed');
            }
        }
    };

    const resetForm = () => {
        setName('');
        setEditingCategory(null);
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setName(category.name);
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight font-display">Category Hub</h2>
                    <p className="text-gray-500 font-medium mt-1">Define and manage product classifications</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-1 transition-all flex items-center gap-3"
                >
                    <FiPlus size={18} /> Add Category
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-40 glass rounded-[2rem] animate-pulse"></div>
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <div className="glass p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100 dark:border-white/10">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-gray-300 mb-6">
                        <FiTag size={40} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">No Categories Defined</h3>
                    <p className="text-gray-500 font-medium mt-2">Start by creating your first product category</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <motion.div
                            key={category._id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass group rounded-[2.5rem] p-8 border border-white/40 dark:border-white/5 transition-all hover:shadow-2xl hover:border-primary-500/20 relative overflow-hidden bg-white dark:bg-dark-surface"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-2xl">
                                    <FiTag size={20} />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(category)}
                                        className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 transition-colors"
                                    >
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category._id)}
                                        className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 transition-colors"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2 line-clamp-1">
                                {category.name}
                            </h3>
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <span>Created At</span>
                                <span className="text-gray-900 dark:text-white">
                                    {new Date(category.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white dark:bg-dark-surface w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 to-blue-600"></div>

                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8">
                                {editingCategory ? 'Edit Category' : 'New Category'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Category Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none font-bold transition-all text-gray-900 dark:text-white"
                                        placeholder="e.g. Fresh Produce"
                                        required
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 transition-all"
                                    >
                                        {editingCategory ? 'Save Changes' : 'Create Category'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-8 py-4 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoryManagementPage;
