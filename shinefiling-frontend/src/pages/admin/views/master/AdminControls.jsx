import React, { useState, useEffect } from 'react';
import {
    Users, Briefcase, UserCheck, Shield, ChevronRight, Search, Filter,
    MoreVertical, UserPlus, Lock, Key, Ban, CheckCircle, Wallet, Edit2, Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllUsers } from '../../../../api';

const AccessManagement = ({ defaultTab = 'users' }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);

    useEffect(() => { if (defaultTab) setActiveTab(defaultTab); }, [defaultTab]);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);

    // Filters for tabs
    const [userFilter, setUserFilter] = useState('All');

    // Fetch users for demonstration
    useEffect(() => {
        const fetchData = async () => {
            try {
                const allUsers = await getAllUsers();
                setUsers(allUsers || []);
            } catch (e) { console.error(e); }
        };
        fetchData();
    }, []);

    // Filter Logic
    const getFilteredData = () => {
        let data = users;
        // Basic Role Filtering
        if (activeTab === 'users') data = users.filter(u => u.role === 'USER' || !u.role);
        if (activeTab === 'cas') data = users.filter(u => u.role === 'CA');
        if (activeTab === 'agents') data = users.filter(u => u.role === 'AGENT' || u.role === 'AGENT_ADMIN');

        // Search Filter
        if (searchTerm) {
            data = data.filter(u =>
                u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return data;
    };

    const filteredData = getFilteredData();

    // Tab items
    const tabs = [
        { id: 'users', label: 'User Controls', icon: Users, color: 'blue' },
        { id: 'cas', label: 'CA Controls', icon: Briefcase, color: 'purple' },
        { id: 'agents', label: 'Agent Controls', icon: UserCheck, color: 'green' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 font-[Roboto,sans-serif]">

            {/* Header Area */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                    <Shield className="text-[#F97316]" size={28} /> Access & Roles <span className="text-slate-300 dark:text-slate-600">/</span> {activeTab === 'users' ? 'User Access' : activeTab === 'cas' ? 'CA Permissions' : 'Agent Permissions'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Control access, permissions, and status for Users, CAs, and Agents.
                </p>
            </div>

            {/* Custom Tab Switcher - Separated Row */}


            {/* Controls & Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab === 'cas' ? 'Chartered Accountants' : activeTab === 'agents' ? 'Agents' : 'Users'}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-[#F97316]/20 text-slate-700 dark:text-slate-200"
                    />
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 text-sm font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700">
                        <Filter size={16} /> Filter Status
                    </button>
                    <button className="px-4 py-2 bg-[#043E52] text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#F97316] transition shadow-lg shadow-orange-500/20">
                        <UserPlus size={16} /> Invite New {activeTab === 'users' ? 'User' : activeTab === 'cas' ? 'CA' : 'Agent'}
                    </button>
                </div>
            </div>

            {/* Main Content Table area */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden min-h-[500px]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="p-6">Identity</th>
                            <th className="p-6">Role & Status</th>
                            <th className="p-6">Contact Details</th>
                            {activeTab === 'agents' && <th className="p-6">Commission</th>}
                            {activeTab === 'cas' && <th className="p-6">Assigned Work</th>}
                            <th className="p-6 text-right">Quick Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredData.length > 0 ? (
                            filteredData.map((user, i) => (
                                <tr key={user.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${activeTab === 'agents' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                                                activeTab === 'cas' ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                                                    'bg-gradient-to-br from-blue-400 to-blue-600'
                                                }`}>
                                                {user.fullName?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white">{user.fullName || 'Unknown'}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">ID: #{1000 + i}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col items-start gap-2">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold uppercase border border-slate-200 dark:border-slate-600">
                                                {user.role || 'USER'}
                                            </span>
                                            <span className={`flex items-center gap-1 text-xs font-bold ${user.active !== false ? 'text-green-600' : 'text-red-500'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.active !== false ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                {user.active !== false ? 'Active Account' : 'Suspended'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400" /> {user.email}</div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">Joined: {new Date().toLocaleDateString()}</div>
                                        </div>
                                    </td>

                                    {/* Specific Columns */}
                                    {activeTab === 'agents' && (
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 dark:bg-green-900/10 px-3 py-1.5 rounded-lg w-fit">
                                                <Wallet size={16} /> 15%
                                            </div>
                                        </td>
                                    )}
                                    {activeTab === 'cas' && (
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-purple-600 font-bold bg-purple-50 dark:bg-purple-900/10 px-3 py-1.5 rounded-lg w-fit">
                                                <Briefcase size={16} /> 12 Orders
                                            </div>
                                        </td>
                                    )}

                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button title="Edit Details" className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg hover:text-slate-700 dark:hover:text-slate-200 transition">
                                                <Edit2 size={16} />
                                            </button>
                                            <button title="Reset Password" className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg hover:text-slate-700 dark:hover:text-slate-200 transition">
                                                <Key size={16} />
                                            </button>
                                            <button title={user.active !== false ? "Suspend User" : "Activate User"} className={`p-2 rounded-lg transition ${user.active !== false ? 'text-red-400 hover:bg-red-50 hover:text-red-600' : 'text-green-400 hover:bg-green-50 hover:text-green-600'}`}>
                                                {user.active !== false ? <Ban size={16} /> : <CheckCircle size={16} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-slate-400 flex flex-col items-center">
                                    <Users size={48} className="mb-4 opacity-20" />
                                    No {activeTab} found in current records.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccessManagement;
