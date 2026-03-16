import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiPackage, FiTag, FiInfo, FiLayers, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from '../../utils/axiosInstance';

import { getProductDetails, updateProduct } from '../../redux/slices/productSlice';

const ProductEditPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [unit, setUnit] = useState('unit');
    const [categories, setCategories] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    const { product, loading, error } = useSelector((state) => state.products);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/categories');
                setCategories(data);
            } catch (err) {
                console.error('Failed to fetch categories', err);
            }
        };
        fetchCategories();

        if (!isInitialized || product._id !== productId) {
            if (product._id !== productId) {
                dispatch(getProductDetails(productId));
            } else if (product._id === productId && !isInitialized) {
                setName(product.name);
                setPrice(product.price);
                setImage(product.image);
                setCategory(product.category);
                setCountInStock(product.countInStock);
                setDescription(product.description);
                setUnit(product.unit || 'unit');
                setIsInitialized(true);
            }
        }
    }, [dispatch, productId, product, isInitialized]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await dispatch(
                updateProduct({
                    _id: productId,
                    name, price, image, category, countInStock, description, unit,
                })
            ).unwrap();
            toast.success('Product Updated Successfully');
            navigate('/admin/dashboard');
        } catch (err) {
            toast.error(err || 'Failed to update product');
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div></div>;

    return (
        <div className="bg-[#fcfcfd] dark:bg-[#0A0A0B] min-h-screen p-6 md:p-12 relative overflow-hidden transition-colors duration-500">
            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="container mx-auto max-w-5xl relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="group mb-10 flex items-center gap-3 text-gray-400 hover:text-primary-600 transition-all font-black uppercase text-[10px] tracking-widest active:scale-95"
                >
                    <div className="w-10 h-10 glass rounded-xl flex items-center justify-center border border-white/40 dark:border-white/5 shadow-sm group-hover:shadow-primary-500/20">
                        <FiArrowLeft size={16} />
                    </div>
                    Back to Terminal
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-[3rem] overflow-hidden shadow-2xl border border-white/40 dark:border-white/5"
                >
                    <div className="bg-gradient-to-r from-primary-600 to-blue-600 p-12 text-white relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <h1 className="text-4xl font-black uppercase tracking-tight flex items-center gap-6 relative z-10">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20">
                                <FiPackage size={32} />
                            </div>
                            Asset Modification
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-4 opacity-80 relative z-10">Protocol: {productId}</p>
                    </div>

                    <form onSubmit={submitHandler} className="p-12 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Left Column */}
                            <div className="space-y-8">
                                <div className="group">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                                        Identity Label
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-600">
                                            <FiTag size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-16 pr-8 py-5 rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-bold text-gray-900 dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                                        Valuation (₹)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600">
                                            <FiDollarSign size={18} />
                                        </div>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="w-full pl-16 pr-8 py-5 rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-bold text-gray-900 dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                                        Domain Classification
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600">
                                            <FiLayers size={18} />
                                        </div>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full pl-16 pr-8 py-5 rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-bold text-gray-900 dark:text-white appearance-none cursor-pointer"
                                            required
                                        >
                                            <option value="">Select Domain</option>
                                            {categories.map(c => (
                                                <option key={c._id} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-8">
                                <div className="group">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                                        Asset Quantity
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-600">
                                            <FiPackage size={18} />
                                        </div>
                                        <input
                                            type="number"
                                            value={countInStock}
                                            onChange={(e) => setCountInStock(e.target.value)}
                                            className="w-full pl-16 pr-8 py-5 rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-bold text-gray-900 dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Sold By Protocol</label>
                                    <div className="flex p-2 gap-2 glass rounded-2xl border border-white/20 shadow-inner">
                                        <button type="button" onClick={() => setUnit('unit')}
                                            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${unit === 'unit' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'
                                                }`}>
                                            Units
                                        </button>
                                        <button type="button" onClick={() => setUnit('kg')}
                                            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${unit === 'kg' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'
                                                }`}>
                                            Weight
                                        </button>
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                                        Visual Logic (URL)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-600">
                                            <FiInfo size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                            className="w-full pl-16 pr-8 py-5 rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-bold text-gray-900 dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                                Detailed Briefing
                            </label>
                            <textarea
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-8 py-6 rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-bold text-gray-900 dark:text-white resize-none"
                                required
                            ></textarea>
                        </div>

                        <div className="flex justify-end pt-8 border-t border-gray-100 dark:border-white/5">
                            <button
                                type="submit"
                                className="bg-primary-600 hover:bg-primary-700 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-xl shadow-primary-500/20 active:scale-95 transition-all border-b-4 border-primary-800"
                            >
                                <FiSave size={16} /> Sync Changes
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductEditPage;
