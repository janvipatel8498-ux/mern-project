import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
    };

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    };

    return (
        <div className="bg-gray-50 dark:bg-dark-bg min-h-screen pt-8 pb-20">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-8">
                    Shopping <span className="text-primary-600">Cart</span>
                </h1>

                {cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center p-12 glass rounded-3xl mt-10 text-center"
                    >
                        <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
                            <FiShoppingBag className="text-4xl" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Discover our premium products and start shopping.</p>
                        <Link to="/products" className="btn-primary px-8 py-3 rounded-full text-lg">
                            Start Shopping
                        </Link>
                    </motion.div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-2/3">
                            <div className="glass rounded-3xl overflow-hidden shadow-sm">
                                <div className="hidden md:grid grid-cols-12 gap-4 border-b border-gray-100 dark:border-gray-800 p-6 text-sm font-semibold text-gray-500 uppercase tracking-widest">
                                    <div className="col-span-6">Product</div>
                                    <div className="col-span-2 text-center">Price</div>
                                    <div className="col-span-2 text-center">Quantity</div>
                                    <div className="col-span-2 text-center">Total</div>
                                </div>

                                {cartItems.map((item) => (
                                    <div key={item._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-6 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                        <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                                            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                                            <div>
                                                <Link to={`/product/${item._id}`} className="font-semibold text-lg text-gray-900 dark:text-white hover:text-primary-600 transition-colors line-clamp-1">
                                                    {item.name}
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => removeFromCartHandler(item._id)}
                                                    className="text-red-500 text-sm mt-3 flex items-center hover:text-red-700 transition"
                                                >
                                                    <FiTrash2 className="mr-1" /> Remove
                                                </button>
                                            </div>
                                        </div>

                                        <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center font-medium md:text-lg">
                                            <span className="md:hidden text-gray-500">Price:</span>
                                            ₹{item.price}
                                        </div>

                                        <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center">
                                            <span className="md:hidden text-gray-500">Qty:</span>
                                            <select
                                                value={item.qty}
                                                onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                                className="input-field w-20 py-1 px-2"
                                            >
                                                {[...Array(item.countInStock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center font-bold text-primary-600 dark:text-primary-400 md:text-lg">
                                            <span className="md:hidden text-gray-500 font-normal">Total:</span>
                                            ₹{(item.price * item.qty).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:w-1/3">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass rounded-3xl p-8 sticky top-24 shadow-lg border border-primary-100 dark:border-primary-900/30"
                            >
                                <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-6 text-lg">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Total Items</span>
                                        <span className="font-semibold">{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                        <span className="font-semibold">
                                            ₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-800 pt-6 mb-8">
                                    <div className="flex justify-between items-end">
                                        <span className="text-gray-800 dark:text-gray-200 font-bold">Total Amount</span>
                                        <span className="text-3xl font-display font-black text-primary-600">
                                            ₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="w-full btn-primary py-4 text-lg font-bold rounded-xl flex justify-center items-center shadow-lg hover:shadow-primary-500/30 transition-all"
                                    disabled={cartItems.length === 0}
                                    onClick={checkoutHandler}
                                >
                                    Proceed to Checkout <FiArrowRight className="ml-2" />
                                </button>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
