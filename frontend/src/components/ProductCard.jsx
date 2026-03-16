import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-hot-toast';
import Rating from './Rating';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const addToCartHandler = (e) => {
        e.preventDefault();
        if (product.countInStock <= 0) {
            toast.error('Out of stock');
            return;
        }
        dispatch(addToCart({ ...product, qty: 1 }));
        toast.success('Added to cart');
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="card group hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden"
        >
            <Link to={`/product/${product._id}`} className="block relative overflow-hidden h-48 -mt-6 -mx-6 mb-4 bg-gray-100 dark:bg-gray-800">
                <img
                    src={product.image?.startsWith('http') ? product.image : `https://mern-project-f1de.onrender.com${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=FreshMart+Image' }}
                />
                {product.countInStock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Out of Stock
                    </div>
                )}
            </Link>

            <div className="flex-grow flex flex-col justify-between">
                <div>
                    <Link to={`/product/${product._id}`}>
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                    </Link>
                    {product.vendor && (
                        <p className="text-[10px] text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider mb-2">
                            By {product.vendor.name}
                        </p>
                    )}

                    <div className="mb-4">
                        <Rating value={product.rating} text={`(${product.numReviews})`} />
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div>
                        <span className="text-xl font-bold font-display text-gray-900 dark:text-white">₹{product.price}</span>
                        <span className="text-xs text-gray-400 ml-1">/ {product.unit === 'kg' ? 'kg' : 'unit'}</span>
                    </div>
                    <button
                        onClick={addToCartHandler}
                        disabled={product.countInStock === 0}
                        className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-primary-400 dark:hover:bg-primary-500 dark:hover:text-white"
                        aria-label="Add to cart"
                    >
                        <FiShoppingCart />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
