
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, Globe, Briefcase, Award, ArrowRight, Rocket, X, User, Banknote, Handshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OnePersonCompanyRegistration from './OnePersonCompanyRegistration';
import AuthModal from '../../../components/auth/AuthModal';

const OpcPage = ({ isLoggedIn, onLogout }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [selectedPlan, setSelectedPlan] = useState('startup');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const scrollToPlans = () => {
        const section = document.getElementById('pricing-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const faqs = [
        { q: "What is difference between OPC and Sole Proprietorship?", a: "The main difference is Liability. In Proprietorship, liability is unlimited (personal assets risk). In OPC, liability is LIMITED to company assets. Also, OPC is a separate legal entity." },
        { q: "Who can be a Nominee?", a: "Nominee must be an Indian Citizen, Resident in India, and not a minor. A person can be a nominee in only one OPC at a time." },
        { q: "Can I convert OPC to Pvt Ltd later?", a: "Yes! Can convert voluntarily after 2 years. Mandatory if paid-up capital > ₹50 Lakhs OR turnover > ₹2 Crores." },
        { q: "Is Audit mandatory?", a: "Yes. Like Pvt Ltd, an OPC must get accounts audited by a CA every year and file AOC-4 and MGT-7." },
        { q: "Can I raise VC funding?", a: "VCs prefer Pvt Ltd with multiple shareholders. However, you can convert OPC to Pvt Ltd to accept funding." },
        { q: "What if the Director dies?", a: "The Nominee automatically becomes the sole member and appoints a new nominee within 15 days, ensuring perpetual succession." }
    ];

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        if (isLoggedIn) {
            setShowRegisterModal(true);
        } else {
            setAuthMode('login');
            setShowAuthModal(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2070"
                        alt="Corporate Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/80 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
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
                                    <Star size={12} className="fill-bronze" /> India's #1 Registration Platform
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    One Person Company <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">(OPC) Registration</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    The perfect start for the solo entrepreneur. Get <strong className="text-white font-semibold">Limited Liability Policy</strong> with <strong className="text-white font-semibold">100% Control</strong> over your business.
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
                                        <p className="font-bold text-sm text-white">7-10 Days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Star size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Google Rating</p>
                                        <p className="font-bold text-sm text-white">4.9/5 Stars</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                            >
                                <button onClick={scrollToPlans} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Register OPC Now
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Learn More
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
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">One Person Company</p>
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
                                        "Everything in Startup",
                                        "Nominee Consent Filing",
                                        "Digital Share Certificates"
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
                                    onClick={scrollToPlans}
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

            {/* --- PRICING SECTION (3 PLANS) --- */}
            <section id="pricing-section" className="py-20 px-6 lg:px-12 bg-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Solo Entrepreneurship</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">OPC Registration Plans</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* PLAN 1: BASIC */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Startup</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹4,999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">₹8,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                {[
                                    "1 Digital Signature (DSC)",
                                    "1 Director PIN (DIN)",
                                    "Name Approval Application",
                                    "MOA & AOA Drafting",
                                    "Certificate of Incorporation",
                                    "PAN & TAN Allocation",
                                    "Nominee Consent Filing (INC-3)"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('startup')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">
                                Choose Startup
                            </button>
                        </motion.div>

                        {/* PLAN 2: STANDARD (POPULAR) */}
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
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹9,999</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹15,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                <li className="text-xs font-bold text-[#D9A55B] uppercase tracking-wider border-b border-white/10 pb-2">Everything in Startup +</li>
                                {[
                                    "GST Registration",
                                    "MSME (Udyam) Registration",
                                    "Share Certificates Issue",
                                    "Bank Account Opening Support",
                                    "Auditor Appointment (ADT-1)"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">
                                Choose Standard
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
                            <h3 className="text-lg font-bold text-navy mb-2">Premium</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy">₹19,999</span>
                                <span className="text-slate-400 line-through text-xs">₹30,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                <li className="text-xs font-bold text-navy uppercase tracking-wider border-b border-gray-100 pb-2">Everything in Standard +</li>
                                {[
                                    "1st Year ROC Compliance (AOC-4, MGT-7)",
                                    "DIR-3 KYC for Director",
                                    "Commencement of Business (INC-20A)",
                                    "Income Tax Filing (1 Year)",
                                    "Trademark Filing (1 Class)"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('premium')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">
                                Choose Premium
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT CONTENT COLUMN (8 Cols) */}
                <div id="details-section" className="lg:col-span-8 space-y-20">

                    {/* Introduction - Expanded for SEO */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Building className="text-bronze" /> What is an One Person Company (OPC)?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                An <strong>One Person Company (OPC)</strong> is a revolutionary business structure introduced by the <strong>Companies Act, 2013</strong> that allows a single entrepreneur to operate a corporate entity with Limited Liability protection. It combines the benefits of a Sole Proprietorship (full control) with the legal standing of a Private Limited Company (corporate status).
                            </p>
                            <p>
                                Unlike a Proprietorship, the OPC is a <strong>separate legal entity</strong> from its owner. This means your personal assets (house, car, savings) are safe even if the business faces losses or debts. It requires only one member (shareholder) and one nominee (who takes over in case of death/incapacity).
                            </p>
                            <p>
                                With ShineFiling, registering an OPC is seamless. We handle everything from Digital Signature (DSC) to Nominee Consent (Form INC-3) and final Incorporation. It is the perfect starting point for solo founders looking to build a scalable and legally secure business.
                            </p>
                        </div>
                    </section>

                    {/* 6 KEY BENEFITS GRID */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Key Benefits of OPC</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Limited Liability Protection", desc: "Your personal assets (home, car) are safe. Liability is limited only to the unpaid share capital of the company, protecting you from business losses.", icon: Shield },
                                { title: "Complete Control", desc: "You are the single director and shareholder. You have 100% control over decision making with no interference from other partners.", icon: User },
                                { title: "Separate Legal Entity", desc: "The OPC is a separate legal person from its owner. It can own property, incur debts, and sue or be sued in its own name.", icon: Briefcase },
                                { title: "Perpetual Succession", desc: "The company lives on through the Nominee even in the event of death or incapacity of the member, ensuring business continuity.", icon: Clock },
                                { title: "Easy Banking & Funding", desc: "Banks and Financial Institutions prefer OPCs over Proprietorships for loans and credits due to its corporate structure.", icon: Building },
                                { title: "Brand Protection", desc: "Your company name is protected by the ROC. No one else can use it throughout India, unlike a proprietorship.", icon: Award },
                            ].map((benefit, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-bronze/30 transition group">
                                    <div className="w-14 h-14 rounded-2xl bg-bronze/10 flex items-center justify-center text-bronze flex-shrink-0 transition-all duration-300">
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

                    {/* WHO SHOULD REGISTER SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">Who Should Register an OPC?</h2>
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="mb-6 text-gray-600">Ideal for solopreneurs in:</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                                {[
                                    "Consulting Services", "IT & Software Dev", "E-commerce Sellers",
                                    "Freelancers", "Marketing Agencies", "Export/Import",
                                    "Content Creators", "Designers", "Traders"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle size={18} className="text-bronze flex-shrink-0" />
                                        <span className="font-medium text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* DETAILED COMPARISON TABLE */}
                    <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-[#2B3446] p-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Scale size={20} className="text-bronze" /> OPC vs Proprietorship
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#2B3446]/5 text-navy">
                                    <tr>
                                        <th className="px-6 py-4">Feature</th>
                                        <th className="px-6 py-4 bg-beige/10 border-b-2 border-yellow-500">OPC</th>
                                        <th className="px-6 py-4">Proprietorship</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Liability Shield</td><td className="px-6 py-4 text-slate font-bold bg-beige/10 text-green-600">LIMITED</td><td className="px-6 py-4 text-red-500 font-bold">UNLIMITED</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Legal Status</td><td className="px-6 py-4 text-slate font-bold bg-beige/10">Separate Entity</td><td className="px-6 py-4 text-slate-500">Not Separate</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Taxation</td><td className="px-6 py-4 text-slate font-bold bg-beige/10">30% (Flat)</td><td className="px-6 py-4 text-slate font-bold">Slab Rates</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Registration</td><td className="px-6 py-4 text-slate font-bold bg-beige/10">Central (MCA)</td><td className="px-6 py-4 text-slate-500">Local (Shop Act/GST)</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Succession</td><td className="px-6 py-4 text-slate font-bold bg-beige/10">Nominee</td><td className="px-6 py-4 text-slate-500">Difficult</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* DETAILED PROCESS SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Registration Process</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "DSC & Name Reservation", days: "Day 1-2", desc: "We apply for Digital Signature Certificate (DSC) for the director and submit a name reservation request (RUN) to the MCA." },
                                { step: "Step 2", title: "Incorporation & Nominee", days: "Day 3-5", desc: "We draft MOA, AOA, and Nominee Consent (Form INC-3) and file the SPICe+ incorporation forms with the ROC." },
                                { step: "Step 3", title: "Certificate Issue", days: "Day 6-8", desc: "The ROC approves the forms and issues the Certificate of Incorporation (COI), along with PAN, TAN, and DIN." },
                                { step: "Step 4", title: "Bank & Compliance", days: "Post-Reg", desc: "We assist you in opening a current bank account and guide you on the mandatory auditor appointment." }
                            ].map((item, i) => (
                                <div key={i} className="group flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-100 hover:border-bronze/30 hover:shadow-lg transition-all duration-300">
                                    <div className="flex-shrink-0 w-full md:w-32 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:bg-bronze/5 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-bronze font-bold flex items-center justify-center mb-2 shadow-sm">
                                            {i + 1}
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</span>
                                        <span className="text-navy font-bold text-sm">{item.days}</span>
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



                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Important Post-Incorporation Compliances</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { title: "Auditor Appointment (ADT-1)", desc: "Must be filed within 30 days of incorporation to appoint the first auditor." },
                                { title: "Commencement of Business (INC-20A)", desc: "Mandatory filing within 180 days after opening a bank account and depositing share capital." },
                                { title: "Annual Filing (AOC-4 & MGT-7)", desc: "Yearly submission of financial statements and annual returns to the ROC." },
                                { title: "Income Tax Filing (ITR-6)", desc: "Company must file its income tax return annually before the due date." }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-red-50 text-red-600 p-3 rounded-lg shrink-0"><FileText size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-navy text-sm mb-1">{item.title}</h4>
                                            <p className="text-xs text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Why Choose ShineFiling?</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { title: "100% Online Process", icon: Globe },
                                { title: "Expert Nominee Guidance", icon: Users },
                                { title: "Bank-Grade Security", icon: Shield },
                                { title: "No Hidden Costs", icon: Banknote }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                                    <div className="w-14 h-14 mx-auto bg-navy/5 rounded-full flex items-center justify-center text-navy mb-4 group-hover:bg-navy group-hover:text-white transition-colors">
                                        <item.icon size={28} />
                                    </div>
                                    <h4 className="font-bold text-navy text-sm">{item.title}</h4>
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
                                <FileText className="text-bronze" /> Required Documents
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Director & Nominee</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> PAN Card, Aadhaar Card</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Passport Photo (Both)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Bank Statement/Utility Bill (Not older than 2 months)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Registered Office</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Electricity Bill / Water Bill</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Rent Agreement (if rented)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> NOC from Owner (Mandatory)</li>
                                    </ul>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition">View Plans <ArrowRight size={18} /></button>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg text-bronze mb-2">Need Help?</h4>
                            <p className="text-gray-300 text-sm mb-4">Our experts are available 24/7 to guide you through the process.</p>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Users size={20} className="text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Chat Support</p>
                                    <p className="font-bold text-white">+91 7639227019</p>
                                </div>
                            </div>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">WhatsApp Now</button>
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
                                <OnePersonCompanyRegistration
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
        </div >
    );
};

export default OpcPage;


