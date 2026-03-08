import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, Shield, CheckCircle, FileText, Truck, Database, Award, BookOpen, Briefcase, Clock, Zap, HelpCircle, ChevronRight, Star, ArrowRight, UserCheck, Factory, X, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DrugLicenseRegistration from './DrugLicenseRegistration';
import AuthModal from '../../../components/auth/AuthModal';

const DrugLicensePage = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('standard');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        if (isLoggedIn) {
            setShowRegistrationModal(true);
        } else {
            setAuthMode('login');
            setShowAuthModal(true);
        }
    };

    const faqs = [
        { q: "Who needs a Drug License?", a: "Anyone who wants to start a pharmacy, medical store, wholesale drug business, or manufacturing unit for Sell/Distribution of drugs." },
        { q: "Is a Pharmacist mandatory?", a: "Yes, for retail drug license (Form 20/21), a registered pharmacist is mandatory. For wholesale, a competent person (graduate with experience) is required." },
        { q: "What are Form 20 and 21?", a: "Form 20 is for Allopathic drugs, and Form 21 is for Schedule C & C1 drugs. Usually, both are applied together." },
        { q: "Minimum area required?", a: "For Retail or Wholesale: 10 sq. meters. For Retail + Wholesale: 15 sq. meters. A refrigerator is also mandatory." },
    ];

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
                            <DrugLicenseRegistration
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
                        src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=2079"
                        alt="Pharmacy Medical Store"
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
                                    <Pill size={12} className="fill-bronze" /> Pharmacy & Healthcare
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Drug <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">License</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Start your Medical Store, Pharmacy, or Wholesale Drug Distribution business. Complete compliance under the Drugs & Cosmetics Act, 1940.
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
                                        <Briefcase size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Business</p>
                                        <p className="font-bold text-sm text-white">Retail / Wholesale</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Compliance</p>
                                        <p className="font-bold text-sm text-white">Strict Norms</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Apply Now
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <BookOpen size={18} /> Learn More
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
                                    <h3 className="text-navy font-bold text-2xl leading-tight">Official <br />Drug License</h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Drugs & Cosmetics Act</p>
                                </div>
                                <div className="h-px w-full bg-slate-100 mb-5"></div>
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Building size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Legal</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Pharmacy <br />Compliant</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Shield size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Fast</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Expert <br />Guidance</p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "Retail/Wholesale Pass",
                                        "Digital Certificate",
                                        "Pharma Compliance Check"
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
                            Setup your medical store or drug distribution unit with our expert legal support.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Advisory */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Advisory</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">EXPERT REVIEW</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                {[
                                    "Premises Eligibility Audit",
                                    "Pharmacist Doc Review",
                                    "Refrigerator Bill Guidance",
                                    "Legal Affidavit Drafting",
                                    "Category Selection Aid"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('advisory')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Advisory</button>
                        </motion.div>

                        {/* Standard - Recommended */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Recommended</div>
                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Retail / Wholesale</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹7,999</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹11,500</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                <li className="text-xs font-bold text-[#D9A55B] uppercase tracking-wider border-b border-white/10 pb-2">Everything in Advisory +</li>
                                {[
                                    "Form 20/21 Filing",
                                    "Pharmacist Doc Linking",
                                    "Layout Plan Support",
                                    "Drug Inspector Liaison",
                                    "Approval Tracking Aid"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Get License</button>
                        </motion.div>

                        {/* Manufacturing */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Manufacturing</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy">₹24,999</span>
                                <span className="text-slate-400 line-through text-xs">₹35,000</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                <li className="text-xs font-bold text-navy uppercase tracking-wider border-b border-gray-100 pb-2">Everything in Standard +</li>
                                {[
                                    "Site Master File Prep",
                                    "GMP Compliance Consult",
                                    "Laboratory Standards Audit",
                                    "Mfr. Staff Approval Aid",
                                    "Direct ADC Liaisoning"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('manufacturing')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Manufacturing</button>
                        </motion.div>
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
                            <h2 className="text-3xl font-bold text-navy mb-8 border-b pb-4">Comprehensive Guide to Drug License</h2>

                            <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">
                                {/* Introduction */}
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                        <BookOpen className="text-bronze" /> Pharmacy Business in India
                                    </h3>
                                    <p className="lead text-xl text-gray-800 font-medium">
                                        The <strong>Drugs and Cosmetics Act, 1940</strong> regulates the import, manufacture, and distribution of drugs in India. A valid Drug License is the most critical requirement to open a chemist shop (Retail) or distribution agency (Wholesale).
                                    </p>
                                    <p>
                                        It ensures that drugs are handled by qualified personnel (Pharmacists) and stored properly (e.g., cold storage for vaccines) to maintain their efficacy.
                                    </p>
                                </div>

                                {/* Business Scope Grid */}
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-xl font-bold text-navy mb-4">Types of Licenses</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {[
                                            { title: "Retail Drug License", desc: "For chemist shops selling directly to consumers (Form 20/21). Requires a Registered Pharmacist.", icon: Briefcase },
                                            { title: "Wholesale Drug License", desc: "For distributors selling to retailers/hospitals (Form 20B/21B). Requires a Competent Person.", icon: Truck },
                                            { title: "Manufacturing License", desc: "For units producing Ayurvedic or Allopathic medicines. Requires strict GMP compliance.", icon: Factory },
                                            { title: "Loan License", desc: "For marketers who do not own a factory but use another's facility for manufacturing.", icon: UserCheck },
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4 p-4 border rounded-xl bg-white hover:shadow-sm transition">
                                                <div className="mt-1"><item.icon size={24} className="text-bronze" /></div>
                                                <div>
                                                    <h4 className="font-bold text-navy text-lg">{item.title}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Requirements List */}
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4">Core Requirements</h3>
                                    <ul className="grid md:grid-cols-2 gap-3 list-none pl-0">
                                        {[
                                            "Minimum Area: 10 Sq. Meters (Retail/Wholesale)",
                                            "Minimum Area: 15 Sq. Meters (Retail + Wholesale)",
                                            "Refrigerator (Cold Storage Facility)",
                                            "Registered Pharmacist (for Retail)",
                                            "Competent Person (Graduate) (for Wholesale)",
                                            "Commercial Premises Proof"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-blue-50/50 p-3 rounded-lg border border-blue-50">
                                                <CheckCircle size={16} className="text-bronze" /> {item}
                                            </li>
                                        ))}
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
                                <p className="text-sm opacity-80">Official state drug control department documents.</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[
                                    { name: "Drug License Certificate (Form 20/21)", type: "Digital / Physical", due: "Approval" },
                                    { name: "Approved Layout Plan", type: "Blue Print", due: "Process" },
                                    { name: "Pharmacist Registration Linking", type: "Compliance", due: "Immediate" },
                                    { name: "Application Receipt & Challan", type: "Proof", due: "Day 1" },
                                    { name: "Renewals & Retention Guide", type: "Support", due: "Lifetime" }
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

                        <h2 className="text-3xl font-bold mb-6 relative z-10">Why Choose ShineFiling?</h2>
                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Pharma Expertise</h4>
                                        <p className="text-gray-300 text-sm">We specialize in Drug Laws and understand the nuances of cold chain storage and pharmacist requirements.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Department Liaison</h4>
                                        <p className="text-gray-300 text-sm">We handle follow-ups with Drug Inspectors and Assistant Drug Controllers (ADCs) to expedite your file.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Documentation Support</h4>
                                        <p className="text-gray-300 text-sm">From rent agreements to refrigerator purchase bills and affidavits, we draft everything for you.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Retention Alerts</h4>
                                        <p className="text-gray-300 text-sm">Drug licenses need retention fees payment every 5 years. We ensure you never miss a deadline.</p>
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

                {/* RIGHT SIDEBAR (4 Cols) */}
                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">

                        {/* Documents Sidebar */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Documents Needed
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Premises</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Rent Agreement (10 sq.m+)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Site Plan / Layout</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Refrigerator Purchase Bill</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Technical Staff</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Pharmacist Registration Cert</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Academic Qualification</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need a Pharmacist?</h4>
                            <p className="text-gray-300 text-sm mb-4">We can guide you on hiring registered pharmacists.</p>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">View Plans <ArrowRight size={18} /></button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DrugLicensePage;


