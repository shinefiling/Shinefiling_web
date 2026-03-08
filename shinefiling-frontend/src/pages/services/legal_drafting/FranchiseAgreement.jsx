import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle, Globe, ShoppingBag, FileText, Scale, HelpCircle, Shield,
    BookOpen, Clock, Zap, ChevronRight, Star, ArrowRight, MapPin, X, BarChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '../../../components/auth/AuthModal';
import ApplyFranchiseAgreement from './ApplyFranchiseAgreement';

const FranchiseAgreement = ({ isLoggedIn }) => {
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
        { q: "What is a Franchise Agreement?", a: "It is a legal contract between a franchisor and a franchisee outlining the rights and obligations of both parties." },
        { q: "Why is it important?", a: "It protects the brand's IP, ensures quality control, and clearly defines financial terms like royalties." },
        { q: "What fees are usually included?", a: "It covers the initial franchise fee, ongoing royalty fees, marketing fund contributions, and renewal fees." },
        { q: "Can we define territory?", a: "Yes, exclusive territory rights can be granted to the franchisee to prevent cannibalization within a specific pin code or city." },
        { q: "What happens on termination?", a: "It details the process for winding up, returning assets, non-compete clauses post-termination, and de-branding." },
        { q: "Do you cover COCO/FOFO models?", a: "Yes, our agreements are tailored to your specific model: Company Owned Company Operated (COCO), Franchise Owned Franchise Operated (FOFO), etc." },
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=2070"
                        alt="Franchise Business"
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
                        className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-rose-600/20 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.15, 0.1],
                            x: [0, -50, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[100px]"
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
                                    <ShoppingBag size={12} className="fill-bronze" /> Business Expansion
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Franchise <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Agreement</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Establish a clear legal framework for your franchise model. Define <strong>Brand Usage</strong>, <strong>Royalties</strong>, <strong>Territories</strong>, and <strong>Operational Standards</strong>.
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
                                        <Globe size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Territory</p>
                                        <p className="font-bold text-sm text-white">Rights</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Brand</p>
                                        <p className="font-bold text-sm text-white">Protection</p>
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
                                            <Globe size={28} className="text-bronze fill-bronze/20" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle size={14} className="text-green-500 fill-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">
                                        Franchise <br />Agreement
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Business Expansion</p>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-slate-100 mb-5"></div>

                                {/* Stats Grid - COMPACT */}
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    {/* Left Stat */}
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Shield size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Brand</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Usage <br />Defined</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>

                                    {/* Right Stat */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <ShoppingBag size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Clear</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Royalty <br />Terms</p>
                                    </div>
                                </div>

                                {/* Check List - COMPACT */}
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "Territory Rights",
                                        "Operational Guidelines",
                                        "Renewal & Exit Terms"
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
                                    Scale your business with confidence
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
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Expansion Packages</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Choose Your Plan</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* PLAN 1: REVIEW */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Review</h3>
                            <p className="text-slate-500 text-sm mb-6">Review Existing Draft.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹1,999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">₹3,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Review by Expert",
                                    "Risk Analysis",
                                    "Negotiation Points",
                                    "Clause Hardening"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('review')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Review</button>
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
                            <p className="text-gray-400 text-sm mb-6">Unit Franchise Draft.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹3,999</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹8,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Detailed Drafting",
                                    "Royalty & Fees",
                                    "Territory Clause",
                                    "2 Rounds of Edits",
                                    "Full IP Protection"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Choose Standard</button>
                        </motion.div>

                        {/* PLAN 3: MASTER */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Master Draft</h3>
                            <p className="text-slate-500 text-sm mb-6">For Master Franchisees.</p>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy border-b-2 border-slate-100">₹9,999</span>
                                <span className="text-slate-400 line-through text-xs">₹15,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Sub-Franchising Rights",
                                    "Multi-Unit Agreements",
                                    "Senior Counsel Draft",
                                    "Unlimited Revisions",
                                    "Global Scale Ready"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('master')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Master</button>
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
                            <ShoppingBag className="text-bronze" /> Scale Your Business Safely
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                A <strong>Franchise Agreement</strong> is the blueprint of your brand's expansion. It grants the right to use your brand, business model, and intellectual property to a third party (Franchisee) in exchange for fees and royalties.
                            </p>
                            <p>
                                A well-drafted agreement ensures brand consistency, quality control, and protects your business from potential liabilities caused by a franchisee. We specialize in drafting agreements for restaurants, retail, gyms, and educational institutes.
                            </p>
                        </div>
                    </section>

                    {/* Models Table */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Franchise Models We Cover</h2>
                        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                            <div className="grid grid-cols-3 bg-navy text-white text-center p-4 font-bold text-sm tracking-wider uppercase">
                                <div>Model</div>
                                <div>Ownership</div>
                                <div>Operation</div>
                            </div>
                            <div className="divide-y divide-gray-100 bg-white">
                                <div className="grid grid-cols-3 p-4 hover:bg-gray-50 transition items-center">
                                    <div className="font-bold text-navy text-sm">FOFO</div>
                                    <div className="text-sm text-slate-600 text-center">Franchisee</div>
                                    <div className="text-sm text-slate-600 text-center">Franchisee (Most Common)</div>
                                </div>
                                <div className="grid grid-cols-3 p-4 hover:bg-gray-50 transition items-center">
                                    <div className="font-bold text-navy text-sm">FOCO</div>
                                    <div className="text-sm text-slate-600 text-center">Franchisee</div>
                                    <div className="text-sm text-slate-600 text-center">Company (Brand Runs It)</div>
                                </div>
                                <div className="grid grid-cols-3 p-4 hover:bg-gray-50 transition items-center">
                                    <div className="font-bold text-navy text-sm">COFO</div>
                                    <div className="text-sm text-slate-600 text-center">Company</div>
                                    <div className="text-sm text-slate-600 text-center">Franchisee</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Importance/Features Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Shield className="text-bronze" /> Why a Franchise Agreement?
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Brand Protection", desc: "Strict guidelines on how your logo, name, and IP can be used." },
                                { title: "Quality Control", desc: "Mandates adherence to your operational standards." },
                                { title: "Revenue Security", desc: "Clearly defines the franchise fee, royalties, and payment schedules." },
                                { title: "Territory Rights", desc: "Prevents internal competition by defining exclusive zones." },
                                { title: "Legal Compliance", desc: "Ensures the franchise model complies with Indian contract laws." },
                                { title: "Termination Rights", desc: "Allows you to cancel the deal if standards aren't met." },
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

                    {/* Key Components Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Scale className="text-bronze" /> Key Components We Draft
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Franchise Fee & Royalties", desc: "Clearly defined initial, ongoing, and marketing fees." },
                                { title: "Territory Rights", desc: "Exclusive or non-exclusive territory definitions." },
                                { title: "Brand Usage", desc: "Guidelines on how to use trademarks and logos." },
                                { title: "Marketing & Support", desc: "Obligations for advertising and training support." },
                                { title: "Term & Renewal", desc: "Duration of the agreement and conditions for renewal." },
                                { title: "Termination", desc: "Grounds for termination and post-termination duties." },
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-lg hover:border-bronze/30 group">
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

                    {/* Process Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Drafting Process</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Model Understanding", days: "Day 1", desc: "We analyze your franchise model (FOCO, FOFO, COCO, etc.)." },
                                { step: "Step 2", title: "Commercials", days: "Day 2", desc: "Finalizing fees, royalties, and territory specifics." },
                                { step: "Step 3", title: "Drafting", days: "Day 3-4", desc: "Creating the master franchise agreement." },
                                { step: "Step 4", title: "Review", days: "Day 5", desc: "You review and we refine the terms until perfect." }
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
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Franchisor & Franchisee Details</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Commercial Terms (Fees, Royalties)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Territory Definition</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Support Obligations</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Expanding Fast?</h4>
                            <p className="text-gray-300 text-sm mb-4">We can help standardize your agreements for multiple franchisees.</p>
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
                            <ApplyFranchiseAgreement
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
export default FranchiseAgreement;


