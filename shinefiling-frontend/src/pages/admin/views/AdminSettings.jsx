import React, { useState, useEffect } from 'react';
import { User, Lock, Upload, Save, Shield, Mail, Phone, Building } from 'lucide-react';
import { updateUserProfile, uploadProfilePicture } from '../../../api';

const AdminSettings = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

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

            // Update state
            const updatedUser = { ...user, profileImage: res.profileImage };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Dispatch global event
            window.dispatchEvent(new Event('userUpdated'));

            setMsg({ type: 'success', text: "Profile Picture Updated!" });
        } catch (error) {
            console.error(error);
            setMsg({ type: 'error', text: 'Failed to upload photo.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
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

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-[#043E52]">Account Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-50 flex items-center justify-center">
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-3xl font-bold text-gray-300">{user.fullName?.[0]}</div>
                                )}
                            </div>
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                                <Upload size={20} />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#043E52]">{user.fullName || 'Admin User'}</h3>
                            <p className="text-gray-500 text-sm">{user.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-[#ED6E3F]/10 text-[#ED6E3F] text-xs font-bold rounded-full uppercase tracking-wider">
                                {user.role?.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    {msg.text && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {msg.text}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-[#ED6E3F]/20 transition-all">
                                    <User size={18} className="text-gray-400" />
                                    <input
                                        name="fullName"
                                        value={user.fullName || ''}
                                        onChange={handleChange}
                                        className="bg-transparent w-full outline-none text-sm font-semibold text-[#043E52]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mobile Number</label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-[#ED6E3F]/20 transition-all">
                                    <Phone size={18} className="text-gray-400" />
                                    <input
                                        name="mobile"
                                        value={user.mobile || ''}
                                        onChange={handleChange}
                                        className="bg-transparent w-full outline-none text-sm font-semibold text-[#043E52]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-[#043E52] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-[#1A3642] transition-all flex items-center gap-2"
                            >
                                <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Security Box */}
                <div className="space-y-6">
                    <div className="bg-[#043E52] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm"><Shield size={20} /></div>
                                <h4 className="font-bold text-lg">Admin Security</h4>
                            </div>
                            <p className="text-gray-400 text-xs mb-6 leading-relaxed">Ensure your account is protected with a strong password and 2FA enabled.</p>
                            <button className="w-full py-2.5 bg-[#ED6E3F] text-white rounded-lg text-sm font-bold hover:bg-[#a37a58] transition-colors shadow-lg">Change Password</button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-[#043E52] mb-4 text-sm uppercase tracking-wider">System Preferences</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                                <span className="text-sm font-semibold text-gray-600">Email Notifications</span>
                                <div className="w-10 h-5 bg-emerald-500 rounded-full relative"><div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1"></div></div>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                                <span className="text-sm font-semibold text-gray-600">Dark Mode</span>
                                <div className="w-10 h-5 bg-gray-200 rounded-full relative"><div className="w-3 h-3 bg-white rounded-full absolute top-1 left-1"></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
