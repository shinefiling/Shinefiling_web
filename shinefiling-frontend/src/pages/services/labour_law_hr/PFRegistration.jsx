import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, FileText, IndianRupee, Clock, Shield, CheckCircle, BookOpen, Zap, HelpCircle, ChevronRight, Star, ArrowRight, UserCheck, Building, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '../../../components/auth/AuthModal';
import ApplyPFRegistration from './ApplyPFRegistration';

const PFRegistrationPage = ({ isLoggedIn }) => {
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
        { q: "Is PF Registration mandatory?", a: "Yes, for any establishment employing 20 or more persons. It is voluntary for those with fewer than 20 employees." },
        { q: "What is the employee limit for PF?", a: "Establishments with 20+ employees must register within one month of attaining this strength. However, smaller firms can register voluntarily to provide benefits to employees." },
        { q: "What documents are required?", a: "PAN Card of the business, Address Proof (Rent Agreement/Utility Bill), Specimen Signature Card, Digital Signature (DSC) of the authorized signatory, and Canceled Cheque." },
        { q: "Who contributes to PF?", a: "Both employer and employee contribute 12% of the Basic Pay + DA towards the EPF fund. The employer's contribution is split into EPF (3.67%) and EPS (8.33%)." },
        { q: "How long does it take?", a: "Once all documents are submitted, the PF Code/Registration Number is usually generated within 3-7 working days, subject to government processing time." },
        { q: "Can I register voluntarily?", a: "Yes, establishments with less than 20 employees can register for Voluntary PF coverage with the consent of the majority of employees." }
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2026"
                        alt="Employee Benefits"
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
                                    <Shield size={12} className="fill-bronze" /> Employee Social Security
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    PF <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Registration</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Secure your employees' future with the Employees' Provident Fund (EPF). Mandatory for firms with 20+ staff to ensure retirement security and insurance benefits.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mandatory For</p>
                                        <p className="font-bold text-sm text-white">20+ Employees</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Users size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Contribution</p>
                                        <p className="font-bold text-sm text-white">12% Basic Pay</p>
                                    </div>
                                </div>
                            </motion.div>

                            <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                Register Organization
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
                                            <Shield size={28} className="text-bronze fill-bronze/20" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <div className="bg-orange-100 rounded-full p-0.5">
                                                <Building size={12} className="text-orange-500 fill-orange-100" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">
                                        PF <br />Registration
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Social Security</p>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-slate-100 mb-5"></div>

                                {/* Stats Grid - COMPACT */}
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    {/* Left Stat */}
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Users size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">20+</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Mandatory <br />For</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>

                                    {/* Right Stat */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <IndianRupee size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">12%</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">PF <br />Contribution</p>
                                    </div>
                                </div>

                                {/* Check List - COMPACT */}
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "EPFO Code Allotment",
                                        "Universal Account No",
                                        "Pension Coverage"
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
                                    Get Registered <ArrowRight size={16} />
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
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Registration Plans</h2>
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
                            <h3 className="text-lg font-bold text-navy mb-2">Voluntary</h3>
                            <p className="text-slate-500 text-sm mb-6">For less than 20 employees.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹1,499</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">STARTUP</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Voluntary Registration",
                                    "Consent Letter Drafting",
                                    "Basic Compliance Check"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('voluntary')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Voluntary</button>
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

                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Standard</h3>
                            <p className="text-gray-400 text-sm mb-6">Mandatory for 20+ staff.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹1,999</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase bg-white/10 px-2 py-1 rounded">MANDATORY</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                {[
                                    "EPFO Portal Setup",
                                    "DSC Registration",
                                    "Code Generation",
                                    "Compliance Consult"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Get Registered</button>
                        </motion.div>

                        {/* Premier */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Registration + Return</h3>
                            <p className="text-slate-500 text-sm mb-6">Start with compliance ready.</p>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy border-b-2 border-slate-100">₹3,999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded ml-2">COMBO</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "All Standard Features",
                                    "First Month Return Filing",
                                    "Employee Data Upload"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('combo')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Combo</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* INFO SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <BookOpen className="text-bronze" /> About EPF Registration
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium mb-4">
                                Employee Provident Fund (EPF), governed by the Employees' Provident Funds and Miscellaneous Provisions Act, 1952, is a social security initiative designed to secure the financial future of employees.
                            </p>
                            <p className="mb-4">
                                Any organization (Private Limited, Partnership, LLP, Proprietorship, etc.) that employs <span className="font-bold text-navy">20 or more people</span> is mandated by law to register with the EPFO. This registration is critical as it enables the employer to deduct PF from employees' salaries and contribute an equal amount to their PF accounts.
                            </p>
                            <p>
                                The PF scheme covers three main component:
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li><strong>EPF (Employee Provident Fund):</strong> For retirement corpus.</li>
                                    <li><strong>EPS (Employee Pension Scheme):</strong> For monthly pension after retirement.</li>
                                    <li><strong>EDLI (Employees' Deposit Linked Insurance):</strong> Life insurance cover for employees.</li>
                                </ul>
                            </p>
                        </div>
                    </section>

                    {/* Eligibility Table */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">Who Should Register?</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-4 font-bold text-navy">Criteria</th>
                                        <th className="p-4 font-bold text-navy">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="p-4 text-sm font-semibold text-slate-700">Mandatory Registration</td>
                                        <td className="p-4 text-sm text-slate-600">Establishments with 20 or more employees (skilled, unskilled, contract, or permanent).</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-sm font-semibold text-slate-700">Voluntary Registration</td>
                                        <td className="p-4 text-sm text-slate-600">Establishments with less than 20 employees can register voluntarily to provide benefits.</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-sm font-semibold text-slate-700">Applicable Salary</td>
                                        <td className="p-4 text-sm text-slate-600">Mandatory for employees earning basic wages up to ₹15,000 per month. Voluntary for higher earners.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="bg-[#043E52] rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-6">Documents Required</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-bronze font-bold uppercase tracking-wider text-sm">Entity Details</h4>
                                    <ul className="space-y-2">
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> PAN Card of Company/Firm</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Certificate of Incorporation / GST Cert</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Cancelled Cheque / Bank Statement</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Rent Agreement / Utility Bill (Proof of Address)</li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-bronze font-bold uppercase tracking-wider text-sm">Director / Partner / Prop</h4>
                                    <ul className="space-y-2">
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> PAN & Aadhar Card</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Digital Signature (DSC) Class 2/3</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Mobile Number & Email ID</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Timeline */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Registration Timeline</h2>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative">
                            {/* Connector Line */}
                            <div className="hidden md:block absolute top-6 left-0 w-full h-1 bg-slate-200 z-0"></div>

                            {[
                                { step: "1", title: "Docs", desc: "Day 1" },
                                { step: "2", title: "App Filing", desc: "Day 2" },
                                { step: "3", title: "DSC Verif", desc: "Day 3" },
                                { step: "4", title: "Govt Aprvl", desc: "Day 5-7" },
                                { step: "5", title: "Code Gen", desc: "Day 7" }
                            ].map((s, i) => (
                                <div key={i} className="relative z-10 flex md:flex-col items-center gap-4 bg-[#F2F1EF] md:bg-transparent p-2 md:p-0 w-full md:w-auto">
                                    <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center font-bold border-4 border-[#F2F1EF] md:border-white shadow-lg">
                                        {s.step}
                                    </div>
                                    <div className="text-left md:text-center">
                                        <h4 className="font-bold text-navy text-sm">{s.title}</h4>
                                        <p className="text-xs text-slate-500 font-bold uppercase">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Detailed Breakup */}
                    <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl overflow-hidden">
                        <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
                            <IndianRupee className="text-bronze" /> Where does the Money Go?
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">The 24% contribution is split into different accounts.</p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-slate-100 bg-slate-50">
                                        <th className="py-4 px-4 font-black uppercase text-xs text-slate-400 tracking-wider">Account</th>
                                        <th className="py-4 px-4 font-black uppercase text-xs text-slate-400 tracking-wider">Contribution Source</th>
                                        <th className="py-4 px-4 font-black uppercase text-xs text-slate-400 tracking-wider">Rate</th>
                                        <th className="py-4 px-4 font-black uppercase text-xs text-slate-400 tracking-wider">Purpose</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium text-slate-600">
                                    {[
                                        { ac: "EPF (A/c 1)", src: "Employee Share", r: "12%", p: "Savings returned on retirement + Interest" },
                                        { ac: "EPF (A/c 1)", src: "Employer Share", r: "3.67%", p: "Savings returned on retirement + Interest" },
                                        { ac: "EPS (A/c 10)", src: "Employer Share", r: "8.33%", p: "Monthly Pension after 58 years of age" },
                                        { ac: "EDLI (A/c 21)", src: "Employer Share", r: "0.50%", p: "Life Insurance up to 7 Lakhs" },
                                        { ac: "Admin (A/c 2)", src: "Employer Share", r: "0.50%", p: "EPFO Administration Cost" }
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition">
                                            <td className="py-4 px-4 font-bold text-navy">{row.ac}</td>
                                            <td className="py-4 px-4">{row.src}</td>
                                            <td className="py-4 px-4 font-bold text-bronze">{row.r}</td>
                                            <td className="py-4 px-4 text-xs">{row.p}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="bg-teal-50 border border-teal-100 rounded-3xl p-8">
                        <h2 className="text-2xl font-bold text-teal-900 mb-4 flex items-center gap-2">
                            <Zap className="text-teal-600" /> Startups & Voluntary Registration
                        </h2>
                        <p className="text-teal-800 mb-4 leading-relaxed">
                            Even if you have fewer than 20 employees, registering voluntarily can be a <strong>Talent Magnet</strong>.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-4">
                            <span className="px-4 py-2 bg-white rounded-full text-xs font-bold text-teal-700 shadow-sm border border-teal-100">✔ Attract Top Talent</span>
                            <span className="px-4 py-2 bg-white rounded-full text-xs font-bold text-teal-700 shadow-sm border border-teal-100">✔ Tax Benefits for Company</span>
                            <span className="px-4 py-2 bg-white rounded-full text-xs font-bold text-teal-700 shadow-sm border border-teal-100">✔ Credibility & Trust</span>
                        </div>
                    </section>

                    {/* Benefits Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Benefits of Registration</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Retirement Security", desc: "Builds a long-term retirement corpus with compounded interest." },
                                { title: "Tax Savings", desc: "Employer contribution is tax-deductible; Employee contribution is eligible for 80C deduction." },
                                { title: "Insurance", desc: "EDLI provides life insurance coverage of up to ₹7 Lakhs to the nominee." },
                                { title: "Pension", desc: "Employee Pension Scheme (EPS) ensures a steady income post-retirement." },
                                { title: "Emergency Fund", desc: "Partial withdrawals allowed for marriage, medical emergencies, or housing." },
                                { title: "Easy Transfer", desc: "Universal Account Number (UAN) allows easy transfer of PF when changing jobs." }
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
                                <Briefcase className="text-bronze" /> Why Register?
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Legal Compliance (Avoid Penalties)</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Tax Benefits for Employer</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Employee Retention Benefit</li>
                            </ul>
                        </div>

                        <div className="bg-[#043E52] p-8 rounded-3xl shadow-lg text-white">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                <Scale className="text-bronze" /> Contribution Rate
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-300">Employee Share</span>
                                    <span className="font-bold">12%</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-300">Employer Share</span>
                                    <span className="font-bold">12%</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-300">Admin Charges</span>
                                    <span className="font-bold">0.50%</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="text-bronze font-bold">Total Cost</span>
                                    <span className="font-bold">~24.5%</span>
                                </div>
                            </div>
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
                            <ApplyPFRegistration
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

export default PFRegistrationPage;
