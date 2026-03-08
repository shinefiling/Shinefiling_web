
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Building, Search, User } from 'lucide-react';

const AgentClients = ({ tasks }) => {
    // Extract unique clients from tasks list (simulated logic as we don't have separate client endpoint yet)
    const uniqueClients = Array.from(new Set(tasks.map(t => t.user?.id || t.userEmail)))
        .map(id => {
            return tasks.find(t => (t.user?.id || t.userEmail) === id)?.user || {
                fullName: 'Unknown Client',
                email: id || 'No Email',
                phone: 'N/A'
            };
        });

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#043E52] dark:text-white">Active Clients</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Search clients..." className="pl-10 pr-4 py-2.5 bg-white dark:bg-[#1C3540] border border-slate-200 dark:border-slate-700 rounded-xl text-sm w-64 focus:ring-2 focus:ring-[#ED6E3F] outline-none dark:text-white" />
                </div>
            </div>

            {uniqueClients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uniqueClients.map((client, i) => (
                        <div key={i} className="bg-white dark:bg-[#043E52] rounded-3xl p-6 border border-slate-100 dark:border-[#1C3540] shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 dark:bg-[#1C3540] rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#043E52] to-[#2C5282] dark:from-[#ED6E3F] dark:to-[#A67C52] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-900/20">
                                        {client.fullName?.[0] || <User />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#043E52] dark:text-white leading-tight">{client.fullName || 'Client Name'}</h3>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business Owner</span>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-[#1C3540] flex items-center justify-center text-slate-400"><Mail size={14} /></div>
                                        <span className="truncate">{client.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-[#1C3540] flex items-center justify-center text-slate-400"><Phone size={14} /></div>
                                        <span>{client.phone || '+91 7639227019'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-[#1C3540] flex items-center justify-center text-slate-400"><MapPin size={14} /></div>
                                        <span>Chennai, India</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button className="flex-1 py-2.5 bg-[#043E52] dark:bg-white dark:text-[#043E52] text-white rounded-xl text-sm font-bold hover:opacity-90 transition">View Profile</button>
                                    <button className="px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1C3540] transition text-slate-600 dark:text-slate-300"><Mail size={18} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-[#043E52] rounded-3xl border border-slate-100 dark:border-[#1C3540]">
                    <User size={48} className="mx-auto text-slate-200 dark:text-slate-700 mb-4" />
                    <h3 className="text-lg font-bold text-[#043E52] dark:text-white">No Clients Found</h3>
                    <p className="text-slate-500 text-sm">Once you process applications, your clients will appear here.</p>
                </div>
            )}
        </motion.div>
    );
};

export default AgentClients;
