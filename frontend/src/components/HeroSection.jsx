import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section className="relative bg-primary-50 dark:bg-dark-surface overflow-hidden pt-20 pb-32">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="md:w-1/2 mb-12 md:mb-0 text-center md:text-left"
                    >
                        <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
                            Fresh Groceries & <br />
                            <span className="text-primary-600 dark:text-primary-400">Daily Essentials</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto md:mx-0">
                            Your one-stop destination for fresh groceries and daily essentials delivered fast and secure.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link to="/products" className="btn-primary text-xl px-8 py-3 rounded-full text-center">
                                Shop Now
                            </Link>
                        </div>

                        {/* Search Bar in Hero */}
                        <div className="mt-10 relative max-w-lg">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search for fresh groceries, essentials..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.target.value) {
                                        window.location.href = `/products?keyword=${e.target.value}`;
                                    }
                                }}
                                className="block w-full pl-10 pr-3 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl leading-5 bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-lg shadow-lg"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <span className="text-xs text-gray-400 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5">Enter</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Abstract Image / Illustration with Framer Motion */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="md:w-1/2 relative"
                    >
                        <div className="relative w-full max-w-lg mx-auto aspect-square">
                            {/* Decorative Blobs */}
                            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob dark:opacity-30"></div>
                            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000 dark:opacity-30"></div>
                            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000 dark:opacity-30"></div>

                            {/* Main Visual - A modern glass card showing a product or abstract shop visual */}
                            <div className="absolute inset-4 glass rounded-3xl p-6 flex flex-col justify-center items-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary-400 to-purple-600 flex items-center justify-center p-8 shadow-inner">
                                    <span className="text-white text-3xl font-bold text-center tracking-widest drop-shadow-md">FRESH INVENTORY<br />EVERY DAY</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute right-0 bottom-0 w-1/3 h-full bg-gradient-to-l from-primary-100/50 to-transparent dark:from-primary-900/10 dark:to-transparent pointer-events-none"></div>
        </section>
    );
};

export default HeroSection;
