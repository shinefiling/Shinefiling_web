
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, Globe, Briefcase, Award, ArrowRight, Rocket, X, Heart, HandHelping, Banknote, Handshake, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Section8Registration from './Section8Registration';
import AuthModal from '../../../components/auth/AuthModal';

const Section8Page = ({ isLoggedIn, onLogout }) => {
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
        { q: "What is a Section 8 Company?", a: "A Section 8 company is a Non-Profit Organization (NPO) registered under the Companies Act, 2013. It is established for promoting arts, science, commerce, charity, etc." },
        { q: "Can we distribute profits?", a: "No, profits cannot be distributed as dividends to members. They must be reinvested into the objectives of the company." },
        { q: "What is 12A and 80G registration?", a: "12A grants tax exemption to the NGO's income, while 80G allows donors to claim tax deductions on their donations." },
        { q: "Is FCRA mandatory?", a: "FCRA is only required if you intend to receive foreign contributions or donations." },
        { q: "How many directors are needed?", a: "Minimum 2 directors and 2 shareholders are required for a private limited Section 8 company." },
        { q: "Does it require a minimum capital?", a: "No, there is no minimum paid-up capital requirement for a Section 8 company." }
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
                        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2070"
                        alt="NGO Background"
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
                                    <Heart size={12} className="fill-bronze" /> For Social Change
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Section 8 Company <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Registration</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Build a credible foundation for your cause. Get <strong className="text-white font-semibold">12A & 80G Exemptions</strong>, <strong className="text-white font-semibold">CSR Funding</strong> eligibility, and corporate legal standing.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Timeline</p>
                                        <p className="font-bold text-sm text-white">10-15 Days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</p>
                                        <p className="font-bold text-sm text-white">Tax Exempt</p>
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
                                    Start NGO Now
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Learn Exemptions
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
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Section8</p>
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
                                        "Company Incorporation (INC-32)",
                                        "Section 8 License (INC-12)",
                                        "12A & 80G Registration Support"
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
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Empowering Social Good</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">NGO Registration Plans</h2>
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
                            <h3 className="text-lg font-bold text-navy mb-2">Foundation</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹9,999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">₹15,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "2 DSC & 2 DIN",
                                    "Name Approval (RUN)",
                                    "MOA & AOA Drafting",
                                    "Section 8 License (INC-12)",
                                    "Certificate of Incorporation",
                                    "PAN & TAN Allotment"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                                <li className="flex items-center gap-3 text-sm text-slate-400">
                                    <X size={14} className="shrink-0" /> 12A & 80G Registration
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-400">
                                    <X size={14} className="shrink-0" /> NGO Darpan
                                </li>
                            </ul>
                            <button onClick={() => handlePlanSelect('basic')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">
                                Choose Foundation
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

                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Section8</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹14,999</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹25,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                <li className="text-xs font-bold text-[#D9A55B] uppercase tracking-wider border-b border-white/10 pb-2">Everything in Foundation Plan +</li>
                                {[
                                    "12A (Prov.) Tax Exemption App",
                                    "80G (Prov.) Donor Benefit App",
                                    "GST Registration & PAN/TAN",
                                    "NGO Darpan Portal Enrollment"
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
                            <h3 className="text-lg font-bold text-navy mb-2">Global</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy">₹24,999</span>
                                <span className="text-slate-400 line-through text-xs">₹40,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="text-xs font-bold text-navy uppercase tracking-wider border-b border-gray-100 pb-2">Everything in Impact +</li>
                                {[
                                    "FCRA Prior Permission App",
                                    "CSR Policy Drafting",
                                    "Project Proposal Template",
                                    "Annual Compliance (1 Year)",
                                    "Dedicated NGO Expert"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('premium')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">
                                Choose Global
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section >
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT CONTENT COLUMN (8 Cols) */}
                <div id="details-section" className="lg:col-span-8 space-y-20">

                    {/* Introduction - Expanded for SEO */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <HandHelping className="text-bronze" /> Defining Section 8 Company
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                A <strong>Section 8 Company</strong> is a Non-Profit Organization (NPO) registered under the <strong>Companies Act, 2013</strong>. It is established to promote charitable objectives like art, commerce, science, sports, education, research, social welfare, religion, charity, and environmental protection.
                            </p>
                            <p>
                                Unlike Trusts or Societies, a designated Section 8 company has better legal standing and credibility, making it the preferred choice for organizations looking to receive Government grants, CSR funding, and foreign contributions (FCRA). Any profit earned must be reinvested into the company's objectives and cannot be distributed as dividends to members.
                            </p>
                            <p>
                                ShineFiling empowers social entrepreneurs by handling the complex licensing (Form INC-12) and registration process. We also assist with post-incorporation compliances like 12A & 80G registration to ensure your donors get tax benefits.
                            </p>
                        </div>
                    </section>

                    {/* 6 KEY BENEFITS GRID */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Why Choose Section 8?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Tax Exemptions", desc: "Eligible for 100% tax exemption on income under Section 12A of the IT Act.", icon: Zap },
                                { title: "Donor Benefits", desc: "Donors get 50% tax deduction on donations under Section 80G, encouraging more funds.", icon: TrendingUp },
                                { title: "CSR Funding", desc: "Most preferred entity type for receiving Corporate Social Responsibility (CSR) funds.", icon: Award },
                                { title: "Credibility", desc: "Higher trust among stakeholders due to strict MCA regulations and transparency.", icon: Star },
                                { title: "Limited Liability", desc: "Founders/Members have limited liability, protecting personal assets from company debts.", icon: Shield },
                                { title: "No Minimum Capital", desc: "Can be registered without any minimum paid-up capital requirement.", icon: Briefcase },
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

                    {/* DETAILED COMPARISON TABLE */}
                    <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-[#2B3446] p-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Scale size={20} className="text-bronze" /> Comparison with Trust & Society
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#2B3446]/5 text-navy">
                                    <tr>
                                        <th className="px-6 py-4">Feature</th>
                                        <th className="px-6 py-4 bg-beige/10 border-b-2 border-yellow-500">Section 8 Company</th>
                                        <th className="px-6 py-4">Trust</th>
                                        <th className="px-6 py-4">Society</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Registration Authority</td><td className="px-6 py-4 text-slate font-bold bg-beige/10">MCA (Central Govt)</td><td className="px-6 py-4 text-slate-500">Sub-Registrar (State)</td><td className="px-6 py-4 text-slate-500">Registrar of Societies</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Credibility</td><td className="px-6 py-4 text-slate font-bold bg-beige/10 text-green-600">Highest</td><td className="px-6 py-4 text-orange-500">Moderate</td><td className="px-6 py-4 text-orange-500">Moderate</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">CSR Funding</td><td className="px-6 py-4 text-slate font-bold bg-beige/10 text-green-600">Highly Preferred</td><td className="px-6 py-4 text-slate-500">Allowed</td><td className="px-6 py-4 text-slate-500">Allowed</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Compliance</td><td className="px-6 py-4 text-slate font-bold bg-beige/10">High</td><td className="px-6 py-4 text-green-600">Low</td><td className="px-6 py-4 text-orange-500">Medium</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* DETAILED PROCESS SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Registration Timeline</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Name Approval", days: "Day 1-2", desc: "Application for Name Reservation through RUN service. Name must exclude 'Pvt Ltd' suffix." },
                                { step: "Step 2", title: "DSC & DIN", days: "Day 3-4", desc: "Obtaining Digital Signatures (DSC) for directors and applying for Director Identification Numbers." },
                                { step: "Step 3", title: "License (INC-12)", days: "Day 5-9", desc: "Application to the Central Government for Section 8 License is the most critical step." },
                                { step: "Step 4", title: "Incorporation", days: "Day 10-15", desc: "Final filing of SPICe+ form along with MOA, AOA, and License to get the Certificate of Incorporation." }
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

                        <h2 className="text-3xl font-bold mb-6 relative z-10 text-white">Why Choose ShineFiling for Your NGO?</h2>
                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-[#F8F9FA]">Guaranteed License</h4>
                                        <p className="text-gray-300 text-sm">Our experts meticulously draft the MOA & AOA to ensure your Section 8 License is approved without rejection.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-[#F8F9FA]">12A & 80G Support</h4>
                                        <p className="text-gray-300 text-sm">We don't stop at registration. We help you get tax exemption certificates so you can attract more donors.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-[#F8F9FA]">CSR Advisory</h4>
                                        <p className="text-gray-300 text-sm">Our consultants guide you on how to structure your projects to be eligible for Corporate Social Responsibility funds.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-[#F8F9FA]">FCRA Guidance</h4>
                                        <p className="text-gray-300 text-sm">Planning to receive foreign funds? We provide roadmap and compliance support for FCRA registration.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* NGO COMPLIANCE CALENDAR - NEW SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">NGO Compliance Calendar</h2>
                        <div className="overflow-x-auto bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-navy text-white">
                                    <tr>
                                        <th className="px-6 py-4 rounded-tl-3xl font-bold">Compliance</th>
                                        <th className="px-6 py-4 font-bold">Frequency</th>
                                        <th className="px-6 py-4 rounded-tr-3xl font-bold">Due Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-navy">ROC Form AOC-4 (Financials)</td><td className="px-6 py-4 italic">Annual</td><td className="px-6 py-4 text-orange-600 font-bold">Oct 30th</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-navy">ROC Form MGT-7 (Annual Return)</td><td className="px-6 py-4 italic">Annual</td><td className="px-6 py-4 text-orange-600 font-bold">Nov 29th</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-navy">Income Tax Return (ITR-7)</td><td className="px-6 py-4 italic">Annual</td><td className="px-6 py-4 text-red-600 font-bold">Sept 30th</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-navy">Form 10B/BB (Audit Report)</td><td className="px-6 py-4 italic">Annual</td><td className="px-6 py-4 text-red-600 font-bold">Sept 30th</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* TAX EXEMPTION DEEP DIVE - NEW SECTION */}
                    <section className="bg-bronze/5 p-8 rounded-3xl border border-bronze/20">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-bronze shadow-lg">
                                <FileText size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-navy">Empower Your Fundraising</h2>
                                <p className="text-gray-600 text-sm">Unlock the potential of 12A & 80G registrations with our experts.</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <h4 className="font-bold text-navy mb-3 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs italic">12A</div>
                                    Income Tax Exemption
                                </h4>
                                <ul className="space-y-2 text-xs text-gray-500 leading-relaxed">
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5 shrink-0"></div> Makes the entire income of the NGO tax-free.</li>
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5 shrink-0"></div> Essential for obtaining FCRA registration.</li>
                                </ul>
                            </div>
                            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <h4 className="font-bold text-navy mb-3 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center font-bold text-xs italic">80G</div>
                                    Donor Tax Benefits
                                </h4>
                                <ul className="space-y-2 text-xs text-gray-500 leading-relaxed">
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5 shrink-0"></div> Allows donors to claim a 50% deduction in their taxable income.</li>
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5 shrink-0"></div> Increases trust and encourages larger corporate donations.</li>
                                </ul>
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
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Directors (Min 2)</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> PAN & Aadhaar Card</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Voter ID or Passport</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Passport Photo</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Office Address</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Electricity Bill</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Rent Agreement (if rented)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> NOC from Landlord</li>
                                    </ul>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition">View Plans <ArrowRight size={18} /></button>
                        </div>

                        {/* Support Card - PREMIUM */}
                        <div className="bg-[#043E52] text-white p-6 rounded-3xl shadow-xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-bronze/10 rounded-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-150"></div>
                            <h4 className="font-bold text-lg text-bronze mb-2 relative z-10">NGO Desk</h4>
                            <p className="text-gray-400 text-xs mb-6 font-medium relative z-10">Our NGO experts can guide you on tax exemptions.</p>
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-bronze/20 flex items-center justify-center text-bronze shadow-inner"><Users size={20} /></div>
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Expert Support</p><p className="font-black text-white">+91 7639227019</p></div>
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
                                <Section8Registration
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

export default Section8Page;


