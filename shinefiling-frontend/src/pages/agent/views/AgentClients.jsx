import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Building, Search, User, ExternalLink, MessageSquare, MoreVertical, ShieldCheck, Clock } from 'lucide-react';

const AgentClients = ({ tasks }) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Extract unique clients from tasks list
    const uniqueClients = Array.from(new Set(tasks.map(t => t.user?.id || t.userEmail)))
        .map(id => {
            return tasks.find(t => (t.user?.id || t.userEmail) === id)?.user || {
                fullName: 'Unknown Client',
                email: id || 'No Email',
                phone: 'N/A'
            };
        })
        .filter(client => 
            (client.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (client.email || '').toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 font-roboto uppercase">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white dark:bg-[#043E52] p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-[#1C3540]">
                <div>
                    <h2 className="text-2xl font-black text-[#043E52] dark:text-white tracking-tight">Client Portfolio</h2>
                    <p className="text-slate-400 text-[10px] font-bold tracking-widest mt-1">Managing {uniqueClients.length} active business relationships</p>
                </div>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search portfolio..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-80 pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-[#1C3540] border-none rounded-2xl text-[11px] font-black tracking-widest focus:ring-2 focus:ring-[#ED6E3F] outline-none dark:text-white transition-all shadow-inner" 
                    />
                </div>
            </div>

            {uniqueClients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {uniqueClients.map((client, i) => (
                        <div key={i} className="group relative">
                            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 rounded-[40px] blur-xl opacity-0 hover:opacity-10 dark:hover:opacity-20 transition-opacity"></div>
                            <div className="relative bg-white dark:bg-[#043E52] rounded-[40px] p-8 border border-slate-100 dark:border-[#1C3540] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-[#1B343D] rounded-bl-[80px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-[#043E52] to-[#1A3642] dark:from-[#ED6E3F] dark:to-[#d55f34] flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-[#ED6E3F]/20 group-hover:rotate-6 transition-transform">
                                            {client.fullName?.[0] || 'C'}
                                        </div>
                                        <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-[#ED6E3F] transition-colors">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>

                                    <div className="mb-8">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-xl font-black text-[#043E52] dark:text-white leading-tight tracking-tight">{client.fullName || 'Unknown Client'}</h3>
                                            <ShieldCheck size={16} className="text-emerald-500" />
                                        </div>
                                        <span className="text-[10px] font-black text-[#ED6E3F] tracking-[0.2em]">Verified Business</span>
                                    </div>

                                    <div className="space-y-4 mb-10">
                                        <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
                                            <Mail size={16} className="text-[#ED6E3F]" />
                                            <span className="truncate lowercase">{client.email}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
                                            <Phone size={16} className="text-[#ED6E3F]" />
                                            <span>{client.phone || '+91 CONTACT PROTECTED'}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
                                            <MapPin size={16} className="text-[#ED6E3F]" />
                                            <span>CHENNAI, IN</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="flex-1 py-4 bg-[#043E52] dark:bg-white text-white dark:text-[#043E52] rounded-2xl text-[10px] font-black tracking-widest hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all uppercase">
                                            View Archive
                                        </button>
                                        <button className="px-5 py-4 bg-orange-50 dark:bg-slate-800 text-[#ED6E3F] rounded-2xl hover:bg-orange-100 transition-all active:scale-90">
                                            <MessageSquare size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-40 bg-white dark:bg-[#043E52] rounded-[48px] border border-slate-100 dark:border-[#1C3540] shadow-sm">
                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User size={40} className="text-slate-200 dark:text-slate-700" />
                    </div>
                    <h3 className="text-xl font-black text-[#043E52] dark:text-white mb-2 tracking-tight">No Acquisitions Yet</h3>
                    <p className="text-slate-400 text-[11px] font-bold tracking-widest max-w-[240px] mx-auto leading-relaxed">Your active client portfolio will expand as you process and complete service applications.</p>
                    <button className="mt-8 text-[#ED6E3F] text-[10px] font-black tracking-[0.2em] hover:underline">Download Acquisition Guide</button>
                </div>
            )}
        </motion.div>
    );
};

export default AgentClients;
