import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle, BarChart, FileText, TrendingUp, HelpCircle, Shield,
    BookOpen, Clock, Zap, ChevronRight, Star, ArrowRight, X, Briefcase, Handshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '../../../components/auth/AuthModal';
import VirtualCFORegistration from './VirtualCFORegistration';

const VirtualCFO = ({ isLoggedIn }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [selectedPlan, setSelectedPlan] = useState('growth');

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
        { q: "What is a Virtual CFO?", a: "A Virtual CFO (Chief Financial Officer) provides expert financial planning, guidance, and strategic advice to startups and SMEs on a flexible, part-time basis without the cost of a full-time executive." },
        { q: "Is it different from a CA?", a: "Yes. A CA typically handles historical compliance (Audit, Tax). A CFO looks forward—planning growth, budgeting, cash flow management, and fundraising strategy." },
        { q: "Who needs this service?", a: "Startups raising funds, SMEs with turnover > ₹2 Cr, or any business facing cash flow issues or needing financial discipline." },
        { q: "What is the commitment?", a: "Our plans are month-to-month. You can scale up or down based on your requirements." },
        { q: "Do you handle investor relations?", a: "Yes, we prepare monthly MIS reports for investors and can join board meetings to present financial health." },
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=2664"
                        alt="CFO Services"
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
                        className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-slate-700/20 rounded-full blur-[120px]"
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
                                    <Briefcase size={12} className="text-bronze" /> Expert Leadership
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Virtual CFO <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Services</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Get high-level financial strategy without the high-level salary. Our <strong>Virtual CFOs</strong> help you optimize cash flow, manage compliance, and drive growth.
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
                                        <BarChart size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Monthly</p>
                                        <p className="font-bold text-sm text-white">MIS Reports</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Risk</p>
                                        <p className="font-bold text-sm text-white">Management</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Consult CFO
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <BookOpen size={18} /> How It Works
                                </button>
                            </div>
                        </div>

                        {/* Trust Card - Official - WHITE THEME COMPACT */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full md:w-[360px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl relative"
                        >
                            <div className="bg-white rounded-[20px] p-6 overflow-hidden relative shadow-inner">
                                {/* Top Gold Line */}
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
                                        Virtual CFO <br />Services
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Strategic Finance</p>
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
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Cost <br />Effective</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>

                                    {/* Right Stat */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Shield size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Legal</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Expert <br />Guidance</p>
                                    </div>
                                </div>

                                {/* Check List - COMPACT */}
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "Budgeting",
                                        "Compliance",
                                        "Growth Plan"
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
                                    Hire CFO <ArrowRight size={16} />
                                </button>

                                <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
                                    Compare all plans below
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
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Choose Your Level</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* PLAN 1: BASIC */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Essential</h3>
                            <p className="text-slate-500 text-sm mb-6">Early Stage.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹14,999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">₹25,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Basic Bookkeeping Review</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Compliance Calendar</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Quarterly MIS</li>
                                <li className="flex items-center gap-3 text-sm text-slate-400"><X size={16} /> No Strategy Calls</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('essential')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Essential</button>
                        </motion.div>

                        {/* PLAN 2: GROWTH - POPULAR */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Most Popular</div>

                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Growth</h3>
                            <p className="text-gray-400 text-sm mb-6">Scaling Companies.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹24,999</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹40,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={16} className="text-bronze" /> Monthly Strategy Call</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={16} className="text-bronze" /> Detailed Monthly MIS</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={16} className="text-bronze" /> Cash Flow Forecasting</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={16} className="text-bronze" /> Vendor Negotiation</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('growth')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Select Growth</button>
                        </motion.div>

                        {/* PLAN 3: ENTERPRISE */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Controller</h3>
                            <p className="text-slate-500 text-sm mb-6">Complex Operations.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹49,999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">₹75,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Weekly Review Meetings</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Fundraising Support</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Board Representation</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Internal Audit Lead</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('controller')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Controller</button>
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
                            <Briefcase className="text-bronze" /> Strategic Financial Leadership
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                A <strong>Virtual CFO</strong> is not just an accountant; they are your strategic partner. They help you translate your numbers into actionable business insights.
                            </p>
                            <p>
                                Whether you are looking to raise venture capital, streamline operations, or prepare for an exit, a CFO provides the financial governance and credibility required for the next level.
                            </p>
                        </div>
                    </section>

                    {/* Scope Table */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Scope of Services</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                                <div className="p-6">
                                    <h3 className="font-bold text-navy mb-4 text-lg">Financial Operations</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5"></div> Closing of Books (Monthly)</li>
                                        <li className="flex items-start gap-2 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5"></div> Vendor & Client Reconciliation</li>
                                        <li className="flex items-start gap-2 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5"></div> Payroll Management</li>
                                    </ul>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-navy mb-4 text-lg">Compliance & Risk</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5"></div> Tax Strategy & Planning</li>
                                        <li className="flex items-start gap-2 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5"></div> Statutory Compliance Audit</li>
                                        <li className="flex items-start gap-2 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5"></div> Internal Controls Setup</li>
                                    </ul>
                                </div>
                                <div className="p-6 md:border-t border-gray-100">
                                    <h3 className="font-bold text-navy mb-4 text-lg">Report & Analysis</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5"></div> Budget vs Actual Analysis</li>
                                        <li className="flex items-start gap-2 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5"></div> Profitability by Product/Service</li>
                                        <li className="flex items-start gap-2 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5"></div> Cash Burn Analysis</li>
                                    </ul>
                                </div>
                                <div className="p-6 md:border-t border-gray-100">
                                    <h3 className="font-bold text-navy mb-4 text-lg">Strategic Planning</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5"></div> Fundraising decks</li>
                                        <li className="flex items-start gap-2 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5"></div> Business Valuation</li>
                                        <li className="flex items-start gap-2 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5"></div> 5-Year Roadmap</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Process Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Onboarding Process</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Assessment", days: "Day 1", desc: "Understanding current financial health and systems." },
                                { step: "Step 2", title: "Gap Analysis", days: "Day 7", desc: "Identifying leakages, compliance lags, and process improvements." },
                                { step: "Step 3", title: "Action Plan", days: "Day 10", desc: "Setting up the financial calendar and reporting structure." },
                                { step: "Step 4", title: "Execution", days: "Ongoing", desc: "Monthly execution of the CFO duties and strategic meetings." }
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
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Access to Tally/Zoho</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Bank Information</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> GST/Tax Portal Access</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Payroll Data</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Audit?</h4>
                            <p className="text-gray-300 text-sm mb-4">CFO services prepare books for audit. We can also assign a separate Auditor for statutory filing.</p>
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
                            <VirtualCFORegistration
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
export default VirtualCFO;


