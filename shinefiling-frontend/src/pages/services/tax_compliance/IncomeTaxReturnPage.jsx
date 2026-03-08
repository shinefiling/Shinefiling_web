
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, ArrowRight, Star, Shield, Users, Landmark, Globe, FileCheck, Check, X, Calendar, Zap, Clock, Award, ShieldCheck, Sparkles, ChevronDown, Search, Briefcase, CreditCard, Layers, TrendingUp, Calculator, Wallet, History, HelpCircle, ReceiptText, FileText, Banknote, Handshake
} from 'lucide-react';
import IncomeTaxReturnRegistration from './IncomeTaxReturnRegistration';

const IncomeTaxReturnPage = ({ isLoggedIn }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('business');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is the last date to file ITR?", a: "For individuals and non-audit cases, the due date is typically July 31st of the Assessment Year. For audit cases, it is October 31st." },
        { q: "Which ITR form should I file?", a: "ITR-1 is for salaried individuals with income < ₹50L. ITR-3 is for business/professionals. ITR-4 is for presumptive business income." },
        { q: "Can I file ITR if my income is below the taxable limit?", a: "Yes, it is highly recommended to file a 'Nil Return' to maintain a continuous tax record, which helps in loan approvals and visa applications." },
        { q: "What are the benefits of filing ITR?", a: "Benefits include easy loan processing, carry forward of losses, tax refund claims, and serving as a valid proof of income." },
        { q: "What happens if I forget to file?", a: "Late filing attracts penalties up to ₹5,000 and you lose the benefit of carrying forward losses. You may also receive a notice from the IT department." },
        { q: "What is Form 26AS?", a: "Form 26AS is a consolidated tax statement that shows details of TDS, TCS, and advance tax paid against your PAN." }
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

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2070"
                        alt="Income Tax"
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

                        {/* Hero Content - Left Aligned */}
                        <div className="flex-1 text-center lg:text-left space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                                    <TrendingUp size={12} className="fill-bronze" /> Maximum Refund Logic
                                </span>
                                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-white tracking-tight">
                                    Income Tax <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white italic uppercase">Return Filing</span>
                                </h1>
                                <p className="text-gray-300 text-xl max-w-xl font-light leading-relaxed">
                                    Strategic <strong className="text-white font-semibold">ITR-1 to ITR-4</strong> filing. Optimize your deductions, secure your refunds, and maintain a 100% clean financial record.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tax Saved</p>
                                        <p className="font-bold text-sm text-white">Optimized</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Clock size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Processing</p>
                                        <p className="font-bold text-sm text-white">Ultra-Fast</p>
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
                                    File My Return
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Learn More
                                </button>
                            </motion.div>
                        </div>

                        {/* Hero Floating Card */}
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
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Income Tax Return</p>
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
                                        "Business Income Computation",
                                        "Presumptive Taxation (44AD)",
                                        "Balance Sheet Preparation"
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
                                    onClick={() => handlePlanSelect('startup')}
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
            <section id="pricing-section" className="py-24 px-6 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Choose Your Path</span>
                        <h2 className="text-4xl font-bold text-navy mb-4">Transparent Pricing Plans</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                        {/* SALARIED */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Salaried</h3>
                            <p className="text-slate-500 text-sm mb-6">ITR-1 / ITR-2</p>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-3xl font-black text-navy">₹799</span>
                                <span className="text-slate-300 line-through text-lg">₹1.5k</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1 text-sm text-slate-600">
                                {["Salary Income Reporting", "House Property Income", "Capital Gains (Basic)", "Deductions (80C, 80D)", "Form 16 Analysis"].map((f, i) => (
                                    <li key={i} className="flex gap-3"><CheckCircle size={18} className="text-green-500" /> {f}</li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('salaried')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">Select Salaried</button>
                        </motion.div>

                        {/* BUSINESS */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] text-white rounded-3xl p-10 shadow-2xl relative transform md:-translate-y-6 z-10 flex flex-col"
                        >
                            {/* Top Gold Line */}
                            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-3xl"></div>

                            <div className="absolute top-6 right-6 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">Most Popular</div>

                            <h3 className="text-2xl font-bold mb-2 text-white mt-2">Business / Pro</h3>
                            <p className="text-gray-400 text-sm mb-6">ITR-3 / ITR-4</p>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-3xl font-black text-white">₹1,499</span>
                                <span className="text-white/20 line-through text-xl">₹2.5k</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1 text-sm text-gray-300">
                                {["Everything in Salaried", "Business P&L Computation", "Balance Sheet Creation", "Presumptive Taxation", "Refund Optimization"].map((f, i) => (
                                    <li key={i} className="flex gap-3"><div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {f}</li>
                                ))}
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg hover:shadow-bronze/20 transition-all hover:scale-105">Launch Filing</button>
                        </motion.div>

                        {/* CAPITAL GAINS */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Capital Gains</h3>
                            <p className="text-slate-500 text-sm mb-6">Investors / Traders</p>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-3xl font-black text-navy">₹1,999</span>
                                <span className="text-slate-300 line-through text-lg">₹4k</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1 text-sm text-slate-600">
                                {["Stock Market Profit/Loss", "Real Estate Gains", "Crypto Tax Calculation", "Intraday/F&O Trading", "Foreign Income Reporting"].map((f, i) => (
                                    <li key={i} className="flex gap-3"><CheckCircle size={18} className="text-green-500" /> {f}</li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('capital_gains')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">Select Investor</button>
                        </motion.div>

                        {/* CORPORATE */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Entity / Firm</h3>
                            <p className="text-slate-500 text-sm mb-6">ITR-5 / ITR-6 / ITR-7</p>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-3xl font-black text-navy">₹4,999</span>
                                <span className="text-slate-300 line-through text-lg">₹10k</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1 text-sm text-slate-600">
                                {["Partnership / LLP Filing", "Pvt Ltd Company Return", "Trust / NGO Filing", "Tax Audit Assistance", "Compliance Check"].map((f, i) => (
                                    <li key={i} className="flex gap-3"><CheckCircle size={18} className="text-green-500" /> {f}</li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('corporate')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">Select Entity</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16 text-slate-600 leading-relaxed">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    {/* ITR FILING WORKFLOW */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">ITR Filing Workflow</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Information Gathering", desc: "Collect Form 16, AIS, TIS, and bank statements. We map your income from all sources (Salary, House, Interest)." },
                                { step: "Step 2", title: "Tax Optimization", desc: "Our experts analyze your investments and suggest the best tax regime (Old vs New) to minimize your tax outflow." },
                                { step: "Step 3", title: "Review & Computation", desc: "A draft tax computation is shared for your review. We ensure all deductions under Chapter VI-A are fully claimed." },
                                { step: "Step 4", title: "Filing & E-Verification", desc: "Once approved, we file your return on the IT portal. We also assist in e-verifying via Aadhaar OTP to complete the process." },
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

                    {/* OLD VS NEW REGIME TABLE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Old vs New Tax Regime (FY 2024-25)</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Feature</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Old Tax Regime</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">New Tax Regime (Default)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {[
                                        { f: "Standard Deduction", r: "₹50,000", c: "₹75,000 (Revised)" },
                                        { f: "80C Deductions (LIC/PPF)", r: "Allowed up to ₹1.5L", c: "Not Allowed" },
                                        { f: "80D (Health Insurance)", r: "Allowed", c: "Not Allowed" },
                                        { f: "HRA / LTA Exemption", r: "Allowed", c: "Not Allowed" },
                                        { f: "Rebate u/s 87A", r: "Taxable income up to ₹5L", c: "Taxable income up to ₹7L" },
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

                    {/* LATE FILING PENALTY TABLE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Late Filing Penalties (Sec 234F)</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-[#043E52] text-white">
                                    <tr>
                                        <th className="p-4 font-bold text-sm uppercase tracking-wider">Total Income Range</th>
                                        <th className="p-4 font-bold text-sm uppercase tracking-wider">Filing After Due Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {[
                                        { f: "Up to ₹2.5 Lakhs", r: "Nil" },
                                        { f: "₹2.5L to ₹5 Lakhs", r: "₹1,000" },
                                        { f: "Above ₹5 Lakhs", r: "₹5,000" },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition">
                                            <td className="p-4 text-navy font-bold">{row.f}</td>
                                            <td className="p-4 text-red-600 font-bold">{row.r}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <ShieldCheck className="text-bronze" /> Why File ITR?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-lg font-medium">
                                Filing your <strong>Income Tax Return</strong> is not just a legal duty; it's a financial hygiene factor. A filed ITR is the most credible <span className="text-navy font-bold underline decoration-bronze decoration-2">Proof of Income</span> for any large financial transaction.
                            </p>
                            <div className="mt-12 grid md:grid-cols-2 gap-6">
                                {[
                                    { title: "Loan Approval", desc: "Banks require last 3 years' ITR for Home, Car, or Personal loans.", icon: Landmark },
                                    { title: "Tax Refund", desc: "Claim back excess TDS deducted by your employer or banks.", icon: Wallet },
                                    { title: "Visa Processing", desc: "Embassies often ask for ITR receipts for visa applications.", icon: Globe },
                                    { title: "Carry Losses", desc: "Carry forward business or capital losses to offset future profits.", icon: TrendingUp },
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

                    <section className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-lg">
                        <div className="bg-navy p-8 flex items-center justify-between text-white">
                            <h2 className="text-2xl font-bold flex items-center gap-3"><Clock className="text-bronze" /> Important Dates</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#2B3446]/5 text-slate-500 border-b border-gray-200 uppercase tracking-wider font-bold">
                                    <tr>
                                        <th className="px-8 py-4">Category</th>
                                        <th className="px-8 py-4">Due Date</th>
                                        <th className="px-8 py-4">Late Penalty</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">Individuals (Non-Audit)</td><td className="px-8 py-4 text-navy font-bold">31st July</td><td className="px-8 py-4">Up to ₹5,000</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">Business (Audit Cases)</td><td className="px-8 py-4 text-navy font-bold">31st October</td><td className="px-8 py-4">Up to ₹10,000</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">Belated / Revised</td><td className="px-8 py-4 text-navy font-bold">31st December</td><td className="px-8 py-4">Benefits Lost</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <HelpCircle className="text-bronze" /> Common Questions
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all open:shadow-md">
                                    <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-bold text-navy hover:bg-gray-50 transition-colors list-none select-none">
                                        <span>{faq.q}</span>
                                        <ChevronDown className="group-open:rotate-180 transition-transform text-slate-400" />
                                    </summary>
                                    <div className="px-6 pb-6 pt-2 text-slate-600 text-sm leading-relaxed border-t border-gray-100">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Documents Checklist
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">PERSONAL</p>
                                    <ul className="space-y-3">
                                        {["PAN & Aadhaar Card", "Form 26AS / AIS", "Bank Statements"].map((doc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600">
                                                <CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">INCOME PROOF</p>
                                    <ul className="space-y-3">
                                        {["Form 16 (Salaried)", "Broker Contract Notes (Capital Gain)", "Investment Proofs (LIC/PPF)"].map((doc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600">
                                                <CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-3 bg-slate-50 hover:bg-slate-100 text-navy font-bold rounded-xl text-sm transition-colors border border-slate-200">
                                Download ITR Planner
                            </button>
                        </div>

                        <div className="bg-navy text-white p-8 rounded-3xl shadow-lg relative overflow-hidden group">

                            <h4 className="font-bold text-xl mb-4">Tax Concierge</h4>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Dedicated CA to analyze your savings and maximize refund.</p>

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
                                Consult Tax Expert
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showRegisterModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="relative w-full max-w-6xl max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 bg-white ring-1 ring-white/20">
                            <div className="absolute top-4 right-4 z-50">
                                <button onClick={() => setShowRegisterModal(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[95vh]">
                                <IncomeTaxReturnRegistration isLoggedIn={isLoggedIn} planProp={selectedPlan} isModal={true} onClose={() => setShowRegisterModal(false)} />
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default IncomeTaxReturnPage;
