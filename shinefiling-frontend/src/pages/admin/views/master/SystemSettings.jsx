import React, { useState, useEffect } from 'react';
import {
    Shield, Database, Globe, Key, Save, Download, Server, Wifi,
    Bell, Lock, RefreshCw, Cpu, Activity, AlertOctagon, CheckCircle,
    UserX, Terminal, User, Camera, Mail, Moon, Sun, Monitor, Radio, Smartphone, CreditCard,
    Trash2, Briefcase, ChevronRight, Eye, Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSystemSettings, updateSystemSettings, uploadProfilePicture, updateUserProfile } from '../../../../api';

// --- Premium Reusable Components ---

const GlassCard = ({ children, className = "" }) => (
    <div className={`bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-3xl ${className}`}>
        {children}
    </div>
);

const ToggleRow = ({ icon: Icon, color, title, desc, enabled, onToggle }) => {
    const colorClasses = {
        emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        violet: "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400",
        amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
        rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    };

    // Extract base color name from provided class or map manually if needed
    const key = color.replace('bg-', '').replace('-500', '');
    const styleClass = colorClasses[key] || colorClasses.blue;

    return (
        <div
            className="flex items-center justify-between p-5 bg-white dark:bg-slate-700/30 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-100 dark:border-slate-700 transition-all duration-300 cursor-pointer group"
            onClick={onToggle}
        >
            <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl ${styleClass} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={22} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{desc}</p>
                </div>
            </div>
            <div className={`w-12 h-7 rounded-full p-1 transition-all duration-300 ${enabled ? 'bg-violet-500 shadow-inner' : 'bg-slate-200 dark:bg-slate-600'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
        </div>
    );
};

const SectionHeader = ({ icon: Icon, title, desc }) => (
    <div className="mb-8 border-b border-slate-100 dark:border-slate-700 pb-6">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Icon size={24} />
            </div>
            <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{desc}</p>
            </div>
        </div>
    </div>
);

const SystemSettings = ({ activeTab = 'profile' }) => {
    const [isSaving, setIsSaving] = useState(false);

    // Load local user first
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');

    // Mock State for Profile
    const [profile, setProfile] = useState({
        id: localUser.id || null,
        name: localUser.fullName || 'Master Admin',
        email: localUser.email || 'admin@shinefiling.com',
        role: localUser.role || 'Super User',
        profileImage: localUser.profileImage || null,
        notifications: true,
        theme: 'light'
    });

    // Settings State
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        publicRegistration: true,
        twoFactorAuth: false,
        debugMode: false
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSystemSettings();
                if (data) {
                    setSettings({
                        maintenanceMode: data.maintenanceMode ?? false,
                        publicRegistration: data.publicRegistration ?? true,
                        twoFactorAuth: data.twoFactorAuth ?? false,
                        debugMode: data.debugMode ?? false
                    });
                }
            } catch (error) {
                console.error("Failed to load system settings", error);
            }
        };
        fetchSettings();
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !profile.id) return;
        try {
            const res = await uploadProfilePicture(profile.id, file);
            const newImage = res.profileImage;
            setProfile(p => ({ ...p, profileImage: newImage }));
            const lsUser = JSON.parse(localStorage.getItem('user') || '{}');
            lsUser.profileImage = newImage;
            localStorage.setItem('user', JSON.stringify(lsUser));
            alert("Profile Image Updated!");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Failed to upload image");
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSystemSettings(settings);
            if (profile.id) {
                await updateUserProfile(profile.id, { fullName: profile.name, mobile: profile.mobile });
                const lsUser = JSON.parse(localStorage.getItem('user') || '{}');
                lsUser.fullName = profile.name;
                localStorage.setItem('user', JSON.stringify(lsUser));
            }
            await new Promise(r => setTimeout(r, 800));
        } catch (error) {
            console.error("Failed to save settings", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-slate-900">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 px-8 py-6 flex justify-between items-center sticky top-0 z-20 shadow-sm transition-all">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
                        <span className="p-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-500/30"><SettingsIcon activeTab="profile" /></span>
                        System Settings.
                    </h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 pl-1">
                        Manage platform configuration, security, and preferences.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-2.5 font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition text-xs">Discard Changes</button>
                    <button
                        onClick={handleSave}
                        className={`px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-xl shadow-slate-900/20 hover:scale-105 transition flex items-center gap-2 text-xs ${isSaving ? 'opacity-80 cursor-wait' : ''}`}
                    >
                        {isSaving ? <RefreshCw className="animate-spin" size={14} /> : <CheckCircle size={14} />}
                        {isSaving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pb-32">
                <div className="max-w-5xl mx-auto">
                    <AnimatePresence mode='wait'>

                        {/* 1. PROFILE SETTINGS */}
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}
                                className="space-y-8"
                            >
                                <GlassCard className="p-8">
                                    <div className="flex flex-col md:flex-row items-center gap-10">
                                        <div className="relative group cursor-pointer">
                                            <div className="w-36 h-36 rounded-full p-1.5 bg-slate-100 dark:bg-slate-700 border-4 border-white dark:border-slate-600 shadow-2xl relative overflow-hidden">
                                                {profile.profileImage ? (
                                                    <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                                                ) : (
                                                    <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-4xl font-black text-slate-400 dark:text-slate-600">
                                                        {profile.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full backdrop-blur-[2px]">
                                                    <Camera size={28} className="text-white" />
                                                </div>
                                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                            </div>
                                            <div className="absolute bottom-2 right-2 w-9 h-9 bg-violet-600 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center text-white shadow-lg">
                                                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                            </div>
                                        </div>

                                        <div className="text-center md:text-left flex-1 space-y-4">
                                            <div>
                                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{profile.name}</h3>
                                                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">{profile.email}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                                <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wide border border-violet-200 dark:border-violet-800">{profile.role}</span>
                                                <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold uppercase tracking-wide border border-green-200 dark:border-green-800">Active</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <InputGroup label="Display Name" icon={User} value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} placeholder="Enter your full name" />
                                        <InputGroup label="Email Address" icon={Mail} value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} placeholder="name@company.com" />
                                        <InputGroup label="Phone Number" icon={Smartphone} value={localUser.mobile || ''} placeholder="+91 00000 00000" />
                                        <InputGroup label="Role / Designation" icon={Briefcase} value={profile.role} disabled={true} />
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}

                        {/* 2. GENERAL SETTINGS */}
                        {activeTab === 'general' && (
                            <motion.div
                                key="general"
                                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                <GlassCard className="p-8">
                                    <SectionHeader icon={Globe} title="General Configuration" desc="Core platform settings and identity." />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                        <InputGroup label="Platform Name" value="ShineFiling Dashboard" icon={Monitor} />
                                        <InputGroup label="Support Hotline" value="+91 94000 00000" icon={Smartphone} />
                                    </div>

                                    <div className="space-y-4">
                                        <ToggleRow icon={AlertOctagon} color="bg-rose-500" title="Maintenance Mode" desc="Temporarily disable access for all users." enabled={settings.maintenanceMode} onToggle={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })} />
                                        <ToggleRow icon={UserX} color="bg-amber-500" title="Public Registration" desc="Allow new users to create accounts." enabled={settings.publicRegistration} onToggle={() => setSettings({ ...settings, publicRegistration: !settings.publicRegistration })} />
                                    </div>
                                </GlassCard>

                                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800/30 flex gap-4 items-center">
                                    <Activity className="text-blue-500 shrink-0" size={24} />
                                    <div>
                                        <h4 className="font-bold text-blue-900 dark:text-blue-300">System Status: Operational</h4>
                                        <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">All services are running normally. Last check: 1 min ago.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 3. SECURITY SETTINGS */}
                        {activeTab === 'security' && (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                <GlassCard className="p-8">
                                    <SectionHeader icon={Shield} title="Security & Access" desc="Authentication policies and emergency controls." />

                                    <div className="grid grid-cols-1 gap-4 mb-8">
                                        <ToggleRow icon={Smartphone} color="bg-blue-500" title="Two-Factor Authentication (2FA)" desc="Require OTP for admin logins." enabled={settings.twoFactorAuth} onToggle={() => setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })} />
                                        <ToggleRow icon={Server} color="bg-purple-500" title="Auto-Session Timeout" desc="Log out inactive users after 15 mins." enabled={true} onToggle={() => { }} />
                                    </div>

                                    <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-2xl p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-rose-100 dark:bg-rose-800/30 rounded-lg text-rose-600 dark:text-rose-400">
                                                <Lock size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-rose-800 dark:text-rose-200">Emergency Lockdown</h4>
                                                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 max-w-md">Instantly invalidate all sessions and suspend access. Use only in case of a breach.</p>
                                                <button className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-lg shadow-rose-500/20 transition-all">Initiate Lockdown</button>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}

                        {/* 4. API & INTEGRATIONS */}
                        {activeTab === 'integrations' && (
                            <motion.div
                                key="integrations"
                                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                <GlassCard className="p-8">
                                    <SectionHeader icon={Key} title="API Keys & Secrets" desc="Manage connections to external services." />
                                    <div className="space-y-4">
                                        <ApiKeyRow name="Razorpay Live Key" value="rzp_live_8374928374" color="amber" visible={false} />
                                        <ApiKeyRow name="OpenAI API Secret" value="sk-proj-9283928392" color="emerald" visible={false} />
                                        <ApiKeyRow name="AWS S3 Access Key" value="AKIA9283928392" color="blue" visible={false} />
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}

                        {/* 5. SYSTEM LOGS */}
                        {activeTab === 'logs' && (
                            <motion.div
                                key="logs"
                                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                <GlassCard className="p-0 overflow-hidden bg-slate-950 border-slate-900">
                                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <span className="text-slate-500 font-mono text-xs">system_logs.log</span>
                                    </div>
                                    <div className="p-6 font-mono text-xs space-y-2 text-slate-300 h-[400px] overflow-y-auto custom-scrollbar">
                                        <p className="text-green-400">[2024-05-15 10:00:01] [INFO] System initialized successfully.</p>
                                        <p>[2024-05-15 10:00:02] [INFO] Database connection established (Latency: 2ms).</p>
                                        <p>[2024-05-15 10:00:03] [AUTH] User 'Master Admin' failed login from 192.168.1.5 (Invalid Credentials).</p>
                                        <p>[2024-05-15 10:05:12] [AUTH] User 'Master Admin' logged in successfully.</p>
                                        <p className="text-blue-400">[2024-05-15 10:10:45] [API] GET /api/v1/analytics/stats - 200 OK</p>
                                        <p className="text-yellow-400">[2024-05-15 10:15:20] [WARN] High CPU usage detected on Worker-2.</p>
                                        <p>[2024-05-15 10:20:01] [CRON] Daily backups completed.</p>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// --- Sub Comps & Helpers ---

const SettingsIcon = ({ activeTab }) => {
    switch (activeTab) {
        case 'profile': return <User size={24} />;
        case 'general': return <Globe size={24} />;
        case 'security': return <Shield size={24} />;
        case 'integrations': return <Key size={24} />;
        case 'logs': return <Terminal size={24} />;
        default: return <User size={24} />;
    }
};

const InputGroup = ({ label, icon: Icon, value, onChange, placeholder, disabled }) => (
    <div className={disabled ? 'opacity-70 pointer-events-none' : ''}>
        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">{label}</label>
        <div className="relative group">
            {Icon && <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-violet-500 transition-colors" />}
            <input
                type="text"
                defaultValue={value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-800 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-600 focus:border-violet-500 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all shadow-sm focus:shadow-md`}
            />
        </div>
    </div>
);

const ApiKeyRow = ({ name, value, color, visible = false }) => {
    const [isVisible, setIsVisible] = useState(visible);
    return (
        <div className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 dark:bg-slate-700/30 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700 items-center group hover:border-violet-200 dark:hover:border-violet-700/50 transition-colors">
            <div className="flex-1 w-full">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{name}</label>
                <div className="relative">
                    <input
                        type={isVisible ? "text" : "password"}
                        value={value}
                        readOnly
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm font-mono text-slate-600 dark:text-slate-300 pl-4 transition-all focus:type-text"
                    />
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-${color}-500`}></div>
                    <button onClick={() => setIsVisible(!isVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        {isVisible ? <Eye size={16} /> : <Lock size={16} />}
                    </button>
                </div>
            </div>
            <button className="px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition whitespace-nowrap shadow-sm group-hover:border-slate-300 dark:group-hover:border-slate-500 flex items-center gap-2">
                <RefreshCw size={14} /> Rotate Key
            </button>
        </div>
    );
};

export default SystemSettings;
