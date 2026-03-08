import React, { useState } from 'react';
import { Mail, RefreshCcw, ShieldCheck, Clock, AlertCircle, Ban, CreditCard, HelpCircle, MessageCircle, FileCheck } from 'lucide-react';

const RefundPage = () => {
    const [activeSection, setActiveSection] = useState(1);

    const sections = [
        { id: 1, title: "Eligibility Criteria", icon: <ShieldCheck size={18} /> },
        { id: 2, title: "Non-Refundable Cases", icon: <Ban size={18} /> },
        { id: 3, title: "Refund Window", icon: <Clock size={18} /> },
        { id: 4, title: "Processing Timeline", icon: <RefreshCcw size={18} /> },
        { id: 5, title: "Government Fee Policy", icon: <AlertCircle size={18} /> },
        { id: 6, title: "Cancellation Charges", icon: <Ban size={18} /> },
        { id: 7, title: "Payment Method", icon: <CreditCard size={18} /> },
        { id: 8, title: "Service Failure", icon: <FileCheck size={18} /> },
        { id: 9, title: "Duplicate Payments", icon: <RefreshCcw size={18} /> },
        { id: 10, title: "Support Contact", icon: <HelpCircle size={18} /> }
    ];

    const content = {
        1: {
            title: "Eligibility for Refund",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        We believe in fairness and transparency. Our refund eligibility is based on the stage of the service being provided. If a service hasn’t been initiated within 48 hours of payment, we provide a structured refund mechanism.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                        <div className="p-8 rounded-3xl bg-[#f0f9fa] border border-[#d9f0f2] flex flex-col justify-center">
                            <h5 className="font-bold text-[#043E52] mb-2 uppercase text-[10px] tracking-widest ">100% Refundable</h5>
                            <p className="text-sm text-slate-500 font-medium">If a professional is not assigned to your task within a specified timeframe, or order is cancelled before any work begins.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                            <h5 className="font-bold text-[#043E52] mb-2 uppercase text-[10px] tracking-widest ">Partial Refund</h5>
                            <p className="text-sm text-slate-500 font-medium">If work has started but is not fully completed by the professional, depending on work percentage completed.</p>
                        </div>
                    </div>
                </div>
            )
        },
        2: {
            title: "Non-Refundable Cases",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Certain scenarios disqualify you from receiving a refund due to the costs already incurred by our platform and professionals.
                    </p>
                    <ul className="list-disc pl-5 space-y-3 text-slate-600">
                        <li>The application has already been drafted and submitted to the government portal (e.g., MCA, Income Tax Portal).</li>
                        <li>Delays caused due to incomplete/incorrect documents provided by the customer.</li>
                        <li>Applications rejected by the government due to discrepancies in user-provided documents.</li>
                        <li>Change of mind after the assigned expert has spent substantial consulting hours on your file.</li>
                    </ul>
                </div>
            )
        },
        3: {
            title: "Refund Window",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        You must raise a refund request within a specific timeframe to be considered eligible.
                    </p>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Refund requests must be generated via email or our support portal within <strong>30 days of the payment date</strong>. Any requests made after this 30-day window will not be entertained, and the fee paid will be treated as fully earned by the platform.
                        </p>
                    </div>
                </div>
            )
        },
        4: {
            title: "Processing Timeline",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Once a refund request is approved by our financial audit team, we act promptly to process the transaction.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        Approved refunds are typically processed within <strong>5 to 7 working days</strong>. The amount will be credited back to the original method of payment (Credit Card, Debit Card, UPI, or Net Banking) used during the purchase. Please note that bank processing times may add an additional 2-3 days for reflection in your statement.
                    </p>
                </div>
            )
        },
        5: {
            title: "Government Fee Policy",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Payments made for services often include statutory government fees necessary for processing your applications.
                    </p>
                    <div className="bg-[#043E52] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10 flex gap-6 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                                <AlertCircle size={24} className="text-[#ED6E3F]" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-2">Government Fees are Strictly Non-Refundable</h4>
                                <p className="text-slate-300 text-sm font-medium leading-relaxed">
                                    Once any fee (challan) has been paid to a government body (MCA, IT Dept, GST Dept) on your behalf, that portion of the total payment is strictly non-refundable under any circumstance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        6: {
            title: "Cancellation Charges",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        If an order is cancelled by the user before completion but after work has commenced, cancellation charges will apply.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        A minimum cancellation fee of <strong>20% of the professional fee</strong> (excluding government fees) will be deducted to compensate for platform administrative costs and the professional's initial time investment.
                    </p>
                </div>
            )
        },
        7: {
            title: "Payment Method",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Refunds can only be processed back to the original payment source.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        We do not offer cash refunds, check refunds, or transfers to a different bank account than the one used for the transaction. This policy is rigidly enforced to prevent fraud and comply with Anti-Money Laundering (AML) regulations.
                    </p>
                </div>
            )
        },
        8: {
            title: "Service Failure",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        If ShineFiling is completely unable to deliver the promised service due to internal issues, you are protected.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        In the rare event that our experts are unable to process your request due to issues solely on our end (e.g., technical failure, lack of available experts), you will receive a <strong>100% full refund</strong> immediately without any deductions or cancellation charges.
                    </p>
                </div>
            )
        },
        9: {
            title: "Duplicate Payments",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Accidental double payments happen during network glitches or timeout errors.
                    </p>
                    <ul className="list-disc pl-5 space-y-3 text-slate-600">
                        <li>If you have made duplicate payments for the exact same service, please contact us immediately.</li>
                        <li>Upon verification of our bank statements, the duplicate additional amount will be refunded completely within 3-4 working days.</li>
                    </ul>
                </div>
            )
        },
        10: {
            title: "Support Contact",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Need to initiate a refund or have questions about a payment? Our finance support team is here to help.
                    </p>
                    <div className="bg-[#f0f9fa] p-8 rounded-3xl border border-[#d9f0f2]">
                        <p className="text-slate-700 font-medium mb-2">To submit a refund request, email us with your Order ID and reason at:</p>
                        <p className="font-bold border-b border-[#043E52]/20 pb-1 mb-4 text-[#043E52] inline-block">billing@shinefiling.com</p>
                        <p className="text-sm text-slate-500">We typically respond to billing queries within 24 hours.</p>
                    </div>
                </div>
            )
        },
        default: (id) => ({
            title: sections.find(s => s.id === id)?.title || "Settlement Provision",
            body: (
                <div className="space-y-8">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        The provision for <strong>{sections.find(s => s.id === id)?.title}</strong> ensures that your financial interests are protected at every stage of the filing process.
                    </p>
                </div>
            )
        })
    };

    const activeContent = content[activeSection] || content.default(activeSection);

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#ED6E3F]/20 text-[#043E52]">
            {/* Minimal Header */}
            <div className="pt-24 pb-12 bg-slate-50 border-b border-slate-100">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="text-[#ED6E3F] font-bold tracking-widest uppercase text-[10px] mb-2 block">Finance & Settlements</span>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                                Refund <span className="text-[#ED6E3F]">Policy</span>
                            </h1>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Finance v3.1</p>
                            <p className="text-slate-300 text-[10px]">Updated: March 05, 2026</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12 min-h-[70vh]">

                    {/* Navigation Sidebar */}
                    <div className="w-full lg:w-[350px] shrink-0">
                        <div className="sticky top-32 bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-2">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${activeSection === section.id
                                        ? 'bg-[#043E52] text-white shadow-xl translate-x-1'
                                        : 'text-slate-500 hover:bg-white hover:text-[#043E52]'}`}
                                >
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${activeSection === section.id ? 'bg-[#ED6E3F]' : 'bg-slate-100'}`}>
                                        <span className="text-[10px] font-bold">{section.id}</span>
                                    </div>
                                    <span className="text-sm font-bold tracking-tight">{section.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                        <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-2xl shadow-slate-200/50 min-h-full">
                            <div key={activeSection} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-3xl font-bold tracking-tight uppercase mb-10">{activeContent.title}</h2>
                                {activeContent.body}

                                <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex items-center gap-4 cursor-pointer group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#ED6E3F]/10 group-hover:text-[#ED6E3F] transition-all">
                                            <Mail size={18} />
                                        </div>
                                        <span className="text-sm font-bold group-hover:text-[#ED6E3F]">Support Inquiry</span>
                                    </div>

                                    <button className="px-12 py-4 bg-[#ED6E3F] text-white rounded-2xl font-bold tracking-widest text-xs uppercase shadow-xl shadow-orange-900/20 hover:bg-[#043E52] transition-all active:scale-95">
                                        Accept Terms
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RefundPage;
