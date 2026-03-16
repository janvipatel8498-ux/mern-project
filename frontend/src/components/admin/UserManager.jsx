import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { blockUser, deleteUser } from '../../redux/slices/adminSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiTrash2, FiLock, FiUnlock, FiEye, FiPlus, FiX, FiMapPin, FiClock, FiShield, FiMail, FiUser, FiPhone, FiImage } from 'react-icons/fi';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';

const UserManager = () => {
    const { users } = useOutletContext();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    const filteredUsers = users.filter(user =>
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleBlockToggle = (id, currentStatus) => {
        dispatch(blockUser({ userId: id, isBlocked: !currentStatus }));
        toast.success(`User ${!currentStatus ? 'blocked' : 'unblocked'} successfully`);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            dispatch(deleteUser(id));
            toast.success("User deleted thoroughly");
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">User Directory</h2>
                    <p className="text-gray-500 font-medium mt-1">Manage platform access and monitor user roles</p>
                </div>
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search identity..."
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
                {filteredUsers.length === 0 ? (
                    <div className="col-span-full glass p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200 dark:border-white/10">
                        <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No identities found</p>
                    </div>
                ) : filteredUsers.map(user => (
                    <motion.div
                        key={user._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass group rounded-[2.5rem] p-8 border border-white/40 dark:border-white/5 transition-all hover:shadow-2xl hover:border-primary-500/20 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-600 to-blue-600 opacity-[0.02] rounded-bl-[5rem]"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner relative overflow-hidden group-hover:scale-110 transition-transform duration-500 shrink-0">
                                        <span className="text-2xl font-black bg-gradient-to-br from-primary-600 to-blue-600 bg-clip-text text-transparent">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                        <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-dark-bg ${user.isBlocked ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-lg leading-tight line-clamp-1">{user.name}</h3>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg border-b-2 flex items-center justify-center min-w-[110px] whitespace-nowrap ${user.role === 'admin'
                                        ? 'bg-purple-600 text-white border-purple-800 shadow-purple-500/20' :
                                        user.role === 'vendor'
                                            ? 'bg-amber-500 text-white border-amber-700 shadow-amber-500/20' :
                                            'bg-blue-600 text-white border-blue-800 shadow-blue-500/20'
                                        }`}>
                                        {user.role === 'admin' ? 'Master Admin' : user.role === 'vendor' ? 'Service Partner' : 'Market User'}
                                    </span>
                                    {user.role === 'vendor' && (
                                        <span className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] shadow-sm border-b-2 whitespace-nowrap ${user.isApproved
                                            ? 'bg-emerald-500 text-white border-emerald-700 shadow-emerald-500/10'
                                            : 'bg-gray-400 text-white border-gray-600 shadow-gray-400/10'
                                            }`}>
                                            {user.isApproved ? 'Verified' : 'Reviewing'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Enrolled Since</p>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    {user.role === 'vendor' && !user.isApproved && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await axiosInstance.put(`/api/users/${user._id}/approve`, { isApproved: true });
                                                    toast.success('Vendor Approved');
                                                    window.location.reload();
                                                } catch (err) {
                                                    toast.error('Approval failed');
                                                }
                                            }}
                                            className="w-12 h-12 flex items-center justify-center bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 border-b-4 border-emerald-700"
                                            title="Approve Protocol"
                                        >
                                            <FiPlus size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setSelectedUser(user)}
                                        className="w-12 h-12 flex items-center justify-center bg-white/50 dark:bg-white/5 text-gray-500 hover:text-primary-600 rounded-2xl transition-all shadow-sm active:scale-95 border border-white/40 dark:border-white/5"
                                        title="View Logs"
                                    >
                                        <FiEye size={18} />
                                    </button>
                                    {user.role !== 'admin' && (
                                        <>
                                            <button
                                                onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                                                className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-lg active:scale-95 border-b-4 ${user.isBlocked ? 'bg-emerald-500 text-white shadow-emerald-500/20 border-emerald-700' : 'bg-orange-500 text-white shadow-orange-500/20 border-orange-700'}`}
                                                title={user.isBlocked ? "Invoke Unlock" : "Enforce Lockdown"}
                                            >
                                                {user.isBlocked ? <FiUnlock size={18} /> : <FiLock size={18} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="w-12 h-12 flex items-center justify-center bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95 border-b-4 border-red-700"
                                                title="Deauthorize Entity"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedUser(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 dark:border-white/10"
                        >
                            <div className="relative h-32 bg-gradient-to-r from-primary-600 to-blue-600">
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
                                >
                                    <FiX size={18} />
                                </button>
                                <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white dark:bg-gray-700 rounded-2xl p-2 shadow-lg">
                                    <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-600 dark:to-gray-800 rounded-xl flex items-center justify-center border border-primary-200 dark:border-gray-600">
                                        <span className="text-4xl font-black bg-gradient-to-br from-primary-600 to-blue-600 bg-clip-text text-transparent">
                                            {selectedUser.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-16 pb-8 px-8 space-y-6">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                        {selectedUser.name}
                                        {selectedUser.role === 'admin' && <FiShield className="text-purple-500" size={20} />}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1 text-gray-500 dark:text-gray-400">
                                        <FiMail size={14} />
                                        <span className="text-sm">{selectedUser.email}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Role</p>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                                            {selectedUser.role}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><FiClock size={12} /> Status</p>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                                            {selectedUser.isBlocked ? (
                                                <span className="text-red-500 flex items-center gap-1"><FiLock size={14} /> Blocked</span>
                                            ) : (
                                                <span className="text-emerald-500 flex items-center gap-1"><FiUnlock size={14} /> Active</span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 col-span-2">
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><FiClock size={12} /> Enrolled Since</p>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                                            {new Date(selectedUser.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>

                                    {selectedUser.phoneNumber && (
                                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 col-span-2 sm:col-span-1">
                                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><FiPhone size={12} /> Phone Number</p>
                                            <p className="font-semibold text-gray-800 dark:text-gray-200">
                                                {selectedUser.phoneNumber}
                                            </p>
                                        </div>
                                    )}
                                    {selectedUser.panCardPhoto && (
                                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 col-span-2 sm:col-span-1">
                                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><FiImage size={12} /> PAN Card Photo</p>
                                            <a href={selectedUser.panCardPhoto} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 hover:opacity-80 transition-opacity">
                                                <img src={selectedUser.panCardPhoto} alt="PAN Card" className="h-16 w-auto object-cover rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default UserManager;
