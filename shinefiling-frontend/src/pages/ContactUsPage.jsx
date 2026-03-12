import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Mail, Phone, Clock, Shield, Zap, MessageSquare, 
    Headphones, FileText, UserCheck, 
    ArrowRight, Globe, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactUsPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Brand Colors from tailwind.config.js
    const BRAND_TEAL = "#043E52";
    const BRAND_ORANGE = "#ED6E3F";

    const departments = [
        {
            icon: Headphones,
            title: "Client Support",
            desc: "Need help with an ongoing application or technical issues?",
            email: "info@shinefiling.com",
            iconBg: "bg-orange-50",
            iconColor: "text-orange-500"
        },
        {
            icon: FileText,
            title: "Sales & Inquiries",
            desc: "Interested in our services? Get custom quotes for your business.",
            email: "info@shinefiling.com",
            iconBg: "bg-orange-50",
            iconColor: "text-orange-500"
        },
        {
            icon: UserCheck,
            title: "Expert Consultation",
            desc: "Direct access to our senior Chartered Accountants.",
            email: "info@shinefiling.com",
            iconBg: "bg-orange-50",
            iconColor: "text-orange-500"
        }
    ];

    const steps = [
        { id: '01', title: 'Pick a Service', desc: 'Choose from our range of 100+ business services.' },
        { id: '02', title: 'Consult Expert', desc: 'Discuss your requirements with our verified CA.' },
        { id: '03', title: 'Seamless Filing', desc: 'Sit back while we handle the documentation.' }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans pb-24 selection:bg-orange-100 selection:text-orange-900">
            
            {/* 1. ULTRA-PREMIUM HERO SECTION */}
            <section className="relative pt-32 pb-64 overflow-hidden" style={{ backgroundColor: BRAND_TEAL }}>
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-10 rounded-full blur-[120px] -mr-96 -mt-96 animate-pulse" style={{ backgroundColor: BRAND_ORANGE }}></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-5 rounded-full blur-[100px] -ml-44 -mb-44" style={{ backgroundColor: BRAND_ORANGE }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-orange-200 text-[10px] font-bold uppercase tracking-[0.3em] mb-8 backdrop-blur-xl border border-white/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping"></span>
                            Always Available
                        </span>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tight">
                            Let's Build <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-300 to-yellow-200">Great Things.</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed mb-12">
                            Skip the wait times. Connect directly with the human intelligence behind India's most trusted CA marketplace.
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-8 text-white/40 text-sm font-medium">
                            <div className="flex items-center gap-2"><Globe size={16}/> Pan India Presence</div>
                            <div className="flex items-center gap-2"><Shield size={16}/> Bank-Grade Security</div>
                            <div className="flex items-center gap-2"><Clock size={16}/> 24h Response Goal</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. DEPARTMENT HUB */}
            <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {departments.map((dept, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-10 rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-orange-500/30 transition-all group"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${dept.iconBg} flex items-center justify-center ${dept.iconColor} mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                <dept.icon size={30} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4" style={{ color: BRAND_TEAL }}>{dept.title}</h3>
                            <p className="text-slate-500 font-light mb-8 leading-relaxed">
                                {dept.desc}
                            </p>
                            <a 
                                href={`mailto:${dept.email}`}
                                className="inline-flex items-center gap-2 font-bold hover:gap-4 transition-all"
                                style={{ color: BRAND_ORANGE }}
                            >
                                {dept.email} <ArrowRight size={18} />
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 3. EXPERIENCE SECTION */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight" style={{ color: BRAND_TEAL }}>
                                Our Support <br />
                                <span style={{ color: BRAND_ORANGE }}>Architecture.</span>
                            </h2>
                            <p className="text-lg text-slate-500 font-light mb-12 leading-relaxed">
                                We've engineered our communication channels to ensure you never have to repeat yourself. Every inquiry is assigned to a dedicated compliance manager.
                            </p>
                            
                            <div className="space-y-10">
                                {steps.map((step, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="text-4xl font-black text-slate-100 transition-colors group-hover:text-orange-100">{step.id}</div>
                                        <div>
                                            <h4 className="text-lg font-bold mb-1" style={{ color: BRAND_TEAL }}>{step.title}</h4>
                                            <p className="text-slate-500 text-sm font-light leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="rounded-[60px] p-12 md:p-20 text-white relative overflow-hidden"
                            style={{ backgroundColor: BRAND_TEAL }}
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full blur-3xl" style={{ backgroundColor: BRAND_ORANGE }}></div>
                            <MessageSquare className="mb-8" size={60} style={{ color: BRAND_ORANGE }} />
                            <h3 className="text-3xl font-bold mb-6">Need Immediate Help?</h3>
                            <p className="opacity-70 mb-12 text-lg font-light">
                                Our hotlines are active 9 AM - 7 PM, Monday to Saturday. Talk to a real human, not a bot.
                            </p>
                            
                            <div className="space-y-6">
                                <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: BRAND_ORANGE }}>
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest font-bold opacity-60">Standard Support</p>
                                        <p className="text-xl font-bold">+91 7639227019</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: BRAND_ORANGE }}>
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest font-bold opacity-60">Main Inbox</p>
                                        <p className="text-xl font-bold">info@shinefiling.com</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4. FAQ MINI-GRID */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-black mb-4" style={{ color: BRAND_TEAL }}>Common Inquiries</h2>
                        <div className="w-20 h-1.5 mx-auto rounded-full" style={{ backgroundColor: BRAND_ORANGE }}></div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-12">
                        {[
                            { q: "How soon will I get a response?", a: "Our average response time for email inquiries is under 4 business hours. Phone support is instant during operating hours." },
                            { q: "Do you offer free consultations?", a: "Yes, our initial assessment for business registration and GST planning is completely free of charge." },
                            { q: "How can I track my existing application?", a: "Simply login to your dashboard using the profile icon above to see live updates and status changes." },
                            { q: "Is my data shared with anyone?", a: "Never. We use enterprise-grade encryption and strictly follow GDPR-aligned privacy practices." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                                <h4 className="text-xl font-bold mb-4" style={{ color: BRAND_TEAL }}>{faq.q}</h4>
                                <p className="text-slate-500 font-light leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. BOTTOM BRAND BANNER */}
            <section className="pt-24 px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <CheckCircle className="mx-auto mb-6" size={40} style={{ color: BRAND_ORANGE }} />
                    <h2 className="text-2xl font-bold mb-6 tracking-tight" style={{ color: BRAND_TEAL }}>Verified Professional Network</h2>
                    <p className="text-slate-500 font-light mb-12 italic">"Connecting you with India's most talented CA freelancers, one conversation at a time."</p>
                    <Link to="/services" className="inline-flex items-center gap-3 px-10 py-5 text-white font-bold rounded-2xl hover:brightness-110 transition-all group shadow-xl shadow-orange-500/10" style={{ backgroundColor: BRAND_ORANGE }}>
                        Explore All Services <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default ContactUsPage;
