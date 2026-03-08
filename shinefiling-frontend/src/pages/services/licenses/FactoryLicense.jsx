import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, BookOpen, Scale, Globe, Briefcase, Award, ArrowRight, Rocket, X, Factory, Building, Gavel } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FactoryLicenseRegistration from './FactoryLicenseRegistration';
import AuthModal from '../../../components/auth/AuthModal';

const FactoryLicensePage = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('comprehensive');
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
        { q: "What is a Factory License?", a: "A license granted by the Chief Inspector of Factories to use a premise as a factory under the Factories Act, 1948." },
        { q: "Who needs it?", a: "Any premise where 10+ workers are working with power, or 20+ workers without power, manufacturing process is being carried on." },
        { q: "Is Plan Approval needed?", a: "Yes, before building a factory or installing machinery, the factory plan must be approved by the Director of Factories." },
        { q: "Validity?", a: "Generally valid for 1 to 5 years (depending on state rules) and needs renewal." },
        { q: "Is inspection mandatory?", a: "Yes, a factory inspector will visit the premises to check safety, health, and welfare measures." },
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
                            <FactoryLicenseRegistration
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
                        src="https://images.unsplash.com/photo-1565514020176-db792f3b764c?auto=format&fit=crop&q=80&w=2070"
                        alt="Factory Interior"
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
                                    <Factory size={12} className="fill-bronze" /> Factories Act, 1948
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Factory <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">License</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Complete compliance for manufacturing units—from Site Plan Approval to Final Licensing. Ensuring safety and health for your workforce.
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
                                        <Users size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">With Power</p>
                                        <p className="font-bold text-sm text-white">10+ Workers</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Clock size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Timeframe</p>
                                        <p className="font-bold text-sm text-white">30-60 Days</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Start Approval
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
                                            <Factory size={28} className="text-bronze fill-bronze/20" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle size={14} className="text-green-500 fill-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">Official <br />Factory License</h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Factories Act Compliance</p>
                                </div>
                                <div className="h-px w-full bg-slate-100 mb-5"></div>
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Users size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Legal</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Regulatory <br />Approved</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Shield size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Fast</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">DISH <br />Liaison</p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "Site Plan Approval",
                                        "Stability Cert Aid",
                                        "Form 2 Submission"
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
                                    Get Approval <ArrowRight size={16} />
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
                            Ensure your manufacturing unit is fully compliant with the Factories Act, 1948.
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
                                <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹1,999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">EXPERT REVIEW</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                {[
                                    "Unit Applicability Audit",
                                    "Safety Measures Check",
                                    "Ventilation Norm Guide",
                                    "NOC Requirement Map",
                                    "Penalty Assessment"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('advisory')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Advisory</button>
                        </motion.div>

                        {/* Standard - Full Approval (Recommended) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Recommended</div>
                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Full Approval</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹14,999</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹20,000</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                <li className="text-xs font-bold text-[#D9A55B] uppercase tracking-wider border-b border-white/10 pb-2">Everything in Advisory +</li>
                                {[
                                    "Site Plan Approval Filing",
                                    "Stability Cert Liaison",
                                    "Machinery Layout Prep",
                                    "Form 2 Filing (License)",
                                    "DISH Office Follow-up"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('comprehensive')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm uppercase tracking-wider">Start Approval</button>
                        </motion.div>

                        {/* License Only */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">License Only</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy">₹7,999</span>
                                <span className="text-slate-400 line-through text-xs">₹12,000</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                <li className="text-xs font-bold text-navy uppercase tracking-wider border-b border-gray-100 pb-2">For Approved Plans +</li>
                                {[
                                    "Form 4 Application Filing",
                                    "Document Re-Audit",
                                    "Fee Challan Support",
                                    "License Grant Tracking",
                                    "Inspection Prep Guide"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('basic')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm uppercase">Apply Basic</button>
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
                            <h2 className="text-3xl font-bold text-navy mb-8 border-b pb-4">Comprehensive Guide to Factory Act Compliance</h2>

                            <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">
                                {/* Introduction */}
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                        <Factory className="text-bronze" /> Manufacturing Compliance in India
                                    </h3>
                                    <p className="lead text-xl text-gray-800 font-medium">
                                        Under the <strong>Factories Act, 1948</strong>, every factory owner must obtain prior approval of building plans and a factory license before commencing manufacturing operations.
                                    </p>
                                    <p>
                                        The license is granted by the <strong>Chief Inspector of Factories</strong> (Director of Industrial Safety & Health - DISH) and acts as the primary document proving that your unit complies with all statutory health, safety, and welfare norms.
                                    </p>
                                </div>

                                {/* Who Needs It Grid */}
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-xl font-bold text-navy mb-4">Who Must Apply?</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Zap size={24} /></div>
                                                <h4 className="font-bold text-navy text-lg">With Power</h4>
                                            </div>
                                            <p className="text-gray-600">Any premises where <strong className="text-navy">10 or more workers</strong> are working, and a manufacturing process is carried on with the aid of power.</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Users size={24} /></div>
                                                <h4 className="font-bold text-navy text-lg">Without Power</h4>
                                            </div>
                                            <p className="text-gray-600">Any premises where <strong className="text-navy">20 or more workers</strong> are working, and a manufacturing process is carried on without the aid of power.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* The Process Steps */}
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-6">The 3-Stage Licensing Process</h3>
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bronze text-white flex items-center justify-center font-bold">1</div>
                                            <div>
                                                <h4 className="text-lg font-bold text-navy">Plan Approval</h4>
                                                <p className="text-sm text-gray-600 mt-1">Submission of factory blueprints (Site Plan, Layout Plan) to the Director of Factories for approval before construction or installation of machinery.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bronze text-white flex items-center justify-center font-bold">2</div>
                                            <div>
                                                <h4 className="text-lg font-bold text-navy">License Application (Form 2)</h4>
                                                <p className="text-sm text-gray-600 mt-1">Once plans are approved and the factory is ready, apply for the grant of license along with fee payment.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bronze text-white flex items-center justify-center font-bold">3</div>
                                            <div>
                                                <h4 className="text-lg font-bold text-navy">Inspection & Grant</h4>
                                                <p className="text-sm text-gray-600 mt-1">A Factory Inspector will visit the premises to verify safety measures. If satisfied, the license is granted.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* MANDATORY DELIVERABLES */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold text-navy mb-8">What You Will Receive</h2>
                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="p-6 bg-navy text-white">
                                <p className="text-sm opacity-80">Official department documents.</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[
                                    { name: "Factory License (Form 4)", type: "Digital / Physical", due: "Approval" },
                                    { name: "Approved Blueprints", type: "Plan Approval", due: "Stage 1" },
                                    { name: "Stability Certificate", type: "Signed by Engineer", due: "Submission" },
                                    { name: "Payment Receipt", type: "Challan", due: "Day 1" },
                                    { name: "Compliance Registers Guide", type: "Support", due: "Lifetime" }
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
                                        <h4 className="font-bold text-lg">Detailed Drawing Support</h4>
                                        <p className="text-gray-300 text-sm">We assist in preparing factory layout plans as per rule, ensuring ventilation and safety norms are met.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Department Liaison</h4>
                                        <p className="text-gray-300 text-sm">We handle the follow-ups with the Chief Inspector of Factories so you can focus on production.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Gavel size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Stability Certificate</h4>
                                        <p className="text-gray-300 text-sm">We connect you with authorized competent persons to get the mandatory structural stability certificate.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Timely Renewals</h4>
                                        <p className="text-gray-300 text-sm">We proactively track your license expiry and initiate renewal to prevent heavy penalties.</p>
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
                                <FileText className="text-bronze" /> Required Documents
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">For Plan Approval</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Form No. 1 (Application)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> ID & Address Proof</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Site Plan & Layout</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">For Final License</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Form No. 2</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Plan Approval Letter</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Stability Certificate</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Help?</h4>
                            <p className="text-gray-300 text-sm mb-4">We help with factory drawings and stability certificates.</p>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">View Plans <ArrowRight size={18} /></button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FactoryLicensePage;


