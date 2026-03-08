import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SERVICE_DATA } from '../data/services';
import { getInactiveServices } from '../utils/serviceManager';
import { getServiceCatalog } from '../api';
import {
    FileText, Shield, Zap, CheckCircle, ArrowRight, Star,
    Briefcase, Landmark, PenTool, Menu, X, Search, ChevronDown, User, Play,
    Database, Building, GraduationCap, Truck, Lock, Instagram, Twitter, Linkedin, Facebook,
    MapPin, Phone, Mail, Globe, Cpu
} from 'lucide-react';

const HomePage = ({ isLoggedIn, onLogout }) => {
    // State for service visibility
    const [inactiveIds, setInactiveIds] = useState([]);

    const [apiCatalog, setApiCatalog] = useState([]);

    useEffect(() => {
        const syncStatus = async () => {
            const stored = getInactiveServices();
            setInactiveIds(stored);
            try {
                const catalog = await getServiceCatalog();
                if (Array.isArray(catalog)) setApiCatalog(catalog);
            } catch (e) { console.error("Home Catalog Fetch Error", e); }
        };

        // Initial load
        syncStatus();

        // Listen for same-tab updates
        window.addEventListener('serviceStatusChanged', syncStatus);
        window.addEventListener('storage', syncStatus);

        return () => {
            window.removeEventListener('serviceStatusChanged', syncStatus);
            window.removeEventListener('storage', syncStatus);
        };
    }, []);

    // Filter SERVICE_DATA based on inactive status
    // Filter SERVICE_DATA based on visible status (API + Local)
    const visibleServices = useMemo(() => {
        const filtered = {};
        Object.values(SERVICE_DATA).forEach(cat => {
            const visibleItems = cat.items.filter((item, index) => {
                // 1. Check API Status by Name
                const apiService = apiCatalog.find(s => s.name === item);
                if (apiService && apiService.status === 'INACTIVE') return false;

                // 2. Check Local Inactive List
                // We check both the synthetic ID (legacy) and the API ID (modern) if available
                const legacyId = `${cat.id}_${index}`;
                const apiId = apiService ? apiService.id : null;

                if (inactiveIds.includes(legacyId)) return false;
                if (apiId && inactiveIds.includes(apiId)) return false;

                return true;
            });

            if (visibleItems.length > 0) {
                filtered[cat.id] = { ...cat, items: visibleItems };
            }
        });
        return filtered;
    }, [inactiveIds, apiCatalog]);

    // Get list of visible category keys
    const visibleCategories = Object.keys(visibleServices);

    // Default to first visible category or fallback
    const [activeCategory, setActiveCategory] = useState('');

    // Update active category on load or change
    useEffect(() => {
        // If no category selected, or current selection is hidden, pick first visible
        if ((!activeCategory || !visibleServices[activeCategory]) && visibleCategories.length > 0) {
            setActiveCategory(visibleCategories[0]);
        }
    }, [visibleServices, activeCategory, visibleCategories]);

    // Animation Variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardHover = {
        hover: { y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-[#2B3446] font-sans overflow-x-hidden selection:bg-brand-gold selection:text-white">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
                {/* Background Ambience - Animated Blob */}
                <div className="absolute top-0 inset-0 pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                            rotate: [0, 90, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[-20%] left-[50%] -translate-x-[50%] w-[800px] h-[800px] bg-brand-gold/10 rounded-full blur-[100px]"
                    />
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="z-10 max-w-4xl mx-auto space-y-6"
                >
                    <motion.span variants={fadeInUp} className="text-brand-blue font-bold tracking-widest text-xs uppercase pt-10 inline-block">All-in-One Filing Platform</motion.span>
                    <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold leading-tight text-[#2B3446]">
                        A simple way to manage <br />
                        <motion.span
                            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                            className="bg-clip-text text-transparent bg-gradient-to-r from-[#2B3446] via-[#4A5669] to-[#718096] bg-[length:200%_auto]"
                        >
                            Filing & Compliance
                        </motion.span> through AI
                    </motion.h1>
                    <motion.p variants={fadeInUp} className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        ShineFiling is a full compliance management platform, that allows you to generate Rent Agreements, file GST, and register businesses instantly. The best part is, it's powered by AI.
                    </motion.p>
                    <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-8 relative z-10">
                        <Link to={isLoggedIn ? "/dashboard" : "/login"}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3.5 rounded-full bg-brand-gold text-white font-bold text-lg shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition"
                            >
                                {isLoggedIn ? "Go to Dashboard" : "Start Filing Now!"}
                            </motion.button>
                        </Link>
                        <Link to="/pricing">
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.8)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3.5 rounded-full bg-white border border-gray-200 text-[#2B3446] font-medium text-lg transition shadow-sm"
                            >
                                View Pricing
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* HERO IMAGE */}
                    <motion.div
                        variants={fadeInUp}
                        className="relative w-full max-w-xl mx-auto mt-20"
                    >
                        <img
                            src="/hero_compliance.png"
                            alt="Compliance Dashboard 3D"
                            className="w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                        />
                    </motion.div>
                </motion.div>

                {/* Floating Cards Visualization with enhanced floating */}
                <div className="relative w-full max-w-5xl h-[600px] mt-20 mx-auto hidden lg:block">
                    {/* Floating Item 1 */}
                    {!inactiveIds.includes('legal_4') && (
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0, y: [0, -15, 0] }}
                            transition={{ opacity: { duration: 1 }, x: { duration: 1 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
                            className="absolute top-0 left-20 w-64 p-5 bg-white rounded-2xl shadow-xl border border-gray-100 z-20"
                        >
                            <div className="flex items-center gap-3 mb-3"><div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><FileText size={20} /></div><h4 className="font-bold text-[#2B3446]">Rent Agreement</h4></div>
                            <p className="text-xs text-slate-500 leading-relaxed">Generate legally valid agreements in 2 mins. AI drafts clauses automatically.</p>
                        </motion.div>
                    )}

                    {/* Floating Item 2 */}
                    {!inactiveIds.includes('tax_compliance_0') && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0, y: [0, 20, 0] }}
                            transition={{ opacity: { duration: 1, delay: 0.2 }, x: { duration: 1, delay: 0.2 }, y: { duration: 7, delay: 1, repeat: Infinity, ease: "easeInOut" } }}
                            className="absolute top-20 right-10 w-64 p-5 bg-white rounded-2xl shadow-xl border border-gray-100 z-20"
                        >
                            <div className="flex items-center gap-3 mb-3"><div className="p-2 bg-green-100 rounded-lg text-green-600"><Shield size={20} /></div><h4 className="font-bold text-[#2B3446]">GST Filing</h4></div>
                            <p className="text-xs text-slate-500 leading-relaxed">100% Compliant returns. Automatic invoice matching & error checks.</p>
                        </motion.div>
                    )}

                    {/* Floating Item 3 */}
                    {!inactiveIds.includes('business_reg_0') && (
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0, y: [0, -18, 0] }}
                            transition={{ opacity: { duration: 1, delay: 0.4 }, x: { duration: 1, delay: 0.4 }, y: { duration: 8, delay: 0.5, repeat: Infinity, ease: "easeInOut" } }}
                            className="absolute bottom-20 left-40 w-64 p-5 bg-white rounded-2xl shadow-xl border border-gray-100 z-20"
                        >
                            <div className="flex items-center gap-3 mb-3"><div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Star size={20} /></div><h4 className="font-bold text-[#2B3446]">Startup Reg</h4></div>
                            <p className="text-xs text-slate-500 leading-relaxed">Register Pvt Ltd, LLP in 7 days. Trusted by 500+ founders.</p>
                        </motion.div>
                    )}

                    {/* Floating Item 4 */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0, y: [0, 15, 0] }}
                        transition={{ opacity: { duration: 1, delay: 0.6 }, x: { duration: 1, delay: 0.6 }, y: { duration: 5.5, delay: 1.5, repeat: Infinity, ease: "easeInOut" } }}
                        className="absolute bottom-40 right-40 w-64 p-5 bg-white rounded-2xl shadow-xl border border-gray-100 z-20"
                    >
                        <div className="flex items-center gap-3 mb-3"><div className="p-2 bg-blue-100 rounded-lg text-blue-600"><CheckCircle size={20} /></div><h4 className="font-bold text-[#2B3446]">Automated</h4></div>
                        <p className="text-xs text-slate-500 leading-relaxed">Track status, get notifications, and renew licenses on autopilot.</p>
                    </motion.div>

                    {/* Central Brain/AI */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <motion.div
                            animate={{ boxShadow: ["0px 0px 20px rgba(237, 185, 111, 0.2)", "0px 0px 60px rgba(237, 185, 111, 0.6)", "0px 0px 20px rgba(237, 185, 111, 0.2)"] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="w-80 h-80 border border-gray-200 rounded-full flex items-center justify-center bg-white/60 backdrop-blur-sm shadow-xl z-10 relative"
                        >
                            <div className="text-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="w-20 h-20 mx-auto bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg text-white"
                                >
                                    <Cpu size={40} fill="currentColor" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-[#2B3446]">AI Engine</h3>
                                <motion.p
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-slate-500 text-sm"
                                >
                                    Processing...
                                </motion.p>
                            </div>
                        </motion.div>
                    </div>

                    {/* CONNECTOR LINES - Animated Dash */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0">
                        <motion.path
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1 }}
                            d="M300 150 Q 500 300 420 300" stroke="#94a3b8" strokeWidth="2" fill="none" strokeDasharray="5,5"
                        />
                        <motion.path
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.2 }}
                            d="M800 200 Q 550 300 580 300" stroke="#94a3b8" strokeWidth="2" fill="none" strokeDasharray="5,5"
                        />
                        <motion.path
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.4 }}
                            d="M350 500 Q 500 350 450 350" stroke="#94a3b8" strokeWidth="2" fill="none" strokeDasharray="5,5"
                        />
                        <motion.path
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.6 }}
                            d="M750 450 Q 550 350 550 350" stroke="#94a3b8" strokeWidth="2" fill="none" strokeDasharray="5,5"
                        />
                    </svg>
                </div>
            </section>

            {/* TRUST INDICATORS & STATS BANNER */}
            <section className="relative z-30 bg-white border-y border-gray-100 shadow-sm py-10 -mt-8 mx-4 md:mx-10 rounded-2xl">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
                    <div className="space-y-1">
                        <h4 className="text-3xl font-extrabold text-[#2B3446]">50,000+</h4>
                        <p className="text-xs uppercase font-bold tracking-widest text-slate-400">Filings Completed</p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-3xl font-extrabold text-[#2B3446]">4.9/5</h4>
                        <p className="text-xs uppercase font-bold tracking-widest text-slate-400">User Rating</p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-3xl font-extrabold text-[#2B3446]">24hrs</h4>
                        <p className="text-xs uppercase font-bold tracking-widest text-slate-400">Avg. Turnaround</p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-3xl font-extrabold text-[#2B3446]">120+</h4>
                        <p className="text-xs uppercase font-bold tracking-widest text-slate-400">Experts Online</p>
                    </div>
                </div>
            </section>

            {/* 3D SERVICE ECOSYSTEM */}
            <section id="services" className="relative z-20 py-24 bg-[#F2F1EF]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-brand-gold font-bold uppercase tracking-widest text-xs"
                        >
                            Comprehensive Suite
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#2B3446]">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B3446] to-slate-500">Compliance Cloud</span>
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                            Access a complete ecosystem of legal and financial tools. From registration to annual filings, manage everything in one 3D-integrated dashboard.
                        </p>
                    </div>

                    {visibleCategories.length > 0 ? (
                        <div className="flex flex-col lg:flex-row gap-10">
                            {/* Stylish Glass Sidebar */}
                            <div className="lg:w-1/4">
                                <div className="sticky top-24 bg-white/50 backdrop-blur-xl border border-white/50 p-4 rounded-3xl shadow-xl shadow-slate-200/50 space-y-2">
                                    {Object.values(visibleServices).map((module) => (
                                        <button
                                            key={module.id}
                                            onClick={() => setActiveCategory(module.id)}
                                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 relative overflow-hidden group ${activeCategory === module.id
                                                ? 'bg-[#2B3446] text-white shadow-lg scale-100'
                                                : 'text-slate-500 hover:bg-white hover:text-[#2B3446] hover:shadow-md'
                                                }`}
                                        >
                                            <div className={`z-10 p-2 rounded-xl transition-colors ${activeCategory === module.id ? 'bg-white/10 text-brand-gold' : 'bg-transparent group-hover:bg-slate-100'}`}>
                                                <module.icon size={20} />
                                            </div>
                                            <span className="z-10 font-bold text-sm tracking-wide">{module.label}</span>
                                            {activeCategory === module.id && (
                                                <motion.div
                                                    layoutId="activeGlow"
                                                    className="absolute inset-0 bg-gradient-to-r from-[#2B3446] to-slate-800"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 3D Cards Grid */}
                            <div className="lg:w-3/4 perspective-1000">
                                <AnimatePresence mode='wait'>
                                    {activeCategory && visibleServices[activeCategory] && (
                                        <motion.div
                                            key={activeCategory}
                                            initial={{ opacity: 0, rotateX: -10, y: 50 }}
                                            animate={{ opacity: 1, rotateX: 0, y: 0 }}
                                            exit={{ opacity: 0, rotateX: 10, y: -50 }}
                                            transition={{ duration: 0.5, ease: "backOut" }}
                                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                        >
                                            {visibleServices[activeCategory].items.map((item, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    whileHover={{
                                                        y: -10,
                                                        rotateX: 5,
                                                        rotateY: 5,
                                                        boxShadow: "20px 20px 60px -15px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.5)"
                                                    }}
                                                    className="relative md:h-48 p-6 bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-white shadow-lg hover:shadow-2xl hover:border-brand-gold/30 transition-all duration-300 group cursor-pointer overflow-hidden backdrop-blur-sm"
                                                >
                                                    {/* Decorative Blob */}
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-gold/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-700"></div>

                                                    <div className="relative z-10 h-full flex flex-col justify-between">
                                                        <div>
                                                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#2B3446] mb-4 group-hover:scale-110 transition-transform">
                                                                <Star size={18} className="text-brand-gold" fill="currentColor" />
                                                            </div>
                                                            <h4 className="font-bold text-lg text-[#2B3446] leading-tight">{item}</h4>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-4 opacity-60 group-hover:opacity-100 transition-opacity">
                                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Start Now</span>
                                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#2B3446] shadow-sm transform translate-x-10 group-hover:translate-x-0 transition-transform">
                                                                <ArrowRight size={14} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}

                                            {/* AI Call to Action Card */}
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="md:h-48 p-1 rounded-3xl bg-gradient-to-br from-[#2B3446] to-slate-900 shadow-2xl"
                                            >
                                                <div className="h-full w-full rounded-[20px] bg-[#2B3446] p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                                    <Cpu size={32} className="text-brand-gold mb-3 relative z-10" />
                                                    <h4 className="font-bold text-white relative z-10">Automate {visibleServices[activeCategory].label}?</h4>
                                                    <p className="text-xs text-slate-400 mt-2 mb-4 relative z-10">Let AI handle the paperwork.</p>
                                                    <button className="px-4 py-2 bg-white/10 border border-white/20 hover:bg-white hover:text-[#2B3446] text-white rounded-xl text-xs font-bold transition relative z-10">
                                                        Try Auto-Pilot
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                            <p className="text-xl text-gray-400 font-bold">Services Currently Unavailable</p>
                        </div>
                    )}
                </div>
            </section>

            {/* NEW SECTION: HOW IT WORKS (3D STEPS) */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-[#2B3446]">How <span className="text-brand-gold">ShineFiling</span> Works</h2>
                        <p className="text-slate-500 mt-4">Three simple steps to specialized compliance.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: "Select Service", desc: "Choose from 150+ legal & tax services.", icon: Menu, color: "blue" },
                            { title: "Upload & AI Scan", desc: "Our AI verifies your documents instantly.", icon: Zap, color: "brand-gold" },
                            { title: "Get Delivered", desc: "Receive certificates & filings in your dashboard.", icon: CheckCircle, color: "green" }
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gray-50 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                                <div className="relative bg-white border border-gray-100 p-8 rounded-3xl shadow-xl space-y-6">
                                    <div className={`w-16 h-16 rounded-2xl bg-${step.color === 'brand-gold' ? 'yellow' : step.color}-100 flex items-center justify-center text-${step.color === 'brand-gold' ? 'yellow' : step.color}-600 shadow-inner`}>
                                        <step.icon size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-[#2B3446] mb-2">0{i + 1}. {step.title}</h3>
                                        <p className="text-slate-500">{step.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI DOCUMENT GENERATOR - GLASS & NEON */}
            <section id="ai-tools" className="py-24 relative overflow-hidden bg-[#2B3446]">
                {/* Background Ambience */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-brand-gold text-xs font-bold uppercase mb-8 backdrop-blur-md">
                            <PenTool size={14} /> AI Document Generator
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Legal Drafts made <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-200">Intelligent.</span>
                        </h2>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                            Stop using generic templates. Our AI analyzes your specific needs to draft precise, legally compliant contracts, deeds, and letters in seconds.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {['Employment Contracts', 'Rent Deeds', 'Power of Attorney', 'NDA & IP Agreements'].map((doc, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.1)" }}
                                    className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm cursor-default transition-colors"
                                >
                                    <div className="p-2 rounded-full bg-green-500/20 text-green-400"><CheckCircle size={16} /></div>
                                    <span className="text-sm font-bold text-slate-200">{doc}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* 3D Floating Interface - REPLACED WITH IMAGE */}
                    <div className="relative perspective-1000">
                        <motion.div
                            initial={{ rotateY: -10, rotateX: 5 }}
                            whileInView={{ rotateY: 0, rotateX: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative"
                        >
                            <img
                                src="/ai_bot.png"
                                alt="AI Document Analysis"
                                className="rounded-3xl shadow-2xl border border-white/10 transform hover:scale-105 transition-transform duration-500 w-full"
                            />
                            {/* Floating Tech Badge */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-6 -right-6 bg-brand-gold text-[#2B3446] px-6 py-3 rounded-full font-bold shadow-lg border-2 border-[#2B3446]"
                            >
                                AI Powered
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* DIGITAL STORAGE - 3D VAULT */}
            <section id="storage" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="text-center mb-16"
                    >
                        {/* 3D Vault Image */}
                        <div className="relative w-48 h-48 mx-auto mb-8">
                            <motion.img
                                src="/vault.png"
                                alt="Secure Digital Vault"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-full h-full object-contain filter drop-shadow-2xl"
                            />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-[#2B3446] mb-6">
                            Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-600">Digital Vault</span>
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                            Bank-grade encryption for your most sensitive documents. Access your PAN, Aadhaar, and GST certificates anytime, anywhere.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        {[
                            { title: 'AES-256 Encryption', desc: 'Military-grade protection for every file.', icon: Lock, color: 'blue' },
                            { title: 'Global Access', desc: 'Secure reliable access from any device.', icon: Globe, color: 'purple' },
                            { title: 'Expiry Watchdog', desc: 'Auto-alerts before licenses expire.', icon: Shield, color: 'green' }
                        ].map((feat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                whileHover={{ y: -10 }}
                                className="group relative p-8 bg-white border border-gray-100 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br from-${feat.color}-50 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500`}></div>
                                <div className="relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl bg-${feat.color}-50 flex items-center justify-center text-${feat.color}-600 mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                                        <feat.icon size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#2B3446] mb-3">{feat.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TRUSTED BY MARQUEE */}
            <section className="py-10 bg-white border-b border-gray-100 overflow-hidden">
                <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Trusted by 2,000+ Modern Companies</p>
                <div className="relative flex overflow-x-hidden group">
                    <div className="animate-marquee flex gap-16 items-center whitespace-nowrap min-w-full px-8">
                        {['Acme Corp', 'GlobalTech', 'Nebula Inc.', 'Vertex Solutions', 'Quantum Labs', 'Pinnacle Systems', 'Virtuoso', 'Elevate Partners', 'Synergy Group', 'Apex Dynamics'].map((logo, i) => (
                            <span key={i} className="text-xl font-bold text-slate-300 uppercase tracking-tighter hover:text-brand-gold transition-colors cursor-default">{logo}</span>
                        ))}
                        {['Acme Corp', 'GlobalTech', 'Nebula Inc.', 'Vertex Solutions', 'Quantum Labs', 'Pinnacle Systems', 'Virtuoso', 'Elevate Partners', 'Synergy Group', 'Apex Dynamics'].map((logo, i) => (
                            <span key={`dup-${i}`} className="text-xl font-bold text-slate-300 uppercase tracking-tighter hover:text-brand-gold transition-colors cursor-default">{logo}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS - VECTOR CARDS */}
            <section className="py-24 bg-[#F8F9FA] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-[#2B3446]">What Founders Say</h2>
                        <p className="text-slate-500 mt-4 text-lg">Don't just take our word for it.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Arjun Mehta", role: "CEO, TechFlow", quote: "ShineFiling cut our incorporation time by half. The AI document generator is a game changer for startups." },
                            { name: "Priya Sharma", role: "Founder, GreenLeaf", quote: "I was dreading GST filings, but their automated dashboard makes it effortless. Highly recommended!" },
                            { name: "Rohan Gupta", role: "Director, BuildWell", quote: "The rent agreement service is lightning fast. We generate dozens of contracts monthly with zero errors." }
                        ].map((review, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex gap-1 text-brand-gold mb-6">
                                        {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                                    </div>
                                    <p className="text-[#2B3446] italic mb-8 leading-relaxed">"{review.quote}"</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center font-bold text-[#2B3446]">
                                        {review.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#2B3446] text-sm">{review.name}</h4>
                                        <p className="text-slate-400 text-xs">{review.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CLIENTS & PARTNERS */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-[#2B3446] mb-6">Partnered with the Best</h2>
                            <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                                We collaborate with top banking and legal institutions to provide you with a seamless experience. Our integrations ensure your data flows securely and efficiently.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Direct API Integration with MCA",
                                    "Bank-Grade Security Standards",
                                    "Instant PAN & TAN Generation",
                                    "24/7 Legal Support Access"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[#2B3446] font-medium">
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                            <CheckCircle size={14} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/20 to-transparent rounded-full blur-[100px]"></div>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                {[Briefcase, Landmark, Shield, Globe].map((Icon, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.05 }}
                                        className="h-40 bg-white border border-gray-100 rounded-3xl shadow-xl flex flex-col items-center justify-center text-slate-300 hover:text-brand-gold transition-colors p-6 text-center group"
                                    >
                                        <Icon size={48} className="mb-4 stroke-1 group-hover:stroke-2 transition-all" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Partner {i + 1}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Services */}
            <section className="py-24 relative overflow-hidden bg-brand-gold">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto px-6 text-center relative z-10"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-[#2B3446] mb-6">Ready to simplify your life?</h2>
                    <p className="text-[#2B3446]/80 text-xl mb-10">From Birth Certificates to Business Registration, we handle it all.</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-5 rounded-full bg-white text-[#2B3446] font-bold text-xl hover:bg-white/90 transition shadow-2xl"
                    >
                        Create Free Account
                    </motion.button>
                </motion.div>
            </section>

        </div>
    );
};

export default HomePage;
