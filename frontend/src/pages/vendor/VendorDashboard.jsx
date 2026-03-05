import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import axios from '../../utils/axiosInstance';
import {
    FiGrid,
    FiPackage,
    FiShoppingCart,
    FiLogOut,
    FiXCircle,
    FiSettings,
    FiTrendingUp,
    FiUser,
    FiList,
    FiBell,
    FiMessageSquare,
    FiHelpCircle
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const VendorDashboard = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isApproved = userInfo?.isApproved;

    const logoutHandler = async () => {
        try {
            await axios.post('/api/auth/logout');
            dispatch(logout());
            toast.success('Logged out from dashboard');
            navigate('/login');
        } catch (err) {
            toast.error('Logout failed');
        }
    };

    const sidebarItems = [
        { name: 'Overview', icon: <FiGrid />, path: '/vendor/dashboard', index: true },
        { name: 'Sales & Revenue', icon: <FiTrendingUp />, path: '/vendor/dashboard/sales' },
        { name: 'Products', icon: <FiPackage />, path: '/vendor/dashboard/products' },
        { name: 'Inventory', icon: <FiList />, path: '/vendor/dashboard/inventory' },
        { name: 'Orders', icon: <FiShoppingCart />, path: '/vendor/dashboard/orders' },
        { name: 'Cancelled', icon: <FiXCircle />, path: '/vendor/dashboard/cancelled' },
        { name: 'Reviews', icon: <FiMessageSquare />, path: '/vendor/dashboard/reviews' },
        { name: 'Support', icon: <FiHelpCircle />, path: '/vendor/dashboard/support' },
        { name: 'Profile', icon: <FiUser />, path: '/vendor/dashboard/profile' },
        { name: 'Notifications', icon: <FiBell />, path: '/vendor/dashboard/notifications' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-[#0A0A0B] transition-colors duration-500 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-white/70 dark:bg-[#121214]/70 backdrop-blur-xl border-r border-gray-100 dark:border-white/5 flex flex-col relative z-20 shadow-2xl shadow-black/5">
                <div className="p-8">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-primary-400 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative p-6 bg-white dark:bg-[#1A1A1D] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-primary-500/30">
                                    {(userInfo?.name || 'V').charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-0.5">Partner</p>
                                    <h2 className="text-sm font-black text-gray-900 dark:text-white truncate">{userInfo?.name}</h2>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Verified Store</span>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pb-8">
                    <div className="px-4 mb-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Management</p>
                    </div>
                    {sidebarItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.index}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-300 group ${isActive
                                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-xl shadow-primary-600/20 translate-x-1'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-white/5 hover:text-primary-600 dark:hover:text-primary-400'
                                }`
                            }
                        >
                            <span className={`text-xl transition-transform duration-300 group-hover:scale-110`}>{item.icon}</span>
                            <span className="font-black text-xs uppercase tracking-widest">{item.name}</span>
                        </NavLink>
                    ))}

                    <div className="pt-8 px-4 border-t border-gray-100 dark:border-white/5 mt-4">
                        <button
                            onClick={logoutHandler}
                            className="flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-300 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 w-full group"
                        >
                            <span className="text-xl group-hover:rotate-12 transition-transform"><FiLogOut /></span>
                            <span className="font-black text-xs uppercase tracking-widest">Sign Out</span>
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative bg-[#F8FAFC] dark:bg-[#0A0A0B] custom-scrollbar">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary-600/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

                <div className="max-w-[1600px] mx-auto pt-12 px-10 pb-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default VendorDashboard;
