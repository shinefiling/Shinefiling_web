
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, Globe, Briefcase, Award, ArrowRight, Rocket, X, Handshake, Banknote, Landmark, FileCheck, PieChart, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PartnershipRegistration from './PartnershipRegistration';
import AuthModal from '../../../components/auth/AuthModal';

const PartnershipPage = ({ isLoggedIn, onLogout }) => {
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
        { q: "Is registration of a Partnership Firm mandatory?", a: "Under the Indian Partnership Act, 1932, registration is not mandatory. However, an unregistered firm cannot sue third parties or its own partners to enforce contractual rights, making registration highly recommended." },
        { q: "What is a Partnership Deed?", a: "It is a legal document that contains the terms and conditions of the partnership, including profit sharing, capital contribution, and roles of each partner." },
        { q: "How many partners are required?", a: "Minimum 2 and maximum 50 (as per Companies Act 2013) partners are allowed." },
        { q: "Who can be a partner?", a: "Any person who is of sound mind, not a minor (as a full partner), and not insolvent can be a partner." },
        { q: "Can a minor be a partner?", a: "A minor can be admitted to the 'benefits' of a partnership with the consent of all other partners, but they are not personally liable for losses." },
        { q: "What is the liability of partners?", a: "Partners have unlimited joint and several liability. This means personal assets can be used to pay off firm debts." }
    ];

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        if (isLoggedIn) {
            setShowRegisterModal(true);
        } else {
            // Check if user is logged in via localStorage as a fallback
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setShowRegisterModal(true);
            } else {
                setAuthMode('login');
                setShowAuthModal(true);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1573497161161-c3e73707e25c?auto=format&fit=crop&q=80&w=2070"
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
                                    <Users size={12} className="fill-bronze" /> Established Legal Framework
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Partnership Firm <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Registration</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    The classic way to build together. <strong className="text-white font-semibold">Simple Structure</strong> with <strong className="text-white font-semibold">Shared Growth</strong>. Ideal for family businesses and small teams.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time</p>
                                        <p className="font-bold text-sm text-white">5-7 Days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Handshake size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Type</p>
                                        <p className="font-bold text-sm text-white">Joint Venture</p>
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
                                    Draft Deed Now
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
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Partnership</p>
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
                                        "Professional Deed Drafting",
                                        "Registrar (ROF) Filing",
                                        "Firm Registration Certificate"
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
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Joint Enterprise Solutions</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Partnership Plans</h2>
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
                            <h3 className="text-lg font-bold text-navy mb-2">Lite</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹2,999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">₹6,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Custom Deed Drafting",
                                    "PAN Card Application",
                                    "Initial Legal Consulting",
                                    "Affidavit Preparation",
                                    "Bank Account Advisory"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                                <li className="flex items-center gap-3 text-sm text-slate-400">
                                    <X size={14} className="shrink-0" /> Registrar Filing (ROF)
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-400">
                                    <X size={14} className="shrink-0" /> GST Registration
                                </li>
                            </ul>
                            <button onClick={() => handlePlanSelect('basic')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">
                                Choose Lite
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

                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Partnership</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹5,999</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹12,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                <li className="text-xs font-bold text-[#D9A55B] uppercase tracking-wider border-b border-white/10 pb-2">Everything in Lite Plan +</li>
                                {[
                                    "Registrar of Firms (ROF) Filing",
                                    "Partnership Registration Certificate",
                                    "TAN Generation",
                                    "GST Registration (Optional)",
                                    "Priority Expert Support"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">
                                Get Started
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
                            <h3 className="text-lg font-bold text-navy mb-2">Complete</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy">₹8,999</span>
                                <span className="text-slate-400 line-through text-xs">₹18,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="text-xs font-bold text-navy uppercase tracking-wider border-b border-gray-100 pb-2">Everything in Classic +</li>
                                {[
                                    "GST Registration",
                                    "MSME/Udyam Registration",
                                    "Shop & Establishment",
                                    "Logo & Invoice Design",
                                    "Zero Balance Current A/c"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('premium')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">
                                Choose Complete
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
                            <Building className="text-bronze" /> Understanding Partnership Firm
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                A <strong>Partnership Firm</strong> is one of the most trusted and traditional forms of business organization in India, governed by the <strong>Indian Partnership Act, 1932</strong>. It is formed when two or more individuals (Partners) come together to carry on a business and share its profits and losses.
                            </p>
                            <p>
                                The foundation of this entity is the <strong>Partnership Deed</strong>—a legal agreement that clearly defines the roles, responsibilities, capital contributions, and profit-sharing ratios of each partner. Registration of the firm with the Registrar of Firms (ROF) is optional but highly recommended to enjoy legal rights such as the ability to sue third parties.
                            </p>
                            <p>
                                ShineFiling specializes in drafting comprehensive Partnership Deeds and handling the end-to-end registration process. Whether you are starting a family business or a small trading unit, we ensure your partnership is legally sound and ready for operation in less than a week.
                            </p>
                        </div>
                    </section>

                    {/* 6 KEY BENEFITS GRID */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Why Choose Partnership?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Minimal Compliance", desc: "No need for annual filings with MCA. Only Income Tax Return needs to be filed.", icon: Zap },
                                { title: "Cost Effective", desc: "Low cost of formation and dissolution compared to LLP or Pvt Ltd Company.", icon: TrendingUp },
                                { title: "Shared Responsibility", desc: "Workload, risks, and financial burden are shared among partners.", icon: Handshake },
                                { title: "Flexibility", desc: "Partners can decide how to operate, share profits, and manage capital through the Deed.", icon: Scale },
                                { title: "No Audit Burden", desc: "Audit is not mandatory for smaller firms unless turnover exceeds tax audit limits.", icon: Shield },
                                { title: "Easy Fund Raising", desc: "Banks lend easily to registered firms compared to unregistered ones.", icon: Briefcase },
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

                    {/* WHO SHOULD REGISTER SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">Ideal For</h2>
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="mb-6 text-gray-600">Perfect structure for:</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                                {[
                                    "Family Businesses", "Small Traders", "Retail Shops",
                                    "Home Businesses", "Small Service Agencies", "Contracting Firms",
                                    "Real Estate Brokers", "Bakeries & Cafes", "Co-Founders"
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
                                <Scale size={20} className="text-bronze" /> Partnership vs Other Forms
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#2B3446]/5 text-navy">
                                    <tr>
                                        <th className="px-6 py-4">Feature</th>
                                        <th className="px-6 py-4 bg-beige/10 border-b-2 border-yellow-500">Partnership Firm</th>
                                        <th className="px-6 py-4">LLP</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Liability</td><td className="px-6 py-4 text-slate font-bold bg-beige/10 text-red-500">Unlimited (Joint)</td><td className="px-6 py-4 text-green-600 font-bold">Limited</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Registration</td><td className="px-6 py-4 text-slate font-bold bg-beige/10">Registrar of Firms</td><td className="px-6 py-4 text-slate-500">MCA</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Compliance</td><td className="px-6 py-4 text-slate font-bold bg-beige/10 text-green-600">Low</td><td className="px-6 py-4 text-orange-500">Medium</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Foreign FDI</td><td className="px-6 py-4 text-slate font-bold bg-beige/10 text-red-500">Not Allowed</td><td className="px-6 py-4 text-green-500">Allowed</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Separate Entity</td><td className="px-6 py-4 text-slate font-bold bg-beige/10 text-red-500">No</td><td className="px-6 py-4 text-green-600">Yes</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* DETAILED PROCESS SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Registration Roadmap</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Name & Deed", days: "Day 1-2", desc: "Selection of a unique name and drafting of the Partnership Deed on Stamp Paper." },
                                { step: "Step 2", title: "Notarization", days: "Day 3", desc: "The deed is signed by all partners and notarized by a Public Notary." },
                                { step: "Step 3", title: "PAN & TAN", days: "Day 4-5", desc: "Application for PAN card and TAN number of the Firm." },
                                { step: "Step 4", title: "ROF Filing", days: "Day 6+", desc: "Submission of application to Registrar of Firms (ROF) for official registration certificate (Optional but Recommended)." }
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


                    {/* WHY CHOOSE SHINEFILING - NEW SEO SECTION */}
                    <section className="bg-gradient-to-br from-[#043E52] to-[#022c3b] p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
                        {/* Background Deco */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-bronze/10 rounded-full blur-3xl"></div>

                        <h2 className="text-3xl font-bold mb-6 relative z-10 text-white">Why Choose ShineFiling for Partnership?</h2>
                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-[#F8F9FA]">Custom Deed Drafting</h4>
                                        <p className="text-gray-300 text-sm">We draft Deeds that protect your interests, covering dispute resolution and exit clauses.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-[#F8F9FA]">Online ROF Process</h4>
                                        <p className="text-gray-300 text-sm">We handle the coordination with the Registrar of Firms, minimizing your visits to govt offices.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-[#F8F9FA]">Tax Consultation</h4>
                                        <p className="text-gray-300 text-sm">Get expert advice on tax implications of partnership salaries and interest on capital.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-[#F8F9FA]">Business Setup Support</h4>
                                        <p className="text-gray-300 text-sm">We assist with GST, Shop & Establishment, and Udyam Registration post-incorporation.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* POST INCORPORATION COMPLIANCE - NEW SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">What's Next? (Post-Registration)</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { title: "Bank Account", desc: "Open a Current Account in the firm's name using the Partnership Deed and ROF Certificate.", icon: Landmark },
                                { title: "GST Registration", desc: "Mandatory if your annual turnover exceeds ₹40 Lakhs (₹20 Lakhs for services).", icon: FileCheck },
                                { title: "Income Tax", desc: "Partnership firms are taxed at a flat rate of 30%. Annual ITR-5 filing is mandatory.", icon: PieChart },
                            ].map((item, i) => (
                                <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-dashed border-gray-300 group hover:border-bronze hover:bg-white transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-navy mb-4 shadow-sm group-hover:bg-navy group-hover:text-white transition-colors">
                                        <item.icon size={24} />
                                    </div>
                                    <h4 className="font-bold text-navy mb-2">{item.title}</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* DOCUMENT GUIDE - NEW SECTION */}
                    <section className="bg-beige/5 p-8 rounded-3xl border border-beige/20 shadow-inner">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-navy">Document Masterclass</h2>
                                <p className="text-gray-500 text-sm">Understand the legal importance of each document we provide.</p>
                            </div>
                            <span className="px-4 py-1.5 bg-bronze/10 text-bronze text-xs font-bold rounded-full border border-bronze/20 uppercase tracking-widest">ShineFiling Standards</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                                <div className="p-3 bg-red-50 text-red-500 rounded-lg h-fit"><FileText size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-navy mb-1 uppercase text-xs tracking-tight">The Partnership Deed</h4>
                                    <p className="text-sm text-gray-500 italic mb-2">"The Constitution of your Firm"</p>
                                    <p className="text-xs text-gray-600 leading-relaxed">A legally binding document that prevents 90% of future disputes. We include custom clauses for exit policies and interest on capital.</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                                <div className="p-3 bg-blue-50 text-blue-500 rounded-lg h-fit"><ShieldCheck size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-navy mb-1 uppercase text-xs tracking-tight">ROF Certificate</h4>
                                    <p className="text-sm text-gray-500 italic mb-2">"Proof of Legal Existence"</p>
                                    <p className="text-xs text-gray-600 leading-relaxed">Essential for applying for government tenders and large-scale corporate contracts. It validates your firm with the State Government.</p>
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
                                <FileText className="text-bronze" /> Checklist
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Partners</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> PAN Card (All Partners)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Address Proof (Voter/DL/Aadhar)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> 2 Passport Photos</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Office Address</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Electricity Bill / Water Bill</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Rent Agreement (Stamp Paper)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> NOC from Owner</li>
                                    </ul>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition">View Plans <ArrowRight size={18} /></button>
                        </div>

                        {/* Support Card - PREMIUM */}
                        <div className="bg-[#043E52] text-white p-6 rounded-3xl shadow-xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-bronze/10 rounded-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-150"></div>
                            <h4 className="font-bold text-lg text-bronze mb-2 relative z-10">Expert Consult</h4>
                            <p className="text-gray-400 text-xs mb-6 font-medium relative z-10">Speak with our CA/CS experts before you start.</p>
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-bronze/20 flex items-center justify-center text-bronze shadow-inner"><Users size={20} /></div>
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Chat Support</p><p className="font-black text-white">+91 7639227019</p></div>
                            </div>
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-[10px] uppercase tracking-widest transition">WhatsApp Now</button>
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
                                <PartnershipRegistration
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

export default PartnershipPage;


