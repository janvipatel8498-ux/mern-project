import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiStar, FiMessageSquare, FiCalendar, FiBox } from 'react-icons/fi';
import { getVendorReviews } from '../../redux/slices/vendorSlice';
import moment from 'moment';

const VendorReviews = () => {
    const dispatch = useDispatch();
    const { reviews, loading, error } = useSelector((state) => state.vendor);

    useEffect(() => {
        dispatch(getVendorReviews());
    }, [dispatch]);

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} className={rating >= star ? 'fill-current' : 'text-gray-300 dark:text-gray-700'} size={14} />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <FiMessageSquare className="text-primary-600" /> Product Reviews
                </h1>
                <p className="text-gray-500 mt-1">See what customers are saying about your products</p>
            </div>

            {loading ? (
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center">
                    {error}
                </div>
            ) : reviews?.length === 0 ? (
                <div className="glass p-12 text-center rounded-3xl border border-gray-100 dark:border-gray-800">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-3xl">
                        <FiStar />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No reviews yet</h2>
                    <p className="text-gray-500">Your products haven't received any reviews yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="glass p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col hover:shadow-xl transition-shadow duration-300">
                            {/* Product Info Target */}
                            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                                <img
                                    src={review.productImage || '/images/sample.jpg'}
                                    alt={review.productName}
                                    className="w-12 h-12 object-cover rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate text-sm" title={review.productName}>
                                        {review.productName}
                                    </h3>
                                    <div className="flex items-center text-xs text-gray-500 mt-1 gap-1">
                                        <FiBox size={10} />
                                        <span className="truncate">{review.productCategory}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">{review.userName}</p>
                                        <div className="flex items-center text-xs text-gray-500 mt-1 gap-1">
                                            <FiCalendar size={10} />
                                            {moment(review.createdAt).format('MMM DD, YYYY')}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex-1 relative mt-2 group">
                                    <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-50 dark:bg-dark-bg border-l border-t border-gray-100 dark:border-gray-800 rotate-45"></div>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm italic relative z-10 line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                                        "{review.comment}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VendorReviews;
