import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import axios from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirect = new URLSearchParams(search).get('redirect') || '/';

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            if (userInfo.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                if (!redirect.includes('admin')) {
                    navigate(redirect, { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            }
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/register', { name, email, password, role });

            if (role === 'vendor' || role === 'delivery') {
                toast.success(res.data.message || 'Account created. Please wait for admin approval.');
                navigate('/login');
            } else {
                dispatch(setCredentials({ ...res.data }));
                toast.success('Account created successfully');
                if (res.data.role === 'admin') {
                    navigate('/admin/dashboard', { replace: true });
                } else {
                    if (!redirect.includes('admin')) {
                        navigate(redirect, { replace: true });
                    } else {
                        navigate('/', { replace: true });
                    }
                }
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || err.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full glass rounded-3xl p-8 shadow-xl"
            >
                <div>
                    <h2 className="mt-2 text-center text-3xl font-display font-extrabold text-gray-900 dark:text-white">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Join FreshMart today
                    </p>
                </div>
                <form className="mt-8 space-y-4" onSubmit={submitHandler}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
                        <input
                            type="email"
                            required
                            className="input-field"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Role</label>
                        <select
                            className="input-field bg-white"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="user">Customer (Buy Products)</option>
                            <option value="vendor">Vendor (Sell Products)</option>
                            <option value="delivery">Delivery Agent (Deliver Products)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center btn-primary py-3"
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="font-medium text-primary-600 hover:text-primary-500 transition">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
