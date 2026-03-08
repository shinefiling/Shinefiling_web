import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, Globe, Briefcase, Award, ArrowRight, X, Banknote, Handshake, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GSTR1Registration from './GSTR1Registration';

const GSTR1Page = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('monthly');

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is GSTR-1?", a: "GSTR-1 is a monthly or quarterly return that should be filed by every registered GST taxpayer. It contains details of all outward supplies (sales)." },
        { q: "Who needs to file GSTR-1?", a: "Every registered person including casual taxable persons needs to file GSTR-1." },
        { q: "What happens if I don't file?", a: "Late fees will apply, and you won't be able to file GSTR-3B, leading to penalty interest on tax payments." },
        { q: "Can I revise a filed GSTR-1?", a: "No, GSTR-1 once filed cannot be revised. Any mistakes can only be corrected in the amendment section of the next month's return." },
        { q: "What details are required?", a: "Invoice-wise details of B2B sales, consolidated B2C sales, Debit/Credit notes, and HSN summary." }
    ];

    const handlePlanSelect = (planKey) => {
        if (isLoggedIn) {
            setSelectedPlan(planKey);
            setShowRegistrationModal(true);
        } else {
            const targetUrl = `/services/gst-return/gstr-1/register?plan=${planKey}`;
            navigate('/login', { state: { from: targetUrl } });
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">
            <AnimatePresence>
                {showRegistrationModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-6 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col"
                        >
                            <GSTR1Registration
                                isLoggedIn={isLoggedIn}
                                isModal={true}
                                planProp={selectedPlan}
                                onClose={() => setShowRegistrationModal(false)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2070"
                        alt="Finance"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/80 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
                </div>

                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1],
                            rotate: [0, 45, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-bronze/20 rounded-full blur-[120px]"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-left">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="flex-1 text-center lg:text-left space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                                    <Star size={12} className="fill-bronze" /> Sales Compliance
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    GSTR-1 <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Monthly Return Filing Online</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Strategic <strong className="text-white font-semibold">GSTR-1 Filing</strong> for accurate sales reporting. Help your buyers claim <strong className="text-white font-semibold">Maximum Input Tax Credit</strong> with timely invoice uploads.
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
                                        <p className="font-bold text-sm text-white">Under 24H</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Scale size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verification</p>
                                        <p className="font-bold text-sm text-white">Invoice Matching</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                            >
                                <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    File GSTR-1 Now
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Filing Guide
                                </button>
                            </motion.div>
                        </div>

                        {/* Hero Right Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full md:w-[360px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl relative"
                        >
                            <div className="bg-white rounded-[20px] p-6 overflow-hidden relative shadow-inner">
                                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C]"></div>
                                <div className="flex flex-col items-center justify-center text-center mb-5 mt-2">
                                    <div className="mb-3 relative">
                                        <div className="w-14 h-14 rounded-full bg-bronze/10 flex items-center justify-center">
                                            <FileText size={28} className="text-bronze" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle size={14} className="text-green-500" />
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">GSTR-1<br />Filing Service</h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Monthly / Quarterly</p>
                                </div>
                                <div className="h-px w-full bg-slate-100 mb-5"></div>
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Clock size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">24H</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Fast<br />Filing</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Shield size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">100%</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Invoice<br />Matched</p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "B2B & B2C Invoice Details",
                                        "HSN Summary Filing",
                                        "ITC Enablement for Buyers"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="bg-green-100 rounded-full p-1 shrink-0">
                                                <CheckCircle size={12} className="text-green-600" strokeWidth={3} />
                                            </div>
                                            <span className="text-slate-700 font-bold text-xs tracking-wide">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full py-3 bg-navy hover:bg-black text-white font-bold text-base rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    File GSTR-1 Now <ArrowRight size={16} />
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">Compare all plans below</p>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>

            {/* PRICING SECTION */}
            <section id="pricing-section" className="py-20 px-6 lg:px-12 bg-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Choose Your Plan</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Simple Pricing Plans</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Monthly Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Monthly</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹499</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">PAY AS YOU GO</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Invoice Data Entry & Verification",
                                    "HSN Summary Preparation",
                                    "B2B/B2C Sales Reporting",
                                    "Document Reference Audit",
                                    "Filing ARN Generation",
                                    "Email Support within 24 Hours"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('monthly')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Monthly</button>
                        </motion.div>

                        {/* Quarterly Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Most Popular</div>
                            <h3 className="text-lg font-bold text-white mb-2 mt-1">GSTR-1 Quarterly</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹999</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹2,000</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                <li className="text-xs font-bold text-[#D9A55B] uppercase tracking-wider border-b border-white/10 pb-2">Everything in Monthly +</li>
                                {[
                                    "3 Months GSTR-1 Filing Cycle",
                                    "IFF (Invoice Furnishing Facility)",
                                    "Quarterly Data Consolidation",
                                    "Error Correction Assistance",
                                    "Priority WhatsApp Support",
                                    "Dedicated Compliance Manager"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('quarterly')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Get Started</button>
                        </motion.div>

                        {/* Annual Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Full Annual Support</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy">₹4,499</span>
                                <span className="text-slate-400 line-through text-xs">₹12,000</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="text-xs font-bold text-navy uppercase tracking-wider border-b border-gray-100 pb-2">Full Year Compliance +</li>
                                {[
                                    "12 Months Return Filing",
                                    "Annual GSTR-9 Preparation",
                                    "Reconciliation with GSTR-3B",
                                    "Audit Gap Identification",
                                    "Unlimited Query Solving",
                                    "Lifetime Cloud Document Storage"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('annual')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Annual</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* TRUST CARD SECTION - MOVED FROM HERO */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-full max-w-4xl bg-white rounded-2xl p-6 shadow-xl border border-gray-100 relative overflow-hidden flex flex-col md:flex-row items-center gap-8"
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C]"></div>

                        <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-2xl bg-bronze/10 flex items-center justify-center relative">
                                <Shield size={40} className="text-bronze fill-bronze/20" strokeWidth={1.5} />
                                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-4 border-white">
                                    <CheckCircle size={16} className="text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-bold text-navy mb-2">Verified Sales Reporting</h3>
                            <p className="text-slate-500 text-sm mb-4">Our GSTR-1 filing system ensures your customers receive their ITC on time by validating every single GSTIN and invoice detail.</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6">
                                <div className="flex items-center gap-2">
                                    <Handshake size={18} className="text-bronze" />
                                    <span className="text-navy font-bold text-sm">100% Online Flow</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={18} className="text-bronze" />
                                    <span className="text-navy font-bold text-sm">Legal Compliance Assured</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap size={18} className="text-bronze" />
                                    <span className="text-navy font-bold text-sm">Instant ARN Reference</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-auto">
                            <button
                                onClick={() => setShowRegistrationModal(true)}
                                className="w-full md:px-8 py-4 bg-navy hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                Start Filing <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <FileText className="text-bronze" /> What is GSTR-1?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                <strong>GSTR-1</strong> is a statement of all outward supplies of goods and services. It contains the details of every invoice you issue to your customers.
                            </p>
                            <p>
                                Unlike GSTR-3B which is a summary return, GSTR-1 is an invoice-level return. Your customers can only see their eligible Input Tax Credit (ITC) in their GSTR-2B once you successfully file your GSTR-1.
                            </p>
                            <div className="bg-bronze/5 p-8 rounded-3xl border border-bronze/10 mt-12 text-navy">
                                <h3 className="text-2xl font-bold mb-6">Key Components of GSTR-1</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {[
                                        { t: "Table 4A", d: "B2B Taxable Invoices" },
                                        { t: "Table 5A", d: "B2C Large inter-state invoices" },
                                        { t: "Table 7", d: "B2C Small consolidated sales" },
                                        { t: "Table 9", d: "Amendments to previous invoices" },
                                        { t: "Table 12", d: "HSN-wise summary of items" },
                                        { t: "Table 13", d: "Summary of documents issued" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                            <span className="block font-bold text-bronze text-xs mb-1">{item.t}</span>
                                            <span className="text-sm font-medium text-navy">{item.d}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 text-center lg:text-left">Strategic Filing Benefits</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Pass Input Credit", desc: "Timely filing ensures your clients get their ITC, preventing payment delays to your business.", icon: CheckCircle },
                                { title: "Avoid Penalty Charges", desc: "Late filing fee starts immediately after the due date (11th/13th). Save thousands annually.", icon: Clock },
                                { title: "Portal Health", desc: "Maintain a clean compliance record to improve your business credibility with banks.", icon: Shield },
                                { title: "Error Correction", desc: "Professional review identifies invoice mismatches before they become legal issues.", icon: Scale },
                            ].map((benefit, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-bronze/30 transition group">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-navy group-hover:text-bronze flex items-center justify-center text-navy flex-shrink-0 transition-all duration-300">
                                        <benefit.icon size={28} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-navy mb-2 text-lg">{benefit.title}</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">{benefit.desc}</p>
                                    </div>
                                </div>
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
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">SALES RECORDS</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> All Sales Invoices</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> Credit/Debit Notes</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> HSN Summary of Goods</li>
                                    </ul>
                                </div>
                                <div className="bg-navy/5 p-4 rounded-xl border border-navy/10">
                                    <p className="text-xs text-navy font-bold leading-relaxed">“GSTR-1 data is auto-populated into GSTR-3B to ensure zero data entry error.”</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-bronze/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <h4 className="font-bold text-lg mb-2">Need Assistance?</h4>
                            <p className="text-gray-400 text-sm mb-4">Our GST experts are available 24/7 for bulk invoice uploads.</p>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-500 hover:bg-bronze border border-yellow-500/50 hover:text-white rounded-lg font-bold text-sm transition">Call Expert</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GSTR1Page;
