import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, ArrowRight, X, Wallet, Globe, Banknote, Handshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Itr1Registration from './Itr1Registration';

const Itr1Page = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('startup');

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "Who can file ITR-1?", a: "Resident Individuals with income up to ₹50 Lakhs from Salary, One House Property, and Other Sources (Interest)." },
        { q: "Is Form 16 required?", a: "It makes the process faster, but you can also file using your salary slips or bank statements." },
        { q: "What is the due date?", a: "Usually 31st July of the Assessment Year." },
        { q: "Can I claim HRA in ITR-1?", a: "Yes, you can claim HRA and other deductions under Chapter VI-A (80C, 80D, etc.)." }
    ];

    const handlePlanSelect = (plan) => {
        if (isLoggedIn) {
            setSelectedPlan(plan);
            setShowRegistrationModal(true);
        } else {
            const targetUrl = `/ services / income - tax / itr - 1 / register ? plan = ${plan} `;
            navigate('/login', { state: { from: targetUrl } });
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
                            <Itr1Registration
                                isLoggedIn={isLoggedIn}
                                isModal={true}
                                planProp={selectedPlan}
                                onClose={() => setShowRegistrationModal(false)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* HERO */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1554224154-260327c00c40?auto=format&fit=crop&q=80&w=2070"
                        alt="ITR Background"
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
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                                    <Star size={12} className="fill-bronze" /> Salaried Individuals
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    ITR-1 (Sahaj) <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Return Filing</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Expert Assisted Filing for <strong className="text-white font-semibold">Salaried Employees</strong>. Maximize your refunds and ensure 100% compliance with Tax Department.
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
                                        <Wallet size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fastest</p>
                                        <p className="font-bold text-sm text-white">ITR Refund</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Clock size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time</p>
                                        <p className="font-bold text-sm text-white">24 Hr Filing</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    File ITR-1 Now
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Tax Guide
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
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">ITR-1 (Sahaj)</p>
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
                                        "Income from Salary / Pension",
                                        "Single House Property",
                                        "Interest Income"
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
                                    onClick={() => document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' })}
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
            <section id="pricing-section" className="py-20 px-6 lg:px-12 bg-white relative">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Our Plans</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Choose Your Plan</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* PLAN 1: BASIC */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Basic Filing</h3>
                            <p className="text-slate-500 text-sm mb-6">Standard Salaried Returns.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-3xl font-black text-navy">₹499</span>
                                <span className="text-slate-400 line-through text-sm">₹999</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Salary/Pension Income",
                                    "Single House Property",
                                    "Interest Income",
                                    "Form 16 Upload",
                                    "E-Filing & Verification"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('startup')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Select Basic
                            </button>
                        </motion.div>

                        {/* PLAN 2: ASSISTED */}
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

                            <h3 className="text-lg font-bold text-white mb-2 mt-2">Assisted Filing</h3>
                            <p className="text-gray-400 text-sm mb-6">Expert CA Support.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-3xl font-black text-white">₹999</span>
                                <span className="text-gray-500 line-through text-sm">₹1,999</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Everything in Basic",
                                    "Dedicated CA Support",
                                    "Multiple House Properties",
                                    "Tax Planning Advice",
                                    "Audit Assistance"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-bold rounded-xl shadow-lg shadow-bronze/20 transition-all hover:scale-105">
                                Select Assisted
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
                            <h3 className="text-lg font-bold text-navy mb-2">NRI / Tax Saving</h3>
                            <p className="text-slate-500 text-sm mb-6">Exclusive High-Value Filing.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-3xl font-black text-navy">₹1,499</span>
                                <span className="text-slate-400 line-through text-sm">₹2,499</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Everything in Assisted",
                                    "NRI Status Filing",
                                    "Expat Taxation",
                                    "Foreign Income Disclosure",
                                    "Stock/Crypto Gains Assistance"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('enterprise')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">
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
                            <FileText className="text-bronze" /> What is ITR-1 (Sahaj)?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                <strong>ITR-1 Sahaj</strong> is the simplest Income Tax Return form for Resident Individuals. It is applicable if your total income for the financial year does not exceed ₹50 Lakhs.
                            </p>
                            <p>
                                You can file ITR-1 if your income comes from <strong>Salary or Pension</strong>, <strong>One House Property</strong>, and <strong>Other Sources</strong> (like Bank Interest, Dividend, etc.).
                            </p>
                            <p>
                                Agricultural income up to ₹5,000 can also be reported here. However, if you are a Director in a company or hold unlisted equity shares, you cannot use this form.
                            </p>
                        </div>
                    </section>

                    {/* BENEFITS GRID */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Why File on Time?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Faster Refunds", desc: "Filing early ensures your tax refund is processed by the CPC much faster, sometimes within a week.", icon: Clock },
                                { title: "Avoid Penalty", desc: "Missing the July 31st deadline attracts a late filing fee of up to ₹5,000 under Section 234F.", icon: Shield },
                                { title: "Loan Approval", desc: "Banks require the last 3 years' ITR acknowledgment for processing Home Loans and Personal Loans.", icon: CheckCircle },
                                { title: "Carry Forward Loss", desc: "Losses can only be carried forward if the return is filed before the due date.", icon: TrendingUp },
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

                    {/* FILING PROCESS SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">How to File ITR-1?</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Document Upload", desc: "Upload your Form-16, Salary Slips, and Interest Certificates on our secure portal." },
                                { step: "Step 2", title: "Information Pre-fill", desc: "Our system auto-populates data from your AIS (Annual Information Statement) and Form 26AS to prevent mismatches." },
                                { step: "Step 3", title: "Computation & Review", desc: "Expert CAs review your deductions (80C, 80D, HRA) and compute tax liability to maximize refunds." },
                                { step: "Step 4", title: "E-Filing & Verification", desc: "We file the return with the IT Department and help you virtually verify it via Aadhaar OTP." },
                            ].map((item, i) => (
                                <div key={i} className="group flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-100 hover:border-bronze/30 hover:shadow-lg transition-all duration-300">
                                    <div className="flex-shrink-0 w-full md:w-32 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:bg-bronze/5 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-bronze font-bold flex items-center justify-center mb-2 shadow-sm">
                                            {i + 1}
                                        </div>
                                        <span className="text-navy font-bold text-sm">Step</span>
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

                    {/* REGIME COMPARISON TABLE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Old vs New Tax Regime</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Feature</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Old Regime</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">New Regime (Default)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {[
                                        { f: "Tax Rates", r: "Higher Slabs", c: "Reduced Slabs" },
                                        { f: "Section 80C (LIC/PPF)", r: "Allowed (Up to ₹1.5L)", c: "Not Allowed" },
                                        { f: "HRA & LTA", r: "Exemption Available", c: "Not Available" },
                                        { f: "Standard Deduction", r: "₹50,000 Allowed", c: "₹50,000 Allowed (from FY24)" },
                                        { f: "Tax Free Income", r: "Up to ₹5 Lakhs", c: "Up to ₹7 Lakhs (Rebate u/s 87A)" },
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

                    {/* PENALTY TABLE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">Late Filing Fees (Sec 234F)</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-[#043E52] text-white">
                                    <tr>
                                        <th className="p-4 font-semibold text-sm uppercase tracking-wider">Total Income</th>
                                        <th className="p-4 font-semibold text-sm uppercase tracking-wider">Filed Before July 31</th>
                                        <th className="p-4 font-semibold text-sm uppercase tracking-wider">Filed After July 31</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-medium">Up to ₹2.5 Lakhs</td>
                                        <td className="p-4 text-green-600">Nil</td>
                                        <td className="p-4 text-gray-600">Nil</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-medium">₹2.5L to ₹5 Lakhs</td>
                                        <td className="p-4 text-green-600">Nil</td>
                                        <td className="p-4 text-red-600">₹1,000</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-medium">Above ₹5 Lakhs</td>
                                        <td className="p-4 text-gray-600">Nil</td>
                                        <td className="p-4 text-red-600">₹5,000</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="p-4 bg-red-50 text-red-700 text-sm border-t border-red-100 flex gap-2 items-center">
                                <Shield size={16} /> <strong>Note:</strong> Interest @ 1% per month is also charged on unpaid tax liability under Section 234A.
                            </div>
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
                                    <div><h4 className="font-bold text-lg">Form-16 Auto Read</h4><p className="text-gray-300 text-sm">Just upload your PDF. Our intelligent system extracts salary and tax details automatically.</p></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Scale size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Tax Optimization</h4><p className="text-gray-300 text-sm">We suggest the best tax regime (New vs Old) to minimize your tax liability legally.</p></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Shield size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Detailed Review</h4><p className="text-gray-300 text-sm">Your return is checked against AIS/TIS data to ensure no income is missed.</p></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Users size={24} /></div>
                                    <div><h4 className="font-bold text-lg">CA Support</h4><p className="text-gray-300 text-sm">Get dedicated support from Tax Experts for any notice or query resolution.</p></div>
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
                                <FileText className="text-bronze" /> Documents Needed
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">INCOME PROOFS</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Form 16 (From Employer)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Bank Statements (Interest)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Form 26AS / AIS</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">DEDUCTIONS</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> LIC / PPF / ELSS (80C)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Medical Insurance (80D)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Assistance?</h4>
                            <p className="text-gray-300 text-sm mb-4">Confused about HRA or Deductions?</p>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Users size={20} className="text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Call Expert</p>
                                    <p className="font-bold">+91 7639227019</p>
                                </div>
                            </div>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">
                                Request Callback
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Itr1Page;
