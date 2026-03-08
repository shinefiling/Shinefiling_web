import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Coins, Percent, Calendar, HelpCircle, FileText, BadgeIndianRupee, Calculator, Users, BookOpen, Clock, Zap, ChevronRight, Star, ArrowRight, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '../../../components/auth/AuthModal';
import ApplyBonusAct from './ApplyBonusAct';

const BonusAct = ({ isLoggedIn }) => {
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
        { q: "What is Payment of Bonus Act?", a: "It mandates the payment of bonus to employees of certain establishments on the basis of profits or production." },
        { q: "Who is eligible?", a: "Employees earning up to ₹21,000 per month and having worked for at least 30 days in the financial year." },
        { q: "What is the minimum bonus?", a: "Minimum bonus is 8.33% of the salary or ₹100, whichever is higher, regardless of profit or loss." },
        { q: "What is the maximum bonus?", a: "Maximum bonus payable is 20% of the salary." },
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1565514020176-dbf2277d0130?auto=format&fit=crop&q=80&w=2070"
                        alt="Bonus Payment"
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
                        className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-yellow-600/20 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.15, 0.1],
                            x: [0, -50, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-600/20 rounded-full blur-[100px]"
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
                                    <Coins size={12} className="fill-bronze" /> Profit Sharing
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Bonus <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Compliance</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Ensure statutory compliance under Payment of Bonus Act, 1965. Calculate and disburse bonuses accurately.
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
                                        <Percent size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Min Bonus</p>
                                        <p className="font-bold text-sm text-white">8.33%</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Calendar size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Deadline</p>
                                        <p className="font-bold text-sm text-white">Within 8 Month</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Start Filing
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <BookOpen size={18} /> Learn More
                                </button>
                            </div>
                        </div>

                        {/* Pricing Card - Floating Glass Effect */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full md:w-[360px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl relative"
                        >
                            <div className="bg-white rounded-[20px] p-6 overflow-hidden relative">
                                <div className="absolute top-0 right-0 bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Statutory</div>
                                <div className="text-center mb-6">
                                    <h3 className="text-navy font-bold text-xl mb-2">Bonus Return</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹1,499</h3>
                                        <span className="text-lg text-slate-400 font-medium">/ Year</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">+ Govt Fees</p>
                                </div>
                                <div className="space-y-4 mb-8">
                                    {["Allocable Surplus Calc", "Form A, B, C Preparation", "Form D Filing", "Maintenance of Registers", "Dispute Resolution Support"].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                                            <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full py-4 bg-navy hover:bg-black text-white font-bold text-lg rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >View Plans <ArrowRight size={18} /></button>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>

            {/* EXTENSIVE CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT CONTENT COLUMN (8 Cols) */}
                <div id="details-section" className="lg:col-span-8 space-y-20">

                    {/* Introduction */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <BookOpen className="text-bronze" /> Calculation Rules
                        </h2>
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-navy mb-4">Bonus Calculation</h3>
                            <div className="bg-[#2B3446]/5 p-6 rounded-xl border border-gray-100 mb-6 font-mono text-center text-lg md:text-xl font-bold text-navy">
                                Bonus = % Rate × (Higher of ₹7,000 or Min Wage)
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                                <div>
                                    <strong className="block text-navy mb-1">Wage Ceiling</strong>
                                    For calculation purposes, wage ceiling is ₹7,000 or minimum wage, whichever is higher.
                                </div>
                                <div>
                                    <strong className="block text-navy mb-1">Eligibility Limit</strong>
                                    Employees earning &gt; ₹21,000 are not eligible (unless agreed otherwise).
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* BENEFITS GRID */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Statutory Registers</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Form A", desc: "Computation of the Allocable Surplus.", icon: Calculator },
                                { title: "Form B", desc: "Set-on and Set-off of Allocable Surplus.", icon: Coins },
                                { title: "Form C", desc: "Register showing details of bonus paid to each employee.", icon: Users },
                                { title: "Form D", desc: "Annual Return to be filed with the Inspector.", icon: FileText },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-bronze transition group">
                                    <div className="w-14 h-14 rounded-2xl bg-[#2B3446]/5 group-hover:bg-[#2B3446] group-hover:text-bronze flex items-center justify-center text-navy flex-shrink-0 transition-all duration-300">
                                        <item.icon size={28} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-navy mb-2 text-lg">{item.title}</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* PRICING PLANS SECTION */}
                    <section id="pricing-plans">
                        <h2 className="text-3xl font-bold text-navy mb-8">Packages</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Standard */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="bg-[#2B3446] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                            >
                                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                                <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Complete</div>

                                <h3 className="text-lg font-bold text-white mb-2 mt-1">Bonus Return</h3>
                                <p className="text-gray-400 text-sm mb-6">Annual Return Filing.</p>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-3xl font-black text-white">₹1,499</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase bg-white/10 px-2 py-1 rounded">YEARLY</span>
                                </div>

                                <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                    {[
                                        "Annual Return Filing",
                                        "Online Upload",
                                        "Receipt Handling",
                                        "Compliance Audit"
                                    ].map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm">
                                            <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePlanSelect('return')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Select Filing</button>
                            </motion.div>

                            {/* Calculation */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                            >
                                <h3 className="text-lg font-bold text-navy mb-2">Calculation Only</h3>
                                <p className="text-slate-500 text-sm mb-6">Financial Year Computation.</p>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-3xl font-black text-navy text-transparent bg-clip-text bg-gradient-to-br from-navy to-slate-600">₹999</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">ONCE</span>
                                </div>

                                <ul className="space-y-3 mb-6 flex-1">
                                    {[
                                        "Employee-wise Sheets",
                                        "Surplus Calculation",
                                        "Dispute Clarification",
                                        "Form A, B & C Support"
                                    ].map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm">
                                            <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePlanSelect('calculation')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Get Calculation</button>
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

                {/* RIGHT SIDEBAR (4 Cols) */}
                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">

                        {/* Documents Sidebar */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Documents
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Financials</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Balance Sheet & P&L</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Employee Payroll Data</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Set-on/Set-off Data</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Loss making?</h4>
                            <p className="text-gray-300 text-sm mb-4">Minimum bonus still applies.</p>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">View Plans <ArrowRight size={18} /></button>
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
                            <ApplyBonusAct
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

export default BonusAct;


