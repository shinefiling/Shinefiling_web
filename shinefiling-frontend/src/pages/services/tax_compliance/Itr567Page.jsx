import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, ArrowRight, X, ShieldCheck, Globe, Banknote, Handshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Itr567Registration from './Itr567Registration';

const Itr567Page = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('itr5');

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "Who needs to file ITR-5?", a: "Firms, LLPs, AOPs, BOIs, Artificial Juridical Persons, and Trusts (not filing ITR-7)." },
        { q: "Who needs to file ITR-6?", a: "Companies (Private Limited, Public Limited, ONE Person Company) other than those claiming exemption u/s 11." },
        { q: "Is Digital Signature (DSC) mandatory?", a: "Yes, for ITR-6 (Companies) and ITR-5 (Tax Audit Cases), DSC is mandatory for filing." },
        { q: "What is ITR-7?", a: "For persons including companies required to furnish return under section 139(4A) or 139(4B) or 139(4C) or 139(4D) (i.e., Trusts, Political Parties, Colleges)." }
    ];

    const handlePlanSelect = (plan) => {
        if (isLoggedIn) {
            setSelectedPlan(plan);
            setShowRegistrationModal(true);
        } else {
            const targetUrl = `/services/income-tax/itr-5-6-7/register?plan=${plan}`;
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
                            <Itr567Registration
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
                    <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Corporate" />
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
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm"><Building size={12} className="text-bronze" /> Corporate & Entity Filing</span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    ITR-5, ITR-6 & <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">ITR-7 Tax Filing</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Specialized return filing for <strong className="text-white">Private Limited Companies, LLPs, Firms,</strong> and <strong className="text-white">Trusts/NGOs</strong>. Ensure 100% compliance with MCA and ITD.
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
                                        <Building size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Entity</p>
                                        <p className="font-bold text-sm text-white">Full Compliant</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Assurance</p>
                                        <p className="font-bold text-sm text-white">Error Free</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    File Corporate Return
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Entity Resource
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
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">ITR-567</p>
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
                                        "Audited / Non-Audited Books",
                                        "MAT / AMT Calculation",
                                        "Director's Report"
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
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Entity Returns</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* PLAN 1: ITR-5 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">LLP / Firm (ITR-5)</h3>
                            <p className="text-slate-500 text-sm mb-6">Partnership Compliance.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-3xl font-black text-navy">₹3,499</span>
                                <span className="text-slate-400 line-through text-sm">₹5,999</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Partnership Firm / LLP",
                                    "Partner's Salary & Interest",
                                    "Turnover &lt; ₹1 Cr (No Audit)",
                                    "Balance Sheet Preparation",
                                    "E-Filing & Verification"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('itr5')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Select ITR-5
                            </button>
                        </motion.div>

                        {/* PLAN 2: ITR-6 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                Corporate Choice
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 mt-2">Company (ITR-6)</h3>
                            <p className="text-gray-400 text-sm mb-6">Corporate Tax Filing.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-3xl font-black text-white">₹4,999</span>
                                <span className="text-gray-500 line-through text-sm">₹8,999</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Pvt Ltd / OPC / Public Ltd",
                                    "Statutory Audit Integration",
                                    "MAT Calculation",
                                    "DSC Verified Filing",
                                    "Dedicated Corporate Expert"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-bold rounded-xl shadow-lg shadow-bronze/20 transition-all hover:scale-105">
                                Select ITR-6
                            </button>
                        </motion.div>

                        {/* PLAN 3: ITR-7 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Trust / NGO (ITR-7)</h3>
                            <p className="text-slate-500 text-sm mb-6">Non-Profit Compliance.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-3xl font-black text-navy">₹5,999</span>
                                <span className="text-slate-400 line-through text-sm">₹9,999</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Trusts / Societies / Sec 8 Co",
                                    "Form 10B / 10BB Integration",
                                    "12A / 80G Exemption Check",
                                    "Political Party Compliance",
                                    "Priority NGO Support"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('itr7')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Select ITR-7
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
                            <Building className="text-bronze" /> What are ITR-5, ITR-6 & ITR-7?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                These returns cover compliance for various non-individual entities like Firms, Limited Liability Partnerships (LLPs), Companies, and Trusts.
                            </p>
                            <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-700">
                                <li><strong>ITR-5:</strong> For Firm, LLPs, AOPs (Association of Persons), BOIs (Body of Individuals), and Artificial Juridical Persons.</li>
                                <li><strong>ITR-6:</strong> Specifically for Companies (Pvt Ltd, Public Ltd, OPC) not claiming exemption under section 11 (Charitable/Religious purposes).</li>
                                <li><strong>ITR-7:</strong> For persons including Companies requiring to furnish returns under Section 139(4A/4B/4C/4D) - mainly Trusts, Political Parties, and Colleges.</li>
                            </ul>
                        </div>
                    </section>

                    {/* BENEFITS GRID */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Compliance Checkpoints</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Audit Report", desc: "For companies and specified entities, Tax Audit Report (Form 3CA-3CD/3CB-3CD) must be filed before the return.", icon: FileText },
                                { title: "MAT / AMT", desc: "Correct calculation of Minimum Alternate Tax (MAT) for companies to avoid demand notices.", icon: Scale },
                                { title: "DSC Mandatory", desc: "Digital Signature Certificate (DSC) of the authorized signatory is mandatory for filing ITR-6 and most ITR-5/7 cases.", icon: Shield },
                                { title: "Exemptions", desc: "For Trusts (ITR-7), claiming exemptions under 11 & 12 requires filing Form 10B/10BB strictly on time.", icon: CheckCircle },
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
                        <h2 className="text-3xl font-bold text-navy mb-8">Corporate Return Process</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Financials Finalization", desc: "Board Meeting is held to approve the Financial Statements (Balance Sheet & P&L) and signing of the Directors." },
                                { step: "Step 2", title: "Tax Audit (Form 3CD)", desc: "If applicable, our Chartered Accountants conduct the audit and file Form 3CA/3CB-3CD online." },
                                { step: "Step 3", title: "DSC Verification", desc: "The return is verified using the Digital Signature Certificate (DSC) of the Authorized Signatory." },
                                { step: "Step 4", title: "Acknowledgment", desc: "For Companies, no ITR-V (verification) is sent to Bangalore. The process completes with DSC upload." },
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

                    {/* COMPARISON TABLE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Entity-wise Comparison</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Feature</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Company (Pvt Ltd)</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">LLP / Firm</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {[
                                        { f: "Tax Rate", r: "25% (Sec 115BAA) + Surcharge", c: "Flat 30% + Surcharge" },
                                        { f: "Verification", r: "Mandatory DSC", c: "DSC or EVC (if no audit)" },
                                        { f: "Audit", r: "Statutory Audit Mandatory", c: "Only if Turnover > ₹40L or Contribution > ₹25L" },
                                        { f: "Due Date", r: "31st October", c: "31st July (No Audit) / 31st Oct (Audit)" },
                                        { f: "Forms", r: "ITR-6", c: "ITR-5" },
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

                    {/* TAX RATES TABLE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">Tax Rates (FY 2024-25)</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-[#043E52] text-white">
                                    <tr>
                                        <th className="p-4 font-semibold text-sm uppercase tracking-wider">Entity Type</th>
                                        <th className="p-4 font-semibold text-sm uppercase tracking-wider">Tax Rate</th>
                                        <th className="p-4 font-semibold text-sm uppercase tracking-wider">Conditions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-medium">Domestic Company</td>
                                        <td className="p-4 text-gray-600">25%</td>
                                        <td className="p-4 text-gray-600">Opting for Section 115BAA</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-medium">Domestic Company</td>
                                        <td className="p-4 text-gray-600">30%</td>
                                        <td className="p-4 text-gray-600">Turnover &gt; ₹400 Crores (Normal)</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-medium">Partnership Firm / LLP</td>
                                        <td className="p-4 text-gray-600">30%</td>
                                        <td className="p-4 text-gray-600">Flat Rate on Profits</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-medium">Foreign Company</td>
                                        <td className="p-4 text-gray-600">40%</td>
                                        <td className="p-4 text-gray-600">Plus Cess & Surcharge</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="p-4 bg-purple-50 text-purple-800 text-sm border-t border-purple-100 flex gap-2 items-center">
                                <TrendingUp size={16} /> <strong>Update:</strong> MAT rate for companies opting for Sec 115BAA is Nil (Not Applicable). For others, it is 15%.
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
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Building size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Entity Specialists</h4><p className="text-gray-300 text-sm">We have dedicated teams for Corporate Taxation and NGO/Trust compliance.</p></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><CheckCircle size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Forms Filing</h4><p className="text-gray-300 text-sm">We handle all associated forms (Form 29B, Form 10, Form 9A) required for companies/trusts.</p></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><FileText size={24} /></div>
                                    <div><h4 className="font-bold text-lg">ROC Sync</h4><p className="text-gray-300 text-sm">We ensure your Income Tax Return data matches with your ROC Annual Filing (AOC-4/MGT-7).</p></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Shield size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Scrutiny Handling</h4><p className="text-gray-300 text-sm">Corporate returns face higher scrutiny. Our experts provide end-to-end support.</p></div>
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
                                <FileText className="text-bronze" /> Key Documents
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">FINANCIALS</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Balance Sheet & P&L</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Audit Report (if applicable)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Previous Year ITR</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">OTHERS</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> DSC of Director/Partner</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> PAN of Entity</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Corporate Inquiry?</h4>
                            <p className="text-gray-300 text-sm mb-4">Need help with complex provisions?</p>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Users size={20} className="text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Talk to Expert</p>
                                    <p className="font-bold">+91 7639227019</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};
export default Itr567Page;
