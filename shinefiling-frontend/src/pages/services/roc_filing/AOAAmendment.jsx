import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, BookOpen, Scale, Globe, Briefcase, Award, ArrowRight, Rocket, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AOAAmendmentRegistration from './AOAAmendmentRegistration';
import AuthModal from '../../../components/auth/AuthModal';

const AOAAmendmentPage = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('standard');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "When is AOA amendment needed?", a: "To change internal rules like share transfer restrictions, board meeting procedures, or adoption of new Tables (F) under Companies Act, 2013." },
        { q: "Is Shareholder approval mandatory?", a: "Yes. Alteration of AOA requires a Special Resolution passed by 75% majority of shareholders in an EGM." },
        { q: "What form is filed?", a: "Form MGT-14 is mandatory. It must be filed with the ROC within 30 days of passing the Special Resolution, along with the altered AOA." },
        { q: "Can we restrict share transfer?", a: "Yes, Private Limited Companies can restrict (but not ban) share transfers through AOA clauses." },
        { q: "Time required?", a: "Typically 3-5 working days for MGT-14 approval after the EGM is conducted." },
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
                            <AOAAmendmentRegistration
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
                        src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=2070"
                        alt="Legal Documents"
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
                                    <Scale size={12} className="fill-bronze" /> Internal Regulations
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    AOA <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Amendment</span>
                                </h1>
                                <p className="text-gray-300 text-xl max-w-xl font-light leading-relaxed">
                                    Update your Articles of Association. Whether it's adopting Table F, changing share transfer rules, or updating board powers, we handle the drafting and compliance.
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
                                        <FileText size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Form</p>
                                        <p className="font-bold text-sm text-white">MGT-14</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Award size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Drafting</p>
                                        <p className="font-bold text-sm text-white">Legal</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Modify AOA
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
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">MGT-14 <br />Filing</p>
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
                                        "Drafting Special Resolution",
                                        "Altered AOA Drafting",
                                        "MGT-14 Filing"
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
                        {/* Consultation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Advisory</h3>
                            <p className="text-slate-500 text-sm mb-6">Expert Procedural Review.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">CONSULTATION</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                {[
                                    "Clause Feasibility Review",
                                    "Legal Drafting Advice",
                                    "Board Procedure Check",
                                    "Restriction Analysis"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('consultation')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Advisory</button>
                        </motion.div>

                        {/* Standard - Most Common */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Recommended</div>

                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Clause Update</h3>
                            <p className="text-gray-400 text-sm mb-6">Modify Specific Rules.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹2,999</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase bg-white/10 px-2 py-1 rounded">MOST POPULAR</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                {[
                                    "Specific Clause Redrafting",
                                    "Special Resolution Prep",
                                    "MGT-14 Filing Service",
                                    "Altered AOA PDF Copy",
                                    "Register Update Aid"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Select Standard</button>
                        </motion.div>

                        {/* Premium */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">New Adoption</h3>
                            <p className="text-slate-500 text-sm mb-6">Adopt New Table F.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹3,999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">+ GOVT FEES</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                {[
                                    "Adoption of Table F/G",
                                    "Full Legal Vetting",
                                    "Shareholder EGM Hold",
                                    "MGT-14 Priority Filing",
                                    "Certified AOA Set"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('premium')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Premium</button>
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
                            <h2 className="text-3xl font-bold text-navy mb-8 border-b pb-4">Comprehensive Guide to AOA Amendments</h2>

                            <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">

                                {/* Introduction */}
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                        <BookOpen className="text-bronze" /> Importance of AOA
                                    </h3>
                                    <p className="lead text-xl text-gray-800 font-medium">
                                        The Articles of Association (AOA) contains the internal regulations and bye-laws for the management of the company. It defines the relationship between the company and its members.
                                    </p>
                                    <p>
                                        It governs key aspects like share transfers, general meetings, voting rights, and appointment of directors.
                                    </p>
                                </div>

                                {/* Clauses */}
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4">Clauses You Might Change</h3>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        {[
                                            { title: "Share Transfer", desc: "Restrictions on transfer of shares (Pre-emption rights).", icon: TrendingUp },
                                            { title: "Board Meetings", desc: "Quorum and notice period for board meetings.", icon: Users },
                                            { title: "General Meetings", desc: "Rules for conducting AGM/EGM and voting.", icon: Briefcase },
                                            { title: "Directors", desc: "Power to appoint Additional/Alternate Directors.", icon: Award },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="w-10 h-10 rounded-lg bg-navy/5 text-navy flex items-center justify-center">
                                                        <item.icon size={20} />
                                                    </div>
                                                    <h3 className="font-bold text-navy text-lg">{item.title}</h3>
                                                </div>
                                                <p className="text-sm text-gray-600">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Binding Force */}
                                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
                                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                                        <Shield size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-navy mb-2">Binding Force</h3>
                                        <p className="text-gray-700 leading-relaxed max-w-2xl">
                                            The AOA creates a binding contract between:
                                        </p>
                                        <ul className="mt-4 space-y-2">
                                            <li className="flex items-center gap-2 text-indigo-800 font-bold">
                                                <CheckCircle size={16} /> Company and its Members.
                                            </li>
                                            <li className="flex items-center gap-2 text-indigo-800 font-bold">
                                                <CheckCircle size={16} /> Members and Members (inter-se).
                                            </li>
                                        </ul>
                                        <p className="text-sm text-gray-600 mt-4">Any act done beyond the AOA is irregular but can be ratified by shareholders (unlike Ultra Vires MOA).</p>
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
                                <p className="text-sm opacity-80">Legal proof of your amended articles.</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[
                                    { name: "Altered AOA", type: "Draft", due: "Day 2" },
                                    { name: "MGT-14 Receipt", type: "Filing Proof", due: "Day 3" },
                                    { name: "Notice of EGM", type: "Draft", due: "Day 1" },
                                    { name: "Special Resolution", type: "Legal Doc", due: "Day 1" },
                                    { name: "Explanatory Statement", type: "Legal Doc", due: "Day 1" }
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

                        <h2 className="text-3xl font-bold mb-6 relative z-10">Why Choose ShineFiling for AOA Amendments?</h2>
                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <BookOpen size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Custom Legal Drafting</h4>
                                        <p className="text-gray-300 text-sm">We draft precise clauses (e.g., share transfer restrictions) tailored to your private limited company needs.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Detailed Vetting</h4>
                                        <p className="text-gray-300 text-sm">We ensure your new articles are consistent with the Companies Act, 2013 to avoid future disputes.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Scale size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Complete Compliance</h4>
                                        <p className="text-gray-300 text-sm">We handle everything: EGM documentation, Special Resolution, Explanatory Statement, and MGT-14 filing.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Fast Turnaround</h4>
                                        <p className="text-gray-300 text-sm">Get your AOA altered and updated records in as little as 3-5 working days.</p>
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
                                <FileText className="text-bronze" /> Documents Needed
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">For Drafting</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Proposed New Clauses</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Existing MOA/AOA Copy</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> DSC of Directors</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Guidance?</h4>
                            <p className="text-gray-300 text-sm mb-4">Not sure how to draft legal clauses?</p>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">
                                Talk to Lawyer
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AOAAmendmentPage;
