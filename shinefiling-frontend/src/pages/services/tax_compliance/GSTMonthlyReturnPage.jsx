
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, ArrowRight, Star, Shield, Users, Landmark, Globe, FileCheck, Check, X, Calendar, Zap, Clock, Award, ShieldCheck, Sparkles, ChevronDown, Search, Briefcase, CreditCard, Layers, History, HelpCircle, FileText, Banknote, Handshake
} from 'lucide-react';
import GSTMonthlyReturnRegistration from './GstMonthlyReturnRegistration';

const GSTMonthlyReturnPage = ({ isLoggedIn }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('standard');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What are GSTR-1 and GSTR-3B?", a: "GSTR-1 is used to report outward supplies (sales), while GSTR-3B is a self-assessment summary return used for tax payment and claiming Input Tax Credit (ITC)." },
        { q: "What is the due date for monthly filing?", a: "GSTR-1 is generally due by the 11th of the following month, and GSTR-3B is due by the 20th of the following month." },
        { q: "Can I file returns myself?", a: "Yes, but errors in ITC claims or tax calculations can lead to department notices and heavy penalties. Professional filing ensures accuracy and reconciliation." },
        { q: "What is ITC Reconciliation?", a: "It is the process of matching the ITC claimed in your GSTR-3B with the data uploaded by your suppliers in their GSTR-1, which reflects in your GSTR-2B." },
        { q: "Is Nil Return mandatory?", a: "Yes, even if you have no business activity for a month, you must file a 'Nil Return' to avoid daily late fees." },
        { q: "What are the penalties for late filing?", a: "A late fee of ₹50 per day (₹20 for Nil returns) is charged, plus 18% interest on the pending tax amount." }
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
                <div className="absolute inset-0 z-0 text-left">
                    <img
                        src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=2070"
                        alt="Finance Audit"
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

                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full font-poppins text-white">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16 text-left">
                        <div className="flex-1 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-bronze/10 text-bronze border border-bronze/20 rounded-full text-[10px] font-black tracking-[0.4em] uppercase mb-8 backdrop-blur-xl italic">
                                    <Calendar size={14} className="animate-pulse" /> Monthly Compliance Engine
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    GST Monthly <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Compliance Suite</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Strategic <strong className="text-white font-semibold">GSTR-1 & 3B</strong> management. Maximize your <strong className="text-white font-semibold">Input Tax Credit</strong> while maintaining a 100% clean record.
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
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Compliance</p>
                                        <p className="font-bold text-sm text-white">Secure Filing</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Award size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Optimization</p>
                                        <p className="font-bold text-sm text-white">ITC Focused</p>
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
                                    File Return Now
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Filing Guide
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
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">G S T Monthly Return</p>
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
                                        "GSTR-1 & 3B Monthly Filing",
                                        "Invoice Matching & Audit",
                                        "Hsn-wise Reporting"
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

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* NIL */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Nil Pulse</h3>
                            <p className="text-slate-500 text-sm mb-6">No Activity Filing.</p>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-3xl font-black text-navy">₹499</span>
                                <span className="text-slate-400 line-through text-lg">₹800</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1 text-sm text-slate-600">
                                {["GSTR-1 Nil Return", "GSTR-3B Nil Return", "Late Fee Check", "Next Month Alerts"].map((f, i) => (
                                    <li key={i} className="flex gap-3"><CheckCircle size={18} className="text-green-500" /> {f}</li>
                                ))}
                                <li className="flex gap-3 text-slate-300"><X size={18} /> Purchase Matching</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('nil')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">File Nil Return</button>
                        </motion.div>

                        {/* STANDARD */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            {/* Top Gold Line */}
                            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-3xl"></div>

                            <div className="absolute top-6 right-6 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                Most Popular
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 mt-2">Professional</h3>
                            <p className="text-gray-400 text-sm mb-6">Turnover &lt; 50L</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-3xl font-black text-white">₹999</span>
                                <span className="text-gray-500 line-through text-sm">₹1.5k</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {["Everything in Nil", "Sales Invoice Processing", "ITC Claim Summary", "Tax Liability Calc", "Department Mail Support"].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-bold rounded-xl shadow-lg shadow-bronze/20 transition-all hover:scale-105">
                                Launch Filing
                            </button>
                        </motion.div>

                        {/* PREMIUM */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Recon Elite</h3>
                            <p className="text-slate-500 text-sm mb-6">High Volume</p>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-3xl font-black text-navy">₹1,999</span>
                                <span className="text-slate-400 line-through text-lg">₹3k</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1 text-sm text-slate-600">
                                {["Everything in Pro", "Full 2A/2B Reconciliation", "Vendor Follow-up Guide", "Bulk JSON Handling", "Personal Tax Manager"].map((f, i) => (
                                    <li key={i} className="flex gap-3"><CheckCircle size={18} className="text-green-500" /> {f}</li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('enterprise')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">Choose Enterprise</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16 text-slate-600 leading-relaxed">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    {/* FILING PROCESS STEPS */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Monthly Filing Workflow</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Sales Data (GSTR-1)", desc: "Upload all B2B and B2C sales invoices. This populates your buyer's GSTR-2B." },
                                { step: "Step 2", title: "Purchase Recon (GSTR-2B)", desc: "We reconcile your purchase register with GSTR-2B to maximize Input Tax Credit (ITC)." },
                                { step: "Step 3", title: "Tax Payment (GSTR-3B)", desc: "Set off ITC against liability. Pay the balance tax via Challan and file GSTR-3B." },
                                { step: "Step 4", title: "File & Track", desc: "Generate the filing acknowledgment and track status on the GST Portal." },
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

                    {/* DETAILED CONTENT SECTION */}
                    <section className="space-y-12">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
                            <h2 className="text-3xl font-bold text-navy mb-8 border-b pb-4">Mastering Monthly GST Compliance (GSTR-1 & 3B)</h2>

                            <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">
                                <div>
                                    <h3 className="text-lg font-bold text-navy mb-4">Why Monthly Filing is the Backbone of Your Business</h3>
                                    <p>
                                        Monthly GST returns are not just a legal requirement; they are a direct reflection of your business's financial health and transparency. Timely filing of GSTR-1 ensures that your B2B customers can claim their <strong className="text-navy">Input Tax Credit (ITC)</strong>, maintaining healthy trade relationships. Simultaneously, GSTR-3B acts as the final settlement of your tax liability, where you utilize the ITC available in your GSTR-2B to minimize cash outflow.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                                            <History size={20} className="text-bronze" /> Impact of Delayed Filings
                                        </h3>
                                        <p className="text-sm">
                                            Delay in filing GSTR-1 blocks your customer's credit, which can lead to payment hold-ups. Furthermore, persistent delays in GSTR-3B filing can lead to the <strong>blocking of your E-Way Bill generation</strong> and, in extreme cases, cancellation of your GST registration.
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                                            <RefreshCw size={20} className="text-bronze" /> GSTR-2B Reconciliation
                                        </h3>
                                        <p className="text-sm">
                                            The new GST regime strictly allows ITC claims based on GSTR-2B (Static Statement). We perform automated reconciliation on a monthly basis to identify suppliers who haven't filed their returns, protecting your cash flow from ineligible ITC reversals.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-navy/5 p-8 rounded-3xl border border-navy/10 mt-12">
                                    <h3 className="text-2xl font-bold text-navy mb-6">Monthly Compliance Lifecycle</h3>
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[
                                            { t: "1st - 10th", d: "Data Collection & Invoice Sanitization" },
                                            { t: "11th Day", d: "GSTR-1 Filing (Sales Reporting)" },
                                            { t: "14th Day", d: "GSTR-2B Generation & ITC Match" },
                                            { t: "15th - 19th", d: "Tax Calculation & Challan Creation" },
                                            { t: "20th Day", d: "GSTR-3B Filing (Final Settlement)" },
                                            { t: "Success", d: "Download of Filed ARN/Receipt" }
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

                    {/* REGULAR VS QRMP TABLE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Regular vs QRMP Scheme</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Feature</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Regular Scheme</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">QRMP Scheme</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {[
                                        { f: "Turnover Limit", r: "Any Turnover", c: "Up to ₹5 Crores" },
                                        { f: "GSTR-1 Filing", r: "Monthly", c: "Quarterly (IFF Optional Monthly)" },
                                        { f: "GSTR-3B Filing", r: "Monthly", c: "Quarterly" },
                                        { f: "Tax Payment", r: "Monthly (with 3B)", c: "Monthly (via Challan PMT-06)" },
                                        { f: "ITC Claim", r: "Monthly", c: "Quarterly (Self-assessment)" },
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

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <ShieldCheck className="text-bronze" /> Strategic Filing
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-lg font-medium">
                                Monthly <strong>GST Returns</strong> are not just about submission; they are about <span className="text-navy font-bold underline decoration-bronze decoration-2">Cash Flow Optimization</span>. By accurately reconciling your purchases, you prevent tax leakage and build a formidable compliance rating.
                            </p>
                            <div className="mt-12 grid md:grid-cols-2 gap-6">
                                {[
                                    { title: "Zero Error Data", desc: "Proprietary validation logic to ensure no mismatch between sales and returns.", icon: Shield },
                                    { title: "ITC Assurance", desc: "Exhaustive GSTR-2B matching to ensure you never miss an input tax claim.", icon: CreditCard },
                                    { title: "Penalty Shield", desc: "Automated reminders and early-filing protocols to bypass late fees.", icon: Zap },
                                    { title: "Audit Ready", desc: "Well-structured digital files making annual audits a 5-minute task.", icon: Layers },
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
                            <h2 className="text-2xl font-bold flex items-center gap-3"><Clock className="text-bronze" /> Critical Timeline</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#2B3446]/5 text-slate-500 border-b border-gray-200 uppercase tracking-wider font-bold">
                                    <tr>
                                        <th className="px-8 py-4">Return Type</th>
                                        <th className="px-8 py-4">Frequency</th>
                                        <th className="px-8 py-4">Standard Due Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">GSTR-1 (Sales)</td><td className="px-8 py-4 text-navy font-bold">Monthly</td><td className="px-8 py-4">11th of Next Month</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">GSTR-3B (Summary)</td><td className="px-8 py-4 text-navy font-bold">Monthly</td><td className="px-8 py-4">20th of Next Month</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">IFF (Optional)</td><td className="px-8 py-4 text-navy font-bold">Quarterly</td><td className="px-8 py-4">13th of Month</td></tr>
                                    <tr className="bg-orange-50/50"><td className="px-8 py-4 font-bold text-orange-800">Late Fee Threshold</td><td className="px-8 py-4 font-bold text-orange-800">Post Deadline</td><td className="px-8 py-4 font-bold text-orange-800">₹50 / Day Charged</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <HelpCircle className="text-bronze" /> Filing IQ
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
                                <FileText className="text-bronze" /> Data Kit
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">SALES DATA</p>
                                    <ul className="space-y-3">
                                        {["B2B Tax Invoices", "B2C Sales Summary", "Export/Overseas Invoices"].map((doc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600">
                                                <CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">PURCHASE RECORDS</p>
                                    <ul className="space-y-3">
                                        {["Inward Supply Invoices", "Business Expenses (Utility)", "Bank Statement of Period"].map((doc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600">
                                                <CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-3 bg-slate-50 hover:bg-slate-100 text-navy font-bold rounded-xl text-sm transition-colors border border-slate-200">
                                Download Excel Template
                            </button>
                        </div>

                        <div className="bg-navy text-white p-8 rounded-3xl shadow-lg relative overflow-hidden group">

                            <h4 className="font-bold text-xl mb-4">Filing Concierge</h4>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Dedicated managers for multi-state GST filing and specialized RCM advisory.</p>

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
                                <GSTMonthlyReturnRegistration isLoggedIn={isLoggedIn} planProp={selectedPlan} isModal={true} onClose={() => setShowRegisterModal(false)} />
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GSTMonthlyReturnPage;
