import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Clock,
    Star,
    CheckCircle,
    FileText,
    Shield,
    Zap,
    HelpCircle,
    ChevronRight,
    TrendingUp,
    Users,
    Building,
    Scale,
    Globe,
    Briefcase,
    Award,
    ArrowRight,
    Rocket,
    X,
    BookOpen,
    AlertCircle,
    Fingerprint,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DirectorKycRegistration from "./DirectorKycRegistration";
import AuthModal from "../../../components/auth/AuthModal";

const DirectorKYCPage = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("web");
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState("login");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const scrollToPlans = () => {
        const section = document.getElementById("pricing-section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    const faqs = [
        {
            q: "Who needs to file DIR-3 KYC?",
            a: "Any person who has been allotted a Director Identification Number (DIN) and the status of DIN is 'Approved' must file KYC annually.",
        },
        {
            q: "What is the due date?",
            a: "The due date is 30th September of every financial year. For ex: For FY 2023-24, due date is 30th Sep 2024.",
        },
        {
            q: "Is there a govt fee?",
            a: "No, there is no government fee if filed on time. Late filing attracts a FLAT penalty of ₹5,000 per DIN.",
        },
        {
            q: "What happens if not filed?",
            a: "The DIN status will be marked as 'Deactivated due to non-filing of DIR-3 KYC', and the director cannot sign any forms or be appointed in new companies.",
        },
        {
            q: "Can a disqualified director file KYC?",
            a: "Yes, even disqualified directors must file DIR-3 KYC to keep their DIN active/trackable.",
        },
    ];

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        const storedUser = localStorage.getItem("user");
        if (isLoggedIn || !!storedUser) {
            setShowRegistrationModal(true);
        } else {
            setAuthMode("login");
            setShowAuthModal(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">
            <AnimatePresence>
                {showRegistrationModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2rem] w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl relative flex flex-col"
                        >
                            <DirectorKycRegistration
                                isLoggedIn={isLoggedIn}
                                isModal={true}
                                initialPlan={selectedPlan}
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
                        alt="KYC Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/80 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
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
                                    <Fingerprint size={12} className="fill-bronze" /> DIN
                                    Maintenance
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Director <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">
                                        KYC (DIR-3)
                                    </span>
                                </h1>
                                <p className="text-gray-300 text-xl max-w-xl font-light leading-relaxed">
                                    Annual compliance for every Director holding a DIN. File
                                    before 30th September to keep your Directorship active and
                                    avoid heavy penalties.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                            Time
                                        </p>
                                        <p className="font-bold text-sm text-white">
                                            Instant Filing
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                            Penalty Saver
                                        </p>
                                        <p className="font-bold text-sm text-white">Save ₹5,000</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                            >
                                <button
                                    onClick={scrollToPlans}
                                    className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all"
                                >
                                    File KYC Now
                                </button>
                                <button
                                    onClick={() =>
                                        document
                                            .getElementById("details-section")
                                            ?.scrollIntoView({ behavior: "smooth" })
                                    }
                                    className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors"
                                >
                                    <Globe size={18} /> Learn More
                                </button>
                            </motion.div>
                        </div>

                        {/* Trust Card - Official KYC */}
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
                                            <Shield
                                                size={28}
                                                className="text-bronze fill-bronze/20"
                                                strokeWidth={1.5}
                                            />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle
                                                size={14}
                                                className="text-green-500 fill-white"
                                            />
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">
                                        Official <br />
                                        Compliance
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">
                                        Ministry of Corporate Affairs
                                    </p>
                                </div>
                                <div className="h-px w-full bg-slate-100 mb-5"></div>
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Globe size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">
                                                100%
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">
                                            Online <br />
                                            Process
                                        </p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Shield size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">
                                                Secure
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">
                                            Data <br />
                                            Protection
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "Avoid ₹5,000 Penalty",
                                        "Keep DIN Active",
                                        "Same Day Processing",
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="bg-green-100 rounded-full p-1 shrink-0">
                                                <CheckCircle
                                                    size={12}
                                                    className="text-green-600"
                                                    strokeWidth={3}
                                                />
                                            </div>
                                            <span className="text-slate-700 font-bold text-xs tracking-wide">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={scrollToPlans}
                                    className="w-full py-3 bg-navy hover:bg-black text-white font-bold text-base rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Start KYC <ArrowRight size={16} />
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
                                    Compare all plans below
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* PRICING SECTION */}
            <section
                id="pricing-section"
                className="py-20 px-6 lg:px-12 bg-white relative overflow-hidden"
            >
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">
                            Choose Your Plan
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">
                            Simple Pricing
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {/* Web Based */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Web Based</h3>
                            <p className="text-slate-500 text-sm mb-6">If no change in details.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹499</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">RE-FILING</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                {[
                                    "Web-KYC Filing",
                                    "No Change in Details",
                                    "OTP Verification Only",
                                    "SRN Generation"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('web')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Web KYC</button>
                        </motion.div>

                        {/* e-Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Recommended</div>

                            <h3 className="text-lg font-bold text-white mb-2 mt-1">e-Form KYC</h3>
                            <p className="text-gray-400 text-sm mb-6">For changes or first-time.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹1,499</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase bg-white/10 px-2 py-1 rounded">MOST POPULAR</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                {[
                                    "Change in Details",
                                    "First Time Filers",
                                    "Professional Certification",
                                    "Priority Filing"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('eform')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Select e-Form KYC</button>
                        </motion.div>

                        {/* Late Filing */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Late Filing</h3>
                            <p className="text-slate-500 text-sm mb-6">If filed after deadline.</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹5,499</span>
                                <span className="text-[10px] font-bold text-red-500 uppercase bg-red-50 px-2 py-1 rounded">INCL PENALTY</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1 text-slate-700">
                                <li className="text-[10px] font-bold text-red-600 uppercase tracking-wider border-b border-gray-100 pb-2">Includes ₹5000 Govt Penalty</li>
                                {[
                                    "Web or e-Form Filing",
                                    "Fast-track Processing",
                                    "Avoid DIN Deactivation"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('late')} className="w-full py-2.5 bg-slate-100 text-red-600 font-bold rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm">Select Late Filing</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <BookOpen className="text-bronze" /> Comprehensive Guide to Director KYC
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="text-xl text-gray-800 font-medium">
                                The Ministry of Corporate Affairs (MCA) mandates an annual Know
                                Your Customer (KYC) update for all Directors. It ensures the
                                database of directors is current and verified.
                            </p>
                            <p className="mt-4">
                                Every person holding a DIN on or before 31st March of a
                                financial year must file DIR-3 KYC by 30th September of the
                                following financial year.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">
                            Which KYC is for you?
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    title: "DIR-3 KYC WEB",
                                    desc: "Applicable if you have already filed KYC in previous years and there is NO CHANGE in your personal details (Mobile/Email/Address).",
                                    highlight: "OTP Based",
                                },
                                {
                                    title: "DIR-3 KYC e-Form",
                                    desc: "Applicable if you are filing for the FIRST TIME or if you want to update your Mobile No, Email, or Address.",
                                    highlight: "DSC Required",
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-bronze/30 transition shadow-bronze/5"
                                >
                                    <div>
                                        <h4 className="font-bold text-navy mb-2 text-lg">
                                            {item.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                            {item.desc}
                                        </p>
                                        <span className="inline-block px-3 py-1 bg-bronze/10 text-bronze text-xs font-bold rounded-full">
                                            {item.highlight}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">
                            FAQs
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <details
                                    key={i}
                                    className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm"
                                >
                                    <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-bold text-gray-700 hover:bg-gray-50 uppercase text-xs tracking-widest">
                                        {faq.q}{" "}
                                        <ChevronRight className="group-open:rotate-90 transition" />
                                    </summary>
                                    <div className="px-6 pb-6 pt-2 text-gray-600 text-sm leading-relaxed">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-50 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-bronze/5 rounded-full -mr-16 -mt-16 blur-xl"></div>
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                Checklist
                            </h3>
                            <div className="space-y-6 relative z-10">
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 hover:text-bronze transition uppercase tracking-widest mb-3 border-b pb-2 cursor-pointer">
                                        Mobile
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-600 font-medium">
                                        <li>• Active Mobile Number</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 hover:text-bronze transition uppercase tracking-widest mb-3 border-b pb-2 cursor-pointer">
                                        Email
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-600 font-medium">
                                        <li>• Active Email ID</li>
                                    </ul>
                                </div>
                            </div>
                            <button
                                onClick={scrollToPlans}
                                className="w-full mt-8 py-4 bg-navy text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black shadow-lg shadow-navy/20 transition transform hover:-translate-y-1"
                            >
                                Start KYC Now
                            </button>
                        </div>

                        <div className="bg-[#043E52] text-white p-6 rounded-3xl shadow-xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-bronze/10 rounded-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-150"></div>
                            <h4 className="font-bold text-lg mb-2 relative z-10">
                                Need Guidance?
                            </h4>
                            <p className="text-gray-400 text-xs mb-6 font-medium relative z-10">
                                Unsure if you need Web or e-Form?
                            </p>
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-bronze/20 flex items-center justify-center text-bronze shadow-inner">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                        Call Support
                                    </p>
                                    <p className="font-black text-white">+91 7639227019</p>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-[10px] uppercase tracking-widest transition">
                                WhatsApp Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectorKYCPage;
