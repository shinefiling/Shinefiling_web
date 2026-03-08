import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDashboardPath } from '../utils/permissions';

import {
    LayoutDashboard, FileText, Bell, Plus,
    CreditCard, HelpCircle, Menu, X, User, Package, LogOut, Zap,
    Sun, Moon, Settings, Search, ChevronDown, Folder, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNotifications, getServiceCatalog } from '../api';
import { getInactiveServices } from '../utils/serviceManager';
import { SERVICE_DATA } from '../data/services';

import ClientHome from './client/ClientHome';
import NewFiling from './client/NewFiling';
import MyOrders from './client/MyOrders';
import ClientPayments from './client/ClientPayments';
import ClientProfile from './client/ClientProfile';
import ClientSupport from './client/ClientSupport';
import ClientNotifications from './client/ClientNotifications';
import ClientDocuments from './client/ClientDocuments';
import ClientCompliance from './client/ClientCompliance';
import ComingSoon from '../components/ComingSoon';

const DashboardPage = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    // Initialize user from localStorage
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : { fullName: 'Guest', email: '' };
    });
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [serviceCategories, setServiceCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false); // Added State
    const notificationRef = React.useRef(null); // Added Ref

    const location = useLocation();
    const navigate = useNavigate();

    // Redirect if not a client
    useEffect(() => {
        if (user && user.role) {
            const path = getDashboardPath(user.role);
            if (path !== '/dashboard') {
                navigate(path, { replace: true });
            }
        }
    }, [user, navigate]);


    // Theme Effect
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

    useEffect(() => {
        let interval;
        const fetchNotes = async () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userData = JSON.parse(userStr);
                if (JSON.stringify(userData) !== JSON.stringify(user)) {
                    setUser(userData);
                }

                try {
                    const data = await getNotifications(userData.email);
                    if (Array.isArray(data)) {
                        setNotifications(data);
                        setUnreadCount(data.filter(n => !(n.isRead || n.read)).length);
                    }
                } catch (e) {
                    console.error("Failed to fetch notifications", e);
                }
            }
        };

        fetchNotes();
        interval = setInterval(fetchNotes, 10000);

        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) {
            setActiveTab(tab);
        }

        return () => clearInterval(interval);
    }, [location]);

    // Close notifications on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch Services for Sidebar (Dynamic Logic Preserved)
    useEffect(() => {
        const loadServices = async () => {
            try {
                const apiData = await getServiceCatalog();
                const inactiveList = getInactiveServices();

                let rawServices = apiData && apiData.length > 0 ? apiData : [];
                if (rawServices.length === 0) {
                    Object.values(SERVICE_DATA).forEach(cat => {
                        cat.items.forEach(item => {
                            rawServices.push({ name: item, category: cat.label, categoryId: cat.id });
                        });
                    });
                }

                const activeServices = rawServices.filter(s => {
                    const isInactiveGlobally = s.status === 'INACTIVE';
                    const isInactiveLocally = inactiveList.includes(s.id || s.name);
                    return !isInactiveGlobally && !isInactiveLocally;
                });

                const cats = [];
                const seenCats = new Set();
                activeServices.forEach(s => {
                    const id = s.categoryId || 'others';
                    if (!seenCats.has(id)) {
                        seenCats.add(id);
                        cats.push({ id, label: s.category || 'Other', icon: SERVICE_DATA[id]?.icon || Zap });
                    }
                });
                setServiceCategories(cats);
            } catch (e) { console.error(e); }
        };
        loadServices();
        window.addEventListener('serviceStatusChanged', loadServices);
        return () => window.removeEventListener('serviceStatusChanged', loadServices);
    }, []);

    // Listen for User Updates
    useEffect(() => {
        const handleUserUpdate = () => {
            const stored = localStorage.getItem('user');
            if (stored) {
                setUser(JSON.parse(stored));
            }
        };
        window.addEventListener('userUpdated', handleUserUpdate);
        return () => window.removeEventListener('userUpdated', handleUserUpdate);
    }, []);


    const isEmployee = user?.role?.toUpperCase() === 'EMPLOYEE';

    const renderContent = () => {
        if (isEmployee) {
            return <ComingSoon />;
        }

        switch (activeTab) {
            case 'overview': return <ClientHome setActiveTab={setActiveTab} />;
            case 'new-filing': return <NewFiling setActiveTab={setActiveTab} initialCategory={selectedCategory} />;
            case 'orders': return <MyOrders />;
            case 'documents': return <ClientDocuments />;
            case 'compliance': return <ClientCompliance />;
            case 'payments': return <ClientPayments />;
            case 'profile': return <ClientProfile />;
            case 'support': return <ClientSupport />;
            case 'notifications': return <ClientNotifications />;
            default: return <ClientHome setActiveTab={setActiveTab} />;
        }
    };

    // Refined Sidebar Item - Ecomus Style
    const SidebarItem = ({ icon: Icon, label, id, hot }) => {
        const isActive = activeTab === id;
        return (
            <button
                onClick={() => { setActiveTab(id); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                className={`
                    w-full flex items-center justify-between px-6 py-3.5 transition-all duration-200 group text-left relative
                    ${isActive
                        ? 'text-[#015A62] dark:text-[#ED6E3F] bg-[#015A62]/5 dark:bg-[#ED6E3F]/10 border-l-4 border-[#015A62] dark:border-[#ED6E3F]'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 border-l-4 border-transparent'}
                `}
            >
                <div className="flex items-center gap-3.5">
                    <Icon size={20} className={isActive ? 'text-[#015A62] dark:text-[#ED6E3F]' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white'} />
                    <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isActive ? 'text-[#015A62] dark:text-[#ED6E3F] -rotate-90' : 'text-slate-300 -rotate-90 opacity-0 group-hover:opacity-100'}`} />
            </button>
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
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={`fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-[#043E52] z-50 flex flex-col shadow-xl md:shadow-md border-r border-slate-200 dark:border-white/5 ${isSidebarOpen ? 'block' : 'hidden md:flex'}`}
                    >
                        <div className="h-32 flex items-center justify-center px-6 border-b border-slate-100 dark:border-white/5 relative">
                            <div className="flex items-center cursor-pointer" onClick={() => window.location.href = '/'}>
                                <img src="/logo.png" alt="ShineFiling" className="h-24 w-auto object-contain" />
                            </div>
                            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute right-4 text-slate-400 hover:text-[#ED6E3F]"><X size={20} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-6 space-y-1 no-scrollbar">

                            {/* CTA Button */}
                            {!isEmployee && (
                                <div className="px-6 mb-6">
                                    <button
                                        onClick={() => { setActiveTab('new-filing'); setIsSidebarOpen(false); }}
                                        className={`w-[85%] mx-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#ED6E3F]/20 group ${activeTab === 'new-filing'
                                            ? 'bg-[#ED6E3F] text-white scale-[1.02]'
                                            : 'bg-gradient-to-r from-[#ED6E3F] to-[#f28b65] text-white hover:brightness-110'
                                            }`}
                                    >
                                        <Plus size={16} /> New Filing
                                    </button>
                                </div>
                            )}

                            <div>
                                <div className="px-6 mb-3 flex items-center gap-2 text-[#015A62] dark:text-[#ED6E3F] font-bold text-sm">
                                    <LayoutDashboard size={16} />
                                    <span>Menu</span>
                                </div>
                                <SidebarItem icon={LayoutDashboard} label="Dashboard" id="overview" />
                                {!isEmployee && (
                                    <>
                                        <SidebarItem icon={Package} label="My Applications" id="orders" />
                                        <SidebarItem icon={Folder} label="Document Wallet" id="documents" />
                                        <SidebarItem icon={Calendar} label="Calendar" id="compliance" />
                                        <SidebarItem icon={CreditCard} label="Billing & Invoices" id="payments" />
                                    </>
                                )}
                            </div>

                            {!isEmployee && (
                                <div className="mt-6">
                                    <div className="px-6 mb-3 flex items-center gap-2 text-[#015A62] dark:text-[#ED6E3F] font-bold text-sm">
                                        <User size={16} />
                                        <span>Account</span>
                                    </div>
                                    <SidebarItem icon={User} label="Profile & KYC" id="profile" />
                                    <SidebarItem icon={HelpCircle} label="Help & Support" id="support" />
                                </div>
                            )}



                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Overlay */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}
            {/* Main Content Area */}
            <div className="flex-1 md:ml-[280px] flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <div className="h-16 bg-white dark:bg-[#043E52] border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-6 z-30 sticky top-0 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-slate-500"><Menu size={24} /></button>
                        <h1 className="text-lg font-bold text-[#015A62] dark:text-white tracking-tight hidden md:block">
                            {activeTab === 'overview' ? 'Overview' :
                                activeTab === 'new-filing' ? 'New Service' :
                                    activeTab === 'documents' ? 'Document Vault' :
                                        activeTab === 'compliance' ? 'Calendar' :
                                            activeTab === 'payments' ? 'Billing' :
                                                activeTab === 'profile' ? 'Profile' :
                                                    activeTab === 'notifications' ? 'Notifications' : 'Support'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleDarkMode} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-colors">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>

                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                <Bell size={20} />
                                {notifications.some(n => !n.isRead && !n.read) && <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>}
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/5 dark:ring-white/10"
                                    >
                                        {/* Header */}
                                        <div className="bg-[#015A62] px-4 py-3 flex items-center justify-between">
                                            <h4 className="text-white font-bold text-sm">Notifications</h4>
                                            <button className="text-white/80 hover:text-white transition-colors">
                                                <Settings size={16} />
                                            </button>
                                        </div>

                                        {/* Notification List */}
                                        <div className="max-h-[350px] overflow-y-auto bg-white dark:bg-slate-800">
                                            {notifications.length > 0 ? (
                                                notifications.slice(0, 5).map((notif, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => { setActiveTab('notifications'); setShowNotifications(false); }}
                                                        className="p-4 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex gap-3 group cursor-pointer relative"
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center text-[#043E52] dark:text-white font-bold text-xs">
                                                            {notif.sender ? notif.sender.charAt(0) : 'S'}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-xs text-slate-800 dark:text-slate-200 leading-snug">
                                                                <span className="font-bold">{notif.title || 'System'}</span> {notif.message}
                                                            </p>
                                                            <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                                                                {notif.timestamp ? new Date(notif.timestamp).toLocaleDateString() : 'Just now'}
                                                            </span>
                                                        </div>
                                                        {(!notif.isRead && !notif.read) && (
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#015A62] dark:bg-[#ED6E3F]"></div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                                                    <Bell size={24} className="mb-2 opacity-50" />
                                                    <span className="text-xs font-medium">No new notifications</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div
                                            onClick={() => { setShowNotifications(false); setActiveTab('notifications'); }}
                                            className="bg-slate-50 dark:bg-slate-900 px-4 py-3 text-center border-t border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="text-xs font-bold text-[#015A62] dark:text-[#ED6E3F]">See all recent activity</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button onClick={onLogout} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-colors" title="Sign Out">
                            <LogOut size={20} />
                        </button>

                        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700 ml-2">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">{user.fullName || 'User'}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">{isEmployee ? 'Employee' : 'Client'}</p>
                            </div>
                            <button className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-transparent hover:ring-[#015A62] transition-all relative group">
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#015A62] to-[#043E52] flex items-center justify-center text-white font-bold text-sm">
                                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Render */}
                <main className="flex-1 p-6 bg-[#F3F4F6] dark:bg-[#0D1C22] overflow-y-auto relative scroll-smooth transition-colors duration-200">
                    <div className="max-w-7xl mx-auto pb-20 md:pb-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Nav removed as per request */}

        </div>
    );
};

export default DashboardPage;
