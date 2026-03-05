import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FiPackage, FiChevronRight, FiGrid, FiUser, FiMail, FiLock, FiShield } from 'react-icons/fi';
import axios from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { setCredentials } from '../redux/slices/authSlice';

const ProfilePage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
                const { data } = await axios.put(
                    '/api/auth/profile',
                    { name, email, password },
                    config
                );

                dispatch(setCredentials({ ...data }));
                toast.success('Profile Updated');
                setPassword('');
                setConfirmPassword('');
            } catch (err) {
                toast.error(err?.response?.data?.message || err.error);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <h2 className="text-4xl font-display font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Your Dashboard</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Card & Quick Links */}
                <div className="space-y-6 lg:col-span-1">
                    {/* Profile Card */}
                    <div className="glass rounded-3xl shadow-xl overflow-hidden border border-white/40 dark:border-gray-800/60 relative group hover:shadow-2xl transition-all duration-300">
                        <div className="h-32 w-full bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-150 duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl transform -translate-x-1/2 translate-y-1/2"></div>
                        </div>
                        <div className="px-6 pb-8 flex flex-col items-center relative -mt-16">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 shadow-lg flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-400 text-white text-5xl font-bold ring-4 ring-primary-50 dark:ring-primary-900/20">
                                    {userInfo?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full shadow-sm"></div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 tracking-tight">{userInfo?.name}</h3>
                            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                                <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-1.5">
                                    <FiUser className="w-3 h-3 text-primary-500" />
                                    {userInfo?.role}
                                </span>
                                {userInfo?.role === 'vendor' && (
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border flex items-center gap-1.5 ${userInfo?.isApproved ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                        <FiShield className={`w-3 h-3 ${userInfo?.isApproved ? 'text-green-500' : 'text-amber-500'}`} />
                                        {userInfo?.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links Card */}
                    <div className="glass rounded-3xl shadow-lg p-6 border border-white/40 dark:border-gray-800/60 transition-all hover:shadow-xl">
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <FiGrid className="text-primary-500 w-4 h-4" /> Quick Access
                        </h4>
                        <div className="space-y-3">
                            {userInfo?.role === 'vendor' && (
                                <Link to="/vendor/dashboard" className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl group hover:shadow-lg hover:shadow-primary-600/30 transition-all hover:-translate-y-0.5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white shadow-inner">
                                            <FiGrid className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">Vendor Dashboard</h4>
                                            <p className="text-xs text-primary-100 mt-0.5">Manage shop & orders</p>
                                        </div>
                                    </div>
                                    <FiChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                </Link>
                            )}
                            {userInfo?.role === 'delivery' && (
                                <Link to="/delivery/dashboard" className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl group hover:shadow-lg hover:shadow-primary-600/30 transition-all hover:-translate-y-0.5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white shadow-inner">
                                            <FiPackage className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">Delivery Dashboard</h4>
                                            <p className="text-xs text-primary-100 mt-0.5">Manage missions</p>
                                        </div>
                                    </div>
                                    <FiChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                </Link>
                            )}
                            {['user'].includes(userInfo?.role) && (
                                <Link to="/orders" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl group hover:bg-white dark:hover:bg-gray-800 transition-all border border-gray-100 dark:border-gray-700 hover:shadow-md">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-sm border border-gray-100 dark:border-gray-600">
                                            <FiPackage className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Order History</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Track past orders</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors">
                                        <FiChevronRight className="text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings Form */}
                <div className="lg:col-span-2">
                    <div className="glass rounded-3xl shadow-xl p-8 border border-white/40 dark:border-gray-800/60 h-full">
                        <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Profile Settings</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">Manage your personal information and security preferences</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 shadow-inner border border-primary-100 dark:border-primary-800/30">
                                <FiUser className="w-6 h-6" />
                            </div>
                        </div>

                        <form onSubmit={submitHandler} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <FiUser className="text-gray-400" /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white shadow-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <FiMail className="text-gray-400" /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FiLock className="text-primary-500" /> Security
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Leave blank to keep current"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white shadow-sm"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm Password</label>
                                        <input
                                            type="password"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end">
                                <button type="submit" className="px-8 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transform hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 min-w-[200px]">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
