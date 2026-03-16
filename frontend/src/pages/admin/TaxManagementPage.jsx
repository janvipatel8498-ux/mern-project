import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { FiSave, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';

const TaxManagementPage = () => {
    const [taxConfigs, setTaxConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchTaxConfigs = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get('/api/tax');
            setTaxConfigs(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load tax configurations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTaxConfigs();
    }, []);

    const handleTaxRateChange = (index, value) => {
        const newConfigs = [...taxConfigs];
        newConfigs[index].taxRate = Number(value);
        setTaxConfigs(newConfigs);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axiosInstance.put('/api/tax', {
                taxUpdates: taxConfigs
            });
            toast.success('Tax configurations saved successfully!');
            fetchTaxConfigs(); // Refresh just to be sure
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save tax configurations');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Tax Management</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Configure dynamic tax rates mapped to product categories.</p>
                </div>
                <button
                    onClick={fetchTaxConfigs}
                    className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 focus:outline-none"
                    title="Refresh data"
                >
                    <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                    <th className="p-4 font-bold text-gray-700 dark:text-gray-300">Category Name</th>
                                    <th className="p-4 font-bold text-gray-700 dark:text-gray-300 w-48">Tax Rate (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {taxConfigs.length === 0 ? (
                                    <tr>
                                        <td colSpan="2" className="p-8 text-center text-gray-500">
                                            No categories found yet. Add products to create categories.
                                        </td>
                                    </tr>
                                ) : (
                                    taxConfigs.map((config, index) => (
                                        <tr key={config.category} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="p-4 font-medium text-gray-800 dark:text-gray-200">
                                                {config.category}
                                            </td>
                                            <td className="p-4">
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        step="0.1"
                                                        value={config.taxRate}
                                                        onChange={(e) => handleTaxRateChange(index, e.target.value)}
                                                        className="input-field w-full pr-8 text-right"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving || taxConfigs.length === 0}
                            className="btn-primary flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <FiRefreshCw className="animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <FiSave /> Save Tax Rules
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default TaxManagementPage;
