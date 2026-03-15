import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    Users, Shield, FileText, CheckCircle, XCircle, Search, Filter, Plus, Eye,
    Trash2, AlertTriangle, Send, Phone, Mail, Award, Briefcase, IndianRupee,
    MoreVertical, Edit2, Ban, UserCheck, Calendar, MapPin, X, Building2, Landmark
} from 'lucide-react';
import { getAllUsers, approveAgentKyc, rejectAgentKyc, deleteUser, BASE_URL } from '../../../../api';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-Component: Agent List Item ---
const AgentListItem = ({ agent, onSelect, onAction }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => onSelect(agent)}>
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${agent.kycStatus === 'VERIFIED' ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' :
                    agent.kycStatus === 'REJECTED' ? 'bg-gradient-to-br from-red-400 to-red-600 text-white' :
                        'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                    }`}>
                    {agent.fullName?.charAt(0) || 'A'}
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-[#F97316] transition-colors">{agent.fullName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">ID: {agent.role === 'CA' ? 'FR' : 'PT' }-{agent.id}</p>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${agent.kycStatus === 'VERIFIED' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' :
                    agent.kycStatus === 'SUBMITTED' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30' :
                        agent.kycStatus === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' :
                            'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30'
                    }`}>
                    {agent.kycStatus || 'PENDING'}
                </span>
                <span className="text-[10px] text-slate-400">Joined: {new Date(agent.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 mb-3">
            <div className="flex items-center gap-1.5"><Mail size={12} className="text-slate-400" /> <span className="truncate">{agent.email}</span></div>
            <div className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> {agent.mobile || 'N/A'}</div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700">
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500 dark:text-slate-300">Level 1</span>
                <span className="text-[10px] text-slate-400">0 Clients</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onAction(agent, 'view_docs'); }} className="text-xs font-bold text-blue-500 hover:underline">
                View Profile
            </button>
        </div>
    </div>
);

// --- Sub-Component: Agent Details View (Right Panel) ---
const AgentDetailsPanel = ({ agent, onClose, onAction, stats = { earnings: '₹0.00', referrals: 0, pending: 0 } }) => {
    const [showMenu, setShowMenu] = useState(false);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClick = () => setShowMenu(false);
        if (showMenu) window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [showMenu]);

    const getFullPath = (path) => {
        if (!path || typeof path !== 'string') return '';
        if (path.startsWith('http')) return path;
        const base = BASE_URL.replace(/\/api$/, '');
        return base + (path.startsWith('/') ? path : '/' + path);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl h-full flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Header Cover */}
            <div className="h-20 bg-gradient-to-r from-slate-800 to-slate-900 relative flex-shrink-0">
                <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-1 rounded-full backdrop-blur-sm transition z-10">
                    <X size={18} />
                </button>
            </div>

            {/* Profile Header (Static) */}
            <div className="px-6 relative z-10 flex-shrink-0">
                <div className="flex justify-between items-end -mt-10 mb-4">
                    <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-700 shadow-xl flex items-center justify-center text-3xl font-bold text-slate-700 dark:text-slate-200 overflow-hidden relative">
                        {(() => {
                            let docs = {};
                            try { 
                                docs = typeof agent.kycDocuments === 'string' 
                                    ? JSON.parse(agent.kycDocuments || '{}') 
                                    : (agent.kycDocuments || {}); 
                            } catch (e) {
                                console.error("Failed to parse kycDocuments for agent", agent.id, e);
                            }
                            const selfie = docs?.selfie;
                            return selfie && typeof selfie === 'string' ? (
                                <img src={getFullPath(selfie)} alt={agent.fullName} className="w-full h-full object-cover" />
                            ) : agent.fullName?.charAt(0);
                        })()}
                    </div>
                    <div className="flex gap-2 mb-2">
                        {agent.kycStatus === 'SUBMITTED' && (
                            <>
                                <button onClick={() => onAction(agent, 'approve')} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95">
                                    <CheckCircle size={14} /> Approve
                                </button>
                                <button onClick={() => onAction(agent, 'reject')} className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-bold hover:bg-rose-100 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95">
                                    <XCircle size={14} /> Reject
                                </button>
                            </>
                        )}
                        <div className="relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                                className={`p-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${showMenu ? 'bg-slate-100 dark:bg-slate-700 ring-4 ring-slate-100 dark:ring-slate-800' : ''}`}
                            >
                                <MoreVertical size={18} />
                            </button>

                            <AnimatePresence>
                                {showMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        className="absolute right-0 top-full mt-3 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-[100] py-1.5"
                                    >
                                        <button onClick={() => onAction(agent, 'edit')} className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                                            <Edit2 size={14} /> Edit Profile
                                        </button>
                                        <button onClick={() => onAction(agent, 'reset_password')} className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                                            <Shield size={14} /> Reset Password
                                        </button>
                                        <div className="border-t border-slate-50 dark:border-slate-700 my-1"></div>
                                        <button onClick={() => onAction(agent, 'suspend')} className="w-full px-4 py-2.5 text-left text-xs font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 flex items-center gap-2">
                                            <Ban size={14} /> Suspend Account
                                        </button>
                                        <button onClick={() => onAction(agent, 'delete')} className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2">
                                            <Trash2 size={14} /> Delete Permanently
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{agent.fullName}</h2>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                        <MapPin size={12} className="text-[#F97316]" /> Chennai, India • Member since {new Date(agent.createdAt).getFullYear()}
                    </div>
                </div>
            </div>

            {/* Scrollable Context Body */}
            <div className="px-6 pb-6 flex-1 overflow-y-auto custom-scrollbar">
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Earnings</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white mt-1">{stats.earnings}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Referrals</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white mt-1">{stats.referrals}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Pending</p>
                        <p className="text-sm font-bold text-orange-500 mt-1">{stats.pending}</p>
                    </div>
                </div>

                {/* Document Section */}
                <div className="space-y-4 mb-6">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                        <FileText size={16} className="text-[#F97316]" /> {agent.role === 'CA' ? 'Freelancer Compliance Dossier' : 'Partner KYC Documents'}
                    </h3>
                    {(() => {
                        let docs = {};
                        try { 
                            docs = typeof agent.kycDocuments === 'string' 
                                ? JSON.parse(agent.kycDocuments || '{}') 
                                : (agent.kycDocuments || {}); 
                        } catch (e) { }

                        const docList = agent.role === 'CA'
                            ? [
                                { id: 'caCertificate', label: 'CA Certificate', path: docs.caCertificate },
                                { id: 'copCertificate', label: 'COP Certificate', path: docs.copCertificate },
                                { id: 'panCard', label: 'PAN Card', path: docs.panCard },
                                { id: 'aadharFront', label: 'Aadhar Front', path: docs.aadharFront },
                                { id: 'aadharBack', label: 'Aadhar Back', path: docs.aadharBack },
                                { id: 'firmRegistrationCertificate', label: 'Firm Reg. Cert.', path: docs.firmRegistrationCertificate },
                                { id: 'cancelledCheque', label: 'Bank Document', path: docs.cancelledCheque },
                                { id: 'signatureFile', label: 'Digital Signature', path: docs.signatureFile },
                                { id: 'selfie', label: 'Profile Photo / Selfie', path: docs.selfie }
                            ].filter(d => d.path)
                            : [
                                { id: 'pan', label: 'PAN Card', path: docs.pan },
                                { id: 'aadhaar', label: 'Aadhar Card', path: docs.aadhaar }
                            ].filter(d => d.path);

                        if (docList.length === 0) return <div className="text-center py-4 text-slate-400 text-xs italic bg-slate-50 dark:bg-slate-900/20 rounded-lg">No documents submitted yet.</div>;

                        return (
                            <div className="grid grid-cols-2 gap-3">
                                {docList.map(doc => (
                                    <div key={doc.id} className="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-[#F97316]/30 transition-colors group relative">
                                        <div className="aspect-[4/3] bg-white dark:bg-slate-800 rounded mb-2 flex items-center justify-center overflow-hidden">
                                            {typeof doc.path === 'string' && doc.path.match(/\.(jpeg|jpg|gif|png)$/) ? (
                                                <img src={getFullPath(doc.path)} alt={doc.label} className="w-full h-full object-cover" />
                                            ) : doc.path ? (
                                                <div className="flex flex-col items-center gap-1">
                                                    <FileText size={24} className="text-blue-500" />
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase">PDF VIEW</span>
                                                </div>
                                            ) : (
                                                <FileText className="text-slate-200" />
                                            )}
                                        </div>
                                        <p className="text-[10px] font-bold capitalize text-slate-700 dark:text-slate-300 truncate">{doc.label}</p>
                                        <p className="text-[9px] text-slate-400 font-mono truncate">{typeof doc.path === 'string' ? doc.path.split('/').pop() : 'N/A'}</p>

                                        {doc.path && (
                                            <a href={getFullPath(doc.path)} target="_blank" rel="noreferrer" className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Eye size={12} className="text-slate-600" />
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </div>

                {/* CA Specific Info */}
                {agent.role === 'CA' && (
                    <div className="space-y-4 mb-6">
                        {(() => {
                            let docs = {};
                            try { 
                                docs = typeof agent.kycDocuments === 'string' 
                                    ? JSON.parse(agent.kycDocuments || '{}') 
                                    : (agent.kycDocuments || {}); 
                            } catch (e) { }

                            return (
                                <>
                                    <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                                        <Award size={16} className="text-blue-500" /> Professional Credentials
                                    </h3>
                                    <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/20 space-y-3">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500">Membership No.</span>
                                            <span className="font-bold text-slate-800 dark:text-white">{docs.caMembershipNumber || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500">COP Number</span>
                                            <span className="font-bold text-slate-800 dark:text-white">{docs.copNumber || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500">Practice Type</span>
                                            <span className="font-bold text-[#F97316]">{docs.practiceType || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2 mt-6">
                                        <Building2 size={16} className="text-purple-500" /> Firm & Office Details
                                    </h3>
                                    <div className="p-4 bg-purple-50/50 dark:bg-purple-900/10 rounded-2xl border border-purple-100/50 dark:border-purple-900/20 space-y-3">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500">Firm Name</span>
                                            <span className="font-bold text-slate-800 dark:text-white font-roboto">{docs.firmName || 'Proprietorship'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500">Firm PAN</span>
                                            <span className="font-bold text-slate-800 dark:text-white uppercase">{docs.firmPan || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500">GST Number</span>
                                            <span className="font-bold text-slate-800 dark:text-white uppercase">{docs.gstNumber || 'N/A'}</span>
                                        </div>
                                        <div className="pt-2 border-t border-purple-100/30">
                                            <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Office Address</p>
                                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-roboto">{docs.officeAddress || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2 mt-6">
                                        <Landmark size={16} className="text-emerald-500" /> Banking Information
                                    </h3>
                                    <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/20 space-y-3">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500">Account No.</span>
                                            <span className="font-bold text-slate-800 dark:text-white font-mono tracking-tighter">{docs.accountNumber || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500">Bank / IFSC</span>
                                            <span className="font-bold text-slate-800 dark:text-white">{docs.bankName || 'N/A'} • {docs.ifscCode || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500">Holder Name</span>
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase truncate max-w-[150px]">{docs.accountHolderName || 'N/A'}</span>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                )}

                {/* Contact Info Detailed */}
                <div className="space-y-3 mb-6">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Contact Details</h3>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Mail size={16} /></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500">Email Address</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{agent.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Phone size={16} /></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500">Mobile Number</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-white">{agent.mobile || 'N/A'}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const AgentCRM = ({ defaultFilter = 'ALL', viewMode = 'overview', targetRole = 'AGENT', users = [] }) => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [filterStatus, setFilterStatus] = useState(defaultFilter); // ALL, PENDING, VERIFIED

    useEffect(() => {
        if (defaultFilter) setFilterStatus(defaultFilter);
    }, [defaultFilter]);

    // Update local agents list when users prop changes
    useEffect(() => {
        if (users) {
            const agentList = users.filter(u => u.role === targetRole);
            setAgents(agentList);
        }
    }, [users, targetRole]);

    // Modal States
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [activeAgentId, setActiveAgentId] = useState(null);

    // Handlers
    const handleApprove = async (id) => {
        if (window.confirm(`Verify and activate this ${targetRole === 'CA' ? 'Freelancer' : 'Partner'}?`)) {
            try {
                await approveAgentKyc(id);
                // Optimistic Update
                setAgents(prev => prev.map(a => a.id === id ? { ...a, kycStatus: 'VERIFIED' } : a));
                setSelectedAgent(null);
            } catch (e) { alert(e.message); }
        }
    };

    const handleRejectInit = (agent) => {
        setActiveAgentId(agent.id);
        setShowRejectModal(true);
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason) return alert("Reason required");
        try {
            await rejectAgentKyc(activeAgentId, rejectReason);
            // Optimistic Update
            setAgents(prev => prev.map(a => a.id === activeAgentId ? { ...a, kycStatus: 'REJECTED' } : a));
            setShowRejectModal(false);
            setRejectReason("");
            setSelectedAgent(null);
        } catch (e) { alert(e.message); }
    };

    const handleUserAction = async (agent, type) => {
        if (type === 'approve') return handleApprove(agent.id);
        if (type === 'reject') return handleRejectInit(agent);

        if (type === 'delete') {
            if (window.confirm(`Are you sure you want to permanently delete ${agent.fullName}? This action cannot be undone.`)) {
                try {
                    await deleteUser(agent.id);
                    setAgents(prev => prev.filter(a => a.id !== agent.id));
                    setSelectedAgent(null);
                } catch (e) { alert("Failed to delete user: " + e.message); }
            }
        }

        if (type === 'suspend') {
            if (window.confirm(`Suspend ${agent.fullName}'s account access?`)) {
                alert("Account suspension initiated.");
                // Implementation would call a suspend API
            }
        }

        if (type === 'reset_password') {
            if (window.confirm(`Send a password reset link to ${agent.email}?`)) {
                alert("Reset link sent.");
                // Implementation would call a reset password API
            }
        }

        if (type === 'edit') {
            alert(`Opening edit view for ${agent.fullName}`);
            // Logic to open edit modal or navigate to edit page
        }
    };

    // Filtering
    const filteredAgents = agents.filter(a => {
        const matchSearch = a.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || a.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === 'ALL' ||
            (filterStatus === 'PENDING' && (a.kycStatus === 'SUBMITTED' || !a.kycStatus)) ||
            (filterStatus === 'VERIFIED' && a.kycStatus === 'VERIFIED');

        return matchSearch && matchStatus;
    });

    return (
        <div className="h-full flex flex-col font-[Roboto,sans-serif] animate-in fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Briefcase className="text-[#F97316]" size={28} /> {targetRole === 'CA' ? 'Freelancer CRM' : 'Partner CRM'} <span className="text-slate-300 dark:text-slate-600">/</span> {filterStatus === 'ALL' ? 'Directory' : filterStatus === 'PENDING' ? 'Pending Approvals' : (targetRole === 'CA' ? 'Active Freelancers' : 'Active Partners')}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Manage {targetRole === 'CA' ? 'Freelancers' : 'Partners'}, track performance, and handle {targetRole === 'CA' ? 'compliance' : 'KYC'} verifications.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                        <Award size={18} /> Top Performers
                    </button>
                    <button className="px-4 py-2 bg-[#F97316] text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition">
                        <Plus size={18} /> Add {targetRole === 'CA' ? 'Freelancer' : 'Partner'}
                    </button>
                </div>
            </div>

            {/* Quick Stats Row */}
            {/* Quick Stats Row - Only in Overview */}
            {viewMode === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: targetRole === 'CA' ? 'Total Freelancers' : 'Total Partners', val: agents.length, icon: Users, color: 'blue' },
                        { label: targetRole === 'CA' ? 'Compliance Pending' : 'Pending KYC', val: agents.filter(a => a.kycStatus === 'SUBMITTED').length, icon: AlertTriangle, color: 'orange' },
                        { label: targetRole === 'CA' ? 'Active Professionals' : 'Active Partners', val: agents.filter(a => a.kycStatus === 'VERIFIED').length, icon: CheckCircle, color: 'green' },
                        { label: targetRole === 'CA' ? 'Total Payouts' : 'Total Commission', val: '₹1.2L', icon: IndianRupee, color: 'purple' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
                                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{s.val}</h3>
                            </div>
                            <div className={`p-3 rounded-xl bg-${s.color}-50 text-${s.color}-500 shadow-sm`}>
                                <s.icon size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Content Split: List & Details */}
            <div className="flex-1 flex gap-6 overflow-hidden min-h-[500px]">

                {/* Left: Search & List */}
                <div className={`flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden ${selectedAgent ? 'hidden lg:flex lg:w-2/3' : 'w-full'}`}>

                    {/* Controls */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-800">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder={`Search ${targetRole === 'CA' ? 'Freelancers' : 'Partners'}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                            />
                        </div>

                    </div>

                    {/* Scrollable List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900/10">
                        {loading ? (
                            <div className="p-8 text-center text-slate-400 text-sm">Loading {targetRole === 'CA' ? 'Freelancer' : 'Partner'} Directory...</div>
                        ) : filteredAgents.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center opacity-50">
                                <Users size={40} className="mb-3 text-slate-300" />
                                <p className="text-slate-500 font-bold">No {targetRole === 'CA' ? 'Freelancers' : 'Partners'} found</p>
                            </div>
                        ) : (
                            filteredAgents.map(agent => (
                                <AgentListItem
                                    key={agent.id}
                                    agent={agent}
                                    onSelect={setSelectedAgent}
                                    onAction={(a, action) => {
                                        if (action === 'view_docs') setSelectedAgent(a);
                                    }}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Details Panel (Conditional) */}
                <AnimatePresence>
                    {selectedAgent && (
                        <div className="w-full lg:w-[400px] flex-shrink-0 absolute lg:relative inset-0 z-20">
                            <AgentDetailsPanel
                                agent={selectedAgent}
                                onClose={() => setSelectedAgent(null)}
                                onAction={handleUserAction}
                            />
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Rejection Modal portal */}
            {showRejectModal && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in scale-95 duration-200">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">Reject {targetRole === 'CA' ? 'Freelancer' : 'Partner'} Application</h3>
                        <p className="text-sm text-slate-500 mb-4">Please provide a reason to notify the {targetRole === 'CA' ? 'Freelancer' : 'Partner'}.</p>
                        <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            className="w-full h-32 p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none text-sm"
                            placeholder="Reason for rejection..."
                        ></textarea>
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-slate-500 font-bold text-sm">Cancel</button>
                            <button onClick={handleRejectSubmit} className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700">Submit Rejection</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AgentCRM;
