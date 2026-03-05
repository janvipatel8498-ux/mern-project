import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiCheckCircle, FiXCircle, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import axios from '../../utils/axiosInstance';

const VendorRequestManager = () => {
    const { users } = useOutletContext();
    const [searchTerm, setSearchTerm] = useState('');

    // Filter for unapproved vendors
    const pendingVendors = users.filter(user => user.role === 'vendor' && !user.isApproved);

    const filteredRequests = pendingVendors.filter(user =>
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleApproval = async (id, isApproved) => {
        try {
            await axios.put(`/api/users/${id}/approve`, { isApproved });
            toast.success(isApproved ? 'Vendor Approved Successfully!' : 'Vendor Application Rejected');
            window.location.reload();
        } catch (err) {
            toast.error('Operation failed');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Onboarding</h2>
                    <p className="text-gray-500 font-medium mt-1">Verify new seller identifies and authorize marketplace access</p>
                </div>
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search applications..."
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
                {filteredRequests.length === 0 ? (
                    <div className="col-span-full glass p-24 rounded-[3rem] text-center border-2 border-dashed border-gray-200 dark:border-white/10">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-white/5">
                            <FiUser className="text-gray-300" size={32} />
                        </div>
                        <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No pending applications</p>
                    </div>
                ) : filteredRequests.map(vendor => (
                    <motion.div
                        key={vendor._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5 }}
                        className="glass group rounded-[2.5rem] p-8 border border-white/40 dark:border-white/5 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-600 to-orange-600 opacity-[0.02] rounded-bl-[5rem]"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center border border-amber-100 dark:border-amber-900/20 shadow-inner group-hover:scale-110 transition-transform">
                                        <span className="text-xl font-black text-amber-600">
                                            {vendor.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-lg leading-tight">
                                            {vendor.name}
                                        </h3>
                                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1">Pending Sync</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white/50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-inner space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Identity Mail</p>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{vendor.email}</p>
                                </div>
                                <div className="flex justify-between items-end border-t border-gray-100 dark:border-white/5 pt-4">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Enrolled</p>
                                        <p className="font-black text-gray-900 dark:text-white text-xs uppercase tracking-tight">
                                            {new Date(vendor.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Type</p>
                                        <p className="font-black text-gray-900 dark:text-white text-xs uppercase tracking-tight">Vendor Asset</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={() => {
                                        if (window.confirm("Authorize permanent rejection?")) {
                                            handleApproval(vendor._id, false)
                                        }
                                    }}
                                    className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-600 border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all active:scale-95"
                                >
                                    Deny
                                </button>
                                <button
                                    onClick={() => handleApproval(vendor._id, true)}
                                    className="flex-[2] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95"
                                >
                                    Authorize Access
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default VendorRequestManager;
