import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, FileText, Users, Copy, Shield, ChevronRight, CheckCircle, IndianRupee, Clock, Zap, Crown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-[#043E52] shadow-sm border border-slate-100 dark:border-[#1C3540] rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 font-roboto">
        <div className="flex justify-between items-start mb-2 relative z-10">
            <div>
                <h3 className="text-[#043E52] dark:text-white text-2xl font-bold mb-0.5 tracking-tight group-hover:text-[#ED6E3F] transition-colors">
                    {value}
                </h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{title}</p>
            </div>
            <div className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 ${color} group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 mt-2 uppercase tracking-tighter opacity-80">
            <TrendingUp size={10} /> Live Stats
        </div>
    </div>
);

const AgentOverview = ({ stats, tasks, user, setActiveTab }) => {
    // Greeting logic
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    const activeTasks = tasks.filter(t => t.status !== 'COMPLETED' && t.status !== 'REJECTED');
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 font-roboto">
            {/* Header / Hero Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-[#043E52] p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-[#1C3540] transition-all hover:shadow-md">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-slate-800/50 flex items-center justify-center border border-orange-100 dark:border-slate-800 shadow-sm overflow-hidden flex-shrink-0">
                        <img 
                            src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'P')}&background=ED6E3F&color=fff&bold=true`} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl md:text-2xl font-bold text-[#043E52] dark:text-white tracking-tight">Partner Dashboard</h1>
                            <span className="px-2 py-0.5 bg-[#ED6E3F]/10 text-[#ED6E3F] text-[9px] font-bold rounded-md uppercase tracking-widest border border-[#ED6E3F]/20">Active Partner</span>
                        </div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                            {greeting}, <span className="text-[#ED6E3F]">{user?.fullName || 'Partner'}</span>! You have <span className="text-[#043E52] dark:text-white">{activeTasks.length} active applications</span> in progress.
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => setActiveTab('create_app')} 
                    className="flex-shrink-0 px-6 py-2.5 bg-[#ED6E3F] text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-[#ED6E3F]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                    <Zap size={14} /> New Application
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Wallet Balance" 
                    value={`₹${Number(stats.walletBalance).toLocaleString()}`} 
                    icon={Wallet} 
                    color="text-emerald-500" 
                />
                <StatCard 
                    title="Active Drafts" 
                    value={activeTasks.length} 
                    icon={Clock} 
                    color="text-amber-500" 
                />
                <StatCard 
                    title="Success Rate" 
                    value={tasks.length > 0 ? `${Math.round((completedTasks.length / tasks.length) * 100)}%` : '0%'} 
                    icon={CheckCircle} 
                    color="text-blue-500" 
                />
                <StatCard 
                    title="Total Clients" 
                    value={new Set(tasks.map(t => t.userEmail)).size} 
                    icon={Users} 
                    color="text-purple-500" 
                />
            </div>

            {/* Referral / Partner Card */}
            <div className="bg-gradient-to-br from-[#043E52] to-[#0A1F26] dark:from-[#ED6E3F] dark:to-[#d55f34] rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Crown className="text-amber-400 fill-amber-400" size={24} />
                            <h3 className="text-2xl font-bold tracking-tight">Expand Your Network</h3>
                        </div>
                        <p className="text-white/80 leading-relaxed text-sm">
                            Grow your partner ecosystem and earn premium commissions. Refer new users to use ShineFiling services through your unique partner code and track everything in real-time.
                        </p>
                        <div className="flex flex-wrap gap-3 mt-6">
                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold border border-white/20">Fixed 10% Share</div>
                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold border border-white/20">Instant Payouts</div>
                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold border border-white/20">Dedicated Support</div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Your Partner Code</p>
                        <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl flex items-center gap-3 border border-white/20 w-full md:w-auto group">
                            <code className="px-4 text-emerald-400 dark:text-white font-mono text-xl font-bold tracking-wider">{user?.id || 'SF-PARTNER'}</code>
                            <button 
                                onClick={() => { navigator.clipboard.writeText(user?.id); alert("Partner ID Copied!"); }} 
                                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all active:scale-90"
                            >
                                <Copy size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white dark:bg-[#043E52] rounded-[32px] p-6 border border-slate-100 dark:border-[#1C3540] shadow-sm">
                <div className="flex justify-between items-center mb-6 px-2">
                    <h3 className="font-bold text-lg text-[#043E52] dark:text-white flex items-center gap-2">
                        <Clock size={20} className="text-[#ED6E3F]" /> Recent Applications
                    </h3>
                    <button onClick={() => setActiveTab('applications')} className="text-[#ED6E3F] text-xs font-bold hover:underline py-2 px-4 bg-orange-50 dark:bg-slate-800/50 rounded-xl transition-all">View Full Tracker</button>
                </div>
                
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-[#1C3540]/50 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                            <tr>
                                <th className="px-6 py-4 rounded-l-2xl">Reference</th>
                                <th className="px-6 py-4">Service Type</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right rounded-r-2xl pr-8">Commission</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {tasks.slice(0, 5).map((task, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-[#1C3540]/30 transition-all group">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800 dark:text-white text-sm">{task.user?.fullName || 'Client'}</span>
                                            <span className="text-[10px] text-slate-400 font-mono mt-0.5">ID: #{task.id?.toString().slice(-6).toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{task.serviceName}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                                            task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' :
                                            task.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20' :
                                            'bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                                        }`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                            {task.status?.replace(/_/g, ' ') || 'PROCESSING'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right font-bold text-[#043E52] dark:text-white pr-8">
                                        {task.status === 'COMPLETED' ? (
                                            <span className="text-emerald-500 flex items-center justify-end gap-1">
                                                <IndianRupee size={12} /> {Number(task.commission || 500).toLocaleString()}
                                            </span>
                                        ) : (
                                            <span className="text-slate-300 dark:text-slate-600 uppercase text-[10px] tracking-widest font-black">Escrow</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {tasks.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-16 text-center">
                                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                            <FileText size={32} />
                                        </div>
                                        <p className="text-slate-400 font-bold text-sm">No applications found in your history.</p>
                                        <button onClick={() => setActiveTab('create_app')} className="mt-4 text-[#ED6E3F] text-xs font-bold hover:underline">Start your first application</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default AgentOverview;
