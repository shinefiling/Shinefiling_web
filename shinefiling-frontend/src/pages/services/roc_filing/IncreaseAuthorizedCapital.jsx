import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, FileText, TrendingUp, Star, Users, Briefcase, BookOpen, Rocket, HelpCircle, ChevronRight, BarChart, Calculator, AlertTriangle, ArrowRight, Shield, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import IncreaseAuthorizedCapitalRegistration from './IncreaseAuthorizedCapitalRegistration';
import AuthModal from '../../../components/auth/AuthModal';

const IncreaseAuthorizedCapitalPage = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('standard');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "Why increase Authorized Capital?", a: "Authorized Capital is the maximum ceiling of share capital. To issue new shares to investors (Paid-up Capital), you must first have enough Authorized Capital headroom." },
        { q: "What is the process?", a: "1. Board Meeting -> 2. EGM (Shareholder Meeting) -> 3. File Form SH-7 within 30 days -> 4. File Form MGT-14." },
        { q: "Are there government fees?", a: "Yes, ROC fees are payable based on the incremental amount. Additionally, Stamp Duty is payable, which varies by state." },
        { q: "Time required?", a: "Once the EGM is held, Form SH-7 is approved by ROC typically within 2-4 working days (Straight Through Process)." },
        { q: "Is MOA alteration needed?", a: "Yes, the Capital Clause (Clause V) of the MOA needs to be altered to reflect the new Authorized Capital." },
    ];

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        if (isLoggedIn) {
            setShowRegistrationModal(true);
        } else {
            setAuthMode('login');
            setShowAuthModal(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">
            <AnimatePresence>
                {showRegistrationModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2rem] w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl relative flex flex-col"
                        >
                            <IncreaseAuthorizedCapitalRegistration
                                isLoggedIn={isLoggedIn}
                                isModal={true}
                                planProp={selectedPlan}
                                onClose={() => setShowRegistrationModal(false)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialMode={authMode}
                onAuthSuccess={() => {
                    setShowAuthModal(false);
                    setShowRegistrationModal(true);
                }}
            />

            {/* HERO SECTION */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80&w=2070"
                        alt="Financial Growth"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/80 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
                </div>

                {/* Animated Background Elements */}
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
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.15, 0.1],
                            x: [0, -50, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px]"
                    />
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
                                    <TrendingUp size={12} className="fill-bronze" /> Raise Funds
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Increase Authorized <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Capital</span>
                                </h1>
                                <p className="text-gray-300 text-xl max-w-xl font-light leading-relaxed">
                                    Scaling up? Increase your company's capacity to issue shares. We handle MOA alterations, Stamp Duty calculations, and SH-7 filing.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time</p>
                                        <p className="font-bold text-sm text-white">2-4 Days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <BarChart size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Growth</p>
                                        <p className="font-bold text-sm text-white">Scale Up</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Increase Capacity
                                </button>
                            </div>
                        </div>

                        {/* Trust Card - Official Compliance */}
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
                                            <Shield size={28} className="text-bronze fill-bronze/20" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle size={14} className="text-green-500 fill-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">Official <br />Compliance</h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Ministry of Corporate Affairs</p>
                                </div>
                                <div className="h-px w-full bg-slate-100 mb-5"></div>
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Shield size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Fast</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">SH-7 <br />Filing</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Users size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">100%</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Online <br />Process</p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "Drafting Board Resolutions",
                                        "Altered MOA Preparation",
                                        "Government Filing"
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
                                    onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full py-3 bg-navy hover:bg-black text-white font-bold text-base rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    View Packages <ArrowRight size={16} />
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">Compare all plans below</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* --- PRICING SECTION --- */}
            <section id="pricing-plans" className="py-20 px-6 lg:px-12 bg-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Choose Your Plan</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Service Packages</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {/* Basic */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Basic</h3>
                            <p className="text-slate-500 text-sm mb-6">SH-7 Filing Only.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹1,999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">+ GOVT FEES</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                {[
                                    "SH-7 Filing Support",
                                    "MOA Alteration Template",
                                    "Standard ROC Upload",
                                    "SRN Receipt Generation"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('basic')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Basic</button>
                        </motion.div>

                        {/* Standard */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Recommended</div>

                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Professional</h3>
                            <p className="text-gray-400 text-sm mb-6">Complete MOA Update.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹2,999</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase bg-white/10 px-2 py-1 rounded">MOST POPULAR</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                {[
                                    "Custom MOA Drafting",
                                    "Board Resolution Prep",
                                    "Stamp Duty Assistance",
                                    "EGM Notice Drafting",
                                    "Priority ROC Filing"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Select Professional</button>
                        </motion.div>

                        {/* Premium */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Fund Raising Kit</h3>
                            <p className="text-slate-500 text-sm mb-6">End-to-End Share Issuance.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹5,999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">+ GOVT FEES</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                {[
                                    "Capital Increase (SH-7)",
                                    "Share Allotment (PAS-3)",
                                    "Share Certificate Prep",
                                    "Demat Coordination Aid",
                                    "Dedicated CS Advisory"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('premium')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Fund Kit</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    {/* DETAILED SEO CONTENT SECTION - COMPREHENSIVE GUIDE */}
                    <section className="mt-10 space-y-12 mb-20">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
                            <h2 className="text-3xl font-bold text-navy mb-8 border-b pb-4">Comprehensive Guide to Authorized Capital</h2>

                            <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">

                                {/* Introduction */}
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                        <BookOpen className="text-bronze" /> Authorized Capital Explained
                                    </h3>
                                    <p className="lead text-xl text-gray-800 font-medium">
                                        Authorized Capital is the "License to Issue Shares". It is the maximum value of shares a company can issue to its shareholders. It is mentioned in the Memorandum of Association (MOA).
                                    </p>
                                    <p>
                                        If you want to bring in new investors exceeding your current limit, you must first increase this Authorized Capital by paying a fee to the Ministry of Corporate Affairs (MCA) and Stamp Duty to the State Government.
                                    </p>
                                </div>

                                {/* Process Flow */}
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-xl font-bold text-navy mb-4">The Process</h3>
                                    <ul className="space-y-4">
                                        {[
                                            { title: "Board Meeting", desc: "Board approves the proposal to increase capital and calls for an EGM." },
                                            { title: "Shareholders Meeting (EGM)", desc: "Shareholders pass a Resolution approving the increase." },
                                            { title: "File Form SH-7", desc: "File Form SH-7 with ROC within 30 days along with the resolution and altered MOA." },
                                            { title: "Form MGT-14", desc: "File Form MGT-14 for registration of the resolution (if applicable)." },
                                            { title: "Approval", desc: "ROC approves the form and the Authorized Capital is updated on the MCA portal." }
                                        ].map((step, i) => (
                                            <li key={i} className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm shrink-0">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-navy">{step.title}</h4>
                                                    <p className="text-sm text-gray-600">{step.desc}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Stamp Duty Warning */}
                                <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold text-navy mb-2 flex items-center gap-2">
                                        <AlertTriangle className="text-yellow-600" /> Government Fee Structure
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        The cost involves two components: <strong>ROC Fee</strong> (Central Govt) and <strong>Stamp Duty</strong> (State Govt). This depends entirely on the amount of capital increase.
                                    </p>
                                    <div className="overflow-x-auto bg-white rounded-xl border border-yellow-100">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-gray-500 uppercase bg-yellow-100/50">
                                                <tr>
                                                    <th className="px-6 py-3">Component</th>
                                                    <th className="px-6 py-3">Details</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                <tr>
                                                    <td className="px-6 py-4 font-bold text-navy">ROC Fee</td>
                                                    <td className="px-6 py-4 text-gray-600">Calculated on incremental capital. Approx ₹4,000 for every ₹1 Lakh increase (slabs apply).</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-bold text-navy">Stamp Duty</td>
                                                    <td className="px-6 py-4 text-gray-600">Varies by state (e.g., Maharashtra: 0.5%, Delhi: 0.15%). Max caps apply in some states.</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* MANDATORY DELIVERABLES */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold text-navy mb-8">What You Will Receive</h2>
                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="p-6 bg-navy text-white">
                                <p className="text-sm opacity-80">Official confirmation of your increased capacity.</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[
                                    { name: "SH-7 Filing Receipt", type: "Challan", due: "Immediate" },
                                    { name: "Altered MOA", type: "Updated Clause V", due: "Day 2-3" },
                                    { name: "Board Resolution", type: "Draft", due: "Day 1" },
                                    { name: "EGM Notice & Resolution", type: "Draft", due: "Day 1" },
                                    { name: "Stamp Duty Calculation", type: "Tax Advice", due: "Pre-Filing" }
                                ].map((row, i) => (
                                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-gray-50 transition">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-navy text-lg">{row.name}</h4>
                                        </div>
                                        <div className="md:w-1/3 mt-2 md:mt-0">
                                            <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">Format</span>
                                            <p className="text-bronze-dark font-semibold">{row.due}</p>
                                        </div>
                                        <div className="md:w-1/6 mt-2 md:mt-0 text-right">
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-navy">
                                                {row.type}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* WHY CHOOSE SHINEFILING - SEO SECTION */}
                    <section className="bg-gradient-to-br from-[#043E52] to-navy p-8 rounded-3xl text-white relative overflow-hidden shadow-xl mb-20">
                        {/* Background Deco */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-bronze/10 rounded-full blur-3xl"></div>

                        <h2 className="text-3xl font-bold mb-6 relative z-10">Why Choose ShineFiling for Capital Increase?</h2>
                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Accurate Duty Config</h4>
                                        <p className="text-gray-300 text-sm">Stamp duty laws vary by state. Our experts calculate exact liabilities to avoid penalties.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Express Filing</h4>
                                        <p className="text-gray-300 text-sm">We file SH-7 under STP (Straight Through Processing) mode for instant approvals where possible.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Drafting Expertise</h4>
                                        <p className="text-gray-300 text-sm">We carefully redraft your MOA Capital Clause to be future-proof for rounds of investment.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Complete Advisory</h4>
                                        <p className="text-gray-300 text-sm">From board resolutions to final ROC approval, we handle the entire secretarial compliance.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQs */}
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

                {/* RIGHT SIDEBAR */}
                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <Calculator className="text-bronze" /> Fee Estimation
                            </h3>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">Enter details to estimated Govt Fees.</p>
                                <div className="space-y-2">
                                    <input type="text" placeholder="Current Capital (₹)" className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-bronze" />
                                    <input type="text" placeholder="Proposed Increase (₹)" className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-bronze" />
                                    <select className="w-full px-4 py-2 border rounded-lg text-sm bg-white text-gray-600 focus:outline-none focus:border-bronze">
                                        <option>Select State</option>
                                        <option>Maharashtra</option>
                                        <option>Delhi</option>
                                        <option>Karnataka</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <button className="w-full py-2 bg-navy text-white font-bold rounded-lg hover:bg-black transition text-sm">Calculate Fee</button>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Guidance?</h4>
                            <p className="text-gray-300 text-sm mb-4">Unsure about Stamp Duty logic?</p>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">
                                Talk to Expert
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default IncreaseAuthorizedCapitalPage;
