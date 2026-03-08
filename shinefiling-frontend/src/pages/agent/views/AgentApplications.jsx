
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, RefreshCw, ChevronDown, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';

import AgentApplicationDetails from './AgentApplicationDetails';

const AgentApplications = ({ tasks, loading, onRefresh }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedApplication, setSelectedApplication] = useState(null);

    if (selectedApplication) {
        return <AgentApplicationDetails application={selectedApplication} onBack={() => setSelectedApplication(null)} />;
    }

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.user?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'REJECTED': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
            case 'SUBMITTED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            default: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-[#043E52] dark:text-white">My Applications</h2>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search applications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white dark:bg-[#1C3540] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#ED6E3F] outline-none dark:text-white w-64 md:w-80"
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 pb-2">
                {['ALL', 'PENDING', 'SUBMITTED', 'Action Required', 'COMPLETED', 'REJECTED'].map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${statusFilter === status
                            ? 'bg-[#043E52] text-white border-[#043E52] dark:bg-[#ED6E3F] dark:border-[#ED6E3F]'
                            : 'bg-white dark:bg-[#1C3540] text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        {status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="bg-white dark:bg-[#043E52] rounded-3xl border border-slate-100 dark:border-[#1C3540] shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <RefreshCw className="animate-spin mb-4" size={32} />
                        <p>Loading applications...</p>
                    </div>
                ) : filteredTasks.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-[#1C3540] text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Application ID</th>
                                    <th className="px-6 py-4">Service Type</th>
                                    <th className="px-6 py-4">Client Name</th>
                                    <th className="px-6 py-4">Submitted On</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-[#1C3540]">
                                {filteredTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-[#1C3540]/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-400">#{task.id.slice(-6).toUpperCase()}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-[#043E52] dark:text-white">{task.serviceName}</div>
                                            <div className="text-xs text-slate-400">Business Registration</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                                                    {(task.user?.fullName || 'C').charAt(0)}
                                                </div>
                                                <span className="text-slate-600 dark:text-slate-300">{task.user?.fullName || task.userEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                            {new Date(task.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border border-transparent ${getStatusColor(task.status)}`}>
                                                {task.status?.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => setSelectedApplication(task)} className="text-[#ED6E3F] hover:text-[#A67C52] font-bold text-xs">View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <FileText size={48} className="mb-4 text-slate-200 dark:text-slate-700" />
                        <p className="font-medium">No applications found</p>
                        <p className="text-xs mt-1">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AgentApplications;
