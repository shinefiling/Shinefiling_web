import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, BookOpen, Scale, Globe, Briefcase, Award, ArrowRight, Rocket, X, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const IncomeTaxReturnPage = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "Is it mandatory to file ITR?", a: "Yes, if your gross income exceeds the basic exemption limit (₹2.5L/₹3L) or if you want to claim a refund/carry forward losses." },
        { q: "What is the due date for ITR?", a: "For most individuals and non-audit cases, it is 31st July of the assessment year." },
        { q: "Can I file ITR after the due date?", a: "Yes, you can file a 'Belated Return' with a late fee until 31st December." },
        { q: "Which ITR form should I choose?", a: "ITR-1 is for salary/house property income. ITR-3/4 is for business/professionals. Our experts will choose the right form for you." },
        { q: "Do I need to submit proofs?", a: "No documents need to be uploaded to the income tax portal, but you must keep them for your records in case of scrutiny." },
    ];

    const handlePlanSelect = (plan) => {
        const url = `/services/tax-compliance/income-tax-return/apply?plan=${plan}`;
        // Adjust the URL to where the form actually lives. 
        // Based on `IncomeTaxRegistration.jsx` check, it expects `/services/income-tax-return/register`.
        // But let's keep the standard route and let the router handle it if it's set up differently.
        // Actually, the previous file had `/services/tax-compliance/income-tax-return/apply`. I will stick to that.
        if (isLoggedIn) navigate(url);
        else navigate('/login', { state: { from: url } });
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2070"
                        alt="Income Tax Return"
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
                        className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-bronze/20 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.15, 0.1],
                            x: [0, -50, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px]"
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
                                    <TrendingUp size={12} className="fill-bronze" /> Personal & Business Tax
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Income Tax <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Return (ITR)</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Expert assisted ITR filing for Salaried, Professionals, and Businesses. Maximize your refund, enable loan approvals, and stay compliant.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fast Filing</p>
                                        <p className="font-bold text-sm text-white">2 Days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Award size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Refunds</p>
                                        <p className="font-bold text-sm text-white">Maximized</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    File ITR Now
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
                                <div className="absolute top-0 right-0 bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Start From</div>
                                <div className="text-center mb-6">
                                    <h3 className="text-navy font-bold text-xl mb-2">Salaried ITR</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹999</h3>
                                        <span className="text-lg text-slate-400 line-through mb-1 font-medium">₹2k</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">+ Govt Fees may apply</p>
                                </div>
                                <div className="space-y-4 mb-8">
                                    {["Expert CA Assisted Filing", "Maximum Tax Savings", "Notice Management", "Refund Tracking", "Capital Gains Advice"].map((item, i) => (
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

                    {/* Intro Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <BookOpen className="text-bronze" /> Why File ITR?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                Filing your Income Tax Return (ITR) is not just a legal obligation but also a financial proof of your income. It is essential for getting loans approved, visa processing, claiming tax refunds, and carrying forward losses.
                            </p>
                        </div>
                    </section>

                    {/* BENEFITS SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Benefits of ITR Filing</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Loan Approval", desc: "Latest 3 years ITR is the most important document banks ask for Home, Car, or Personal Loans.", icon: Briefcase },
                                { title: "Tax Refund", desc: "If you have paid excess TDS, filing ITR is the only way to get your money back from the government.", icon: TrendingUp },
                                { title: "Visa Processing", desc: "Foreign Embassies (US, UK, Canada, etc.) demand ITR receipts as proof of income and ties to home country.", icon: Globe },
                                { title: "Carry Forward Losses", desc: "You can carry forward capital losses (Shares/MFs) to set off against future profits only if you file ITR on time.", icon: Scale },
                            ].map((benefit, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-beige transition group">
                                    <div className="w-14 h-14 rounded-2xl bg-[#2B3446]/5 group-hover:bg-[#2B3446] group-hover:text-bronze flex items-center justify-center text-navy flex-shrink-0 transition-all duration-300">
                                        <benefit.icon size={28} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-navy mb-2 text-lg">{benefit.title}</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* PRICING PLANS SECTION */}
                    <section id="pricing-plans">
                        <h2 className="text-3xl font-bold text-navy mb-8">Packages</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Basic */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <h3 className="text-xl font-bold text-navy mb-2">Salaried</h3>
                                <div className="text-3xl font-black text-navy mb-1">₹999</div>
                                <p className="text-xs text-slate-400 mb-6">+ GST</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Salary Income</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> House Property (1)</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Interest Income</li>
                                </ul>
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-navy hover:text-white transition">Select Basic</button>
                            </div>

                            {/* Standard */}
                            <div className="bg-[#2B3446] rounded-3xl p-6 shadow-2xl relative overflow-hidden transform md:-translate-y-4 flex flex-col">
                                <div className="absolute top-0 right-0 bg-bronze text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Most Popular</div>
                                <h3 className="text-xl font-bold text-white mb-2">Business</h3>
                                <div className="text-3xl font-black text-white mb-1">₹1,999</div>
                                <p className="text-xs text-gray-400 mb-6">+ GST</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> Business/Profession</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> Presumptive Taxation</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> Balance Sheet Prep</li>
                                </ul>
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 rounded-xl bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold shadow-lg hover:shadow-yellow-500/20 transition">Select Standard</button>
                            </div>

                            {/* Premium */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <h3 className="text-xl font-bold text-navy mb-2">Capital Gains</h3>
                                <div className="text-3xl font-black text-navy mb-1">₹2,999</div>
                                <p className="text-xs text-slate-400 mb-6">+ GST</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Stock Market Gains</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Property Sale Gains</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Foreign Income</li>
                                </ul>
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-navy hover:text-white transition">Select Premium</button>
                            </div>
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
                                <FileText className="text-bronze" /> Documents Needed
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Mandatory</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> PAN & Aadhaar</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Form 16 (For Salaried)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Bank Statements (1 Year)</li>
                                    </ul>
                                </div>
                                <div className="mt-8 bg-beige/10 p-4 rounded-xl border border-blue-100">
                                    <p className="text-xs text-blue-800 font-medium leading-relaxed flex gap-2">
                                        <Lightbulb size={24} className="text-blue-600 shrink-0" />
                                        <span><strong>Pro Tip:</strong> Linking PAN with Aadhaar is mandatory for filing ITR.</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Help?</h4>
                            <p className="text-gray-300 text-sm mb-4">Our Tax Experts are here to help you.</p>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">View Plans <ArrowRight size={18} /></button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default IncomeTaxReturnPage;


