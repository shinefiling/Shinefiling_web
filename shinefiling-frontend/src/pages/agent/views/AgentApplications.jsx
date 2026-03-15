import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, RefreshCw, ChevronDown, CheckCircle, Clock, XCircle, FileText, ChevronRight, Hash, Tag, Calendar, User, MoreHorizontal, IndianRupee } from 'lucide-react';
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

    const getStatusStyles = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-800/30';
            case 'REJECTED': return 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 border-rose-100 dark:border-rose-800/30';
            case 'SUBMITTED': return 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 border-blue-100 dark:border-blue-800/30';
            case 'Action Required': return 'bg-orange-50 text-orange-600 dark:bg-orange-950/20 border-orange-100 dark:border-orange-800/30';
            default: return 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 border-amber-100 dark:border-amber-800/30';
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 font-roboto">
            {/* Action Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-[#043E52] p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-[#1C3540]">
                <div>
                    <h2 className="text-2xl font-bold text-[#043E52] dark:text-white flex items-center gap-3">
                        <FileText size={24} className="text-[#ED6E3F]" /> Application Tracker
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Manage and track all client service requests</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID or Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-72 pl-12 pr-4 py-3 bg-slate-50 dark:bg-[#1C3540] border-none rounded-2xl text-[13px] font-bold focus:ring-2 focus:ring-[#ED6E3F] outline-none dark:text-white transition-all"
                        />
                    </div>
                    <button 
                        onClick={onRefresh}
                        className="p-3 bg-slate-50 dark:bg-[#1C3540] text-slate-500 rounded-2xl hover:bg-slate-100 transition-all border border-transparent active:scale-95"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin text-[#ED6E3F]' : ''} />
                    </button>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 px-2 overflow-x-auto no-scrollbar pb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Filter Status:</span>
                {['ALL', 'PENDING', 'SUBMITTED', 'Action Required', 'COMPLETED', 'REJECTED'].map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all border whitespace-nowrap ${
                            statusFilter === status
                            ? 'bg-[#ED6E3F] text-white border-[#ED6E3F] shadow-lg shadow-[#ED6E3F]/20'
                            : 'bg-white dark:bg-[#1C3540] text-slate-500 border-slate-100 dark:border-[#1C3540] hover:border-[#ED6E3F]/30'
                        }`}
                    >
                        {status.replace(/_/g, ' ')}
                    </button>
                ))}
            </div>

            {/* Applications List */}
            <div className="bg-white dark:bg-[#043E52] rounded-[40px] shadow-sm border border-slate-100 dark:border-[#1C3540] overflow-hidden min-h-[500px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 text-slate-400 font-bold">
                        <div className="w-16 h-16 relative mb-4">
                            <div className="absolute inset-0 border-4 border-[#ED6E3F]/10 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-[#ED6E3F] rounded-full animate-spin"></div>
                        </div>
                        <p className="tracking-widest uppercase text-xs">Syncing data...</p>
                    </div>
                ) : filteredTasks.length > 0 ? (
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-[#1C3540]/30 text-slate-400 font-black uppercase text-[10px] tracking-widest">
                                <tr>
                                    <th className="px-8 py-5 flex items-center gap-2"><Hash size={12} /> Reference</th>
                                    <th className="px-6 py-5"><Tag size={12} className="inline mr-2" /> Service Order</th>
                                    <th className="px-6 py-5"><User size={12} className="inline mr-2" /> Client Details</th>
                                    <th className="px-6 py-5"><Calendar size={12} className="inline mr-2" /> Timeline</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {filteredTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-[#1C3540]/30 transition-all group">
                                        <td className="px-8 py-6">
                                            <span className="font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded-lg">
                                                #{task.id?.toString().slice(-6).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#043E52] dark:text-white text-[14px] leading-none mb-1.5">{task.serviceName}</span>
                                                <span className="text-[11px] text-[#ED6E3F] font-bold uppercase tracking-tight opacity-70">Business Registration</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-slate-800 text-[#ED6E3F] flex items-center justify-center font-black text-xs border border-orange-100 dark:border-slate-700">
                                                    {(task.user?.fullName || 'C').charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{task.user?.fullName || 'Active Client'}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">{task.userEmail}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[12px] font-bold text-slate-600 dark:text-slate-400">{new Date(task.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                <span className="text-[10px] text-slate-400 font-mono italic">Submitted</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight border ${getStatusStyles(task?.status)}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                {task.status?.replace(/_/g, ' ') || 'PROCESSING'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => setSelectedApplication(task)} 
                                                className="px-5 py-2 bg-[#043E52] dark:bg-white text-white dark:text-[#043E52] text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-black/5 hover:scale-105 active:scale-95 transition-all"
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 text-center">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/30 rounded-full flex items-center justify-center mb-6">
                            <Search size={40} className="text-slate-200 dark:text-slate-700" />
                        </div>
                        <h3 className="text-xl font-bold text-[#043E52] dark:text-white mb-2">Refine Search?</h3>
                        <p className="text-slate-400 text-sm max-w-xs px-6">We couldn't find any applications matching your current criteria.</p>
                        <button 
                            onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}
                            className="mt-6 text-[#ED6E3F] text-xs font-black uppercase tracking-widest hover:underline"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AgentApplications;
