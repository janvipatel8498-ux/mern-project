import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { FiSearch, FiFilter } from 'react-icons/fi';
import axios from '../utils/axiosInstance';

const ProductsPage = () => {
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [showOnlyInStock, setShowOnlyInStock] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/categories');
                setCategories(data.map(c => c.name));
            } catch (err) {
                console.error('Failed to fetch categories', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        dispatch(listProducts({ keyword, category }));
    }, [dispatch, keyword, category]);

    const { products, loading, error, page, pages } = useSelector((state) => state.products);

    // Client-side filtering for price and availability for now to avoid breaking backend
    const filteredProducts = products.filter(p => {
        const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
        const matchesStock = showOnlyInStock ? p.countInStock > 0 : true;
        return matchesPrice && matchesStock;
    });

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(listProducts({ keyword, category }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-display font-bold mb-8">Our Products</h1>

            <div className="flex flex-col md:flex-row gap-6 mb-10">
                {/* Search Form */}
                <form onSubmit={submitHandler} className="flex-grow flex items-center relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="input-field pl-10 w-full"
                    />
                    <FiSearch className="absolute left-3 text-gray-400" />
                    <button type="submit" className="hidden"></button>
                </form>

                {/* Category Filter */}
                <div className="md:w-64 relative flex items-center">
                    <FiFilter className="absolute left-3 text-gray-400 pointer-events-none" />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input-field pl-10 appearance-none bg-white font-medium"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Advanced Filters Sidebar */}
                <aside className="lg:w-64 space-y-8">
                    <div className="glass p-6 rounded-3xl">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            Price Range (₹)
                        </h3>
                        <div className="space-y-4">
                            <input
                                type="range"
                                min="0"
                                max="5000"
                                step="100"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                className="w-full accent-primary-600"
                            />
                            <div className="flex justify-between text-sm font-bold text-gray-600">
                                <span>₹{priceRange[0]}</span>
                                <span>₹{priceRange[1]}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-3xl">
                        <h3 className="font-bold text-lg mb-4">Availability</h3>
                        <label className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={showOnlyInStock}
                                onChange={() => setShowOnlyInStock(!showOnlyInStock)}
                                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all"
                            />
                            <span className="ml-3 text-gray-700 dark:text-gray-300 group-hover:text-primary-600 transition-colors">In Stock Only</span>
                        </label>
                    </div>
                </aside>

                <div className="flex-grow">

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="card h-80 animate-pulse bg-gray-100 dark:bg-gray-800"></div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 font-medium">No products found.</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {/* Simple Pagination */}
                            {pages > 1 && (
                                <div className="flex justify-center mt-12 space-x-2">
                                    {[...Array(pages).keys()].map((x) => (
                                        <button
                                            key={x + 1}
                                            onClick={() => dispatch(listProducts({ keyword, category, pageNumber: x + 1 }))}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${x + 1 === page
                                                ? 'bg-primary-600 text-white shadow-md'
                                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 dark:bg-dark-surface dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            {x + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
