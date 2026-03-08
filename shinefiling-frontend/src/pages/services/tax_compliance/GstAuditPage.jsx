import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, ArrowRight, X, Search, Globe, Award, Layers, Banknote, Handshake, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GstAuditRegistration from './GstAuditRegistration';

const GstAuditPage = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('reconciliation');

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "Is GST Audit by CA mandatory?", a: "No, CA Certification for GSTR-9C is removed. It is now self-certified by the taxpayer." },
        { q: "What is GSTR-9C?", a: "It is a Reconciliation Statement reconciling the values declared in GST Returns with the Audited Financial Statements." },
        { q: "When is GSTR-9C applicable?", a: "If your Aggregate Turnover during the financial year exceeds ₹5 Crores." },
        { q: "What is Department Audit?", a: "The GST Department can conduct an audit of your records under Section 65. We provide assistance in replying to such audit queries." }
    ];

    const handlePlanSelect = (plan) => {
        if (isLoggedIn) {
            setSelectedPlan(plan);
            setShowRegistrationModal(true);
        } else {
            const targetUrl = `/services/gst-audit/register?plan=${plan}`;
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
                            <GstAuditRegistration
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
                        src="https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=2070"
                        className="w-full h-full object-cover"
                        alt="Audit"
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
                                    <Shield size={12} className="text-bronze" /> Reconciliation & Audit Assistance
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    GST Audit & <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">GSTR-9C Reconciliation</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Detailed <strong className="text-white font-semibold">GSTR-9C Reconciliation</strong>. Sync your books with official GST records and defend against <strong className="text-white font-semibold">Departmental Scrutiny</strong>.
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
                                        <TrendingUp size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Quality</p>
                                        <p className="font-bold text-sm text-white">100% Accuracy</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Award size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Protection</p>
                                        <p className="font-bold text-sm text-white">Audit Defended</p>
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
                                    File GSTR-9C Now
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Audit Guide
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
                                            <Search size={28} className="text-bronze" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle size={14} className="text-green-500" />
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">GST Audit<br />GSTR-9C</h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Reconciliation & Audit</p>
                                </div>
                                <div className="h-px w-full bg-slate-100 mb-5"></div>
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <TrendingUp size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">100%</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Filing<br />Accuracy</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <ShieldCheck size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Expert</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Audit<br />Defended</p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "GSTR-9C Self-Certification",
                                        "Books vs Returns Reconciliation",
                                        "Dept. Audit Notice Assistance"
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
                                    File GSTR-9C Now <ArrowRight size={16} />
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
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Professional Review</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Expert Audit Plans</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Compliance Health */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Compliance Health</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹2,999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">HEALTH CHECK</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                {[
                                    "Pre-Audit Simulation Study",
                                    "Spot Inconsistency Check",
                                    "ITC Reversal Analysis",
                                    "System Gap Identification",
                                    "Corrective Action Report",
                                    "Expert Video Consultation"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('reconciliation')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Health</button>
                        </motion.div>

                        {/* Standard Audit Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Most Popular</div>
                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Full GST Audit</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹5,999</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹10,000</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                <li className="text-xs font-bold text-[#D9A55B] uppercase tracking-wider border-b border-white/10 pb-2">Full Reconciliation +</li>
                                {[
                                    "Books vs GST Portal Recon",
                                    "Turnover Matching (P&L vs GST)",
                                    "Rate-wise Tax Reconciliation",
                                    "Self-Certification Portal Entry",
                                    "GSTR-9C JSON Generation",
                                    "Dedicated Tax Strategist"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('audit_report')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Start Audit</button>
                        </motion.div>

                        {/* Audit Shield Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Audit Shield</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy">₹9,999</span>
                                <span className="text-slate-400 line-through text-xs">₹15,000</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                <li className="text-xs font-bold text-navy uppercase tracking-wider border-b border-gray-100 pb-2">Full Audit + Notice Support +</li>
                                {[
                                    "ADT-01 Notice Briefing",
                                    "Department Officer Meeting",
                                    "Adjudication Representation",
                                    "Evidence Compilation Support",
                                    "Priority Legal Review",
                                    "Post-Audit Compliance Path"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('departmental')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Shield</button>
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
                            <h3 className="text-2xl font-bold text-navy mb-2">Statutory Audit Assurance</h3>
                            <p className="text-slate-500 text-sm mb-4">Expert reconciliation of GSTR-2B with your purchase logs to ensure 100% legitimate ITC claims and turnover accuracy.</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6">
                                <div className="flex items-center gap-2">
                                    <Handshake size={18} className="text-bronze" />
                                    <span className="text-navy font-bold text-sm">100% Verified Flow</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={18} className="text-bronze" />
                                    <span className="text-navy font-bold text-sm">Legal Protection Shield</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap size={18} className="text-bronze" />
                                    <span className="text-navy font-bold text-sm">Official ARN Generation</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-auto">
                            <button
                                onClick={() => setShowRegistrationModal(true)}
                                className="w-full md:px-8 py-4 bg-navy hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                Start Audit <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Scale className="text-bronze" /> Why is GST Audit Critical?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                A <strong>GST Audit</strong> (Section 65) or <strong>GSTR-9C Reconciliation</strong> is the process where the government verifies if your self-assessed tax payments are correct.
                            </p>
                            <p>
                                With the removal of CA mandatory certification, the burden of proof has shifted entirely to the taxpayer. ShineFiling provides the technical expertise to reconcile thousands of invoices against portal data to ensure you never face a demand order.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8 mt-10">
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-lg font-bold text-navy mb-4">Internal Health Check</h3>
                                    <p className="text-sm">
                                        We perform a dummy audit before the department notice arrives, helping you pay differential tax with <strong>voluntary disclosure</strong> to avoid 100% penalties.
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-lg font-bold text-navy mb-4">Official Documentation</h3>
                                    <p className="text-sm">
                                        Proper GSTR-9C filing with detailed auditor remarks reduces the chances of your case being picked for <strong>Risk-Based Scrutiny</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Professional Audit Workflow</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Information Gathering", desc: "We collect your Trial Balance, GSTR-1, GSTR-3B, and Purchase Register for the entire financial year." },
                                { step: "Step 2", title: "Automated Reconciliation", desc: "Our proprietary tool flags every single mismatch in tax rates, HSN codes, and ITC availability across all months." },
                                { step: "Step 3", title: "Gap Resolution", desc: "We provide advice on how to handle mismatches (reclaim ITC in next year, pay tax via DRC-03, etc.) to minimize liability." },
                                { step: "Step 4", title: "Final Certification", desc: "Preparation of GSTR-9C and assisted filing on the GST Portal with self-certification verification." },
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
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Data Checklist
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">AUDIT ESSENTIALS</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> Audited Financials</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> Filed GSTR-9 Summary</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> ITC Matching Report</li>
                                    </ul>
                                </div>
                                <div className="bg-navy/5 p-4 rounded-xl border border-navy/10">
                                    <p className="text-xs text-navy font-bold italic">“Accurate GSTR-9C filing reduces search & seizure risk by 85%.”</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Audit Concierge</h4>
                            <p className="text-gray-300 text-sm mb-4">Direct access to CAs for department notice handling and audit representation.</p>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Users size={20} className="text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Consult Now</p>
                                    <p className="font-bold">080-FILE-SHINE</p>
                                </div>
                            </div>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 border border-yellow-500/50 rounded-lg font-bold text-sm">Book Consultation</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GstAuditPage;
