import React, { useState } from 'react';
import { Mail, ShieldCheck, Lock, Eye, Database, Share2, UserCheck, FileLock, Globe, ScrollText } from 'lucide-react';

const PrivacyPage = () => {
    const [activeSection, setActiveSection] = useState(1);

    const sections = [
        { id: 1, title: "Data Collection", icon: <Database size={18} /> },
        { id: 2, title: "How We Use Data", icon: <ScrollText size={18} /> },
        { id: 3, title: "Data Protection", icon: <Lock size={18} /> },
        { id: 4, title: "Third-Party Sharing", icon: <Share2 size={18} /> },
        { id: 5, title: "Cookies & Tracking", icon: <Globe size={18} /> },
        { id: 6, title: "User Rights", icon: <UserCheck size={18} /> },
        { id: 7, title: "Data Retention", icon: <FileLock size={18} /> },
        { id: 8, title: "Children's Privacy", icon: <ShieldCheck size={18} /> },
        { id: 9, title: "Policy Updates", icon: <Eye size={18} /> },
        { id: 10, title: "Contact Us", icon: <Mail size={18} /> }
    ];

    const content = {
        1: {
            title: "Information We Collect",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        ShineFiling values your trust. We collect personal and business information that you voluntarily provide when registering, submitting filings, or communicating with our team.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                            <h5 className="font-bold text-[#043E52] mb-2 uppercase text-xs tracking-widest">Personal Data</h5>
                            <p className="text-sm text-slate-500">Name, Email, PAN/Aadhaar details, and Billing Information.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#f0f9fa] border border-[#d9f0f2]">
                            <h5 className="font-bold text-[#043E52] mb-2 uppercase text-xs tracking-widest">Technical Data</h5>
                            <p className="text-sm text-slate-500">IP address, browser type, and interaction patterns on our platform.</p>
                        </div>
                    </div>
                </div>
            )
        },
        2: {
            title: "How We Use Data",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        The information we collect is used meticulously to provide, maintain, and improve our services, as well as to process your legal and financial filings effectively.
                    </p>
                    <ul className="list-disc pl-5 space-y-3 text-slate-600">
                        <li>Fulfilling service orders (like Company Registration, GST, ITR).</li>
                        <li>Communicating updates regarding your filings.</li>
                        <li>Processing payments securely.</li>
                        <li>Improving user experience and platform functionality.</li>
                        <li>Complying with legal obligations.</li>
                    </ul>
                </div>
            )
        },
        3: {
            title: "Data Protection",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        We implement stringent security measures designed to safeguard your personal and sensitive business data.
                    </p>
                    <div className="bg-white border-l-4 border-[#ED6E3F] p-8 shadow-sm">
                        <p className="text-slate-500 font-medium leading-relaxed">
                            We utilize 256-bit AES encryption for all data at rest and TLS 1.3 for data in transit. Your documents such as PAN cards, Aadhaar cards, and bank statements are stored in secure cloud environments with restricted access based on necessity.
                        </p>
                    </div>
                </div>
            )
        },
        4: {
            title: "Third-Party Sharing",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except as required to fulfill our services.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        Your data may be shared with:
                        <br />• <strong>Government Portals:</strong> Such as MCA, Income Tax Department, and GST Portal for filing purposes.
                        <br />• <strong>Freelance Professionals:</strong> Assigned Chartered Accountants or Company Secretaries handling your specific case.
                        <br />• <strong>Service Providers:</strong> Payment gateways and secure cloud storage providers bound by confidentiality agreements.
                    </p>
                </div>
            )
        },
        5: {
            title: "Cookies & Tracking",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Our platform uses "cookies" and similar tracking technologies to enhance your experience, analyze trends, and gather demographic information.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        Cookies help us remember your preferences, keep you logged in securely, and understand how you interact with our website. You can control cookie preferences through your browser settings, though disabling them may impact some website functionalities.
                    </p>
                </div>
            )
        },
        6: {
            title: "User Rights",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        You have complete control over your personal information and hold specific rights under data protection laws.
                    </p>
                    <ul className="list-disc pl-5 space-y-3 text-slate-600">
                        <li><strong>Access:</strong> You can request a copy of the data we hold about you.</li>
                        <li><strong>Correction:</strong> You can update inaccurate or incomplete data.</li>
                        <li><strong>Deletion:</strong> You can request deletion of your data, provided there are no pending legal or regulatory obligations to retain it.</li>
                    </ul>
                </div>
            )
        },
        7: {
            title: "Data Retention",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        We retain your personal and business data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        Financial transaction records and compliance documents filed with government authorities may be retained for 7-8 years or more, as mandated by Indian taxation and corporate laws.
                    </p>
                </div>
            )
        },
        8: {
            title: "Children's Privacy",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Our platform and services are strictly intended for businesses, professionals, and individuals who are at least 18 years of age.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        We do not knowingly collect or solicit personal information from children under 18. If we discover that we have inadvertently collected data from a minor without verified parental consent, we will promptly delete that information.
                    </p>
                </div>
            )
        },
        9: {
            title: "Policy Updates",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        When we make significant changes, we will notify you via email or through a prominent notice on our website prior to the change becoming effective. We encourage you to review this page periodically for the latest information on our privacy practices.
                    </p>
                </div>
            )
        },
        10: {
            title: "Contact Us",
            body: (
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        If you have any questions, concerns, or requests regarding this Privacy Policy or your data, our dedicated support team is ready to assist you.
                    </p>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex gap-4 mt-4">
                        <p className="text-slate-600">
                            <strong>Email:</strong> privacy@shinefiling.com <br />
                            <strong>Address:</strong> ShineFiling HQ, OMR IT Expressway, Chennai, Tamil Nadu, India.
                        </p>
                    </div>
                </div>
            )
        },
        default: (id) => ({
            title: sections.find(s => s.id === id)?.title || "Privacy Provision",
            body: (
                <div className="space-y-8">
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Our protocol regarding <strong>{sections.find(s => s.id === id)?.title}</strong> is designed to exceed industry benchmarks for data confidentiality and legal compliance.
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
                            <span className="text-[#ED6E3F] font-bold tracking-widest uppercase text-[10px] mb-2 block">Data Protection Shield</span>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                                Privacy <span className="text-[#ED6E3F]">Policy</span>
                            </h1>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Compliant with IT Act 2000</p>
                            <p className="text-slate-300 text-[10px]">Last Modified: March 05, 2026</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12 min-h-[70vh]">

                    {/* Navigation Sidebar */}
                    <div className="w-full lg:w-[350px] shrink-0">
                        <div className="sticky top-32 space-y-2 bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${activeSection === section.id
                                        ? 'bg-[#043E52] text-white shadow-xl'
                                        : 'text-slate-500 hover:bg-white hover:text-[#043E52]'}`}
                                >
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${activeSection === section.id ? 'bg-white/10' : 'bg-slate-100'}`}>
                                        <span className="text-[10px] font-bold">{section.id}</span>
                                    </div>
                                    <span className="text-sm font-bold tracking-tight">{section.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                        <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-2xl shadow-slate-200/50 min-h-full relative overflow-hidden">
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f0f9fa] rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>

                            <div key={activeSection} className="animate-in fade-in slide-in-from-right-4 duration-500 relative z-10">
                                <h2 className="text-3xl font-bold tracking-tight uppercase mb-10">{activeContent.title}</h2>
                                {activeContent.body}

                                <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex items-center gap-4 cursor-pointer group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#ED6E3F]/10 group-hover:text-[#ED6E3F] transition-all">
                                            <Mail size={18} />
                                        </div>
                                        <span className="text-sm font-bold group-hover:text-[#ED6E3F]">Download PDF Copy</span>
                                    </div>

                                    <button className="px-12 py-4 bg-[#66BB6A] text-white rounded-2xl font-bold tracking-widest text-xs uppercase shadow-xl shadow-green-200 hover:bg-[#57a85b] transition-all active:scale-95">
                                        I Understand
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

export default PrivacyPage;
