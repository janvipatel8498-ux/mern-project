import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { payOrder, resetOrderState } from '../redux/slices/orderSlice';
import { clearCartItems } from '../redux/slices/cartSlice';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiCreditCard, FiSmartphone, FiBriefcase, FiLock, FiCheckCircle } from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa';

const MockPaymentGatewayPage = () => {
    const { id: orderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const orderCreate = useSelector((state) => state.order);
    const { order, success, error } = orderCreate;

    const auth = useSelector((state) => state.auth);
    const { userInfo } = auth;

    const [activeTab, setActiveTab] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);

    // Form states
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [nameOnCard, setNameOnCard] = useState(userInfo?.name || '');
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [isBankPortalOpened, setIsBankPortalOpened] = useState(false);
    const [bankTransactionId, setBankTransactionId] = useState('');

    useEffect(() => {
        // Redirection logic if payment logic updates state successfully (this runs after the mock dispatch)
        if (success && order?.order?.isPaid) {
            navigate(`/order/${order.order._id}`);
            dispatch(resetOrderState());
        }
    }, [success, order, navigate, dispatch]);

    const handlePaymentSubmit = (e) => {
        e.preventDefault();

        if (activeTab === 'card') {
            if (cardNumber.length < 15 || expiry.length < 5 || cvv.length < 3) {
                toast.error('Please enter valid dummy card details');
                return;
            }
        } else if (activeTab === 'upi') {
            if (!upiId || !upiId.includes('@')) {
                toast.error('Please enter a valid UPI ID (e.g. name@okbank)');
                return;
            }
        } else if (activeTab === 'netbanking') {
            if (!selectedBank) {
                toast.error('Please select your bank to proceed');
                return;
            }
            if (isBankPortalOpened && !bankTransactionId) {
                toast.error('Please enter the Transaction ID from your bank portal');
                return;
            }
        }

        // Special handling for Net Banking: First open portal, then wait for confirm
        if (activeTab === 'netbanking' && !isBankPortalOpened) {
            const bankUrls = {
                'HDFC Bank': 'https://www.hdfcbank.com/',
                'ICICI Bank': 'https://www.icicibank.com/',
                'SBI': 'https://www.onlinesbi.sbi/',
                'Axis Bank': 'https://www.axisbank.com/',
                'Kotak': 'https://www.kotak.com/',
                'Yes Bank': 'https://www.yesbank.in/'
            };
            if (bankUrls[selectedBank]) {
                window.open(bankUrls[selectedBank], '_blank');
                setIsBankPortalOpened(true);
                return; // Stop here and wait for the second click
            }
        }

        setIsProcessing(true);

        // Simulate network processing delay for realism
        setTimeout(() => {
            setIsProcessing(false);

            // Dispatch the success action to Redux
            let methodName = 'Credit/Debit Card';
            if (activeTab === 'upi') methodName = `UPI (${upiId})`;
            if (activeTab === 'netbanking') methodName = `Net Banking (${selectedBank})`;

            dispatch(payOrder({
                orderId: orderId,
                paymentResult: {
                    id: activeTab === 'netbanking' ? bankTransactionId : `mock_txn_${Math.random().toString(36).substr(2, 9)}`,
                    status: 'Success',
                    update_time: new Date().toISOString(),
                    email_address: userInfo?.email || 'mock@example.com',
                    selected_method: methodName
                }
            }));

            dispatch(clearCartItems());
            toast.success('Mock Payment Successful!');
            navigate(`/order/${orderId}`);
        }, 2500);
    };

    // Format card number with spaces (e.g. 1234 5678 1234 5678)
    const handleCardNumberChange = (e) => {
        const val = e.target.value.replace(/\D/g, '');
        let formatted = '';
        for (let i = 0; i < val.length; i += 4) {
            formatted += val.substring(i, i + 4) + ' ';
        }
        setCardNumber(formatted.trim().substring(0, 19));
    };

    // Format expiry (MM/YY)
    const handleExpiryChange = (e) => {
        const val = e.target.value.replace(/\D/g, '');
        if (val.length >= 2) {
            setExpiry(val.substring(0, 2) + '/' + val.substring(2, 4));
        } else {
            setExpiry(val);
        }
    };

    // Helper to get total price safely
    const amountDue = order?.order?.totalPrice || order?.razorpayOrder?.amount / 100 || '0.00';

    return (
        <div className="min-h-[calc(100vh-8rem)] bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
            >
                {/* Header Section */}
                <div className="bg-primary-600 p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center mb-2">
                            <FiLock className="mr-3" /> Secure Checkout
                        </h1>
                        <p className="text-primary-100 opacity-80 text-sm">
                            Powered by Mock Gateway Inc.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 text-left sm:text-right">
                        <p className="text-sm text-primary-200">Amount Due</p>
                        <p className="text-3xl font-display font-black">
                            ₹{amountDue}
                        </p>
                    </div>
                </div>

                {isProcessing ? (
                    <div className="p-16 flex flex-col items-center justify-center space-y-6">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Processing your payment...</h2>
                        <p className="text-gray-500 text-center max-w-sm">Please do not refresh or close this page while we securely process your transaction.</p>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row min-h-[400px]">
                        {/* Sidebar Options */}
                        <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700">
                            <ul className="flex flex-row md:flex-col p-4 gap-2 overflow-x-auto">
                                <li>
                                    <button
                                        onClick={() => setActiveTab('card')}
                                        className={`w-full text-left px-4 py-4 rounded-xl flex items-center whitespace-nowrap whitespace-md-normal transition-colors ${activeTab === 'card' ? 'bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 font-bold text-primary-600' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800'}`}
                                    >
                                        <FiCreditCard className="mr-3 text-lg" /> Credit / Debit Card
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab('upi')}
                                        className={`w-full text-left px-4 py-4 rounded-xl flex items-center whitespace-nowrap whitespace-md-normal transition-colors ${activeTab === 'upi' ? 'bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 font-bold text-primary-600' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800'}`}
                                    >
                                        <FiSmartphone className="mr-3 text-lg" /> UPI Apps
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab('netbanking')}
                                        className={`w-full text-left px-4 py-4 rounded-xl flex items-center whitespace-nowrap whitespace-md-normal transition-colors ${activeTab === 'netbanking' ? 'bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 font-bold text-primary-600' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800'}`}
                                    >
                                        <FiBriefcase className="mr-3 text-lg" /> Net Banking
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Main Payment Area */}
                        <div className="w-full md:w-2/3 p-6 sm:p-8">
                            {activeTab === 'card' && (
                                <form onSubmit={handlePaymentSubmit}>
                                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center justify-between">
                                        Enter Card Details
                                        <div className="flex text-2xl text-gray-300 dark:text-gray-600 gap-2">
                                            <FaCcVisa className="text-blue-600" />
                                            <FaCcMastercard className="text-red-500" />
                                            <FaCcAmex className="text-blue-400" />
                                        </div>
                                    </h2>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiCreditCard className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    className="pl-10 input-field font-mono"
                                                    placeholder="0000 0000 0000 0000"
                                                    value={cardNumber}
                                                    onChange={handleCardNumberChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="w-1/2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="input-field font-mono"
                                                    placeholder="MM/YY"
                                                    value={expiry}
                                                    onChange={handleExpiryChange}
                                                    maxLength="5"
                                                />
                                            </div>
                                            <div className="w-1/2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                                                <input
                                                    type="password"
                                                    required
                                                    className="input-field font-mono"
                                                    placeholder="123"
                                                    value={cvv}
                                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                                                    maxLength="4"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name on Card</label>
                                            <input
                                                type="text"
                                                required
                                                className="input-field uppercase"
                                                placeholder="JOHN DOE"
                                                value={nameOnCard}
                                                onChange={(e) => setNameOnCard(e.target.value)}
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                className="w-full btn-primary py-4 text-lg font-bold flex justify-center items-center shadow-lg hover:shadow-xl transition-all"
                                            >
                                                <FiLock className="mr-2" /> Pay ₹{amountDue}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'upi' && (
                                <form onSubmit={handlePaymentSubmit} className="flex flex-col items-center justify-center h-full space-y-6">
                                    <div className="w-full text-center mb-4">
                                        <FiSmartphone className="text-6xl text-primary-600 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pay using UPI ID</h3>
                                        <p className="text-gray-500 text-sm">Enter your VPA / UPI ID to receive a payment request</p>
                                    </div>

                                    <div className="w-full">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">UPI ID</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                className="input-field flex-grow"
                                                placeholder="name@okbank"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                            />
                                            <button type="submit" className="btn-primary px-6">Verify & Pay</button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'netbanking' && (
                                <form onSubmit={handlePaymentSubmit} className="flex flex-col h-full">
                                    {isBankPortalOpened ? (
                                        <div className="flex flex-col items-center justify-center space-y-6 h-full text-center">
                                            <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-2xl border border-primary-100 dark:border-primary-800">
                                                <FiBriefcase className="text-5xl text-primary-600 mx-auto mb-4" />
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Bank Portal Opened</h3>
                                                <p className="text-gray-500 text-sm">A new window has been opened for <strong>{selectedBank}</strong>. Please complete your payment there and return here to confirm.</p>
                                            </div>

                                            <div className="w-full text-left">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter Transaction ID / Reference Number</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="input-field"
                                                    placeholder="TXN123456789"
                                                    value={bankTransactionId}
                                                    onChange={(e) => setBankTransactionId(e.target.value)}
                                                />
                                                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">Usually 10-12 digits provided by your bank</p>
                                            </div>

                                            <div className="w-full space-y-3">
                                                <button type="submit" className="w-full btn-primary py-4 text-lg font-bold">I have completed the payment</button>
                                                <button type="button" onClick={() => setIsBankPortalOpened(false)} className="text-gray-500 text-sm hover:text-primary-600 transition-colors font-medium underline">Choose another bank</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                                                Select Your Bank
                                            </h2>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                                                {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak', 'Yes Bank'].map((bank) => (
                                                    <div
                                                        key={bank}
                                                        onClick={() => setSelectedBank(bank)}
                                                        className={`border rounded-xl p-4 text-center cursor-pointer transition-colors ${selectedBank === bank ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10'}`}
                                                    >
                                                        <p className={`font-medium text-sm ${selectedBank === bank ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>{bank}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-auto">
                                                <button type="submit" className="w-full btn-primary py-4">Proceed to Bank Portal</button>
                                            </div>
                                        </>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default MockPaymentGatewayPage;
