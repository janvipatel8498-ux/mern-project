import React from 'react';

const FAQPage = () => {
    const faqs = [
        {
            question: "How long does delivery take?",
            answer: "We offer next-day delivery for all orders placed before 8 PM. Orders placed after 8 PM will be delivered within 2 working days."
        },
        {
            question: "Is there a minimum order value?",
            answer: "Yes, the minimum order value is ₹50 for free delivery. For orders below ₹50, a standard delivery fee of ₹50 applies."
        },
        {
            question: "Do you deliver organic products?",
            answer: "Yes! We have a dedicated section for certified organic fruits, vegetables, and pantry staples."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit/debit cards, UPI, Wallets, and Net Banking securely via Razorpay."
        },
        {
            question: "How can I track my order?",
            answer: "You can track your order status directly from your account dashboard under the 'My Orders' section."
        }
    ];

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-display font-bold text-center mb-12">Frequently Asked Questions</h1>

            <div className="max-w-3xl mx-auto space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="card">
                        <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQPage;
