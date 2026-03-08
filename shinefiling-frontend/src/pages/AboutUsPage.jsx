import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Award, Users, Shield, Globe, CheckCircle, TrendingUp,
    BookOpen, Target, Heart, Briefcase, ArrowRight, Zap, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import expertVenkatesanImg from '../assets/expert_venkatesan.png';
import expertPrabhuImg from '../assets/expert_prabhu.png';
import drivenTeamImg from '../assets/driven_by_purpose_team_v2.png';

const AboutUsPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Animation Variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* 1. HERO SECTION - PREMIUM DARK */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069"
                        alt="Office Background"
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
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                            <Star size={12} className="fill-bronze" /> India's Trusted Legal Partner
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 text-white tracking-tight">
                            We Simplify The <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-yellow-200">Impossible.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10 font-light">
                            ShineFiling isn't just a service provider; we are the strategic backbone for thousands of startups. We merge legal expertise with cutting-edge technology to make compliance invisible and growth inevitable.
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto mt-16"
                    >
                        {[
                            { label: 'Happy Clients', val: '10k+', icon: Users },
                            { label: 'Successful Filings', val: '50k+', icon: CheckCircle },
                            { label: 'Years Experience', val: '12+', icon: Briefcase },
                            { label: 'Data Security', val: '100%', icon: Shield },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <stat.icon size={24} />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">{stat.val}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* 2. OUR STORY / MISSION */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="absolute -top-4 -left-4 w-72 h-72 bg-bronze/10 rounded-full blur-3xl z-0"></div>
                            <img
                                src={drivenTeamImg}
                                alt="Our Team Meeting"
                                className="relative z-10 rounded-3xl shadow-2xl w-full object-cover h-[500px]"
                            />
                            {/* Floating Card */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 z-20 max-w-xs hidden md:block"
                            >
                                <p className="text-sm text-gray-600 italic">"Our goal is to make starting a business as easy as ordering a pizza."</p>
                                <div className="mt-4 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-white font-bold">V</div>
                                    <div>
                                        <p className="text-xs font-bold text-navy">Venkatesan</p>
                                        <p className="text-[10px] text-bronze font-bold uppercase">CEO & Founder</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl font-bold text-navy mb-6">Driven By <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-yellow-600">Purpose</span></h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                ShineFiling was born from a simple observation: India's entrepreneurs were spending more time on paperwork than on their product. We decided to change that.
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Today, we are tech-first legal partners. We've automated the mundane, simplified the complex, and democratized access to top-tier legal advice. Whether you're a student filing a patent or an MNC setting up a subsidiary, we treat your dream with the dignity it deserves.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { title: 'Zero Hidden Fees', desc: 'Transparent pricing from day one.' },
                                    { title: 'Data Security', desc: 'Bank-grade encryption for your documents.' },
                                    { title: 'Fastest Turnaround', desc: 'We value your time as much as you do.' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                                        <div className="mt-1 p-2 rounded-full bg-bronze/10 text-bronze">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-navy text-lg">{item.title}</h4>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. CORE VALUES - DARK */}
            <section className="py-24 bg-[#2B3446] relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/20 to-transparent pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why We <span className="text-bronze">Shine</span></h2>
                        <p className="text-gray-400">Our core values aren't just posters on a wall; they are the algorithm behind every decision we make.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Target, title: 'Precision', desc: 'Legal work allows no room for error. We strive for 100% accuracy in every filing and compliance check.' },
                            { icon: Zap, title: 'Speed', desc: 'Business moves fast. We move faster. Our automated systems cut processing time by 50% without compromising quality.' },
                            { icon: Shield, title: 'Integrity', desc: 'We handle your sensitive data with the highest ethical standards and top-tier security protocols.' },
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 bg-bronze/20 rounded-2xl flex items-center justify-center text-bronze mb-6 group-hover:bg-bronze group-hover:text-white transition-colors">
                                    <card.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">{card.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. TEAM SECTION */}
            <section className="py-24 bg-[#F2F1EF]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Leadership</span>
                        <h2 className="text-4xl font-bold text-navy mb-4">Meet The <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-yellow-700">Experts</span></h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">The human intelligence behind our artificial intelligence. Our leaders bring decades of experience.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                        {[
                            { name: 'Venkatesan', role: 'Founder', desc: 'Focused on strategic planning and business development.', img: expertVenkatesanImg },
                            { name: 'Prabhu', role: 'CEO & Managing Director', desc: 'Driving operational excellence and organizational growth.', img: expertPrabhuImg },
                        ].map((member, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 group hover:shadow-xl transition-all max-w-2xl mx-auto"
                            >
                                <div className="relative w-48 h-64 rounded-2xl overflow-hidden shrink-0 border-2 border-slate-50 shadow-sm bg-gray-50">
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Overlay for premium feel */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="text-center md:text-left flex-1">
                                    <h3 className="text-3xl font-bold text-navy mb-1">{member.name}</h3>
                                    <p className="text-xs font-bold text-bronze uppercase tracking-widest mb-4 bg-bronze/10 inline-block px-3 py-1 rounded-full">{member.role}</p>
                                    <p className="text-slate-600 leading-relaxed italic text-lg">"{member.desc}"</p>

                                    <div className="w-12 h-1 bg-gradient-to-r from-bronze to-transparent mt-4 opacity-50 mx-auto md:mx-0"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. CTA SECTION */}
            <section className="py-24 bg-white relative overflow-hidden text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-bronze/5 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>

                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <span className="text-bronze font-extrabold tracking-widest uppercase text-sm mb-4 block">Let's Build Something Great</span>
                    <h2 className="text-4xl md:text-6xl font-bold text-navy mb-6 tracking-tight">Launch Your Dream Company.</h2>
                    <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                        No more confusing paperwork. Just you, your idea, and our automated platform handling the rest.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link to="/services" className="px-10 py-5 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/20 hover:shadow-bronze/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                            Start Registration <ArrowRight size={20} />
                        </Link>
                        <Link to="/contact-us" className="px-10 py-5 bg-white border border-slate-200 text-navy hover:text-bronze hover:border-bronze font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default AboutUsPage;
