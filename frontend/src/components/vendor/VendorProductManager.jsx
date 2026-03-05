import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiPackage } from 'react-icons/fi';
import { getVendorProducts } from '../../redux/slices/vendorSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from '../../utils/axiosInstance';

const VendorProductManager = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.vendor);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Form states
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [unit, setUnit] = useState('units');

    const [searchTerm, setSearchTerm] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        dispatch(getVendorProducts());
    }, [dispatch]);

    useEffect(() => {
        if (editingProduct) {
            setName(editingProduct.name);
            setPrice(editingProduct.price);
            setDescription(editingProduct.description);
            setImage(editingProduct.image);
            setCategory(editingProduct.category);
            setCountInStock(editingProduct.countInStock);
            setUnit(editingProduct.unit || 'unit');
        } else {
            setName('');
            setPrice(0);
            setDescription('');
            setImage('');
            setCategory('');
            setCountInStock(0);
            setUnit('unit');
        }
    }, [editingProduct]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await axios.put(`/api/products/${editingProduct._id}`, {
                    name, price, description, image, category, countInStock, unit
                });
                toast.success('Product updated');
            } else {
                await axios.post('/api/products', {
                    name, price, description, image, category, countInStock, unit
                });
                toast.success('Product created');
            }
            setShowModal(false);
            setEditingProduct(null);
            dispatch(getVendorProducts());
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message);
        }
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            toast.error("No file selected.");
            return;
        }

        console.log("Uploading File:", file.name, "Type:", file.type, "Size:", file.size);
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('/api/upload', formData, config);
            setImage(data.image);
            setUploading(false);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error("Upload Error:", error, error.response?.data);
            toast.error(error?.response?.data?.message || 'Error uploading image');
            setUploading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`/api/products/${id}`);
                toast.success('Product deleted');
                dispatch(getVendorProducts());
            } catch (err) {
                toast.error(err?.response?.data?.message || err.message);
            }
        }
    };

    return (
        <div className="space-y-12 pb-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-display font-black text-gray-900 dark:text-white uppercase tracking-tight">Product Hub</h1>
                    <p className="text-gray-500 font-medium mt-1">Curate your store and manage premium inventory</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
                    <div className="relative w-full sm:w-72">
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none font-bold text-sm shadow-sm transition-all text-gray-900 dark:text-white"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <FiEye className="rotate-90" />
                        </div>
                    </div>
                    <button
                        onClick={() => { setEditingProduct(null); setShowModal(true); }}
                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                    >
                        <FiPlus className="text-lg" /> New Acquisition
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-48 glass rounded-[2.5rem] animate-pulse"></div>
                    ))
                ) : filteredProducts.length === 0 ? (
                    <div className="col-span-full glass p-20 rounded-[3rem] text-center space-y-6 border-2 border-dashed border-gray-200 dark:border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent"></div>
                        <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-gray-300 text-4xl shadow-inner relative z-10">
                            <FiPackage />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Warehouse Empty</h3>
                            <p className="text-gray-500 max-w-sm mx-auto font-medium">Time to stock up! Add your first product to start selling.</p>
                        </div>
                    </div>
                ) : filteredProducts.map((product) => (
                    <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass group rounded-[2.5rem] p-6 border border-white/40 dark:border-white/5 transition-all hover:shadow-2xl hover:border-primary-500/20 relative overflow-hidden"
                    >
                        <div className="relative h-56 mb-6 rounded-[2rem] overflow-hidden group-hover:shadow-lg transition-all duration-500">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <button
                                    onClick={() => { setEditingProduct(product); setShowModal(true); }}
                                    className="p-3 bg-white/90 dark:bg-black/80 backdrop-blur-md text-blue-600 rounded-xl hover:bg-white dark:hover:bg-black transition-colors shadow-xl"
                                >
                                    <FiEdit size={16} />
                                </button>
                                <button
                                    onClick={() => deleteHandler(product._id)}
                                    className="p-3 bg-white/90 dark:bg-black/80 backdrop-blur-md text-red-600 rounded-xl hover:bg-white dark:hover:bg-black transition-colors shadow-xl"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <span className="px-4 py-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white shadow-lg">
                                    {product.category}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-start gap-4">
                                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight line-clamp-2">{product.name}</h3>
                                <p className="text-xl font-black text-primary-600 tracking-tighter shrink-0">₹{product.price}</p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 text-left">Inventory Status</span>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-center shadow-sm w-fit ${product.countInStock > 10 ? 'bg-green-50 text-green-700 border border-green-100' :
                                        product.countInStock > 0 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                            'bg-red-50 text-red-700 border border-red-100'
                                        }`}>
                                        {product.countInStock} {product.unit === 'kg' ? 'kg' : 'Units'}
                                    </span>
                                </div>
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-bg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 text-[10px] font-black">
                                        +
                                    </div>
                                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-bg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 text-[10px] font-black">
                                        {product.rating || 0}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

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
                            className="relative bg-white dark:bg-dark-surface w-full max-w-2xl rounded-3xl shadow-2xl p-8 overflow-y-auto max-h-[90vh]"
                        >
                            <h2 className="text-2xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Product Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                                    <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="input-field" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Count In Stock</label>
                                    <div className="flex gap-2">
                                        <input type="number" value={countInStock} onChange={(e) => setCountInStock(Number(e.target.value))} className="input-field flex-1" required />
                                        <select value={unit} onChange={(e) => setUnit(e.target.value)} className="input-field w-24">
                                            <option value="unit">Units</option>
                                            <option value="kg">kg</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field" required>
                                        <option value="" disabled>Select a Category</option>
                                        <option value="Groceries">Groceries</option>
                                        <option value="Fruits">Fruits</option>
                                        <option value="Vegetables">Vegetables</option>
                                        <option value="Dairy & Bakery">Dairy & Bakery</option>
                                        <option value="Meat & Seafood">Meat & Seafood</option>
                                        <option value="Snacks & Beverages">Snacks & Beverages</option>
                                        <option value="Household">Household</option>
                                        <option value="Personal Care">Personal Care</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-sm font-medium">Product Image</label>
                                    <div className="flex gap-4 items-center">
                                        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="input-field flex-1" placeholder="Enter image URL or upload" required />
                                        <div className="relative">
                                            <input type="file" accept="image/*" onChange={uploadFileHandler} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="Upload Image" />
                                            <button type="button" className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                                {uploading ? 'Uploading...' : 'Upload File'}
                                            </button>
                                        </div>
                                    </div>
                                    {image && <img src={image} alt="Preview" className="w-20 h-20 object-cover rounded-xl mt-2" />}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" required></textarea>
                                </div>
                                <div className="md:col-span-2 flex gap-4 pt-4">
                                    <button type="submit" className="btn-primary flex-1">
                                        {editingProduct ? 'Update Product' : 'Create Product'}
                                    </button>
                                    <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold">
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

export default VendorProductManager;
