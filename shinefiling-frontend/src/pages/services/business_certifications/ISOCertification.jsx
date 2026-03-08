import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle, Award, ShieldCheck, Globe, HelpCircle, FileText, Star,
    BookOpen, Clock, Zap, ChevronRight, ArrowRight, UserCheck, Lock,
    Leaf, Briefcase, BarChart, Settings, MousePointer, Shield, X, Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '../../../components/auth/AuthModal';
import ApplyISOCertification from './ApplyISOCertification';

const ISOCertification = ({ isLoggedIn }) => {
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

    const standards = [
        {
            code: "ISO 9001:2015",
            name: "Quality Management System (QMS)",
            desc: "The world's most recognized quality management standard. It ensures that your products and services consistently meet customer requirements, and that quality is consistently improved.",
            icon: Star,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            code: "ISO 14001:2015",
            name: "Environmental Management System (EMS)",
            desc: "Helps organizations improve their environmental performance through more efficient use of resources and reduction of waste, gaining a competitive advantage and the trust of stakeholders.",
            icon: Leaf,
            color: "text-green-600",
            bg: "bg-green-600/10"
        },
        {
            code: "ISO 27001:2013",
            name: "Information Security Management (ISMS)",
            desc: "Provides a framework for Information Security Management Systems (ISMS) to provide continued confidentiality, integrity and availability of information as well as legal compliance.",
            icon: Lock,
            color: "text-blue-600",
            bg: "bg-blue-600/10"
        }
    ];

    const faqs = [
        { q: "What is ISO Certification?", a: "ISO certification is a seal of approval from a third-party body that a company runs to one of the international standards developed and published by the International Organization for Standardization (ISO)." },
        { q: "What is the difference between IAF and Non-IAF?", a: "IAF (International Accreditation Forum) certificates are globally recognized and usually required for government tenders. Non-IAF certificates are for branding purposes and are faster to obtain but less authoritative." },
        { q: "How long does the process take?", a: "For Non-IAF, it can be done in 2-4 days. For IAF accredited certificates, the process typically takes 15-30 days pending audits." },
        { q: "Is a physical audit mandatory?", a: "For IAF ISO certification, a physical or remote video audit by the certifying body is often establishing compliance. For Non-IAF, it is document-based." },
        { q: "What is the validity of the certificate?", a: "ISO certificates are valid for 3 years, subject to successful completion of annual surveillance audits." },
        { q: "Can I get ISO 9001 and 14001 together?", a: "Yes, this is called an Integrated Management System (IMS). It is cost-effective and streamlined to implement multiple standards simultaneously." },
        { q: "What documents are required?", a: "Scope of business, letterhead, GST/Registration certificate, and internal process documentation (SOPs) which we help prepare." },
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2071"
                        alt="Global Standards"
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
                                    <Globe size={12} className="fill-bronze" /> Global Standards
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    ISO <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Certification</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Build trust and credibility with <strong>ISO 9001, 14001, & 27001</strong> certification. Demonstrate your commitment to quality, environment, and security.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Quality</p>
                                        <p className="font-bold text-sm text-white">Assured</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Globe size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Recognition</p>
                                        <p className="font-bold text-sm text-white">Global</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Get Certified
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <BookOpen size={18} /> View Standards
                                </button>
                            </div>
                        </div>

                        {/* Trust Card - Official Application (Replaces Pricing Card) - WHITE THEME COMPACT */}
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
                                        Official <br />Certification
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">ISO 9001 / 14001 / 27001</p>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-slate-100 mb-5"></div>

                                {/* Stats Grid - COMPACT */}
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    {/* Left Stat */}
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <CheckCircle size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">100%</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Success <br />Rate</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>

                                    {/* Right Stat */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Lock size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Fast</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Processing <br />Time</p>
                                    </div>
                                </div>

                                {/* Check List - COMPACT */}
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "Global Recognition",
                                        "Tender Eligibility",
                                        "Valid for 3 Years"
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
                                    Select Plan <ArrowRight size={16} />
                                </button>

                                <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
                                    Affordable packages for all businesses
                                </p>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>

            {/* PRICING PLANS SECTION */}
            <section id="pricing-plans" className="py-20 px-6 lg:px-12 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Our Packages</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Choose Your Plan</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* PLAN 1: ESSENTIAL (Non-IAF) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Essential</h3>
                            <p className="text-slate-500 text-sm mb-6">Fastest certification for branding.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹1,499</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">₹3,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "ISO 9001:2015",
                                    "Non-IAF Certificate",
                                    "Digital Copy",
                                    "Branding Support"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('essential')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Essential</button>
                        </motion.div>

                        {/* PLAN 2: PROFESSIONAL (IAF) - POPULAR */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Most Popular</div>

                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Professional</h3>
                            <p className="text-gray-400 text-sm mb-6">Globally accepted IAF certificate.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹3,999</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹7,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "ISO 9001:2015 (IAF)",
                                    "Global Acceptance",
                                    "Valid for Tenders",
                                    "Full Documentation"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('professional')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Choose Professional</button>
                        </motion.div>

                        {/* PLAN 3: ENTERPRISE (Integrated) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Enterprise</h3>
                            <p className="text-slate-500 text-sm mb-6">QMS + EMS Integrated.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-3xl font-black text-navy">₹6,999</span>
                                <span className="text-slate-400 line-through text-sm">₹12,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "ISO 9001 + 14001",
                                    "Integrated Audit",
                                    "Priority Support",
                                    "Consultant Included",
                                    "Certification Audit"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('enterprise')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Enterprise</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* EXTENSIVE CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT CONTENT COLUMN (8 Cols) */}
                <div id="details-section" className="lg:col-span-8 space-y-20">

                    {/* Standards Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <BookOpen className="text-bronze" /> Our Standards
                        </h2>
                        <div className="space-y-6">
                            {standards.map((std, i) => (
                                <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 group hover:shadow-lg hover:border-bronze/30 transition-all duration-300">
                                    <div className={`w-16 h-16 ${std.bg} ${std.color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                        <std.icon size={32} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-navy">{std.name}</h3>
                                            <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full uppercase">{std.code}</span>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">{std.desc}</p>
                                        <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="text-bronze font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                                            Get Quote <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* How it Works / Process */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Certification Process</h2>
                        <div className="relative">
                            {/* Vertical Line */}
                            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-bronze/20 via-bronze/50 to-bronze/20 md:hidden"></div>

                            <div className="space-y-8">
                                {[
                                    { title: "Application & Consulting", desc: "We analyze your business scope and select the appropriate standard and certifying body (IAF/Non-IAF)." },
                                    { title: "Documentation", desc: "Our experts prepare the required Quality Manuals, SOPs, and Policy documents for your approval." },
                                    { title: "Implementation", desc: "You implement the documented processes in your daily operations to ensure compliance." },
                                    { title: "Auditing", desc: "An external auditor reviews your documents and processes (Physical or Video audit depending on standard)." },
                                    { title: "Certification", desc: "Upon successful audit, the ISO Certificate is issued, valid for 3 years." }
                                ].map((step, i) => (
                                    <div key={i} className="relative flex gap-6 items-start group">
                                        <div className="hidden md:block absolute left-8 top-12 bottom-[-2rem] w-0.5 bg-gray-100 group-last:hidden"></div>
                                        <div className="w-16 h-16 rounded-full bg-white border-4 border-gray-50 text-navy font-bold text-xl flex items-center justify-center shadow-sm shrink-0 z-10 group-hover:border-bronze group-hover:text-bronze transition-colors">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                                            <h3 className="text-lg font-bold text-navy mb-2">{step.title}</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Benefits Grid */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Why Get Certified?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Tender Eligibility", desc: "Mandatory qualification for most Govt and large corporate tenders.", icon: FileText },
                                { title: "Global Recognition", desc: "Enhances your brand image globally and builds customer trust.", icon: Globe },
                                { title: "Internal Efficiency", desc: "Standardized processes lead to fewer errors and higher productivity.", icon: Settings },
                                { title: "Marketing Edge", desc: "Use the ISO mark on your website, products, and letterheads.", icon: Zap },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-bronze transition group">
                                    <div className="w-14 h-14 rounded-2xl bg-[#2B3446]/5 group-hover:bg-[#2B3446] group-hover:text-bronze flex items-center justify-center text-navy flex-shrink-0 transition-all duration-300">
                                        <item.icon size={28} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-navy mb-2 text-lg">{item.title}</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>



                    {/* Why Choose ShineFiling - SEO Section */}
                    <section className="bg-gradient-to-br from-[#043E52] to-navy p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-bronze/10 rounded-full blur-3xl"></div>
                        <h2 className="text-3xl font-bold mb-6 relative z-10">Why Choose ShineFiling?</h2>
                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            {[
                                { t: "Expert Auditors", d: "We partner with top global certifying bodies to ensure your certificate is universally accepted." },
                                { t: "100% Approval Rate", d: "Our internal audit team reviews your documents before final submission to guarantee success." },
                                { t: "Fast Track Process", d: "Get Non-IAF certificates in as little as 48 hours for urgent tender requirements." },
                                { t: "End-to-End Support", d: "From SOP drafting to final audit coordination, we handle everything for you." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{item.t}</h4>
                                        <p className="text-gray-300 text-sm">{item.d}</p>
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
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Mandatory</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Company Registration</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Letterhead & Invoices</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> PAN & GST</li>
                                    </ul>
                                </div>
                                <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <p className="text-xs text-blue-800 font-medium leading-relaxed flex gap-2">
                                        <Lightbulb size={24} className="text-blue-600 shrink-0" />
                                        <span><strong>Pro Tip:</strong> Decide if you need IAF or Non-IAF based on your tender requirements.</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Not sure which ISO?</h4>
                            <p className="text-gray-300 text-sm mb-4">Our consultants will help you pick the right standard.</p>
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
                            <ApplyISOCertification
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

export default ISOCertification;


