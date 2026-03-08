import React, { useState, useEffect } from 'react';
import {
    FileText, CheckCircle, AlertCircle,
    TrendingUp, ArrowRight, Download, MoreHorizontal, Activity, Star, Clock, Loader2, Headset, Folder
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserApplications } from '../../api';

const ClientHome = ({ setActiveTab }) => {
    const [stats, setStats] = useState([
        { label: 'Total Filings', value: '0', icon: FileText, bg: 'bg-[#015A62]', text: 'text-white', subtext: 'text-slate-400', isPrimary: true },
        { label: 'In Progress', value: '0', icon: Activity, bg: 'bg-white dark:bg-[#043E52]', text: 'text-slate-800 dark:text-white', subtext: 'text-slate-500' },
        { label: 'Completed', value: '0', icon: CheckCircle, bg: 'bg-white dark:bg-[#043E52]', text: 'text-slate-800 dark:text-white', subtext: 'text-slate-500' },
        { label: 'Document Wallet', value: '0', icon: Folder, bg: 'bg-white dark:bg-[#043E52]', text: 'text-slate-800 dark:text-white', subtext: 'text-slate-500' }
    ]);
    const [recentServices, setRecentServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState([0, 0, 0, 0, 0, 0, 0]); // Fallback/Visual

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.email) return;

                const applications = await getUserApplications(user.email);

                if (applications) {
                    // Update Stats
                    const total = applications.length;
                    const inProgress = applications.filter(a => !['Completed', 'Action Required', 'Draft'].includes(a.status)).length;
                    const completed = applications.filter(a => a.status === 'Completed').length;
                    const walletDocCount = 0; // Placeholder for now

                    setStats([
                        { label: 'Total Filings', value: total.toString(), icon: FileText, bg: 'bg-[#015A62]', text: 'text-white', subtext: 'text-slate-400', isPrimary: true },
                        { label: 'In Progress', value: inProgress.toString(), icon: Activity, bg: 'bg-white dark:bg-[#043E52]', text: 'text-slate-800 dark:text-white', subtext: 'text-slate-500' },
                        { label: 'Completed', value: completed.toString(), icon: CheckCircle, bg: 'bg-white dark:bg-[#043E52]', text: 'text-slate-800 dark:text-white', subtext: 'text-slate-500' },
                        { label: 'Document Wallet', value: walletDocCount.toString(), icon: Folder, bg: 'bg-white dark:bg-[#043E52]', text: 'text-slate-800 dark:text-white', subtext: 'text-slate-500' }
                    ]);

                    // Update Recent Services (Top 5)
                    const sorted = [...applications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setRecentServices(sorted.slice(0, 5).map(app => ({
                        id: app.id,
                        name: app.serviceName || 'Service Request',
                        status: app.status || 'Processing',
                        icon: getIconForService(app.serviceName),
                        date: getTimeAgo(app.createdAt)
                    })));

                    // Calculate Weekly Activity (Last 7 weeks)
                    // Group by week relative to current date
                    const weeks = [0, 0, 0, 0, 0, 0, 0];
                    const now = new Date();

                    sorted.forEach(app => {
                        const date = new Date(app.createdAt);
                        const diffTime = Math.abs(now - date);
                        const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

                        if (diffWeeks < 7) {
                            // index 6 is this week (0 diff), index 0 is 7 weeks ago
                            const index = 6 - diffWeeks;
                            if (index >= 0 && index < 7) {
                                weeks[index] += 10; // Increment by 10 for visibility (or 20 etc)
                            }
                        }
                    });

                    // Normalize to max 100 for percentage height
                    const maxVal = Math.max(...weeks, 1);
                    const normalizedWeeks = weeks.map(w => w === 0 ? 5 : Math.min(100, (w / maxVal) * 90));
                    setAnalyticsData(normalizedWeeks);

                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper to get time ago
    const getTimeAgo = (date) => {
        if (!date) return 'N/A';
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return "Just now";
    };

    const getIconForService = (name) => {
        if (!name) return '📄';
        const n = name.toLowerCase();
        if (n.includes('gst') || n.includes('tax')) return '📊';
        if (n.includes('trademark') || n.includes('copyright')) return '®️';
        if (n.includes('company') || n.includes('pvt') || n.includes('llp')) return '🏢';
        if (n.includes('license') || n.includes('fssai')) return '📜';
        return '📄';
    };


    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Dashboard</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here's what's happening with your business today.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setActiveTab('new-filing')} className="px-5 py-2.5 bg-[#ED6E3F] hover:bg-[#A57753] text-white font-bold rounded-xl shadow-lg shadow-[#ED6E3F]/20 transition-all flex items-center gap-2">
                        + New Service
                    </button>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className={`${stat.bg} ${stat.isPrimary ? 'shadow-xl shadow-[#015A62]/20' : 'shadow-sm border border-slate-100 dark:border-[#1C3540]'} rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
                        {stat.isPrimary && (
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ED6E3F]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        )}
                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <div>
                                <h3 className={`${stat.isPrimary ? 'text-white' : 'text-slate-800 dark:text-white'} text-2xl font-bold mb-0.5 tracking-tight`}>{loading ? '...' : stat.value}</h3>
                                <p className={`${stat.isPrimary ? 'text-slate-300' : 'text-slate-500'} text-[9px] font-bold uppercase tracking-wider`}>{stat.label}</p>
                            </div>
                            <div className={`p-1.5 rounded-lg ${stat.isPrimary ? 'bg-white/10 text-white backdrop-blur-sm' : 'bg-slate-50 dark:bg-[#1C3540] text-slate-500 dark:text-slate-300'}`}>
                                <stat.icon size={16} />
                            </div>
                        </div>
                        {stat.isPrimary ? (
                            <div className="relative z-10 mt-1">
                                <span className="text-[9px] font-medium text-[#ED6E3F] bg-white px-1.5 py-0.5 rounded inline-block">Track Status</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500 mt-1">
                                <TrendingUp size={10} /> Updated recently
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Middle Section: Chart & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Analytics Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-[#043E52] rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-[#1C3540]">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-800 dark:text-white">Activity Overview</h3>
                            <p className="text-slate-500 text-[10px] mt-0.5">Application submissions over the last 7 weeks</p>
                        </div>
                        <button className="p-1.5 hover:bg-slate-50 dark:hover:bg-[#1C3540] rounded-full text-slate-400">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>

                    <div className="flex items-end justify-between h-40 gap-3 px-2">
                        {analyticsData.map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="w-full bg-[#F3F4F6] dark:bg-[#1C3540] rounded-t-lg h-full relative overflow-hidden">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className={`absolute bottom-0 w-full rounded-t-lg ${i % 2 === 0 ? 'bg-[#015A62] dark:bg-white' : 'bg-[#ED6E3F]'}`}
                                    ></motion.div>
                                </div>
                                <span className="text-[9px] font-bold text-slate-400 group-hover:text-[#ED6E3F] transition-colors">Week {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Services List */}
                <div className="bg-white dark:bg-[#043E52] rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-[#1C3540] flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-white text-base">Recent Services</h3>
                        <button onClick={() => setActiveTab('orders')} className="text-[10px] font-bold text-[#ED6E3F] hover:underline">View All</button>
                    </div>
                    <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar max-h-[300px]">
                        {loading ? (
                            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-400" size={18} /></div>
                        ) : recentServices.length > 0 ? (
                            recentServices.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-2.5 hover:bg-slate-50 dark:hover:bg-[#1C3540] rounded-xl transition cursor-pointer group border border-transparent hover:border-slate-100 dark:border-[#2A4550]">
                                    <div className="w-9 h-9 bg-slate-100 dark:bg-[#0D1C22] rounded-lg flex items-center justify-center text-base shadow-sm group-hover:bg-white dark:group-hover:bg-[#043E52] transition-colors">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">{item.name}</h4>
                                        <div className="flex items-center justify-between mt-0.5">
                                            <p className={`text-[9px] font-bold ${item.status === 'Completed' ? 'text-emerald-500' :
                                                item.status === 'Action Required' ? 'text-rose-500' :
                                                    'text-amber-500'
                                                }`}>{item.status}</p>
                                            <p className="text-[9px] text-slate-400 flex items-center gap-1"><Clock size={10} />{item.date}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 flex flex-col items-center">
                                <div className="w-12 h-12 bg-[#ED6E3F]/10 rounded-full flex items-center justify-center text-[#ED6E3F] mb-3">
                                    <Star size={20} />
                                </div>
                                <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Welcome to ShineFiling!</h4>
                                <p className="text-[10px] text-slate-500 mb-4 max-w-xs leading-relaxed">You haven't applied for any services yet. Start your journey by registering your business or filing taxes.</p>
                                <button
                                    onClick={() => setActiveTab('new-filing')}
                                    className="px-5 py-2 bg-[#015A62] dark:bg-[#ED6E3F] text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all text-[10px]"
                                >
                                    Start New Filing
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Promo & Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Profile Health (Horizontal Layout) */}
                <div className="bg-white dark:bg-[#043E52] rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-[#1C3540] flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10 max-w-[60%]">
                        <h3 className="font-bold text-slate-800 dark:text-white text-base mb-1.5">Profile Health</h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">Your profile is 85% complete. Add a secondary contact number to reach 100%.</p>
                        <button onClick={() => setActiveTab('profile')} className="text-[10px] font-bold text-white bg-[#015A62] dark:bg-[#ED6E3F] px-4 py-2 rounded-lg hover:opacity-90 transition">Complete Now</button>
                    </div>

                    <div className="relative">
                        <svg className="w-24 h-24 transform -rotate-90">
                            <circle cx="48" cy="48" r="40" className="stroke-slate-100 dark:stroke-[#1C3540]" strokeWidth="6" fill="transparent" />
                            <motion.circle
                                initial={{ strokeDasharray: "251 251", strokeDashoffset: 251 }}
                                animate={{
                                    strokeDashoffset: 251 - (251 * ((() => {
                                        const u = JSON.parse(localStorage.getItem('user') || '{}');
                                        let score = 0;
                                        if (u.fullName) score += 20;
                                        if (u.email) score += 20;
                                        if (u.mobile) score += 20;
                                        if (u.city || u.address) score += 20;
                                        if (u.profileImage) score += 20;
                                        return score / 100;
                                    })()))
                                }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                cx="48" cy="48" r="40"
                                className="stroke-[#ED6E3F]"
                                strokeWidth="6"
                                fill="transparent"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-bold text-[#015A62] dark:text-white">{(() => {
                                const u = JSON.parse(localStorage.getItem('user') || '{}');
                                let score = 0;
                                if (u.fullName) score += 20;
                                if (u.email) score += 20;
                                if (u.mobile) score += 20;
                                if (u.city || u.address) score += 20;
                                if (u.profileImage) score += 20;
                                return score;
                            })()}%</span>
                        </div>
                    </div>
                </div>

                {/* Premium Support / Promo */}
                <div className="bg-[#015A62] rounded-2xl p-5 text-white relative overflow-hidden shadow-lg group cursor-pointer">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#ED6E3F]/30 rounded-full blur-[60px] translate-x-1/3 -translate-y-1/3"></div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Star size={14} className="text-[#ED6E3F] fill-[#ED6E3F]" />
                                    <span className="text-[#ED6E3F] text-[10px] font-bold uppercase tracking-wider">Premium Plan</span>
                                </div>
                                <h3 className="text-xl font-bold">Priority Support</h3>
                            </div>
                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                                <Headset size={18} className="text-white" />
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-white/60 text-[10px] max-w-[70%]">Get your queries resolved instantly with our dedicated relationship managers.</p>
                            <button className="bg-[#ED6E3F] text-white p-1.5 rounded-lg hover:bg-[#A57753] transition shadow-lg">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Digital Document Wallet Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white">Digital Document Wallet</h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Securely store and access your essential documents.</p>
                    </div>
                    <button className="text-[#ED6E3F] text-xs font-bold hover:underline">View All</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Identity Card Component */}
                    {[
                        { title: 'Aadhaar Card', sub: 'Unique Identification Authority', color: 'bg-red-50 text-red-600', border: 'border-red-100', icon: 'Fingerprint' },
                        { title: 'PAN Card', sub: 'Income Tax Department', color: 'bg-blue-50 text-blue-600', border: 'border-blue-100', icon: 'CreditCard' },
                        { title: 'Driving License', sub: 'Ministry of Road Transport', color: 'bg-green-50 text-green-600', border: 'border-green-100', icon: 'Car' },
                        { title: 'Voter ID', sub: 'Election Commission of India', color: 'bg-orange-50 text-orange-600', border: 'border-orange-100', icon: 'Vote' },
                    ].map((item, idx) => (
                        <div key={idx} className={`bg-white dark:bg-[#043E52] p-4 rounded-2xl border ${item.border} dark:border-[#2A4550] shadow-sm hover:shadow-md transition-all cursor-pointer group`}>
                            <div className="flex justify-between items-start mb-3">
                                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                                    {/* Simple Text Icon Fallback since generic icon logic is complex here without imports */}
                                    {idx === 0 ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg> :
                                        idx === 1 ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> :
                                            idx === 2 ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg> :
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                </div>
                                <span className="bg-gray-100 dark:bg-black/20 text-gray-500 text-[9px] font-bold px-1.5 py-0.5 rounded">ADD</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white text-sm">{item.title}</h4>
                                <p className="text-[9px] text-slate-400 font-medium group-hover:text-[#ED6E3F] transition-colors">{item.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};



export default ClientHome;
