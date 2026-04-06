import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { FiKey, FiRefreshCw, FiClock, FiCheckCircle } from 'react-icons/fi';

const AdminDeliveryAccess = () => {
    const [accessCode, setAccessCode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchCode();
    }, []);

    const fetchCode = async () => {
        try {
            // Added timeout to prevent infinite hanging
            const { data } = await axios.get('/api/delivery/access-code', { timeout: 10000 });
            setAccessCode(data);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch access code');
        } finally {
            setLoading(false);
        }
    };

    const generateNewCode = async () => {
        if (!window.confirm('Generating a new code will invalidate any existing unexpired code. Ensure all active delivery agents are given the new code. Proceed?')) {
            return;
        }
        
        setGenerating(true);
        try {
            const { data } = await axios.post('/api/delivery/access-code/generate');
            setAccessCode(data);
            toast.success('New 15-digit access code generated successfully!');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to generate code');
        } finally {
            setGenerating(false);
        }
    };

    const calculateTimeLeft = (expiresAt) => {
        const total = Date.parse(expiresAt) - Date.parse(new Date());
        if (total <= 0) return 'Expired';
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return `${hours}h ${minutes}m left`;
    };

    const isExpired = accessCode ? new Date(accessCode.expiresAt) < new Date() : true;

    return (
        <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
                        <FiKey className="text-primary-500" /> Delivery Access System
                    </h2>
                    <p className="text-gray-500">Generate a 15-digit 24-hour security code for Delivery Agents.</p>
                </div>
            </div>

            {loading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl w-full max-w-md"></div>
                </div>
            ) : (
                <div className="glass p-8 rounded-2xl max-w-2xl border border-gray-100 dark:border-gray-700">
                    {accessCode ? (
                        <>
                            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Current Active Code</div>
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className={`px-6 py-4 rounded-xl text-3xl font-mono tracking-[0.25em] font-black shadow-inner border ${isExpired ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                    {accessCode.code}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
                                        <FiClock /> {isExpired ? 'Code has expired' : calculateTimeLeft(accessCode.expiresAt)}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <FiCheckCircle className="text-green-500" /> Must be exactly 15 digits
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <FiKey className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No valid access code generated yet.</p>
                        </div>
                    )}
                </div>
            )}

            <div className={`mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 ${loading ? 'opacity-50' : ''}`}>
                <button
                    onClick={generateNewCode}
                    disabled={generating}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-md transition-all ${
                        generating 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                >
                    <FiRefreshCw className={generating ? 'animate-spin' : ''} />
                    {generating ? 'Generating...' : 'Generate New 24-Hr Code'}
                </button>
                <p className="text-xs text-amber-600 mt-3 font-medium">
                    Warning: Clicking this will instantly overwrite any existing active code.
                </p>
            </div>
        </div>
    );
};

export default AdminDeliveryAccess;
