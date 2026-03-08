import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin, Save, Lock, Camera, ShieldCheck,
    ChevronRight, AlertTriangle, CreditCard, Bell, Key, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import { updateUserProfile, uploadProfilePicture } from '../../api';

const ClientProfile = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [activeTab, setActiveTab] = useState('personal');

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user.id) return;
        try {
            setLoading(true);
            const res = await uploadProfilePicture(user.id, file);
            const updatedUser = { ...user, profileImage: res.profileImage };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist to local storage
            window.dispatchEvent(new Event('userUpdated'));
            setMsg({ type: 'success', text: "Profile Picture Updated!" });
        } catch (error) {
            setMsg({ type: 'error', text: 'Failed to upload photo.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user.id) return;
        setLoading(true);
        setMsg({ type: '', text: '' });
        try {
            await updateUserProfile(user.id, user);
            localStorage.setItem('user', JSON.stringify(user));
            window.dispatchEvent(new Event('userUpdated'));
            setMsg({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMsg({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-black text-[#043E52] tracking-tight">Account Settings</h1>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Manage your personal profile and security preferences.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 shadow-sm">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">KYC Verified Account</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { id: 'personal', label: 'Personal Info', icon: User },
                        { id: 'security', label: 'Login & Security', icon: Lock },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'billing', label: 'Billing Methods', icon: CreditCard },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-[#043E52] text-white shadow-lg shadow-[#043E52]/20'
                                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-[#043E52]'
                                }`}
                        >
                            <tab.icon size={18} className={activeTab === tab.id ? 'text-[#ED6E3F]' : 'opacity-70'} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <motion.div
                        key={activeTab}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
                    >
                        {activeTab === 'personal' && (
                            <div className="p-8">
                                {/* Profile Picture Section */}
                                <motion.div variants={itemVariants} className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-xl overflow-hidden ring-4 ring-slate-50 shadow-lg bg-slate-100 flex items-center justify-center">
                                            {user.profileImage ? (
                                                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-3xl font-bold text-[#043E52]">{user.fullName?.charAt(0)}</span>
                                            )}
                                        </div>
                                        <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#ED6E3F] text-white rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:bg-[#d65a2e] transition-all hover:scale-110">
                                            <Camera size={14} />
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#043E52]">Profile Photo</h3>
                                        <p className="text-xs text-slate-500 mt-1 mb-3">Upload a clear photo to help us identify you.</p>
                                        <div className="flex gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded">JPG</span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded">PNG</span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded">Max 5MB</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Form Fields */}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <motion.div variants={itemVariants} className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-[#043E52] uppercase tracking-wider flex items-center gap-1">
                                                Full Name <span className="text-red-400">*</span>
                                            </label>
                                            <div className="relative group">
                                                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ED6E3F] transition-colors" />
                                                <input
                                                    name="fullName"
                                                    value={user.fullName || ''}
                                                    onChange={handleChange}
                                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-sm text-slate-700 focus:outline-none focus:border-[#ED6E3F] focus:ring-2 focus:ring-[#ED6E3F]/10 transition-all"
                                                />
                                            </div>
                                        </motion.div>

                                        <motion.div variants={itemVariants} className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-[#043E52] uppercase tracking-wider flex items-center gap-1">
                                                Email Address <Lock size={10} className="text-slate-400" />
                                            </label>
                                            <div className="relative group">
                                                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    disabled
                                                    value={user.email || ''}
                                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg font-bold text-sm text-slate-500 cursor-not-allowed"
                                                />
                                            </div>
                                        </motion.div>

                                        <motion.div variants={itemVariants} className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-[#043E52] uppercase tracking-wider flex items-center gap-1">
                                                Phone Number
                                            </label>
                                            <div className="relative group">
                                                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ED6E3F] transition-colors" />
                                                <input
                                                    name="mobile"
                                                    value={user.mobile || ''}
                                                    onChange={handleChange}
                                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-sm text-slate-700 focus:outline-none focus:border-[#ED6E3F] focus:ring-2 focus:ring-[#ED6E3F]/10 transition-all"
                                                />
                                            </div>
                                        </motion.div>

                                        <motion.div variants={itemVariants} className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-[#043E52] uppercase tracking-wider flex items-center gap-1">
                                                Location / City
                                            </label>
                                            <div className="relative group">
                                                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ED6E3F] transition-colors" />
                                                <input
                                                    name="address"
                                                    value={user.address || ''}
                                                    onChange={handleChange}
                                                    placeholder="Chennai, India"
                                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-sm text-slate-700 focus:outline-none focus:border-[#ED6E3F] focus:ring-2 focus:ring-[#ED6E3F]/10 transition-all"
                                                />
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Notifications */}
                                    {msg.text && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
                                        >
                                            {msg.type === 'success' ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
                                            {msg.text}
                                        </motion.div>
                                    )}

                                    {/* Actions */}
                                    <motion.div variants={itemVariants} className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="px-6 py-3 bg-[#043E52] text-white font-bold rounded-lg shadow-md hover:bg-[#065a75] hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                                        >
                                            {loading ? (
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            ) : (
                                                <Save size={16} />
                                            )}
                                            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                                        </button>
                                    </motion.div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="p-8">
                                <motion.div variants={itemVariants} className="max-w-2xl">
                                    <h3 className="text-xl font-bold text-[#043E52] mb-6">Login & Security</h3>

                                    <div className="space-y-4">
                                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-[#ED6E3F]/30 hover:bg-[#ED6E3F]/5 transition-all group cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#043E52] shadow-sm">
                                                    <Key size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[#043E52]">Change Password</h4>
                                                    <p className="text-sm text-slate-500">Update your password regularly to stay safe</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={20} className="text-slate-300 group-hover:text-[#ED6E3F] transition-colors" />
                                        </div>

                                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-[#ED6E3F]/30 hover:bg-[#ED6E3F]/5 transition-all group cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#043E52] shadow-sm">
                                                    <Shield size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[#043E52]">Two-Factor Authentication</h4>
                                                    <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded font-bold uppercase">Disabled</span>
                                                <ChevronRight size={20} className="text-slate-300 group-hover:text-[#ED6E3F] transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                    <Bell size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-[#043E52] mb-2">Notification Preferences</h3>
                                <p className="text-slate-500">Manage how you receive updates and alerts.</p>
                                <button className="mt-6 px-6 py-2 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                                    Configure Alerts
                                </button>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                    <CreditCard size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-[#043E52] mb-2">Billing Methods</h3>
                                <p className="text-slate-500">Securely manage your saved cards and payment details.</p>
                                <button className="mt-6 px-6 py-2 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                                    Add Payment Method
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;
