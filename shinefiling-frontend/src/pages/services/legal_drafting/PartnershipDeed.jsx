import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle, Users, Briefcase, FileText, Scale, HelpCircle, Shield,
    BookOpen, Clock, Zap, ChevronRight, Star, ArrowRight, UserCheck, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '../../../components/auth/AuthModal';
import ApplyPartnershipDeed from './ApplyPartnershipDeed';

const PartnershipDeed = ({ isLoggedIn }) => {
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
        { q: "Is a Partnership Deed mandatory?", a: "While not legally mandatory to start a business, a written Partnership Deed is strictly required for registering the firm with the Registrar of Firms and for obtaining a PAN card in the firm's name. Without a deed, the partnership is \"At Will\" and governed by the default provisions of the Partnership Act, 1932, which may not be favorable." },
        { q: "What is the difference between specific and general partnership?", a: "A specific partnership is formed for a particular venture or time period, and it dissolves automatically once that is achieved. A general partnership is for carrying on business in general and continues until dissolved by partners." },
        { q: "Do I need Stamp Paper?", a: "Yes, the Partnership Deed must be printed on non-judicial stamp paper. The value of the stamp paper depends on the capital contribution and the state in which the deed is executed (e.g., ₹500, ₹2000, etc.). It must also be notarized." },
        { q: "Can we change terms later?", a: "Absolutely. The flexibility of a partnership is its biggest advantage. You can execute a 'Supplementary Partnership Deed' or 'Reconstitution Deed' to add/remove partners, change profit ratios, or modify other terms." },
        { q: "What is the partner limit?", a: "As per the Companies Act, 2013, the maximum number of partners in a partnership firm is 50. The minimum is 2." },
        { q: "Does it cover profit sharing?", a: "Yes, this is a critical clause. If not defined in the deed, the Partnership Act mandates equal profit sharing, regardless of capital contribution or effort. A deed allows you to customize this (e.g., 60:40 or based on performance)." },
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1974"
                        alt="Partnership Handshake"
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
                        className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.15, 0.1],
                            x: [0, -50, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px]"
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
                                    <Users size={12} className="fill-bronze" /> Business Structure
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Partnership <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Deed Drafting</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    A robust partnership starts with a clear agreement. Define <strong>Profit Rights</strong>, <strong>Roles</strong>, and <strong>Liabilities</strong> to prevent future disputes.
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
                                        <Scale size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Profit</p>
                                        <p className="font-bold text-sm text-white">Clauses</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dispute</p>
                                        <p className="font-bold text-sm text-white">Resolution</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Start Drafting
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
                                            <Briefcase size={28} className="text-bronze fill-bronze/20" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle size={14} className="text-green-500 fill-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">
                                        Partnership <br />Deed
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Start Your Business</p>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-slate-100 mb-5"></div>

                                {/* Stats Grid - COMPACT */}
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    {/* Left Stat */}
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Scale size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Legal</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Binding <br />Agreement</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>

                                    {/* Right Stat */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Clock size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">3 Days</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Fast <br />Delivery</p>
                                    </div>
                                </div>

                                {/* Check List - COMPACT */}
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "Custom Drafting",
                                        "Partner Rights Defined",
                                        "Dispute Resolution"
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
                                    Choose the best plan for your partnership
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
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Our Packages</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Choose Your Plan</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* PLAN 1: BASIC (Template) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Basic</h3>
                            <p className="text-slate-500 text-sm mb-6">Standard Verified Template.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">₹1,500</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Standard Format",
                                    "Instant Download",
                                    "Word/PDF Format",
                                    "Legally Verified"
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
                            <p className="text-gray-400 text-sm mb-6">Expert Drafting for your Firm.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹1,999</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹3,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Custom Drafting",
                                    "Profit Sharing Clauses",
                                    "Dispute Resolution",
                                    "Quick Delivery (3 Days)",
                                    "One Round of Revision"
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
                            <h3 className="text-lg font-bold text-navy mb-2">Premium</h3>
                            <p className="text-slate-500 text-sm mb-6">With Lawyer Consultation.</p>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy">₹3,499</span>
                                <span className="text-slate-400 line-through text-xs">₹5,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Senior Lawyer Draft",
                                    "Unlimited Revisions",
                                    "1-on-1 Consultation",
                                    "Priority Support",
                                    "Registration Guidance"
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
                            <FileText className="text-bronze" /> What is a Partnership Deed?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                A <strong>Partnership Deed</strong> is the constitution of your partnership firm. It is a legal document representing an agreement between two or more partners outlining the terms and conditions of their partnership.
                            </p>
                            <p>
                                It is the most vital document for a partnership business as it provides legal backing to the existence of the firm. While a partnership can be formed by oral agreement, having a written deed is crucial to avoid future conflict and is mandatory for opening a bank account, obtaining a PAN card for the firm, and registering with the Registrar of Firms.
                            </p>
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
                                <p className="text-sm font-semibold text-blue-800">
                                    Did You Know?
                                </p>
                                <p className="text-sm text-blue-700 mt-1">
                                    Without a written deed, your partnership is governed by the Indian Partnership Act, 1932, which mandates equal profit sharing and no interest on capital, regardless of how much individual partners invest or work.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Registered vs Unregistered */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Registered vs. Unregistered Firm</h2>
                        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                            <div className="grid grid-cols-3 bg-navy text-white text-center p-4 font-bold text-sm tracking-wider uppercase">
                                <div>Feature</div>
                                <div>Registered Firm</div>
                                <div>Unregistered Firm</div>
                            </div>
                            <div className="divide-y divide-gray-100 bg-white">
                                <div className="grid grid-cols-3 p-4 hover:bg-gray-50 transition">
                                    <div className="font-bold text-navy text-sm">Right to Sue</div>
                                    <div className="text-sm text-green-600 font-semibold text-center">Can sue 3rd parties & partners</div>
                                    <div className="text-sm text-red-600 font-semibold text-center">Cannot sue</div>
                                </div>
                                <div className="grid grid-cols-3 p-4 hover:bg-gray-50 transition">
                                    <div className="font-bold text-navy text-sm">Right to Set-Off</div>
                                    <div className="text-sm text-green-600 font-semibold text-center">Allowed (&gt; ₹100 claim)</div>
                                    <div className="text-sm text-red-600 font-semibold text-center">Not Allowed</div>
                                </div>
                                <div className="grid grid-cols-3 p-4 hover:bg-gray-50 transition">
                                    <div className="font-bold text-navy text-sm">Third Party Action</div>
                                    <div className="text-sm text-slate-600 text-center">Can be sued by others</div>
                                    <div className="text-sm text-slate-600 text-center">Can be sued by others</div>
                                </div>
                                <div className="grid grid-cols-3 p-4 hover:bg-gray-50 transition">
                                    <div className="font-bold text-navy text-sm">Legal Validity</div>
                                    <div className="text-sm text-green-600 font-semibold text-center">High Credibility</div>
                                    <div className="text-sm text-orange-600 font-semibold text-center">Low Credibility</div>
                                </div>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-500 italic">
                            *Note: A written partnership deed is the first step towards registration. We highly recommend registering your deed.
                        </p>
                    </section>

                    {/* Importance/Features Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Shield className="text-bronze" /> Why You Need a Strong Deed
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Custom Profit Sharing", desc: "Define any ratio (e.g., 70:30) instead of the statutory equal split." },
                                { title: "Role Clarity", desc: "Clearly specify who is the Working Partner and who is the Sleeping Partner." },
                                { title: "Salaries & Interest", desc: "Enable partners to draw salary and interest on capital (Tax efficient)." },
                                { title: "Dispute Resolution", desc: "Include arbitration clauses to settle fights without going to court." },
                                { title: "Bank Account", desc: "Mandatory document for opening a Current Account in the firm's name." },
                                { title: "Audit & Tax", desc: "Required for getting the firm's PAN and filing Income Tax returns." },
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

                    {/* Key Clauses Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">Components of a Standard Deed</h2>
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="mb-6 text-gray-600">Our expert drafting ensures all critical clauses are covered:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                {[
                                    { k: "General Details", v: "Name of Firm, Address, Nature of Business, Date of Commencement." },
                                    { k: "Partners", v: "Full names and addresses of all partners." },
                                    { k: "Capital", v: "Amount contributed by each partner to the capital pool." },
                                    { k: "Profit/Loss Ratio", v: "The specific ratio in which profits and losses are shared." },
                                    { k: "Interest on Capital", v: "Rate o interest payable on capital (Max 12% p.a. for tax)." },
                                    { k: "Salaries / Remuneration", v: "Salaries payable to working partners (Tax deductible limit)." },
                                    { k: "Bank Operations", v: "Who has the signing authority? Jointly or Severally?" },
                                    { k: "Dissolution", v: "Procedure for winding up the firm or exit of a partner." }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col gap-1 pb-4 border-b border-gray-50 last:border-0 border-dashed">
                                        <div className="flex items-center gap-2">
                                            <Scale size={16} className="text-bronze flex-shrink-0" />
                                            <span className="font-bold text-navy">{item.k}</span>
                                        </div>
                                        <span className="text-sm text-gray-600 pl-6">{item.v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Process Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Drafting Workflow</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Information Gathering", days: "Day 1", desc: "Submit partner details, capital info, and business nature via our simple form." },
                                { step: "Step 2", title: "Expert Drafting", days: "Day 2", desc: "Our lawyers treat the deed, ensuring all legal clauses and tax benefits are included." },
                                { step: "Step 3", title: "Review & Approval", days: "Day 2", desc: "We send you the draft for review. You can request changes or approve it." },
                                { step: "Step 4", title: "Final Delivery", days: "Day 3", desc: "Receive the final deed ready to be printed on stamp paper." }
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
                                <FileText className="text-bronze" /> Checklist
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">To be collected</p>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Firm Name</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Partners' ID Proofs</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Address Proof of Office</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Capital Details</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Registration?</h4>
                            <p className="text-gray-300 text-sm mb-4">We can also help you register this deed with the Registrar of Firms.</p>
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
                            <ApplyPartnershipDeed
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
export default PartnershipDeed;


