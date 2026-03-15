
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, FileText, Users, DollarSign, Settings,
    MessageSquare, LogOut, Menu, X, Sun, Moon, Bell, CheckCircle, Upload, Crown, ChevronRight, Briefcase, IndianRupee
} from 'lucide-react';
import { getAgentApplications, getNotifications, markNotificationRead } from '../../api';

// Import Views
import AgentOverview from './views/AgentOverview';
import AgentApplications from './views/AgentApplications';
import AgentClients from './views/AgentClients';
import AgentEarnings from './views/AgentEarnings';
import AgentSettings from './views/AgentSettings';
import AgentSupport from './views/AgentSupport';
import AgentNewApplication from './views/AgentNewApplication';

const AgentDashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
    const [tasks, setTasks] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ walletBalance: 0, totalEarnings: 0, pending: 0 });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    // KYC Modal State
    const [showKycModal, setShowKycModal] = useState(false);
    const [kycData, setKycData] = useState({ panNumber: '', aadhaarNumber: '' });
    const [kycFiles, setKycFiles] = useState({ pan: null, aadhaar: null });
    const [isKycSubmitting, setIsKycSubmitting] = useState(false);

    // Sidebar Configuration Grouped by Section
    const sidebarConfig = [
        {
            section: 'MAIN MENU',
            items: [
                { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'create_app', label: 'Create Application', icon: Upload },
                { id: 'applications', label: 'My Applications', icon: FileText },
                { id: 'notifications', label: 'Notifications', icon: Bell },
            ]
        },
        {
            section: 'BUSINESS',
            items: [
                { id: 'clients', label: 'Active Clients', icon: Users },
                { id: 'earnings', label: 'Earnings & Payouts', icon: IndianRupee },
            ]
        },
        {
            section: 'ACCOUNT',
            items: [
                { id: 'settings', label: 'Profile Settings', icon: Settings },
                { id: 'support', label: 'Help & Support', icon: MessageSquare },
            ]
        }
    ];

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appData, notifData] = await Promise.all([
                    getAgentApplications(user.id),
                    getNotifications(user.email)
                ]);
                setTasks(appData || []);
                setNotifications(notifData || []);

                // Mock Stats Calculation
                const earnings = (appData || []).filter(t => t.status === 'COMPLETED').length * 500;
                setStats({
                    walletBalance: earnings,
                    totalEarnings: earnings,
                    pending: (appData || []).filter(t => t.status !== 'COMPLETED').length
                });
            } catch (error) {
                console.error("Failed to fetch agent data", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user.id) {
            fetchData();
            const interval = setInterval(fetchData, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }

        if (!user.kycStatus || user.kycStatus === 'PENDING' || user.kycStatus === 'REJECTED') {
            if (user.kycStatus === 'REJECTED') setShowKycModal(true);
        }
    }, [user.id, user.email]);

    // Theme Toggle
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    const handleKycSubmit = async (e) => {
        e.preventDefault();
        setIsKycSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            const updatedUser = { ...user, kycStatus: 'SUBMITTED' };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsKycSubmitting(false);
            setShowKycModal(false);
            alert("KYC Submitted for Review!");
        }, 1500);
    };

    const SidebarItem = ({ icon: Icon, label, id }) => {
        const isActive = activeTab === id;
        return (
            <div className="mb-0.5 px-4">
                <button
                    onClick={() => { setActiveTab(id); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                    className={`
                        w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group text-left relative
                        ${isActive
                            ? 'bg-[#ED6E3F] text-white shadow-lg shadow-[#ED6E3F]/20'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}
                    `}
                >
                    <div className="flex items-center gap-3">
                        <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
                        <span className="text-sm font-medium">{label}</span>
                    </div>
                    {isActive && <ChevronRight size={14} className="text-white/80" />}
                </button>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-[#F3F4F6] dark:bg-[#0D1C22] font-[Roboto,sans-serif] overflow-hidden transition-colors duration-200 text-slate-800 dark:text-slate-200">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Sidebar */}
            <AnimatePresence>
                {(isSidebarOpen || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#043E52] z-50 flex flex-col shadow-xl md:shadow-md border-r border-slate-100 dark:border-[#1C3540] ${isSidebarOpen ? 'block' : 'hidden md:flex'}`}
                    >
                        <div className="h-48 flex items-center px-4 border-b border-slate-100 dark:border-[#1C3540] justify-center relative">
                            <div className="flex flex-col items-center gap-1">
                                <img src="/logo.png" alt="ShineFiling" className="h-32 w-auto object-contain" />
                                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white mt-1">Agent<span className="text-[#ED6E3F]">Portal</span></span>
                            </div>
                            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute right-4 text-slate-400 top-4"><X size={20} /></button>
                        </div>

                        <div className="flex-1 py-6 overflow-y-auto section-wrapper no-scrollbar">
                            {sidebarConfig.map((group, index) => (
                                <div key={index} className="mb-6">
                                    <div className="px-8 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{group.section}</div>
                                    {group.items.map(item => <SidebarItem key={item.id} {...item} />)}
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-slate-100 dark:border-[#1C3540]">
                            <div className="bg-slate-50 dark:bg-[#1C3540] rounded-xl p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#ED6E3F]/10 flex items-center justify-center text-[#ED6E3F]">
                                    <Briefcase size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.fullName || 'Partner'}</p>
                                    <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Active Status
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Overlay */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <div className="h-16 bg-white dark:bg-[#043E52] border-b border-slate-200 dark:border-[#1C3540] flex items-center justify-between px-6 z-30 sticky top-0 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-slate-500 dark:text-slate-400"><Menu size={24} /></button>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-white hidden md:block capitalize">
                            {sidebarConfig.flatMap(g => g.items).find(i => i.id === activeTab)?.label || 'Dashboard'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleDarkMode} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1C3540] rounded-full transition-colors">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
                        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1C3540] rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#043E52]"></span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>

                        <button onClick={onLogout} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors text-sm font-bold group">
                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto scroll-smooth bg-[#F3F4F6] dark:bg-[#0D1C22]">
                    <div className="max-w-7xl mx-auto pb-20 md:pb-0">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                {activeTab === 'notifications' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white font-roboto">Notifications Center</h2>
                                            {notifications.some(n => !n.read) && <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full">New Alerts</span>}
                                        </div>

                                        <div className="space-y-4">
                                            {notifications.length > 0 ? (
                                                notifications.map(n => (
                                                    <div key={n.id} className={`p-5 rounded-3xl border transition-all duration-300 ${n.read ? 'bg-white/40 dark:bg-slate-900/10 border-slate-100 dark:border-slate-800 opacity-80' : 'bg-white dark:bg-[#043E52] border-[#ED6E3F]/30 shadow-lg shadow-orange-500/5'}`}>
                                                        <div className="flex items-center gap-5">
                                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${n.type === 'KYC_STATUS' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500' : 'bg-orange-50 dark:bg-orange-950/40 text-[#ED6E3F]'}`}>
                                                                {n.type === 'KYC_STATUS' ? <Crown size={22} /> : <Bell size={22} />}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-start">
                                                                    <p className={`text-base font-bold ${n.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>{n.title}</p>
                                                                    <span className="text-[10px] font-bold text-slate-400 font-mono">{new Date(n.createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                                                            </div>
                                                            {!n.read && (
                                                                <button
                                                                    onClick={async () => {
                                                                        await markNotificationRead(n.id);
                                                                        // Force local refresh without full poll if possible, but poll is safer
                                                                        const updated = await getNotifications(user.email);
                                                                        setNotifications(updated || []);
                                                                    }}
                                                                    className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-[#ED6E3F] hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all"
                                                                    title="Mark as read"
                                                                >
                                                                    <CheckCircle size={18} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="bg-white dark:bg-[#043E52] rounded-[40px] p-24 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                                                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-8 opacity-20">
                                                        <Bell size={48} className="text-slate-400" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">All Clear!</h3>
                                                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">You've caught up with everything. New updates will appear here as soon as they arrive.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'overview' && <AgentOverview stats={stats} tasks={tasks} user={user} setActiveTab={setActiveTab} />}
                                {activeTab === 'create_app' && <AgentNewApplication setActiveTab={setActiveTab} />}
                                {activeTab === 'applications' && <AgentApplications tasks={tasks} loading={isLoading} />}
                                {activeTab === 'clients' && <AgentClients tasks={tasks} />}
                                {activeTab === 'earnings' && <AgentEarnings stats={stats} user={user} />}
                                {activeTab === 'settings' && <AgentSettings user={user} />}
                                {activeTab === 'support' && <AgentSupport user={user} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* KYC Modal */}
            <AnimatePresence>
                {showKycModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white dark:bg-[#043E52] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-[#1C3540]">
                            <div className="p-6 border-b border-slate-100 dark:border-[#1C3540] flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-[#043E52] dark:text-white flex items-center gap-2"><CheckCircle className="text-[#ED6E3F]" /> Agent Verification</h2>
                                {!['PENDING'].includes(user?.kycStatus) && <button onClick={() => setShowKycModal(false)}><X className="text-slate-400 hover:text-rose-500" /></button>}
                            </div>
                            <form onSubmit={handleKycSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">PAN Number</label><input value={kycData.panNumber} onChange={e => setKycData({ ...kycData, panNumber: e.target.value.toUpperCase() })} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#1C3540] border-none focus:ring-2 focus:ring-[#ED6E3F] dark:text-white outline-none" required placeholder="ABCDE1234F" /></div>
                                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Aadhaar Number</label><input value={kycData.aadhaarNumber} onChange={e => setKycData({ ...kycData, aadhaarNumber: e.target.value })} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#1C3540] border-none focus:ring-2 focus:ring-[#ED6E3F] dark:text-white outline-none" required placeholder="1234 5678 9012" /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['pan', 'aadhaar'].map(type => (
                                        <div key={type} className="border-2 border-dashed border-slate-200 dark:border-[#1C3540] rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-[#1C3540] transition relative group">
                                            <input type="file" accept="image/*,application/pdf" onChange={e => setKycFiles({ ...kycFiles, [type]: e.target.files[0] })} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                            <Upload className={`mx-auto mb-2 ${kycFiles[type] ? 'text-emerald-500' : 'text-slate-400'}`} size={32} />
                                            <p className="text-xs font-bold text-slate-500 uppercase">{kycFiles[type]?.name || `Upload ${type}`}</p>
                                        </div>
                                    ))}
                                </div>
                                <button type="submit" disabled={isKycSubmitting} className="w-full py-3.5 bg-[#043E52] dark:bg-[#ED6E3F] text-white rounded-xl font-bold hover:shadow-lg transition text-sm uppercase tracking-wide">{isKycSubmitting ? 'Submitting...' : 'Submit Verification'}</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AgentDashboard;
