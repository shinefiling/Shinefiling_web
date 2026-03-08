import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, Globe, Briefcase, Award, ArrowRight, X, Banknote, Handshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PrivateLimitedRegistration from './PrivateLimitedRegistration';
import AuthModal from '../../../components/auth/AuthModal';

const PrivateLimitedPage = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('startup');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const scrollToPlans = () => {
        const section = document.getElementById('pricing-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const faqs = [
        { q: "How many directors are required?", a: "Minimum 2 directors are mandatory for a Private Limited Company." },
        { q: "Can a single person open a Pvt Ltd company?", a: "No - but you can open an OPC (One Person Company) if you are the only owner." },
        { q: "Can I register my home as an office?", a: "Yes, totally allowed. You can use your residential address as the registered office by providing an electricity bill and NOC." },
        { q: "Is physical presence required?", a: "No, the entire process is 100% online. You do not need to visit any government office." },
        { q: "What is the minimum capital required?", a: "There is no minimum capital requirement. You can start with as little as ₹1 (but practically typically ₹10,000 to ₹1 Lakh authorized capital)." },
        { q: "Can salaried employees be directors?", a: "Yes, provided their employment agreement allows it. It is best to check with your employer." },
        { q: "How long is the registration valid?", a: "The company has perpetual existence. It continues until you formally close it." }
    ];

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        if (isLoggedIn) {
            setShowRegistrationModal(true);
        } else {
            setAuthMode('login');
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
                            <PrivateLimitedRegistration
                                isLoggedIn={isLoggedIn}
                                isModal={true}
                                planProp={selectedPlan}
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
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"
                        alt="Corporate Background"
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
                                    <Star size={12} className="fill-bronze" /> India's #1 Registration Platform
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Private Limited <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Company Registration</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Launch your startup with the most trusted business structure. Get <strong className="text-white font-semibold">Limited Liability</strong>, <strong className="text-white font-semibold">Easy Funding</strong>, and <strong className="text-white font-semibold">Global Recognition</strong> today.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fast Track</p>
                                        <p className="font-bold text-sm text-white">5-7 Days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Star size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Google Rating</p>
                                        <p className="font-bold text-sm text-white">4.9/5 Stars</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                            >
                                <button onClick={scrollToPlans} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Get Started Now
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Learn More
                                </button>
                            </motion.div>
                        </div>

                        {/* Trust Card - Official Registration */}
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
                                            <Shield size={28} className="text-bronze fill-bronze/20" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle size={14} className="text-green-500 fill-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">Official <br />Registration</h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Ministry of Corporate Affairs</p>
                                </div>
                                <div className="h-px w-full bg-slate-100 mb-5"></div>
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Building size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">100%</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Online <br />Process</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Shield size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Legal</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Liability <br />Protection</p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "Separate Legal Entity",
                                        "Easy Funding Access",
                                        "Perpetual Succession"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="bg-green-100 rounded-full p-1 shrink-0">
                                                <CheckCircle size={12} className="text-green-600" strokeWidth={3} />
                                            </div>
                                            <span className="text-slate-700 font-bold text-xs tracking-wide">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={scrollToPlans}
                                    className="w-full py-3 bg-navy hover:bg-black text-white font-bold text-base rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Start Registration <ArrowRight size={16} />
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">Compare all plans below</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* PRICING SECTION */}
            <section id="pricing-section" className="py-20 px-6 lg:px-12 bg-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Choose Your Path</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Transparent Pricing Plans</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                        <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
                            Choose the perfect plan for your business. From basic registration to complete compliance automation.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Standard Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Standard</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-navy">₹6,799</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">+ Govt Fees</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "2 Digital Signatures (DSC)",
                                    "2 Director PINs (DIN)",
                                    "Name Approval (RUN)",
                                    "MOA & AOA Drafting",
                                    "Certificate of Incorporation",
                                    "PAN & TAN Allocation",
                                    "PF & ESIC Registration",
                                    "Bank Account Support"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('startup')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Standard</button>
                        </motion.div>

                        {/* Premium Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-2xl p-6 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-2xl"></div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Most Popular</div>
                            <h3 className="text-lg font-bold text-white mb-2 mt-1">Premium</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl font-black text-white">₹11,999</span>
                                <span className="text-xs font-bold text-gray-400 line-through">₹18,000</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1 text-gray-200">
                                <li className="text-xs font-bold text-[#D9A55B] uppercase tracking-wider border-b border-white/10 pb-2">Everything in Standard +</li>
                                {[
                                    "GST Registration",
                                    "Udyam (MSME) Registration",
                                    "Share Certificates Issue",
                                    "INC-20A (Commencement of Business)",
                                    "First Auditor Appointment (ADT-1)",
                                    "Zero Balance Current A/c"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={12} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('growth')} className="w-full py-3 bg-gradient-to-r from-bronze to-yellow-700 hover:scale-105 text-white font-bold rounded-lg shadow-lg transition-all text-sm">Get Premium</button>
                        </motion.div>

                        {/* Elite Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border mt-4 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            <h3 className="text-lg font-bold text-navy mb-2">Elite</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-navy">₹24,999</span>
                                <span className="text-slate-400 line-through text-xs">₹40,000</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="text-xs font-bold text-navy uppercase tracking-wider border-b border-gray-100 pb-2">Everything in Premium +</li>
                                {[
                                    "Trademark Filing (1 Class)",
                                    "1 Year ROC Compliance",
                                    "1 Year Income Tax Filing",
                                    "Dedicated CA Support",
                                    "Accounting Software (1 Year)"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('enterprise')} className="w-full py-2.5 bg-slate-100 text-navy font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Choose Elite</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Building className="text-bronze" /> What is a Private Limited Company?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="text-xl text-gray-800 font-medium">A Private Limited Company (Pvt Ltd) is the most preferred structure for startups and growing businesses because it offers limited liability protection and easy funding access.</p>
                            <p className="mt-4">With ShineFiling, you can register your company online in just 7-10 days. Our expert team handles everything from Name Approval to Incorporation Certificate.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Key Benefits</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Limited Liability Protection", desc: "Your personal assets remain safe. In a Pvt Ltd Company, the liability of shareholders is limited to their share capital, protecting your personal wealth from business losses.", icon: Shield },
                                { title: "Separate Legal Entity", desc: "The company acts as an artificial person. It can own property, incur debts, and sue or be sued in its own name, independent of its owners.", icon: Briefcase },
                                { title: "Easy Fundraising", desc: "The most preferred structure for investors. You can easily raise capital from VCs, angel investors, and banks by issuing equity shares.", icon: TrendingUp },
                                { title: "Credibility & Trust", desc: "Registered companies are viewed as more stable and credible by customers, suppliers, and banks, enhancing your business reputation.", icon: Star }
                            ].map((benefit, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-bronze/30 transition shadow-bronze/5">
                                    <div className="w-12 h-12 rounded-xl bg-bronze/10 flex items-center justify-center text-bronze shrink-0"><benefit.icon size={24} /></div>
                                    <div><h4 className="font-bold text-navy mb-1">{benefit.title}</h4><p className="text-sm text-gray-500">{benefit.desc}</p></div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">The Process</h2>
                        <div className="space-y-4">
                            {[
                                { t: "1. DSC & Name Approval", d: "We obtain Digital Signature Certificates (DSC) for directors and submit a name reservation request to the MCA to secure your unique brand name." },
                                { t: "2. Documentation & Filing", d: "Our experts draft the MOA & AOA and submit the SPICe+ incorporation forms to the Ministry of Corporate Affairs (MCA)." },
                                { t: "3. Incorporation & PAN/TAN", d: "Upon approval, you receive the Certificate of Incorporation (CoI), PAN, TAN, and DIN. You are now ready to start your business!" }
                            ].map((s, i) => (
                                <div key={i} className="flex gap-6 p-6 bg-white rounded-2xl border border-gray-50 shadow-sm">
                                    <div className="text-4xl font-black text-bronze opacity-20 italic">0{i + 1}</div>
                                    <div><h4 className="font-bold text-navy mb-1">{s.t}</h4><p className="text-sm text-gray-500">{s.d}</p></div>
                                </div>
                            ))}
                        </div>
                    </section>


                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Important Post-Incorporation Compliances</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { title: "Auditor Appointment (ADT-1)", desc: "Must be filed within 30 days of incorporation to appoint the first auditor." },
                                { title: "Commencement of Business (INC-20A)", desc: "Mandatory filing within 180 days after opening a bank account and depositing share capital." },
                                { title: "Annual Filing (AOC-4 & MGT-7)", desc: "Yearly submission of financial statements and annual returns to the ROC." },
                                { title: "Income Tax Filing (ITR-6)", desc: "Company must file its income tax return annually before the due date." }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-red-50 text-red-600 p-3 rounded-lg shrink-0"><FileText size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-navy text-sm mb-1">{item.title}</h4>
                                            <p className="text-xs text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Why Choose ShineFiling?</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { title: "100% Online Process", icon: Globe },
                                { title: "Dedicated CA Support", icon: Users },
                                { title: "Bank-Grade Security", icon: Shield },
                                { title: "No Hidden Costs", icon: Banknote }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                                    <div className="w-14 h-14 mx-auto bg-navy/5 rounded-full flex items-center justify-center text-navy mb-4 group-hover:bg-navy group-hover:text-white transition-colors">
                                        <item.icon size={28} />
                                    </div>
                                    <h4 className="font-bold text-navy text-sm">{item.title}</h4>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">FAQs</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <details key={i} className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                    <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-bold text-gray-700 hover:bg-gray-50 uppercase text-xs tracking-widest">{faq.q} <ChevronRight className="group-open:rotate-90 transition" /></summary>
                                    <div className="px-6 pb-6 pt-2 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
                                </details>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-50 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-bronze/5 rounded-full -mr-16 -mt-16 blur-xl"></div>
                            <h3 className="font-black text-xl text-navy mb-6 flex items-center gap-2">Required Docs</h3>
                            <div className="space-y-6 relative z-10">
                                <div><h4 className="text-[10px] font-black text-gray-400 hover:text-bronze transition uppercase tracking-widest mb-3 border-b pb-2 cursor-pointer">Director Identity</h4><ul className="space-y-2 text-sm text-gray-600 font-medium"><li>• PAN Card (Mandatory)</li><li>• Aadhaar Card / Voter ID</li><li>• Passport Size Photo</li></ul></div>
                                <div><h4 className="text-[10px] font-black text-gray-400 hover:text-bronze transition uppercase tracking-widest mb-3 border-b pb-2 cursor-pointer">Office Address</h4><ul className="space-y-2 text-sm text-gray-600 font-medium"><li>• Electricity / Utility Bill</li><li>• Rent Agreement / NOC</li></ul></div>
                            </div>
                            <button onClick={scrollToPlans} className="w-full mt-8 py-4 bg-navy text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black shadow-lg shadow-navy/20 transition transform hover:-translate-y-1">Start Now</button>
                        </div>

                        <div className="bg-[#043E52] text-white p-6 rounded-3xl shadow-xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-bronze/10 rounded-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-150"></div>
                            <h4 className="font-bold text-lg text-bronze mb-2 relative z-10">Expert Consult</h4>
                            <p className="text-gray-400 text-xs mb-6 font-medium relative z-10">Speak with our CA/CS experts before you start.</p>
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-bronze/20 flex items-center justify-center text-bronze shadow-inner"><Users size={20} /></div>
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Chat Support</p><p className="font-black text-white">+91 7639227019</p></div>
                            </div>
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-[10px] uppercase tracking-widest transition">WhatsApp Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivateLimitedPage;
