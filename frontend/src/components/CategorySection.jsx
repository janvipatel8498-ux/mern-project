import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiTruck, FiCoffee, FiSun, FiMoreHorizontal, FiMonitor, FiUser, FiHome } from 'react-icons/fi';
import { GiMilkCarton, GiCabbage, GiFruitBowl, GiMeat, GiBreadSlice } from 'react-icons/gi';

const CATEGORIES = [
    { name: 'Groceries', icon: FiShoppingBag, color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Fruits', icon: GiFruitBowl, color: 'text-green-500', bg: 'bg-green-100' },
    { name: 'Vegetables', icon: GiCabbage, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { name: 'Dairy & Bakery', icon: GiMilkCarton, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { name: 'Meat & Seafood', icon: GiMeat, color: 'text-red-500', bg: 'bg-red-100' },
    { name: 'Snacks & Beverages', icon: FiCoffee, color: 'text-amber-500', bg: 'bg-amber-100' },
    { name: 'Household', icon: FiHome, color: 'text-purple-500', bg: 'bg-purple-100' },
    { name: 'Personal Care', icon: FiUser, color: 'text-teal-500', bg: 'bg-teal-100' },
    { name: 'Other', icon: FiMoreHorizontal, color: 'text-slate-500', bg: 'bg-slate-100' },
];

const CategorySection = () => {
    return (
        <section className="py-16 bg-white dark:bg-dark-bg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-display font-black text-gray-900 dark:text-white">Shop by <span className="text-primary-600">Category</span></h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Find what you need in seconds</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
                    {CATEGORIES.map((cat, index) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <Link
                                to={`/products?category=${cat.name}`}
                                className="flex flex-col items-center group"
                            >
                                <div className={`w-20 h-20 ${cat.bg} dark:bg-opacity-20 rounded-3xl flex items-center justify-center mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm group-hover:shadow-md`}>
                                    <cat.icon className={`text-4xl ${cat.color}`} />
                                </div>
                                <span className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 transition-colors">{cat.name}</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;
