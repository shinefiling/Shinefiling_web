import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle, Scale, FileText, HelpCircle, Shield,
    BookOpen, Clock, Zap, ChevronRight, Star, ArrowRight, X, Calculator, Handshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TaxNoticeReplyRegistration from './TaxNoticeReplyRegistration';
import AuthModal from '../../../components/auth/AuthModal';

const TaxNoticeReply = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('standard');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    useEffect(() => { window.scrollTo(0, 0); }, []);

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

    const faqs = [
        { q: "Why did I get an Income Tax Notice?", a: "Common reasons include mismatch in income vs TDS (26AS), high value transactions, or late filing details." },
        { q: "What is a GST ASMT-10 Notice?", a: "It is a scrutiny notice issued when there are discrepancies in your GST Returns (e.g., GSTR-3B vs GSTR-1)." },
        { q: "Can I ignore a tax notice?", a: "NEVER. Ignoring a notice triggers heavy penalties, best judgement assessment (high tax demand), or even prosecution." },
        { q: "Do I need a CA to reply?", a: "For simple notices, maybe not. But for scrutiny or demand notices, a CA-drafted reply is essential to avoid further complications." },
        { q: "What is the time limit?", a: "It varies. Usually 15 to 30 days. You must reply strictly within this deadline." },
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            <AnimatePresence>
                {showRegistrationModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-6 animate-in fade-in duration-300">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2rem] w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl relative flex flex-col"
                        >
                            <TaxNoticeReplyRegistration
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
                        src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2070"
                        alt="Tax Audit"
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
                        className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-green-600/20 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.15, 0.1],
                            x: [0, -50, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[100px]"
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
                                    <Calculator size={12} className="fill-bronze" /> Tax Compliance
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    GST & Income Tax <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Notice Reply</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Received a notice from the Tax Department? Don't panic. Get expert <strong>CA Assistance</strong> to draft a precise legal response and drop the demand.
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
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Avoid</p>
                                        <p className="font-bold text-sm text-white">Penalties</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Scale size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Expert</p>
                                        <p className="font-bold text-sm text-white">Representation</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Reply Now
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <BookOpen size={18} /> Learn More
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
                                        Tax Reply <br />Compliance
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Professional</p>
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
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Expert <br />Assisted</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>

                                    {/* Right Stat */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Shield size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Legal</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Timely <br />Filing</p>
                                    </div>
                                </div>

                                {/* Check List - COMPACT */}
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "Notice Analysis",
                                        "Expert Reply",
                                        "Avoid Penalty"
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
                                    File Reply <ArrowRight size={16} />
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
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Resolution Packages</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Choose Your Plan</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* PLAN 1: BASIC IT */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Basic IT Notice</h3>
                            <p className="text-slate-500 text-sm mb-6">Sec 143(1) intimation etc.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">₹1,500</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Defective Return (139(9))</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Demand Confirmation</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Simple Rectification</li>
                                <li className="flex items-center gap-3 text-sm text-slate-400"><X size={16} /> No Scrutiny Cases</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('basic')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Basic IT</button>
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

                            <h3 className="text-lg font-bold text-white mb-2 mt-1">GST / IT Regular</h3>
                            <p className="text-gray-400 text-sm mb-6">ASMT-10, DRC-01, Scrutiny.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹1,999</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹3,500</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={16} className="text-bronze" /> GST Discrepancy Reply</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={16} className="text-bronze" /> Limited Scrutiny Reply</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={16} className="text-bronze" /> ITC Calculation</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={16} className="text-bronze" /> CA Certified Reply</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Select Standard</button>
                        </motion.div>

                        {/* PLAN 3: APPEAL */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Appeal / Complex</h3>
                            <p className="text-slate-500 text-sm mb-6">High Value Demands.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹4,999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">₹8,000</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> GST Appeal Filing</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Income Tax CIT Appeals</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Personal Hearing</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Senior CA Consultation</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('appeal')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Appeal</button>
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
                            <Shield className="text-bronze" /> Handle Tax Notices with Confidence
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                Tax Notices from GST or Income Tax departments can be intimidating. They often demand explanations for discrepancies in turnover, ITC claims, or deductions.
                            </p>
                            <p>
                                A timely and technically correct reply can close the matter instantly. However, a wrong or delayed reply can lead to <strong>Heavy Penalties</strong>, <strong>Bank Attachments</strong>, or <strong>Cancellation of Registration</strong>.
                            </p>
                        </div>
                    </section>

                    {/* Common Notices Table */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Common Notices We Handle</h2>
                        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                            <div className="grid grid-cols-3 bg-navy text-white text-center p-4 font-bold text-sm tracking-wider uppercase">
                                <div>Notice Type</div>
                                <div>Department</div>
                                <div>Reason</div>
                            </div>
                            <div className="divide-y divide-gray-100 bg-white">
                                <div className="grid grid-cols-3 p-4 hover:bg-gray-50 transition items-center">
                                    <div className="font-bold text-navy text-sm">ASMT-10</div>
                                    <div className="text-sm text-slate-600 text-center">GST</div>
                                    <div className="text-sm text-slate-600 text-center">GSTR-3B vs GSTR-1 Mismatch</div>
                                </div>
                                <div className="grid grid-cols-3 p-4 hover:bg-gray-50 transition items-center">
                                    <div className="font-bold text-navy text-sm">DRC-01</div>
                                    <div className="text-sm text-slate-600 text-center">GST</div>
                                    <div className="text-sm text-slate-600 text-center">Demand Show Cause Notice</div>
                                </div>
                                <div className="grid grid-cols-3 p-4 hover:bg-gray-50 transition items-center">
                                    <div className="font-bold text-navy text-sm">Sec 143(1)</div>
                                    <div className="text-sm text-slate-600 text-center">Income Tax</div>
                                    <div className="text-sm text-slate-600 text-center">Intimation of mismatched tax</div>
                                </div>
                                <div className="grid grid-cols-3 p-4 hover:bg-gray-50 transition items-center">
                                    <div className="font-bold text-navy text-sm">Sec 148</div>
                                    <div className="text-sm text-slate-600 text-center">Income Tax</div>
                                    <div className="text-sm text-slate-600 text-center">Income escaping assessment</div>
                                </div>
                                <div className="grid grid-cols-3 p-4 hover:bg-gray-50 transition items-center">
                                    <div className="font-bold text-navy text-sm">REG-17</div>
                                    <div className="text-sm text-slate-600 text-center">GST</div>
                                    <div className="text-sm text-slate-600 text-center">Show cause for Cancellation</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Risks Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <HelpCircle className="text-bronze" /> Risks of Non-Compliance
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Heavy Penalties", desc: "Up to 100% of the tax evaded or general penalties of Rs. 25,000+." },
                                { title: "Registration Cancellation", desc: "GST Department can suo-moto cancel your GSTIN." },
                                { title: "Best Judgement Assessment", desc: "Officer calculates tax liability based on their estimation (usually very high)." },
                                { title: "Bank Account Freeze", desc: "Recovery officers can attach and freeze your bank accounts." },
                                { title: "Interest Accumulation", desc: "Delaying reply increases interest liability @ 18-24% p.a." },
                                { title: "Prosecution", desc: "In severe cases of evasion, criminal prosecution can be initiated." },
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

                    {/* Process Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Reply Process Steps</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Share Notice", days: "Day 1", desc: "Upload the notice received. Our CA team analyzes the demand/query." },
                                { step: "Step 2", title: "Data Collection", days: "Day 2", desc: "We collect relevant reconciliation data (Invoices, Ledgers) from you." },
                                { step: "Step 3", title: "Drafting", days: "Day 3", desc: "A detailed point-by-point legal reply is drafted." },
                                { step: "Step 4", title: "Filing", days: "Day 4", desc: "We submit the reply online on the portal and share acknowledgement." }
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
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Notice Copy (PDF)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Login Credentials</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Bank Statements / Invoices</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Previous Returns</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Urgent Reply?</h4>
                            <p className="text-gray-300 text-sm mb-4">Deadlines are strict. Don't wait until the last day.</p>
                            <button onClick={() => handlePlanSelect('appeal')} className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">View Plans <ArrowRight size={18} /></button>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
};
export default TaxNoticeReply;


