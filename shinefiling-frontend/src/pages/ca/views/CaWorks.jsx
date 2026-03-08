
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Briefcase, User, CheckCircle, RefreshCw, FileText, X, Download, Upload, Eye, MessageCircle, Minimize2, Terminal, Send, ShieldCheck, Archive, Loader2 } from 'lucide-react';
import { uploadFile, updatePrivateLimitedStatus, updateOnePersonCompanyStatus, getChatHistory, sendChatMessage, markChatAsRead, setTypingStatus, getTypingStatus, editChatMessage, deleteChatMessage, clearChatHistory, getUnreadChatCounts } from '../../../api';

const ManageServiceModal = ({ request, onClose, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('details');
    const [finalFiles, setFinalFiles] = useState({});
    const [uploading, setUploading] = useState(false);
    const [comments, setComments] = useState('');

    // Safe parsing of client docs
    const clientDocs = React.useMemo(() => {
        try {
            return request.documentUrl ? JSON.parse(request.documentUrl) : [];
        } catch { return []; }
    }, [request]);

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            // Upload to 'final_deliverables' category
            const response = await uploadFile(file, 'final_deliverables');
            setFinalFiles(prev => ({
                ...prev,
                [key]: { name: response.originalName, url: response.fileUrl }
            }));
        } catch (error) {
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmitCompletion = async () => {
        if (Object.keys(finalFiles).length === 0) {
            if (!window.confirm("No final documents uploaded. Are you sure you want to complete this without files?")) return;
        }

        try {
            setUploading(true);
            // 1. Construct the final payload with uploaded docs
            // Note: In a real app, you might have a specific API endpoint for 'CA_COMPLETE' that accepts docs.
            // Here we are mocking the logic by updating status and potentially appending docs to a comment or separate field.

            // For now, we assume standard status update logic
            // You might need a specific endpoint like `submitFinalDeliverables(req.id, files)`

            // Simulating API call to update status
            // const apiFunc = request.serviceName.includes('Private') ? updatePrivateLimitedStatus : updateOnePersonCompanyStatus;
            // await apiFunc(request.id, 'COMPLETED_REVIEW_PENDING'); 

            // Using the prop passed from parent (respondToBoundAmount) acts as the status updater in this dashboard context
            // check CaWorks parent pass 'respondToBoundAmount'

            // We'll call the onUpdate prop which wraps the API call
            await onUpdate(request.id, 'COMPLETED_FINAL', `Work Completed. Files: ${Object.keys(finalFiles).join(', ')}`, finalFiles);

            onClose();
        } catch (error) {
            alert("Failed to submit: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-800 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Briefcase size={20} className="text-[#F97316]" />
                            Running Project: {request.serviceName}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Order ID: #{String(request.id).slice(-8)} • Client: {request.user?.fullName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-slate-500 dark:text-slate-300" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 dark:border-white/10 px-6 bg-white dark:bg-slate-800">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'details' ? 'border-[#F97316] text-[#F97316]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                    >
                        Client Details & Docs
                    </button>
                    <button
                        onClick={() => setActiveTab('submission')}
                        className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'submission' ? 'border-[#F97316] text-[#F97316]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                    >
                        Submission & Complete
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#F8F9FA] dark:bg-slate-900">
                    {activeTab === 'details' ? (
                        <div className="space-y-6">
                            {/* Client Data Card */}
                            <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-white/5">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Client Information</h3>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div className="flex flex-col">
                                        <span className="text-slate-500 dark:text-slate-400">Full Name</span>
                                        <span className="font-bold text-slate-800 dark:text-white">{request.user?.fullName}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-500 dark:text-slate-400">Email Address</span>
                                        <span className="font-bold text-slate-800 dark:text-white">{request.user?.email}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-500 dark:text-slate-400">Phone</span>
                                        <span className="font-bold text-slate-800 dark:text-white">{request.user?.mobile || 'N/A'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-500 dark:text-slate-400">Plan Selected</span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 w-fit">
                                            {request.plan || 'Standard'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Documents Grid */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Uploaded Documents</h3>
                                {clientDocs.length > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {clientDocs.map((doc, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-white/5 hover:border-[#F97316]/30 transition-colors">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{doc.filename || doc.name || `Document ${idx + 1}`}</p>
                                                        <p className="text-xs text-slate-400">Client Upload</p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={doc.fileUrl || doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500 transition-colors"
                                                    title="View Document"
                                                >
                                                    <Download size={18} />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 bg-slate-100 dark:bg-white/5 rounded-xl text-center text-slate-400">
                                        No documents found for this request.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-700/50 flex gap-3 text-sm text-amber-800 dark:text-amber-200">
                                <CheckCircle size={20} className="shrink-0" />
                                <div>
                                    <p className="font-bold">Required Deliverables</p>
                                    <p className="text-amber-700 dark:text-amber-300 opacity-80 mt-1">Please ensure you upload the <strong>Certificate of Incorporation</strong>, <strong>PAN</strong>, and <strong>TAN</strong> letters before marking as complete.</p>
                                </div>
                            </div>

                            {/* Upload Area */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Upload Final Files</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {['Certificate of Incorporation', 'PAN Card', 'TAN Letter', 'MOA & AOA'].map((label) => {
                                        const key = label.toLowerCase().replace(/ /g, '_').replace(/&/g, 'and');
                                        const hasFile = !!finalFiles[key];
                                        return (
                                            <div key={key} className={`border-2 border-dashed rounded-xl p-4 flex items-center justify-between transition-colors ${hasFile ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-300 dark:border-slate-600 hover:border-[#F97316]'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasFile ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                        {hasFile ? <CheckCircle size={20} /> : <Upload size={20} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-slate-800 dark:text-white">{label}</p>
                                                        {hasFile && <p className="text-xs text-emerald-600 font-medium truncate max-w-[150px]">{finalFiles[key].name}</p>}
                                                    </div>
                                                </div>
                                                <input
                                                    type="file"
                                                    id={`upload-${key}`}
                                                    className="hidden"
                                                    onChange={(e) => handleFileUpload(e, key)}
                                                />
                                                <label
                                                    htmlFor={`upload-${key}`}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${hasFile ? 'bg-emerald-200 text-emerald-800 hover:bg-emerald-300' : 'bg-slate-800 text-white hover:bg-slate-800'}`}
                                                >
                                                    {hasFile ? 'Replace' : 'Upload'}
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <hr className="border-slate-200 dark:border-white/10" />

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitCompletion}
                                    disabled={uploading}
                                    className={`px-6 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg transition-all ${uploading ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:shadow-green-600/20'}`}
                                >
                                    {uploading ? <RefreshCw size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                                    Complete Order
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const CaWorks = ({ requests, employees, handleAssignEmployee, respondToBoundAmount, fetchData }) => {
    // Filter active works
    const myWorks = requests.filter(r => r.caApprovalStatus === 'ACCEPTED' || r.caApprovalStatus === 'COMPLETED_FINAL');

    // Request Management State
    const [activeChatOrder, setActiveChatOrder] = useState(null);

    const handleUpdateTask = async (reqId, status, comments, files) => {
        // Here we would properly call the API to update request with files
        // For this demo, we use the respondToBoundAmount as a proxy or assume it handles the logic
        // In a real implementation: `await updateServiceRequestDocs(reqId, files)`
        await respondToBoundAmount(reqId, status, comments, files);
        fetchData();
        if (activeChatOrder && activeChatOrder.id === reqId && (status === 'COMPLETED_FINAL' || status === 'COMPLETED')) {
            setActiveChatOrder(null);
        }
    };

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isMessageSending, setIsMessageSending] = useState(false);
    const [isChatMinimized, setIsChatMinimized] = useState(false);
    const [whoIsTyping, setWhoIsTyping] = useState([]);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [unreadCounts, setUnreadCounts] = useState({});
    const chatEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const caUser = JSON.parse(localStorage.getItem('user'));

    // Poll for unread counts independently
    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const counts = await getUnreadChatCounts();
                setUnreadCounts(counts);
            } catch (e) { }
        };
        fetchUnread();
        const unreadInterval = setInterval(fetchUnread, 15000);
        return () => clearInterval(unreadInterval);
    }, []);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (activeChatOrder && !isChatMinimized) {
            scrollToBottom();
        }
    }, [chatHistory, activeChatOrder, isChatMinimized, whoIsTyping]);

    useEffect(() => {
        let interval;
        if (activeChatOrder && !isChatMinimized) {
            const fetchChat = async () => {
                try {
                    const chatId = activeChatOrder.id; // Using request ID for CA side
                    const history = await getChatHistory(chatId);

                    if (JSON.stringify(history) !== JSON.stringify(chatHistory)) {
                        setChatHistory(history || []);
                        scrollToBottom();
                    }

                    // Poll typing
                    const typing = await getTypingStatus(chatId);
                    const othersTyping = typing.filter(role => role === 'USER'); // Admin/CA cares if USER is typing
                    setWhoIsTyping(othersTyping);
                } catch (e) { }
            };
            fetchChat();
            interval = setInterval(fetchChat, 3000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [activeChatOrder, isChatMinimized, chatHistory]);

    const handleSendMessage = async () => {
        if (!chatMessage.trim()) return;

        const chatId = activeChatOrder.id;

        if (editingMessageId) {
            await editChatMessage(chatId, editingMessageId, chatMessage);
            setEditingMessageId(null);
            setChatMessage('');
            const msgs = await getChatHistory(chatId);
            setChatHistory(msgs);
            return;
        }

        setIsMessageSending(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setTypingStatus(chatId, 'ADMIN', false); // CA acts as ADMIN in chat

        try {
            await sendChatMessage({
                ticketId: chatId,
                message: chatMessage,
                email: caUser.email,
                role: 'ADMIN' // Crucial: role ADMIN to distinguish
            });
            setChatMessage('');
            const history = await getChatHistory(chatId);
            setChatHistory(history || []);
            setTimeout(scrollToBottom, 100);
        } catch (error) {
            console.error(error);
        } finally {
            setIsMessageSending(false);
            setTypingStatus(chatId, 'ADMIN', false);
        }
    };

    const handleTyping = (e) => {
        setChatMessage(e.target.value);
        if (activeChatOrder) {
            const chatId = activeChatOrder.id;
            setTypingStatus(chatId, 'ADMIN', true);

            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                setTypingStatus(chatId, 'ADMIN', false);
            }, 5000);
        }
    };

    const handleEditClick = (msg) => {
        setChatMessage(msg.message);
        setEditingMessageId(msg.id);
    };

    const handleDeleteClick = async (msgId) => {
        if (window.confirm('Delete this message?')) {
            const chatId = activeChatOrder.id;
            await deleteChatMessage(chatId, msgId);
            const msgs = await getChatHistory(chatId);
            setChatHistory(msgs);
        }
    };

    const handleClearChat = async () => {
        if (window.confirm('Clear chat history?')) {
            const chatId = activeChatOrder.id;
            await clearChatHistory(chatId);
            setChatHistory([]);
        }
    };

    const openChat = async (order) => {
        setActiveChatOrder(order);
        setIsChatMinimized(false);
        setChatHistory([]);

        const chatId = order.id;
        await markChatAsRead(chatId, 'ADMIN');
        setUnreadCounts(prev => ({ ...prev, [chatId]: 0 }));
    };

    const statusColors = {
        'COMPLETED_FINAL': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        'ACCEPTED': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        'IN_PROGRESS': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        'PENDING': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    };

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Assigned Services</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and track progress of your ongoing projects.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 rounded-l-xl">Service Details</th>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Assigned To</th>
                                    <th className="px-6 py-4 text-right rounded-r-xl">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                                {myWorks.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <Briefcase size={48} className="mb-4 opacity-20" />
                                                <p className="font-bold text-lg">No Active Works</p>
                                                <p className="text-xs">Accept new requests from the Marketplace tab.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : myWorks.map(r => (
                                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800 dark:text-white mb-0.5">{r.serviceName}</div>
                                            <div className="text-xs text-slate-400 font-mono">#{String(r.id).slice(-8)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                                                    {(r.user?.fullName || 'C').charAt(0)}
                                                </div>
                                                <span className="text-slate-600 dark:text-slate-300 font-medium">{r.user?.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${statusColors[r.caApprovalStatus] || 'bg-slate-100 text-slate-600'}`}>
                                                {r.caApprovalStatus?.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative group/select">
                                                <select
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-[#F97316] appearance-none cursor-pointer font-medium"
                                                    value={r.assignedEmployee?.id || ''}
                                                    onChange={(e) => handleAssignEmployee(r.id, e.target.value)}
                                                >
                                                    <option value="">-- Myself --</option>
                                                    {employees.map(e => (
                                                        <option key={e.id} value={e.id}>{e.fullName}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <User size={12} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {r.caApprovalStatus === 'ACCEPTED' ? (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openChat(r)}
                                                        className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors relative"
                                                    >
                                                        <MessageCircle size={14} />
                                                        {unreadCounts[r.id] > 0 && (
                                                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 text-[8px] text-white font-bold items-center justify-center"></span>
                                                            </span>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedRequest(r)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-slate-800/20"
                                                    >
                                                        Manage <Briefcase size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-green-600 flex items-center justify-end gap-1">
                                                    <CheckCircle size={14} /> Completed
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            {/* Modal Injection */}
            <AnimatePresence>
                {selectedRequest && (
                    <ManageServiceModal
                        request={selectedRequest}
                        onClose={() => setSelectedRequest(null)}
                        onUpdate={handleUpdateTask}
                    />
                )}
            </AnimatePresence>
            {/* FLOATING CHAT - Compact */}
            {activeChatOrder && (
                <div className={`fixed bottom-4 right-4 z-[100] w-[320px] shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-[#043E52] border border-gray-100 dark:border-[#1C3540] flex flex-col transition-all duration-300 ${isChatMinimized ? 'h-12' : 'h-[450px]'}`}>
                    <div className="p-3 bg-slate-800 dark:bg-slate-900 text-white flex justify-between items-center cursor-pointer shrink-0 z-10 relative" onClick={() => setIsChatMinimized(!isChatMinimized)}>
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><MessageCircle size={12} /></div>
                            <div>
                                <h3 className="font-bold text-xs">{activeChatOrder.user?.fullName ? `Chat with ${activeChatOrder.user.fullName}` : 'Chat with Client'}</h3>
                                <p className="text-[9px] text-white/70">#{String(activeChatOrder.id).slice(-8)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={(e) => { e.stopPropagation(); setIsChatMinimized(!isChatMinimized); }} className="p-1 hover:bg-white/10 rounded"><Minimize2 size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); setActiveChatOrder(null); }} className="p-1 hover:bg-white/10 rounded"><X size={14} /></button>
                        </div>
                    </div>

                    {!isChatMinimized && (
                        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#0D1C22] relative font-sans">
                            <div className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar bg-[#F8FAFC] dark:bg-[#0D1C22]">
                                {chatHistory.length === 0 && <div className="text-center text-gray-400 text-[10px] py-4">Start a conversation with the client...</div>}
                                {chatHistory.map((msg, i) => {
                                    // Remember: CA acts as ADMIN
                                    const isUser = msg.senderRole === 'ADMIN';
                                    return (
                                        <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'} group relative`}>
                                            {isUser && (
                                                <div className="absolute top-0 right-0 -mr-7 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                                                    <button onClick={() => handleEditClick(msg)} className="p-1 hover:bg-gray-100 dark:hover:bg-[#1C3540] rounded text-gray-500"><Terminal size={10} /></button>
                                                    <button onClick={() => handleDeleteClick(msg.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-red-500"><X size={10} /></button>
                                                </div>
                                            )}
                                            <div className={`max-w-[85%] p-2 px-3 text-[10px] shadow-sm ${isUser
                                                ? 'bg-slate-800 dark:bg-slate-700 text-white rounded-xl rounded-tr-none'
                                                : 'bg-white dark:bg-[#1C3540] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-[#2A4550] rounded-xl rounded-tl-none'
                                                }`}>
                                                {!isUser && <p className="text-[8px] font-bold text-[#F97316] mb-0.5 opacity-80">{msg.senderName}</p>}
                                                <p className="leading-relaxed">{msg.message} {msg.edited && <span className="text-[8px] opacity-50">(edited)</span>}</p>
                                                <div className={`flex items-center justify-end gap-1 mt-0.5`}>
                                                    <span className={`text-[8px] font-bold ${isUser ? 'text-white/60' : 'text-gray-300'}`}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isUser && (
                                                        <span className="text-white/80">
                                                            {msg.read ? <div className="flex -space-x-1"><CheckCircle size={10} className="fill-blue-400 text-white" /></div> : <CheckCircle size={10} />}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {whoIsTyping.length > 0 && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 dark:bg-[#1C3540] text-gray-500 dark:text-gray-400 rounded-xl rounded-tl-none p-2 px-3 text-[10px] flex items-center gap-1">
                                            <span className="animate-pulse">Client is typing...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="p-2.5 bg-white dark:bg-[#043E52] border-t border-gray-100 dark:border-[#1C3540] flex items-center gap-2 shrink-0">
                                <button onClick={handleClearChat} className="text-gray-400 p-1 hover:text-red-500 transition" title="Clear Chat"><Archive size={16} /></button>
                                <input
                                    className="flex-1 bg-gray-50 dark:bg-[#1C3540] border border-gray-200 dark:border-[#2A4550] rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#F97316] transition-colors dark:text-white"
                                    placeholder={editingMessageId ? "Edit message..." : "Type your message..."}
                                    value={chatMessage}
                                    onChange={handleTyping}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                />
                                <button onClick={handleSendMessage} disabled={!chatMessage.trim() || isMessageSending} className={`p-1.5 rounded-lg ${chatMessage.trim() ? 'bg-[#F97316] text-white' : 'bg-gray-100 dark:bg-[#1C3540] text-gray-400'}`}>
                                    {isMessageSending ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default CaWorks;
