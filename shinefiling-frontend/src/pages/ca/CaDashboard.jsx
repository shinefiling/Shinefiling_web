
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Briefcase, Bell, LogOut, Menu, X, Sun, Moon, Settings, MessageSquare, ChevronRight, Zap, Shield, Lock, ShieldCheck, Clock, CheckCircle, Wallet
} from 'lucide-react';
import {
    getCaRequests, respondToBoundAmount, getCaEmployees, createEmployee, assignEmployeeToRequest, getUserById,
    getNotifications, markNotificationRead, markAllNotificationsRead
} from '../../api';

import CaOverview from './views/CaOverview';
import CaWorks from './views/CaWorks';
import CaEmployees from './views/CaEmployees';

import CaWallet from './views/CaWallet';
import CaProfile from './views/CaProfile';
import CaSupport from './views/CaSupport';
import CaOpportunities from './views/CaOpportunities';
import CaKyc from './views/CaKyc';

const CaDashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Data States
    const [requests, setRequests] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sound & Notification Tracking
    const prevTotalCount = useRef(0);
    const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3'));

    const location = useLocation();

    // Handle URL Query Params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
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

    // Sidebar Config
    const sidebarConfig = [
        {
            section: 'MAIN MENU',
            items: [
                { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, protected: true },
                { id: 'kyc', label: 'KYC & Compliance', icon: ShieldCheck },
                { id: 'opportunities', label: 'Marketplace', icon: Zap, protected: true },
                { id: 'works', label: 'My Works', icon: Briefcase, protected: true },
                { id: 'notifications', label: 'Notifications', icon: Bell },
            ]
        },
        {
            section: 'FINANCE & TEAM',
            items: [
                { id: 'wallet', label: 'Partner Wallet', icon: Wallet, protected: true },
                { id: 'employees', label: 'My Team', icon: Users, protected: true },
            ]
        },
        {
            section: 'ACCOUNT',
            items: [
                { id: 'profile', label: 'Profile Settings', icon: Settings },
                { id: 'support', label: 'Help & Support', icon: MessageSquare },
            ]
        }
    ];

    const isKycVerified = user.kycStatus === 'VERIFIED';
    const isKycSubmitted = user.kycStatus === 'SUBMITTED';
    const isKycRejected = user.kycStatus === 'REJECTED';
    const isKycNotStarted = user.kycStatus === 'PENDING' || !user.kycStatus;

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, []);

    const playNotificationSound = () => {
        try {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => {
                console.warn("Autoplay blocked: Sound will play after user interaction", e);
            });
        } catch (err) {
            console.error("Audio playback error", err);
        }
    };

    const fetchData = async () => {
        if (!user.id) return;
        try {
            const [reqs, emps, latestUser, notifs] = await Promise.all([
                getCaRequests(user.id),
                getCaEmployees(user.id),
                getUserById(user.id),
                getNotifications(user.email)
            ]);

            const currentReqs = reqs || [];
            const currentNotifs = notifs || [];

            // Calculate total unread/pending items
            const pendingReqsCount = currentReqs.filter(r => r.caApprovalStatus === 'PENDING_APPROVAL').length;
            const unreadNotifsCount = currentNotifs.filter(n => !n.isRead).length;
            const total = pendingReqsCount + unreadNotifsCount;

            // Trigger sound if count increased
            if (total > prevTotalCount.current) {
                playNotificationSound();
            }
            prevTotalCount.current = total;

            setRequests(currentReqs);
            setEmployees(emps || []);
            setNotifications(currentNotifs);
            if (latestUser) {
                setUser(latestUser);
                localStorage.setItem('user', JSON.stringify(latestUser));
            }
        } catch (e) {
            console.error("Failed to fetch CA data", e);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead(user.email);
            fetchData();
        } catch (e) {
            console.error("Failed to mark all as read", e);
        }
    };

    const handleAcceptRequest = async (req) => {
        if (window.confirm(`Accept this request for ₹${req.boundAmount}?`)) {
            await respondToBoundAmount(req.id, 'ACCEPTED', 'CA Accepted the request');
            fetchData();
        }
    };

    const handleRejectRequest = async (req) => {
        const reason = prompt("Enter reason for rejection:");
        if (reason) {
            await respondToBoundAmount(req.id, 'REJECTED', reason);
            fetchData();
        }
    };

    const handleAssignEmployee = async (reqId, empId) => {
        if (!empId) return;
        try {
            await assignEmployeeToRequest(reqId, empId);
            fetchData();
        } catch (e) {
            alert(e.message);
        }
    };

    const SidebarContent = () => (
        <>
            {/* Logo Section */}
            <div className="p-8 pb-4 flex flex-col items-center relative">
                <img src="/logo.png" alt="ShineFiling" className="h-32 w-auto object-contain mb-2" />
                <div className="h-px w-12 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute right-4 top-8 p-2 text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            {/* Navigation Section */}
            <div className="flex-1 overflow-y-auto py-4 space-y-6 no-scrollbar">
                {sidebarConfig.map((group, idx) => (
                    <div key={idx}>
                        <div className="px-6 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{group.section}</div>
                        <div className="space-y-0.5">
                            {group.items.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                                    className={`
                                        w-full flex items-center gap-3 px-6 py-2.5 transition-all duration-200 group text-left relative
                                        ${activeTab === item.id
                                            ? 'text-slate-800 dark:text-white font-bold'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}
                                    `}
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeTab === item.id ? 'bg-[#F97316] scale-125' : 'bg-transparent'}`}></div>
                                    <div className="relative">
                                        <item.icon size={22} className={activeTab === item.id ? 'text-[#F97316]' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
                                        {item.protected && !isKycVerified && (
                                            <div className="absolute -top-1 -right-1 text-rose-500">
                                                <Lock size={10} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                    <span className={`text-sm font-bold tracking-tight ${item.protected && !isKycVerified ? 'opacity-60' : ''}`}>{item.label}</span>
                                    {activeTab === item.id && <ChevronRight size={14} className="ml-auto text-orange-400/50" />}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );

    return (
        <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 font-roboto text-slate-800 dark:text-slate-200 transition-colors duration-300`}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .font-roboto { font-family: 'Roboto', sans-serif; }
                .font-jakarta { font-family: 'Roboto', sans-serif; }
                .font-outfit { font-family: 'Roboto', sans-serif; }
            `}</style>
            {/* Desktop Sidebar (Static) */}
            {!isMobile && (
                <div className="w-64 bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200 z-50 flex flex-col shadow-md border-r border-slate-100 transition-colors duration-300">
                    <SidebarContent />
                </div>
            )}

            {/* Mobile Sidebar (Overlay) */}
            <AnimatePresence>
                {isMobile && isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 z-50 flex flex-col shadow-2xl transition-colors duration-300"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Actions */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 z-30 sticky top-0 transition-colors duration-200">
                    <div className="flex items-center gap-4 min-w-[200px]">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white hidden sm:block">
                            {activeTab === 'wallet' ? 'Partner Wallet' : (sidebarConfig.flatMap(g => g.items).find(i => i.id === activeTab)?.label || 'Dashboard')}
                        </h2>
                    </div>

                    {/* Compact Status for Mobile/Tablet */}
                    <div className="lg:hidden flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                    </div>



                    <div className="flex items-center gap-2.5 ml-auto pr-2 relative">
                        {/* Account Status Pill - Moved here to prevent overlap */}
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl transition-all duration-300">
                            <ShieldCheck size={14} className={user.kycStatus === 'VERIFIED' ? 'text-emerald-500' : 'text-amber-500'} />
                            <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hidden xl:block">Account Status:</span>
                                <span className={`text-[10px] font-black tracking-tight uppercase ${user.kycStatus === 'VERIFIED' ? 'text-emerald-500' : user.kycStatus === 'PENDING' ? 'text-amber-500' : 'text-rose-500'}`}>
                                    {user.kycStatus || 'UNVERIFIED'}
                                </span>
                            </div>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className={`relative p-2 rounded-full transition-all duration-300 ${isNotificationsOpen ? 'bg-orange-50 dark:bg-orange-950/20 text-[#F97316]' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            >
                                <Bell size={20} />
                                {(() => {
                                    const pendingReqs = requests.filter(r => r.caApprovalStatus === 'PENDING_APPROVAL').length;
                                    const unreadNotifs = notifications.filter(n => !n.read).length;
                                    const total = pendingReqs + unreadNotifs;

                                    return total > 0 && (
                                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white flex items-center justify-center rounded-full text-[8px] font-bold border-2 border-white dark:border-slate-800 animate-pulse">
                                            {total}
                                        </span>
                                    );
                                })()}
                            </button>


                            <AnimatePresence>
                                {isNotificationsOpen && (
                                    <>
                                        {/* Backdrop for mobile to close when clicking outside */}
                                        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsNotificationsOpen(false)}></div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-3 w-80 sm:w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden font-roboto"
                                        >
                                            <div className="p-4 px-6 border-b border-slate-100 dark:border-slate-700">
                                                <h4 className="font-bold text-slate-800 dark:text-white text-lg">Notifications</h4>
                                            </div>

                                            <div className="max-h-[450px] overflow-y-auto no-scrollbar">
                                                {(() => {
                                                    const pendingReqs = requests.filter(r => r.caApprovalStatus === 'PENDING_APPROVAL');
                                                    const unreadNotifs = notifications.filter(n => !n.isRead);

                                                    if (pendingReqs.length === 0 && unreadNotifs.length === 0) {
                                                        return (
                                                            <div className="p-8 py-10 text-center">
                                                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No new notifications</p>
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
                                                            {/* Assignment Requests */}
                                                            {pendingReqs.map(req => (
                                                                <div key={req.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors group">
                                                                    <div className="flex gap-3">
                                                                        <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-[#F97316] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                                            <Zap size={20} />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex justify-between items-start mb-1">
                                                                                <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-widest">New Assignment</span>
                                                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                                                                                    <Clock size={10} /> {new Date(req.createdAt).toLocaleDateString()}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-sm font-bold text-slate-800 dark:text-white mb-0.5 truncate">{req.serviceName}</p>
                                                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 truncate">Client: {req.user?.fullName}</p>
                                                                            <div className="flex gap-2">
                                                                                <button onClick={() => { handleAcceptRequest(req); setIsNotificationsOpen(false); }} className="flex-1 py-1.5 bg-slate-800 dark:bg-[#F97316] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg">Accept</button>
                                                                                <button onClick={() => { handleRejectRequest(req); setIsNotificationsOpen(false); }} className="flex-1 py-1.5 bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-100 rounded-lg text-[10px] font-bold uppercase tracking-widest">Reject</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {/* System Notifications */}
                                                            {unreadNotifs.map(n => (
                                                                <div key={n.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors group flex items-start gap-3">
                                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.type === 'KYC_STATUS' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500' : 'bg-orange-50 dark:bg-orange-950/20 text-[#F97316]'}`}>
                                                                        {n.type === 'KYC_STATUS' ? <ShieldCheck size={20} /> : <Bell size={20} />}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex justify-between items-start mb-0.5">
                                                                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{n.title}</p>
                                                                            <button
                                                                                onClick={async (e) => {
                                                                                    e.stopPropagation();
                                                                                    await markNotificationRead(n.id);
                                                                                    fetchData();
                                                                                }}
                                                                                className="p-1 text-slate-300 hover:text-[#F97316]"
                                                                                title="Mark as read"
                                                                            >
                                                                                <CheckCircle size={14} />
                                                                            </button>
                                                                        </div>
                                                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{n.message}</p>
                                                                        <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-tight">{new Date(n.createdAt).toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            <div className="p-3 bg-slate-50/80 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-700">
                                                <button
                                                    onClick={() => { setActiveTab('notifications'); setIsNotificationsOpen(false); }}
                                                    className="w-full py-2.5 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#F97316] transition-colors text-[10px] font-bold uppercase tracking-widest"
                                                >
                                                    View All Notifications <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Wallet Quick Access */}
                        <button
                            onClick={() => isKycVerified ? setActiveTab('wallet') : null}
                            disabled={!isKycVerified}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300 group
                                ${activeTab === 'wallet' 
                                    ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/20' 
                                    : !isKycVerified
                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60 border border-slate-200 dark:border-slate-700'
                                        : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-100/50 dark:border-emerald-800/30'
                                }`}
                        >
                            <div className={`p-1 rounded-lg ${activeTab === 'wallet' ? 'bg-white/20' : !isKycVerified ? 'bg-slate-200 dark:bg-slate-700' : 'bg-emerald-100 dark:bg-emerald-900/50'}`}>
                                {isKycVerified ? (
                                    <Wallet size={16} className={activeTab === 'wallet' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'} />
                                ) : (
                                    <Lock size={16} className="text-slate-400" />
                                )}
                            </div>
                            <div className="flex flex-col items-start leading-none pr-1">
                                <span className={`text-[9px] font-bold uppercase tracking-wider mb-0.5 opacity-70`}>{isKycVerified ? 'Wallet' : 'Locked'}</span>
                                <span className="text-[12px] font-black tracking-tight">
                                    ₹{Number(user?.walletBalance || 0).toLocaleString()}
                                </span>
                            </div>
                        </button>

                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-colors"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Profile Section */}
                        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700 ml-2">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">{user.fullName || 'Partner'}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-1 tracking-tight">CA PARTNER</p>
                            </div>
                            <div className="relative group">
                                <button className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-orange-500/20 hover:scale-105 transition-all ring-2 ring-transparent hover:ring-orange-500 ring-offset-2 dark:ring-offset-slate-800 relative">
                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'C'}
                                    {/* Small KYC Badge */}
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 ${isKycVerified ? 'bg-emerald-500' : isKycSubmitted ? 'bg-blue-500' : 'bg-orange-500'
                                        } flex items-center justify-center`}>
                                        {isKycVerified ? <ShieldCheck size={8} className="text-white" /> : <Shield size={8} className="text-white" />}
                                    </div>
                                </button>
                                <div className="absolute right-0 top-full mt-3 w-56 premium-card p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl border border-slate-100 dark:border-slate-700 z-50">
                                    <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-700 mb-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{user.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <button onClick={() => setActiveTab('profile')} className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-all">
                                            <Settings size={14} className="text-orange-500" /> Profile Settings
                                        </button>
                                        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl text-xs font-bold transition-all">
                                            <LogOut size={14} /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Body */}
                <main className="flex-1 overflow-y-auto p-6 bg-[#F3F4F6] dark:bg-slate-900 relative scroll-smooth transition-colors duration-200">
                    <div className="max-w-[1600px] mx-auto">
                        {/* KYC Warning Banner */}
                        {user.kycStatus !== 'VERIFIED' && activeTab !== 'kyc' && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mb-6 p-4 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 text-white ${isKycSubmitted
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/20'
                                    : isKycRejected
                                        ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/20'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/20'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                        <Shield size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg leading-tight">
                                            {isKycSubmitted ? 'KYC Verification Under Review' : isKycRejected ? 'KYC Verification Rejected' : 'Complete Your KYC Verification'}
                                        </p>
                                        <p className="text-white/80 text-xs">
                                            {isKycSubmitted
                                                ? 'Our compliance team is verifying your documents. This usually takes 24-48 hours.'
                                                : isKycRejected
                                                    ? 'There was an issue with your documents. Please re-submit to activate your account.'
                                                    : 'Verify your personal and professional documents to start accepting requests from clients.'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveTab('kyc')}
                                    className="px-6 py-2.5 bg-white text-[#F97316] rounded-xl font-bold text-sm shadow-sm hover:scale-105 transition-transform"
                                >
                                    {isKycSubmitted ? 'Review Submission' : 'Verify Now'}
                                </button>
                            </motion.div>
                        )}

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'notifications' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight font-roboto">Recent Notifications</h2>
                                            <button
                                                onClick={handleMarkAllRead}
                                                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 uppercase tracking-widest"
                                            >
                                                Mark all as read
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {/* Order Notifications */}
                                            {requests.filter(r => r.caApprovalStatus === 'PENDING_APPROVAL').map(notif => (
                                                <div key={notif.id} className="p- group hover:border-[#F97316]/50 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-[#F97316] flex items-center justify-center">
                                                            <Zap size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800 dark:text-white">New Service Request: <span className="text-[#F97316]">{notif.serviceName}</span></p>
                                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Assigned by admin for client {notif.user?.fullName} • 1h ago</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setActiveTab('overview')}
                                                        className="px-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#F97316] hover:text-white transition-all shadow-sm"
                                                    >
                                                        View Task
                                                    </button>
                                                </div>
                                            ))}

                                            {/* System/KYC Notifications */}
                                            {notifications.map(n => (
                                                <div key={n.id} className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between transition-all ${n.isRead ? 'bg-slate-50/50 dark:bg-slate-900/10 border-slate-100 dark:border-slate-800 opacity-75' : 'bg-white dark:bg-slate-800 border-[#F97316]/30 shadow-orange-500/5'}`}>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${n.type === 'KYC_STATUS' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500' : 'bg-orange-50 dark:bg-orange-950/20 text-[#F97316]'}`}>
                                                            {n.type === 'KYC_STATUS' ? <ShieldCheck size={18} /> : <Bell size={18} />}
                                                        </div>
                                                        <div>
                                                            <p className={`text-sm font-bold ${n.read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-white'}`}>{n.title}</p>
                                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{n.message} • {new Date(n.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    {!n.isRead && (
                                                        <button
                                                            onClick={async () => {
                                                                await markNotificationRead(n.id);
                                                                fetchData();
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-[#F97316] transition-colors"
                                                            title="Mark as read"
                                                        >
                                                            <Clock size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}

                                            {requests.filter(r => r.caApprovalStatus === 'PENDING_APPROVAL').length === 0 && notifications.length === 0 && (
                                                <div className="bg-white dark:bg-slate-800 rounded-3xl p-20 text-center border border-slate-100 dark:border-slate-700 shadow-sm">
                                                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6 opacity-30">
                                                        <Bell size={40} className="text-slate-400" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">You're up to date!</h3>
                                                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">No new notifications from the admin yet. Check back later for new client requests.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'kyc' && <CaKyc user={user} onComplete={() => { fetchData(); setActiveTab('overview'); }} />}

                                {/* Protected View Logic */}
                                {sidebarConfig.flatMap(g => g.items).find(i => i.id === activeTab)?.protected && !isKycVerified ? (
                                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center max-w-2xl mx-auto border border-slate-100 dark:border-slate-700 shadow-xl">
                                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 ${isKycSubmitted
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 border-blue-100 dark:border-blue-900/30'
                                            : 'bg-rose-50 dark:bg-rose-900/20 text-rose-500 border-rose-100 dark:border-rose-900/30'
                                            }`}>
                                            <Shield size={40} className={isKycSubmitted ? 'animate-bounce' : 'animate-pulse'} />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3 tracking-tighter font-roboto uppercase">
                                            {isKycSubmitted ? 'Verification Pending' : 'Identity Verification Required'}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-8 font-bold text-sm leading-relaxed max-w-md mx-auto">
                                            {isKycSubmitted
                                                ? `The ${sidebarConfig.flatMap(g => g.items).find(i => i.id === activeTab)?.label} section is temporarily locked. Our team is currently reviewing your documents for compliance.`
                                                : `Access to ${sidebarConfig.flatMap(g => g.items).find(i => i.id === activeTab)?.label} is restricted. You must complete your KYC verification to unlock full partner features.`}
                                        </p>
                                        {!isKycSubmitted && (
                                            <button
                                                onClick={() => setActiveTab('kyc')}
                                                className="px-8 py-3.5 bg-slate-800 dark:bg-[#F97316] text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-all flex items-center gap-2 mx-auto"
                                            >
                                                <Shield size={18} /> Complete KYC Now
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {activeTab === 'overview' && (
                                            <CaOverview
                                                user={user}
                                                requests={requests}
                                                employees={employees}
                                                handleAcceptRequest={handleAcceptRequest}
                                                handleRejectRequest={handleRejectRequest}
                                                setActiveTab={setActiveTab}
                                            />
                                        )}

                                        {activeTab === 'opportunities' && (
                                            <CaOpportunities setActiveTab={setActiveTab} />
                                        )}

                                        {activeTab === 'works' && (
                                            <CaWorks
                                                requests={requests}
                                                employees={employees}
                                                handleAssignEmployee={handleAssignEmployee}
                                                respondToBoundAmount={respondToBoundAmount}
                                                fetchData={fetchData}
                                            />
                                        )}

                                        {activeTab === 'employees' && (
                                            <CaEmployees
                                                employees={employees}
                                                createEmployee={createEmployee}
                                                user={user}
                                                fetchData={fetchData}
                                            />
                                        )}

                                        {activeTab === 'wallet' && <CaWallet user={user} requests={requests} />}
                                        {activeTab === 'profile' && <CaProfile user={user} />}
                                        {activeTab === 'support' && <CaSupport user={user} />}
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

export default CaDashboard;
