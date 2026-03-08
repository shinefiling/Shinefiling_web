
import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, FileText, Users, Copy, Shield, ChevronRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="bg-white dark:bg-[#043E52] p-6 rounded-3xl border border-slate-100 dark:border-[#1C3540] shadow-sm hover:shadow-md transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 text-${color.replace('bg-', '')}`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            {subtext && <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-[#1C3540] px-2 py-1 rounded-full">{subtext}</span>}
        </div>
        <div className="text-3xl font-bold text-[#043E52] dark:text-white mb-1 group-hover:scale-105 transition-transform origin-left">{value}</div>
        <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</div>
    </div>
);

const AgentOverview = ({ stats, tasks, user, setActiveTab }) => {
    const referralLink = `https://shinefiling.com/ref/${user?.id || 'AGENT'}`;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-[#043E52] dark:text-white">Dashboard Overview</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back, {user?.fullName || 'Partner'}. Here is your daily summary.</p>
                </div>
                <button onClick={() => setActiveTab('create_app')} className="px-6 py-3 bg-[#043E52] dark:bg-[#ED6E3F] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm flex items-center gap-2">
                    <FileText size={18} /> Create New Application
                </button>
            </div>

            {user?.kycStatus === 'REJECTED' && (
                <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800/30 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3 text-rose-700 dark:text-rose-400">
                        <Shield className="fill-rose-100 dark:fill-rose-900/20" />
                        <div>
                            <h4 className="font-bold">KYC Verification Rejected</h4>
                            <p className="text-xs">Your documents were rejected. Please update your profile with valid ID proofs.</p>
                        </div>
                    </div>
                    <button onClick={() => setActiveTab('settings')} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors">Fix Now</button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Wallet Balance" value={`₹${stats.walletBalance.toLocaleString()}`} icon={Wallet} color="bg-emerald-500" subtext="Withdrawable" />
                <StatCard title="Total Earnings" value={`₹${stats.totalEarnings.toLocaleString()}`} icon={TrendingUp} color="bg-blue-500" subtext="Lifetime" />
                <StatCard title="Active Applications" value={stats.pending} icon={FileText} color="bg-orange-500" />
                <StatCard title="Total Clients" value={new Set(tasks.map(t => t.userEmail)).size} icon={Users} color="bg-purple-500" />
            </div>

            <div className="bg-gradient-to-r from-[#043E52] to-[#1A3642] dark:from-[#ED6E3F] dark:to-[#A67C52] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Refer & Earn More</h3>
                        <p className="text-white/80 max-w-md text-sm">Share your unique link. Earn 10% commission on every completed service.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl flex items-center gap-2 border border-white/10 w-full md:w-auto">
                        <code className="px-3 text-emerald-400 dark:text-white font-mono text-sm font-bold">{referralLink}</code>
                        <button onClick={() => { navigator.clipboard.writeText(referralLink); alert("Copied!"); }} className="p-2 hover:bg-white/20 rounded-lg text-white transition-colors"><Copy size={18} /></button>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#043E52] rounded-3xl p-6 border border-slate-100 dark:border-[#1C3540] shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-[#043E52] dark:text-white">Recent Applications</h3>
                    <button onClick={() => setActiveTab('applications')} className="text-[#ED6E3F] text-sm font-bold hover:underline flex items-center">View All <ChevronRight size={16} /></button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-[#1C3540] text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 rounded-l-xl">Service</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right rounded-r-xl">Commission</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-[#1C3540]">
                            {tasks.slice(0, 5).map((task, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-[#1C3540]/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-[#043E52] dark:text-white">{task.serviceName}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{task.user?.fullName || task.userEmail}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${task.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                            task.status === 'REJECTED' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                                                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>{task.status?.replace(/_/g, ' ')}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{new Date(task.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                        {task.status === 'COMPLETED' ? '₹500' : '-'}
                                    </td>
                                </tr>
                            ))}
                            {tasks.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400">No applications yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default AgentOverview;
