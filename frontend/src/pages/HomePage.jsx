import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../redux/slices/productSlice';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';

import ProductCard from '../components/ProductCard';

const HomePage = () => {
    const dispatch = useDispatch();
    const productList = useSelector((state) => state.products);
    const { loading, error, products } = productList;

    useEffect(() => {
        dispatch(listProducts());
    }, [dispatch]);

    return (
        <div className="bg-gray-50 dark:bg-dark-bg min-h-screen">
            <HeroSection />

            <CategorySection />


            {/* Featured Products */}
            <section className="py-16 container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-display font-black text-gray-900 dark:text-white">🏷️ Featured <span className="text-primary-600">Products</span></h2>
                        <p className="text-gray-500 mt-2">Handpicked quality items for you</p>
                    </div>
                    <Link to="/products" className="text-primary-600 font-bold hover:underline mb-2">View All</Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="card animate-pulse">
                                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-xl mb-4 w-full"></div>
                                <div className="bg-gray-200 dark:bg-gray-700 h-6 w-3/4 rounded mb-2"></div>
                                <div className="bg-gray-200 dark:bg-gray-700 h-4 w-1/2 rounded mb-4"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products && products.slice(0, 8).map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* Popular Products - Reuse list for now as we don't have popularity metric yet */}
            <section className="py-16 bg-gray-100 dark:bg-gray-800/20">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-display font-black text-gray-900 dark:text-white">🔥 Popular <span className="text-primary-600">Now</span></h2>
                            <p className="text-gray-500 mt-2">What everyone is buying</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products && products.slice().reverse().slice(0, 4).map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
