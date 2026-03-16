import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { FiUsers, FiShoppingBag, FiBox, FiList, FiSettings, FiPieChart, FiUserPlus, FiXCircle, FiUser, FiLogOut, FiUserCheck, FiTruck, FiMessageSquare, FiStar, FiHelpCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';

// Redux Actions
import { getAdminUsers, getAdminOrders, getSystemSettings } from '../../redux/slices/adminSlice';
import { listProducts } from '../../redux/slices/productSlice';
import { logout } from '../../redux/slices/authSlice';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const { userInfo } = useSelector((state) => state.auth);
    const { users, orders, settings, loading: adminLoading } = useSelector((state) => state.admin);
    const { products, loading: productsLoading, page, pages } = useSelector((state) => state.products);

    useEffect(() => {
        if (!userInfo || userInfo.role !== 'admin') {
            navigate('/login', { replace: true });
            return;
        }

        dispatch(getAdminUsers());
        dispatch(getAdminOrders());
        dispatch(getSystemSettings());
        dispatch(listProducts());
    }, [dispatch, userInfo, navigate]);

    const handleOrderUpdate = () => dispatch(getAdminOrders());

    const logoutHandler = async () => {
        try {
            await axios.post('/api/auth/logout');
            dispatch(logout());
            toast.success('Admin logged out');
            navigate('/login');
        } catch (err) {
            toast.error('Logout failed');
        }
    };

    const tabs = [
        { name: 'Overview', icon: <FiPieChart />, path: '' },
        { name: 'Users', icon: <FiUsers />, path: 'users' },
        { name: 'Product Lib', icon: <FiBox />, path: 'products' },
        { name: 'Order Feed', icon: <FiList />, path: 'orders' },
        { name: 'Onboarding', icon: <FiUserPlus />, path: 'vendor-requests' },
        { name: 'Partners', icon: <FiUserCheck />, path: 'vendors' },
        { name: 'Logistic Hub', icon: <FiTruck />, path: 'delivery-agents' },
        { name: 'Risk Control', icon: <FiXCircle />, path: 'cancelled' },
        { name: 'Reviews', icon: <FiStar />, path: 'vendor-reviews' },
        { name: 'Vnd Insight', icon: <FiMessageSquare />, path: 'support' },
        { name: 'Cst Support', icon: <FiHelpCircle />, path: 'customer-support' },
        { name: 'Taxes', icon: <FiSettings />, path: 'taxes' },
        { name: 'Categories', icon: <FiList />, path: 'categories' },
        { name: 'Profile', icon: <FiUser />, path: 'profile' },
    ];

    if (adminLoading) return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="bg-[#fcfcfd] dark:bg-[#0A0A0B] flex flex-col md:flex-row min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-500 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/5 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full animation-delay-2000"></div>
            </div>

            {/* Sidebar */}
            <div className="w-full md:w-80 glass border-r border-white/40 dark:border-white/5 flex flex-col dark:bg-black/20 backdrop-blur-3xl z-20 relative">
                {/* Admin Identity Section */}
                <div className="p-8 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative w-14 h-14 bg-white dark:bg-dark-surface rounded-2xl flex items-center justify-center border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden">
                                <span className="text-2xl font-black bg-gradient-to-br from-primary-600 to-blue-600 bg-clip-text text-transparent">
                                    {userInfo?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-dark-bg rounded-full"></div>
                        </div>
                        <div>
                            <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter text-lg leading-tight">Master Control</h2>
                            <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-md w-fit mt-1">System Admin</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto scrollbar-hide custom-scrollbar">
                    <div className="px-4 mb-4">
                        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Core Management</span>
                    </div>
                    {tabs.map((tab, idx) => (
                        <React.Fragment key={tab.name}>
                            {idx === 1 && (
                                <div className="px-4 mt-8 mb-4">
                                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Operations & Support</span>
                                </div>
                            )}
                            <NavLink
                                to={tab.path}
                                end={tab.path === ''}
                                className={({ isActive }) =>
                                    `group relative flex items-center px-5 py-4 rounded-2xl transition-all duration-300 font-bold overflow-hidden ${isActive
                                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/25 scale-[1.02]'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-white/5'
                                    }`
                                }
                            >
                                <div className="relative z-10 flex items-center gap-4">
                                    <span className="text-xl transition-transform group-hover:scale-110 duration-300">
                                        {tab.icon}
                                    </span>
                                    <span className="uppercase tracking-widest text-[10px] font-black">
                                        {tab.name}
                                    </span>
                                </div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                                </div>
                            </NavLink>
                        </React.Fragment>
                    ))}
                </nav>

                {/* Footer Section */}
                <div className="p-6 mt-auto border-t border-gray-100 dark:border-white/5">
                    <button
                        onClick={logoutHandler}
                        className="w-full group flex items-center gap-4 px-6 py-4 rounded-2xl transition-all hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-500 dark:text-gray-400 hover:text-red-600 font-black uppercase text-[10px] tracking-widest shadow-sm hover:shadow-red-500/10"
                    >
                        <FiLogOut className="text-lg group-hover:rotate-12 transition-transform" />
                        Term Sesson
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-y-auto custom-scrollbar bg-transparent">
                <div className="max-w-[1600px] mx-auto p-6 md:p-12 min-h-screen">
                    {/* Header Top Bar */}
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] mb-2">System Live</p>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                {tabs.find(t => {
                                    const currentPath = window.location.pathname;
                                    if (t.path === '') {
                                        return currentPath.endsWith('/admin/dashboard') || currentPath.endsWith('/admin/dashboard/');
                                    }
                                    return currentPath.includes(`/admin/dashboard/${t.path}`);
                                })?.name || 'Command Center'}
                            </h1>
                        </div>
                        <div className="flex gap-4">
                            {/* Icons removed as per request */}
                        </div>
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Outlet context={{
                            users,
                            orders,
                            products,
                            page,
                            pages,
                            settings,
                            productsLoading,
                            handleOrderUpdate
                        }} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
