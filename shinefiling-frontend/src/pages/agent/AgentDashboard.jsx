
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Briefcase, Bell, LogOut, Menu, X, Sun, Moon, Settings, MessageSquare, ChevronRight, Zap, Shield, Lock, ShieldCheck, Clock, CheckCircle, Wallet, Upload, FileText, IndianRupee, Crown
} from 'lucide-react';
import {
    getAgentApplications, getNotifications, markNotificationRead, markAllNotificationsRead, getUserById
} from '../../api';

// Import Views
import AgentOverview from './views/AgentOverview';
import AgentApplications from './views/AgentApplications';
import AgentClients from './views/AgentClients';
import AgentEarnings from './views/AgentEarnings';
import AgentSettings from './views/AgentSettings';
import AgentSupport from './views/AgentSupport';
import AgentNewApplication from './views/AgentNewApplication';
import AgentKyc from './views/AgentKyc';

const AgentDashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    // Data States
    const [tasks, setTasks] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ walletBalance: 0, totalEarnings: 0, pending: 0 });

    // Sound & Notification Tracking
    const prevTotalCount = useRef(0);
    const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3'));

    const location = useLocation();

    // Handle URL Query Params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) setActiveTab(tab);
    }, [location]);

    // Handle Window Resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setIsSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Sidebar Configuration
    const sidebarConfig = [
        {
            section: 'MAIN MENU',
            items: [
                { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'kyc', label: 'KYC & Compliance', icon: ShieldCheck },
                { id: 'create_app', label: 'Create Application', icon: Upload, protected: true },
                { id: 'applications', label: 'My Applications', icon: FileText, protected: true },
                { id: 'notifications', label: 'Notifications', icon: Bell },
            ]
        },
        {
            section: 'PARTNER BUSINESS',
            items: [
                { id: 'clients', label: 'Active Clients', icon: Users, protected: true },
                { id: 'earnings', label: 'Earnings & Payouts', icon: IndianRupee, protected: true },
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

    const isKycVerified = user.kycStatus === 'VERIFIED';
    const isKycSubmitted = user.kycStatus === 'SUBMITTED';
    const isKycRejected = user.kycStatus === 'REJECTED';

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

    const playNotificationSound = () => {
        try {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.warn("Autoplay blocked", e));
        } catch (err) {
            console.error("Audio playback error", err);
        }
    };

    const fetchData = async () => {
        if (!user.id) return;
        try {
            const [appData, notifData, latestUser] = await Promise.all([
                getAgentApplications(user.id),
                getNotifications(user.email),
                getUserById(user.id)
            ]);

            const currentTasks = appData || [];
            const currentNotifs = notifData || [];

            // Trigger sound if unread count increased
            const unreadCount = currentNotifs.filter(n => !n.read).length;
            if (unreadCount > prevTotalCount.current) {
                playNotificationSound();
            }
            prevTotalCount.current = unreadCount;

            setTasks(currentTasks);
            setNotifications(currentNotifs);
            
            if (latestUser) {
                setUser(latestUser);
                localStorage.setItem('user', JSON.stringify(latestUser));
            }

            // Stats Calculation
            const completed = currentTasks.filter(t => t.status === 'COMPLETED');
            const totalEarnings = completed.reduce((sum, t) => sum + (Number(t.commission) || 500), 0);
            setStats({
                walletBalance: latestUser.walletBalance || 0,
                totalEarnings: totalEarnings,
                pending: currentTasks.filter(t => t.status !== 'COMPLETED').length
            });
        } catch (error) {
            console.error("Failed to fetch agent data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead(user.email);
            fetchData();
        } catch (e) {
            console.error("Failed to mark all as read", e);
        }
    };

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    const SidebarContent = () => (
        <>
            <div className="h-48 flex flex-col items-center px-4 border-b border-slate-100 dark:border-[#1C3540] justify-center relative">
                <div className="flex flex-col items-center gap-1 group">
                    <img src="/logo.png" alt="ShineFiling" className="h-32 w-auto object-contain transition-transform group-hover:scale-105 duration-300" />
                    <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white mt-1 uppercase">Partner<span className="text-[#ED6E3F]">Portal</span></span>
                </div>
                {isMobile && <button onClick={() => setIsSidebarOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>}
            </div>

            <div className="flex-1 py-6 overflow-y-auto no-scrollbar">
                {sidebarConfig.map((group, index) => (
                    <div key={index} className="mb-6">
                        <div className="px-8 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{group.section}</div>
                        {group.items.map(item => {
                            const isActive = activeTab === item.id;
                            return (
                                <div key={item.id} className="mb-0.5 px-4 text-left">
                                    <button
                                        onClick={() => { setActiveTab(item.id); if (isMobile) setIsSidebarOpen(false); }}
                                        className={`
                                            w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group text-left relative
                                            ${isActive
                                                ? 'bg-[#ED6E3F] text-white shadow-lg shadow-[#ED6E3F]/20 font-bold'
                                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <item.icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
                                                {item.protected && !isKycVerified && (
                                                    <div className="absolute -top-1 -right-1 text-rose-500">
                                                        <Lock size={10} strokeWidth={3} />
                                                    </div>
                                                )}
                                            </div>
                                            <span className={`text-sm tracking-tight ${item.protected && !isKycVerified ? 'opacity-60' : ''}`}>{item.label}</span>
                                        </div>
                                        {isActive && <ChevronRight size={14} className="text-white/80" />}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-[#1C3540]">
                <div className="bg-slate-50 dark:bg-[#1C3540] rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ED6E3F]/10 flex items-center justify-center text-[#ED6E3F]">
                        <Briefcase size={18} />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.fullName || 'Partner'}</p>
                        <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Partner Status
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-[#F3F4F6] dark:bg-[#0D1C22] font-roboto overflow-hidden transition-colors duration-200 text-slate-800 dark:text-slate-200">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .font-roboto { font-family: 'Roboto', sans-serif; }
            `}</style>

            {/* Desktop Sidebar */}
            {!isMobile && (
                <div className="w-64 bg-white dark:bg-[#043E52] z-50 flex flex-col shadow-md border-r border-slate-100 dark:border-[#1C3540]">
                    <SidebarContent />
                </div>
            )}

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobile && isSidebarOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" />
                        <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#043E52] z-50 flex flex-col shadow-2xl transition-colors duration-300">
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-[#043E52] border-b border-slate-200 dark:border-[#1C3540] flex items-center justify-between px-6 z-30 sticky top-0 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1C3540] rounded-lg">
                            <Menu size={24} />
                        </button>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-white hidden sm:block capitalize">
                            {sidebarConfig.flatMap(g => g.items).find(i => i.id === activeTab)?.label || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Status Pin */}
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                            <ShieldCheck size={14} className={isKycVerified ? 'text-emerald-500' : 'text-amber-500'} />
                            <span className="text-[10px] font-black tracking-tight uppercase">
                                {user.kycStatus || 'UNVERIFIED'}
                            </span>
                        </div>

                        {/* Wallet Balance Header */}
                        <button
                            onClick={() => isKycVerified ? setActiveTab('earnings') : setActiveTab('kyc')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 ${isKycVerified ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800'}`}
                        >
                            <Wallet size={16} />
                            <div className="flex flex-col items-start leading-none pr-1">
                                <span className="text-[9px] font-bold uppercase tracking-wider mb-0.5 opacity-70">Balance</span>
                                <span className="text-[12px] font-black tracking-tight">₹{Number(stats.walletBalance).toLocaleString()}</span>
                            </div>
                        </button>

                        {/* Notification Bell with Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className={`p-2 rounded-full transition-all duration-300 ${isNotificationsOpen ? 'bg-orange-50 dark:bg-orange-950/20 text-[#ED6E3F]' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1C3540]'}`}
                            >
                                <Bell size={20} />
                                {notifications.filter(n => !n.read).length > 0 && (
                                    <span className="absolute top-1.5 right-2 w-4 h-4 bg-red-500 text-white flex items-center justify-center rounded-full text-[8px] font-bold border-2 border-white dark:border-[#043E52]">
                                        {notifications.filter(n => !n.read).length}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {isNotificationsOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
                                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#043E52] rounded-2xl shadow-2xl border border-slate-100 dark:border-[#1C3540] z-50 overflow-hidden">
                                            <div className="p-4 px-6 border-b border-slate-100 dark:border-[#1C3540] flex justify-between items-center">
                                                <h4 className="font-bold text-slate-800 dark:text-white">Notifications</h4>
                                                <button onClick={handleMarkAllRead} className="text-[10px] font-bold text-[#ED6E3F] hover:underline uppercase tracking-widest">Mark All Read</button>
                                            </div>
                                            <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                                                {notifications.length > 0 ? (
                                                    notifications.map(n => (
                                                        <div key={n.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors flex items-start gap-3 border-b border-slate-50 last:border-0 dark:border-slate-800/40">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.type === 'KYC_STATUS' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500' : 'bg-orange-50 dark:bg-orange-950/20 text-[#ED6E3F]'}`}>
                                                                {n.type === 'KYC_STATUS' ? <Crown size={18} /> : <Zap size={18} />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-sm font-bold ${n.read ? 'text-slate-600 dark:text-slate-300' : 'text-slate-800 dark:text-white'}`}>{n.title}</p>
                                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{n.message}</p>
                                                            </div>
                                                            {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-[#ED6E3F] mt-2"></div>}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-10 text-center text-slate-400 text-xs font-medium">No notifications yet</div>
                                                )}
                                            </div>
                                            <button onClick={() => { setActiveTab('notifications'); setIsNotificationsOpen(false); }} className="w-full py-3 bg-slate-50 dark:bg-slate-800/40 text-[10px] font-bold uppercase text-[#ED6E3F] tracking-widest hover:bg-orange-50 dark:hover:bg-orange-950/10">View All Center</button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <button onClick={toggleDarkMode} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1C3540] rounded-full transition-colors">
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>

                        {/* Profile Section */}
                        <div className="flex items-center gap-3 pl-1 relative group">
                            <button className="w-9 h-9 rounded-full bg-[#ED6E3F] text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-transparent group-hover:ring-[#ED6E3F] ring-offset-2 dark:ring-offset-[#043E52] transition-all">
                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'P'}
                            </button>
                            <div className="absolute right-0 top-full mt-3 w-48 bg-white dark:bg-[#043E52] p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl border border-slate-100 dark:border-[#1C3540] rounded-xl z-50">
                                <button onClick={() => setActiveTab('settings')} className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold transition-all"><Settings size={14} className="text-[#ED6E3F]" /> Profile</button>
                                <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg text-xs font-bold transition-all"><LogOut size={14} /> Sign Out</button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Body */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#F3F4F6] dark:bg-[#0D1C22]">
                    <div className="max-w-7xl mx-auto pb-20 md:pb-0">
                        {/* KYC Warning Banner */}
                        {user.kycStatus !== 'VERIFIED' && activeTab !== 'kyc' && (
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={`mb-6 p-4 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 text-white ${isKycSubmitted ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : isKycRejected ? 'bg-gradient-to-r from-rose-500 to-red-600' : 'bg-gradient-to-r from-[#ED6E3F] to-[#d55f34]'}`}>
                                <div className="flex items-center gap-3">
                                    <Shield size={24} className="flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-base leading-tight">Identity Verification Required</p>
                                        <p className="text-white/80 text-xs mt-1">
                                            {isKycSubmitted ? 'Verification is under review. This usually takes 24 hours.' : isKycRejected ? 'There was an issue with your documents. Please re-submit.' : 'Complete your KYC to unlock all business features and payouts.'}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setActiveTab('kyc')} className="px-6 py-2 bg-white text-[#ED6E3F] rounded-lg font-bold text-sm shadow-sm hover:scale-105 transition-transform">
                                    {isKycSubmitted ? 'Check Progress' : 'Verify Now'}
                                </button>
                            </motion.div>
                        )}

                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                {sidebarConfig.flatMap(g => g.items).find(i => i.id === activeTab)?.protected && !isKycVerified ? (
                                    <div className="bg-white dark:bg-[#043E52] rounded-3xl p-12 text-center max-w-2xl mx-auto border border-slate-100 dark:border-[#1C3540] shadow-xl mt-10">
                                        <div className="w-20 h-20 bg-orange-50 dark:bg-[#1C3540] rounded-full flex items-center justify-center mx-auto mb-6 text-[#ED6E3F]">
                                            <Lock size={32} />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tighter">Feature Restricted</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-8 font-bold text-sm leading-relaxed max-w-sm mx-auto">
                                            Your account must be KYC verified to access this module. Please complete your identity verification to start doing business as a Partner.
                                        </p>
                                        <button onClick={() => setActiveTab('kyc')} className="px-8 py-3 bg-[#ED6E3F] text-white rounded-xl font-bold shadow-lg hover:bg-[#d55f34] transition-all flex items-center gap-2 mx-auto">
                                            <ShieldCheck size={18} /> Verify KYC Now
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {activeTab === 'overview' && <AgentOverview stats={stats} tasks={tasks} user={user} setActiveTab={setActiveTab} />}
                                        {activeTab === 'kyc' && <AgentKyc user={user} onComplete={() => { fetchData(); setActiveTab('overview'); }} />}
                                        {activeTab === 'create_app' && <AgentNewApplication setActiveTab={setActiveTab} />}
                                        {activeTab === 'applications' && <AgentApplications tasks={tasks} loading={isLoading} />}
                                        {activeTab === 'clients' && <AgentClients tasks={tasks} />}
                                        {activeTab === 'earnings' && <AgentEarnings stats={stats} user={user} />}
                                        {activeTab === 'settings' && <AgentSettings user={user} />}
                                        {activeTab === 'support' && <AgentSupport user={user} />}
                                        {activeTab === 'notifications' && (
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center bg-white dark:bg-[#043E52] p-6 rounded-2xl border border-slate-100 dark:border-[#1C3540] shadow-sm">
                                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Notification History</h2>
                                                    <button onClick={handleMarkAllRead} className="text-xs font-bold text-slate-400 hover:text-[#ED6E3F] uppercase tracking-widest">Mark All as Read</button>
                                                </div>
                                                <div className="space-y-3">
                                                    {notifications.map(n => (
                                                        <div key={n.id} className={`p-5 rounded-2xl border transition-all ${n.read ? 'bg-white/40 dark:bg-slate-900/10 border-slate-100 dark:border-slate-800 opacity-80' : 'bg-white dark:bg-[#043E52] border-[#ED6E3F]/30 shadow-lg'}`}>
                                                            <div className="flex items-center gap-5">
                                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${n.type === 'KYC_STATUS' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500' : 'bg-orange-50 dark:bg-orange-950/40 text-[#ED6E3F]'}`}>
                                                                    {n.type === 'KYC_STATUS' ? <Crown size={22} /> : <Zap size={22} />}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex justify-between items-start">
                                                                        <p className={`text-base font-bold ${n.read ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>{n.title}</p>
                                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(n.createdAt).toLocaleDateString()}</span>
                                                                    </div>
                                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                                                                </div>
                                                                {!n.read && (
                                                                    <button onClick={async () => { await markNotificationRead(n.id); fetchData(); }} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-[#ED6E3F] transition-all">
                                                                        <CheckCircle size={18} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {notifications.length === 0 && (
                                                        <div className="bg-white dark:bg-[#043E52] rounded-3xl p-24 text-center border border-slate-100 dark:border-[#1C3540] shadow-sm">
                                                            <Bell size={48} className="text-slate-200 mx-auto mb-6" />
                                                            <h3 className="text-xl font-bold dark:text-white">Empty Inbox</h3>
                                                            <p className="text-slate-400 text-sm mt-1">New activity will be notified here.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AgentDashboard;
