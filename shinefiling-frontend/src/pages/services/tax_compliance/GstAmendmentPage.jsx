import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, ArrowRight, Shield, Users, Star, Globe, FileCheck, Check, X, Calendar, Zap, Clock, ShieldCheck, ChevronDown, Search, CreditCard, Layers, RefreshCw, Edit3, MapPin, FileText, HelpCircle, Banknote, Handshake
} from 'lucide-react';
import GstAmendmentRegistration from './GstAmendmentRegistration';

const GstAmendmentPage = ({ isLoggedIn }) => {
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('core');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is Core Field Amendment?", a: "Core fields include Legal Name of Business, Address of Principal Place of Business, and Addition/Deletion of Partners/Directors. These require officer approval." },
        { q: "What is Non-Core Field Amendment?", a: "Non-Core fields include Email, Mobile Number, Bank Details, etc. These get auto-approved instantly upon filing." },
        { q: "How long does it take for address change?", a: "Address change is a Core amendment. Once filed, the tax officer will verify the documents and approve it within 15 working days." },
        { q: "Can I change my PAN in GST?", a: "No, GSTIN is PAN-based. If your PAN changes (e.g., Proprietorship to Pvt Ltd), you need to apply for a NEW GST Registration, not an amendment." },
        { q: "Is physical verification done for address change?", a: "In some cases, if the officer deems it necessary, they may trigger a physical verification before approving a new address." }
    ];

    const handlePlanSelect = (plan) => {
        if (isLoggedIn) {
            setSelectedPlan(plan);
            setShowRegistrationModal(true);
        } else {
            const targetUrl = `/services/gst-amendment/register?plan=${plan}`;
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
                            <GstAmendmentRegistration
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
                        src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2070"
                        alt="Legal Documents"
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
                                    <Star size={12} className="fill-bronze" /> Profile Management
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    GST Amendment <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">& Correction Service</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Update business details instantly. Efficiently handle <strong className="text-white font-semibold">Legal Name</strong>, <strong className="text-white font-semibold">Address</strong>, and <strong className="text-white font-semibold">Director</strong> changes on the official GST portal.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fast Track</p>
                                        <p className="font-bold text-sm text-white">Non-Core Instant</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <FileCheck size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verified</p>
                                        <p className="font-bold text-sm text-white">Officer Approval</p>
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
                                    Modify GST Now
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Amendment Guide
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
                                            <Edit3 size={28} className="text-bronze" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle size={14} className="text-green-500" />
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">GST Amendment<br />Service</h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Core & Non-Core Updates</p>
                                </div>
                                <div className="h-px w-full bg-slate-100 mb-5"></div>
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Zap size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Instant</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Non-Core<br />Approval</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Shield size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">15 Days</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Core Field<br />Changes</p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "Name / Address Correction",
                                        "Director / Partner Changes",
                                        "Bank Details & Mobile Update"
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
                                    Modify GST Now <ArrowRight size={16} />
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
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Available Plans</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Expert Correction Plans</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Non-Core Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Non-Core Updates</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹499</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">INSTANT APPROVAL</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Email ID & Mobile Number Change",
                                    "Bank Account Details Addition",
                                    "Business Activity (HSN) Update",
                                    "Authorized Signatory Mapping",
                                    "Instant Portal Acknowledgement",
                                    "Priority Technical Support"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('non_core')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Start Updates</button>
                        </motion.div>

                        {/* Core Amendment Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Most Popular</div>
                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Gst Core Amendment</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹999</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹2,000</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                <li className="text-xs font-bold text-[#D9A55B] uppercase tracking-wider border-b border-white/10 pb-2">Full Core Modification +</li>
                                {[
                                    "Legal / Trade Name Change",
                                    "Principal Place Address Change",
                                    "Additional Place of Business",
                                    "Officer Approval Follow-up",
                                    "Document Drafting Support",
                                    "Updated GST Certificate Delivery"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('core')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Start Core Change</button>
                        </motion.div>

                        {/* Complex/Management Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Management Change</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy">₹1,499</span>
                                <span className="text-slate-400 line-through text-xs">₹3,000</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="text-xs font-bold text-navy uppercase tracking-wider border-b border-gray-100 pb-2">Stakeholder Updates +</li>
                                {[
                                    "Director Addition/Deletion",
                                    "Partner Composition Change",
                                    "Karta / Management Update",
                                    "Board Resolution Drafting",
                                    "Multiple Amendment Cycles",
                                    "Lifetime Compliance Records"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('complex')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Plan</button>
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
                            <h3 className="text-2xl font-bold text-navy mb-2">Verified Profile Management</h3>
                            <p className="text-slate-500 text-sm mb-4">Official GST Amendment service for Core and Non-Core changes. We ensure your business profile stays 100% compliant with professional document vetting.</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6">
                                <div className="flex items-center gap-2">
                                    <Handshake size={18} className="text-bronze" />
                                    <span className="text-navy font-bold text-sm">Seamless Online Flow</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={18} className="text-bronze" />
                                    <span className="text-navy font-bold text-sm">Full Legal Protection</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap size={18} className="text-bronze" />
                                    <span className="text-navy font-bold text-sm">Official ARN Receipt</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-auto">
                            <button
                                onClick={() => setShowRegistrationModal(true)}
                                className="w-full md:px-8 py-4 bg-navy hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                Start Modification <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Layers className="text-bronze" /> Core vs Non-Core Amendments
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                Understanding the type of amendment is crucial for managing your business timelines.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8 mt-10">
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-lg font-bold text-navy mb-4">Core Fields</h3>
                                    <p className="text-sm mb-4">Requires approval from the Jurisdiction Tax Officer.</p>
                                    <ul className="space-y-2 text-sm">
                                        <li>• Trade Name / Legal Name</li>
                                        <li>• Principal place of business</li>
                                        <li>• Addition of Partners/Directors</li>
                                    </ul>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-lg font-bold text-navy mb-4">Non-Core Fields</h3>
                                    <p className="text-sm mb-4">Updated instantly on the portal without manual verification.</p>
                                    <ul className="space-y-2 text-sm">
                                        <li>• Authorized Signatory details</li>
                                        <li>• Bank account addition</li>
                                        <li>• Business Activity (HSN) codes</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Professional Refinement Workflow</h2>
                        <div className="space-y-6">
                            {[
                                { title: "Document Vetting", desc: "We review your NOC, rent agreements, or board resolutions to ensure 0% rejection rate from tax officers." },
                                { title: "Portal Submission", desc: "Filing of Form REG-14 with high-security DSC/EVC authorization." },
                                { title: "Officer Liasioning", desc: "For core fields, we monitor the portal and respond to any 'Seek Clarification' notices issued by the officer." },
                                { title: "Certificate Download", desc: "Once approved, your updated REG-06 GST Registration Certificate is delivered to your dashboard." },
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
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Document Guide
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">FOR ADDRESS CHANGE</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> Rent Agreement & NOC</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> Electricity Bill</li>
                                    </ul>
                                </div>
                                <div className="bg-navy/5 p-4 rounded-xl border border-navy/10">
                                    <p className="text-xs text-navy font-bold leading-relaxed italic">“Non-compliance in updating address can lead to GST cancellation under Section 29.”</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden group">
                            <h4 className="font-bold text-lg mb-2">Notice Response?</h4>
                            <p className="text-gray-400 text-sm mb-4">Received a notice for profile mismatch? Our experts can help reply professionally.</p>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-500 border border-yellow-500/50 rounded-lg font-bold text-sm transition hover:bg-bronze hover:text-white">Chat Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GstAmendmentPage;
