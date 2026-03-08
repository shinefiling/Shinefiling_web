import GstMonthlyReturnRegistration from './GstMonthlyReturnRegistration';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, Globe, Briefcase, Award, ArrowRight, Rocket, X, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GSTMonthlyReturnPage = ({ isLoggedIn }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('basic');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What are GSTR-1 and GSTR-3B?", a: "GSTR-1 is a statement of your outward supplies (Sales). GSTR-3B is a summary return of sales and purchases along with tax payment." },
        { q: "When is the due date?", a: "GSTR-1: 11th of next month. GSTR-3B: 20th/22nd/24th of next month depending on your state." },
        { q: "What is the late fee?", a: "Late fee ranges from ₹20 to ₹50 per day of delay, subject to a maximum cap." },
        { q: "Can I revise a filed return?", a: "No, GSTR-3B cannot be revised. GSTR-1 amendments can be made in subsequent months." },
        { q: "Do I need to file Nil Return?", a: "Yes, even if you have no sales or purchases, filing a Nil return is mandatory." }
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
                                    <Star size={12} className="fill-bronze" /> Monthly Compliance
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    GST Monthly <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Return Filing</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    File GSTR-1 & GSTR-3B on time. Avoid penalties, claim accurate <strong className="text-white font-semibold">Input Tax Credit</strong>, and keep your business 100% compliant.
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
                                        <p className="font-bold text-sm text-white">Same Day</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Users size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Trusted By</p>
                                        <p className="font-bold text-sm text-white">5k+ Businesses</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    File Returns Now
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
                                <div className="absolute top-0 right-0 bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Best Value</div>
                                <div className="text-center mb-6">
                                    <h3 className="text-navy font-bold text-xl mb-2">Standard Plan</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹999</h3>
                                        <span className="text-lg text-slate-400 line-through mb-1 font-medium">₹1.5k</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">For Turnover &lt; 50 Lakhs</p>
                                </div>
                                <div className="space-y-4 mb-8">
                                    {["GSTR-1 Preparation", "GSTR-3B Filing", "ITC Matching", "Penalty Check", "Expert Support"].map((item, i) => (
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
                                    Start Filing <ArrowRight size={18} />
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
                            <FileText className="text-bronze" /> About Monthly GST Filing
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                Regular taxpayers must file <strong>GSTR-1</strong> (details of outward supplies) and <strong>GSTR-3B</strong> (summary of transactions and tax payment) every month.
                            </p>
                            <p>
                                Timely filing ensures you don't pay late fees, and more importantly, your customers can claim Input Tax Credit on time, ensuring smooth business relations.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Why Professional Filing?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "ITC Reconciliation", desc: "We match your purchase invoices with GSTR-2B to ensure you claim 100% eligible credit.", icon: CheckCircle },
                                { title: "Zero Errors", desc: "Manual errors in GSTR-1 can lead to higher tax liability. Our experts verify data before submission.", icon: Shield },
                                { title: "Avoiding Notices", desc: "Mismatches often attract GST notices. We ensure data consistency across returns.", icon: Star },
                                { title: "Time Saving", desc: "Focus on your business while we handle the complex portals and calculations.", icon: Clock },
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
                        <h2 className="text-3xl font-bold text-navy mb-8">Filing Plans</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <h3 className="text-xl font-bold text-navy mb-2">Nil Return</h3>
                                <div className="text-3xl font-black text-navy mb-1">₹499</div>
                                <p className="text-xs text-slate-400 mb-6">/ month</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> No Sales/Purchase</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> GSTR-1 & 3B Filing</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Compliance Check</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('basic')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-navy hover:text-white transition">Select Nil</button>
                            </div>

                            <div className="bg-[#2B3446] rounded-3xl p-6 shadow-2xl relative overflow-hidden transform md:-translate-y-4 flex flex-col">
                                <div className="absolute top-0 right-0 bg-bronze text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Popular</div>
                                <h3 className="text-xl font-bold text-white mb-2">Standard</h3>
                                <div className="text-3xl font-black text-white mb-1">₹999</div>
                                <p className="text-xs text-gray-400 mb-6">Turonver &lt; 50L</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> GSTR-1 & 3B</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> B2B & B2C Invoices</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> ITC Utilization</li>
                                </ul>
                                <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 rounded-xl bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold shadow-lg hover:shadow-yellow-500/20 transition">Select Standard</button>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <h3 className="text-xl font-bold text-navy mb-2">Premium</h3>
                                <div className="text-3xl font-black text-navy mb-1">₹1,999</div>
                                <p className="text-xs text-slate-400 mb-6">Turnover &gt; 50L</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> High Volume Data</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Advanced Reconciliation</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Dedicated AM</li>
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
                                <FileText className="text-bronze" /> Documents Required
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Sales Invoices (B2B & B2C)</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Purchase Invoices</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Bank Statement</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> E-Way Bill Details (If any)</li>
                            </ul>
                            <div className="mt-6 bg-slate-50 p-4 rounded-xl text-xs text-slate-500">
                                You can export these from your accounting software (Tally, Zoho, etc.) and share with us.
                            </div>
                        </div>
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Guidance?</h4>
                            <p className="text-gray-300 text-sm mb-4">Confused about GST rates or HSN codes?</p>
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
                                <GstMonthlyReturnRegistration isLoggedIn={isLoggedIn} isModal={true} initialPlan={selectedPlan} onClose={() => setShowRegisterModal(false)} />
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GSTMonthlyReturnPage;
