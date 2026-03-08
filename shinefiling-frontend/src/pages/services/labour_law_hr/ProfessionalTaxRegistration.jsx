import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Landmark, FileText, Map, Shield, CheckCircle, BookOpen, Scale, HelpCircle, ChevronRight, AlertTriangle, ArrowRight, Building, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '../../../components/auth/AuthModal';
import ApplyProfessionalTax from './ApplyProfessionalTax';

const ProfessionalTaxRegistrationPage = ({ isLoggedIn }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [selectedPlan, setSelectedPlan] = useState('standard');

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
        { q: "Who needs Professional Tax Registration?", a: "Every individual or business entity engaged in any profession, trade, or employment is liable to pay Professional Tax in applicable states." },
        { q: "What is the difference between PTEC and PTRC?", a: "PTEC is for the business entity/owner/director's own tax liability. PTRC is for the employer to deduct tax from employees' salaries." },
        { q: "Is it applicable in all states?", a: "No, it is applicable in states like Maharashtra, Karnataka, West Bengal, Madhya Pradesh, Gujarat, Tamil Nadu, Andhra Pradesh, etc." },
        { q: "What is the maximum tax payable?", a: "The maximum amount of Professional Tax that can be levied by a state is currently capped at ₹2,500 per annum per person." },
        { q: "What are the documents required?", a: "PAN, Address Proof of Business, Incorporation Certificate, Bank Details, and in some states, Shop Act License." },
        { q: "Is there a penalty for non-registration?", a: "Yes, states levy heavy penalties for failure to obtain registration or enrollment certificate within the due date." }
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2070"
                        alt="Tax Registration"
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
                                    <Landmark size={12} className="fill-bronze" /> State Tax Compliance
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Professional Tax <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Registration</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Mandatory registration for Professionals and Employers in select states (Maharashtra, Karnataka, etc.). Get your PTRC & PTEC quickly.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Type</p>
                                        <p className="font-bold text-sm text-white">PTRC & PTEC</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Map size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Applicability</p>
                                        <p className="font-bold text-sm text-white">State Wise</p>
                                    </div>
                                </div>
                            </motion.div>

                            <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                Register Today
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
                                            <Landmark size={28} className="text-bronze fill-bronze/20" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <div className="bg-orange-100 rounded-full p-0.5">
                                                <Briefcase size={12} className="text-orange-500 fill-orange-100" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">
                                        PT <br />Registration
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">State Tax</p>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-slate-100 mb-5"></div>

                                {/* Stats Grid - COMPACT */}
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    {/* Left Stat */}
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Map size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">State</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Specific <br />Law</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>

                                    {/* Right Stat */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <CheckCircle size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Legal</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Work <br />Permit</p>
                                    </div>
                                </div>

                                {/* Check List - COMPACT */}
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "Employer Registration",
                                        "Employee Enrolment",
                                        "Certificate Issue"
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
                            <h3 className="text-lg font-bold text-navy mb-2">PTEC Only</h3>
                            <p className="text-slate-500 text-sm mb-6">For Directors/Partners.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹999</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">INDIVIDUAL</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "PTEC Application",
                                    "Challan Payment Support",
                                    "For Self-Employed",
                                    "Compliance Advisory"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('ptec')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select PTEC</button>
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
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Popular</div>

                            <h3 className="text-lg font-bold text-white mb-2 mt-1">PTRC Only</h3>
                            <p className="text-gray-400 text-sm mb-6">For Employers (Staff).</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹1,499</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase bg-white/10 px-2 py-1 rounded">EMPLOYER</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                {[
                                    "PTRC Registration",
                                    "Employer Code Generation",
                                    "Staff Deduction Setup",
                                    "State Tax Slab Guide"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('ptrc')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Select PTRC</button>
                        </motion.div>

                        {/* Premier */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">PTRC + PTEC</h3>
                            <p className="text-slate-500 text-sm mb-6">Complete Compliance.</p>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy border-b-2 border-slate-100">₹2,199</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded ml-2">COMBO</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Both registrations included",
                                    "Best for New Companies",
                                    "Priority Processing",
                                    "Expert Consultation"
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
                            <BookOpen className="text-bronze" /> What is Professional Tax?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium mb-4">
                                Professional Tax is a state-level tax imposed on income earned by way of profession, trade, calling, or employment.
                            </p>
                            <p className="mb-4">
                                Contrary to its name, it is not just for professionals like doctors or lawyers but for anyone earning an income. The tax is collected by the Commercial Tax Department of the respective state.
                            </p>
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6 rounded-r-xl">
                                <h4 className="font-bold text-blue-900 mb-2">Note on Applicability:</h4>
                                <p className="text-blue-800 text-sm">
                                    It is strictly state-dependent. States like New Delhi, Haryana, and Uttar Pradesh do NOT have Professional Tax. States like Maharashtra, Karnataka, West Bengal, and Tamil Nadu DO have it.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* PTRC vs PTEC */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">PTRC vs. PTEC: The Difference</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-xl font-bold text-navy mb-2 flex items-center gap-2"><Briefcase className="text-bronze" /> PTRC</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Professional Tax Registration Certificate</p>
                                <p className="text-slate-600 text-sm mb-4">
                                    Required by the <strong>Employer</strong> to deduct professional tax from the <strong>Emloyees'</strong> salary and deposit it to the government.
                                </p>
                                <ul className="text-sm space-y-2">
                                    <li className="flex gap-2"><CheckCircle size={14} className="text-green-500 mt-1" /> For companies with staff</li>
                                    <li className="flex gap-2"><CheckCircle size={14} className="text-green-500 mt-1" /> Monthly filing required</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-xl font-bold text-navy mb-2 flex items-center gap-2"><UserCheck className="text-bronze" /> PTEC</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Professional Tax Enrolment Certificate</p>
                                <p className="text-slate-600 text-sm mb-4">
                                    Required by the <strong>Business/Professional</strong> itself (e.g., Company, Director, Partner, Doctor, Freelancer) to pay their <strong>own</strong> tax.
                                </p>
                                <ul className="text-sm space-y-2">
                                    <li className="flex gap-2"><CheckCircle size={14} className="text-green-500 mt-1" /> For Directors/Partners</li>
                                    <li className="flex gap-2"><CheckCircle size={14} className="text-green-500 mt-1" /> Annual payment usually</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="bg-[#043E52] rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-6">Documents Required</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-bronze font-bold uppercase tracking-wider text-sm">Business Documents</h4>
                                    <ul className="space-y-2">
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> PAN Card of Company/Firm</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> COI / Partnership Deed</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Shop & Est. License (if applicable)</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Bank Statement / Cancelled Cheque</li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-bronze font-bold uppercase tracking-wider text-sm">Personal Documents</h4>
                                    <ul className="space-y-2">
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> PAN of Directors/Partners</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Aadhar of Directors/Partners</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Passport Size Photos</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Detailed Process */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <BookOpen className="text-bronze" /> Registration Process in Detail
                        </h2>
                        <div className="relative border-l-4 border-bronze/20 ml-4 space-y-12">
                            {[
                                { title: "Document Collation", desc: "We collect all necessary KYC documents of Directors/Partners and the Business Entity. Our experts verify the validity of address proofs and Shop Act licenses." },
                                { title: "Portal Account Creation", desc: "We create a user account on the respective State Government's Commercial Tax Department portal (e.g., Mahagst for Maharashtra)." },
                                { title: "Form Submission", desc: "Filing of the application form (Form I for PTRC / Form II for PTEC) with precise business details to avoid rejection." },
                                { title: "Challan Generation", desc: "Generation of payment challan for government fees. We assist you in making the payment via Net Banking." },
                                { title: "Certificate Issuance", desc: "Upon verification by the Tax Officer, the Registration Certificate (RC) is generated digitally. We download and email it to you." }
                            ].map((step, i) => (
                                <div key={i} className="relative pl-8">
                                    <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-bronze border-4 border-white shadow-sm"></div>
                                    <h3 className="text-xl font-bold text-navy mb-2">{step.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* State Wise Table */}
                    <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl overflow-hidden">
                        <h2 className="text-2xl font-bold text-navy mb-6">State-Wise Applicability & Rates</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-slate-100">
                                        <th className="py-4 font-black uppercase text-xs text-slate-400 tracking-wider">State</th>
                                        <th className="py-4 font-black uppercase text-xs text-slate-400 tracking-wider">Applicability</th>
                                        <th className="py-4 font-black uppercase text-xs text-slate-400 tracking-wider">Max Tax (Per Annum)</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium text-slate-600">
                                    {[
                                        { s: "Maharashtra", a: "Mandatory for all professions > ₹7.5k/m income", t: "₹2,500" },
                                        { s: "Karnataka", a: "Mandatory for Salary > ₹15k/m", t: "₹2,500" },
                                        { s: "Tamil Nadu", a: "Mandatory every 6 months", t: "₹2,500" },
                                        { s: "West Bengal", a: "Mandatory", t: "₹2,500" },
                                        { s: "Gujarat", a: "Mandatory > ₹6k/m", t: "₹2,400" },
                                        { s: "Madhya Pradesh", a: "Mandatory", t: "₹2,500" },
                                        { s: "Telangana", a: "Mandatory", t: "₹2,500" },
                                        { s: "Andhra Pradesh", a: "Mandatory", t: "₹2,500" }
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                                            <td className="py-4 pr-4 font-bold text-navy">{row.s}</td>
                                            <td className="py-4 pr-4">{row.a}</td>
                                            <td className="py-4">{row.t}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-4 text-xs text-slate-400 italic">* Rates and slabs are subject to periodic state budget amendments.</p>
                    </section>

                    {/* Exemptions */}
                    <section className="bg-teal-50 rounded-3xl p-8 border border-teal-100">
                        <h2 className="text-2xl font-bold text-teal-900 mb-6 flex items-center gap-2">
                            <UserCheck className="text-teal-600" /> Exemptions
                        </h2>
                        <p className="text-teal-800 mb-6">While most professionals are covered, certain categories are often exempt (varies by state):</p>
                        <ul className="grid md:grid-cols-2 gap-4">
                            {[
                                "Senior Citizens (above 65 years)",
                                "Parents of children with permanent disability",
                                "Members of the armed forces (Army/Navy/Air Force)",
                                "Badli workers in the textile industry",
                                "Women exclusively engaged as agents under Mahila Pradhan Kshetriya Bachat Yojana"
                            ].map((ex, i) => (
                                <li key={i} className="flex items-start gap-3 text-teal-900 font-medium text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></span>
                                    {ex}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* FAQs */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <HelpCircle className="text-bronze" /> Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {[...faqs,
                            { q: "Is Professional Tax deducted monthly or annually?", a: "For Salaried employees (PTRC), it is deducted monthly (e.g., ₹200/month). For Businesses/Directors (PTEC), it is usually paid annually in a lump sum (e.g., ₹2,500 by 30th June)." },
                            { q: "Can I file Professional Tax returns myself?", a: "Yes, you can. However, the state portals can be complex, and missing deadlines attracts fines. It is advisable to use a service like ours for error-free compliance." },
                            { q: "What is the penalty for late payment in Maharashtra?", a: "In Maharashtra, interest of 1.25% to 2% per month is charged on the unpaid amount, plus a stiff penalty of 10% of the tax amount." }
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
                                <AlertTriangle className="text-bronze" /> Why Register?
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Avoid heavy penalties (varies by state)</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Mandatory for Bank Loans</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Essential for Business Compliance</li>
                            </ul>
                        </div>

                        <div className="bg-[#043E52] p-8 rounded-3xl shadow-lg text-white">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                <Scale className="text-bronze" /> Tax Slabs
                            </h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Typical Slab (Maharashtra Ex):
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-400">Up to ₹7,500</span>
                                    <span className="font-bold">NIL</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-400">₹7,501 - ₹10,000</span>
                                    <span className="font-bold">₹175</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="text-gray-400">Above ₹10,000</span>
                                    <span className="font-bold text-bronze">₹200/2,500 pa</span>
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
                            <ApplyProfessionalTax
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

export default ProfessionalTaxRegistrationPage;
