import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border mt-auto pt-10 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-display font-bold text-primary-600 dark:text-primary-400 mb-4">
                            FreshMart
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-4">
                            Your one-stop destination for fresh groceries and daily essentials delivered fast and secure.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                            <li><Link to="/" className="hover:text-primary-500 transition">Home</Link></li>
                            <li><Link to="/products" className="hover:text-primary-500 transition">Shop</Link></li>
                            <li><Link to="/about" className="hover:text-primary-500 transition">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-primary-500 transition">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Customer Care</h3>
                        <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                            <li><Link to="/faq" className="hover:text-primary-500 transition">FAQ</Link></li>
                            <li><Link to="/shipping" className="hover:text-primary-500 transition">Shipping Details</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>
                        &copy; {currentYear} FreshMart Platform. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
