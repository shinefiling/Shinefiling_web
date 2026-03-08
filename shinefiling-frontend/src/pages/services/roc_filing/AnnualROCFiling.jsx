import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, Globe, Briefcase, Award, ArrowRight, Rocket, X, BookOpen, AlertCircle, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnnualROCRegistration from './AnnualROCRegistration';
import AuthModal from '../../../components/auth/AuthModal';

const AnnualROCFilingPage = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('standard');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const scrollToPlans = () => {
        const section = document.getElementById('pricing-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const faqs = [
        { q: "What is Annual Filing?", a: "Every company must file annual accounts and annual returns with the ROC every year within 30 days/60 days of the AGM." },
        { q: "What forms are filed?", a: "Form AOC-4 (Financial Statements) and Form MGT-7/7A (Annual Return) are the primary forms." },
        { q: "What is the penalty for delay?", a: "The penalty is ₹100 per day per form. This applies to both the company and directors." },
        { q: "Is it mandatory for inactive companies?", a: "Yes, even if there is no business, annual compliances are mandatory unless the company has filed for dormancy." },
        { q: "What is the AGM due date?", a: "The AGM must be held within 6 months from the end of the financial year (i.e., by 30th September)." },
    ];

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        const storedUser = localStorage.getItem('user');
        if (isLoggedIn || !!storedUser) {
            setShowRegistrationModal(true);
        } else {
            setAuthMode('login');
            setShowAuthModal(true);
        }
    };

    const applicableEntities = [
        { name: "Private Limited", icon: Building },
        { name: "OPC (One Person)", icon: Users },
        { name: "Public Limited", icon: Building },
        { name: "Section 8 Company", icon: Scale }
    ];

    const dueDates = [
        { type: "AOC-4", due: "30 Days from AGM" },
        { type: "MGT-7 / 7A", due: "60 Days from AGM" },
        { type: "OPC AOC-4", due: "180 Days from FY End" }
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
                            <AnnualROCRegistration
                                isLoggedIn={isLoggedIn}
                                isModal={true}
                                initialPlan={selectedPlan}
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
                        src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2070"
                        alt="Corporate Background"
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
                                    <Star size={12} className="fill-bronze" /> Statutory Compliance
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Annual ROC <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Company Filing</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    File AOC-4 and MGT-7 on time. Avoid heavy daily penalties and director disqualification. Expert assisted filing for Pvt Ltd & OPC.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Due Date</p>
                                        <p className="font-bold text-sm text-white">30 Days of AGM</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Penalty</p>
                                        <p className="font-bold text-sm text-white">₹100 / Day</p>
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
                                    File Annual Return
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Learn More
                                </button>
                            </motion.div>
                        </div>

                        {/* Trust Card */}
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
                                    <h3 className="text-navy font-bold text-2xl leading-tight">Official <br />Compliance</h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Ministry of Corporate Affairs</p>
                                </div>
                                <div className="h-px w-full bg-slate-100 mb-5"></div>
                                <div className="space-y-4 mb-8 flex-1">
                                    {[
                                        "Form AOC-4 Filing (Financials)",
                                        "Form MGT-7/7A Filing (Return)",
                                        "Director Report Preparation",
                                        "Auditor Coordination",
                                        "Error-Free Support"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                                            <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={scrollToPlans}
                                    className="w-full py-3 bg-navy hover:bg-black text-white font-bold text-base rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Start Filing <ArrowRight size={16} />
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">100% Online process • No hidden charges</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* PRICING SECTION */}
            <section id="pricing-section" className="py-20 px-6 lg:px-12 bg-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Peace of Mind</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Compliance Packages</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                        <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
                            Choose the perfect plan for your business compliance.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {applicableEntities.map((ent, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-slate-200 rounded-full shadow-sm">
                                <ent.icon size={12} className="text-bronze" />
                                <span className="text-[10px] font-black uppercase text-navy/70 tracking-widest">{ent.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {/* Basic Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Basic</h3>
                            <p className="text-slate-500 text-sm mb-6">Standard AOC-4 & MGT-7.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹3,999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">+ GOVT FEES</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                {[
                                    "AOC-4 & MGT-7/7A Filing",
                                    "Balance Sheet Upload",
                                    "Profit & Loss Upload",
                                    "MCA Manual Upload",
                                    "SRN Receipt Generation",
                                    "Standard Support"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('basic')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Basic</button>
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
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Recommended</div>
                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Standard</h3>
                            <p className="text-gray-400 text-sm mb-6">Comprehensive Compliance.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹6,999</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase bg-white/10 px-2 py-1 rounded">MOST POPULAR</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                <li className="text-xs font-bold text-[#D9A55B] uppercase tracking-wider border-b border-white/10 pb-2">Everything in Basic +</li>
                                {[
                                    "Director's Report Prep",
                                    "Auditor Coordination",
                                    "Shareholder List Prep",
                                    "CS Error-Free Support",
                                    "Penalty Avoidance Check",
                                    "Priority Processing"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Get Standard</button>
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
                            <p className="text-slate-500 text-sm mb-6">All-Inclusive Expert Care.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹11,999</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">+ GOVT FEES</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                <li className="text-xs font-bold text-navy uppercase tracking-wider border-b border-gray-100 pb-2">Everything in Standard +</li>
                                {[
                                    "AGM Notice & Minutes",
                                    "Board Meeting Minutes",
                                    "AGM Compliance Support",
                                    "1-Year Compliance Calendar",
                                    "Dedicated CS Support",
                                    "Year-Round Advisory"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('premium')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Premium</button>
                        </motion.div>
                    </div>

                    {/* DUE DATES TRACKER */}
                    <div className="mt-16 bg-bronze/5 rounded-[45px] p-10 border border-bronze/10">
                        <h3 className="text-lg font-black text-navy uppercase tracking-widest mb-8 flex items-center gap-3 italic">
                            <Clock size={24} className="text-bronze" /> Statutory Timeline Tracker
                        </h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            {dueDates.map((date, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:border-bronze/30 transition-all">
                                    <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">{date.type}</p>
                                    <p className="text-lg font-black text-navy group-hover:text-bronze transition-colors tracking-tight italic">{date.due}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3 font-outfit uppercase tracking-tighter italic">
                            <BookOpen className="text-bronze" /> Comprehensive Guide to Annual RoC Filing
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="text-xl text-gray-800 font-medium">Filing Annual Returns with ROC (MCA) is mandatory for every registered company. It involves submitting audited financial statements (AOC-4) and the Annual Return (MGT-7).</p>
                            <p className="mt-4">Maintaining compliance is crucial not just to avoid penalties but to maintain the 'Active' status of the company and ensure Directors do not get disqualified.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 font-outfit uppercase tracking-tighter italic">Key Forms</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Form AOC-4", desc: "For Financial Statements. Contains Balance Sheet, P&L Account, and Director's Report. Due: 30 days of AGM.", icon: FileText },
                                { title: "Form MGT-7", desc: "For Annual Return. Contains details of shareholders, directors, and shareholding pattern. Due: 60 days of AGM.", icon: Users },
                                { title: "Form ADT-1", desc: "For Auditor Appointment. If a new auditor is appointed in the AGM, this form must be filed within 15 days.", icon: UserCheck },
                                { title: "Form MGT-14", desc: "For Board Resolutions. Required for approving financial statements and Board Reports effectively.", icon: Scale },
                            ].map((benefit, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-bronze/30 transition shadow-bronze/5">
                                    <div className="w-12 h-12 rounded-xl bg-bronze/10 flex items-center justify-center text-bronze shrink-0"><benefit.icon size={24} /></div>
                                    <div><h4 className="font-bold text-navy mb-1">{benefit.title}</h4><p className="text-sm text-gray-500">{benefit.desc}</p></div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 font-outfit uppercase tracking-tighter italic">Filing Process</h2>
                        <div className="space-y-4">
                            {[
                                { step: "Step 1", title: "Document Collection", days: "Day 1", desc: "We collect audited financial statements and bank records." },
                                { step: "Step 2", title: "Review & Drafting", days: "Day 2-3", desc: "Our team drafts the Director's Report, MGT-9, and necessary Resolutions." },
                                { step: "Step 3", title: "Certification", days: "Day 3", desc: "Documents are verified and certified by our CA/CS." },
                                { step: "Step 4", title: "MCA Filing", days: "Day 4", desc: "Forms AOC-4 & MGT-7 are uploaded to the MCA portal." },
                                { step: "Step 5", title: "Approval", days: "Day 5", desc: "SRN is generated upon successful payment and approval." }
                            ].map((s, i) => (
                                <div key={i} className="flex gap-6 p-6 bg-white rounded-2xl border border-gray-50 shadow-sm">
                                    <div className="text-4xl font-black text-bronze opacity-20 italic">0{i + 1}</div>
                                    <div><h4 className="font-bold text-navy mb-1">{s.title}</h4><p className="text-sm text-gray-500">{s.desc}</p></div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 font-outfit uppercase tracking-tighter italic">FAQs</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <details key={i} className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                    <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-bold text-gray-700 hover:bg-gray-50 uppercase text-xs tracking-widest">{faq.q} <ChevronRight className="group-open:rotate-90 transition" /></summary>
                                    <div className="px-6 pb-6 pt-2 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
                                </details>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-50 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-bronze/5 rounded-full -mr-16 -mt-16 blur-xl"></div>
                            <h3 className="font-black text-xl text-navy mb-6 flex items-center gap-2 font-outfit uppercase tracking-tighter italic">Checklist</h3>
                            <div className="space-y-6 relative z-10">
                                <div><h4 className="text-[10px] font-black text-gray-400 hover:text-bronze transition uppercase tracking-widest mb-3 border-b pb-2 cursor-pointer">Financials</h4><ul className="space-y-2 text-sm text-gray-600 font-medium"><li>• Audited Financial Statements</li><li>• Director's Report</li><li>• Audit Report (3CA/3CB)</li></ul></div>
                                <div><h4 className="text-[10px] font-black text-gray-400 hover:text-bronze transition uppercase tracking-widest mb-3 border-b pb-2 cursor-pointer">Meeting</h4><ul className="space-y-2 text-sm text-gray-600 font-medium"><li>• Notice of AGM</li><li>• MGT-14 (If applicable)</li></ul></div>
                            </div>
                            <button onClick={scrollToPlans} className="w-full mt-8 py-4 bg-navy text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black shadow-lg shadow-navy/20 transition transform hover:-translate-y-1">Start Filing Now</button>
                        </div>

                        <div className="bg-[#043E52] text-white p-6 rounded-3xl shadow-xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-bronze/10 rounded-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-150"></div>
                            <h4 className="font-bold text-lg mb-2 relative z-10">Expert Consult</h4>
                            <p className="text-gray-400 text-xs mb-6 font-medium relative z-10">Speak with our CA/CS experts before you start.</p>
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-bronze/20 flex items-center justify-center text-bronze shadow-inner"><Users size={20} /></div>
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Call Support</p><p className="font-black text-white">+91 7639227019</p></div>
                            </div>
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-[10px] uppercase tracking-widest transition">WhatsApp Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnualROCFilingPage;
