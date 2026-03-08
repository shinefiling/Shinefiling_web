import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, ArrowRight, X, Globe, Banknote, Handshake, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GSTR3BRegistration from './GSTR3BRegistration';

const GSTR3BPage = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('monthly');

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is GSTR-3B?", a: "GSTR-3B is a self-declared summary monthly return. It acts as a summary of your sales and purchases." },
        { q: "Do I need to pay tax with GSTR-3B?", a: "Yes, GSTR-3B is the return where you actually pay your tax liability after adjusting Input Tax Credit (ITC)." },
        { q: "What is the due date?", a: "Usually the 20th of the next month (or 22nd/24th depending on the state)." },
        { q: "Can I revise GSTR-3B?", a: "No, GSTR-3B cannot be revised. Adjustments must be made in subsequent months." },
        { q: "Is GSTR-3B mandatory for Nil return?", a: "Yes, even if you have no business activity, you must file a Nil GSTR-3B." }
    ];

    const handlePlanSelect = (planKey) => {
        if (isLoggedIn) {
            setSelectedPlan(planKey);
            setShowRegistrationModal(true);
        } else {
            const targetUrl = `/services/gst-return/gstr-3b/register?plan=${planKey}`;
            navigate('/login', { state: { from: targetUrl } });
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">
            <AnimatePresence>
                {showRegistrationModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-6 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col"
                        >
                            <GSTR3BRegistration
                                isLoggedIn={isLoggedIn}
                                isModal={true}
                                planProp={selectedPlan}
                                onClose={() => setShowRegistrationModal(false)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2070"
                        alt="Tax Background"
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

                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-left">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

                        {/* Hero Content - Left Aligned */}
                        <div className="flex-1 text-center lg:text-left space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                                    <Star size={12} className="fill-bronze" /> Monthly Tax Payment
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    GSTR-3B <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Monthly Summary Return</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Strategic <strong className="text-white font-semibold">GSTR-3B Filing</strong> for accurate tax payment. Maximize your <strong className="text-white font-semibold">Input Tax Credit</strong> and minimize cash outflow with expert guidance.
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
                                        <p className="font-bold text-sm text-white">20th Monthly</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Zap size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ITC Match</p>
                                        <p className="font-bold text-sm text-white">GSTR-2B Focused</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                            >
                                <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    File GSTR-3B Now
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Filing Guide
                                </button>
                            </motion.div>
                        </div>

                        {/* Hero Right Card */}
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
                                            <Banknote size={28} className="text-bronze" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle size={14} className="text-green-500" />
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">GSTR-3B<br />Filing Service</h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Monthly Summary Return</p>
                                </div>
                                <div className="h-px w-full bg-slate-100 mb-5"></div>
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Clock size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">20th</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Due Date<br />Monthly</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Shield size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">ITC</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Maximum<br />Optimized</p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "ITC Credit (GSTR-2B) Matching",
                                        "Tax Liability Calculation",
                                        "Nil Return Filing Included"
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
                                    onClick={() => document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full py-3 bg-navy hover:bg-black text-white font-bold text-base rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    File GSTR-3B Now <ArrowRight size={16} />
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">Compare all plans below</p>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>

            {/* PRICING SECTION */}
            <section id="pricing-section" className="py-20 px-6 lg:px-12 bg-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Choose Your Path</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Transparent Pricing Plans</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Monthly Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Monthly</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹499</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">PROMO</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Monthly GSTR-3B Preparation",
                                    "GST Portal Filing & EVC Assist",
                                    "Tax Liability Calculation",
                                    "Challan Generation Assistance",
                                    "GSTR-2B Matching Report",
                                    "Email Support within 24 Hours"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('monthly')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Monthly</button>
                        </motion.div>

                        {/* Standard Plan (Annual) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Most Popular</div>
                            <h3 className="text-lg font-bold text-white mb-2 mt-1">GSTR-3B (Fixed)</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹1,499</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹3,000</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                <li className="text-xs font-bold text-[#D9A55B] uppercase tracking-wider border-b border-white/10 pb-2">Everything in Monthly +</li>
                                {[
                                    "12 Months Return Filing",
                                    "Full 2A/2B Reconciliation",
                                    "ITC Optimization Review",
                                    "Interest Calculation Help",
                                    "Priority WhatsApp Support",
                                    "Annual Consolidation Report"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('annual')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Get Started</button>
                        </motion.div>

                        {/* QRMP Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">QRMP Scheme</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy">₹1,299</span>
                                <span className="text-slate-400 line-through text-xs">₹1,999</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="text-xs font-bold text-navy uppercase tracking-wider border-b border-gray-100 pb-2">Everything in Monthly +</li>
                                {[
                                    "Quarterly GSTR-3B Filing",
                                    "Monthly PMT-06 Challans",
                                    "IFF (Invoice Furnishing)",
                                    "Self-Assessment Method",
                                    "Dedicated Tax Manager",
                                    "Lifetime Credential Audit"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('annual')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Quarterly</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* TRUST CARD SECTION - MOVED FROM HERO */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-full max-w-4xl bg-white rounded-2xl p-6 shadow-xl border border-gray-100 relative overflow-hidden flex flex-col md:flex-row items-center gap-8"
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C]"></div>

                        <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-2xl bg-bronze/10 flex items-center justify-center relative">
                                <Shield size={40} className="text-bronze fill-bronze/20" strokeWidth={1.5} />
                                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-4 border-white">
                                    <CheckCircle size={16} className="text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-bold text-navy mb-2">Official GSTR-3B Filing Assurance</h3>
                            <p className="text-slate-500 text-sm mb-4">Our expert-backed process ensures 100% accuracy in your monthly tax payments and Input Tax Credit claims.</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6">
                                <div className="flex items-center gap-2">
                                    <Handshake size={18} className="text-bronze" />
                                    <span className="text-navy font-bold text-sm">100% Online Process</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={18} className="text-bronze" />
                                    <span className="text-navy font-bold text-sm">Legal Protection Assured</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap size={18} className="text-bronze" />
                                    <span className="text-navy font-bold text-sm">ARN Generation Guaranteed</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-auto">
                            <button
                                onClick={() => setShowRegistrationModal(true)}
                                className="w-full md:px-8 py-4 bg-navy hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                Start Now <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* EXTENSIVE CONTENT SECTION INSERTED FOR SEO */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT CONTENT COLUMN (8 Cols) */}
                <div id="details-section" className="lg:col-span-8 space-y-20">

                    {/* Introduction */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Scale className="text-bronze" /> Comprehensive Guide to GSTR-3B
                        </h2>
                        <div className="prose prose-lg text-gray-600 space-y-8">
                            <p className="lead text-xl text-gray-800 font-medium">
                                <strong>GSTR-3B</strong> is the final monthly return where a taxpayer reports the summary figures of sales, input tax credit (ITC) claimed, and pays the net tax liability to the government.
                            </p>
                            <div>
                                <h3 className="text-lg font-bold text-navy mb-4">Why GSTR-3B is Mandatory?</h3>
                                <p>
                                    Every registered person, even if they have no transactions in a month, must file GSTR-3B. It is a self-assessment return that determines the actual cash outflow for your business. Mismatches between your GSTR-1 (Sales) and GSTR-3B, or between GSTR-2B (Available Credit) and GSTR-3B (Claimed Credit), are the primary triggers for modern GST audits and notices.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 my-10">
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-lg font-bold text-navy mb-4">Rule 86B & 20% Cash Rule</h3>
                                    <p className="text-sm">
                                        Certain taxpayers with monthly turnover &gt; ₹50 Lakhs must pay at least 1% of their tax liability in cash, regardless of available ITC. We help you identify if you fall under this category.
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-lg font-bold text-navy mb-4">GSTR-2B Reconciliation</h3>
                                    <p className="text-sm">
                                        As per Rule 36(4), you can only claim ITC which is reflected in your GSTR-2B. We perform 100% reconciliation to ensure you never over-claim or under-claim.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-navy/5 p-8 rounded-3xl border border-navy/10">
                                <h3 className="text-2xl font-bold text-navy mb-6">Components of GSTR-3B</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {[
                                        { t: "Table 3.1", d: "Details of Outward Supplies (Sales) & RCM" },
                                        { t: "Table 4", d: "Eligible Input Tax Credit (ITC)" },
                                        { t: "Table 5", d: "Exempt & Non-GST Inward Supplies" },
                                        { t: "Table 6.1", d: "Tax Payment & Set-off Details" },
                                        { t: "Interest", d: "Automatic Calc on Delayed Filing" },
                                        { t: "Late Fee", d: "Applicable on delay after 20th" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                            <span className="block font-bold text-bronze text-xs mb-1">{item.t}</span>
                                            <span className="text-sm font-medium text-navy">{item.d}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* BENEFITS GRID */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Why Professional Filing Matters?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Accurate ITC Claim", desc: "We reconcile your GSTR-2B with your books to ensure you only claim valid ITC, avoiding penalties.", icon: Shield },
                                { title: "Interest Calculation", desc: "If you are filing late, we automatically calculate the exact interest liability to prevent future notices.", icon: TrendingUp },
                                { title: "Set-off Rules", desc: "Our system optimizes the set-off of IGST against CGST/SGST to minimize your cash outflow.", icon: Scale },
                                { title: "Avoid Late Fees", desc: "Timely filing ensures you save ₹50/day. We send proactive reminders.", icon: Clock },
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

                    {/* FILING PROCESS SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">GSTR-3B Filing Process</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "ITC Reconciliation", desc: "We download GSTR-2B and match it with your Purchase Register to tell you exactly how much Input Tax Credit you can legally claim." },
                                { step: "Step 2", title: "Liability Auto-Populate", desc: "Sales figures are auto-fetched from your filed GSTR-1. We verify if any amendments are needed in Table 3.1." },
                                { step: "Step 3", title: "Tax Payment Calc", desc: "Our algorithm offsets your liability using availabe ITC (IGST > CGST > SGST) to minimize cash payment." },
                                { step: "Step 4", title: "Challan & Filing", desc: "If cash payment is required, we generate the challan. Once paid, the return is filed using EVC/DSC." },
                            ].map((item, i) => (
                                <div key={i} className="group flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-100 hover:border-bronze/30 hover:shadow-lg transition-all duration-300">
                                    <div className="flex-shrink-0 w-full md:w-32 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:bg-bronze/5 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-bronze font-bold flex items-center justify-center mb-2 shadow-sm">
                                            {i + 1}
                                        </div>
                                        <span className="text-navy font-bold text-sm">Action</span>
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

                    {/* LATE FEE TABLE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">Late Fees for Delay</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-[#043E52] text-white">
                                    <tr>
                                        <th className="p-4 font-semibold text-sm uppercase tracking-wider">Scenario</th>
                                        <th className="p-4 font-semibold text-sm uppercase tracking-wider">Late Fee (Per Day)</th>
                                        <th className="p-4 font-semibold text-sm uppercase tracking-wider">Maximum Cap</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-medium">Nil Tax Liability</td>
                                        <td className="p-4 text-gray-600">₹20 (₹10 CGST + ₹10 SGST)</td>
                                        <td className="p-4 text-gray-600">₹500</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-medium">With Tax Liability</td>
                                        <td className="p-4 text-gray-600">₹50 (₹25 CGST + ₹25 SGST)</td>
                                        <td className="p-4 text-gray-600">₹5,000* (Varies)</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="p-4 bg-red-50 text-red-700 text-sm border-t border-red-100 flex gap-2 items-center">
                                <Shield size={16} /> <strong>Warning:</strong> Interest @ 18% p.a. is charged on the outstanding tax amount from the 21st day.
                            </div>
                        </div>
                    </section>

                    {/* COMPARISON TABLE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">GSTR-3B vs GSTR-1</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Feature</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">GSTR-3B</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">GSTR-1</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {[
                                        { f: "Purpose", r: "Payment of Tax & ITC Claim", c: "Reporting of Sales Details" },
                                        { f: "Amendment", r: "No - Reset in next month", c: "Yes - Via Table 9A" },
                                        { f: "Frequency", r: "Monthly (or Quarterly for QRMP)", c: "Monthly / Quarterly" },
                                        { f: "Late Fee", r: "Applicable immediately", c: "Applicable (often waived)" },
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

                    {/* WHY CHOOSE SHINEFILING */}
                    <section className="bg-gradient-to-br from-[#043E52] to-navy p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-bronze/10 rounded-full blur-3xl"></div>
                        <h2 className="text-3xl font-bold mb-6 relative z-10">Why Choose ShineFiling for GSTR-3B?</h2>
                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><FileText size={24} /></div>
                                    <div><h4 className="font-bold text-lg">2A/2B Reconciliation</h4><p className="text-gray-300 text-sm">We provide a line-item wise excel report matching your purchase register with GSTR-2B data.</p></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Scale size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Liability Offset</h4><p className="text-gray-300 text-sm">Smart algorithm to utilize IGST credit first, ensuring minimal cash payment via Electronic Cash Ledger.</p></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Shield size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Audit Trail</h4><p className="text-gray-300 text-sm">We maintain a history of all your filings and challans, accessible anytime for departmental audits.</p></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Users size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Expert Review</h4><p className="text-gray-300 text-sm">A CA validates your 3B figures against your GSTR-1 before hitting the 'Submit' button.</p></div>
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
                                <FileText className="text-bronze" /> Required Data
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">1. Sales Data</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Total Taxable Sales</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Export Sales (Zero Rated)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Exempt/Nil Rated Sales</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">2. Purchase Data (ITC)</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Eligible ITC (Goods/Services)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Import of Goods (IGST)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Reverse Charge Liability</li>
                                    </ul>
                                </div>
                            </div>
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

export default GSTR3BPage;
