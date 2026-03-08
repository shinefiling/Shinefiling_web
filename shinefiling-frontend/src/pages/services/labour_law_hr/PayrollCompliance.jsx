import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Calculator, FileText, Calendar, Shield, CheckCircle, BookOpen, Layers, HelpCircle, ChevronRight, PieChart, ArrowRight, Table, Users, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '../../../components/auth/AuthModal';
import ApplyPayrollCompliance from './ApplyPayrollCompliance';

const PayrollCompliancePage = ({ isLoggedIn }) => {
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
        { q: "What is included in Payroll Compliance?", a: "It typically covers end-to-end management of PF, ESI, Professional Tax, Labour Welfare Fund, and generation of monthly salary slips and tax sheets." },
        { q: "Do you handle salary processing?", a: "Yes, we calculate net payable salaries after all statutory deductions (PF, ESI, PT, TDS) and provide you with a bank upload file." },
        { q: "Is TDS on salary covered?", a: "Yes, we compute TDS on salary based on investment proofs submitted by employees and file quarterly 24Q returns." },
        { q: "What about year-end Form 16?", a: "We generate Part A and Part B of Form 16 for all employees at the end of the financial year." },
        { q: "How do you handle data security?", a: "We use secure, encrypted servers for data transfer and storage. A Non-Disclosure Agreement (NDA) is signed to ensure confidentiality." },
        { q: "Can you help with past non-compliance?", a: "Yes, we conduct a compliance audit to identify gaps in past filings and help regularize them with minimal penalties." }
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2070"
                        alt="Payroll Services"
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
                                    <Layers size={12} className="fill-bronze" /> Total HR Outsourcing
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Payroll & <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Compliance</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    End-to-end payroll management. From salary processing to filing PF, ESI, PT, and TDS returns. Focus on your business while we handle your HR compliances.
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
                                        <Calculator size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Salary</p>
                                        <p className="font-bold text-sm text-white">Slip + Tax</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Returns</p>
                                        <p className="font-bold text-sm text-white">PF/ESI/PT/TDS</p>
                                    </div>
                                </div>
                            </motion.div>

                            <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                Get Proposal
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
                                            <Calculator size={28} className="text-bronze fill-bronze/20" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <div className="bg-orange-100 rounded-full p-0.5">
                                                <Users size={12} className="text-orange-500 fill-orange-100" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">
                                        Payroll <br />Services
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Salary Management</p>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-slate-100 mb-5"></div>

                                {/* Stats Grid - COMPACT */}
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    {/* Left Stat */}
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <CheckCircle size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">360°</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Full <br />Coverage</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>

                                    {/* Right Stat */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Clock size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Timely</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Salary <br />Process</p>
                                    </div>
                                </div>

                                {/* Check List - COMPACT */}
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "Salary Processing",
                                        "PF/ESI/PT Compliance",
                                        "Payslip Generation"
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
                                    Start Payroll <ArrowRight size={16} />
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
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Service Levels</h2>
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
                            <h3 className="text-lg font-bold text-navy mb-2">Statutory Only</h3>
                            <p className="text-slate-500 text-sm mb-6">Compliance Filing.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹1,499</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">MONTHLY</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "PF ECR Filing",
                                    "ESI Monthly Filing",
                                    "PT Return (Monthly/Annual)",
                                    "Statutory Advisory"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('statutory')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Statutory</button>
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

                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Comprehensive</h3>
                            <p className="text-gray-400 text-sm mb-6">Payroll + Compliance.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹99</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase bg-white/10 px-2 py-1 rounded">PER EMP</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                {[
                                    "Salary & Payslip Mgmt",
                                    "All Statutory Filings",
                                    "Leave Management",
                                    "Quarterly TDS Ret."
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('comprehensive')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Start Retainer</button>
                        </motion.div>

                        {/* Premier */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Enterprise</h3>
                            <p className="text-slate-500 text-sm mb-6">Full Outsourcing.</p>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy border-b-2 border-slate-100">Custom</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded ml-2">CORPORATE</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Dedicated HR Manager",
                                    "Self-Service Portal",
                                    "Proof Verification",
                                    "Form 16 Generation"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('enterprise')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Contact Sales</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* INFO SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <BookOpen className="text-bronze" /> The Payroll Cycle
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium mb-4">
                                Managing payroll is not just about paying salaries on time; it's about navigating a complex web of tax laws, labor regulations, and statutory deductions.
                            </p>
                            <p className="mb-4">
                                Our end-to-end payroll service ensures 100% accuracy and compliance. We handle the entire lifecycle from the time an employee joins until they exit.
                            </p>

                            <h3 className="text-lg font-bold text-navy mt-6 mb-3">What we handle:</h3>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <h5 className="font-bold text-navy mb-2">Monthly Processing</h5>
                                    <ul className="text-sm list-disc pl-4 space-y-1 text-slate-600">
                                        <li>Attendance Inputs</li>
                                        <li>Overtime & Incentives</li>
                                        <li>TDS Deduction</li>
                                        <li>Bank Transfer File</li>
                                    </ul>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <h5 className="font-bold text-navy mb-2">Statutory Reports</h5>
                                    <ul className="text-sm list-disc pl-4 space-y-1 text-slate-600">
                                        <li>PF ECR & Challan</li>
                                        <li>ESI Contribution</li>
                                        <li>PT Monthly Return</li>
                                        <li>LWF (Half-yearly)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Structure Optimization */}
                    <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
                        <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
                            <PieChart className="text-bronze" /> CTC Optimization Strategy
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">We don't just process data; we structure it to save tax for employees and compliance costs for you.</p>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { t: "Basic Salary", d: "Optimized to 40-50% of CTC to balance PF liability and HRA benefits." },
                                { t: "HRA", d: "Structured to maximize tax exemption under Section 10(13A)." },
                                { t: "Allowances", d: "inclusion of meal cards, uniform allowance, and books & periodicals for tax-free components." }
                            ].map((item, i) => (
                                <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-100 relative">
                                    <div className="absolute -top-3 left-6 bg-navy text-white text-xs font-bold px-2 py-1 rounded">Tip {i + 1}</div>
                                    <h4 className="font-bold text-navy mb-2 mt-2">{item.t}</h4>
                                    <p className="text-sm text-slate-600 leading-snug">{item.d}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Master Calendar */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">Master Compliance Calendar</h2>
                        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#043E52] text-white">
                                    <tr>
                                        <th className="py-4 px-6 font-bold uppercase text-xs tracking-wider">Compliance</th>
                                        <th className="py-4 px-6 font-bold uppercase text-xs tracking-wider">Due Date</th>
                                        <th className="py-4 px-6 font-bold uppercase text-xs tracking-wider">Frequency</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium text-slate-600">
                                    <tr className="border-b border-slate-100"><td className="py-4 px-6 font-bold text-navy">TDS Payment</td><td className="py-4 px-6">7th of Next Month</td><td className="py-4 px-6">Monthly</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-4 px-6 font-bold text-navy">PF Payment</td><td className="py-4 px-6">15th of Next Month</td><td className="py-4 px-6">Monthly</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-4 px-6 font-bold text-navy">ESI Payment</td><td className="py-4 px-6">15th of Next Month</td><td className="py-4 px-6">Monthly</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-4 px-6 font-bold text-navy">PT (Maharashtra)</td><td className="py-4 px-6">Last Day of Month</td><td className="py-4 px-6">Monthly</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-4 px-6 font-bold text-navy">TDS Return (24Q)</td><td className="py-4 px-6">31st of month aft. Qtr end</td><td className="py-4 px-6">Quarterly</td></tr>
                                    <tr><td className="py-4 px-6 font-bold text-navy">Form 16</td><td className="py-4 px-6">15th June</td><td className="py-4 px-6">Annual</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="bg-gradient-to-r from-navy to-[#043E52] rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="md:flex justify-between items-center relative z-10">
                            <div className="mb-6 md:mb-0">
                                <h2 className="text-2xl font-bold mb-2">Year-End Stress?</h2>
                                <p className="text-gray-300 max-w-lg">
                                    We handle the chaotic Jan-Mar period: collecting investment proofs, verifying rent receipts, calculating final tax, and issuing Form 16.
                                </p>
                            </div>
                            <button className="px-6 py-3 bg-bronze text-white font-bold rounded-xl shadow-lg hover:bg-yellow-700 transition">
                                Get Year-End Support
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Layers size={150} />
                        </div>
                    </section>

                    {/* Benefits Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Why Outsource Payroll?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Cost Savings", desc: "No need to hire dedicated in-house payroll staff or buy expensive software." },
                                { title: "Compliance Guarantee", desc: "We stay updated with changing labor laws so you don't have to." },
                                { title: "Data Security", desc: "Confidential salary data is handled on secure servers with restricted access." },
                                { title: "Error-Free", desc: "Automated calculations prevent manual errors in tax and salary computation." },
                                { title: "Timeliness", desc: "Ensure your employees get paid on the exact date every month." },
                                { title: "Tax Planning", desc: "We help employees optimize their taxes through proper investment declaration management." }
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
                                <Table className="text-bronze" /> Deliverables
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Salary Register (Muster Roll)</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Pay Slips (PDF/Email)</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Bank Upload File</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> PF/ESI Challans</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Tax Computation Sheet</li>
                            </ul>
                        </div>

                        <div className="bg-[#043E52] p-8 rounded-3xl shadow-lg text-white">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                <PieChart className="text-bronze" /> Integration
                            </h3>
                            <p className="text-gray-300 text-sm mb-4">
                                We can integrate with your biometric attendance system for seamless data flow.
                            </p>
                            <button className="w-full py-3 bg-bronze/20 text-bronze border border-bronze/50 hover:bg-bronze/30 font-bold rounded-xl transition">
                                Request Demo
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
                            <ApplyPayrollCompliance
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

export default PayrollCompliancePage;
