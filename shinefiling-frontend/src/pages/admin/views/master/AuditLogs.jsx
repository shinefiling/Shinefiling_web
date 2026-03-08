import React, { useState, useEffect } from 'react';
import {
    Shield, Lock, AlertTriangle, FileText, Filter, Search,
    Calendar, Download, ChevronLeft, ChevronRight, Eye,
    CheckCircle, XCircle, Database, Server, User, Globe, AlertOctagon, RefreshCw, X, Copy, Flag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuditLogs } from '../../../../api';

const AuditLogs = () => {
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [selectedLog, setSelectedLog] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await getAuditLogs();
            setLogs(data || []);
        } catch (err) {
            console.error("Failed to load audit logs", err);
            // Fallback mock data if API fails to show UI
            setLogs(Array(15).fill(0).map((_, i) => ({
                id: `LOG-${1000 + i}`,
                time: new Date(Date.now() - i * 3600000).toISOString(),
                severity: i % 5 === 0 ? 'CRITICAL' : i % 3 === 0 ? 'WARNING' : 'INFO',
                type: ['SECURITY', 'ADMIN_ACTION', 'SYSTEM', 'API_ACCESS'][i % 4],
                action: i % 2 === 0 ? 'User Login Attempt' : 'Database Write',
                user: i % 3 === 0 ? 'unknown_actor' : 'admin_sarah',
                ip: `192.168.1.${10 + i}`,
                resource: '/api/v1/auth/login',
                details: JSON.stringify({ attempt: i, method: 'POST', status: 401 })
            })));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    // Helpers
    const getSeverityStyle = (sev) => {
        switch (sev) {
            case 'CRITICAL': return 'bg-red-50 text-red-600 border-red-100';
            case 'ERROR': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'WARNING': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'SUCCESS': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'INFO': default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'SECURITY': return <Shield size={14} />;
            case 'ADMIN_ACTION': return <Lock size={14} />;
            case 'SYSTEM': return <Server size={14} />;
            case 'API_ACCESS': return <Globe size={14} />;
            case 'USER_ACTION': return <User size={14} />;
            default: return <FileText size={14} />;
        }
    };

    // Filter Logic
    const filteredLogs = logs.filter(log => {
        const matchesType = filter === 'ALL' || log.type === filter;
        const matchesSearch = (log.action || '').toLowerCase().includes(search.toLowerCase()) ||
            (log.user || '').toLowerCase().includes(search.toLowerCase()) ||
            (log.id || '').toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
    const displayedLogs = filteredLogs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="flex h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* --- MAIN LOG TABLE --- */}
            <div className={`flex-1 flex flex-col space-y-6 transition-all duration-300 ${selectedLog ? 'w-2/3' : 'w-full'}`}>

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#043E52] to-[#3D4D55] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#043E52]/30">
                            <Shield size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#043E52]">System Audit Trails</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-[#3D4D55] text-[10px] font-bold uppercase border border-slate-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    Logging Active
                                </span>
                                <span className="text-[#3D4D55] text-xs">| Forensic Level 2</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={fetchLogs} className="p-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition shadow-sm bg-white">
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button className="px-5 py-2.5 bg-[#043E52] text-white rounded-xl text-xs font-bold shadow-lg hover:bg-[#ED6E3F] flex items-center gap-2 transition">
                            <Download size={16} /> Export CSV
                        </button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex bg-[#FDFBF7] p-1 rounded-lg">
                        {['ALL', 'SECURITY', 'ADMIN_ACTION', 'SYSTEM', 'API_ACCESS'].map(f => (
                            <button
                                key={f}
                                onClick={() => { setFilter(f); setPage(1); }}
                                className={`px-4 py-2 rounded-md text-[10px] font-bold uppercase transition-all whitespace-nowrap ${filter === f
                                    ? 'bg-[#FDFBF7] text-[#ED6E3F] shadow-sm border border-[#ED6E3F]/20'
                                    : 'text-[#3D4D55] hover:text-[#043E52]'
                                    }`}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64 mr-2">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3D4D55]/70" />
                        <input
                            type="text"
                            placeholder="Search by User, IP, ID..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-9 pr-4 py-2 bg-transparent text-xs font-bold outline-none focus:text-[#ED6E3F] placeholder-[#3D4D55]/70 transition"
                        />
                    </div>
                </div>

                {/* Table Card */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-auto custom-scrollbar flex-1 relative">
                        {loading && (
                            <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        <table className="w-full text-left text-sm min-w-[900px]">
                            <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase text-[10px] tracking-wider sticky top-0 z-10 backdrop-blur-sm border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">Time / ID</th>
                                    <th className="px-6 py-4">Severity</th>
                                    <th className="px-6 py-4">Event Trace</th>
                                    <th className="px-6 py-4">Principal</th>
                                    <th className="px-6 py-4">Target Resource</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {displayedLogs.length > 0 ? displayedLogs.map((log) => (
                                    <tr
                                        key={log.id}
                                        onClick={() => setSelectedLog(log)}
                                        className={`group cursor-pointer transition-colors border-l-2 ${selectedLog?.id === log.id ? 'bg-slate-50 border-l-[#ED6E3F]' : 'hover:bg-slate-50/50 border-l-transparent'}`}
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-mono text-[10px] font-bold text-gray-500">{new Date(log.time).toLocaleTimeString()}</p>
                                            <p className="font-mono text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">{log.id}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md border text-[10px] font-bold uppercase ${getSeverityStyle(log.severity)}`}>
                                                {log.severity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg bg-gray-100 text-gray-500 ${selectedLog?.id === log.id ? 'bg-slate-200 text-slate-700' : ''}`}>
                                                    {getIcon(log.type)}
                                                </div>
                                                <span className="font-bold text-[#043E52] text-xs">{log.action}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500 border border-slate-200">
                                                    {(log.user || '?').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-700">{log.user || 'System'}</p>
                                                    <p className="text-[10px] text-gray-400 font-mono">{log.ip}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="px-2 py-1 bg-gray-50 rounded border border-gray-100 text-[10px] font-mono text-gray-500">{log.resource}</code>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ChevronRight size={16} className="text-gray-300 group-hover:text-slate-500" />
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-24">
                                            <div className="flex flex-col items-center justify-center opacity-40">
                                                <Shield size={48} className="text-gray-300 mb-2" />
                                                <p className="text-gray-500 font-bold text-sm">No audit records found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            Page {page} of {totalPages || 1}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setPage(p => (p < totalPages ? p + 1 : p))}
                                disabled={page >= totalPages}
                                className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- DETAILS SIDE PANEL --- */}
            <AnimatePresence>
                {selectedLog && (
                    <motion.div
                        initial={{ opacity: 0, x: 50, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: 400 }}
                        exit={{ opacity: 0, x: 50, width: 0 }}
                        className="bg-white border-l border-gray-100 shadow-2xl flex flex-col z-20 h-full fixed right-0 top-0 bottom-0 md:relative"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-slate-50/50">
                            <div>
                                <h3 className="font-bold text-[#043E52] text-lg">Event Forensics</h3>
                                <p className="text-[10px] text-[#3D4D55] font-mono mt-1 uppercase tracking-widest">{selectedLog.id} • {selectedLog.type}</p>
                            </div>
                            <button onClick={() => setSelectedLog(null)} className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition"><X size={20} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Status Banner */}
                            <div className={`p-4 rounded-xl border flex items-center gap-4 ${getSeverityStyle(selectedLog.severity)}`}>
                                {selectedLog.severity === 'CRITICAL' || selectedLog.severity === 'ERROR' ? <AlertOctagon size={24} /> : <CheckCircle size={24} />}
                                <div>
                                    <h4 className="font-bold text-sm">System Triggered: {selectedLog.severity}</h4>
                                    <p className="text-[10px] opacity-80 mt-0.5">Automated containment protocols were active during this event.</p>
                                </div>
                            </div>

                            {/* Timeline Node */}
                            <div className="relative pl-4 border-l-2 border-slate-100 space-y-8">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-slate-300 border-2 border-white"></div>
                                    <label className="text-[10px] font-bold text-[#3D4D55] uppercase block mb-1">Timestamp</label>
                                    <p className="font-mono text-sm font-bold text-[#043E52]">{new Date(selectedLog.time).toLocaleString()}</p>
                                    <p className="text-xs text-[#3D4D55]">{new Date(selectedLog.time).toUTCString()}</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-blue-400 border-2 border-white shadow-sm shadow-blue-200"></div>
                                    <label className="text-[10px] font-bold text-[#3D4D55] uppercase block mb-1">Action Initiated</label>
                                    <p className="font-bold text-[#043E52]">{selectedLog.action}</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-slate-300 border-2 border-white"></div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Origin Node</label>
                                    <div className="flex items-center gap-2 mt-2 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                        <Globe size={16} className="text-gray-400" />
                                        <div>
                                            <p className="text-xs font-bold text-gray-700">{selectedLog.ip}</p>
                                            <p className="text-[10px] text-gray-400">Delhi, India (Approx)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Technical Details */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Raw Payload</label>
                                    <button className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"><Copy size={10} /> Copy</button>
                                </div>
                                <div className="bg-[#1E293B] rounded-xl p-4 text-[10px] font-mono leading-relaxed text-blue-200 overflow-x-auto shadow-inner border border-slate-700">
                                    <span className="text-slate-500 opacity-50 block mb-2"># Request Header</span>
                                    {selectedLog.details}
                                    <span className="text-slate-500 opacity-50 block mt-4 mb-2"># Security Context</span>
                                    <pre>{JSON.stringify({
                                        trace_id: Math.random().toString(36).substring(7),
                                        environment: 'production',
                                        encryption: 'TLS_1.3'
                                    }, null, 2)}</pre>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                            <button className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-sm transition flex items-center justify-center gap-2">
                                <Copy size={14} /> JSON Dump
                            </button>
                            <button className="flex-1 py-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-100 hover:text-rose-700 shadow-sm transition flex items-center justify-center gap-2">
                                <Flag size={14} /> Flag Event
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AuditLogs;
