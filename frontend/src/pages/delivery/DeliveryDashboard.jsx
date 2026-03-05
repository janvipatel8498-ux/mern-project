import React from 'react';
import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import axios from '../../utils/axiosInstance';
import {
    FiGrid,
    FiTruck,
    FiLogOut,
    FiUser,
    FiClock,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const DeliveryDashboard = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Protect route: Redirect if not a delivery agent or admin
    if (!userInfo) {
        return <Navigate to="/login" replace />;
    }
    if (userInfo.role !== 'delivery' && userInfo.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

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
        { name: 'Overview', icon: <FiGrid />, path: '/delivery/dashboard', index: true },
        { name: 'Order Requests', icon: <FiClock />, path: '/delivery/dashboard/requests' },
        { name: 'Assigned Orders', icon: <FiTruck />, path: '/delivery/dashboard/assigned' },
        { name: 'Delivery History', icon: <FiClock />, path: '/delivery/dashboard/history' },
        { name: 'Profile', icon: <FiUser />, path: '/delivery/dashboard/profile' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-dark-bg">
            {/* Sidebar */}
            <aside className="w-72 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 flex flex-col pt-10 pb-6 shadow-2xl z-20">
                <div className="px-8 mb-10">
                    <div className="p-6 bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl shadow-lg shadow-primary-600/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-150 duration-700"></div>

                        <p className="text-[10px] text-primary-100 font-black uppercase tracking-widest mb-2 opacity-80">Delivery Professional</p>
                        <h2 className="text-xl font-display font-bold text-white truncate mb-4">{userInfo?.name}</h2>

                        <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit border border-white/10 shadow-inner">
                            <div className={`w-2.5 h-2.5 rounded-full shadow-sm animate-pulse ${userInfo.isOnline !== false ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
                                {userInfo.isOnline !== false ? 'Active & Ready' : 'System Offline'}
                            </span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {sidebarItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.index}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${isActive
                                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-xl shadow-primary-500/30 -translate-y-0.5'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                                }`
                            }
                        >
                            <span className={`text-xl transition-transform duration-300 group-hover:scale-110`}>{item.icon}</span>
                            <span className="font-bold text-sm tracking-tight">{item.name}</span>
                        </NavLink>
                    ))}

                    <div className="pt-8 pb-4 px-4 mt-auto">
                        <button
                            onClick={logoutHandler}
                            className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 border border-transparent hover:border-red-100 dark:hover:border-red-900/20 w-full text-left group"
                        >
                            <span className="text-xl transition-transform group-hover:rotate-12"><FiLogOut /></span>
                            <span className="font-bold text-sm">Exit Dashboard</span>
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-8 pb-8 pt-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
};

export default DeliveryDashboard;
