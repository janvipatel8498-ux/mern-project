import React from 'react';
import ProfilePage from '../../pages/ProfilePage';

const VendorProfile = () => {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-display font-black text-gray-900 dark:text-white uppercase tracking-tight">Identity Hub</h1>
                <p className="text-gray-500 font-medium mt-1">Configure your professional presence and store settings</p>
            </div>
            <div className="glass rounded-[3rem] border border-white/40 dark:border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary-600 to-primary-400 opacity-10"></div>
                <div className="relative p-10">
                    <ProfilePage />
                </div>
            </div>
        </div>
    );
};

export default VendorProfile;
