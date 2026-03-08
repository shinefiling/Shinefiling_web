import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight, Zap, Target, Users, Search } from 'lucide-react';

import { getPublicJobs } from '../careerApi';

const CareersPage = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getPublicJobs();
                setJobs(data);
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* 1. HERO SECTION */}
            <div className="relative min-h-[60vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2084"
                        alt="Team Collaboration"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/80 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                            <Users size={12} className="fill-bronze" /> Join The Revolution
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 text-white tracking-tight">
                            Build The Future of <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-yellow-200">LegalTech.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10 font-light">
                            We're always looking for talented individuals to help us revolutionize the legal-tech industry in India. Work on hard problems with a team that cares.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* 2. VALUES SECTION */}
            <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: Zap, title: "High Impact", desc: "Your work directly affects thousands of entrepreneurs." },
                        { icon: Target, title: "Growth First", desc: "We invest heavily in your personal and professional growth." },
                        { icon: Users, title: "Open Culture", desc: "No politics. Just passionate people building great things." }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 rounded-xl bg-bronze/10 flex items-center justify-center text-bronze mb-4">
                                <item.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-navy mb-2">{item.title}</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. JOBS LISTING SECTION */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Open Positions</h2>
                        <p className="text-gray-500">Come join us in our mission.</p>
                    </div>
                </div>

                {jobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {jobs.map((job) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                    <Briefcase size={120} className="text-navy" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-navy group-hover:text-bronze transition-colors">{job.title}</h3>
                                            <p className="text-xs font-bold text-bronze mt-2 uppercase tracking-wider bg-bronze/10 inline-block px-3 py-1 rounded-full">{job.department}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                                        {job.description}
                                    </p>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium mb-8">
                                        <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100"><MapPin size={14} className="text-bronze" /> {job.location}</span>
                                        <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100"><Clock size={14} className="text-bronze" /> {job.type}</span>
                                    </div>
                                    <button className="w-full py-3.5 rounded-xl bg-navy text-white font-bold group-hover:bg-bronze transition-colors flex items-center justify-center gap-2 shadow-lg shadow-navy/20">
                                        Apply Now <ArrowRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center max-w-2xl mx-auto py-20">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <Search size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-navy mb-4">No Openings Currently</h3>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            We don't have any specific roles open right now, but we love meeting new talent! If you think you'd be a great fit, send us your resume.
                        </p>
                        <a href="mailto:careers@shinefiling.com" className="px-8 py-3 bg-bronze text-white font-bold rounded-xl hover:bg-yellow-700 transition-all inline-flex items-center gap-2 shadow-lg shadow-bronze/20">
                            Send Your Resume <ArrowRight size={18} />
                        </a>
                    </div>
                )}

                {/* Always Show General Application option if jobs exist too */}
                {jobs.length > 0 && (
                    <div className="mt-16 text-center bg-[#2B3446] rounded-3xl p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-bronze/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-2">Don't see a perfect fit?</h3>
                            <p className="text-gray-400 mb-6">We are always hiring great people. Send us your resume.</p>
                            <a href="mailto:careers@shinefiling.com" className="text-bronze font-bold hover:text-white transition-colors flex items-center justify-center gap-2">
                                Email us at careers@shinefiling.com <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareersPage;
