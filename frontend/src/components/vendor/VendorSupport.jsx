import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiMessageSquare, FiSend, FiClock, FiCheckCircle } from 'react-icons/fi';
import { createTicket, getVendorTickets, resetTicketState } from '../../redux/slices/ticketSlice';
import { toast } from 'react-hot-toast';
import moment from 'moment';

const VendorSupport = () => {
    const dispatch = useDispatch();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const { tickets, loading, successCreate, error } = useSelector((state) => state.tickets);

    useEffect(() => {
        dispatch(getVendorTickets());
    }, [dispatch]);

    useEffect(() => {
        if (successCreate) {
            toast.success('Your message has been sent to Admin!');
            setSubject('');
            setMessage('');
            dispatch(resetTicketState());
        }
        if (error) {
            toast.error(error);
            dispatch(resetTicketState());
        }
    }, [successCreate, error, dispatch]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) {
            return toast.error('Please fill out both subject and message fields.');
        }
        dispatch(createTicket({ subject, message }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <FiMessageSquare className="text-primary-600" /> Support Tickets
                </h1>
                <p className="text-gray-500 mt-1">Send a message or request to the admin and view their replies.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Ticket Form */}
                <div className="lg:col-span-1 border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-surface p-6 rounded-3xl shadow-sm self-start sticky top-6">
                    <h2 className="text-xl font-bold mb-4 flex justify-between items-center text-gray-900 dark:text-white">
                        <span>New Request</span>
                        <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/10 text-primary-600 rounded-xl flex items-center justify-center">
                            <FiSend size={18} />
                        </div>
                    </h2>

                    <form onSubmit={submitHandler} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white"
                                placeholder="E.g., Need help with payout..."
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows="5"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white resize-none"
                                placeholder="Describe your issue or request here..."
                                disabled={loading}
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-xl text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${loading ? 'bg-primary-400 cursor-not-allowed shadow-none' : 'bg-primary-600 hover:bg-primary-700 hover:shadow-primary-600/25 active:scale-[0.98]'}`}
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>

                {/* Tickets History List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Previous Requests</h2>

                    {loading && tickets.length === 0 ? (
                        <div className="animate-pulse space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full"></div>
                            ))}
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="glass p-12 text-center rounded-3xl border border-gray-100 dark:border-gray-800">
                            <p className="text-gray-500">You haven't sent any messages to the admin yet.</p>
                        </div>
                    ) : (
                        tickets.map((ticket) => (
                            <div key={ticket._id} className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-surface p-6 rounded-3xl shadow-sm transition-all hover:shadow-md">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{ticket.subject}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${ticket.status === 'Answered' ? 'bg-green-100 text-green-700' :
                                            ticket.status === 'Closed' ? 'bg-gray-100 text-gray-700' :
                                                'bg-amber-100 text-amber-700'
                                        }`}>
                                        {ticket.status === 'Answered' ? <FiCheckCircle size={12} /> : <FiClock size={12} />}
                                        {ticket.status}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-400 mb-4 flex items-center gap-2">
                                    <FiClock size={12} /> {moment(ticket.createdAt).format('MMMM Do YYYY, h:mm a')}
                                </div>

                                <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-xl text-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800 whitespace-pre-wrap">
                                    {ticket.message}
                                </div>

                                {ticket.adminReply && (
                                    <div className="mt-4 p-4 rounded-xl border-l-4 border-l-primary-500 bg-primary-50/50 dark:bg-primary-900/10 dark:border-gray-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 rounded-full bg-primary-200 text-primary-700 flex items-center justify-center font-bold text-xs">A</div>
                                            <span className="font-bold text-sm text-primary-800 dark:text-primary-300">Admin Reply</span>
                                            <span className="text-xs text-gray-400 ml-auto">{moment(ticket.updatedAt).fromNow()}</span>
                                        </div>
                                        <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap pl-8">
                                            {ticket.adminReply}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorSupport;
