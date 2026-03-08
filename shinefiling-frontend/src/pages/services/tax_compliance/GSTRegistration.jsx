import GstRegistration from './GstRegistrationForm';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, Globe, Briefcase, Award, ArrowRight, Rocket, X, Truck, Handshake, Banknote, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '../../../components/auth/AuthModal';

const GSTRegistrationPage = ({ isLoggedIn }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('basic');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "Who needs GST Registration?", a: "Businesses with turnover > ₹20 Lakhs (Services) or ₹40 Lakhs (Goods), or those selling online (E-commerce) or making inter-state sales." },
        { q: "Is a physical office required?", a: "Yes, you need a proof of address (Electricity Bill/NOC). However, it can be a residential address too if you operate from home." },
        { q: "What is the penalty for not registering?", a: "Penalty can be 100% of the tax due or ₹10,000, whichever is higher, along with potential confiscation of goods." },
        { q: "Can I register voluntarily?", a: "Yes, voluntary registration is allowed and beneficial for claiming Input Tax Credit (ITC)." },
        { q: "Difference between Regular and Composition?", a: "Regular scheme allows ITC claim but requires monthly returns. Composition scheme has lower tax rates but no ITC and cannot make inter-state sales." },
        { q: "Do I need to file returns if I have no sales?", a: "Yes, filing Nil Returns is mandatory to avoid late fees and penalties." },
        { q: "How long is the GST registration valid?", a: "GST registration does not expire unless surrendered by you or cancelled by the authority." }
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
            <AnimatePresence>
                {showRegisterModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2rem] w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl relative flex flex-col"
                        >
                            <GstRegistration
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

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2070"
                        alt="GST Registration"
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

                        {/* Hero Content - Left Aligned */}
                        <div className="flex-1 text-center lg:text-left space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                                    <Star size={12} className="fill-bronze" /> Mandatory for Business Growth
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    GST <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Registration Online</span>
                                </h1>
                                <p className="text-gray-300 text-xl max-w-xl font-light leading-relaxed">
                                    Get your GSTIN number online. Unlock <strong className="text-white font-semibold">Input Tax Credit</strong>, <strong className="text-white font-semibold">Legal Recognition</strong>, and the power to sell on E-commerce platforms like <strong className="text-white font-semibold">Amazon & Flipkart</strong>.
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
                                        <p className="font-bold text-sm text-white">3-7 Days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Users size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Clients</p>
                                        <p className="font-bold text-sm text-white">10k+ Filed</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                            >
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Start Registration
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
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">GST Registration</p>
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
                                        "GST Application Filing & Tracking",
                                        "Automated Document Verification",
                                        "Guaranteed ARN Generation",
                                        "Expert GSTIN Approval Support"
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

            {/* PRICING SECTION */}
            <section id="pricing-plans" className="py-20 px-6 lg:px-12 bg-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Choose Your Path</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Transparent Pricing Plans</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                        <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
                            Choose the perfect plan for your business. From basic registration to complete compliance automation.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Basic Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Basic</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">+ Govt Fees</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Full GST Application Preparation",
                                    "Valid Application Filing on Portal",
                                    "Immediate ARN Reference Handover",
                                    "Free HSN/SAC Code Consultation",
                                    "Registration Certificate Assistance",
                                    "Email Support within 24 Hours"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('basic')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Quick Start</button>
                        </motion.div>

                        {/* Standard Plan */}
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
                                <span className="text-3xl font-black text-white">₹1,499</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹3,000</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                <li className="text-xs font-bold text-[#D9A55B] uppercase tracking-wider border-b border-white/10 pb-2">Everything in Basic +</li>
                                {[
                                    "3 Months Nil Return Filing",
                                    "GST Invoicing Format & Training",
                                    "MSME (Udyam) Registration",
                                    "Physical Address NOC Guidance",
                                    "Priority WhatsApp & Call Support",
                                    "Business Profile Setup on Portal"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Select Business Growth</button>
                        </motion.div>

                        {/* Premium Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Premium</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy">₹2,999</span>
                                <span className="text-slate-400 line-through text-xs">₹5,000</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="text-xs font-bold text-navy uppercase tracking-wider border-b border-gray-100 pb-2">Everything in Standard +</li>
                                {[
                                    "6 Months Return Filing (1 & 3B)",
                                    "Dedicated CA Professional",
                                    "ITC Reconciliation & Advisory",
                                    "Notice Monitoring & Reply Help",
                                    "Registration Amendment Support",
                                    "Lifetime Credential Management"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('premium')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Compliance Pro</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* EXTENSIVE CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT CONTENT COLUMN (8 Cols) */}
                <div id="details-section" className="lg:col-span-8 space-y-20">

                    {/* Introduction - Expanded for SEO */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Scale className="text-bronze" /> What is GST Registration?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                <strong>Goods and Services Tax (GST)</strong> is a unified indirect tax system in India that acts as a comprehensive, destination-based tax on the manufacture, sale, and consumption of goods and services.
                            </p>
                            <p>
                                GST Registration is mandatory for businesses whose aggregate turnover exceeds <strong>₹40 Lakhs (for Goods)</strong> or <strong>₹20 Lakhs (for Services)</strong>. However, for certain categories like <strong>Inter-state Sellers</strong>, <strong>E-commerce Operators</strong> (like Amazon/Flipkart sellers), and <strong>Casual Taxable Persons</strong>, registration is compulsory regardless of turnover.
                            </p>
                            <p>
                                Obtaining a GSTIN (GST Identification Number) not only legalizes your business but also allows you to collect tax from customers and claim <strong>Input Tax Credit (ITC)</strong> on your business purchases, maintaining a healthy cash flow.
                            </p>
                        </div>
                    </section>

                    {/* BENEFITS GRID */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Why You Must Register for GST</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Legal Recognition", desc: "Your business becomes a legally recognized supplier. This status enhances your business's market standing.", icon: Shield },
                                { title: "Input Tax Credit (ITC)", desc: "You can claim credit for taxes paid on your purchases, significantly reducing your overall tax liability.", icon: TrendingUp },
                                { title: "Inter-State Sales", desc: "Required to sell goods to customers in other states without restrictions. Expands your market reach.", icon: Truck },
                                { title: "E-Commerce Ready", desc: "Mandatory to sell on platforms like Amazon, Flipkart, Myntra, etc. A must for online sellers.", icon: Globe },
                                { title: "Better Credibility", desc: "Registered businesses are trusted more by other companies and banks, making loan approvals easier.", icon: Star },
                                { title: "Avoid Penalties", desc: "Avoid heavy penalties and seizure of goods that come with non-compliance. Stay safe.", icon: Scale },
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

                    {/* COMPARISON: REGULAR vs COMPOSITION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Choose Your GST Scheme</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Feature</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Regular Scheme</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Composition Scheme</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {[
                                        { f: "Turnover Limit", r: "No limit (Mandatory > ₹40L)", c: "Up to ₹1.5 Crores only" },
                                        { f: "Input Tax Credit", r: "Available (Can claim ITC)", c: "Not Available (Cannot claim ITC)" },
                                        { f: "Inter-state Sales", r: "Allowed", c: "Not Allowed (Intra-state only)" },
                                        { f: "Tax Rate", r: "Standard Rates (5%, 12%, 18%, 28%)", c: "Lower Rates (1% Traders, 5% Restaurants, 6% Service)" },
                                        { f: "Return Filing", r: "Monthly (GSTR-1, GSTR-3B) + Annual", c: "Quarterly (CMP-08) + Annual" },
                                        { f: "E-Commerce", r: "Can sell online", c: "Cannot sell via E-commerce operators" }
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition">
                                            <td className="p-4 font-bold text-navy border-r border-gray-100">{row.f}</td>
                                            <td className="p-4 text-slate-600 border-r border-gray-100">{row.r}</td>
                                            <td className="p-4 text-slate-600">{row.c}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* WHO SHOULD REGISTER SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">Who Should Register?</h2>
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="mb-6 text-gray-600">Mandatory for the following entities:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                {[
                                    "Turnover > ₹40L (Goods)", "Turnover > ₹20L (Services)",
                                    "Inter-state Suppliers", "Casual Taxable Persons",
                                    "E-commerce Sellers", "Non-Resident Taxable Persons",
                                    "TDS/TCS Deductors", "Input Service Distributors"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle size={18} className="text-bronze flex-shrink-0" />
                                        <span className="font-medium text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* PROCESS SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Registration Timeline & Process</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Documents Upload", days: "Day 1", desc: "You provide PAN, Aadhaar, and Address Proof. We verify all documents for validity." },
                                { step: "Step 2", title: "Application Filing", days: "Day 2", desc: " We prepare and file your application on the GST Portal along with the required documents." },
                                { step: "Step 3", title: "ARN Generation", days: "Day 3", desc: "An Application Reference Number (ARN) is generated. The application moves to the tax officer for review." },
                                { step: "Step 4", title: "Certificate Issue", days: "Day 4-7", desc: "Upon approval, the GST Registration Certificate (Form GST REG-06) is issued digitally." },
                            ].map((item, i) => (
                                <div key={i} className="group flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-100 hover:border-bronze/30 hover:shadow-lg transition-all duration-300">
                                    <div className="flex-shrink-0 w-full md:w-32 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:bg-bronze/5 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-bronze font-bold flex items-center justify-center mb-2 shadow-sm">
                                            {i + 1}
                                        </div>
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



                    {/* MANDATORY DELIVERABLES */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">What You Will Receive</h2>
                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="p-6 bg-navy text-white">
                                <p className="text-sm opacity-80">Official documents you get after successful registration.</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[
                                    { name: "GST Registration Certificate", type: "Form REG-06", due: "Immediate" },
                                    { name: "GSTIN Number", type: "15 Digit ID", due: "Immediate" },
                                    { name: "Login Credentials", type: "For GST Portal", due: "Immediate" },
                                    { name: "HSN/SAC Codes List", type: "For Invoicing", due: "PDF" },
                                    { name: "Invoicing Guidelines", type: "Expert Support", due: "Consultation" }
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


                    {/* DETAILED SEO CONTENT SECTION */}
                    <section className="mt-20 space-y-12">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
                            <h2 className="text-3xl font-bold text-navy mb-8 border-b pb-4">Comprehensive Guide to Online GST Registration in India</h2>

                            <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">
                                <div>
                                    <h3 className="text-lg font-bold text-navy mb-4">What is GST (Goods and Services Tax)?</h3>
                                    <p>
                                        GST is a comprehensive, multi-stage, destination-based tax that is levied on every value addition. It has simplified the indirect tax structure in India by replacing various taxes like Excise Duty, Service Tax, VAT, and others. Registration for GST is mandatory for businesses that meet certain turnover thresholds or engage in specific types of trade.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                                            <Building size={20} className="text-bronze" /> Who Must Register?
                                        </h3>
                                        <ul className="space-y-3 list-disc pl-5">
                                            <li><strong>Threshold Limit:</strong> Service providers with turnover &gt; ₹20 Lakhs and Goods suppliers with turnover &gt; ₹40 Lakhs.</li>
                                            <li><strong>Inter-state Trade:</strong> Businesses making sales across different states.</li>
                                            <li><strong>E-commerce Sellers:</strong> Anyone selling via platforms like Amazon, Flipkart, or Myntra.</li>
                                            <li><strong>Casual Taxable Persons:</strong> Those who conduct business occasionally in a territory where they have no fixed place.</li>
                                            <li><strong>TDS/TCS Deductors:</strong> Entities required to deduct or collect tax at source.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                                            <Zap size={20} className="text-bronze" /> Major Benefits of GST
                                        </h3>
                                        <ul className="space-y-3 list-disc pl-5">
                                            <li><strong>ITC (Input Tax Credit):</strong> Claim credit for taxes paid on inputs and reduce your overall tax liability.</li>
                                            <li><strong>Legal Recognition:</strong> Operate your business as a legally recognized supplier under Indian laws.</li>
                                            <li><strong>Nationwide Sale:</strong> Ability to sell goods or services across state borders without multiple tax barriers.</li>
                                            <li><strong>Lower Compliance:</strong> Single tax system reduces the complexity of multiple tax returns.</li>
                                            <li><strong>Ease of Business:</strong> Enhanced credibility when dealing with major corporations and government tenders.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-navy mb-4">Types of GST Registrations</h3>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition">
                                            <h4 className="font-bold text-bronze mb-2">Regular Taxpayer</h4>
                                            <p className="text-sm">Standard registration for most businesses. Allows full ITC claims and periodic return filing.</p>
                                        </div>
                                        <div className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition">
                                            <h4 className="font-bold text-bronze mb-2">Composition Scheme</h4>
                                            <p className="text-sm">For small businesses with turnover up to ₹1.5 Cr. Lower tax rates but no ITC benefits.</p>
                                        </div>
                                        <div className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition">
                                            <h4 className="font-bold text-bronze mb-2">Non-Resident Taxable</h4>
                                            <p className="text-sm">For foreign businesses occasionally making supplies in India without a fixed base.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#043E52] p-8 md:p-10 rounded-3xl mt-12">
                                    <h3 className="text-3xl font-bold mb-8 text-center text-[#CFD3D9]">Why Choose ShineFiling?</h3>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {[
                                            { title: "Guaranteed ARN", icon: Award, desc: "We ensure your application is error-free, leading to instant ARN generation without rejections." },
                                            { title: "Fast-Track Filing", icon: Zap, desc: "Our priority channel ensures your application is filed within 24 hours of document submission." },
                                            { title: "Clarification Support", icon: Shield, desc: "If the Tax Officer raises a query, our CA experts draft the legal reply at no extra cost." },
                                            { title: "Compliance Guide", icon: Users, desc: "We don't just register you; we guide you on how to raise invoices and file returns correctly." }
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                                    <item.icon className="text-[#CFD3D9]" size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg mb-2 text-[#CFD3D9]">{item.title}</h4>
                                                    <p className="text-[#CFD3D9] text-sm leading-relaxed">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="mt-20 mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-navy flex items-center justify-center gap-3">
                                <HelpCircle className="text-bronze" /> Frequently Asked Questions
                            </h2>
                            <p className="text-gray-500 mt-2 font-medium">Clear your doubts about GST registration</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {faqs.map((faq, index) => (
                                <details key={index} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-bold text-gray-800 hover:bg-gray-50 transition select-none">
                                        <span className="pr-4">{faq.q}</span>
                                        <ChevronRight className="text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                                    </summary>
                                    <div className="px-6 pb-6 pt-2 text-gray-600 text-[13px] leading-relaxed border-t border-gray-50">
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
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">1. For Proprietorship</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> PAN Card of Owner</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Aadhaar Card of Owner</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Passport Size Photo</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">2. For Partnership/LLP/Company</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> PAN of the Entity</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> COI / Partnership Deed</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Authorization Letter</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">3. Address Proof (Any One)</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Electricity Bill (Mandatory)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Rent Agreement (If Rented)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> NOC from Owner</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">4. Bank Details</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Cancelled Cheque / Bank Statement</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <p className="text-xs text-blue-800 font-medium leading-relaxed flex gap-2">
                                    <Lightbulb size={24} className="text-blue-600 shrink-0" />
                                    <span><strong>Pro Tip:</strong> The Electricity Bill must be recent (less than 2 months old) and clearly show the owner's name.</span>
                                </p>
                            </div>

                            <button className="w-full mt-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition">View Plans <ArrowRight size={18} /></button>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Help?</h4>
                            <p className="text-gray-300 text-sm mb-4">Our GST experts are available 24/7 to guide you through the process.</p>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Users size={20} className="text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Call Us</p>
                                    <p className="font-bold">+91 7639227019</p>
                                </div>
                            </div>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">View Plans <ArrowRight size={18} /></button>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default GSTRegistrationPage;


