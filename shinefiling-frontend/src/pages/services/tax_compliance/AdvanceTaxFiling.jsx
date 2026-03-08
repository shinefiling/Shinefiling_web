import AdvanceTaxRegistration from './AdvanceTaxRegistration';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, Globe, Briefcase, Award, ArrowRight, Rocket, X, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdvanceTaxFilingPage = ({ isLoggedIn }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('basic');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "Who is liable to pay Advance Tax?", a: "If your estimated total tax liability for the year (after TDS) exceeds ₹10,000, you are liable to pay Advance Tax." },
        { q: "What are the due dates?", a: "15% by 15th June, 45% by 15th Sep, 75% by 15th Dec, and 100% by 15th Mar." },
        { q: "Does it apply to Senior Citizens?", a: "Senior Citizens (60 years or above) who do not have any income from business/profession are exempt from Advance Tax." },
        { q: "How is it calculated?", a: "It is estimated based on your projected annual income. If the actual tax is higher, interest under 234B & 234C applies on the shortfall." },
        { q: "Can I pay after the due date?", a: "Yes, but you will be charged interest of 1% per month on the unpaid amount." },
    ];

    const handlePlanSelect = (plan) => {
        if (isLoggedIn) {
            setSelectedPlan(plan);
            setShowRegisterModal(true);
        } else {
            const url = window.location.pathname;
            navigate('/login', { state: { from: url } });
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2070"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/80 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="flex-1 text-center lg:text-left space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                                    <Star size={12} className="fill-bronze" /> Avoid Interest
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Advance Tax <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Calculation & Payment</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Accurately estimate your annual liability and pay taxes in installments to save 1% per month interest penalty.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="flex flex-wrap justify-center lg:justify-start gap-4"
                            >
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Clock size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fast Filing</p>
                                        <p className="font-bold text-sm text-white">Instant</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Savings</p>
                                        <p className="font-bold text-sm text-white">Block Penalty</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Calculate Now
                                </button>
                            </div>
                        </div>

                        {/* Pricing Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full md:w-[360px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl relative"
                        >
                            <div className="bg-white rounded-[20px] p-6 overflow-hidden relative">
                                <div className="absolute top-0 right-0 bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Recommended</div>
                                <div className="text-center mb-6">
                                    <h3 className="text-navy font-bold text-xl mb-2">Expert Assist</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹499</h3>
                                        <span className="text-lg text-slate-400 font-medium">+ GST</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">/ Installment</p>
                                </div>
                                <div className="space-y-4 mb-8">
                                    {["Accurate Calculation", "Capital Gains Inclusion", "Challan Generation", "Payment Support", "Penalty Check"].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                                            <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePlanSelect('standard')}
                                    className="w-full py-4 bg-navy hover:bg-black text-white font-bold text-lg rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Start Now <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <BookOpen className="text-bronze" /> What is Advance Tax?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                Advance tax implies that income tax should be paid in advance (in installments) instead of a lump sum payment at the year-end. It is applicable if your tax liability is ₹10,000 or more.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Why Pay In Advance?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Save Interest", desc: "Non-payment attracts 1% monthly interest under Section 234B and 234C.", icon: Shield },
                                { title: "Manage Cash Flow", desc: "Paying in installments reduces the burden of a huge lump sum tax payment in March.", icon: TrendingUp },
                                { title: "Faster Refunds", desc: "If you pay more, you get the refund faster after filing ITR.", icon: Rocket },
                                { title: "Compliance", desc: "Avoids scrutiny from the Income Tax Department for high-value transactions.", icon: Scale },
                            ].map((benefit, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-beige transition group">
                                    <div className="w-14 h-14 rounded-2xl bg-[#2B3446]/5 group-hover:bg-[#2B3446] group-hover:text-bronze flex items-center justify-center text-navy flex-shrink-0 transition-all duration-300">
                                        <benefit.icon size={28} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-navy mb-2 text-lg">{benefit.title}</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="pricing-plans">
                        <h2 className="text-3xl font-bold text-navy mb-8">Packages</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <h3 className="text-xl font-bold text-navy mb-2">Self Pay</h3>
                                <div className="text-3xl font-black text-navy mb-1">FREE</div>
                                <p className="text-xs text-slate-400 mb-6">DIY</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Basic DIY Calculator</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> No Expert Review</li>
                                </ul>
                                <button className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-slate-400 font-bold cursor-not-allowed">Coming Soon</button>
                            </div>

                            <div className="bg-[#2B3446] rounded-3xl p-6 shadow-2xl relative overflow-hidden transform md:-translate-y-4 flex flex-col">
                                <div className="absolute top-0 right-0 bg-bronze text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Recommended</div>
                                <h3 className="text-xl font-bold text-white mb-2">Expert Assist</h3>
                                <div className="text-3xl font-black text-white mb-1">₹499</div>
                                <p className="text-xs text-gray-400 mb-6">+ GST / Installment</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> Accurate Calculation</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> Capital Gains Check</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> Support</li>
                                </ul>
                                <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 rounded-xl bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold shadow-lg hover:shadow-yellow-500/20 transition">Select Standard</button>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <h3 className="text-xl font-bold text-navy mb-2">Yearly Plan</h3>
                                <div className="text-3xl font-black text-navy mb-1">₹1,499</div>
                                <p className="text-xs text-slate-400 mb-6">+ GST / Year</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> All 4 Installments</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Priority Support</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Tax Saving Advice</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('premium')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-navy hover:text-white transition">Select Premium</button>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <HelpCircle className="text-bronze" /> Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm open:shadow-md transition text-left">
                                    <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-bold text-gray-800 hover:bg-gray-50 transition select-none">
                                        <span className="pr-4">{faq.q}</span>
                                        <ChevronRight className="text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                                    </summary>
                                    <div className="px-6 pb-6 pt-2 text-gray-600 text-sm leading-relaxed border-t border-gray-50">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Data Needed
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Estimated Annual Income</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> TDS Deducted so far</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Capital Gains/Loss details</li>
                            </ul>
                            <div className="mt-6 bg-slate-50 p-4 rounded-xl text-xs text-slate-500">
                                Keep these handy for accurate tax calculation.
                            </div>
                        </div>
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Help?</h4>
                            <p className="text-gray-300 text-sm mb-4">Not sure how much to pay? Let us calculate.</p>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">
                                Talk to Expert
                            </button>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {showRegisterModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                            <div className="relative w-full max-w-6xl max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 bg-white ring-1 ring-white/20">
                                <AdvanceTaxRegistration isLoggedIn={isLoggedIn} isModal={true} initialPlan={selectedPlan} onClose={() => setShowRegisterModal(false)} />
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdvanceTaxFilingPage;
