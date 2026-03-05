import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiSend, FiClock, FiCheckCircle } from 'react-icons/fi';
import { createUserTicket, getUserTickets, resetContactTicketState } from '../redux/slices/contactTicketSlice';
import { toast } from 'react-hot-toast';
import moment from 'moment';

const ContactPage = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const { tickets, loading, successCreate, error } = useSelector((state) => state.contactTickets);

    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (userInfo) {
            dispatch(getUserTickets());
        }
    }, [dispatch, userInfo]);

    useEffect(() => {
        if (successCreate) {
            toast.success('Your message has been sent to our support team!');
            setSubject('');
            setMessage('');
            dispatch(resetContactTicketState());
        }
        if (error) {
            toast.error(error);
            dispatch(resetContactTicketState());
        }
    }, [successCreate, error, dispatch]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) {
            return toast.error('Please fill out both subject and message fields.');
        }
        dispatch(createUserTicket({ subject, message }));
    };

    if (!userInfo) {
        return (
            <div className="container mx-auto px-4 py-24 min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6 text-4xl">
                    <FiMessageSquare />
                </div>
                <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4 text-center">Customer Support</h1>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
                    To help us effectively track and respond to your queries, please log in or create an account to contact our support team.
                </p>
                <div className="flex gap-4">
                    <Link to="/login" className="btn-primary">Login to Contact</Link>
                    <Link to="/register" className="btn-secondary">Create Account</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">Customer Support</h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Need help with an order, or have a general question? Send us a message and our team will get back to you as soon as possible.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Ticket Form */}
                <div className="lg:col-span-1 border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-surface p-8 rounded-3xl shadow-sm self-start sticky top-24">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
                        <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/10 text-primary-600 rounded-xl flex items-center justify-center border border-primary-100 dark:border-primary-900/20">
                            <FiSend size={18} />
                        </div>
                        Send a Message
                    </h2>

                    <form onSubmit={submitHandler} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white"
                                placeholder="E.g., Issue with Order #1234..."
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows="6"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white resize-none"
                                placeholder="Please describe how we can help you..."
                                disabled={loading}
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 px-4 rounded-xl text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2 text-lg ${loading ? 'bg-primary-400 cursor-not-allowed shadow-none' : 'bg-primary-600 hover:bg-primary-700 hover:shadow-primary-600/25 active:scale-[0.98]'}`}
                        >
                            {loading ? 'Sending...' : 'Submit Request'}
                        </button>
                    </form>
                </div>

                {/* Tickets History List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white px-2">Your Support History</h2>

                    {loading && tickets.length === 0 ? (
                        <div className="animate-pulse space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 rounded-3xl w-full"></div>
                            ))}
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="bg-gray-50/50 dark:bg-dark-surface p-16 text-center rounded-3xl border border-gray-100 dark:border-gray-800 border-dashed">
                            <FiMessageSquare className="mx-auto text-4xl text-gray-300 dark:text-gray-700 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No active queries</h3>
                            <p className="text-gray-500">You haven't sent any support requests yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {tickets.map((ticket) => (
                                <div key={ticket._id} className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                                        <div>
                                            <h3 className="font-bold text-xl text-gray-900 dark:text-white">{ticket.subject}</h3>
                                            <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                <FiClock size={14} /> {moment(ticket.createdAt).format('MMMM Do YYYY, h:mm a')}
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 w-fit ${ticket.status === 'Answered' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                                                ticket.status === 'Closed' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' :
                                                    'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                                            }`}>
                                            {ticket.status === 'Answered' ? <FiCheckCircle size={14} /> : <FiClock size={14} />}
                                            {ticket.status}
                                        </span>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-dark-bg p-5 rounded-2xl text-[15px] leading-relaxed text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800 whitespace-pre-wrap">
                                        {ticket.message}
                                    </div>

                                    {ticket.adminReply && (
                                        <div className="mt-6 p-6 rounded-2xl border border-primary-100 bg-primary-50/30 dark:bg-primary-900/5 dark:border-primary-900/20 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold">FS</div>
                                                <div>
                                                    <span className="block font-bold text-primary-900 dark:text-primary-300">FreshMart Support</span>
                                                    <span className="block text-xs text-primary-600/70 dark:text-primary-400/70">{moment(ticket.updatedAt).fromNow()}</span>
                                                </div>
                                            </div>
                                            <div className="text-[15px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap pl-11">
                                                {ticket.adminReply}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
