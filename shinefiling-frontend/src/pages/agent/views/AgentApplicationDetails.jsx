
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, FileText, CheckCircle, User, MessageCircle, Link } from 'lucide-react';

// This is a sub-view component that will be rendered when a specific application is selected
const AgentApplicationDetails = ({ application, onBack }) => {
    if (!application) return null;

    const statusColors = {
        'COMPLETED': 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800',
        'SUBMITTED': 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800',
        'REJECTED': 'text-rose-500 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800',
        'PENDING': 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800'
    };

    const statusStyle = statusColors[application.status] || statusColors['PENDING'];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold hover:text-[#043E52] dark:hover:text-white transition-colors">
                <ArrowLeft size={18} /> Back to Applications
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-[#043E52] dark:text-white">{application.serviceName}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusStyle}`}>
                            {application.status.replace('_', ' ')}
                        </span>
                    </div>
                    <p className="text-slate-500 font-mono text-sm">Application ID: #{application.id.slice(0, 8).toUpperCase()}</p>
                </div>
                {/* Actions */}
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1C3540] flex items-center gap-2">
                        <MessageCircle size={16} /> Contact Support
                    </button>
                    <button className="px-4 py-2 bg-[#043E52] dark:bg-[#ED6E3F] text-white rounded-xl font-bold flex items-center gap-2 shadow-lg">
                        <FileText size={16} /> View Invoice
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-[#043E52] rounded-3xl border border-slate-100 dark:border-[#1C3540] p-6 shadow-sm">
                        <h3 className="font-bold text-[#043E52] dark:text-white mb-4 flex items-center gap-2">
                            <User className="text-[#ED6E3F]" size={20} /> Client Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                                <p className="font-medium text-slate-700 dark:text-slate-200">{application.user?.fullName || application.userEmail}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                                <p className="font-medium text-slate-700 dark:text-slate-200">{application.userEmail}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Phone Number</label>
                                <p className="font-medium text-slate-700 dark:text-slate-200">{application.user?.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Submitted On</label>
                                <p className="font-medium text-slate-700 dark:text-slate-200">{new Date(application.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#043E52] rounded-3xl border border-slate-100 dark:border-[#1C3540] p-6 shadow-sm">
                        <h3 className="font-bold text-[#043E52] dark:text-white mb-4 flex items-center gap-2">
                            <Clock className="text-[#ED6E3F]" size={20} /> Timeline
                        </h3>
                        <div className="relative pl-4 space-y-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-[#1C3540]">
                            {/* Mock Timeline - In reality, fetch activity logs */}
                            <div className="relative pl-6">
                                <div className="absolute left-[-5px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-[#043E52]"></div>
                                <p className="text-sm font-bold text-[#043E52] dark:text-white">Application Submitted</p>
                                <p className="text-xs text-slate-400">{new Date(application.createdAt).toLocaleString()}</p>
                            </div>
                            {application.status === 'COMPLETED' && (
                                <div className="relative pl-6">
                                    <div className="absolute left-[-5px] top-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white dark:ring-[#043E52]"></div>
                                    <p className="text-sm font-bold text-[#043E52] dark:text-white">Processing Complete</p>
                                    <p className="text-xs text-slate-400">Documents delivered to client</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-[#ED6E3F]/10 rounded-3xl p-6 border border-[#ED6E3F]/20">
                        <h4 className="text-xs font-bold text-[#ED6E3F] uppercase mb-1">Your Commission</h4>
                        <p className="text-3xl font-bold text-[#043E52] dark:text-white">₹{application.status === 'COMPLETED' ? '500' : '0'}</p>
                        <p className="text-xs text-slate-500 mt-2">
                            {application.status === 'COMPLETED'
                                ? 'Commission credited to wallet.'
                                : 'Commission will be credited upon completion.'}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#043E52] rounded-3xl border border-slate-100 dark:border-[#1C3540] p-6 shadow-sm">
                        <h4 className="font-bold text-[#043E52] dark:text-white mb-4 flex items-center gap-2">Documents</h4>
                        <div className="space-y-3">
                            {/* Mock Doc Links */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#1C3540]/50 hover:bg-slate-100 transition-colors cursor-pointer group">
                                <div className="p-2 bg-white dark:bg-[#1C3540] rounded-lg text-slate-400"><FileText size={16} /></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-[#043E52] dark:text-white truncate">Application Form.pdf</p>
                                    <p className="text-[10px] text-slate-400">1.2 MB</p>
                                </div>
                                <Link size={14} className="text-slate-400 group-hover:text-[#ED6E3F]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AgentApplicationDetails;
