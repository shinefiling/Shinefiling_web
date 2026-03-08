import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Briefcase, CheckCircle, Clock, TrendingUp, Users, IndianRupee } from 'lucide-react';

const CaOverview = ({ user, requests, employees = [], handleAcceptRequest, handleRejectRequest, setActiveTab }) => {
    const pendingApproval = requests.filter(r => r.caApprovalStatus === 'PENDING_APPROVAL');
    const activeWorks = requests.filter(r => r.caApprovalStatus === 'ACCEPTED' && r.status !== 'COMPLETED');
    const completed = requests.filter(r => r.status === 'COMPLETED');
    const totalEarnings = completed.reduce((sum, r) => sum + (Number(r.boundAmount) || 0), 0);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 font-roboto">
            <div className="flex justify-between items-start mb-2 relative z-10">
                <div>
                    <h3 className="text-slate-800 dark:text-white text-xl md:text-2xl font-bold mb-0.5 tracking-tight group-hover:text-[#F97316] transition-colors">
                        {value}
                    </h3>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{title}</p>
                </div>
                <div className={`p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 ${color} group-hover:scale-110 transition-transform`}>
                    <Icon size={18} />
                </div>
            </div>
            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 mt-1 uppercase tracking-tighter opacity-80">
                <TrendingUp size={10} /> Live Data Sync
            </div>
        </div>
    );

    // Greeting logic
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 font-roboto">
            {/* Dashboard Overview Card */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:shadow-md">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-slate-900 flex items-center justify-center border border-orange-100 dark:border-slate-700 shadow-sm overflow-hidden flex-shrink-0">
                        <img
                            src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'CA')}&background=F97316&color=fff&bold=true`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Dashboard Overview</h1>
                            <span className="px-2 py-0.5 bg-orange-50 dark:bg-orange-950/20 text-[#F97316] text-[9px] font-bold rounded-md uppercase tracking-widest border border-orange-100/50 dark:border-orange-900/30">Partner Panel</span>
                        </div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                            {greeting}, <span className="text-[#F97316]">{user?.fullName || 'Partner'}</span>! You have <span className="text-slate-800 dark:text-slate-200">{pendingApproval.length} pending requests</span> & <span className="text-slate-800 dark:text-slate-200">{activeWorks.length} active works</span>.
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setActiveTab('works')}
                    className="flex-shrink-0 px-6 py-2.5 bg-slate-800 dark:bg-[#F97316] text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/10 hover:scale-105 active:scale-95 transition-all"
                >
                    View Active Works
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl">
                <StatCard
                    title="Pending Requests"
                    value={pendingApproval.length}
                    icon={Clock}
                    color="text-amber-500"
                />
                <StatCard
                    title="Active Projects"
                    value={activeWorks.length}
                    icon={Briefcase}
                    color="text-blue-500"
                />
                <StatCard
                    title="Completed Works"
                    value={completed.length}
                    icon={CheckCircle}
                    color="text-emerald-500"
                />
                <StatCard
                    title="Settled Earnings"
                    value={`₹${totalEarnings.toLocaleString()}`}
                    icon={IndianRupee}
                    color="text-purple-500"
                />
            </div>

            {/* Pending Requests List */}
            {pendingApproval.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-4 flex items-center gap-2">
                        <Bell className="text-[#F97316]" size={20} /> New Requests from Admin
                    </h3>
                    <div className="space-y-4">
                        {pendingApproval.map(r => (
                            <div key={r.id} className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/30 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-slate-800 dark:text-white text-lg">{r.serviceName}</h4>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-white/10 text-slate-500 uppercase border border-slate-200 dark:border-white/10">#{r.id}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Client: <span className="font-bold">{r.user?.fullName}</span> ({r.user?.email})</p>

                                    <div className="flex items-center gap-4 text-xs font-mono bg-white/50 dark:bg-black/20 p-2 rounded-lg inline-flex">
                                        <span className="text-slate-500 dark:text-slate-400">Offered Amount:</span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">₹{r.boundAmount}</span>
                                    </div>

                                    {r.adminComments && (
                                        <div className="mt-2 text-xs text-slate-500 flex items-start gap-1">
                                            <span className="font-bold">Note:</span> {r.adminComments}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button
                                        onClick={() => handleRejectRequest(r)}
                                        className="flex-1 md:flex-none px-4 py-2 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 font-bold rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-sm"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleAcceptRequest(r)}
                                        className="flex-1 md:flex-none px-6 py-2 bg-slate-800 dark:bg-[#F97316] text-white font-bold rounded-xl hover:shadow-lg transition-all text-sm"
                                    >
                                        Accept Request
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Activity / Empty State if no pending requests */}
            {pendingApproval.length === 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-12 text-center">
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">All Caught Up!</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        You have no pending requests from the admin. Check your active works to manage ongoing projects.
                    </p>
                    <button
                        onClick={() => setActiveTab('works')}
                        className="mt-6 px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-[#2C4A57] transition-colors"
                    >
                        View Active Works
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default CaOverview;
