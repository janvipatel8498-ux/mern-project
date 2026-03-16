import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { motion } from 'framer-motion';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { FiTrash2, FiMapPin } from 'react-icons/fi';

// Static data for countries and states as requested
const locationData = {
    "India": [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
        "Uttarakhand", "West Bengal", "Delhi"
    ],
    "USA": ["California", "Texas", "Florida", "New York", "Illinois", "Ohio", "Georgia", "Michigan"],
    "UK": ["England", "Scotland", "Wales", "Northern Ireland"],
    "Canada": ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
    "Australia": ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia"]
};

const ShippingPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const auth = useSelector((state) => state.auth);
    const { userInfo } = auth;

    // Start with empty fields as requested
    const [address, setAddress] = useState('');
    const [city, setCity] = useState(''); // This acts as 'State' in the dropdown context
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');

    const [isSavingLoading, setIsSavingLoading] = useState(false);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login?redirect=/shipping');
        }
    }, [userInfo, navigate]);

    // Handle Country Change
    const handleCountryChange = (e) => {
        setCountry(e.target.value);
        setCity(''); // Reset city when country changes
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        // Validation
        if (address.length < 5) {
            toast.error('Address is too short (min 5 characters)');
            return;
        }
        if (!country) {
            toast.error('Please select a country');
            return;
        }
        if (!city) {
            toast.error('Please select a state/city');
            return;
        }
        if (!/^\d{6}$/.test(postalCode)) {
            toast.error('Postal Code must be exactly 6 digits');
            return;
        }

        const newAddress = { address, city, postalCode, country };

        // Save to cart state / local storage
        dispatch(saveShippingAddress(newAddress));

        // Save to user profile permanently
        try {
            setIsSavingLoading(true);
            const { data } = await axiosInstance.put('/api/auth/profile',
                { shippingAddress: newAddress },
                { withCredentials: true }
            );

            // Update auth state with new user info
            dispatch(setCredentials(data));
            toast.success('Address saved successfully');
            navigate('/payment');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to sync address to profile');
            navigate('/payment');
        } finally {
            setIsSavingLoading(false);
        }
    };

    const handleDeleteSavedAddress = async (e) => {
        e.stopPropagation(); // Prevent auto-filling when clicking delete

        if (!window.confirm('Are you sure you want to delete this saved address?')) return;

        try {
            const { data } = await axiosInstance.put('/api/auth/profile',
                { shippingAddress: { address: '', city: '', postalCode: '', country: '' } },
                { withCredentials: true }
            );

            // Update auth state
            dispatch(setCredentials(data));
            toast.success('Saved address deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete address');
        }
    };

    const handleUseSavedAddress = () => {
        if (userInfo?.shippingAddress) {
            const savedCountry = userInfo.shippingAddress.country || '';
            const savedCity = userInfo.shippingAddress.city || '';

            setAddress(userInfo.shippingAddress.address || '');
            setCountry(savedCountry);
            // We set city immediately. React handles the sync since the options will re-render
            setCity(savedCity);
            setPostalCode(userInfo.shippingAddress.postalCode || '');
            toast.success('Address filled from profile!');
        }
    };

    return (
        <div className="flex flex-col items-center min-h-[calc(100vh-8rem)] bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass rounded-3xl p-8 shadow-xl"
            >
                <h2 className="text-center text-3xl font-display font-bold text-gray-900 dark:text-white mb-6">
                    Shipping Address
                </h2>

                <form className="space-y-5" onSubmit={submitHandler}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            placeholder="Street, house number, etc."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                            <select
                                required
                                className="input-field appearance-none bg-white dark:bg-dark-surface"
                                value={country}
                                onChange={handleCountryChange}
                            >
                                <option value="">Select Country</option>
                                {Object.keys(locationData).map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State / City</label>
                            <select
                                required
                                className="input-field appearance-none bg-white dark:bg-dark-surface"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                disabled={!country}
                            >
                                <option value="">{country ? "Select State" : "Pick Country First"}</option>
                                {country && locationData[country].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pincode</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            placeholder="6 digits (e.g. 380001)"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSavingLoading}
                        className={`w-full btn-primary py-4 text-lg font-bold shadow-lg ${isSavingLoading ? 'opacity-70' : ''}`}
                    >
                        {isSavingLoading ? 'Saving...' : 'Continue to Payment'}
                    </button>
                </form>
            </motion.div>

            {/* Saved Addresses Section */}
            {userInfo?.shippingAddress?.address && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-md w-full mt-8"
                >
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-black uppercase tracking-widest mb-4 px-2">
                        Your Saved Address
                    </h3>
                    <div
                        onClick={handleUseSavedAddress}
                        className="glass p-5 rounded-2xl border-2 border-transparent hover:border-primary-500 cursor-pointer transition-all group scale-100 active:scale-95 shadow-md relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start">
                            <div className="text-gray-700 dark:text-gray-300">
                                <p className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Saved Shipping Address
                                </p>
                                <p className="text-sm">{userInfo.shippingAddress.address}</p>
                                <p className="text-sm font-medium">{userInfo.shippingAddress.city}, {userInfo.shippingAddress.postalCode}</p>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-tighter mt-1">{userInfo.shippingAddress.country}</p>
                                <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
                                    <FiMapPin size={12} /> CLICK TO AUTO-FILL
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-4">
                                <div className="bg-primary-100 dark:bg-primary-900/20 p-2 rounded-xl text-primary-600">
                                    <FiMapPin className="h-6 w-6" />
                                </div>
                                <button
                                    onClick={handleDeleteSavedAddress}
                                    className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                    title="Delete Address"
                                >
                                    <FiTrash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ShippingPage;
