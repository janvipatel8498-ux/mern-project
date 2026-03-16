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
    const [phoneNumber, setPhoneNumber] = useState('');
    const [panCardPhoto, setPanCardPhoto] = useState('');
    const [uploading, setUploading] = useState(false);
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

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);
            setPanCardPhoto(data.image);
            toast.success('PAN Card photo uploaded successfully.');
            setUploading(false);
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || 'Image upload failed');
            setUploading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (role === 'vendor' || role === 'delivery') {
            if (!phoneNumber) {
                toast.error('Please enter Phone Number');
                return;
            }
            if (!panCardPhoto) {
                toast.error('Please upload PAN Card Photo');
                return;
            }
        }

        setLoading(true);
        try {
            const res = await axios.post('/api/auth/register', {
                name,
                email,
                password,
                role,
                phoneNumber: (role === 'vendor' || role === 'delivery') ? phoneNumber : undefined,
                panCardPhoto: (role === 'vendor' || role === 'delivery') ? panCardPhoto : undefined
            });

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0A0A0B] relative overflow-hidden selection:bg-primary-500/30">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary-500/20 rounded-full blur-[120px] mix-blend-multiply flex-none pointer-events-none dark:mix-blend-lighten animate-blob"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-500/20 rounded-full blur-[120px] mix-blend-multiply flex-none pointer-events-none dark:mix-blend-lighten animate-blob animation-delay-2000"></div>
            <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] bg-emerald-500/20 rounded-full blur-[100px] mix-blend-multiply flex-none pointer-events-none dark:mix-blend-lighten animate-blob animation-delay-4000"></div>

            <div className="max-w-6xl w-full mx-auto p-6 relative z-10 flex items-center justify-center min-h-[calc(100vh-2rem)]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[1000px] bg-white/70 dark:bg-black/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden flex flex-col md:flex-row"
                >
                    {/* Left Column - Branding / Visuals */}
                    <div className="hidden md:flex md:w-[45%] p-12 flex-col justify-between relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-blue-800 text-white">
                        <div className="absolute top-0 right-0 -translate-y-12 translate-x-8 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-4 shadow-lg">
                                <span className="text-3xl font-black bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">FM</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-display font-black leading-tight tracking-tight">
                                Join <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-emerald-200">
                                    FreshMart
                                </span>
                            </h1>
                            <p className="text-primary-100 text-lg leading-relaxed">
                                Create an account to shop for the freshest goods, sell your own products, or become a delivery champ.
                            </p>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 text-sm font-medium text-primary-200">
                                <div className="flex -space-x-3">
                                    <div className="w-8 h-8 rounded-full border-2 border-primary-600 bg-emerald-400"></div>
                                    <div className="w-8 h-8 rounded-full border-2 border-primary-600 bg-amber-400"></div>
                                    <div className="w-8 h-8 rounded-full border-2 border-primary-600 bg-blue-400"></div>
                                </div>
                                <p>Join our thriving community</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="w-full md:w-[55%] p-8 sm:px-12 sm:py-10 flex flex-col justify-center bg-white/50 dark:bg-transparent custom-scrollbar max-h-[90vh] overflow-y-auto">
                        <div className="w-full mx-auto">
                            <div className="text-center md:text-left mb-8">
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                    Create Account
                                </h2>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    Fill in the details below to get started
                                </p>
                            </div>

                            <form className="space-y-5" onSubmit={submitHandler}>
                                <div className="grid grid-cols-1 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1 uppercase tracking-wider">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-5 py-3.5 bg-white/60 dark:bg-dark-surface/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:text-white placeholder-gray-400 transition-all font-medium text-sm"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1 uppercase tracking-wider">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-5 py-3.5 bg-white/60 dark:bg-dark-surface/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:text-white placeholder-gray-400 transition-all font-medium text-sm"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1 uppercase tracking-wider">
                                            Select Role
                                        </label>
                                        <div className="relative">
                                            <select
                                                className="w-full px-5 py-3.5 bg-white/60 dark:bg-dark-surface/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:text-white transition-all font-medium text-sm appearance-none cursor-pointer"
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                            >
                                                <option value="user">Customer (Buy Products)</option>
                                                <option value="vendor">Vendor (Sell Products)</option>
                                                <option value="delivery">Delivery Agent (Deliver Products)</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-gray-400">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <motion.div
                                        initial={false}
                                        animate={{ height: (role === 'vendor' || role === 'delivery') ? 'auto' : 0, opacity: (role === 'vendor' || role === 'delivery') ? 1 : 0 }}
                                        className="overflow-hidden"
                                    >
                                        {(role === 'vendor' || role === 'delivery') && (
                                            <div className="space-y-4 p-5 bg-primary-50/50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-800/30">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1 uppercase tracking-wider">
                                                        Phone Number <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required={role === 'vendor' || role === 'delivery'}
                                                        className="w-full px-5 py-3.5 bg-white/60 dark:bg-dark-surface/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:text-white placeholder-gray-400 transition-all font-medium text-sm"
                                                        placeholder="Enter your phone number"
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1 uppercase tracking-wider">
                                                        PAN Card Photo <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        required={(role === 'vendor' || role === 'delivery') && !panCardPhoto}
                                                        onChange={uploadFileHandler}
                                                        className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-primary-50 dark:file:bg-primary-900/30 file:text-primary-700 dark:file:text-primary-300 hover:file:bg-primary-100 transition-colors cursor-pointer"
                                                    />
                                                    {uploading && <div className="mt-2 text-xs text-primary-600 font-bold animate-pulse pl-1">Uploading secure document...</div>}
                                                    {panCardPhoto && (
                                                        <div className="mt-3 relative rounded-xl overflow-hidden shadow-sm inline-block border-2 border-green-500/30">
                                                            <img src={panCardPhoto} alt="PAN Card" className="h-20 w-auto object-cover rounded-lg" />
                                                            <div className="absolute top-1 right-1 bg-green-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow">Verified</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1 uppercase tracking-wider">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full px-5 py-3.5 bg-white/60 dark:bg-dark-surface/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:text-white placeholder-gray-400 transition-all font-medium font-mono text-sm"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1 uppercase tracking-wider">
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full px-5 py-3.5 bg-white/60 dark:bg-dark-surface/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:text-white placeholder-gray-400 transition-all font-medium font-mono text-sm"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full relative py-4 px-6 border border-transparent rounded-2xl text-white font-black uppercase tracking-widest text-sm overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-blue-600 group-hover:scale-[1.05] transition-transform duration-500"></div>
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Creating Account...
                                                </>
                                            ) : (
                                                'Create Account'
                                            )}
                                        </span>
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 text-center pb-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Already have an account?{' '}
                                    <Link
                                        to={redirect ? `/login?redirect=${redirect}` : '/login'}
                                        className="font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors border-b-2 border-transparent hover:border-primary-600 dark:hover:border-primary-400 pb-0.5"
                                    >
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RegisterPage;
