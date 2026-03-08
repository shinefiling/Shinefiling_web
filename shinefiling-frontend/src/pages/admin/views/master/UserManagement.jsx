import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Filter, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { getAllUsers, signupUser, updateUserRole, deleteUser } from '../../../../api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    // Create Form State
    const [newUser, setNewUser] = useState({ fullName: '', email: '', password: '', role: 'USER', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success'|'error', text: '' }

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);
        try {
            // Using signupUser from api.js which maps to /auth/signup
            await signupUser(newUser);
            setMessage({ type: 'success', text: 'User created successfully!' });
            setCreateModalOpen(false);
            setNewUser({ fullName: '', email: '', password: '', role: 'USER', phone: '' }); // Reset
            loadUsers(); // Refresh list
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to create user' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        // Optimistic update
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        try {
            await updateUserRole(userId, newRole);
        } catch (error) {
            console.error("Failed to update role", error);
            alert("Failed to update role on server.");
            loadUsers(); // Revert on failure
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await deleteUser(userId);
                setUsers(users.filter(u => u.id !== userId));
                // alert("User deleted successfully."); 
            } catch (error) {
                console.error("Failed to delete user", error);
                alert("Failed to delete user: " + error.message);
                loadUsers();
            }
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesRole = filter === 'ALL' || u.role === filter;
        const matchesSearch = u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
        return matchesRole && matchesSearch;
    });

    const roleColors = {
        'MASTER_ADMIN': 'bg-purple-100 text-purple-700',
        'SUB_ADMIN': 'bg-blue-100 text-blue-700',
        'AGENT_ADMIN': 'bg-orange-100 text-orange-700',
        'USER': 'bg-gray-100 text-gray-700'
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#043E52]">User Administration</h2>
                    <p className="text-[#3D4D55] text-sm">Manage user access, roles, and profiles.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto items-center">
                    <div className="relative w-full md:w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3D4D55]" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#ED6E3F]/20 focus:border-[#ED6E3F] w-full"
                        />
                    </div>
                    <button onClick={() => setCreateModalOpen(true)} className="px-5 py-2.5 bg-[#043E52] text-white font-bold rounded-xl text-sm shadow-lg hover:bg-[#ED6E3F] transition flex items-center gap-2 whitespace-nowrap w-full md:w-auto justify-center">
                        <Plus size={18} /> Create User
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex bg-white p-1 rounded-xl border border-gray-200 overflow-x-auto w-full md:w-auto items-center max-w-full no-scrollbar mb-4">
                {['ALL', 'MASTER_ADMIN', 'SUB_ADMIN', 'AGENT_ADMIN', 'USER'].map(role => (
                    <button
                        key={role}
                        onClick={() => setFilter(role)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${filter === role ? 'bg-[#FDFBF7] text-[#ED6E3F] border border-[#ED6E3F]/20 shadow-sm' : 'text-[#3D4D55] hover:text-[#043E52]'}`}
                    >
                        {role === 'USER' ? 'CLIENTS' : role.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left text-sm min-w-[800px]">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[11px] tracking-wider">
                                <tr>
                                    <th className="px-6 py-3">User Identity</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.length > 0 ? filteredUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition group">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                                                    {(u.fullName || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#043E52] text-sm">{u.fullName}</div>
                                                    <div className="text-[11px] text-[#3D4D55] font-medium">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <select
                                                value={u.role || 'USER'}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                className={`py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wide outline-none cursor-pointer border-r-8 border-transparent transition-all ${roleColors[u.role]
                                                    ? roleColors[u.role].replace('bg-', 'bg-opacity-10 border-').replace('text-', 'text-')
                                                    : 'bg-gray-50 text-gray-500'
                                                    }`}
                                            >
                                                <option value="USER">Client</option>
                                                <option value="AGENT_ADMIN">Agent</option>
                                                <option value="SUB_ADMIN">Sub-Admin</option>
                                                <option value="MASTER_ADMIN">Master</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${u.status === 'Banned'
                                                ? 'bg-red-50 text-red-600 border-red-100'
                                                : 'bg-green-50 text-green-600 border-green-100'
                                                }`}>
                                                {u.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 rounded-lg transition" title="Edit User"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition" title="Delete User"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="text-center py-12 text-gray-400 font-bold text-sm">No users found matching filters.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create User Modal */}
            {createPortal(
                <AnimatePresence>
                    {isCreateModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setCreateModalOpen(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
                            >
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="text-xl font-bold text-[#043E52]">Create New User</h3>
                                    <button onClick={() => setCreateModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition"><X size={20} className="text-gray-500" /></button>
                                </div>

                                <form onSubmit={handleCreateUser} className="p-6 overflow-y-auto space-y-4">
                                    {message && (
                                        <div className={`p-3 rounded-lg text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                                            {message.text}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={newUser.fullName}
                                            onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition"
                                            placeholder="e.g. Rahul Sharma"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={newUser.email}
                                            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition"
                                            placeholder="rahul@example.com"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={newUser.password}
                                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                                            <select
                                                value={newUser.role}
                                                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition bg-white"
                                            >
                                                <option value="USER">Client User</option>
                                                <option value="AGENT_ADMIN">Agent</option>
                                                <option value="SUB_ADMIN">Sub-Admin</option>
                                                <option value="MASTER_ADMIN">Master Admin</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3 bg-[#043E52] text-white font-bold rounded-xl mt-4 hover:bg-[#ED6E3F] transition disabled:opacity-50 flex justify-center items-center gap-2"
                                    >
                                        {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Plus size={18} />}
                                        {isSubmitting ? 'Creating...' : 'Create Account'}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default UserManagement;
