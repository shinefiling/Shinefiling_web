
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, Globe, Briefcase, Award, ArrowRight, Rocket, X, Sprout, Tractor, Leaf, Droplet, Sun, Landmark, Banknote, Handshake, FileCheck, PieChart, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProducerRegistration from './ProducerRegistration';
import AuthModal from '../../../components/auth/AuthModal';

const ProducerPage = ({ isLoggedIn }) => {
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
        { q: "What is a Producer Company?", a: "A Producer Company is a body corporate formed by farmers and producers (10+ individuals or 2+ institutions). It combines the goodness of a Cooperative Society with the vibrancy and efficiency of a Private Limited Company." },
        { q: "Who can be a member?", a: "Only 'Primary Producers' (farmers, artisans, etc.) or Producer Institutions can be members. It is designed to benefit the producing community." },
        { q: "What is the minimum capital required?", a: "A minimum paid-up capital of ₹5 Lakhs is required to incorporate a Producer Company." },
        { q: "How many directors are needed?", a: "A minimum of 5 and a maximum of 15 directors are required. Also, a minimum of 10 members (shareholders) is needed." },
        { q: "Are there tax benefits?", a: "Yes, agricultural income is 100% exempt. Additionally, Producer Companies enjoy various deductions under the IT Act subject to specific conditions." },
        { q: "What is an FPO?", a: "FPO (Farmer Producer Organization) is a legal entity formed by primary producers. A Producer Company is the most popular legal structure for an FPO." }
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
                        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2070"
                        alt="Agriculture Background"
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
                                    <Sprout size={12} className="fill-bronze" /> Empowering Farmers
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Producer Company <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Registration</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Unite for better profits. Establish a <strong className="text-white font-semibold">Farmer Producer Organization (FPO)</strong> to gain direct market access, government subsidies, and easy bank loans.
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
                                        <Tractor size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Growth</p>
                                        <p className="font-bold text-sm text-white">Scale Up</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Leaf size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Support</p>
                                        <p className="font-bold text-sm text-white">NABARD</p>
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
                                    Start FPO Now
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Learn Benefits
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
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Producer</p>
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
                                        "5 DSC & 5 DIN Acquisition",
                                        "MoA with Producer Objects",
                                        "NABARD Support Documentation"
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
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Cultivate Success</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">FPO Registration Plans</h2>
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
                            <h3 className="text-lg font-bold text-navy mb-2">Seeds</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹14,999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">₹25,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                {[
                                    "Name Approval (RUN)",
                                    "Incorporation (SPICe+)",
                                    "Pro-Object MoA/AoA",
                                    "PAN & TAN Allotment",
                                    "e-Share Cert Format"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                                <li className="flex items-center gap-3 text-sm text-slate-400">
                                    <X size={14} className="shrink-0" /> DSC for 5 Directors
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-400">
                                    <X size={14} className="shrink-0" /> NABARD Docs
                                </li>
                            </ul>
                            <button onClick={() => handlePlanSelect('basic')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">
                                Choose Seeds
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

                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Producer</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹24,999</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹25,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                <li className="text-xs font-bold text-[#D9A55B] uppercase tracking-wider border-b border-white/10 pb-2">Everything in Seeds +</li>
                                {[
                                    "NABARD & SFAC Documentation Support",
                                    "Share Certificate Distribution",
                                    "Statutory Auditor Appointment",
                                    "GST Registration (Agriculture Exemption)",
                                    "Priority Expert Counseling"
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
                            <h3 className="text-lg font-bold text-navy mb-2">Bounty</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy">₹39,999</span>
                                <span className="text-slate-400 line-through text-xs">₹55,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                <li className="text-xs font-bold text-navy uppercase tracking-wider border-b border-gray-100 pb-2">Everything in Standard +</li>
                                {[
                                    "MSME/Udyam Registration",
                                    "1-Year Compliance Radar",
                                    "NABARD Subsidy Guide",
                                    "Audit Prep Module",
                                    "Legal Advisory (2 Hrs)"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('premium')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">
                                Choose Bounty
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
                            <Leaf className="text-bronze" /> What is a Producer Company?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                A <strong>Producer Company</strong> is a unique hybrid business structure that combines the efficiency of a Private Limited Company with the cooperative spirit of a Society. Governed by the <strong>Companies Act, 2013</strong>, it allows primary producersï¿½such as farmers, milk producers, fishermen, weavers, and artisansï¿½to come together and form a corporate entity.
                            </p>
                            <p>
                                By organizing themselves into a <strong>Farmer Producer Organization (FPO)</strong>, members gain collective bargaining power, enabling them to buy inputs (seeds, fertilizers) at wholesale rates and sell their produce directly to large markets or processors, bypassing middlemen. This structure not only increases profitability but also provides access to advanced technology and credit facilities.
                            </p>
                            <p>
                                ShineFiling specializes in FPO registration, helping you navigate the complex requirements of having 10+ members and 5 Directors. We also assist in connecting your FPO with government schemes like NABARD subsidies and SFAC grants.
                            </p>
                        </div>
                    </section>

                    {/* 6 KEY BENEFITS GRID */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Benefits of Producer Company</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Collective Bargaining", desc: "Small farmers gain the power to negotiate better prices for their produce and inputs.", icon: Users },
                                { title: "Limited Liability", desc: "Members' personal assets are safe. Liability is limited only to the unpaid share capital.", icon: Shield },
                                { title: "NABARD Support", desc: "Access to equity grants, credit guarantee schemes, and subsidies from NABARD and SFAC.", icon: Landmark },
                                { title: "Direct Market Access", desc: "Sell directly to institutional buyers, exporters, and retailers, removing middlemen.", icon: TrendingUp },
                                { title: "Tax Exemptions", desc: "Agricultural income is 100% tax-exempt. Deductions available for certain activities.", icon: Zap },
                                { title: "Easy Loans", desc: "Banks lend more easily to registered FPOs compared to individual farmers.", icon: Briefcase },
                            ].map((benefit, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-bronze/30 transition group">
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

                    {/* DETAILED COMPARISON TABLE */}
                    <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-[#2B3446] p-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Scale size={20} className="text-bronze" /> FPO vs Cooperative Society
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#2B3446]/5 text-navy">
                                    <tr>
                                        <th className="px-6 py-4">Feature</th>
                                        <th className="px-6 py-4 bg-beige/10 border-b-2 border-yellow-500">Producer Company</th>
                                        <th className="px-6 py-4">Cooperative Society</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Registration</td><td className="px-6 py-4 text-slate font-bold bg-beige/10">Central (MCA) - Fast</td><td className="px-6 py-4 text-slate-500">State Registrar - Slow</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Area of Operation</td><td className="px-6 py-4 text-slate font-bold bg-beige/10 text-green-600">Entire India</td><td className="px-6 py-4 text-orange-500">Restricted to State</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Voting Rights</td><td className="px-6 py-4 text-slate font-bold bg-beige/10">One Member One Vote</td><td className="px-6 py-4 text-slate-500">Complex</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Professionalism</td><td className="px-6 py-4 text-slate font-bold bg-beige/10 text-green-600">High (Corporate)</td><td className="px-6 py-4 text-orange-500">Low</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* DETAILED PROCESS SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Registration Timeline</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Digital Signatures (DSC)", days: "Day 1-3", desc: "Obtaining Class-3 Digital Signatures for all 5 Directors." },
                                { step: "Step 2", title: "Name Reservation", days: "Day 3-5", desc: "Applying for name approval. The name must end with 'Producer Company Limited'." },
                                { step: "Step 3", title: "Incorporation Application", days: "Day 5-10", desc: "Filing SPICe+ form along with MOA, AOA, and other declarations." },
                                { step: "Step 4", title: "Certificate of Incorporation", days: "Day 10-15", desc: "Issuance of COI, PAN, and TAN by the Registrar of Companies." }
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
                    <section className="bg-gradient-to-br from-[#043E52] to-navy p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
                        {/* Background Deco */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-bronze/10 rounded-full blur-3xl"></div>

                        <h2 className="text-3xl font-bold mb-6 relative z-10">Why Choose ShineFiling for FPO Registration?</h2>
                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Grant Expertise</h4>
                                        <p className="text-gray-300 text-sm">Our consultants are experts in Equity Grant Schemes. We guide you on how to structure your FPO to be eligible for up to ₹15 Lakhs grant.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Bulk Filing</h4>
                                        <p className="text-gray-300 text-sm">With 10 members and 5 directors, documentation can be messy. Our digital systems handle bulk KYC and signatures effortlessly.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">NABARD Alignment</h4>
                                        <p className="text-gray-300 text-sm">We draft your MOA & AOA specifically aligned with NABARD and SFAC guidelines to ensure future support eligibility.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Rural Outreach</h4>
                                        <p className="text-gray-300 text-sm">We understand rural internet constraints and offer offline document collection support in select districts.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* POST INCORPORATION COMPLIANCE - NEW SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">FPO Post-Registration Steps</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { title: "Bank Account Opening", desc: "Open a Current Account for the FPO with our customized Board Resolutions.", icon: Landmark },
                                { title: "Grant Eligibility", desc: "Apply for Equity Grant Scheme within 6 months of incorporation to boost capital.", icon: FileCheck },
                                { title: "Compliance Cycle", desc: "Annual ROC filings (AOC-4, MGT-7) are mandatory for every Producer Company.", icon: PieChart },
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
                                <h2 className="text-3xl font-bold text-navy">FPO Document Guide</h2>
                                <p className="text-gray-500 text-sm">Vital records provided by ShineFiling for your Producer Company.</p>
                            </div>
                            <span className="px-4 py-1.5 bg-bronze/10 text-bronze text-xs font-bold rounded-full border border-bronze/20 uppercase tracking-widest">ShineFiling Standards</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                                <div className="p-3 bg-red-50 text-red-500 rounded-lg h-fit"><FileText size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-navy mb-1 uppercase text-xs tracking-tight">The Producer MoA</h4>
                                    <p className="text-sm text-gray-500 italic mb-2">"Your Farming Objectives"</p>
                                    <p className="text-xs text-gray-600 leading-relaxed">Clearly states your FPO's goals like procurement, production, and marketing to ensure 100% tax exemption on agri-income.</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                                <div className="p-3 bg-blue-50 text-blue-500 rounded-lg h-fit"><ShieldCheck size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-navy mb-1 uppercase text-xs tracking-tight">Share Certificates</h4>
                                    <p className="text-sm text-gray-500 italic mb-2">"Membership Proof"</p>
                                    <p className="text-xs text-gray-600 leading-relaxed">Proof of ownership for all 10+ farmer members. Essential for applying for NABARD and SFAC equity grants.</p>
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
                                <FileText className="text-bronze" /> Requirements
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">For Directors (Min 5)</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> PAN Card</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Aadhaar / Voter ID</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Bank Statement</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">For Members (Min 10)</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> PAN & Aadhaar</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> 7/12 Extract (Farmer Proof)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Office Address</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Electricity Bill</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> NOC from Landlord</li>
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
                                <ProducerRegistration
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

export default ProducerPage;


