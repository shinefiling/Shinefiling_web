import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, ArrowRight, Star, Shield, Users, Landmark, Globe, FileCheck, Check, X, Calendar, Zap, Clock, Award, ShieldCheck, Sparkles, ChevronDown, Search, Briefcase, CreditCard, Layers, ClipboardCheck, History, HelpCircle, FileBarChart, HardDrive, FileText, Banknote, Handshake, Scale
} from 'lucide-react';
import GSTAnnualReturnRegistration from './GSTAnnualReturnRegistration';

const GSTAnnualReturnPage = ({ isLoggedIn }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('standard');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is GSTR-9?", a: "GSTR-9 is an annual return to be filed by all registered taxpayers. It consists of details regarding outward and inward supplies made/received during the financial year." },
        { q: "What is GSTR-9C?", a: "GSTR-9C is a reconciliation statement between the audited annual financial statements and the GSTR-9, mandatory for taxpayers with turnover above ₹5 Crore." },
        { q: "What is the turnover limit for GSTR-9?", a: "Filing GSTR-9 is optional for taxpayers with turnover up to ₹2 Crore, but it is highly recommended for record accuracy and preventing future notices." },
        { q: "Are there penalties for missing it?", a: "Yes, a late fee of ₹200 per day (₹100 for CGST + ₹100 for SGST) is applicable, subject to a maximum of 0.5% of turnover." },
        { q: "What data is needed for filing?", a: "You need GSTR-1 & 3B summaries, purchase registers, audited balance sheets, and details of ITC claimed vs utilized." }
    ];

    const handlePlanSelect = (plan) => {
        if (isLoggedIn) {
            setSelectedPlan(plan);
            setShowRegisterModal(true);
        } else {
            navigate('/login', { state: { from: window.location.pathname } });
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">
            <AnimatePresence>
                {showRegisterModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-6 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col"
                        >
                            <GSTAnnualReturnRegistration
                                isLoggedIn={isLoggedIn}
                                isModal={true}
                                planProp={selectedPlan}
                                onClose={() => setShowRegisterModal(false)}
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
                        alt="Audit & Finance"
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
                                    <ClipboardCheck size={12} className="fill-bronze" /> Fiscal Consolidation
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    GST Annual <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Return Filing Online</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Strategic <strong className="text-white font-semibold">GSTR-9 & 9C</strong> reconciliation. Safeguard your business from departmental audits with <strong className="text-white font-semibold">100% Data Integrity</strong>.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Frequency</p>
                                        <p className="font-bold text-sm text-white">Annual Cycle</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Security</p>
                                        <p className="font-bold text-sm text-white">100% Verified</p>
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
                                    Start Annual Filing
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
                                            <Scale size={28} className="text-bronze" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle size={14} className="text-green-500" />
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">GSTR-9 Annual<br />Return Filing</h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">GST Compliance</p>
                                </div>
                                <div className="h-px w-full bg-slate-100 mb-5"></div>
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Clock size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Annual</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Filing<br />Cycle</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Shield size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">100%</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Data<br />Integrity</p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "GSTR-9 & GSTR-9C Filing",
                                        "ITC Reconciliation (GSTR-2B)",
                                        "Audit-Safe Data Verification"
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
                                    Start Annual Filing <ArrowRight size={16} />
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
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Premium Compliance</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Transparent Audit Pricing</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Basic Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Basic</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹1,499</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">PROMO</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "GSTR-9 Annual Return Preparation",
                                    "Sales Register Consolidation",
                                    "Purchase Register Consolidation",
                                    "Summary Data for Portal Entry",
                                    "HSN Summary Preparation",
                                    "Email Support within 24 Hours"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('basic')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Basic</button>
                        </motion.div>

                        {/* Standard Plan (Growth) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Most Popular</div>
                            <h3 className="text-lg font-bold text-white mb-2 mt-1">GSTR-9 (Growth)</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹2,499</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹5,000</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                <li className="text-xs font-bold text-[#D9A55B] uppercase tracking-wider border-b border-white/10 pb-2">Everything in Basic +</li>
                                {[
                                    "Mandatory GSTR-9 Portal Filing",
                                    "Detailed 2A/2B Reconciliation",
                                    "Tax Liability Re-calculation",
                                    "Identify Short/Excess Tax Paid",
                                    "Priority WhatsApp Support",
                                    "Department Review Readiness"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Choose Growth</button>
                        </motion.div>

                        {/* Corporate Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">GSTR-9 + 9C</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy">₹4,999</span>
                                <span className="text-slate-400 line-through text-xs">₹10,000</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="text-xs font-bold text-navy uppercase tracking-wider border-b border-gray-100 pb-2">Everything in Standard +</li>
                                {[
                                    "GSTR-9C Reconciliation Statement",
                                    "Audited Financial Statements Sync",
                                    "Discrepancy Resolution Support",
                                    "Official GSTR-9C Submission",
                                    "Dedicated Audit Manager",
                                    "Credential Management"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('premium')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Corporate</button>
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
                            <h3 className="text-2xl font-bold text-navy mb-2">Departmental Audit Shield</h3>
                            <p className="text-slate-500 text-sm mb-4">Our GSTR-9 filing acts as your first line of defense against future department scrutiny. We ensure your annual data matches your monthly returns perfectly.</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6">
                                <div className="flex items-center gap-2">
                                    <Handshake size={18} className="text-bronze" />
                                    <span className="text-navy font-bold text-sm">100% Online Process</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={18} className="text-bronze" />
                                    <span className="text-navy font-bold text-sm">Legal Accuracy Assured</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap size={18} className="text-bronze" />
                                    <span className="text-navy font-bold text-sm">ARN Reference Guaranteed</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-auto">
                            <button
                                onClick={() => setShowRegisterModal(true)}
                                className="w-full md:px-8 py-4 bg-navy hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                Start Filing <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16 text-slate-600 leading-relaxed">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <ShieldCheck className="text-bronze" /> Why File Annual Returns?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-lg font-medium">
                                Filing your <strong>GSTR-9 Annual Return</strong> is the final opportunity to declare any missed sales or claim unclaimed ITC for the financial year. It serves as a <span className="text-navy font-bold underline decoration-bronze decoration-2">True Compliance Picture</span> of your business.
                            </p>
                            <div className="mt-12 grid md:grid-cols-2 gap-6">
                                {[
                                    { title: "Correct Mistakes", desc: "Rectify errors made in monthly GSTR-1/3B filings.", icon: Shield },
                                    { title: "Claim ITC", desc: "Last chance to claim any missed Input Tax Credit for the year.", icon: CreditCard },
                                    { title: "Avoid Litigation", desc: "Match your books with filed returns to prevent department notices.", icon: Zap },
                                    { title: "Refund Processing", desc: "Essential for processing any pending GST refunds.", icon: Layers },
                                ].map((box, i) => (
                                    <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-bronze/30 transition-all group">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-navy mb-4 group-hover:bg-navy group-hover:text-bronze transition-colors">
                                            <box.icon size={24} />
                                        </div>
                                        <h4 className="font-bold text-lg text-navy mb-2">{box.title}</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed">{box.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FILING PROCESS SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Annual Filing Workflow</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Data Consolidation", desc: "We aggregate all your GSTR-1 and GSTR-3B filings for the financial year and match them with your books of accounts." },
                                { step: "Step 2", title: "Reconciliation Check", desc: "Our system identifies mismatches in ITC (2A/2B vs Books) and Turnover declared vs Audit financials." },
                                { step: "Step 3", title: "Liability Discharge", desc: "Any short payment of tax found during reconciliation is paid via DRC-03 to avoid future demand notices." },
                                { step: "Step 4", title: "Final Submission", desc: "We draft the GSTR-9 (and 9C if applicable), get your approval, and file it with digital signature." },
                            ].map((item, i) => (
                                <div key={i} className="group flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-100 hover:border-bronze/30 hover:shadow-lg transition-all duration-300">
                                    <div className="flex-shrink-0 w-full md:w-32 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:bg-bronze/5 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-bronze font-bold flex items-center justify-center mb-2 shadow-sm">
                                            {i + 1}
                                        </div>
                                        <span className="text-navy font-bold text-sm">Action</span>
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
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Data Checklist
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">FINANCIALS</p>
                                    <ul className="space-y-3">
                                        {["Audited Balance Sheet", "Profit & Loss Account", "Director's Report"].map((doc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600">
                                                <CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">TAX RECORDS</p>
                                    <ul className="space-y-3">
                                        {["GSTR-1 Yearly Summary", "GSTR-3B Yearly Summary", "ITC Register (2A/2B VS Books)"].map((doc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600">
                                                <CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-navy text-white p-8 rounded-3xl shadow-lg relative overflow-hidden group">
                            <h4 className="font-bold text-xl mb-4">Filing Concierge</h4>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Dedicated managers for Annual Return filing and GSTR-9C Certification.</p>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shadow-inner">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Direct Help</p>
                                    <p className="font-bold text-xl text-white">080-FILE-SHINE</p>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-bronze text-white rounded-xl font-bold text-sm hover:bg-white hover:text-navy transition-all shadow-lg shadow-bronze/20">
                                Consult Filing CA
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GSTAnnualReturnPage;
