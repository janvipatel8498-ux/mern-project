import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVendorProducts } from '../../redux/slices/vendorSlice';
import { FiAlertTriangle, FiPackage } from 'react-icons/fi';
import axios from '../../utils/axiosInstance';
import { toast } from 'react-hot-toast';

const VendorInventory = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.vendor);
    const [updatingStock, setUpdatingStock] = useState(null);

    useEffect(() => {
        dispatch(getVendorProducts());
    }, [dispatch]);

    const handleStockUpdate = async (id, currentStock, newStock) => {
        if (currentStock === newStock) return;
        setUpdatingStock(id);
        try {
            await axios.put(`/api/products/${id}`, { countInStock: newStock });
            toast.success('Stock updated');
            dispatch(getVendorProducts());
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message);
        } finally {
            setUpdatingStock(null);
        }
    };

    return (
        <div className="space-y-12 pb-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-display font-black text-gray-900 dark:text-white uppercase tracking-tight">Stock Control</h1>
                    <p className="text-gray-500 font-medium mt-1">Precision inventory monitoring and rapid stock updates</p>
                </div>
                <div className="px-6 py-3 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm font-black text-xs text-gray-400 uppercase tracking-widest">
                    Critical Stock: <span className="text-red-500 ml-1">{products.filter(p => p.countInStock < 10).length}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    [1, 2, 3].map((i) => (
                        <div key={i} className="h-24 glass rounded-3xl animate-pulse"></div>
                    ))
                ) : products.length === 0 ? (
                    <div className="glass p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200 dark:border-white/10">
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No Inventory Detected</p>
                    </div>
                ) : products.map((product) => (
                    <div key={product._id} className="glass group rounded-[2.5rem] p-6 border border-white/40 dark:border-white/5 transition-all hover:shadow-xl flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden">
                        <div className="flex items-center gap-6 flex-1">
                            <div className="relative w-16 h-16 shrink-0">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-2xl shadow-lg" />
                                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white dark:border-dark-bg flex items-center justify-center text-[8px] font-black text-white ${product.countInStock === 0 ? 'bg-red-500' :
                                    product.countInStock < 10 ? 'bg-amber-500' :
                                        'bg-emerald-500'
                                    }`}>
                                    {product.countInStock}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm line-clamp-1">{product.name}</h3>
                                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{product.category}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-12 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="text-right hidden md:block">
                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">MSRP</p>
                                <p className="font-black text-gray-900 dark:text-white">₹{product.price}</p>
                            </div>

                            <div className="shrink-0 flex items-center gap-4">
                                {product.countInStock === 0 ? (
                                    <span className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900/20 shadow-sm">
                                        <FiAlertTriangle /> Depleted
                                    </span>
                                ) : product.countInStock < 10 ? (
                                    <span className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-900/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100 dark:border-amber-900/20 shadow-sm">
                                        <FiAlertTriangle /> Low Alert
                                    </span>
                                ) : (
                                    <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/20 shadow-sm">
                                        Surplus
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3 bg-white/50 dark:bg-white/5 p-2 rounded-2xl border border-gray-100 dark:border-white/5 shadow-inner shrink-0 leading-none">
                                <input
                                    type="number"
                                    min="0"
                                    defaultValue={product.countInStock}
                                    className="w-20 px-4 py-2 text-center text-sm font-black border-none bg-transparent text-gray-900 dark:text-white focus:ring-0 outline-none"
                                    onBlur={(e) => handleStockUpdate(product._id, product.countInStock, Number(e.target.value))}
                                    onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                                />
                                <div className="p-2 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-600/20">
                                    <FiPackage size={14} />
                                </div>
                            </div>
                        </div>
                        {updatingStock === product._id && (
                            <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 animate-pulse">Syncing...</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VendorInventory;
