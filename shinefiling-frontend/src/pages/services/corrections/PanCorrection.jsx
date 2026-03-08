import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle, User, CreditCard, FileText, RefreshCw, HelpCircle, Shield,
    BookOpen, Clock, Zap, ChevronRight, Star, ArrowRight, X, PenTool, Handshake, Banknote,
    AlertTriangle, ThumbsUp, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PanCorrectionRegistration from './PanCorrectionRegistration';
import AuthModal from '../../../components/auth/AuthModal';

const PanCorrection = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('correction');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        const storedUser = localStorage.getItem('user');
        if (isLoggedIn || !!storedUser) {
            setShowRegisterModal(true);
        } else {
            setAuthMode('login');
            setShowAuthModal(true);
        }
    };

    const faqs = [
        { q: "How long does PAN correction take?", a: "It usually takes 15-20 working days after the physical documents are received by the department." },
        { q: "Can I change my Photo and Signature?", a: "Yes, you can update your photo and signature. This is mandatory if they are very old or unclear." },
        { q: "What documents are needed for Name Change?", a: "For minor spelling errors, Aadhaar is enough. For complete name change (e.g., after marriage), a Marriage Certificate or Gazette Notification is required." },
        { q: "Will my PAN Number change?", a: "No, your Permanent Account Number (PAN) remains the same. Only the details on the card and database are updated." },
        { q: "Is sending physical documents mandatory?", a: "Yes, for correction applications, the signed acknowledgment and original documents often need to be couriered to NSDL/UTIITSL." },
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">
            <AnimatePresence>
                {showRegisterModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-6 animate-in fade-in duration-300">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2rem] w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl relative flex flex-col"
                        >
                            <PanCorrectionRegistration
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

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=2070"
                        alt="Identity Document"
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
                        className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-blue-400/20 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.15, 0.1],
                            x: [0, -50, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[100px]"
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
                                    <RefreshCw size={12} className="text-bronze" /> Update Details
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    PAN Card <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Correction & Update</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Wrong Name? Old Photo? Update your PAN card details seamlessly. We handle the entire <strong>Correction Process</strong> and deliver the new card to your doorstep.
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
                                        <User size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fix</p>
                                        <p className="font-bold text-sm text-white">Name / DOB</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <PenTool size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Update</p>
                                        <p className="font-bold text-sm text-white">Signature</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Update PAN
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <BookOpen size={18} /> Learn More
                                </button>
                            </div>
                        </div>

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
                                        Official <br />Correction
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">PAN Services</p>
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
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Delivery <br />Assured</p>
                                    </div>
                                </div>

                                {/* Check List - COMPACT */}
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "Correction Filing",
                                        "Data Update",
                                        "Doorstep Delivery"
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
                                    Start Correction <ArrowRight size={16} />
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
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Service Packages</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Choose Your Option</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* PLAN 1: REPRINT */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Reprint Only</h3>
                            <p className="text-slate-500 text-sm mb-6">Lost Card? Get Duplicate.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹199</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">₹300</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Physical Card Delivery</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> No Changes in Data</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Track Status</li>
                                <li className="flex items-center gap-3 text-sm text-slate-400"><X size={16} /> No Corrections</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('reprint')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Reprint</button>
                        </motion.div>

                        {/* PLAN 2: CORRECTION - POPULAR */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Most Popular</div>

                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Data Correction</h3>
                            <p className="text-gray-400 text-sm mb-6">Name, DOB, Photo, Fathers Name.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹299</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹500</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={16} className="text-bronze" /> Update Photo & Sign</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={16} className="text-bronze" /> Spelling Corrections</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={16} className="text-bronze" /> Date of Birth Fix</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={16} className="text-bronze" /> New Card Delivery</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('correction')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Select Correction</button>
                        </motion.div>

                        {/* PLAN 3: MAJOR CHANGE */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Major Name Change</h3>
                            <p className="text-slate-500 text-sm mb-6">Marriage / Gazette.</p>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy">₹999</span>
                                <span className="text-slate-400 line-through text-xs">₹1,500</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Complete Name Change</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Gazette Guidance</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Affidavit Drafting</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Guaranteed Approval</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('major')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Major</button>
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
                            <RefreshCw className="text-bronze" /> Keep Your Identity Updated
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                A <strong>PAN Card</strong> is the most critical financial identity document in India. Discrepancies in Name or Date of Birth can lead to rejection of loan applications, ITR filing issues, and KYC failures.
                            </p>
                            <p>
                                Whether you want to update your old photo, correct a spelling mistake in your father's name, or change your surname after marriage, the correction process ensures your records are accurate across all government databases.
                            </p>
                        </div>
                    </section>

                    {/* New Section: Consequences of Incorrect PAN */}
                    <section>
                        <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-r-2xl text-left">
                            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                                <AlertTriangle className="text-red-600" /> Consequences of Incorrect PAN Details
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-sm text-red-900/80">
                                        <X size={16} className="mt-0.5 shrink-0" /> Rejection of Loan Applications
                                    </li>
                                    <li className="flex gap-3 text-sm text-red-900/80">
                                        <X size={16} className="mt-0.5 shrink-0" /> Issues in Filing Income Tax Returns (ITR)
                                    </li>
                                </ul>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-sm text-red-900/80">
                                        <X size={16} className="mt-0.5 shrink-0" /> Failure in KYC Verification (Bank/Demat)
                                    </li>
                                    <li className="flex gap-3 text-sm text-red-900/80">
                                        <X size={16} className="mt-0.5 shrink-0" /> Delays in PF Withdrawal & Claims
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* What Can Be Corrected */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 text-left">What Can You Correct?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Name Correction", desc: "Spelling errors or full name change (with proof)." },
                                { title: "Father's Name", desc: "Correction of father's name to match Aadhaar/Passport." },
                                { title: "Date of Birth", desc: "Critical for ITR filing and passport linkage." },
                                { title: "Photo & Signature", desc: "Update old childhood photos or unclear signatures." },
                                { title: "Address Update", desc: "Update communication address for delivering the card." },
                                { title: "Contact Details", desc: "Update Mobile Number and Email ID for OTPs." },
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-lg group text-left">
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

                    {/* New Section: Detailed Scenarios Table */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 text-left">Common Correction Scenarios</h2>
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200 font-bold text-navy text-sm uppercase tracking-wide">
                                <div className="col-span-4 text-left">Scenario</div>
                                <div className="col-span-4 text-left">What to Submit?</div>
                                <div className="col-span-4 text-left">Turnaround Time</div>
                            </div>
                            {[
                                { case: "Spelling Mistake in Name", proof: "Aadhaar / Voter ID / Driving License", time: "15-20 Days" },
                                { case: "Complete Name Change", proof: "Marriage Certificate / Gazette Notification", time: "25-30 Days" },
                                { case: "Date of Birth Correction", proof: "Birth Certificate / 10th Marksheet", time: "15-20 Days" },
                                { case: "Father's Name Correction", proof: "Father's Proof / Ration Card", time: "15-20 Days" },
                                { case: "Signature/Photo Update", proof: "Recent Photo & Sign on Form", time: "15-20 Days" },
                            ].map((row, idx) => (
                                <div key={idx} className="grid grid-cols-12 p-4 border-b border-gray-100 text-sm hover:bg-slate-50 transition-colors items-center text-left">
                                    <div className="col-span-4 font-semibold text-navy">{row.case}</div>
                                    <div className="col-span-4 text-slate-600">{row.proof}</div>
                                    <div className="col-span-4 text-green-600 font-bold">{row.time}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Process Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 text-left">Correction Process</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Fill details", days: "Day 1", desc: "Fill our simple form with the correct details you want on the card." },
                                { step: "Step 2", title: "Proof Submission", days: "Day 1", desc: "Upload supporting documents (Aadhaar, Voter ID, etc.) covering the change." },
                                { step: "Step 3", title: "Application Filing", days: "Day 2", desc: "We file the correction request with NSDL/UTI." },
                                { step: "Step 4", title: "Delivery", days: "15-20 Days", desc: "Physical card is dispatched to your address by the department." }
                            ].map((item, i) => (
                                <div key={i} className="group flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-100 hover:border-bronze/30 hover:shadow-lg transition-all duration-300 text-left">
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

                    {/* New Section: Why Choose ShineFiling */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 text-left">Why Trust ShineFiling?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex gap-4 text-left">
                                <div className="bg-blue-100 rounded-xl p-3 h-fit text-blue-600">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-navy text-lg mb-2">Error-Free Application</h3>
                                    <p className="text-sm text-slate-600">Our experts verify every detail before submission to ensure zero rejection chances.</p>
                                </div>
                            </div>
                            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 flex gap-4 text-left">
                                <div className="bg-amber-100 rounded-xl p-3 h-fit text-amber-600">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-navy text-lg mb-2">Priority Processing</h3>
                                    <p className="text-sm text-slate-600">We file correction requests under priority mode for faster approval from the department.</p>
                                </div>
                            </div>
                            <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100 flex gap-4 text-left">
                                <div className="bg-green-100 rounded-xl p-3 h-fit text-green-600">
                                    <ThumbsUp size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-navy text-lg mb-2">Dedicated Support</h3>
                                    <p className="text-sm text-slate-600">Get a dedicated account manager to assist you throughout the correction process.</p>
                                </div>
                            </div>
                            <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100 flex gap-4 text-left">
                                <div className="bg-purple-100 rounded-xl p-3 h-fit text-purple-600">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-navy text-lg mb-2">Real-time Tracking</h3>
                                    <p className="text-sm text-slate-600">Track your application status at every step via our dashboard and SMS updates.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQs */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3 text-left">
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
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-left">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Documents Required
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Existing PAN Copy</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Aadhaar Card</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> 2 Photos</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">For Name Change</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Marriage Cert (if applicable)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Gazette Notification (for major change)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-gradient-to-br from-[#8B5E3C] to-[#D4AF37] text-white p-8 rounded-3xl shadow-xl shadow-bronze/20 text-left relative overflow-hidden group">
                            {/* Decorative Background Icon */}
                            <HelpCircle className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 -rotate-12 transition-transform group-hover:scale-110" />
                            <h4 className="font-bold text-2xl mb-2 relative z-10">Lost PAN?</h4>
                            <p className="text-white/90 text-sm mb-6 relative z-10 leading-relaxed font-medium">Don't remember your number? We can help you find it within minutes.</p>
                            <div className="space-y-4 relative z-10">
                                <button className="w-full py-3 bg-white text-bronze hover:bg-navy hover:text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2">
                                    Compare Plans <ArrowRight size={18} />
                                </button>
                                <a
                                    href="https://wa.me/917639227019"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3 bg-navy/20 backdrop-blur-md border border-white/30 text-white hover:bg-navy/40 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                    Chat: +91 7639227019
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
export default PanCorrection;


