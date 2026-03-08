import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, FileText, Rocket, Utensils, Award, Shield, MapPin, Truck, ChevronRight, HelpCircle, Users, BookOpen, Scale, Globe, Briefcase, Zap, Star, ArrowRight, Building, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FSSAILicenseRegistration from './FSSAILicenseRegistration';
import AuthModal from '../../../components/auth/AuthModal';

const FSSAILicensePage = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('basic');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "Is FSSAI mandatory for home kitchens?", a: "Yes, even small home bakers or cloud kitchens selling food need at least a Basic Registration." },
        { q: "What is the validity of the license?", a: "You can choose between 1 to 5 years. Longer validity saves renewal hassle and fees." },
        { q: "Difference between Registration & License?", a: "Registration (Form A) is for turnover < ₹12 Lakhs. License (Form B) is for turnover > ₹12 Lakhs." },
        { q: "Do I need a license for each branch?", a: "Yes, every premise where food is handled needs a separate license. A Central License is needed for Head Office if you have branches in multiple states." },
        { q: "Is physical inspection required?", a: "For State and Central licenses, a Food Safety Officer usually inspects the premises before granting the license." },
    ];

    const handlePlanSelect = (turnoverType) => {
        setSelectedPlan(turnoverType);
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
                            <FSSAILicenseRegistration
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

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=2070"
                        alt="Food Safety"
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
                                    <Utensils size={12} className="fill-bronze" /> Food Safety Authority
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    FSSAI Food <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">License</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Mandatory for every food business, from home bakers to large manufacturers. Ensure quality, build trust, and operate legally with a valid 14-digit FSSAI number.
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
                                        <Award size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Compliance</p>
                                        <p className="font-bold text-sm text-white">Mandatory</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Clock size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time</p>
                                        <p className="font-bold text-sm text-white">7-10 Days</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Apply Now
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Learn More
                                </button>
                            </div>
                        </div>

                        {/* Trust Card - Official Registration */}
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
                                    <h3 className="text-navy font-bold text-2xl leading-tight">Official <br />FSSAI Registration</h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Food Safety Authority (FOSCOS)</p>
                                </div>
                                <div className="h-px w-full bg-slate-100 mb-5"></div>
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Building size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">100%</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Secure <br />Process</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Shield size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Legal</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">FSSAI <br />Compliance</p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "14-Digit FSSAI Number",
                                        "Digital License Copy",
                                        "Food Quality Seal"
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
                                    Start Application <ArrowRight size={16} />
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
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Transparent Pricing Plans</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                        <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
                            Whether you are a home-based business, a mid-sized operator, or a large-scale manufacturer, we have the right FSSAI plan for you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Basic Registration */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Basic Registration</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹1,499</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">TURNOVER {'<'} ₹12L</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                {[
                                    "Form A Application Filing",
                                    "FSSAI Number Generation",
                                    "1 Year Validity Inclusion",
                                    "Certificate Dispatch (Soft)",
                                    "Expert Advisory Support"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('basic')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Basic</button>
                        </motion.div>

                        {/* State License - Recommended */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Recommended</div>
                            <h3 className="text-lg font-bold text-white mb-2 mt-1">State License</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹4,999</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹7,000</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                <li className="text-xs font-bold text-[#D9A55B] uppercase tracking-wider border-b border-white/10 pb-2">Everything in Basic +</li>
                                {[
                                    "Turnover ₹12L - ₹20Cr",
                                    "State Authority Liaison",
                                    "Drafting & Documentation",
                                    "Food Safety Audit Help",
                                    "Priority Professional Aid"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('state')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Get State License</button>
                        </motion.div>

                        {/* Central License */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Central License</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy">₹7,499</span>
                                <span className="text-slate-400 line-through text-xs">₹12,000</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                <li className="text-xs font-bold text-navy uppercase tracking-wider border-b border-gray-100 pb-2">Everything in State +</li>
                                {[
                                    "Turnover > ₹20Cr",
                                    "Importer/Exporter Class",
                                    "Multi-State Operations",
                                    "Govt Department Liaison",
                                    "Premium Account Support"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('central')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Central</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* EXISTING LICENSE SERVICES (Renewal & Correction) */}
            <section className="bg-white relative overflow-hidden rounded-3xl p-8 border border-gray-100 shadow-sm mb-20">
                <div className="text-center mb-10">
                    <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Maintain Your License</span>
                    <h2 className="text-3xl font-bold text-navy mb-4">Renewal & Corrections</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Already have an FSSAI license? We handle renewals and modifications to keep you compliant.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Renewal */}
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 relative group flex flex-col">
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-red-600 to-red-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest z-10 shadow-lg">Time Critical</div>
                        <h3 className="text-xl font-bold text-navy mb-2">License Renewal</h3>
                        <div className="flex items-center gap-2 mb-4 text-navy">
                            <span className="text-4xl font-black">₹999</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">RENEWAL FEE</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-6 leading-relaxed">Ensure uninterrupted business operations with timely FSSAI extension.</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            {[
                                "30-Day Pre-Expiry Filing",
                                "Avoid ₹100/Day Penalty",
                                "1-5 Year Validity Extension",
                                "Complete Compliance Audit"
                            ].map((feat, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                    <CheckCircle size={16} className="text-green-500 shrink-0" /> {feat}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => handlePlanSelect('renewal')} className="w-full py-3.5 rounded-xl bg-navy text-white font-bold hover:bg-black transition-all shadow-lg shadow-navy/20">Apply for Renewal</button>
                    </div>

                    {/* Modification */}
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 relative group flex flex-col">
                        <h3 className="text-xl font-bold text-navy mb-2">Modification</h3>
                        <div className="flex items-center gap-2 mb-4 text-navy">
                            <span className="text-4xl font-black">₹1,499</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">CORRECTIONS</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-6 leading-relaxed">Update details, add products or shift premises on your existing license.</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            {[
                                "Premises/Address Change",
                                "New Food Category Addition",
                                "Partner/Director Updates",
                                "Business Name Amendment"
                            ].map((feat, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                    <CheckCircle size={16} className="text-green-500 shrink-0" /> {feat}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => handlePlanSelect('modification')} className="w-full py-3.5 rounded-xl border-2 border-slate-200 text-navy font-bold hover:bg-slate-50 transition-all">Start Modification</button>
                    </div>
                </div>
            </section>

            {/* EXTENSIVE CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT CONTENT COLUMN (8 Cols) */}
                <div id="details-section" className="lg:col-span-8 space-y-20">

                    {/* DETAILED SEO CONTENT SECTION - COMPREHENSIVE GUIDE */}
                    <section className="mt-10 space-y-12 mb-20">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
                            <h2 className="text-3xl font-bold text-navy mb-8 border-b pb-4">Comprehensive Guide to FSSAI Licensing</h2>

                            <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">
                                {/* Introduction */}
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                        <BookOpen className="text-bronze" /> What is FSSAI License?
                                    </h3>
                                    <p className="lead text-xl text-gray-800 font-medium">
                                        The Food Safety and Standards Authority of India (FSSAI) is the governing body that regulates the food business in India. An FSSAI license (14-digit number) is mandatory for any business involved in food manufacturing, processing, storage, distribution, or sale.
                                    </p>
                                    <p>
                                        It ensures that the food products undergo certain quality checks, thereby reducing instances of food adulteration and substandard products. It essentially acts as a seal of approval and safety for customers.
                                    </p>
                                </div>

                                {/* License Types Guide */}
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-xl font-bold text-navy mb-4">Types of FSSAI Registrations</h3>
                                    <div className="grid md:grid-cols-1 gap-6">
                                        {[
                                            { title: "Basic Registration (Form A)", criteria: "Turnover < ₹12 Lakhs / Year", desc: "For petty food business operators, hawkers, home bakers, and small stalls.", icon: Utensils },
                                            { title: "State License (Form B)", criteria: "Turnover ₹12 Lakhs - ₹20 Crore / Year", desc: "For mid-sized manufacturers, distributors, hotels, and restaurants operating in a single state.", icon: Building },
                                            { title: "Central License (Form B)", criteria: "Turnover > ₹20 Crore / Year", desc: "For large manufacturers, importers, exporters, and businesses supplying to government offices or operating in multiple states.", icon: Globe },
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4 p-4 border rounded-xl bg-white">
                                                <div className="mt-1"><item.icon size={24} className="text-bronze" /></div>
                                                <div>
                                                    <h4 className="font-bold text-navy text-lg">{item.title} <span className="text-sm font-normal text-gray-500 ml-2">({item.criteria})</span></h4>
                                                    <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Comparison Table */}
                                <div className="overflow-x-auto rounded-xl border border-gray-200">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-[#2B3446] text-white">
                                            <tr>
                                                <th className="px-6 py-4">Feature</th>
                                                <th className="px-6 py-4 bg-white/10">Basic</th>
                                                <th className="px-6 py-4">State</th>
                                                <th className="px-6 py-4">Central</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-navy">Annual Turnover</td><td className="px-6 py-4 text-gray-600">Up to ₹12 Lakhs</td><td className="px-6 py-4 text-gray-600">₹12 Lakhs - ₹20 Cr</td><td className="px-6 py-4 text-gray-600">Above ₹20 Cr</td></tr>
                                            <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-navy">Form Type</td><td className="px-6 py-4 text-gray-600">Form A</td><td className="px-6 py-4 text-gray-600">Form B</td><td className="px-6 py-4 text-gray-600">Form B</td></tr>
                                            <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-navy">Govt Fee (Approx)</td><td className="px-6 py-4 text-gray-600">₹100 / Year</td><td className="px-6 py-4 text-gray-600">₹2000 - ₹5000 / Year</td><td className="px-6 py-4 text-gray-600">₹7500 / Year</td></tr>
                                            <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-navy">Inspection</td><td className="px-6 py-4 text-gray-600">Rare</td><td className="px-6 py-4 text-gray-600">Likely</td><td className="px-6 py-4 text-gray-600">Mandatory</td></tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Renewal & Penalties */}
                                <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8">
                                    <h3 className="text-2xl font-bold text-navy mb-2 flex items-center gap-2"><Shield size={24} className="text-orange-500" /> Compliance & Renewal</h3>
                                    <p className="text-gray-700 leading-relaxed max-w-2xl mb-4">
                                        FSSAI license is issued for a specific period (1 to 5 years). It must be renewed <strong>30 days before expiry</strong>.
                                    </p>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2 text-orange-800 font-bold">
                                            <ChevronRight size={16} /> Late Renewal Penalty: ₹100 per day
                                        </li>
                                        <li className="flex items-center gap-2 text-orange-800 font-bold">
                                            <ChevronRight size={16} /> Operating without License: Fine up to ₹5 Lakhs & Imprisonment (Section 63)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* MANDATORY DELIVERABLES */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold text-navy mb-8">What You Will Receive</h2>
                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="p-6 bg-navy text-white">
                                <p className="text-sm opacity-80">Official documents you get after approval.</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[
                                    { name: "FSSAI Registration Certificate", type: "Digital Copy", due: "Approval" },
                                    { name: "14-Digit License Number", type: "Unique ID", due: "Immediate" },
                                    { name: "QR Code Food Safety Display Board", type: "Compliance", due: "Mandatory" },
                                    { name: "Application Receipt", type: "Proof", due: "Day 1" },
                                    { name: "Guidance on Annual Returns", type: "Support", due: "Lifetime" }
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

                        {/* Checklist Sidebar */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Documents Needed
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Common Documents</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> ID Proof/Photo of Owner</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Proof of Possession of Premise</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">State/Central Only</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> List of Food Products</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Form IX (Nomination)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Blueprint/Layout Plan</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Help?</h4>
                            <p className="text-gray-300 text-sm mb-4">Confused about State vs Central License category?</p>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">View Plans <ArrowRight size={18} /></button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FSSAILicensePage;


