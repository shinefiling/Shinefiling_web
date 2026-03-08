import React, { useState } from 'react';
import { Mail, CheckCircle2, ChevronRight, Scale, ShieldCheck, Clock } from 'lucide-react';

const TermsPage = () => {
    const [activeSection, setActiveSection] = useState(1);

    const sections = [
        { id: 1, title: "Acceptance of Terms", icon: <Scale size={18} /> },
        { id: 2, title: "Service Description", icon: <ShieldCheck size={18} /> },
        { id: 3, title: "User Obligations", icon: <CheckCircle2 size={18} /> },
        { id: 4, title: "Payment & Refund", icon: <Clock size={18} /> },
        { id: 5, title: "Intellectual Property", icon: <Scale size={18} /> },
        { id: 6, title: "Limitation of Liability", icon: <ShieldCheck size={18} /> },
        { id: 7, title: "Privacy & Data", icon: <CheckCircle2 size={18} /> },
        { id: 8, title: "Termination", icon: <Clock size={18} /> },
        { id: 9, title: "Governing Law", icon: <Scale size={18} /> },
        { id: 10, title: "General Terms", icon: <ShieldCheck size={18} /> }
    ];

    const content = {
        1: {
            title: "Acceptance of Terms",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Welcome to ShineFiling. By accessing or using our platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        These terms constitute a legally binding agreement between you and ShineFiling (Newfu Technology Private Limited). They govern your use of the website, software, and any professional services rendered through our network of experts.
                    </p>
                    <div className="bg-[#f0f9fa] p-8 rounded-3xl border border-[#d9f0f2]">
                        <h4 className="text-[#043E52] font-bold mb-4 uppercase tracking-wider text-sm">Key Points to Remember:</h4>
                        <ul className="space-y-4">
                            {[
                                "You must be at least 18 years old to use this platform.",
                                "You are responsible for providing accurate business information.",
                                "We act as a facilitator connecting you with certified professionals."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#ED6E3F] mt-2 shrink-0"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )
        },
        2: {
            title: "Service Description",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        ShineFiling provides an online platform that connects businesses and individuals with freelance Chartered Accountants (CAs), Company Secretaries (CSs), and tax professionals.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        Our services include but are not limited to Company Registration, GST Registration and Filing, Income Tax Returns, Trademark Registration, and other compliance-related tasks. While we ensure high standards of service providers, we are a technology platform facilitating these services rather than an accounting or law firm ourselves.
                    </p>
                </div>
            )
        },
        3: {
            title: "User Obligations",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        As a user of our platform, you agree to provide true, accurate, current, and complete information about yourself and your business as prompted by our registration and service forms.
                    </p>
                    <ul className="list-disc pl-5 space-y-3 text-slate-600">
                        <li>You must maintain the security of your account credentials.</li>
                        <li>You are responsible for all activities that occur under your account.</li>
                        <li>You agree to promptly provide any documents or information requested by the assigned professionals to avoid delays.</li>
                        <li>You will not use the platform for any illegal or unauthorized purpose.</li>
                    </ul>
                </div>
            )
        },
        4: {
            title: "Payment & Refund",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        All payments for services must be made in advance through our secure payment gateways. Fees displayed on the platform are exclusive of government fees unless explicitly stated otherwise.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        Refunds are governed by our dedicated Refund Policy. Generally, if a service request is cancelled before a professional begins work, a full refund (minus payment processing fees) may be issued. Once work has commenced, refunds are partially or fully restricted based on the progress.
                    </p>
                </div>
            )
        },
        5: {
            title: "Intellectual Property",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        All content, features, and functionality on the ShineFiling platform, including text, graphics, logos, icons, and software, are the exclusive property of ShineFiling and are protected by Indian and international copyright, trademark, and other intellectual property laws.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        You may not reproduce, distribute, modify, create derivative works of, publicly display, or in any way exploit any of the materials or content on our platform without our prior written consent.
                    </p>
                </div>
            )
        },
        6: {
            title: "Limitation of Liability",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        To the maximum extent permitted by law, ShineFiling shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the platform and services.
                    </p>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            We do not guarantee that the services will meet all your requirements, or that they will be uninterrupted, timely, secure, or error-free. The advice provided by freelance professionals via our platform is their own, and ShineFiling takes no liability for such professional advice.
                        </p>
                    </div>
                </div>
            )
        },
        7: {
            title: "Privacy & Data",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Your privacy is of utmost importance to us. Our collection, use, and sharing of personal and business data are governed by our Privacy Policy.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        By using ShineFiling, you consent to the processing of your data as described in the Privacy Policy. We implement robust security measures to protect your documents and sensitive financial data from unauthorized access.
                    </p>
                </div>
            )
        },
        8: {
            title: "Termination",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        We reserve the right to suspend or terminate your account and your access to our services, at our sole discretion, without notice or liability.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        Common reasons for termination include breaches of these Terms of Service, suspected fraudulent activity, or failure to pay corresponding fees. Upon termination, your right to use the platform will immediately cease.
                    </p>
                </div>
            )
        },
        9: {
            title: "Governing Law",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of India.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        Any disputes arising out of or relating to these terms or the services provided shall be subject to the exclusive jurisdiction of the courts located in Chennai, Tamil Nadu, India.
                    </p>
                </div>
            )
        },
        10: {
            title: "General Terms",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        These terms, along with the Privacy Policy and Refund Policy, constitute the entire agreement between you and ShineFiling.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        We may update these terms from time to time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the platform after any such changes constitutes your acceptance of the new Terms of Service. If any provision is deemed unenforceable, it will be severed without affecting the validity of the remaining provisions.
                    </p>
                </div>
            )
        },
        default: (id) => ({
            title: sections.find(s => s.id === id)?.title || "Terms Provision",
            body: (
                <div className="space-y-8">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Detailed provisions regarding <strong>{sections.find(s => s.id === id)?.title}</strong> are outlined here to ensure complete transparency in our operations.
                    </p>
                </div>
            )
        })
    };

    const activeContent = content[activeSection] || content.default(activeSection);

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#ED6E3F]/20 text-[#043E52]">
            {/* Minimal Sub-header */}
            <div className="pt-24 pb-12 bg-slate-50 border-b border-slate-100">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="text-[#ED6E3F] font-bold tracking-widest uppercase text-[10px] mb-2 block">Legal Documentation</span>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                                Terms of <span className="text-[#ED6E3F]">Service</span>
                            </h1>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Version 2.4.0</p>
                            <p className="text-slate-300 text-[10px]">Updated: March 05, 2026</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12 min-h-[70vh]">

                    {/* Left Sidebar - Navigation */}
                    <div className="w-full lg:w-[350px] shrink-0">
                        <div className="sticky top-32 space-y-2 bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Table of Contents</p>
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${activeSection === section.id
                                        ? 'bg-[#043E52] text-white shadow-xl shadow-navy/20 translate-x-2'
                                        : 'text-slate-500 hover:bg-white hover:text-[#043E52] hover:shadow-md'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${activeSection === section.id ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-[#f0f9fa] group-hover:text-[#043E52]'}`}>
                                            <span className="text-[10px] font-bold">{section.id}</span>
                                        </div>
                                        <span className="text-sm font-bold tracking-tight">{section.title}</span>
                                    </div>
                                    <ChevronRight size={14} className={`transition-transform ${activeSection === section.id ? 'opacity-100 translate-x-1' : 'opacity-0'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1">
                        <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-2xl shadow-slate-200/50 min-h-full">
                            <div key={activeSection} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-14 h-14 rounded-2xl bg-[#f0f9fa] flex items-center justify-center text-[#043E52] shadow-sm">
                                        {sections.find(s => s.id === activeSection)?.icon}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-[#ED6E3F] uppercase tracking-widest">Section 0{activeSection}</p>
                                        <h2 className="text-3xl font-bold tracking-tight uppercase">{activeContent.title}</h2>
                                    </div>
                                </div>

                                <div className="prose prose-slate max-w-none">
                                    {activeContent.body}
                                </div>

                                <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex items-center gap-4 cursor-pointer group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#ED6E3F]/10 group-hover:text-[#ED6E3F] transition-all">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Documentation</p>
                                            <p className="text-sm font-bold group-hover:text-[#ED6E3F] transition-colors">Email a copy to me</p>
                                        </div>
                                    </div>

                                    <button className="px-12 py-4 bg-[#ED6E3F] text-white rounded-2xl font-bold tracking-widest text-xs uppercase shadow-xl shadow-orange-900/20 hover:bg-[#043E52] hover:shadow-navy/20 hover:-translate-y-1 transition-all active:scale-95">
                                        Acknowledge & Agree
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

export default TermsPage;
