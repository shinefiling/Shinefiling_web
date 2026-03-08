import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, AlertTriangle, CheckCircle, Clock, BookOpen, Calculator, DollarSign, HelpCircle, ChevronRight, UserCheck, BarChart, ArrowRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '../../../components/auth/AuthModal';
import ApplyESIFiling from './ApplyESIFiling';

const ESIFilingPage = ({ isLoggedIn }) => {
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
        { q: "What is the due date for ESI monthly filing?", a: "The due date for payment of ESI contribution (Employer + Employee share) is the 15th of the following month." },
        { q: "Do I need to file a return every month?", a: "Yes, monthly contribution details must be uploaded. Additionally, returns are filed half-yearly." },
        { q: "What are the half-yearly return periods?", a: "The contribution periods are: 1st April to 30th September (Due by 11th Nov) and 1st October to 31st March (Due by 11th May)." },
        { q: "What is the penalty for late payment?", a: "Interest is charged @ 12% per annum for every day of delay. Damages may also be levied up to 25%." },
        { q: "What if no work was done in a month?", a: "A NIL contribution must be filed to avoid non-compliance notices." },
        { q: "Can I revise the return?", a: "Yes, supplementary contribution tools are available to correct omitted employees or wages." }
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=2070"
                        alt="ESI Filing"
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
                                    <Activity size={12} className="fill-bronze" /> Medical Compliance
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    ESI Return <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Filing</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Ensure seamless healthcare benefits for your team. Detailed filing of monthly contributions and half-yearly returns.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Payments</p>
                                        <p className="font-bold text-sm text-white">15th Monthly</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <FileText size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Returns</p>
                                        <p className="font-bold text-sm text-white">Half-Yearly</p>
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
                                            <Activity size={28} className="text-bronze fill-bronze/20" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <div className="bg-orange-100 rounded-full p-0.5">
                                                <Calendar size={12} className="text-orange-500 fill-orange-100" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">
                                        ESI <br />Return Filing
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
                                            <CheckCircle size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">100%</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Compliance <br />Proof</p>
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
                                        "Contribution Filing",
                                        "Challan Generation",
                                        "Benefit Continuity"
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
                            <h3 className="text-lg font-bold text-navy mb-2">NIL Filing</h3>
                            <p className="text-slate-500 text-sm mb-6">For inactive months.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹299</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">BASIC</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Monthly NIL Plan",
                                    "Prevent Non-Compliance",
                                    "Proof of Filing"
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
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Recommended</div>

                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Standard</h3>
                            <p className="text-gray-400 text-sm mb-6">Monthly Services.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹499</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase bg-white/10 px-2 py-1 rounded">MONTHLY</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                {[
                                    "Monthly Contribution Filing",
                                    "New Employee Registration",
                                    "TIC Generation",
                                    "Compliance Support"
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
                            <p className="text-slate-500 text-sm mb-6">Complete peace of mind.</p>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy border-b-2 border-slate-100">₹899</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded ml-2">COMBO</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "PF Monthly Filing",
                                    "ESI Monthly Filing",
                                    "Payroll Sheet",
                                    "Priority Support"
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
                            <BookOpen className="text-bronze" /> Filing Process
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium mb-4">
                                The Employer is responsible for depositing both their own share and the employee's share of ESI contribution to the ESIC Account.
                            </p>
                            <p className="mb-4">
                                This needs to be done online through the ESIC Portal. The process also involves generating Temporary Identification Cards (TIC) for new employees so they can avail medical benefits immediately.
                            </p>

                            <h3 className="text-lg font-bold text-navy mt-6 mb-3">Timelines to Remember</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border border-slate-200 rounded-lg">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="p-3 font-semibold text-navy">Activity</th>
                                            <th className="p-3 font-semibold text-navy">Frequency</th>
                                            <th className="p-3 font-semibold text-navy">Due Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="p-3 text-sm">Payment of Contribution</td>
                                            <td className="p-3 text-sm">Monthly</td>
                                            <td className="p-3 text-sm font-bold text-bronze">15th of next month</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 text-sm">Return Filing (Apr-Sep)</td>
                                            <td className="p-3 text-sm">Half Yearly</td>
                                            <td className="p-3 text-sm font-bold text-bronze">11th November</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 text-sm">Return Filing (Oct-Mar)</td>
                                            <td className="p-3 text-sm">Half Yearly</td>
                                            <td className="p-3 text-sm font-bold text-bronze">11th May</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* How we help section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">Our Workflow</h2>
                        <div className="space-y-6">
                            {[
                                { title: "Step 1: Data Collection", desc: "We collect wage details of all employees covering gross salary, number of days worked, and leave details." },
                                { title: "Step 2: Calculation Verification", desc: "We verify if the deductions (0.75% Employee, 3.25% Employer) are calculated correctly on the gross wages." },
                                { title: "Step 3: Portal Upload", desc: "We upload the monthly contribution data to the ESIC portal and generate the Challan." },
                                { title: "Step 4: Ticket Management", desc: "We help generate insurance numbers for new joiners and link Aadhar." }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold shrink-0">{i + 1}</div>
                                    <div>
                                        <h4 className="font-bold text-navy text-lg">{step.title}</h4>
                                        <p className="text-sm text-slate-600">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Checklist */}
                    <section className="bg-slate-50 p-8 rounded-3xl border border-dashed border-slate-300">
                        <h2 className="text-2xl font-bold text-navy mb-6">Compliance Checklist</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                "Updated Salary Sheet",
                                "List of New Joiners (Aadhar/PAN)",
                                "List of Resigned Employees",
                                "Family Details for Pehchan Card",
                                "Previous ESI Number (if any)",
                                "Bank Account for Payment"
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <div className="w-5 h-5 rounded-full border-2 border-bronze flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-bronze"></div>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Cycle Explanation */}
                    <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl overflow-hidden">
                        <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
                            <Clock className="text-bronze" /> Contribution vs Benefit Periods
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Employees are eligible for sickness/maternity benefits in the "Benefit Period" only if contributions were paid in the corresponding "Contribution Period".
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#043E52] text-white">
                                        <th className="py-4 px-6 font-bold uppercase text-xs tracking-wider">Contribution Period</th>
                                        <th className="py-4 px-6 font-bold uppercase text-xs tracking-wider">Benefit Period</th>
                                        <th className="py-4 px-6 font-bold uppercase text-xs tracking-wider">Return Due Date</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium text-slate-600">
                                    <tr className="border-b border-slate-100">
                                        <td className="py-4 px-6 font-bold text-navy">1st April - 30th Sep</td>
                                        <td className="py-4 px-6">1st Jan - 30th June (Next Year)</td>
                                        <td className="py-4 px-6 text-red-500 font-bold">11th November</td>
                                    </tr>
                                    <tr>
                                        <td className="py-4 px-6 font-bold text-navy">1st Oct - 31st Mar</td>
                                        <td className="py-4 px-6">1st July - 31st Dec (Next Year)</td>
                                        <td className="py-4 px-6 text-red-500 font-bold">11th May</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* TIC to PIC */}
                        <section className="bg-orange-50 border border-orange-100 rounded-3xl p-8">
                            <h2 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-2">
                                <UserCheck className="text-orange-600" /> TIC to PIC Conversion
                            </h2>
                            <p className="text-orange-800 text-sm mb-4">
                                A Temporary ID Card (TIC) is valid only for 30 days. To convert it to a Permanent ID Card (PIC):
                            </p>
                            <ul className="space-y-2">
                                <li className="flex gap-3 text-sm text-orange-900"><CheckCircle size={16} className="text-orange-600 mt-1" /> Link Aadhaar (Main Member + Family)</li>
                                <li className="flex gap-3 text-sm text-orange-900"><CheckCircle size={16} className="text-orange-600 mt-1" /> Upload Family Photos</li>
                                <li className="flex gap-3 text-sm text-orange-900"><CheckCircle size={16} className="text-orange-600 mt-1" /> Employer Approval on Portal</li>
                            </ul>
                        </section>

                        {/* Accident Reporting */}
                        <section className="bg-red-50 border border-red-100 rounded-3xl p-8">
                            <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                                <AlertTriangle className="text-red-600" /> Accident Reporting
                            </h2>
                            <p className="text-red-800 text-sm mb-4">
                                In case of an employment injury, compliance is critical for the employee to claim benefits.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex gap-3 text-sm text-red-900"><CheckCircle size={16} className="text-red-600 mt-1" /> Submit Form-12 (Accident Report) within 24 hours</li>
                                <li className="flex gap-3 text-sm text-red-900"><CheckCircle size={16} className="text-red-600 mt-1" /> Generate Form-16 (Medical Cert)</li>
                                <li className="flex gap-3 text-sm text-red-900"><CheckCircle size={16} className="text-red-600 mt-1" /> Ensure valid contributions</li>
                            </ul>
                        </section>
                    </div>

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
                                <Clock className="text-bronze" /> Contribution Period
                            </h3>
                            <div className="space-y-6 relative">
                                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
                                <div className="space-y-1 relative pl-8">
                                    <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold border-4 border-white">1</div>
                                    <p className="font-bold text-navy text-sm">April - Sep</p>
                                    <p className="text-xs text-slate-500">Return Due: 11th Nov</p>
                                    <p className="text-xs text-slate-500">Benefit: Jan - Jun</p>
                                </div>
                                <div className="space-y-1 relative pl-8">
                                    <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold border-4 border-white">2</div>
                                    <p className="font-bold text-navy text-sm">Oct - Mar</p>
                                    <p className="text-xs text-slate-500">Return Due: 11th May</p>
                                    <p className="text-xs text-slate-500">Benefit: Jul - Dec</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#043E52] p-8 rounded-3xl shadow-lg text-white">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                <AlertTriangle className="text-yellow-400" /> Late Fees
                            </h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Failing to pay by 15th charges interest @ 12% p.a.
                            </p>
                            <p className="text-gray-300 text-sm mb-6">
                                Penal damages can go up to 25% for delays &gt; 6 months.
                            </p>
                            <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition">
                                File Now
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
                            <ApplyESIFiling
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

export default ESIFilingPage;
