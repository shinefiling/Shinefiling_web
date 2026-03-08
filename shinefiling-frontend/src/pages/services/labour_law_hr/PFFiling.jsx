import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, AlertTriangle, CheckCircle, Clock, BookOpen, Calculator, DollarSign, HelpCircle, ChevronRight, UserCheck, BarChart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '../../../components/auth/AuthModal';
import ApplyPFFiling from './ApplyPFFiling';


const PFFilingPage = ({ isLoggedIn }) => {


    const navigate = useNavigate();

    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [selectedPlan, setSelectedPlan] = useState('monthly');

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
        { q: "What is the due date for PF filing?", a: "The due date for filing the monthly PF return (ECR) and payment of dues is the 15th of every subsequent month." },
        { q: "What is ECR?", a: "Electronic Challan-cum-Return (ECR) is the electronic return format for filing PF details. It contains member-wise details of wages and contributions." },
        { q: "What happens if I file late?", a: "Late filing attracts interest u/s 7Q @ 12% p.a. and damages u/s 14B ranging from 5% to 25% depending on the delay duration." },
        { q: "Can I file a NIL return?", a: "Yes, if no employees were on duty for a particular month, a NIL return must still be filed to avoid non-compliance notices." },
        { q: "Do I need DSC for filing?", a: "Yes, a valid Class 2 or Class 3 Digital Signature Certificate (DSC) of the authorized signatory is required to approve the ECR." },
        { q: "How are damages calculated?", a: "Damages are levied as: 0-2 months delay (5%), 2-4 months (10%), 4-6 months (15%), and >6 months (25%) per annum." }
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2070"
                        alt="PF Filing"
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
                                    <FileText size={12} className="fill-bronze" /> Monthly Compliance
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    PF Return <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Filing</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Timely filing of Electronic Challan-cum-Return (ECR) is mandatory. Avoid heavy penalties and damages by ensuring compliance by the 15th.
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
                                        <Calendar size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Due Date</p>
                                        <p className="font-bold text-sm text-white">15th Monthly</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Penalty</p>
                                        <p className="font-bold text-sm text-white">25% + Interest</p>
                                    </div>
                                </div>
                            </motion.div>

                            <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                Start Filing
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
                                            <FileText size={28} className="text-bronze fill-bronze/20" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <div className="bg-orange-100 rounded-full p-0.5">
                                                <Calendar size={12} className="text-orange-500 fill-orange-100" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">
                                        PF <br />Return Filing
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Monthly Compliance</p>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-slate-100 mb-5"></div>

                                {/* Stats Grid - COMPACT */}
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    {/* Left Stat */}
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <AlertTriangle size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Avoid</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">High <br />Penalty</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>

                                    {/* Right Stat */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Calendar size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">15th</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Due <br />Date</p>
                                    </div>
                                </div>

                                {/* Check List - COMPACT */}
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "ECR Preparation",
                                        "Challan Generation",
                                        "Compliance Record"
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
                            <h3 className="text-lg font-bold text-navy mb-2">NIL Return</h3>
                            <p className="text-slate-500 text-sm mb-6">For months with no business.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹299</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">BASIC</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Monthly NIL Filing",
                                    "Avoid Penalties",
                                    "Proof of Compliance"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('nil')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select NIL</button>
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
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Popular Choice</div>

                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Standard</h3>
                            <p className="text-gray-400 text-sm mb-6">Up to 20 employees.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹499</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase bg-white/10 px-2 py-1 rounded">VALUE</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                {[
                                    "Monthly ECR Upload",
                                    "Challan Generation",
                                    "Add/Exit Employees",
                                    "KYC Verification"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Start Filing</button>
                        </motion.div>

                        {/* Premier */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">PF + ESI Combo</h3>
                            <p className="text-slate-500 text-sm mb-6">Both returns monthly.</p>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy border-b-2 border-slate-100">₹899</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded ml-2">COMPLETE</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Filing of PF ECR",
                                    "Filing of ESI Return",
                                    "Payroll Preparation",
                                    "Dedicated Support"
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
                            <BookOpen className="text-bronze" /> The Filing Process
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium mb-4">
                                Filing Employee Provident Fund (EPF) returns is a critical monthly activity for compliant businesses. The process involves uploading the <span className="font-bold text-navy">Electronic Challan-cum-Return (ECR)</span> on the Unified Portal.
                            </p>
                            <p className="mb-4">
                                The ECR contains member-wise details of wages and contributions (Employee Share + Employer Share + Pension Fund). Once the ECR is uploaded and verified, a challan is generated for payment.
                            </p>
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm mt-6">
                                <h4 className="font-bold text-navy mb-4">Steps involved:</h4>
                                <ol className="list-decimal pl-5 space-y-3">
                                    <li><strong>Data Preparation:</strong> Prepare monthly wage data in the specified text file format (ECR File).</li>
                                    <li><strong>Login:</strong> Log in to the EPFO Unified Portal (Employer Interface).</li>
                                    <li><strong>Upload ECR:</strong> Upload the text file. The portal validates the file for format errors.</li>
                                    <li><strong>Verification:</strong> Verify the summary sheet generated by the portal.</li>
                                    <li><strong>Challan Generation:</strong> Generate the TRRN (Temporary Return Reference Number) and Challan.</li>
                                    <li><strong>Payment:</strong> Make the payment via Net Banking through the portal.</li>
                                </ol>
                            </div>
                        </div>
                    </section>

                    {/* Penalties Section */}
                    <section className="bg-[#F8F9FA] border border-red-100 rounded-3xl p-8">
                        <h2 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">
                            <AlertTriangle className="fill-red-100" /> Penalties for Non-Compliance
                        </h2>
                        <p className="text-gray-700 mb-6">Delay in filing returns or payment of dues attracts two types of levies: Interest and Penal Damages.</p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h4 className="font-bold text-navy mb-2">Interest (u/s 7Q)</h4>
                                <p className="text-sm text-gray-600">Simple interest @ 12% per annum is levied on the amount due for the entire period of delay.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h4 className="font-bold text-navy mb-2">Damages (u/s 14B)</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>&#8226; 0 - 2 months delay: 5% p.a.</li>
                                    <li>&#8226; 2 - 4 months delay: 10% p.a.</li>
                                    <li>&#8226; 4 - 6 months delay: 15% p.a.</li>
                                    <li>&#8226; &gt; 6 months delay: 25% p.a.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Checklist */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Monthly Checklist</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                "Calculate Wages (Basic + DA) for all employees.",
                                "Ensure New Joinees have UAN linked with Aadhaar.",
                                "Mark Exit Date for employees who left in the previous month.",
                                "Verify KYC status (PAN, Bank, Aadhaar) of all members.",
                                "Prepare ECR text file as per latest format.",
                                "Keep DSC ready for approval (if required)."
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <CheckCircle size={20} className="text-bronze flex-shrink-0 mt-0.5" />
                                    <span className="text-sm font-medium text-navy">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* FAQs */}
                    <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl overflow-hidden">
                        <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
                            <Calculator className="text-bronze" /> Understanding ECR Data
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-slate-100">
                                        <th className="py-4 font-black uppercase text-xs text-slate-400 tracking-wider">Field Term</th>
                                        <th className="py-4 font-black uppercase text-xs text-slate-400 tracking-wider">Meaning & Calculation</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium text-slate-600">
                                    {[
                                        { t: "UAN", m: "Universal Account Number. Must be linked with Aadhaar for valid filing." },
                                        { t: "Gross Wages", m: "Total salary earned by employee before any deductions." },
                                        { t: "EPF Wages", m: "Basic + DA (Capped at ₹15,000 for purely statutory compliance)." },
                                        { t: "EPS Wages", m: "Pensionable salary (Capped at ₹15,000)." },
                                        { t: "EE Share", m: "Employee Share (12% of EPF Wages). Deducted from Salary." },
                                        { t: "ER Share", m: "Employer Share (3.67% to EPF + 8.33% to Pension Fund)." }
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                                            <td className="py-4 pr-4 font-bold text-navy">{row.t}</td>
                                            <td className="py-4 leading-relaxed">{row.m}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="bg-red-50 rounded-3xl p-8 border border-red-100">
                        <h2 className="text-2xl font-bold text-red-800 mb-6 flex items-center gap-2">
                            <AlertTriangle className="text-red-500" /> Common ECR Rejection Reasons
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { t: "UAN Not Aadhaar Verified", d: "If an employee's UAN is not seeded with Aadhaar, the ECR line item will fail." },
                                { t: "Name Mismatch", d: "Name in ECR file must strictly match the name in EPFO database." },
                                { t: "Negative Values", d: "Wages or contribution amounts cannot be negative." },
                                { t: "Exit Date Issues", d: "Contribution cannot be made for a member after their Date of Exit." }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-red-100/50">
                                    <h4 className="font-bold text-red-900 mb-2 text-sm">{item.t}</h4>
                                    <p className="text-xs text-red-800 leading-relaxed">{item.d}</p>
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
                            {[...faqs,
                            { q: "What is the difference between NCP Days and LOP?", a: "NCP (Non-Contributory Period) days are days for which no wages are paid. This reduces the pensionable service period." },
                            { q: "Can I revise a filed return?", a: "Yes, 7A/14B proceedings can be avoided if you voluntarily pay the differential amount via Supplementary Challan, but primary ECR revision is restrictive." },
                            { q: "What are the admin charges?", a: "Account 02 (Admin Charges) is 0.5% of EPF Wages (Min ₹500, or ₹75 if no contributory member)." }
                            ].map((faq, i) => (
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
                                <Clock className="text-bronze" /> Due Date
                            </h3>
                            <div className="text-center py-6 bg-slate-50 rounded-2xl mb-4">
                                <span className="text-5xl font-black text-navy block mb-2">15<span className="text-lg align-top ml-1">th</span></span>
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Of Every Month</span>
                            </div>
                            <p className="text-xs text-center text-red-500 font-medium">
                                * Late payment attracts interest @ 12% pa + damages.
                            </p>
                        </div>

                        <div className="bg-[#043E52] p-8 rounded-3xl shadow-lg text-white">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                <FileText className="text-bronze" /> Support
                            </h3>
                            <p className="text-gray-300 text-sm mb-6">
                                Need help with bulk data processing or resolving old notices?
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
                            <ApplyPFFiling
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

export default PFFilingPage;
