import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, HeartHandshake, FileText, Calendar, Shield, CheckCircle, BookOpen, Users, HelpCircle, ChevronRight, AlertTriangle, ArrowRight, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '../../../components/auth/AuthModal';
import ApplyLabourWelfareFund from './ApplyLabourWelfareFund';

const LabourWelfareFundPage = ({ isLoggedIn }) => {
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

    const faqs = [
        { q: "What is Labour Welfare Fund (LWF)?", a: "LWF is a statutory contribution managed by the State Labour Welfare Board to provide benefits to laborers and their families." },
        { q: "Who contributes to LWF?", a: "Both Employer and Employee contribute to the fund. The rates and frequency vary by state (e.g., every 6 months in Maharashtra)." },
        { q: "Is it mandatory?", a: "Yes, for establishments covered under the Shops & Establishments Act or Factories Act in applicable states." },
        { q: "What are the due dates?", a: "In Maharashtra, it is payable twice a year: for June period (Due 15th July) and December period (Due 15th Jan)." },
        { q: "What acts does it cover?", a: "It typically covers employees earning up to a certain limit (e.g., ₹3,000/month in some old acts, but often applies to all employees in practice depending on state rules)." },
        { q: "What happens to the money?", a: "The board uses it for welfare schemes like medical aid, education scholarships for children, reading rooms, and recreational facilities." }
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1590496793907-72ee211b52e3?auto=format&fit=crop&q=80&w=2071"
                        alt="Labour Welfare"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/80 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="flex-1 text-center lg:text-left space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                                    <HeartHandshake size={12} className="fill-bronze" /> Labor Benefits
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Labour Welfare <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Fund</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Mandatory semi-annual contribution to support laborer welfare schemes. Ensure compliance with State Labor Boards.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Applicability</p>
                                        <p className="font-bold text-sm text-white">5+ Staff</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Calendar size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Frequency</p>
                                        <p className="font-bold text-sm text-white">Semi-Annual</p>
                                    </div>
                                </div>
                            </motion.div>

                            <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                Contribute Now
                            </button>
                        </div>

                        {/* Pricing Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full md:w-[360px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl relative cursor-pointer"
                            onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })}
                        >
                            <div className="bg-white rounded-[20px] p-6 overflow-hidden relative shadow-inner">
                                {/* Top Gold Line (Matching other pages) */}
                                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C]"></div>

                                {/* Header - COMPACT */}
                                <div className="flex flex-col items-center justify-center text-center mb-5 mt-2">
                                    <div className="mb-3 relative">
                                        <div className="w-14 h-14 rounded-full bg-bronze/10 flex items-center justify-center">
                                            <HeartHandshake size={28} className="text-bronze fill-bronze/20" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <div className="bg-orange-100 rounded-full p-0.5">
                                                <Building size={12} className="text-orange-500 fill-orange-100" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">
                                        LWF <br />Filing
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Worker Welfare</p>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-slate-100 mb-5"></div>

                                {/* Stats Grid - COMPACT */}
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    {/* Left Stat */}
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Calendar size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">2x</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Yearly <br />Filing</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>

                                    {/* Right Stat */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Users size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">All</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Staff <br />Covered</p>
                                    </div>
                                </div>

                                {/* Check List - COMPACT */}
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "State Mandated",
                                        "Employee Contribution",
                                        "Social Security"
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
                                    File Return <ArrowRight size={16} />
                                </button>

                                <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
                                    Compare all plans below
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* PRICING PLANS */}
            <section id="pricing-plans" className="py-20 px-6 lg:px-12 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Our Packages</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Filing Plans</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* Basic */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">One-Time</h3>
                            <p className="text-slate-500 text-sm mb-6">Single Filing Period.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">SINGLE</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "June / Dec Filing",
                                    "Challan Generation",
                                    "Payment Support",
                                    "Filing Proof"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('onetime')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select One-Time</button>
                        </motion.div>

                        {/* Standard */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Recommended</div>

                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Annual</h3>
                            <p className="text-gray-400 text-sm mb-6">Both Period Filings.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹1,799</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase bg-white/10 px-2 py-1 rounded">YEARLY</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                {[
                                    "Covers Full Year",
                                    "Reminder Service",
                                    "Compliance Certificate",
                                    "Free Consultation"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('annual')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Subscribe Annual</button>
                        </motion.div>

                        {/* Premier */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Compliance Audit</h3>
                            <p className="text-slate-500 text-sm mb-6">Check past dues.</p>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy border-b-2 border-slate-100">₹2,499</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded ml-2">AUDIT</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Review Past 3 Years",
                                    "Identify Gaps",
                                    "Late Payment Advice",
                                    "Mitigation Strategy"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('audit')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Audit</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* INFO SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <BookOpen className="text-bronze" /> About Labour Welfare Fund
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium mb-4">
                                The Labour Welfare Fund is a statutory fund established by individual state governments to improved the working conditions and living standards of laborers.
                            </p>
                            <p className="mb-4">
                                It provides aid to workers and their families in forms such as medical facilities, housing loans, educational scholarships for children, and recreational facilities.
                            </p>
                            <p>
                                The Act is applicable to all companies, establishments, and factories employing <span className="font-bold text-navy">5 or more persons</span> (varies by state).
                            </p>
                        </div>
                    </section>

                    <section className="bg-slate-50 p-8 rounded-3xl border border-dashed border-slate-300">
                        <h2 className="text-2xl font-bold text-navy mb-6">Contribution Cycles (Maharashtra)</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-navy mb-2 flex items-center gap-2"><Calendar className="text-bronze" /> Cycle 1</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li><strong>Period:</strong> Jan to June</li>
                                    <li><strong>Deduction:</strong> From June Salary</li>
                                    <li><strong>Payment Due:</strong> 15th July</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-navy mb-2 flex items-center gap-2"><Calendar className="text-bronze" /> Cycle 2</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li><strong>Period:</strong> July to Dec</li>
                                    <li><strong>Deduction:</strong> From Dec Salary</li>
                                    <li><strong>Payment Due:</strong> 15th Jan</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* State wise table */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">State-Wise Snapshot</h2>
                        <p className="text-slate-500 mb-6">LWF rules vary drastically by state. Here is a quick look at major hubs:</p>
                        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#043E52] text-white">
                                    <tr>
                                        <th className="py-4 px-6 font-bold uppercase text-xs tracking-wider">State</th>
                                        <th className="py-4 px-6 font-bold uppercase text-xs tracking-wider">Frequency</th>
                                        <th className="py-4 px-6 font-bold uppercase text-xs tracking-wider">Employee Share</th>
                                        <th className="py-4 px-6 font-bold uppercase text-xs tracking-wider">Employer Share</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium text-slate-600">
                                    <tr className="border-b border-slate-100"><td className="py-4 px-6 font-bold text-navy">Maharashtra</td><td className="py-4 px-6">Every 6 Months</td><td className="py-4 px-6">₹12</td><td className="py-4 px-6">₹36</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-4 px-6 font-bold text-navy">Karnataka</td><td className="py-4 px-6">Annual</td><td className="py-4 px-6">₹20</td><td className="py-4 px-6">₹40</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-4 px-6 font-bold text-navy">Haryana</td><td className="py-4 px-6">Monthly</td><td className="py-4 px-6">0.2% of Salary</td><td className="py-4 px-6">Double of Emp</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-4 px-6 font-bold text-navy">Tamil Nadu</td><td className="py-4 px-6">Annual</td><td className="py-4 px-6">₹10</td><td className="py-4 px-6">₹20</td></tr>
                                    <tr><td className="py-4 px-6 font-bold text-navy">Delhi</td><td className="py-4 px-6">Every 6 Months</td><td className="py-4 px-6">₹0.75 / ₹6</td><td className="py-4 px-6">Mult.</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Non Compliance */}
                    <section className="bg-red-50 border border-red-100 rounded-3xl p-8">
                        <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="text-red-600" /> Consequences of Non-Compliance
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <ul className="space-y-3">
                                <li className="flex gap-3 text-sm text-red-800"><ArrowRight size={16} className="text-red-500 mt-1" /> Interest penalty ranging from 12% to 24% per annum depending on state.</li>
                                <li className="flex gap-3 text-sm text-red-800"><ArrowRight size={16} className="text-red-500 mt-1" /> Huge fines per employee for delayed periods.</li>
                            </ul>
                            <ul className="space-y-3">
                                <li className="flex gap-3 text-sm text-red-800"><ArrowRight size={16} className="text-red-500 mt-1" /> Legal prosecution of Directors/Partners in severe cases.</li>
                                <li className="flex gap-3 text-sm text-red-800"><ArrowRight size={16} className="text-red-500 mt-1" /> Loss of eligibility for government tenders.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Benefits Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Welfare Schemes Covered</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Medical Aid", desc: "Financial assistance for medical treatment of workers and dependents." },
                                { title: "Education", desc: "Scholarships for children of workers for higher education." },
                                { title: "Marriage Assistance", desc: "Financial help for marriage of worker's daughter." },
                                { title: "Funeral Expenses", desc: "Coverage for funeral rites." },
                                { title: "Housing", desc: "Loans or subsidies for housing." },
                                { title: "Recreation", desc: "Funding for reading rooms, libraries, and sports." }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                                    <h4 className="font-bold text-navy mb-2 flex items-center gap-2">
                                        <CheckCircle size={18} className="text-bronze" /> {item.title}
                                    </h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
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

                {/* Sidebar */}
                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <Users className="text-bronze" /> Contribution (MH)
                            </h3>
                            <div className="space-y-4 text-sm text-gray-700">
                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                    <span>Employee</span>
                                    <span className="font-bold">₹12.00</span>
                                </div>
                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                    <span>Employer</span>
                                    <span className="font-bold">₹36.00</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="text-bronze font-bold">Total (6 monthly)</span>
                                    <span className="font-bold text-navy">₹48.00</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-4 italic">
                                * Rates vary by employee salary slab in some states. Above is typical for &gt; ₹3000 salary.
                            </p>
                        </div>

                        <div className="bg-[#043E52] p-8 rounded-3xl shadow-lg text-white">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                <AlertTriangle className="text-yellow-400" /> Caution
                            </h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Inspectors can demand LWF records during inspections.
                            </p>
                            <p className="text-gray-300 text-sm mb-6">
                                Ensure all present employees are covered.
                            </p>
                            <button className="w-full py-3 bg-bronze/20 text-bronze border border-bronze/50 hover:bg-bronze/30 font-bold rounded-xl transition">
                                Talk to Expert
                            </button>
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
                            <ApplyLabourWelfareFund
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

export default LabourWelfareFundPage;
