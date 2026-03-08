import React, { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard, Users, FileText, CheckCircle, CreditCard, Settings, LogOut,
    Search, Bell, ChevronDown, Filter, Eye, DollarSign, AlertTriangle, TrendingUp, Menu, X,
    FileCheck, ChevronRight, BarChart3, Calendar, Download, PieChart, Cpu, MessageSquare, Globe, Shield, Database, HardDrive, Lock as LockIcon, Briefcase, Maximize, Grid, Mail, Sun, Moon,
    CheckSquare, Flag, Layers, BookOpen, UserPlus, IndianRupee, Scale, UserCheck, Building, Award, Monitor,
    Target, Megaphone, LifeBuoy, Activity, Link as LinkIcon, Banknote, ListChecks, HelpCircle, Clock, Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { getAllApplications, getUnreadSystemNotifications, markNotificationRead } from '../api';
import { hasPermission } from '../utils/permissions';
import MasterDashboard from './admin/views/MasterDashboard';
import SubAdminDashboard from './admin/views/SubAdminDashboard';
import AgentDashboard from './admin/views/AgentDashboard';
import CRMSystem from './admin/views/CRMSystem';

const AdminDashboardPage = ({ onLogout, user }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
    const role = (currentUser.email?.toLowerCase() === 'admin@shinefiling.com') ? 'MASTER_ADMIN' : currentUser.role;

    const [notifications, setNotifications] = useState([]);
    const prevNotifCount = useRef(0);
    const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3'));

    useEffect(() => {
        const isAnyAdmin = role && (role.includes('ADMIN') || role === 'MASTER_ADMIN' || role === 'SUPER_ADMIN');
        if (isAnyAdmin) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
            return () => clearInterval(interval);
        }
    }, [role]);

    const fetchNotifications = async () => {
        try {
            const data = await getUnreadSystemNotifications();
            const newNotifs = data || [];

            // If new notifications arrived (count increased)
            if (newNotifs.length > prevNotifCount.current) {
                playNotificationSound();
            }

            prevNotifCount.current = newNotifs.length;
            setNotifications(newNotifs);
        } catch (e) {
            console.error("Failed to fetch notifications", e);
        }
    };

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

    const handleMarkRead = async (id) => {
        try {
            await markNotificationRead(id);
            fetchNotifications();
        } catch (e) {
            console.error("Failed to mark notification read", e);
        }
    };


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

    // Role-Based Sidebar Configuration
    const sidebarConfig = {
        'MASTER_ADMIN': [
            // --- ANALYTICS & OVERVIEW ---
            { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', section: 'ANALYTICS & OVERVIEW', hot: true },
            {
                icon: Activity,
                label: 'Analytics Suite',
                id: 'analytics_suite',
                section: 'ANALYTICS & OVERVIEW',
                children: [
                    { label: 'Overview', id: 'analytics_overview', icon: Layers },
                    { label: 'Sales & Revenue', id: 'analytics_revenue', icon: DollarSign },
                    { label: 'User Insights', id: 'analytics_users', icon: Users },
                    { label: 'Service Metrics', id: 'analytics_services', icon: Briefcase }
                ]
            },

            // --- RELATIONSHIP MANAGEMENT ---
            {
                icon: Target,
                label: 'Leads & Enquiries',
                id: 'leads_crm',
                section: 'RELATIONSHIP MANAGEMENT',
                children: [
                    { label: 'All Leads', id: 'leads_all', icon: Users },
                    { label: 'Follow Ups', id: 'leads_followup', icon: Clock },
                    { label: 'Lead Sources', id: 'leads_sources', icon: LinkIcon }
                ]
            },
            {
                icon: Users,
                label: 'Client CRM',
                id: 'crm',
                section: 'RELATIONSHIP MANAGEMENT',
                children: [
                    { label: 'Clients List', id: 'crm_clients', icon: Users },
                    { label: 'Companies', id: 'crm_companies', icon: Building },
                    { label: 'Service Orders', id: 'crm_orders', icon: FileText },
                    { label: 'Compliance', id: 'crm_services', icon: CheckCircle },
                    { label: 'Documents', id: 'crm_documents', icon: FileCheck },
                    { label: 'Reports', id: 'crm_reports', icon: BarChart3 }
                ]
            },
            {
                icon: Briefcase,
                label: 'Agent CRM',
                id: 'agent_approvals',
                section: 'RELATIONSHIP MANAGEMENT',
                children: [
                    { label: 'Dashboard', id: 'agent_dashboard', icon: LayoutDashboard },
                    { label: 'Partner Directory', id: 'agent_list', icon: Users },
                    { label: 'Pending Approvals', id: 'agent_pending', icon: AlertTriangle },
                    { label: 'Active Partners', id: 'agent_active', icon: CheckCircle }
                ]
            },
            {
                icon: Scale,
                label: 'CA CRM',
                id: 'ca_crm',
                section: 'RELATIONSHIP MANAGEMENT',
                children: [
                    { label: 'Dashboard', id: 'ca_dashboard', icon: LayoutDashboard },
                    { label: 'CA Directory', id: 'ca_list', icon: Users },
                    { label: 'Compliance Rules', id: 'ca_compliance', icon: Calendar },
                    { label: 'Service Config', id: 'ca_services', icon: Briefcase },
                    { label: 'Billing & Fees', id: 'ca_billing', icon: DollarSign },
                    { label: 'Roles & Access', id: 'ca_roles', icon: LockIcon },
                    { label: 'Audit Logs', id: 'ca_audit', icon: FileCheck },
                    { label: 'Power Actions', id: 'ca_power', icon: AlertTriangle }
                ]
            },

            // --- OPERATIONS & FINANCE ---
            {
                icon: Layers,
                label: 'Operations',
                id: 'ops_mgmt',
                section: 'OPERATIONS & FINANCE',
                children: [
                    { label: 'Service Orders', id: 'ops_orders', icon: FileText },
                    { label: 'Task Manager', id: 'ops_tasks', icon: ListChecks },
                    { label: 'Chat System', id: 'ops_chat', icon: MessageSquare }
                ]
            },
            {
                icon: Banknote,
                label: 'Finance & Billing',
                id: 'finance_mgmt',
                section: 'OPERATIONS & FINANCE',
                children: [
                    { label: 'Invoices', id: 'fin_invoices', icon: FileText },
                    { label: 'Transactions', id: 'fin_trans', icon: IndianRupee },
                    { label: 'Tax Settings', id: 'fin_tax', icon: Percent },
                    { label: 'Pricing Plans', id: 'service_mgmt', icon: IndianRupee } // Reused ID
                ]
            },
            {
                icon: Megaphone,
                label: 'Marketing',
                id: 'marketing_mgmt',
                section: 'OPERATIONS & FINANCE',
                children: [
                    { label: 'Campaigns', id: 'mkt_campaigns', icon: Target },
                    { label: 'Email Templates', id: 'mkt_email', icon: Mail },
                    { label: 'Offers & Coupons', id: 'mkt_offers', icon: Award }
                ]
            },

            // --- SUPPORT & FILES ---
            {
                icon: HardDrive,
                label: 'File Manager',
                id: 'file_manager',
                section: 'SUPPORT & FILES',
                children: [
                    { label: 'All Files', id: 'file_all', icon: HardDrive },
                    { label: 'Client Docs', id: 'file_client', icon: Users },
                    { label: 'Company Docs', id: 'file_company', icon: Building },
                    { label: 'Service Files', id: 'file_services', icon: FileText },
                    { label: 'Marketing', id: 'file_marketing', icon: Monitor }
                ]
            },
            {
                icon: LifeBuoy,
                label: 'Help & Support',
                id: 'support_mgmt',
                section: 'SUPPORT & FILES',
                children: [
                    { label: 'Tickets', id: 'sup_tickets', icon: MessageSquare },
                    { label: 'Knowledge Base', id: 'sup_kb', icon: BookOpen }
                ]
            },

            // --- WEBSITE & CONTENT ---
            {
                icon: Globe,
                label: 'Website Control',
                id: 'website_mgmt',
                section: 'WEBSITE & CONTENT',
                children: [
                    { label: 'Careers & Hiring', id: 'careers_control', icon: Briefcase }
                ]
            },

            // --- ADMINISTRATION ---
            {
                icon: Shield,
                label: 'Access & Roles',
                id: 'admin_controls',
                section: 'ADMINISTRATION',
                children: [
                    { label: 'User Access', id: 'access_users', icon: Users },
                    { label: 'CA Permissions', id: 'access_cas', icon: Briefcase },
                    { label: 'Agent Permissions', id: 'access_agents', icon: UserCheck }
                ]
            },
            {
                icon: Settings,
                label: 'System Settings',
                id: 'settings_suite',
                section: 'ADMINISTRATION',
                children: [
                    { label: 'My Profile', id: 'settings_profile', icon: Users },
                    { label: 'General Settings', id: 'settings_general', icon: Globe },
                    { label: 'Security & Access', id: 'settings_security', icon: Shield },
                    { label: 'API & Integrations', id: 'settings_integrations', icon: LinkIcon },
                    { label: 'System Logs', id: 'settings_logs', icon: FileText }
                ]
            },
            { icon: LockIcon, label: 'Firewall & Security', id: 'firewall', section: 'ADMINISTRATION' },
        ],
        'SUB_ADMIN': [ /* ... same ... */],
        'AGENT_ADMIN': [ /* ... same ... */]
    };

    const getItems = (role) => {
        const base = sidebarConfig[role] || sidebarConfig['MASTER_ADMIN'];
        if (role !== 'MASTER_ADMIN') return base.map(i => ({ ...i, section: 'MAIN MENU' }));
        return base;
    }

    const currentSidebarItems = getItems(role).filter(item => hasPermission(role, item.id));

    const groupedItems = currentSidebarItems.reduce((acc, item) => {
        const section = item.section || 'MAIN MENU';
        if (!acc[section]) acc[section] = [];
        acc[section].push(item);
        return acc;
    }, {});

    const handleSearch = (e) => setSearchQuery(e.target.value);

    // Nested Sidebar Item
    const SidebarItem = ({ icon: Icon, label, id, children, hot }) => {
        const hasChildren = children && children.length > 0;
        const isChildActive = hasChildren && children.some(c => c.id === activeTab);
        const isActive = activeTab === id || isChildActive;
        const [isExpanded, setIsExpanded] = useState(isChildActive);

        useEffect(() => {
            if (isChildActive) setIsExpanded(true);
        }, [isChildActive]);

        return (
            <div className="mb-0.5">
                <button
                    onClick={() => {
                        if (hasChildren) {
                            setIsExpanded(!isExpanded);
                        } else {
                            setActiveTab(id);
                            if (window.innerWidth < 768) setIsSidebarOpen(false);
                        }
                    }}
                    className={`
                        w-full flex items-center justify-between px-6 py-2.5 transition-all duration-200 group text-left relative
                        ${isActive
                            ? 'text-slate-800 dark:text-white font-bold'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}
                    `}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive && !hasChildren ? 'bg-[#F97316] scale-125' : 'bg-transparent'}`}></div>
                        <Icon size={18} className={isActive ? 'text-[#F97316]' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
                        <span className="text-sm">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {hot && <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Hot</span>}
                        {hasChildren && (
                            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        )}
                    </div>
                </button>

                {/* Sub Menu */}
                <AnimatePresence>
                    {isExpanded && hasChildren && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden bg-slate-50/50 dark:bg-slate-900/30"
                        >
                            {children.map(child => {
                                const isSubActive = activeTab === child.id;
                                return (
                                    <button
                                        key={child.id}
                                        onClick={() => {
                                            setActiveTab(child.id);
                                            if (window.innerWidth < 768) setIsSidebarOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-6 pl-[3.25rem] py-2 text-xs transition-colors relative
                                            ${isSubActive ? 'text-[#F97316] font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`
                                        }
                                    >
                                        {isSubActive && <div className="absolute left-[2.5rem] top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#F97316]"></div>}
                                        {child.label}
                                    </button>
                                )
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-[#F3F4F6] dark:bg-slate-900 font-[Roboto,sans-serif] overflow-hidden transition-colors duration-200">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Sidebar */}
            <AnimatePresence>
                {(isSidebarOpen || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200 z-50 flex flex-col shadow-xl md:shadow-md border-r border-slate-100 ${isSidebarOpen ? 'block' : 'hidden md:flex'}`}
                    >
                        <div className="h-40 flex items-center px-4 border-b border-slate-50 dark:border-slate-700 justify-center relative">
                            <div
                                className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => window.location.href = '/'}
                            >
                                <img src="/logo.png" alt="ShineFiling" className="h-32 w-auto object-contain" />
                            </div>
                            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute right-4 text-slate-400"><X size={20} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-4 space-y-6 no-scrollbar">
                            {Object.entries(groupedItems).map(([section, items]) => (
                                <div key={section}>
                                    <div className="px-6 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{section}</div>
                                    {items.map(item => <SidebarItem key={item.id} {...item} />)}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Overlay */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

            {/* Main Content Actions - Copied from previous logic (Header etc) */}
            <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
                <div className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 z-30 sticky top-0 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-slate-500"><Menu size={24} /></button>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleDarkMode} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-colors">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>

                        <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative p-2 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700">
                            <Bell size={20} />
                            {notifications.length > 0 && (
                                <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>
                            )}
                        </button>
                        <AnimatePresence>
                            {isNotificationsOpen && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute right-16 top-16 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden">
                                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                        <h4 className="font-bold">Notifications ({notifications.length})</h4>
                                        <button onClick={fetchNotifications} className="text-xs text-[#F97316] hover:underline font-bold">Refresh</button>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                                        {notifications.length > 0 ? (
                                            notifications.map(n => (
                                                <div key={n.id} className="p-4 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors group">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-widest">{n.type?.replace('_', ' ')}</span>
                                                        <span className="text-[9px] text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-800 dark:text-white mb-0.5">{n.title}</p>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{n.message}</p>
                                                    <div className="mt-2 flex justify-end">
                                                        <button
                                                            onClick={() => handleMarkRead(n.id)}
                                                            className="text-[10px] font-bold text-emerald-500 hover:text-emerald-600 uppercase tracking-widest flex items-center gap-1"
                                                        >
                                                            <CheckCircle size={10} /> Mark Read
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-sm text-slate-500 text-center flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center">
                                                    <Bell size={24} className="text-slate-200" />
                                                </div>
                                                <p>No new notifications</p>
                                            </div>
                                        )}
                                    </div>
                                    {notifications.length > 0 && (
                                        <div className="p-3 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-700 text-center">
                                            <button
                                                onClick={() => { setActiveTab('notifications'); setIsNotificationsOpen(false); }}
                                                className="text-xs font-bold text-slate-500 hover:text-[#F97316]"
                                            >
                                                View All Activity
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>


                        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700 ml-2">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">{currentUser.fullName || 'Administrator'}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">{role.replace('_', ' ')}</p>
                            </div>
                            <button className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-transparent hover:ring-[#F97316] transition-all relative group">
                                {currentUser.profileImage ? (
                                    <img src={currentUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#F97316] to-[#EF4444] flex items-center justify-center text-white font-bold text-sm">
                                        {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'A'}
                                    </div>
                                )}
                            </button>
                        </div>
                        <button
                            onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-[#F3F4F6] dark:bg-slate-900 relative scroll-smooth transition-colors duration-200">
                    <div className="max-w-[1600px] mx-auto">
                        <AnimatePresence mode="wait">
                            {role === 'MASTER_ADMIN' && <MasterDashboard activeTab={activeTab} onNavigate={setActiveTab} user={currentUser} />}
                            {role === 'SUB_ADMIN' && <SubAdminDashboard activeTab={activeTab} />}
                            {role === 'AGENT_ADMIN' && <AgentDashboard activeTab={activeTab} />}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
