import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import axios from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            } else if (userInfo.role === 'vendor') {
                navigate('/vendor/dashboard', { replace: true });
            } else if (userInfo.role === 'delivery') {
                navigate('/delivery/dashboard', { replace: true });
            } else {
                navigate(redirect, { replace: true });
            }
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            dispatch(setCredentials({ ...res.data }));
            toast.success('Logged in successfully');
            if (res.data.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else if (res.data.role === 'vendor') {
                navigate('/vendor/dashboard', { replace: true });
            } else if (res.data.role === 'delivery') {
                navigate('/delivery/dashboard', { replace: true });
            } else {
                navigate(redirect, { replace: true });
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full glass rounded-3xl p-8 shadow-xl"
            >
                <div>
                    <h2 className="mt-2 text-center text-3xl font-display font-extrabold text-gray-900 dark:text-white">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Sign in to access your account
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={submitHandler}>
                    <div className="space-y-4">
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
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center btn-primary py-3"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        New customer?{' '}
                        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="font-medium text-primary-600 hover:text-primary-500 transition">
                            Create an account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
