
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, ArrowRight, Star, Shield, Users, Landmark, Globe, FileCheck, Check, X, Calendar, Zap, Clock, Award, ShieldCheck, Sparkles, ChevronDown, Search, Briefcase, CreditCard, Layers, History, HelpCircle, Gavel, ClipboardCheck, Scale, FileText, Activity, Calculator, Banknote, Handshake
} from 'lucide-react';
import TaxAuditRegistration from './TaxAuditRegistration';

const TaxAuditFilingPage = ({ isLoggedIn }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('standard');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is the turnover limit for Tax Audit?", a: "Mandatory if business turnover exceeds ₹1 Cr. For businesses with >95% digital transactions, the limit is ₹10 Cr. For professionals, it's ₹50 Lakhs." },
        { q: "What are the common audit forms?", a: "Form 3CA (for entities already audited under other laws), Form 3CB (for other entities), and Form 3CD (detailed statement of particulars)." },
        { q: "Who can sign the Tax Audit Report?", a: "Only a practicing Chartered Accountant (CA) can conduct the audit and digitally sign the report using their DSC." },
        { q: "What is the penalty for non-compliance?", a: "Under Section 271B, the penalty is 0.5% of turnover or ₹1,50,000, whichever is lower." },
        { q: "What is the due date for filing?", a: "The statutory due date is 30th September of the assessment year (one month before the ITR filing due date)." },
        { q: "Can a tax audit report be revised?", a: "Yes, it can be revised if there is a change in law or for specific calculation errors, provided a reason is mentioned in the revised report." }
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
                        src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=2070"
                        alt="Audit Architecture"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/80 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>

                    {/* Animated Blob */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-20 -right-20 w-96 h-96 bg-bronze/20 rounded-full blur-3xl mix-blend-overlay"
                    />
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
                                    <Gavel size={12} className="fill-bronze" /> Sec 44AB Mandate Layer
                                </span>
                                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-white tracking-tight">
                                    Tax <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white italic uppercase">Audit Protocol</span>
                                </h1>
                                <p className="text-gray-300 text-xl max-w-xl font-light leading-relaxed">
                                    High-stakes <strong className="text-white font-semibold">Form 3CA/CB/CD</strong> certification. Expert scrutiny for businesses exceeding the ₹1Cr - ₹10Cr turnover thresholds.
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
                                        <Calendar size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Due Date</p>
                                        <p className="font-bold text-sm text-white">30 September</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Award size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Certification</p>
                                        <p className="font-bold text-sm text-white">CA DSC Verified</p>
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
                                    Initialize Audit
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
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Tax Audit Filing</p>
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
                                        "Vouching of Expenses",
                                        "Fixed Asset Verification",
                                        "Loan & Interest Check"
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
                        <History className="text-bronze mx-auto mb-4" size={40} />
                        <h2 className="text-4xl font-bold text-navy mb-4">Audit Tiers</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Professional fees for statutory compliance and assurance.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-stretch">
                        {/* PRESUMPTIVE */}
                        <div className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
                            <h3 className="text-lg font-bold text-navy mb-2">Presumptive</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Review Only</p>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-3xl font-black text-navy">₹2,499</span>
                                <span className="text-slate-300 line-through text-lg">₹5k</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1 text-sm text-slate-600">
                                {["Turnover Verification", "Section 44AD Check", "Profit Margin Analysis", "Draft Computation"].map((f, i) => (
                                    <li key={i} className="flex gap-3"><CheckCircle size={18} className="text-bronze" /> {f}</li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('presumptive')} className="w-full py-3 bg-slate-50 text-navy font-bold rounded-xl hover:bg-navy hover:text-white transition-colors border border-slate-200">Select Review</button>
                        </div>

                        {/* STANDARD */}
                        {/* STANDARD */}
                        <div className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full">
                            {/* Top Gold Line */}
                            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-3xl"></div>

                            <div className="absolute top-6 right-6 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                Most Popular
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 mt-2">Full Audit</h3>
                            <p className="text-gray-400 text-sm mb-6">Comprehensive expert assisted registration.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-3xl font-black text-white">₹4,999</span>
                                <span className="text-gray-500 line-through text-sm">₹8k</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {["Detailed Book Scrutiny", "Stock Valuation Check", "Depreciation Schedule", "Form 3CB-3CD Filing", "Compliance Report"].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-bold rounded-xl shadow-lg shadow-bronze/20 transition-all hover:scale-105">
                                Start Audit
                            </button>
                        </div>

                        {/* CORPORATE */}
                        <div className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
                            <h3 className="text-lg font-bold text-navy mb-2">Corporate</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Complex Cases</p>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-3xl font-black text-navy">₹9,999</span>
                                <span className="text-slate-300 line-through text-lg">₹15k</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1 text-sm text-slate-600">
                                {["Multi-Location Audit", "Transfer Pricing (Preliminary)", "Detailed Management Letter", "Internal Control Check"].map((f, i) => (
                                    <li key={i} className="flex gap-3"><CheckCircle size={18} className="text-bronze" /> {f}</li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('corporate')} className="w-full py-3 bg-slate-50 text-navy font-bold rounded-xl hover:bg-navy hover:text-white transition-colors border border-slate-200">Select Corporate</button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16 text-slate-600 leading-relaxed">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    {/* AUDIT WORKFLOW SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Tax Audit Workflow</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Document Collation", desc: "Gather all bank statements, purchase/sales registers, expense vouchers, and previous year's audit reports." },
                                { step: "Step 2", title: "CA Scrutiny", desc: "Our Chartered Accountants perform physical or digital vouching of entries to ensure compliance with Income Tax Act modules." },
                                { step: "Step 3", title: "Draft Report (3CD)", desc: "A draft Form 3CD is prepared with all factual observations, tax disallowances, and compliance notes." },
                                { step: "Step 4", title: "Final Filing", desc: "The report is digitally signed by the CA (UDIN generation) and uploaded to the Income Tax Portal for your approval." },
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

                    {/* AUDIT FORMS TABLE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Standard Audit Forms</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Form</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Applicability</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Contents</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {[
                                        { f: "Form 3CA", r: "Entities audited under other laws (e.g., Companies)", c: "Audit Report & Annexures" },
                                        { f: "Form 3CB", r: "Entities not audited under other laws (e.g., Professionals)", c: "Audit Report & Financial Statements" },
                                        { f: "Form 3CD", r: "Common for all Audit cases", c: "Detailed 44-point statement of particulars" },
                                        { f: "Form 3CE", r: "Non-residents/Foreign Companies", c: "Specific to international transactions" },
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
                        <h2 className="text-3xl font-bold text-navy mb-8">Non-Compliance Risks</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-orange-50 text-orange-900 border-b border-orange-100">
                                    <tr>
                                        <th className="p-4 font-bold text-sm uppercase tracking-wider">Default Case</th>
                                        <th className="p-4 font-bold text-sm uppercase tracking-wider">Penalty Section</th>
                                        <th className="p-4 font-bold text-sm uppercase tracking-wider">Penalty Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-bold">Delay in filing Audit Report</td>
                                        <td className="p-4 text-slate-600">271B</td>
                                        <td className="p-4 text-red-600 font-bold">0.5% of Turnover (Max ₹1.5L)</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-bold">Incorrect Particulars in 3CD</td>
                                        <td className="p-4 text-slate-600">270A</td>
                                        <td className="p-4 text-red-600 font-bold">200% of Tax evaded</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-bold">Failure to keep books</td>
                                        <td className="p-4 text-slate-600">271A</td>
                                        <td className="p-4 text-red-600 font-bold">₹25,000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <ShieldCheck className="text-bronze" /> Strategic Assurance
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-lg font-medium">
                                A <strong>Tax Audit</strong> is more than a compliance tick-box. It provides independent assurance to stakeholders that your <span className="text-navy font-bold underline decoration-bronze decoration-2">Financial Statements</span> are free from material misstatements.
                            </p>
                            <div className="mt-12 grid md:grid-cols-2 gap-6">
                                {[
                                    { title: "Penalty Shield", desc: "Avoid the flat penalty of 0.5% of turnover for non-compliance.", icon: Shield },
                                    { title: "Bank Credit", desc: "Audited financials are mandatory for renewing bank OD/CC limits.", icon: Landmark },
                                    { title: "Error Detection", desc: "Identify accounting errors before the department finds them.", icon: Search },
                                    { title: "Tax Planning", desc: "Expert advice on deductions and allowances during the audit process.", icon: Calculator },
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
                            <h2 className="text-2xl font-bold flex items-center gap-3"><Clock className="text-bronze" /> Audit Thresholds</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#2B3446]/5 text-slate-500 border-b border-gray-200 uppercase tracking-wider font-bold">
                                    <tr>
                                        <th className="px-8 py-4">Category</th>
                                        <th className="px-8 py-4">Revenue Limit</th>
                                        <th className="px-8 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">Business (Normal)</td><td className="px-8 py-4 text-navy font-bold">&gt; ₹1 Crore</td><td className="px-8 py-4">Mandatory Audit</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">Business (Digital)</td><td className="px-8 py-4 text-navy font-bold">&gt; ₹10 Crore</td><td className="px-8 py-4">Mandatory Audit</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">Professionals</td><td className="px-8 py-4 text-navy font-bold">&gt; ₹50 Lakhs</td><td className="px-8 py-4">Mandatory Audit</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">Presumptive</td><td className="px-8 py-4 text-navy font-bold">Declaring Lower Income</td><td className="px-8 py-4">Mandatory Audit</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <HelpCircle className="text-bronze" /> Expert Insights
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
                                <ClipboardCheck className="text-bronze" /> Audit Checklist
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">PRIMARY BOOKS</p>
                                    <ul className="space-y-3">
                                        {["Cash Book & Bank Book", "Purchase & Sales Register", "Journal Vouchers", "Ledgers"].map((doc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600">
                                                <CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">SUPPORTING</p>
                                    <ul className="space-y-3">
                                        {["Stock Valuation Report", "Loan Sanction Letters", "Fixed Asset Register", "TDS Returns"].map((doc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600">
                                                <CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-3 bg-slate-50 hover:bg-slate-100 text-navy font-bold rounded-xl text-sm transition-colors border border-slate-200">
                                Download Audit Docs List
                            </button>
                        </div>

                        <div className="bg-navy text-white p-8 rounded-3xl shadow-lg relative overflow-hidden group">

                            <h4 className="font-bold text-xl mb-4">Lead Auditor</h4>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Schedule a preliminary discussion with our Lead CA.</p>

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
                                Consult Auditor
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
                                <TaxAuditRegistration isLoggedIn={isLoggedIn} initialPlan={selectedPlan} onClose={() => setShowRegisterModal(false)} />
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TaxAuditFilingPage;
