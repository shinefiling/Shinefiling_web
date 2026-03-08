import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Scale, Coins, AlertCircle, HelpCircle, FileText, BadgeIndianRupee, Calendar, BookOpen, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthModal from '../../../components/auth/AuthModal';
import ApplyMinimumWages from './ApplyMinimumWages';

const MinimumWages = ({ isLoggedIn }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [selectedPlan, setSelectedPlan] = useState('startup');

    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is Minimum Wages Act?", a: "It sets the minimum amount of remuneration that must be paid to various categories of skilled and unskilled labours." },
        { q: "Who decides the rate?", a: "Minimum wages are declared by the respective State Governments and vary by zone and industry (scheduled employment)." },
        { q: "How often does it change?", a: "The Variable Dearness Allowance (VDA) component is revised twice a year (usually April & October)." },
        { q: "What are the penalties?", a: "Non-payment can lead to fines up to 10 times the unpaid amount and imprisonment up to 6 months." },
        { q: "Is overtime included?", a: "No, overtime must be paid separately at double the normal wage rate." },
        { q: "Does it apply to contract labor?", a: "Yes, the principal employer is responsible for ensuring contract laborers are paid minimum wages." },
    ];

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

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1593672741392-50630b9d62d2?auto=format&fit=crop&q=80&w=2070"
                        alt="Minimum Wages"
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
                                    <Scale size={12} className="fill-bronze" /> Statutory Compliance
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Minimum <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Wages Act</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Ensure your organization meets state-mandated wage standards. Avoid litigation and penalties with our audit services.
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
                                        <BadgeIndianRupee size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pay Rate</p>
                                        <p className="font-bold text-sm text-white">State Wise</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Coins size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Revision</p>
                                        <p className="font-bold text-sm text-white">Bi-Annual</p>
                                    </div>
                                </div>
                            </motion.div>

                            <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                Get Compliance
                            </button>
                        </div>

                        {/* Pricing Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full md:w-[360px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl relative"
                        >
                            <div className="bg-white rounded-[20px] p-6 overflow-hidden relative">
                                <div className="absolute top-0 right-0 bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Popular</div>
                                <div className="text-center mb-6">
                                    <h3 className="text-navy font-bold text-xl mb-2">Wage Audit</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹1,999</h3>
                                        <span className="text-lg text-slate-400 font-medium">/ Audit</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">For Compliance</p>
                                </div>
                                <div className="space-y-4 mb-8 flex-1">
                                    {["Detailed Wage Sheet Audit", "Zone & Category Classification", "VDA Impact Analysis", "Overtime Calculation Check", "Compliance Report"].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                                            <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePlanSelect('audit')}
                                    className="w-full py-4 bg-navy hover:bg-black text-white font-bold text-lg rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Start Audit <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div id="details-section" className="lg:col-span-8 space-y-20">

                    {/* Zones Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <BookOpen className="text-bronze" /> Understanding Rates
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-2 bg-bronze rounded-l-2xl"></div>
                                <h3 className="text-xl font-bold text-navy mb-4">Location Zones</h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Minimum wages depend on the cost of living in the area.
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-2"></div> Zone A: Metropolitan Cities</li>
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-2"></div> Zone B: Semi-urban Areas</li>
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-bronze mt-2"></div> Zone C: Rural Areas</li>
                                </ul>
                            </div>
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#043E52] rounded-l-2xl"></div>
                                <h3 className="text-xl font-bold text-navy mb-4">Skill Categories</h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Rates vary based on skill level required for the job.
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#043E52] mt-2"></div> Unskilled (Peon/Helper)</li>
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#043E52] mt-2"></div> Semi-Skilled (Assistant)</li>
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#043E52] mt-2"></div> Skilled (Clerk/Electrician)</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* PRICING PLANS */}
                    <section id="pricing-plans">
                        <h2 className="text-3xl font-bold text-navy mb-8">Packages</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Notice Reply */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                            >
                                <h3 className="text-lg font-bold text-navy mb-2">Notice Reply</h3>
                                <p className="text-slate-500 text-sm mb-6">Expert Legal Drafting.</p>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹999</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">PER NOTICE</span>
                                </div>

                                <ul className="space-y-3 mb-6 flex-1">
                                    {[
                                        "Legal Drafting",
                                        "Representation Support",
                                        "Defense Strategy",
                                        "Penalty Mitigation"
                                    ].map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm">
                                            <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePlanSelect('notice')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Get Help</button>
                            </motion.div>

                            {/* Subscription */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                            >
                                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                                <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Strongly Recommended</div>

                                <h3 className="text-lg font-bold text-white mb-2 mt-1">Annual Retainer</h3>
                                <p className="text-gray-400 text-sm mb-6">Continuous Monitoring.</p>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-3xl font-black text-white">₹4,999</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase bg-white/10 px-2 py-1 rounded">YEARLY</span>
                                </div>

                                <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                    {[
                                        "Rate Revision Alerts",
                                        "Quarterly Audits",
                                        "Priority Support",
                                        "Compliance Report"
                                    ].map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm">
                                            <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePlanSelect('subscription')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Subscribe Now</button>
                            </motion.div>

                            {/* Audit */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                            >
                                <h3 className="text-lg font-bold text-navy mb-2">Wage Audit</h3>
                                <p className="text-slate-500 text-sm mb-6">Ad-hoc Compliance Check.</p>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹1,999</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">AUDIT</span>
                                </div>

                                <ul className="space-y-3 mb-6 flex-1">
                                    {[
                                        "Detailed Audit",
                                        "Gap Analysis",
                                        "Compliance Report",
                                        "Risk Assessment"
                                    ].map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm">
                                            <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePlanSelect('audit')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Select Audit</button>
                            </motion.div>
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
                                <FileText className="text-bronze" /> Registers
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Register of Wages</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Overtime Register</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Wage Slips</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Annual Return (Form III)</li>
                            </ul>
                        </div>

                        <div className="bg-[#043E52] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Check Rates?</h4>
                            <p className="text-gray-300 text-sm mb-4">Get latest notification for your state.</p>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">
                                Download Rates
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
                            <ApplyMinimumWages
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

export default MinimumWages;
