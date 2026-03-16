import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiTruck, FiCoffee, FiSun, FiMoreHorizontal, FiMonitor, FiUser, FiHome } from 'react-icons/fi';
import { GiMilkCarton, GiCabbage, GiFruitBowl, GiMeat, GiBreadSlice } from 'react-icons/gi';

const STATIC_CATEGORIES = {
    'Groceries': { icon: FiShoppingBag, color: 'text-orange-500', bg: 'bg-orange-100' },
    'Fruits': { icon: GiFruitBowl, color: 'text-green-500', bg: 'bg-green-100' },
    'Vegetables': { icon: GiCabbage, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    'Dairy & Bakery': { icon: GiMilkCarton, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    'Meat & Seafood': { icon: GiMeat, color: 'text-red-500', bg: 'bg-red-100' },
    'Snacks & Beverages': { icon: FiCoffee, color: 'text-amber-500', bg: 'bg-amber-100' },
    'Household': { icon: FiHome, color: 'text-purple-500', bg: 'bg-purple-100' },
    'Personal Care': { icon: FiUser, color: 'text-teal-500', bg: 'bg-teal-100' },
    'Other': { icon: FiMoreHorizontal, color: 'text-slate-500', bg: 'bg-slate-100' },
};

const DEFAULT_CAT = { icon: FiTag, color: 'text-primary-500', bg: 'bg-primary-50' };

import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { FiTag } from 'react-icons/fi';

const CategorySection = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/categories');
                setCategories(data);
            } catch (err) {
                console.error('Failed to fetch categories', err);
            }
        };
        fetchCategories();
    }, []);
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
                    {categories.map((cat, index) => {
                        const style = STATIC_CATEGORIES[cat.name] || DEFAULT_CAT;
                        const Icon = style.icon;
                        return (
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
                                    <div className={`w-20 h-20 ${style.bg} dark:bg-opacity-20 rounded-3xl flex items-center justify-center mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm group-hover:shadow-md`}>
                                        <Icon className={`text-4xl ${style.color}`} />
                                    </div>
                                    <span className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 transition-colors text-center px-2">{cat.name}</span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;
