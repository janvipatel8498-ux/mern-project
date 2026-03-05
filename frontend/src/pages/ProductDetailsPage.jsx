import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { FiStar, FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Rating from '../components/Rating';
import moment from 'moment';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [qty, setQty] = useState(1);

    const { product, loading, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getProductDetails(id));
    }, [dispatch, id]);

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors">
                <FiArrowLeft className="mr-2" /> Back to Products
            </Link>

            {loading ? (
                <div className="flex flex-col md:flex-row gap-8 animate-pulse">
                    <div className="md:w-1/2 h-96 bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
                    <div className="md:w-1/2 space-y-4">
                        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded w-full mt-8"></div>
                    </div>
                </div>
            ) : error ? (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
            ) : (
                <div className="flex flex-col md:flex-row gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:w-1/2"
                    >
                        <div className="glass p-4 rounded-3xl relative overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-auto object-cover rounded-2xl"
                                onError={(e) => { e.target.src = '/images/placeholder.png' }}
                            />
                            {product.countInStock === 0 && (
                                <div className="absolute top-8 right-8 bg-red-500 text-white text-lg font-bold px-4 py-2 rounded-lg transform rotate-12 shadow-lg">
                                    Out of Stock
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:w-1/2 flex flex-col"
                    >
                        <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-6">
                            <h1 className="text-4xl font-display font-black text-gray-900 dark:text-white leading-tight mb-4">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-2">
                                <Rating value={product.rating} text={`${product.rating} Rating (${product.numReviews} Reviews)`} />
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-display font-light text-gray-900 dark:text-white">
                                    ₹{product.price}
                                </span>
                                <span className="text-lg text-gray-400 font-medium">
                                    / {product.unit === 'unit' ? 'unit' : 'kg'}
                                </span>
                                {product.unit === 'kg' && (
                                    <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded-full">⚖️ Sold by Weight</span>
                                )}
                                {product.unit === 'unit' && (
                                    <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full">🔢 Sold by Unit</span>
                                )}
                            </div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                {product.description}
                            </p>
                        </div>

                        <div className="glass p-6 rounded-2xl mb-8 border border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">Status</span>
                                <span className={`font-bold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.countInStock > 0
                                        ? `${product.countInStock} ${product.unit === 'kg' ? 'kg' : 'units'} available`
                                        : 'Out Of Stock'}
                                </span>
                            </div>

                            {product.countInStock > 0 && (
                                <div className="flex justify-between items-center mb-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                    <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">
                                        Quantity ({product.unit === 'kg' ? 'kg' : 'units'})
                                    </span>
                                    <select
                                        value={qty}
                                        onChange={(e) => setQty(Number(e.target.value))}
                                        className="input-field w-24 bg-white"
                                    >
                                        {[...Array(Math.min(product.countInStock, 20)).keys()].map(x => (
                                            <option key={x + 1} value={x + 1}>{x + 1} {product.unit === 'kg' ? 'kg' : 'unit'}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={addToCartHandler}
                                    disabled={product.countInStock === 0}
                                    className="flex-1 btn-secondary py-4 text-lg font-bold flex justify-center items-center rounded-xl"
                                >
                                    <FiShoppingCart className="mr-3 text-xl" /> Add to Cart
                                </button>
                                <button
                                    onClick={() => {
                                        dispatch(addToCart({ ...product, qty }));
                                        navigate('/login?redirect=/shipping');
                                    }}
                                    disabled={product.countInStock === 0}
                                    className="flex-1 btn-primary py-4 text-lg font-bold flex justify-center items-center rounded-xl"
                                >
                                    ⚡ Buy Now
                                </button>
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}

            {/* Reviews Section */}
            {!loading && !error && product && (
                <div className="mt-16 border-t border-gray-100 dark:border-gray-800 pt-16">
                    <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">Customer Reviews</h2>
                    {product.reviews.length === 0 && (
                        <div className="glass p-8 rounded-2xl text-center text-gray-500 italic">No reviews yet for this product.</div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {product.reviews.map((review) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="glass p-6 rounded-2xl border border-gray-100 dark:border-gray-800"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{review.name}</p>
                                        <p className="text-xs text-gray-400">{moment(review.createdAt).format('DD MMM YYYY')}</p>
                                    </div>
                                    <Rating value={review.rating} />
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic">"{review.comment}"</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailsPage;
