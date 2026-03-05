import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPercent } from 'react-icons/fi';

const OffersSection = () => {
    return (
        <section className="py-16 container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative h-64 rounded-3xl overflow-hidden shadow-xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-400 flex items-center p-12">
                        <div className="relative z-10 text-white max-w-xs">
                            <p className="text-white/80 font-bold tracking-widest uppercase mb-2">First Order Special</p>
                            <h3 className="text-4xl font-display font-black mb-4">Flat 20% OFF</h3>
                            <button className="flex items-center gap-2 bg-white text-orange-600 px-6 py-2.5 rounded-full font-bold hover:gap-4 transition-all duration-300">
                                Get Now <FiArrowRight />
                            </button>
                        </div>
                    </div>
                    {/* Background Icon Decor */}
                    <div className="absolute -bottom-8 -right-8 text-white/10 text-9xl transform rotate-12">
                        <FiPercent />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative h-64 rounded-3xl overflow-hidden shadow-xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-400 flex items-center p-12">
                        <div className="relative z-10 text-white max-w-xs">
                            <p className="text-white/80 font-bold tracking-widest uppercase mb-2">Vendor of the Month</p>
                            <h3 className="text-4xl font-display font-black mb-4">Fresh Organic Picks</h3>
                            <button className="flex items-center gap-2 bg-white text-emerald-600 px-6 py-2.5 rounded-full font-bold hover:gap-4 transition-all duration-300">
                                View Vendor <FiArrowRight />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default OffersSection;
