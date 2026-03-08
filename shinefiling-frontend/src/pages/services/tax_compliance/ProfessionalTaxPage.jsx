
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, ArrowRight, Star, Shield, Users, Landmark, Globe, FileCheck, Check, X, Calendar, Zap, Clock, Award, ShieldCheck, Sparkles, ChevronDown, Search, Briefcase, CreditCard, Layers, History, HelpCircle, MapPin, Building, Activity, Scale, FileText, Calculator, Banknote, Handshake
} from 'lucide-react';
import ProfessionalTaxRegistration from './ProfessionalTaxRegistration';

const ProfessionalTaxPage = ({ isLoggedIn }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('standard');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is PTEC vs PTRC?", a: "PTEC (Profession Tax Enrollment Certificate) is for the entity itself (Proprietor/Company). PTRC (Registration Certificate) is for employers who deduct PT from employee salaries." },
        { q: "Is Professional Tax applicable in all states?", a: "No, it is a state-levied tax. Major states include Maharashtra, Karnataka, West Bengal, Tamil Nadu, Telangana, and Gujarat." },
        { q: "What is the maximum PT rate?", a: "Under the Constitution of India, the maximum Professional Tax that can be levied is ₹2,500 per annum per person." },
        { q: "What happens if I don't register?", a: "Penalties include heavy interest (1.25% to 2% per month) on unpaid tax, and fines for non-registration ranging from ₹1,000 to ₹5,000." },
        { q: "Are there any exemptions?", a: "Yes, exemptions are usually provided for senior citizens, persons with disabilities, and in some states, for businesses during their first year of operation." },
        { q: "How are PT returns filed?", a: "Returns are filed on the respective state government's commercial tax portal. The frequency (monthly/quarterly/annually) depends on the total tax liability." }
    ];

    const handlePlanSelect = (plan) => {
        if (isLoggedIn) {
            setSelectedPlan(plan);
            setShowRegisterModal(true);
        } else {
            navigate('/login', { state: { from: window.location.pathname } });
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=2070"
                        alt="Corporate Compliance"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/80 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>

                    {/* Animated Blob */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-20 -right-20 w-96 h-96 bg-bronze/20 rounded-full blur-3xl mix-blend-overlay"
                    />
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
                                    <MapPin size={12} className="fill-bronze" /> State Mandate Protocol
                                </span>
                                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-white tracking-tight">
                                    Professional <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white italic uppercase">Tax Shield</span>
                                </h1>
                                <p className="text-gray-300 text-xl max-w-xl font-light leading-relaxed">
                                    Comprehensive <strong className="text-white font-semibold">PTEC & PTRC</strong> compliance. Register your entity, manage employee deductions, and avoid state-level legal scrutiny.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Processing</p>
                                        <p className="font-bold text-sm text-white">48-72 Hours</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <FileCheck size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</p>
                                        <p className="font-bold text-sm text-white">Paperless</p>
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
                                    Enable Compliance
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Learn More
                                </button>
                            </motion.div>
                        </div>

                        {/* Hero Floating Card */}
                        {/* Trust Card - Official Registration (Replaces Pricing Card) - WHITE THEME COMPACT */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full md:w-[360px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl relative"
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
                                            <CheckCircle size={14} className="text-green-500 fill-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">
                                        Official <br />Registration
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Professional Tax</p>
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
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Process <br />Online</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>

                                    {/* Right Stat */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Shield size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Legal</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Protection <br />Assured</p>
                                    </div>
                                </div>

                                {/* Check List - COMPACT */}
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "Govt Registration Fee (Excl)",
                                        "PTEC Application",
                                        "PTRC Application"
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
                                    onClick={() => handlePlanSelect('startup')}
                                    className="w-full py-3 bg-navy hover:bg-black text-white font-bold text-base rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Start Registration <ArrowRight size={16} />
                                </button>

                                <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
                                    Compare all plans below
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* PRICING */}
            <section id="pricing-section" className="py-24 px-6 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <Calculator className="text-bronze mx-auto mb-4" size={40} />
                        <h2 className="text-4xl font-bold text-navy mb-4">Service Tiers</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Choose how you want to manage your advance tax liabilities.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-stretch">
                        {/* EXPERT ASSIST (Standard) */}
                        {/* EXPERT ASSIST (Standard) */}
                        <div className="bg-[#043E52] text-white rounded-3xl p-10 shadow-2xl relative transform md:-translate-y-6 z-10 flex flex-col">
                            {/* Top Gold Line */}
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>

                            <div className="absolute top-6 right-6 bg-gradient-to-r from-bronze to-yellow-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">Recommended</div>

                            <h3 className="text-2xl font-bold mb-2 text-white mt-4">Expert Assist</h3>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Per Installment</p>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-3xl font-black text-white">₹499</span>
                                <span className="text-white/20 line-through text-xl">₹999</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1 text-sm text-gray-300">
                                {["Estimation & Calculation", "Challan Generation", "Online Payment Execution", "Receipt Generation", "CA Review Aid"].map((f, i) => (
                                    <li key={i} className="flex gap-3"><CheckCircle size={18} className="text-bronze" /> {f}</li>
                                ))}
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-bronze/20 transition-all hover:scale-105">Start Filing</button>
                        </div>

                        {/* YEARLY (Premium) */}
                        <div className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
                            <h3 className="text-lg font-bold text-navy mb-2">Yearly Plan</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">All 4 Quarters</p>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-3xl font-black text-navy">₹1,499</span>
                                <span className="text-slate-300 line-through text-lg">₹2,999</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1 text-sm text-slate-600">
                                {["All 4 Installments Covered", "Capital Gains Tracking", "Priority Support", "Tax Saving Plan"].map((f, i) => (
                                    <li key={i} className="flex gap-3"><CheckCircle size={18} className="text-bronze" /> {f}</li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('enterprise')} className="w-full py-3 bg-slate-50 text-navy font-bold rounded-xl hover:bg-navy hover:text-white transition-colors border border-slate-200">Select Annual</button>
                        </div>

                        {/* The third pricing card (PREMIUM) was removed as per the instruction */}
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16 text-slate-600 leading-relaxed">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    {/* PT REGISTRATION WORKFLOW */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Professional Tax Registration Process</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Document Upload", desc: "Submit your business incorporation certificate, PAN, Aadhaar, and premises address proof." },
                                { step: "Step 2", title: "Application Submission", desc: "We file the application on the state commercial tax portal (e.g., Mahagst for Maharashtra)." },
                                { step: "Step 3", title: "Department Processing", desc: "The government officer reviews the documents. In some states, a physical inspection may occur." },
                                { step: "Step 4", title: "Certificate Issuance", desc: "Upon approval, you receive the PTEC and PTRC certificates digitally. Compliance begins immediately." },
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

                    {/* PTEC VS PTRC TABLE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">PTEC vs PTRC: Key Differences</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Feature</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">PTEC (Enrollment)</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">PTRC (Registration)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {[
                                        { f: "Who needs it?", r: "Business Entity (Proprietor, Co, LLP)", c: "Employer (Any entity with employees)" },
                                        { f: "Purpose", r: "Tax on the profession itself", c: "To deduct & deposit tax from employees" },
                                        { f: "Payment Frequency", r: "Annually (One-time pay per year)", c: "Monthly/Quarterly (As per tax liability)" },
                                        { f: "Cost", r: "Fixed (e.g., ₹2,500 p.a.)", c: "Variable (Depends on employee count & salary)" },
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

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <ShieldCheck className="text-bronze" /> State Obligations
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-lg font-medium">
                                <strong>Professional Tax</strong> is often overlooked but carries heavy penalties. It is a mandatory state tax for every <span className="text-navy font-bold underline decoration-bronze decoration-2">Business and Employee</span> earning a salary.
                            </p>
                            <div className="mt-12 grid md:grid-cols-2 gap-6">
                                {[
                                    { title: "Employer Duty", desc: "Employers must deduct PT from salary and deposit it. Failure leads to penalties on the employer.", icon: Users },
                                    { title: "Business Duty", desc: "Directors, Partners, and Proprietors must pay their own PT annually (PTEC).", icon: Building },
                                    { title: "Registration", desc: "Must register within 30 days of employing staff or starting business.", icon: FileCheck },
                                    { title: "Record Keeping", desc: "Maintain salary registers and tax payment proofs for 5 years.", icon: Layers },
                                ].map((box, i) => (
                                    <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-bronze/30 transition-all group">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-navy mb-4 group-hover:bg-navy group-hover:text-bronze transition-colors">
                                            <box.icon size={24} />
                                        </div>
                                        <h4 className="font-bold text-lg text-navy mb-2">{box.title}</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed">{box.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-lg">
                        <div className="bg-navy p-8 flex items-center justify-between text-white">
                            <h2 className="text-2xl font-bold flex items-center gap-3"><Clock className="text-bronze" /> Typical Due Dates</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#2B3446]/5 text-slate-500 border-b border-gray-200 uppercase tracking-wider font-bold">
                                    <tr>
                                        <th className="px-8 py-4">State</th>
                                        <th className="px-8 py-4">PTEC (Annual)</th>
                                        <th className="px-8 py-4">PTRC (Monthly)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">Maharashtra</td><td className="px-8 py-4 text-navy font-bold">31st March</td><td className="px-8 py-4">Last Date of Month</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">Karnataka</td><td className="px-8 py-4 text-navy font-bold">30th April</td><td className="px-8 py-4">20th of Month</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">Tamil Nadu</td><td className="px-8 py-4 text-navy font-bold">30th Sep / 31st Mar</td><td className="px-8 py-4">N/A (Half Yearly)</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">Gujarat</td><td className="px-8 py-4 text-navy font-bold">30th Sep</td><td className="px-8 py-4">15th of Month</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <HelpCircle className="text-bronze" /> Expert Insights
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all open:shadow-md">
                                    <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-bold text-navy hover:bg-gray-50 transition-colors list-none select-none">
                                        <span>{faq.q}</span>
                                        <ChevronDown className="group-open:rotate-180 transition-transform text-slate-400" />
                                    </summary>
                                    <div className="px-6 pb-6 pt-2 text-slate-600 text-sm leading-relaxed border-t border-gray-100">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Checklist
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">REGISTRATION</p>
                                    <ul className="space-y-3">
                                        {["PAN of Business & Partners", "Address Proof", "Cancelled Cheque", "Incorporation Certificate"].map((doc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600">
                                                <CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">FILING</p>
                                    <ul className="space-y-3">
                                        {["Salary Sheet", "Gross Salary Details", "Tax deducted Amount"].map((doc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600">
                                                <CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-3 bg-slate-50 hover:bg-slate-100 text-navy font-bold rounded-xl text-sm transition-colors border border-slate-200">
                                Download State Guide
                            </button>
                        </div>

                        <div className="bg-navy text-white p-8 rounded-3xl shadow-lg relative overflow-hidden group">

                            <h4 className="font-bold text-xl mb-4">State Expert</h4>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Specific guidance for your state's PT laws.</p>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shadow-inner">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Direct Help</p>
                                    <p className="font-bold text-xl text-white">080-FILE-SHINE</p>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-bronze text-white rounded-xl font-bold text-sm hover:bg-white hover:text-navy transition-all shadow-lg shadow-bronze/20">
                                Consult Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showRegisterModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="relative w-full max-w-6xl max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 bg-white ring-1 ring-white/20">
                            <div className="absolute top-4 right-4 z-50">
                                <button onClick={() => setShowRegisterModal(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[95vh]">
                                <ProfessionalTaxRegistration isLoggedIn={isLoggedIn} initialPlan={selectedPlan} onClose={() => setShowRegisterModal(false)} />
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfessionalTaxPage;
