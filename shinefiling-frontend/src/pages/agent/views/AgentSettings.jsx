
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Smartphone, Mail, Globe, Lock, Crown, ShieldCheck } from 'lucide-react';
import { updateUserProfile } from '../../../api'; // Verify path

const AgentSettings = ({ user }) => {
    const [formData, setFormData] = useState({
        fullName: user.fullName || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
        bankName: user.bankName || '',
        accountNumber: user.accountNumber || '',
        ifscCode: user.ifscCode || ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const checkKycStatus = () => {
        if (user.kycStatus === 'VERIFIED') return { color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20', text: 'Verified Partner', icon: ShieldCheck };
        if (user.kycStatus === 'PENDING') return { color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20', text: 'Verification Pending', icon: Clock };
        return { color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20', text: 'Unverified', icon: Lock };
    };

    // We import Clock here manually since it wasn't in the top import
    const Clock = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;


    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const updatedUser = await updateUserProfile(user.id, formData);
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage
            window.dispatchEvent(new Event('userUpdated')); // Notify app
            alert("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const status = checkKycStatus();
    const StatusIcon = status.icon;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 bg-white dark:bg-[#043E52] p-6 rounded-3xl border border-slate-100 dark:border-[#1C3540] shadow-sm">
                <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-4 ring-white dark:ring-[#043E52] shadow-lg relative group cursor-pointer">
                    {user.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={32} /></div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">Change</div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-[#043E52] dark:text-white flex items-center gap-2">
                        {user.fullName}
                        {user.kycStatus === 'VERIFIED' && <Crown size={20} className="text-[#ED6E3F] fill-[#ED6E3F]" />}
                    </h2>
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide mt-1 ${status.color}`}>
                        <StatusIcon size={14} /> {status.text}
                    </div>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#043E52] p-6 rounded-3xl border border-slate-100 dark:border-[#1C3540] shadow-sm space-y-4">
                    <h3 className="font-bold text-lg text-[#043E52] dark:text-white border-b border-slate-50 dark:border-slate-800 pb-2 mb-4">Personal Details</h3>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#1C3540] rounded-xl outline-none focus:ring-2 focus:ring-[#ED6E3F] text-sm dark:text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input readOnly value={formData.email} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#1C3540] rounded-xl outline-none text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                        <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#1C3540] rounded-xl outline-none focus:ring-2 focus:ring-[#ED6E3F] text-sm dark:text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Address</label>
                        <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-[#1C3540] rounded-xl outline-none focus:ring-2 focus:ring-[#ED6E3F] text-sm dark:text-white h-24 resize-none" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#043E52] p-6 rounded-3xl border border-slate-100 dark:border-[#1C3540] shadow-sm space-y-4">
                        <h3 className="font-bold text-lg text-[#043E52] dark:text-white border-b border-slate-50 dark:border-slate-800 pb-2 mb-4">Bank Details (For Payouts)</h3>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bank Name</label>
                            <input value={formData.bankName} onChange={e => setFormData({ ...formData, bankName: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1C3540] rounded-xl outline-none focus:ring-2 focus:ring-[#ED6E3F] text-sm dark:text-white" placeholder="e.g. HDFC Bank" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Account Number</label>
                                <input value={formData.accountNumber} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1C3540] rounded-xl outline-none focus:ring-2 focus:ring-[#ED6E3F] text-sm dark:text-white" placeholder="************" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">IFSC Code</label>
                                <input value={formData.ifscCode} onChange={e => setFormData({ ...formData, ifscCode: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1C3540] rounded-xl outline-none focus:ring-2 focus:ring-[#ED6E3F] text-sm dark:text-white" placeholder="HDFC0001234" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={isSaving} className="w-full py-4 bg-[#043E52] dark:bg-[#ED6E3F] text-white rounded-2xl font-bold shadow-lg shadow-blue-900/10 dark:shadow-[#ED6E3F]/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                        {isSaving ? 'Saving Changes...' : <><Save size={20} /> Save Profile</>}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default AgentSettings;
