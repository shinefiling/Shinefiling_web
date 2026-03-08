import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, ArrowRight, X, Globe, Layers, Banknote, Handshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GstCancellationRegistration from './GstCancellationRegistration';
import AuthModal from '../../../components/auth/AuthModal';

const GstCancellationPage = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('standard');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "Can I cancel my GST Registration?", a: "Yes, if you have closed your business or your turnover is below the threshold limit." },
        { q: "Is GSTR-10 (Final Return) mandatory?", a: "Yes, after cancellation order is passed, you must file GSTR-10 within 3 months." },
        { q: "What about the stock held?", a: "You need to reverse ITC on the stock held on the day of cancellation and pay it." },
        { q: "Can a cancelled GSTIN be revoked?", a: "Yes, revocation application can be filed within 30-90 days if it was cancelled by the officer suo-moto." }
    ];

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        const storedUser = localStorage.getItem('user');
        if (isLoggedIn || !!storedUser) {
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
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-6 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col"
                        >
                            <GstCancellationRegistration
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

            {/* HERO */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Closure" />
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
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm"> <X size={12} className="text-bronze" /> GST Cancellation / Surrender</span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Close Your <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">GST Registration</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Shutting down business? Surrender your GSTIN legally to avoid penalties and future liabilities. We handle the entire <strong className="text-white">Cancellation & Final Return</strong> process.
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
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Liability</p>
                                        <p className="font-bold text-sm text-white">Clean Exit</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Clock size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Timeline</p>
                                        <p className="font-bold text-sm text-white">Fast Surrender</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Start Cancellation
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Closure Guide
                                </button>
                            </motion.div>
                        </div>
                        {/* Trust Card - Official Registration (Replaces Pricing Card) - WHITE THEME COMPACT */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full md:w-[360px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl relative"
                        >
                            <div className="bg-white rounded-[20px] p-6 overflow-hidden relative shadow-inner">
                                {/* Top Gold Line (Matching other pages) */}
                                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C]"></div>

                                {/* Header - COMPACT */}
                                <div className="flex flex-col items-center justify-center text-center mb-5 mt-2">
                                    <div className="mb-3 relative">
                                        <div className="w-14 h-14 rounded-full bg-bronze/10 flex items-center justify-center">
                                            <Shield size={28} className="text-bronze fill-bronze/20" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle size={14} className="text-green-500 fill-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">
                                        Official <br />Registration
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">GST Cancellation</p>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-slate-100 mb-5"></div>

                                {/* Stats Grid - COMPACT */}
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    {/* Left Stat */}
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Handshake size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">100%</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Process <br />Online</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>

                                    {/* Right Stat */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Shield size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Legal</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Protection <br />Assured</p>
                                    </div>
                                </div>

                                {/* Check List - COMPACT */}
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "Application for Cancellation",
                                        "Reply to Querries",
                                        "GSTR-10 (Final Return)"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="bg-green-100 rounded-full p-1 shrink-0">
                                                <CheckCircle size={12} className="text-green-600" strokeWidth={3} />
                                            </div>
                                            <span className="text-slate-700 font-bold text-xs tracking-wide">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button - COMPACT */}
                                <button
                                    onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full py-3 bg-navy hover:bg-black text-white font-bold text-base rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Start Registration <ArrowRight size={16} />
                                </button>

                                <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
                                    Compare all plans below
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* PRICING */}
            <section id="pricing-plans" className="py-20 px-6 lg:px-12 bg-white relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16"><h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Cancellation Plans</h2></div>
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* PLAN 1: BASIC */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Basic Exit</h3>
                            <p className="text-slate-500 text-sm mb-6">Simple Registration Surrender.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">₹1,999</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Application for Surrender",
                                    "Reason for Closure Drafting",
                                    "ARN Tracking",
                                    "Online Filing Support"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('basic')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">
                                Select Basic
                            </button>
                        </motion.div>

                        {/* PLAN 2: STANDARD (POPULAR) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                Recommended
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Full Closure</h3>
                            <p className="text-gray-400 text-sm mb-6">Cancellation + Final Return.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹1,999</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹3,499</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Everything in Basic",
                                    "Mandatory GSTR-10 (Final Return)",
                                    "NOC Coordination",
                                    "Notice Reply Support",
                                    "Priority Handling"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">
                                Select Standard
                            </button>
                        </motion.div>

                        {/* PLAN 3: PREMIUM */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Corporate Exit</h3>
                            <p className="text-slate-500 text-sm mb-6">Complex Stock Issues.</p>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy">₹3,499</span>
                                <span className="text-slate-400 line-through text-xs">₹5,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Everything in Standard",
                                    "Stock ITC Reversal Calculation",
                                    "ITC Mis-match Resolution",
                                    "Officer Visit Assistance",
                                    "Compliance Certificate"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('premium')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">
                                Select Premium
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* EXTENSIVE CONTENT SECTION INSERTED FOR SEO */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT CONTENT COLUMN (8 Cols) */}
                <div id="details-section" className="lg:col-span-8 space-y-20">

                    {/* Introduction */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <X className="text-bronze" /> What is GST Cancellation?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                <strong>GST Cancellation</strong> refers to legally winding up your GSTIN identification number. Once cancelled, you are no longer required to file monthly returns or pay GST.
                            </p>
                            <p>
                                It is mandatory to surrender your GSTIN if you have discontinued your business or if your turnover has fallen below the threshold limit.
                            </p>
                            <p>
                                <strong>Warning:</strong> Simply stopping to file returns is NOT cancellation. It leads to heavy penalties and suo-moto cancellation by the department, which bans you from applying for a new GSTIN in the future.
                            </p>
                        </div>
                    </section>

                    {/* BENEFITS GRID */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Why Cancel Officially?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Stop Late Fees", desc: "GST portal charges late fees every day until you file returns or cancel registration. Cancellation stops this meter.", icon: Clock },
                                { title: "Avoid Tax Notices", desc: "Non-filers automatically get best judgement assessment notices (ASMT-13) with high tax demands.", icon: Shield },
                                { title: "Clean Record", desc: "Legally closing your business ensures your PAN remains clean for future ventures.", icon: CheckCircle },
                                { title: "Refund Claim", desc: "You can claim a refund of any excess balance lying in your electronic cash ledger upon cancellation.", icon: Zap },
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

                    {/* CANCELLATION PROCESS SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Cancellation Workflow</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Assessment", desc: "We review your tax payment status. All dues must be cleared before applying." },
                                { step: "Step 2", title: "Stock Reversal", desc: "ITC claimed on stock held must be reversed. We calculate this liability for you." },
                                { step: "Step 3", title: "Application Form", desc: "We file Form GST REG-16 with specific reason and effective date of closure." },
                                { step: "Step 4", title: "Final Return", desc: "After the official order (REG-19) is issued, we file GSTR-10 (Final Return) within 3 months." },
                            ].map((item, i) => (
                                <div key={i} className="group flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-100 hover:border-bronze/30 hover:shadow-lg transition-all duration-300">
                                    <div className="flex-shrink-0 w-full md:w-32 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:bg-bronze/5 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-bronze font-bold flex items-center justify-center mb-2 shadow-sm">
                                            {i + 1}
                                        </div>
                                        <span className="text-navy font-bold text-sm">Phase</span>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-bronze transition-colors flex items-center gap-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed text-sm">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* DEADLINE TABLE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">Revocation Deadlines</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-[#043E52] text-white">
                                    <tr>
                                        <th className="p-4 font-semibold text-sm uppercase tracking-wider">Action Time</th>
                                        <th className="p-4 font-semibold text-sm uppercase tracking-wider">Authority</th>
                                        <th className="p-4 font-semibold text-sm uppercase tracking-wider">Outcome</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-medium">Within 30 Days</td>
                                        <td className="p-4 text-gray-600">Assistant Commissioner</td>
                                        <td className="p-4 text-green-600 font-medium">Guaranteed Restoration</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-medium">31 - 60 Days</td>
                                        <td className="p-4 text-gray-600">Joint Commissioner</td>
                                        <td className="p-4 text-orange-600">Conditional Approval</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-medium">61 - 90 Days</td>
                                        <td className="p-4 text-gray-600">Commissioner</td>
                                        <td className="p-4 text-red-600">Rigorous Scrutiny</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="p-4 bg-orange-50 text-orange-800 text-sm border-t border-orange-100 flex gap-2 items-center">
                                <Shield size={16} /> <strong>Alert:</strong> Only Suo-Moto cancelled registrations can be revoked. Voluntarily cancelled ones cannot.
                            </div>
                        </div>
                    </section>

                    {/* DETAILED CONTENT SECTION */}
                    <section className="space-y-12">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
                            <h2 className="text-3xl font-bold text-navy mb-8 border-b pb-4">Comprehensive Guide to GST Registration Cancellation</h2>

                            <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">
                                <div>
                                    <h3 className="text-lg font-bold text-navy mb-4">Navigating the Closure of Your GSTIN</h3>
                                    <p>
                                        Cancelling a GST registration is a critical legal process that must be handled with precision. Whether you are closing your business, changing its legal structure, or your turnover has fallen below the mandatory threshold, surrendering your GSTIN requires a clean settlement of all tax liabilities. Failure to follow the correct procedure can lead to the "Suo-Moto" cancellation by officers, which carries heavy penalties and blocks you from obtaining a new GSTIN in the future.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                                            <Building size={20} className="text-bronze" /> Voluntary vs Suo-Moto
                                        </h3>
                                        <ul className="space-y-3 list-disc pl-5 text-sm">
                                            <li><strong>Voluntary:</strong> Applied by the taxpayer when business closes or turnover drops.</li>
                                            <li><strong>Suo-Moto:</strong> Initiated by the GST Officer if returns are not filed for 6+ months or if the business is not found at the registered address.</li>
                                            <li><strong>Revocation:</strong> The process of restoring a Suo-Moto cancelled GSTIN within 90 days.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                                            <Layers size={20} className="text-bronze" /> The Final Settlement (GSTR-10)
                                        </h3>
                                        <p className="text-sm">
                                            Filing the <strong>Final Return (GSTR-10)</strong> is a mandatory requirement after the cancellation order is issued. It involves calculating the value of credit held in inputs and capital goods as of the date of cancellation and paying it back to the government.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-navy/5 p-8 rounded-3xl border border-navy/10 mt-12">
                                    <h3 className="text-2xl font-bold text-navy mb-6">Critical Checkpoints for Surrender</h3>
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[
                                            { t: "Stock Valuation", d: "Calculate ITC on raw materials & semi-finished goods" },
                                            { t: "Capital Goods", d: "Pro-rata ITC reversal for machines/equipment" },
                                            { t: "Cash Ledger", d: "Settlement of any balance in the electronic cash ledger" },
                                            { t: "Pending Returns", d: "Ensure all GSTR-1 & 3B are filed till date" },
                                            { t: "ARN Tracking", d: "Monitoring the status of Application for Cancellation" },
                                            { t: "Order REG-19", d: "Receiving the formal cancellation order from Dept" }
                                        ].map((item, idx) => (
                                            <div key={idx} className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                                <span className="block font-bold text-bronze text-xs mb-1">{item.t}</span>
                                                <span className="text-sm font-medium text-navy">{item.d}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* COMPARISON TABLE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Suspension vs Cancellation</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Feature</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Suspension</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Cancellation</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {[
                                        { f: "Status", r: "Temporary Pause", c: "Permanent Closure" },
                                        { f: "Business Activity", r: "Cannot make sales", c: "Cannot make sales" },
                                        { f: "Return Filing", r: "Not Required during period", c: "Not Required after order" },
                                        { f: "Restoration", r: "Automatic after process", c: "Via Revocation only" },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition">
                                            <td className="p-4 font-bold text-navy border-r border-gray-100">{row.f}</td>
                                            <td className="p-4 text-slate-600 border-r border-gray-100">{row.r}</td>
                                            <td className="p-4 text-slate-600">{row.c}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* WHY CHOOSE SHINEFILING */}
                    <section className="bg-gradient-to-br from-[#043E52] to-navy p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-bronze/10 rounded-full blur-3xl"></div>
                        <h2 className="text-3xl font-bold mb-6 relative z-10">Why Choose ShineFiling?</h2>
                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><FileText size={24} /></div>
                                    <div><h4 className="font-bold text-lg">GSTR-10 Filing</h4><p className="text-gray-300 text-sm">We don't just file the application; we file the mandatory Final Return (GSTR-10) to complete the process.</p></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Scale size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Stock Calculation</h4><p className="text-gray-300 text-sm">Our expert CAs calculate exact ITC reversal on closing stock to prevent future demands.</p></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Shield size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Query Response</h4><p className="text-gray-300 text-sm">Officers often raise queries on stock. We draft professional replies.</p></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Users size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Revocation Support</h4><p className="text-gray-300 text-sm">If your GST was cancelled by mistake (Suo-Moto), we also file revocation applications.</p></div>
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

                {/* RIGHT SIDEBAR (4 Cols) */}
                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">

                        {/* Documents Sidebar */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Checklist
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">STOCK & CASH</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Closing Stock Value</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Cash Ledger Balance</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Outstanding Liabilties</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Legal Help?</h4>
                            <p className="text-gray-300 text-sm mb-4">Questions about Final Return liability?</p>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Users size={20} className="text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Call Advisor</p>
                                    <p className="font-bold">+91 7639227019</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GstCancellationPage;
