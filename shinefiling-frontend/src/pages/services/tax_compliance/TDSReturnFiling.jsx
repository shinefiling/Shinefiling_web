import TdsReturnRegistration from './TdsReturnRegistration';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, Globe, Briefcase, Award, ArrowRight, Rocket, X, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TDSReturnFilingPage = ({ isLoggedIn }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('basic');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is the due date for TDS Return?", a: "TDS returns are filed quarterly. Due dates are: Q1 (31st July), Q2 (31st Oct), Q3 (31st Jan), Q4 (31st May)." },
        { q: "What is the penalty for late filing?", a: "Late filing attracts a fee of ₹200 per day under section 234E, up to the amount of TDS deducted." },
        { q: "What is Form 24Q and 26Q?", a: "Form 24Q is for TDS on Salary. Form 26Q is for TDS on payments other than salary (e.g. Rent, Professional Fees)." },
        { q: "Do I need TAN to file TDS return?", a: "Yes, TAN (Tax Deduction and Collection Account Number) is mandatory for filing TDS returns." },
        { q: "How to fix errors in filed return?", a: "You can file a correction (revised) TDS return to rectify PAN errors or challan mismatches." }
    ];

    const handlePlanSelect = (plan) => {
        if (isLoggedIn) {
            setSelectedPlan(plan);
            setShowRegisterModal(true);
        } else {
            const url = window.location.pathname;
            navigate('/login', { state: { from: url } });
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1554224154-260327c00c40?auto=format&fit=crop&q=80&w=2070"
                        alt="Background"
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
                                    <Star size={12} className="fill-bronze" /> Quarterly Compliance
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    TDS Return <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Filing Online</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    File Form 24Q, 26Q, 27Q accurately. Avoid late fee of ₹200/day and ensure your deductees get their tax credit on time.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Frequency</p>
                                        <p className="font-bold text-sm text-white">Quarterly</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Penalties</p>
                                        <p className="font-bold text-sm text-white">Avoided</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    File TDS Return
                                </button>
                            </div>
                        </div>

                        {/* Pricing Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full md:w-[360px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl relative"
                        >
                            <div className="bg-white rounded-[20px] p-6 overflow-hidden relative">
                                <div className="absolute top-0 right-0 bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Best Value</div>
                                <div className="text-center mb-6">
                                    <h3 className="text-navy font-bold text-xl mb-2">Regular Plan</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹1,499</h3>
                                        <span className="text-lg text-slate-400 line-through mb-1 font-medium">₹3k</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Detailed Filing</p>
                                </div>
                                <div className="space-y-4 mb-8">
                                    {["FVU File Generation", "Challan Matching", "PAN Verification", "Form 16/16A Generation", "Expert Support"].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                                            <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePlanSelect('standard')}
                                    className="w-full py-4 bg-navy hover:bg-black text-white font-bold text-lg rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Start Now <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Scale className="text-bronze" /> Importance of TDS Filing
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                Tax Deducted at Source (TDS) is a means of indirect tax collection. As a deductor, you are responsible for deducting tax and depositing it with the government.
                            </p>
                            <p>
                                Filing TDS returns is crucial because it informs the government about whose tax has been deducted. Without this, your employees or vendors cannot claim credit for the tax you deducted.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Why File with Us?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Error-Free FVU", desc: "We ensure your return file passes the NSDL validation utility (FVU) without any errors.", icon: CheckCircle },
                                { title: "Late Fee Avoidance", desc: "Timely filing saves you from mandatory late fees of ₹200 per day till default continues.", icon: Shield },
                                { title: "Revised Returns", desc: "Made a mistake? We handle correction statements for PAN updates or challan corrections.", icon: Scale },
                                { title: "Certificate Issue", desc: "We generate and email Form 16 and Form 16A for you to distribute to your deductees.", icon: FileText },
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

                    {/* TDS FORMS EXPLAINED */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Understanding TDS Forms</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { form: "Form 24Q", for: "Salaries", desc: "TDS deducted on salary payments to employees. Filed quarterly. Annexure II (Salary details) filed in Q4." },
                                { form: "Form 26Q", for: "Other than Salary", desc: "TDS on payments like Interest, Dividend, Rent, Professional Fees, Contractor payments to Residents." },
                                { form: "Form 27Q", for: "Non-Residents", desc: "TDS deducted on payments (Interest, Dividends, etc.) made to Non-Residents (NRIs) or Foreign Companies." },
                                { form: "Form 27EQ", for: "TCS Return", desc: "Tax Collected at Source on sale of specific goods like scrap, timber, minerals, etc." },
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                                    <h4 className="text-xl font-bold text-navy mb-1">{item.form}</h4>
                                    <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded mb-3">
                                        {item.for}
                                    </span>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* COMMON TDS RATES */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Common TDS Rates (FY 2024-25)</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Section</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Nature of Payment</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Threshold</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Rate (Indiv/HUF)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {[
                                        { s: "194C", n: "Contractors", t: "₹30k / ₹1L agg.", r: "1%" },
                                        { s: "194J", n: "Professional Fees", t: "₹30,000", r: "10%" },
                                        { s: "194I", n: "Rent (Land/Building)", t: "₹2,40,000", r: "10%" },
                                        { s: "194I", n: "Rent (Plant/Machinery)", t: "₹2,40,000", r: "2%" },
                                        { s: "194H", n: "Commission/Brokerage", t: "₹15,000", r: "5%" },
                                        { s: "192", n: "Salary", t: "Taxable Limit", r: "Slab Rates" }
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition">
                                            <td className="p-4 font-bold text-navy border-r border-gray-100">{row.s}</td>
                                            <td className="p-4 text-slate-700 border-r border-gray-100">{row.n}</td>
                                            <td className="p-4 text-slate-600 border-r border-gray-100">{row.t}</td>
                                            <td className="p-4 font-bold text-bronze">{row.r}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section id="pricing-plans">
                        <h2 className="text-3xl font-bold text-navy mb-8">Our Plans</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <h3 className="text-xl font-bold text-navy mb-2">Salary</h3>
                                <div className="text-3xl font-black text-navy mb-1">₹999</div>
                                <p className="text-xs text-slate-400 mb-6">/ quarter</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Form 24Q Filing</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Employee Data Entry</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Challan Verification</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('basic')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-navy hover:text-white transition">Select Salary</button>
                            </div>

                            <div className="bg-[#2B3446] rounded-3xl p-6 shadow-2xl relative overflow-hidden transform md:-translate-y-4 flex flex-col">
                                <div className="absolute top-0 right-0 bg-bronze text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Popular</div>
                                <h3 className="text-xl font-bold text-white mb-2">Non-Salary</h3>
                                <div className="text-3xl font-black text-white mb-1">₹1,499</div>
                                <p className="text-xs text-gray-400 mb-6">/ quarter</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> Form 26Q Filing</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> Contractor/Prof. Fees</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> PAN Validations</li>
                                </ul>
                                <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 rounded-xl bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold shadow-lg hover:shadow-yellow-500/20 transition">Select Non-Salary</button>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <h3 className="text-xl font-bold text-navy mb-2">NRI Payments</h3>
                                <div className="text-3xl font-black text-navy mb-1">₹2,499</div>
                                <p className="text-xs text-slate-400 mb-6">/ quarter</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Form 27Q Filing</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Foreign Remittance</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Expert Assistance</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('premium')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-navy hover:text-white transition">Select NRI</button>
                            </div>
                        </div>
                    </section>

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

                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Required Details
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> TAN & PAN of Deductor</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Deductee PAN Details</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Tax Payment Challans (BSR Code, Date, Amount)</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Payment Date & Amount paid to deductee</li>
                            </ul>
                            <div className="mt-6 bg-slate-50 p-4 rounded-xl text-xs text-slate-500">
                                Provide data in Excel. We'll convert it to FVU file.
                            </div>
                        </div>
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need TAN?</h4>
                            <p className="text-gray-300 text-sm mb-4">Don't have a TAN yet? Apply now.</p>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">
                                Apply TAN
                            </button>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {showRegisterModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                            <div className="relative w-full max-w-6xl max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 bg-white ring-1 ring-white/20">
                                <TdsReturnRegistration isLoggedIn={isLoggedIn} isModal={true} initialPlan={selectedPlan} onClose={() => setShowRegisterModal(false)} />
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TDSReturnFilingPage;
