import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiPackage } from 'react-icons/fi';
import { logout } from '../redux/slices/authSlice';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';

const Header = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            await axiosInstance.post('/api/auth/logout');
            dispatch(logout());
            setIsMenuOpen(false);
            navigate('/login', { replace: true });
            toast.success('Logged out successfully');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <header className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-dark-border shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-display font-extrabold tracking-tight text-primary-600 dark:text-primary-400">
                    Fresh<span className="text-gray-800 dark:text-gray-100">Mart</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8">
                    {userInfo?.role !== 'delivery' && (
                        <>
                            <Link to="/" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium transition-colors">Home</Link>
                            <Link to="/products" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium transition-colors">Products</Link>
                            <Link to="/cart" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium transition-colors relative flex items-center">
                                <FiShoppingCart className="text-xl mr-1" /> Cart
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                                    </span>
                                )}
                            </Link>
                            {userInfo && !['admin', 'delivery'].includes(userInfo.role) && (
                                <Link to="/orders" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium transition-colors relative flex items-center">
                                    <FiPackage className="text-xl mr-1" /> My Orders
                                </Link>
                            )}
                        </>
                    )}

                    {userInfo ? (
                        <div className="relative group">
                            <button className="flex items-center text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium transition-colors">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${userInfo.name}&background=random&color=fff&length=1`}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 mr-2"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
                                    }}
                                />
                                {userInfo.name.split(' ')[0]}
                            </button>
                            {/* Dropdown menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-gray-100 dark:border-dark-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                                <div className="py-2">
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">Profile</Link>
                                    {userInfo.role === 'vendor' && (
                                        <Link to="/vendor/dashboard" className="block px-4 py-2 text-sm text-primary-600 font-bold hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/10">Vendor Dashboard</Link>
                                    )}
                                    {userInfo.role === 'admin' && (
                                        <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-primary-600 font-bold hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/10">Admin Dashboard</Link>
                                    )}
                                    {userInfo.role === 'delivery' && (
                                        <Link to="/delivery/dashboard" className="block px-4 py-2 text-sm text-primary-600 font-bold hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/10">Delivery Dashboard</Link>
                                    )}
                                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                    <button
                                        onClick={logoutHandler}
                                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
                                    >
                                        <FiLogOut className="mr-2" /> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-primary">
                            Sign In
                        </Link>
                    )}
                </nav>

                {/* Mobile Icons */}
                <div className="flex items-center gap-4 md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-2xl text-gray-600 dark:text-gray-300 focus:outline-none"
                    >
                        <FiMenu />
                    </button>
                </div>

                {/* Mobile Sidebar Navigation */}
                <div className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsMenuOpen(false)}>
                    <div
                        className={`absolute right-0 top-0 h-full w-72 bg-white dark:bg-dark-surface shadow-2xl transition-transform duration-300 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-xl font-display font-bold text-primary-600 italic">Menu</span>
                                <button onClick={() => setIsMenuOpen(false)} className="text-2xl">&times;</button>
                            </div>

                            <nav className="flex flex-col space-y-4">
                                {userInfo?.role !== 'delivery' && (
                                    <>
                                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-700 dark:text-gray-300 font-medium hover:text-primary-600 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Home</Link>
                                        <Link to="/products" onClick={() => setIsMenuOpen(false)} className="text-gray-700 dark:text-gray-300 font-medium hover:text-primary-600 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Products</Link>
                                        <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center text-gray-700 dark:text-gray-300 font-medium hover:text-primary-600 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <FiShoppingCart className="mr-3" /> Cart
                                            {cartItems.length > 0 && (
                                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                                                </span>
                                            )}
                                        </Link>
                                        {userInfo && !['admin', 'delivery'].includes(userInfo.role) && (
                                            <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="flex items-center text-gray-700 dark:text-gray-300 font-medium hover:text-primary-600 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <FiPackage className="mr-3" /> My Orders
                                            </Link>
                                        )}
                                    </>
                                )}

                                {userInfo ? (
                                    <>
                                        <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
                                        <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/10 rounded-2xl">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${userInfo.name}&background=random&color=fff&length=1`}
                                                alt="avatar"
                                                className="w-10 h-10 rounded-full border border-white dark:border-gray-800 shadow-sm"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
                                                }}
                                            />
                                            <div>
                                                <p className="font-bold text-sm">{userInfo.name}</p>
                                                <p className="text-xs text-primary-600">View Profile</p>
                                            </div>
                                        </Link>

                                        <div className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-4">
                                            <button
                                                onClick={logoutHandler}
                                                className="flex w-full items-center p-3 text-red-600 font-bold hover:bg-red-50 rounded-xl"
                                            >
                                                <FiLogOut className="mr-2" /> Logout
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn-primary w-full text-center py-3 mt-4">Sign In</Link>
                                )}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
