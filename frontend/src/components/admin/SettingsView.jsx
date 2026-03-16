import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiSave, FiSettings, FiPercent, FiPower } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { getSystemSettings } from '../../redux/slices/adminSlice';
import { useOutletContext } from 'react-router-dom';

const SettingsView = () => {
    const { settings } = useOutletContext();
    const dispatch = useDispatch();
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [commission, setCommission] = useState(10);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setMaintenanceMode(settings.maintenanceMode);
            setCommission(settings.commissionPercentage);
        }
    }, [settings]);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await axiosInstance.put('/api/settings', {
                maintenanceMode,
                commissionPercentage: Number(commission)
            }, { withCredentials: true });

            toast.success('Settings updated successfully');
            dispatch(getSystemSettings()); // refresh global state
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update settings');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">System Core</h2>
                    <p className="text-gray-500 font-medium mt-1">Configure global marketplace protocols and operational overrides</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="glass p-10 rounded-[3.5rem] border border-white/40 dark:border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-bl-[5rem]"></div>

                <div className="relative z-10 space-y-12">
                    <div>
                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100 dark:border-white/5">
                            <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-primary-500/20">
                                <FiSettings size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Protocol Overrides</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Direct system manipulation</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between p-8 rounded-[2.5rem] bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-inner group/item hover:bg-white dark:hover:bg-white/10 transition-all duration-300">
                                <div className="flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border border-white/20 shadow-lg transition-transform duration-500 group-hover/item:scale-110 ${maintenanceMode ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-emerald-500 text-white shadow-emerald-500/20'}`}>
                                        <FiPower size={28} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm">Lockdown Mode</h4>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Deauthorize non-admin marketplace access</p>
                                    </div>
                                </div>

                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={maintenanceMode}
                                        onChange={(e) => setMaintenanceMode(e.target.checked)}
                                    />
                                    <div className="w-16 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-dark-surface peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-red-500 shadow-inner"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-8 rounded-[2.5rem] bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-inner group/item hover:bg-white dark:hover:bg-white/10 transition-all duration-300">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-blue-500 text-white rounded-[1.5rem] flex items-center justify-center border border-white/20 shadow-lg shadow-blue-500/20 group-hover/item:scale-110 transition-transform duration-500">
                                        <FiPercent size={28} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm">Revenue Slice</h4>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Platform commission percentage protocol</p>
                                    </div>
                                </div>
                                <div className="flex items-center bg-gray-100 dark:bg-dark-bg p-2 rounded-2xl border border-gray-200 dark:border-white/5 shadow-inner">
                                    <input
                                        type="number"
                                        value={commission}
                                        onChange={(e) => setCommission(e.target.value)}
                                        className="w-16 bg-transparent text-center font-black text-gray-900 dark:text-white outline-none"
                                    />
                                    <span className="pr-4 font-black text-gray-400">%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-8 border-t border-gray-100 dark:border-white/5">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-4 rounded-2xl flex items-center transition-all shadow-xl shadow-primary-500/20 font-black uppercase tracking-widest text-[10px] active:scale-95 disabled:bg-primary-400 border-b-4 border-primary-800"
                        >
                            <FiSave className="mr-3" size={16} /> {isSaving ? 'Syncing...' : 'Commit Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </motion.div>
    );
};

export default SettingsView;
