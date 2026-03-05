import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiMessageSquare, FiClock, FiCheckCircle, FiSend, FiX, FiUser } from 'react-icons/fi';
import { getAllUserTickets, replyToUserTicket, resetContactTicketState } from '../../redux/slices/contactTicketSlice';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';

const UserSupportManager = () => {
    const dispatch = useDispatch();
    const { tickets, loading, successReply, error } = useSelector((state) => state.contactTickets);

    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        dispatch(getAllUserTickets());
    }, [dispatch]);

    useEffect(() => {
        if (successReply) {
            toast.success('Reply sent successfully!');
            setSelectedTicket(null);
            setReplyText('');
            dispatch(resetContactTicketState());
        }
        if (error) {
            toast.error(error);
            dispatch(resetContactTicketState());
        }
    }, [successReply, error, dispatch]);

    const handleReplySubmit = () => {
        if (!replyText.trim()) {
            return toast.error('Please enter a reply.');
        }
        dispatch(replyToUserTicket({
            id: selectedTicket._id,
            adminReply: replyText,
            status: 'Answered'
        }));
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Cst Support</h2>
                    <p className="text-gray-500 font-medium mt-1">Audit customer inquiries and dispatch resolution protocols</p>
                </div>
            </div>

            {loading && tickets.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 glass animate-pulse rounded-[2.5rem] border border-white/40 dark:border-white/5"></div>
                    ))}
                </div>
            ) : tickets.length === 0 ? (
                <div className="glass p-20 text-center rounded-[3rem] border border-white/40 dark:border-white/5">
                    <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No active customer tickets</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tickets.map((ticket) => (
                        <motion.div
                            key={ticket._id}
                            whileHover={{ y: -5 }}
                            className="glass p-8 rounded-[2.5rem] border border-white/40 dark:border-white/5 flex flex-col hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 opacity-[0.02] rounded-bl-[5rem]"></div>

                            <div className="relative z-10 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-white/5 flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                                            <FiUser className="text-blue-600" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm leading-tight line-clamp-1">
                                                {ticket.user?.name}
                                            </h3>
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">Civilian Support</p>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-sm ${ticket.status === 'Answered'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                                        }`}>
                                        {ticket.status}
                                    </span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Subject Header</p>
                                        <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm">{ticket.subject}</h4>
                                    </div>
                                    <div className="p-5 bg-white/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-inner min-h-[100px] flex items-center justify-center">
                                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 italic line-clamp-3 leading-relaxed text-center">
                                            "{ticket.message}"
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <FiClock /> {moment(ticket.createdAt).fromNow()}
                                    </div>
                                    <button
                                        onClick={() => setSelectedTicket(ticket)}
                                        className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${ticket.status === 'Answered'
                                            ? 'bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-400'
                                            : 'bg-primary-600 text-white shadow-lg shadow-primary-500/20 hover:scale-105'
                                            }`}
                                    >
                                        {ticket.status === 'Answered' ? 'Update Reply' : 'Dispatch Response'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Reply Modal */}
            <AnimatePresence>
                {selectedTicket && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-dark-surface p-6 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-100 dark:border-gray-800"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Reply to Customer</h2>
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-colors"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-800">
                                        <p className="text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-wider mb-2">Customer Details</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white dark:bg-dark-surface rounded-full flex items-center justify-center text-blue-600">
                                                <FiUser size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{selectedTicket.user?.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTicket.user?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Subject: {selectedTicket.subject}</p>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-2 italic whitespace-pre-wrap">"{selectedTicket.message}"</p>
                                        <p className="text-xs text-gray-400 mt-3">{moment(selectedTicket.createdAt).format('MMMM Do YYYY, h:mm a')}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 flex flex-col">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Your Support Reply</label>
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Type your response to the customer here..."
                                        className="w-full flex-1 min-h-[150px] p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white resize-none"
                                    ></textarea>
                                    {selectedTicket.adminReply && !replyText && (
                                        <p className="text-xs text-amber-600 italic">
                                            * This ticket already has a reply. Submitting a new one will override the previous reply.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="px-6 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReplySubmit}
                                    disabled={loading}
                                    className="px-8 py-2 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/20 active:scale-95 transition-all flex items-center gap-2"
                                >
                                    {loading ? 'Sending...' : <><FiSend /> Send Reply</>}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserSupportManager;
