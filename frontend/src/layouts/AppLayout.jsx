import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AppLayout = ({ children }) => {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/vendor');

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {!isDashboard && <Header />}
            <main className="flex-grow">
                {children}
            </main>
            {!isDashboard && <Footer />}
        </div>
    );
};

export default AppLayout;
