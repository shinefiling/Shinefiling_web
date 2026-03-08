import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle, Lock, Shield, FileText, Scale, HelpCircle, Briefcase,
    BookOpen, Clock, Zap, ChevronRight, Star, ArrowRight, UserCheck, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '../../../components/auth/AuthModal';
import ApplyNDA from './ApplyNDA';

const NDA = ({ isLoggedIn }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [selectedPlan, setSelectedPlan] = useState('startup');

    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        if (isLoggedIn) {
            setShowRegisterModal(true);
        } else {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setShowRegisterModal(true);
            } else {
                setAuthMode('login');
                setShowAuthModal(true);
            }
        }
    };

    const faqs = [
        { q: "What is an NDA?", a: "A Non-Disclosure Agreement (NDA) is a legal contract that protects sensitive information from being shared." },
        { q: "Unilateral vs Mutual NDA?", a: "Unilateral protects one party's info; Mutual protects both parties sharing info (e.g., potential partnership)." },
        { q: "How long is it valid?", a: "Typically 2-5 years, but trade secrets can be protected indefinitely." },
        { q: "Does it cover everything?", a: "No, it generally excludes public information or info already known to the receiver." },
        { q: "Is it enforceable in court?", a: "Yes, a well-drafted NDA is legally binding and enforceable in Indian courts." },
        { q: "Can I protect my startup idea?", a: "Yes, an NDA prevents potential investors or partners from stealing your idea before you launch." },
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=2032"
                        alt="Confidentiality"
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
                        className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-cyan-600/20 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.15, 0.1],
                            x: [0, -50, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px]"
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
                                    <Lock size={12} className="fill-bronze" /> Data Protection
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Non-Disclosure <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Agreement (NDA)</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Protect your sensitive business information, trade secrets, and ideas. Essential for <strong>Startups</strong>, <strong>Employees</strong>, and <strong>Vendors</strong>.
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
                                        <Lock size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Secure</p>
                                        <p className="font-bold text-sm text-white">Your Idea</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Legal</p>
                                        <p className="font-bold text-sm text-white">Binding</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Draft Now
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <BookOpen size={18} /> Learn More
                                </button>
                            </div>
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
                                            <Lock size={28} className="text-bronze fill-bronze/20" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle size={14} className="text-green-500 fill-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">
                                        Non-Disclosure <br />Agreement
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Protect Your Ideas</p>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-slate-100 mb-5"></div>

                                {/* Stats Grid - COMPACT */}
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    {/* Left Stat */}
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Shield size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Safe</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">IP Protection <br />Assured</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>

                                    {/* Right Stat */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <FileText size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Legal</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Terms <br />Defined</p>
                                    </div>
                                </div>

                                {/* Check List - COMPACT */}
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "Confidentiality Scope",
                                        "Non-Compete Clause",
                                        "Penalty/Damages"
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
                                    View Plans & Apply <ArrowRight size={16} />
                                </button>

                                <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
                                    For employers, partners & vendors
                                </p>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>


            {/* --- PRICING SECTION --- */}
            <section id="pricing-plans" className="py-20 px-6 lg:px-12 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Safety Packages</span>
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
                            <h3 className="text-lg font-bold text-navy mb-2">Basic</h3>
                            <p className="text-slate-500 text-sm mb-6">Simple Unilateral NDA.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹499</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">₹800</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Standard Template",
                                    "Unilateral (One-way)",
                                    "Word Format",
                                    "Instant Download"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('basic')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Basic</button>
                        </motion.div>

                        {/* PLAN 2: STANDARD - POPULAR */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Most Popular</div>

                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Standard</h3>
                            <p className="text-gray-400 text-sm mb-6">Mutual / Employee NDA.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹999</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹1,500</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Lawyer Drafted",
                                    "Unilateral OR Mutual",
                                    "Non-Solicit Included",
                                    "Penalty Clauses",
                                    "IP Rights Guard"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Choose Standard</button>
                        </motion.div>

                        {/* PLAN 3: PREMIUM */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Premium / Custom</h3>
                            <p className="text-slate-500 text-sm mb-6">Complex Deals / M&A.</p>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy border-b-2 border-slate-100">₹2,499</span>
                                <span className="text-slate-400 line-through text-xs">₹4,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "IP Heavy Protection",
                                    "International Jurisdiction",
                                    "Detailed Exclusions",
                                    "Lawyer Consultation",
                                    "Conflict Management"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('premium')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Premium</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* EXTENSIVE CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT CONTENT COLUMN (8 Cols) */}
                <div id="details-section" className="lg:col-span-8 space-y-20">

                    {/* Intro Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Lock className="text-bronze" /> Protect Your Information
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                A <strong>Non-Disclosure Agreement (NDA)</strong> is the first line of defense for your business secrets. Whether you are pitching to investors, hiring key employees, or exploring a partnership, sharing information without an NDA puts your intellectual property at risk.
                            </p>
                            <p>
                                We draft robust, legally enforceable NDAs tailored to your specific situation, ensuring your trade secrets remain secret. Our agreements are designed to withstand scrutiny in Indian courts and provide you with strong remedies in case of a breach.
                            </p>
                        </div>
                    </section>

                    {/* Importance/Features Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Shield className="text-bronze" /> Why You Need an NDA
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Prevent Idea Theft", desc: "Legally stops others from stealing your business ideas." },
                                { title: "Safeguard Client Data", desc: "Protects your client lists and sensitive database." },
                                { title: "Secure Investments", desc: "Investors expect an NDA before deep-diving into your tech." },
                                { title: "Maintain Competitive Edge", desc: "Keeps your strategies hidden from competitors." },
                                { title: "Legal Recourse", desc: "Gives you the right to sue for damages if a leak occurs." },
                                { title: "Define Confidentiality", desc: "Clearly states what is 'secret' and what is 'public'." },
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-lg group">
                                    <div className="flex items-start gap-4">
                                        <CheckCircle size={24} className="text-green-500 shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-lg font-bold text-navy mb-1">{item.title}</h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Types of NDA Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Briefcase className="text-bronze" /> Types of NDAs We Draft
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Unilateral NDA", desc: "One-way protection. Used when only you are sharing info (e.g., with employees)." },
                                { title: "Mutual NDA", desc: "Two-way protection. Used when both parties share secrets (e.g., joint venture)." },
                                { title: "Employee NDA", desc: "Specific for employees to protect company data and trade secrets upon hiring." },
                                { title: "Investor NDA", desc: "Tailored for sharing pitch decks and financials with potential investors." },
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-lg hover:border-bronze/30 group">
                                    <div className="flex items-start gap-4">
                                        <Shield size={24} className="text-bronze shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-lg font-bold text-navy mb-1">{item.title}</h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Key Conditions Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Scale className="text-bronze" /> Key Conditions We Include
                        </h2>
                        <ul className="grid md:grid-cols-2 gap-4">
                            {[
                                "Clear Definition of Confidential Information",
                                "Exclusions (Public Knowledge)",
                                "Obligations of Receiving Party",
                                "Time Period of Confidentiality (e.g., 2-5 years)",
                                "Return or Destruction of Data Clause",
                                "Dispute Resolution & Jurisdiction",
                                "Non-Solicitation of Employees",
                                "Non-Circumvention Clause"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <div className="w-6 h-6 rounded-full bg-bronze/10 flex items-center justify-center">
                                        <CheckCircle size={14} className="text-bronze" />
                                    </div>
                                    <span className="text-navy font-medium text-sm">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Process Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Drafting Process</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Fill Request", days: "10 Mins", desc: "Provide details of the parties and the nature of information shared." },
                                { step: "Step 2", title: "Drafting", days: "2-4 Hours", desc: "Our legal experts draft the NDA based on your specific needs." },
                                { step: "Step 3", title: "Review", days: "Same Day", desc: "We send the draft for your review and make any necessary edits." },
                                { step: "Step 4", title: "Final Copy", days: "Instant", desc: "Receive the final clean copy ready for signature." }
                            ].map((item, i) => (
                                <div key={i} className="group flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-100 hover:border-bronze/30 hover:shadow-lg transition-all duration-300">
                                    <div className="flex-shrink-0 w-full md:w-32 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:bg-bronze/5 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-bronze font-bold flex items-center justify-center mb-2 shadow-sm">
                                            {i + 1}
                                        </div>
                                        <span className="text-navy font-bold text-sm">{item.days}</span>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-bronze transition-colors">
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
                                <FileText className="text-bronze" /> Information Needed
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Disclosing Party Details</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Receiving Party Details</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Purpose of Sharing</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Duration of Agreement</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need it fast?</h4>
                            <p className="text-gray-300 text-sm mb-4">We can deliver standard NDAs in under 24 hours.</p>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">View Plans <ArrowRight size={18} /></button>
                        </div>
                    </div>
                </div>

            </div>

            <AnimatePresence>
                {showRegisterModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2rem] w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl relative flex flex-col"
                        >
                            <ApplyNDA
                                isLoggedIn={isLoggedIn}
                                isModal={true}
                                planProp={selectedPlan}
                                onClose={() => setShowRegisterModal(false)}
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
                    setShowRegisterModal(true);
                }}
            />
        </div>
    );
};
export default NDA;


