import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../redux/slices/authSlice';
import axios from '../../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import ProfilePage from '../../pages/ProfilePage';
import { FiPower } from 'react-icons/fi';

const DeliveryProfile = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [isOnline, setIsOnline] = useState(userInfo?.isOnline !== false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (userInfo) {
            setIsOnline(userInfo.isOnline !== false);
        }
    }, [userInfo]);

    const toggleStatusHandler = async () => {
        setIsUpdating(true);
        try {
            const { data } = await axios.put('/api/auth/profile', {
                isOnline: !isOnline
            });
            dispatch(setCredentials({ ...data }));
            setIsOnline(data.isOnline);
            toast.success(`You are now ${data.isOnline ? 'Online' : 'Offline'}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white/40 dark:bg-gray-800/20 p-10 rounded-[3rem] border border-white/40 dark:border-gray-800/40 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Professional Identity</h1>
                    <p className="text-gray-500 font-medium mt-1">Configure your professional presence and availability</p>
                </div>
            </div>

            <div className="glass p-10 rounded-[3rem] border border-white/40 dark:border-gray-800/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent"></div>

                <div className="flex items-center gap-6 relative z-10 text-center md:text-left flex-col md:flex-row">
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl shadow-2xl transition-all duration-500 ${isOnline ? 'bg-green-500 text-white shadow-green-500/40 animate-pulse-slow' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                        }`}>
                        <FiPower />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Broadcast Status</h2>
                        <p className="text-gray-500 font-medium">{isOnline ? 'You are visible and ready to receive high-priority shipments.' : 'Your route is currently inactive. Switch online to start earning.'}</p>
                    </div>
                </div>

                <button
                    onClick={toggleStatusHandler}
                    disabled={isUpdating}
                    className={`relative z-10 flex items-center gap-4 px-10 py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] transition-all active:scale-95 shadow-2xl ${isOnline
                            ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-green-600/30 hover:shadow-green-600/50'
                            : 'bg-white dark:bg-gray-800 text-gray-400 border-2 border-gray-100 dark:border-gray-700 hover:text-primary-600'
                        }`}
                >
                    {isUpdating ? 'SYNCING...' : isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
                </button>
            </div>

            <div className="bg-white/40 dark:bg-white/5 rounded-[3rem] shadow-2xl border border-white/20 dark:border-gray-800/40 overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400"></div>
                <div className="p-2 md:p-6">
                    <ProfilePage />
                </div>
            </div>
        </div>
    );
};

export default DeliveryProfile;
