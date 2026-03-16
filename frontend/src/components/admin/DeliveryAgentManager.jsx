import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiCheckCircle, FiXCircle, FiUser, FiTruck, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import axios from '../../utils/axiosInstance';

const DeliveryAgentManager = () => {
    const { users } = useOutletContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'

    // Filter delivery agents
    const deliveryAgents = users.filter(user => user.role === 'delivery');

    const pendingAgents = deliveryAgents.filter(agent => !agent.isApproved);
    const approvedAgents = deliveryAgents.filter(agent => agent.isApproved);

    const displayAgents = activeTab === 'pending' ? pendingAgents : approvedAgents;

    const filteredAgents = displayAgents.filter(agent =>
    (agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleApproval = async (id, isApproved) => {
        try {
            await axios.put(`/api/users/${id}/approve`, { isApproved });
            toast.success(isApproved ? 'Agent Approved Successfully!' : 'Agent Request Rejected');
            window.location.reload();
        } catch (err) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this agent?")) return;
        try {
            await axios.delete(`/api/users/${id}`);
            toast.success('Agent removed');
            window.location.reload();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Logistic Hub</h2>
                    <p className="text-gray-500 font-medium mt-1">Manage delivery fleet registrations and real-time partner activity</p>
                </div>
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search fleet..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none font-bold text-sm shadow-sm transition-all text-gray-900 dark:text-white"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <FiSearch size={18} />
                    </div>
                </div>
            </div>

            <div className="flex space-x-3 p-1.5 glass bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl w-max">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-gray-500 hover:text-primary-600'}`}
                >
                    <FiClock /> Verification {pendingAgents.length > 0 && <span className="bg-white/20 px-2 py-0.5 rounded-full text-[8px]">{pendingAgents.length}</span>}
                </button>
                <button
                    onClick={() => setActiveTab('approved')}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'approved' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-gray-500 hover:text-primary-600'}`}
                >
                    <FiTruck /> Active Fleet {approvedAgents.length > 0 && <span className="bg-white/20 px-2 py-0.5 rounded-full text-[8px]">{approvedAgents.length}</span>}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredAgents.length === 0 ? (
                    <div className="col-span-full glass p-24 rounded-[3rem] text-center border-2 border-dashed border-gray-200 dark:border-white/10">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-white/5">
                            <FiUser className="text-gray-300" size={32} />
                        </div>
                        <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No personnel identified</p>
                    </div>
                ) : filteredAgents.map(agent => (
                    <motion.div
                        key={agent._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5 }}
                        className="glass group rounded-[2.5rem] p-8 border border-white/40 dark:border-white/5 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600 to-emerald-600 opacity-[0.02] rounded-bl-[5rem]"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                                        <span className="text-xl font-black bg-gradient-to-br from-primary-600 to-blue-600 bg-clip-text text-transparent">
                                            {agent.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-lg leading-tight">
                                            {agent.name}
                                        </h3>
                                        {agent.isApproved && (
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <div className={`w-2 h-2 rounded-full ${agent.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${agent.isOnline ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                    {agent.isOnline ? 'Direct Connect' : 'Disconnected'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white/50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-inner space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Network Identity</p>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{agent.email}</p>
                                </div>
                                {agent.phoneNumber && (
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Contact</p>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{agent.phoneNumber}</p>
                                    </div>
                                )}
                                {agent.panCardPhoto && (
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                            KYC Verification
                                            <FiCheckCircle className="text-emerald-500" size={12} />
                                        </p>
                                        <a href={agent.panCardPhoto} target="_blank" rel="noopener noreferrer" className="block mt-1 hover:opacity-80 transition-opacity">
                                            <img src={agent.panCardPhoto} alt="PAN Card" className="h-12 w-20 object-cover rounded-xl border border-gray-200 dark:border-white/10 shadow-sm" />
                                        </a>
                                    </div>
                                )}
                                <div className="flex justify-between items-end border-t border-gray-100 dark:border-white/5 pt-4">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Protocol Date</p>
                                        <p className="font-black text-gray-900 dark:text-white text-xs uppercase tracking-tight">
                                            {new Date(activeTab === 'pending' ? agent.createdAt : (agent.approvedAt || agent.updatedAt)).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Fleet Unit</p>
                                        <p className="font-black text-gray-900 dark:text-white text-xs uppercase tracking-tight">Delivery Ops</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                {activeTab === 'pending' ? (
                                    <>
                                        <button
                                            onClick={() => handleApproval(agent._id, false)}
                                            className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-600 border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all active:scale-95"
                                        >
                                            Deny
                                        </button>
                                        <button
                                            onClick={() => handleApproval(agent._id, true)}
                                            className="flex-[2] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95"
                                        >
                                            Authorize
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleDelete(agent._id)}
                                        className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-600 border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <FiXCircle size={14} /> Decommission Unit
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default DeliveryAgentManager;
