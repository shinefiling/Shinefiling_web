import React, { useEffect, useState, useRef } from 'react';
import { Package, Search, ExternalLink, Download, MessageCircle, Clock, ChevronRight, FileCheck, Receipt, Loader2, Send, X, User, Users, ShieldCheck, MoreVertical, Paperclip, Smile, Minimize2, Archive, CheckCircle, Terminal, Star, Briefcase, FileText, Filter, Activity, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserApplications, BASE_URL, getChatHistory, sendChatMessage, getUserUnreadChatCounts, markChatAsRead, setTypingStatus, getTypingStatus, editChatMessage, deleteChatMessage, clearChatHistory } from '../../api';
import FeedbackModal from '../../components/FeedbackModal';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const data = await getUserApplications(user.email);
                if (data) setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(o => {
        const matchesFilter = filter === 'All' || o.status === filter;
        const matchesSearch = o.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(o.id).includes(searchTerm);
        return matchesFilter && matchesSearch;
    });

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [activeChatOrder, setActiveChatOrder] = useState(null);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [user, setUser] = useState(null);
    const [isMessageSending, setIsMessageSending] = useState(false);

    const chatEndRef = useRef(null);
    const [isChatMinimized, setIsChatMinimized] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [whoIsTyping, setWhoIsTyping] = useState([]);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const prevUnreadCounts = useRef({});
    const ordersRef = useRef(orders);
    const typingTimeoutRef = useRef(null);
    const [feedbackOrder, setFeedbackOrder] = useState(null);

    useEffect(() => {
        ordersRef.current = orders;
    }, [orders]);

    // Fetch user and start polling for unread counts
    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        const u = JSON.parse(localStorage.getItem('user'));
        setUser(u);
        if (u && u.email) {
            fetchUnreadCounts(u.email);
            const interval = setInterval(() => fetchUnreadCounts(u.email), 15000);
            return () => clearInterval(interval);
        }
    }, []);

    const fetchUnreadCounts = async (email) => {
        try {
            const counts = await getUserUnreadChatCounts(email);
            if (counts) {
                Object.keys(counts).forEach(chatId => {
                    const prev = prevUnreadCounts.current[chatId] || 0;
                    const curr = counts[chatId];
                    if (curr > prev) {
                        const order = ordersRef.current.find(o =>
                            o.submissionId === chatId || o.id === chatId || String(o.id) === String(chatId)
                        );

                        if (order) {
                            const title = `New Message`;
                            const body = `Order #${order.id.toString().replace('ORD-', '')}: You have a new message.`;

                            if (Notification.permission === 'granted' && (!activeChatOrder || (activeChatOrder.submissionId !== chatId && activeChatOrder.id !== chatId))) {
                                const notification = new Notification(title, { body, icon: '/favicon.ico' });
                                notification.onclick = () => {
                                    window.focus();
                                    openChat(order);
                                };
                            }
                        }
                    }
                });
                prevUnreadCounts.current = counts;
                setUnreadCounts(counts);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (activeChatOrder && !isChatMinimized) {
            scrollToBottom();
        }
    }, [chatHistory, activeChatOrder, isChatMinimized, whoIsTyping]);

    // Chat polling logic inside MyOrders
    useEffect(() => {
        let interval;
        if (activeChatOrder && !isChatMinimized) {
            const fetchChat = async () => {
                try {
                    const chatId = activeChatOrder.submissionId || activeChatOrder.id;
                    const history = await getChatHistory(chatId);

                    if (JSON.stringify(history) !== JSON.stringify(chatHistory)) {
                        setChatHistory(history || []);
                        scrollToBottom();
                    }

                    // Poll typing
                    const typing = await getTypingStatus(chatId);
                    const othersTyping = typing.filter(role => role === 'ADMIN'); // User cares if ADMIN is typing
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

        const chatId = activeChatOrder.submissionId || activeChatOrder.id;

        // Handle Edit
        if (editingMessageId) {
            await editChatMessage(chatId, editingMessageId, chatMessage);
            setEditingMessageId(null);
            setChatMessage('');
            // Force refresh
            const msgs = await getChatHistory(chatId);
            setChatHistory(msgs);
            return;
        }

        setIsMessageSending(true);
        // Stop typing immediately
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setTypingStatus(chatId, 'USER', false);

        try {
            await sendChatMessage({
                ticketId: chatId,
                message: chatMessage,
                email: user.email,
                role: 'USER'
            });
            setChatMessage('');
            const history = await getChatHistory(chatId);
            setChatHistory(history || []);
            setTimeout(scrollToBottom, 100);
        } catch (error) {
            console.error(error);
        } finally {
            setIsMessageSending(false);
            setTypingStatus(chatId, 'USER', false);
        }
    };

    const handleTyping = (e) => {
        setChatMessage(e.target.value);
        if (activeChatOrder) {
            const chatId = activeChatOrder.submissionId || activeChatOrder.id;
            setTypingStatus(chatId, 'USER', true);

            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                setTypingStatus(chatId, 'USER', false);
            }, 5000);
        }
    };

    const handleEditClick = (msg) => {
        setChatMessage(msg.message);
        setEditingMessageId(msg.id);
    };

    const handleDeleteClick = async (msgId) => {
        if (window.confirm('Delete this message?')) {
            const chatId = activeChatOrder.submissionId || activeChatOrder.id;
            await deleteChatMessage(chatId, msgId);
            const msgs = await getChatHistory(chatId);
            setChatHistory(msgs);
        }
    }

    const handleClearChat = async () => {
        if (window.confirm('Clear chat history?')) {
            const chatId = activeChatOrder.submissionId || activeChatOrder.id;
            await clearChatHistory(chatId);
            setChatHistory([]);
        }
    }

    const openDetails = (order) => setSelectedOrder(order);

    const openChat = async (order) => {
        setActiveChatOrder(order);
        setIsChatMinimized(false);
        setChatHistory([]);

        const chatId = order.submissionId || order.id;
        // Mark as read immediately when opening
        if (unreadCounts[chatId] > 0) {
            setUnreadCounts(prev => ({ ...prev, [chatId]: 0 }));
            await markChatAsRead(chatId, 'USER'); // 'USER' is reading the message
            if (user && user.email) fetchUnreadCounts(user.email);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-xl font-bold text-[#015A62] dark:text-white">My Applications</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Track and manage your ongoing business services.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search applications..."
                            className="bg-white dark:bg-[#043E52] border border-slate-200 dark:border-[#1C3540] rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-slate-700 dark:text-white focus:outline-none focus:border-[#ED6E3F]"
                        />
                    </div>
                    <div className="flex bg-[#FDFBF7] dark:bg-[#043E52] p-1 rounded-xl overflow-x-auto no-scrollbar gap-1 border border-slate-200 dark:border-[#1C3540]">
                        {['All', 'In Progress', 'Completed', 'Action Required'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filter === f
                                    ? 'bg-[#ED6E3F] text-white shadow-md'
                                    : 'text-[#3D4D55] dark:text-slate-400 hover:text-[#015A62] dark:hover:text-white hover:bg-white dark:hover:bg-[#1C3540]'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="p-12 text-center bg-white dark:bg-[#043E52] rounded-2xl border border-slate-100 dark:border-[#1C3540]">
                        <Loader2 className="w-8 h-8 animate-spin text-[#ED6E3F] mx-auto mb-3" />
                        <p className="text-slate-400 font-bold text-xs">Fetching applications...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white dark:bg-[#043E52] rounded-2xl border border-dashed border-slate-300 dark:border-[#1C3540] p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-[#1C3540] rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Package size={24} />
                        </div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">No applications found</h3>
                        <p className="text-slate-400 max-w-xs mx-auto mb-6 text-sm">You haven't placed any requests yet.</p>
                    </div>
                ) : (
                    filteredOrders.map((order, i) => (
                        <div key={i} className="bg-white dark:bg-[#043E52] rounded-2xl border border-slate-100 dark:border-[#1C3540] p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${order.status === 'Completed' ? 'bg-emerald-500' :
                                order.status === 'Action Required' ? 'bg-rose-500' : 'bg-blue-500'
                                }`}></div>

                            <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between pl-3">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#FDFBF7] dark:bg-[#1C3540] border border-[#ED6E3F]/10 dark:border-[#ED6E3F]/20 rounded-xl flex items-center justify-center text-[#ED6E3F] shadow-sm shrink-0">
                                        {(() => {
                                            const name = order.serviceName?.toLowerCase() || '';
                                            if (name.includes('gst') || name.includes('tax')) return <Receipt size={22} />;
                                            if (name.includes('trademark') || name.includes('copyright')) return <ShieldCheck size={22} />;
                                            if (name.includes('private') || name.includes('company') || name.includes('llp')) return <Briefcase size={22} />;
                                            return <FileText size={22} />;
                                        })()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-[#015A62] dark:text-white text-base group-hover:text-[#ED6E3F] transition-colors">{order.serviceName}</h4>
                                            <span className="bg-slate-100 dark:bg-[#1C3540] text-slate-500 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded font-mono border border-slate-200 dark:border-slate-700 font-bold">#{order.id.toString().replace('ORD-', '').substring(0, 8)}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                            <span className="flex items-center gap-1.5"><Clock size={12} className="text-slate-400" /> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
                                            <span className={`flex items-center gap-1.5 ${order.paymentStatus === 'Success' ? 'text-emerald-500' : 'text-amber-500'}`}><FileCheck size={12} /> {order.paymentStatus === 'Success' ? 'Paid' : (order.paymentStatus || 'Unpaid')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:items-end gap-3 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-[#1C3540]">
                                    <button
                                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide inline-flex items-center gap-2 ${order.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' :
                                            order.status === 'Action Required' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30' :
                                                'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30'
                                            }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Completed' ? 'bg-emerald-500' :
                                            order.status === 'Action Required' ? 'bg-rose-500' : 'bg-blue-500'
                                            }`}></span>
                                        {order.status || 'Processing'}
                                    </button>

                                    <div className="flex items-center gap-2 w-full md:w-auto">
                                        {order.status === 'Completed' && (
                                            <button
                                                onClick={() => setFeedbackOrder(order)}
                                                className="flex-1 md:flex-none py-2 px-4 rounded-xl border border-[#ED6E3F] text-[#ED6E3F] font-bold text-[10px] hover:bg-[#ED6E3F] hover:text-white transition flex items-center justify-center gap-2"
                                            >
                                                <Star size={14} /> Feedback
                                            </button>
                                        )}
                                        <button
                                            onClick={() => openChat(order)}
                                            className="flex-1 md:flex-none py-2 px-4 rounded-xl border border-slate-200 dark:border-[#2A4550] text-slate-600 dark:text-slate-300 font-bold text-[10px] hover:bg-slate-50 dark:hover:bg-[#1C3540] hover:text-[#015A62] dark:hover:text-white transition flex items-center justify-center gap-2 relative bg-white dark:bg-[#043E52]"
                                        >
                                            <MessageCircle size={14} /> Chat
                                            {(unreadCounts[order.submissionId] > 0 || unreadCounts[order.id] > 0) && (
                                                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 text-[8px] text-white font-bold items-center justify-center"></span>
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => openDetails(order)}
                                            className="flex-1 md:flex-none py-2 px-4 rounded-xl bg-[#015A62] dark:bg-[#ED6E3F] text-white font-bold text-[10px] hover:bg-black dark:hover:bg-[#A57753] transition flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            Details <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* DETAILS MODAL - MINIMALIST REDESIGN */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white dark:bg-[#1C3540] w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-[#2A4550] flex justify-between items-center bg-white dark:bg-[#1C3540] shrink-0">
                            <div className="flex items-center gap-4">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Order Details</h3>
                                <span className="px-3 py-1 bg-[#1A1A1A] dark:bg-[#0D1C22] text-white/90 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                    {selectedOrder.status || 'Processing'}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-[#2A4550] rounded-full text-slate-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body Container */}
                        <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-[#1C3540] custom-scrollbar">
                            {(() => {
                                // DATA NORMALIZATION
                                let normalized = { ...selectedOrder };
                                let form = typeof selectedOrder.formData === 'string'
                                    ? (function () { try { return JSON.parse(selectedOrder.formData) } catch (e) { return {} } })()
                                    : (selectedOrder.formData || {});

                                if (form.formData) {
                                    Object.assign(normalized, form.formData);
                                } else {
                                    Object.assign(normalized, form);
                                }

                                const skipFields = ['id', '_id', 'status', 'createdAt', 'updatedAt', 'formData', 'generatedDocuments', 'userId', 'amount', 'plan', 'uploadedDocuments', 'email', 'mobile', 'user', 'serviceName', '__v', 'userEmail', 'directors', 'amountPaid', 'assignedTo', 'businessInfo', 'stakeholders', 'documents'];

                                const isUrl = (str) => typeof str === 'string' && (str.startsWith('http://') || str.startsWith('https://') || str.match(/\.(png|jpg|jpeg|pdf|doc|docx)$/i));

                                const fileEntries = [];
                                const regularEntries = [];

                                const formatValue = (v) => {
                                    if (typeof v === 'boolean') return v ? 'Yes' : 'No';
                                    if (Array.isArray(v)) return v.map(item => typeof item === 'object' ? JSON.stringify(item) : item).join(', ');
                                    if (typeof v === 'object' && v !== null) return JSON.stringify(v);
                                    return String(v);
                                };

                                // Recursive extractor that separates URLs from text
                                const processNode = (obj, prefix = '') => {
                                    for (const [k, v] of Object.entries(obj || {})) {
                                        if (skipFields.includes(k) && !prefix) continue;
                                        if (v === null || v === undefined || v === '') continue;

                                        let formattedKey = k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
                                        formattedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
                                        const newKey = prefix ? `${prefix} - ${formattedKey}` : formattedKey;

                                        if (typeof v === 'string') {
                                            if (isUrl(v)) fileEntries.push([newKey, v]);
                                            else regularEntries.push([newKey, v]);
                                        } else if (typeof v === 'boolean' || typeof v === 'number') {
                                            regularEntries.push([newKey, formatValue(v)]);
                                        } else if (Array.isArray(v)) {
                                            // Handling array of objects or strings
                                            v.forEach((item, idx) => {
                                                const arrKey = `${newKey} ${idx + 1}`;
                                                if (typeof item === 'string') {
                                                    if (isUrl(item)) fileEntries.push([arrKey, item]);
                                                    else regularEntries.push([arrKey, item]);
                                                } else if (typeof item === 'object' && item !== null) {
                                                    // Check if it's a file object
                                                    if (item.url || item.fileUrl || item.link) {
                                                        const url = item.url || item.fileUrl || item.link;
                                                        const name = item.name || item.filename || item.originalName || item.type || item.id || arrKey;
                                                        fileEntries.push([name, url]);
                                                    } else {
                                                        processNode(item, arrKey);
                                                    }
                                                } else {
                                                    regularEntries.push([arrKey, formatValue(item)]);
                                                }
                                            });
                                        } else if (typeof v === 'object' && v !== null) {
                                            // Handle case where object is directly a file object
                                            if (v.url || v.fileUrl || v.link) {
                                                const url = v.url || v.fileUrl || v.link;
                                                const name = v.name || v.filename || v.originalName || v.type || newKey;
                                                fileEntries.push([name, url]);
                                            } else {
                                                processNode(v, newKey);
                                            }
                                        }
                                    }
                                };

                                // Also process the skipped document structures manually to make sure they get added correctly
                                const processSkippedDocs = (docs) => {
                                    if (!docs) return;
                                    if (Array.isArray(docs)) {
                                        docs.forEach((doc, i) => {
                                            if (!doc) return;
                                            if (typeof doc === 'string') {
                                                if (isUrl(doc)) fileEntries.push([`Document ${i + 1}`, doc]);
                                            }
                                            else if (doc.url || doc.fileUrl || doc.link) {
                                                fileEntries.push([doc.name || doc.filename || doc.type || `Document ${i + 1}`, doc.url || doc.fileUrl || doc.link]);
                                            }
                                        });
                                    } else if (typeof docs === 'object') {
                                        for (const [k, v] of Object.entries(docs)) {
                                            if (!v) continue;
                                            if (typeof v === 'string') {
                                                if (isUrl(v)) fileEntries.push([k, v]);
                                            }
                                            else if (v.url || v.fileUrl || v.link) {
                                                fileEntries.push([v.name || v.filename || v.type || k, v.url || v.fileUrl || v.link]);
                                            }
                                        }
                                    }
                                };

                                processNode(normalized);
                                processSkippedDocs(normalized.uploadedDocuments);
                                processSkippedDocs(normalized.documents);

                                return (
                                    <div className="space-y-10">

                                        {/* Basic Info Section (Like Bank Information in mockup) */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400">
                                                <Briefcase size={16} />
                                                <h4 className="text-sm font-medium">Business Information</h4>
                                            </div>

                                            <div className="flex flex-col border border-slate-100 dark:border-[#2A4550] rounded-2xl overflow-hidden shadow-sm">

                                                {/* Core Order Details block (Amount, Name, etc.) */}
                                                <div className="flex items-center justify-between py-4 px-5 border-b border-slate-100 dark:border-[#2A4550] bg-white dark:bg-[#1C3540]">
                                                    <div className="flex items-center gap-3 w-1/3 shrink-0">
                                                        <Receipt size={16} className="text-slate-400" />
                                                        <span className="text-sm text-slate-500">Amount</span>
                                                    </div>
                                                    <div className="w-2/3 text-right sm:text-left flex items-center justify-end sm:justify-start">
                                                        <span className="text-sm font-bold text-slate-800 dark:text-white">₹{selectedOrder.amountPaid || '0.00'}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between py-4 px-5 border-b border-slate-100 dark:border-[#2A4550] bg-white dark:bg-[#1C3540]">
                                                    <div className="flex items-center gap-3 w-1/3 shrink-0">
                                                        <Package size={16} className="text-slate-400" />
                                                        <span className="text-sm text-slate-500">Service</span>
                                                    </div>
                                                    <div className="w-2/3 text-right sm:text-left flex items-center justify-end sm:justify-start">
                                                        <span className="text-sm font-bold text-slate-800 dark:text-white">{selectedOrder.serviceName}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between py-4 px-5 border-b border-slate-100 dark:border-[#2A4550] bg-white dark:bg-[#1C3540]">
                                                    <div className="flex items-center gap-3 w-1/3 shrink-0">
                                                        <Archive size={16} className="text-slate-400" />
                                                        <span className="text-sm text-slate-500">Order ID</span>
                                                    </div>
                                                    <div className="w-2/3 text-right sm:text-left flex items-center justify-end sm:justify-start">
                                                        <span className="text-sm font-bold text-slate-800 dark:text-white">#{selectedOrder.id?.toString().replace('ORD-', '')}</span>
                                                    </div>
                                                </div>

                                                {/* Dynamic FormData key-value pairs */}
                                                {regularEntries.length > 0 && regularEntries.map(([key, value], idx) => {
                                                    let Icon = FileText;
                                                    const lowerKey = key.toLowerCase();
                                                    if (lowerKey.includes('name')) Icon = User;
                                                    if (lowerKey.includes('date') || lowerKey.includes('time')) Icon = Clock;
                                                    if (lowerKey.includes('pan') || lowerKey.includes('gst') || lowerKey.includes('tax')) Icon = Receipt;

                                                    const isLast = idx === regularEntries.length - 1;

                                                    return (
                                                        <div key={key} className={`flex items-center justify-between py-4 px-5 bg-white dark:bg-[#1C3540] hover:bg-slate-50 dark:hover:bg-[#2A4550]/50 transition-colors ${!isLast ? 'border-b border-slate-100 dark:border-[#2A4550]' : ''}`}>
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-1/3 shrink-0">
                                                                <div className="hidden sm:block"><Icon size={16} className="text-slate-400" /></div>
                                                                <span className="text-sm font-medium text-slate-500 capitalize">{key}</span>
                                                            </div>
                                                            <div className="w-2/3 text-right sm:text-left flex items-center justify-end sm:justify-start">
                                                                <span className="text-sm font-bold text-slate-800 dark:text-white break-words text-left">{value}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Stakeholders (if any) */}
                                        {(normalized.directors && Array.isArray(normalized.directors) && normalized.directors.length > 0) && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400">
                                                    <Users size={16} />
                                                    <h4 className="text-sm font-medium">Stakeholders / Directors</h4>
                                                </div>
                                                <div className="flex flex-col border border-slate-100 dark:border-[#2A4550] rounded-2xl overflow-hidden shadow-sm">
                                                    {normalized.directors.map((d, i) => (
                                                        <div key={i} className={`flex items-center justify-between py-4 px-5 bg-white dark:bg-[#1C3540] hover:bg-slate-50 dark:hover:bg-[#2A4550]/50 transition-colors ${i !== normalized.directors.length - 1 ? 'border-b border-slate-100 dark:border-[#2A4550]' : ''}`}>
                                                            <div className="flex items-center gap-3 w-1/3 shrink-0">
                                                                <User size={16} className="text-slate-400" />
                                                                <span className="text-sm text-slate-500 font-medium">Director {i + 1}</span>
                                                            </div>
                                                            <div className="w-2/3 text-right sm:text-left flex items-center justify-end sm:justify-start">
                                                                <span className="text-sm font-bold text-slate-800 dark:text-white break-words">{d.name || d.fullName}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Deliverables / Documents locker */}
                                        {(normalized.generatedDocuments && Object.keys(normalized.generatedDocuments).length > 0) && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400">
                                                    <FileCheck size={16} />
                                                    <h4 className="text-sm font-medium">Official Documents</h4>
                                                </div>
                                                <div className="flex flex-col border border-slate-100 dark:border-[#2A4550] rounded-2xl overflow-hidden shadow-sm">
                                                    {Object.entries(normalized.generatedDocuments).map(([key, val], idx, arr) => (
                                                        <div key={key} className={`flex items-center justify-between py-4 px-5 bg-white dark:bg-[#1C3540] hover:bg-slate-50 dark:hover:bg-[#2A4550]/50 transition-colors ${idx !== arr.length - 1 ? 'border-b border-slate-100 dark:border-[#2A4550]' : ''}`}>
                                                            <div className="flex items-center gap-3 max-w-[70%]">
                                                                <Download size={16} className="text-slate-400 shrink-0" />
                                                                <span className="text-sm font-bold text-slate-800 dark:text-white capitalize truncate">{key.replace(/_/g, ' ')}</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <a
                                                                    href={val.url || val}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                                                                >
                                                                    Download
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* User Uploads Snippet */}
                                        {fileEntries.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400">
                                                    <Archive size={16} />
                                                    <h4 className="text-sm font-medium">Uploaded Files</h4>
                                                </div>
                                                <div className="flex flex-col border border-slate-100 dark:border-[#2A4550] rounded-2xl overflow-hidden shadow-sm">
                                                    {fileEntries.map(([k, v], idx, arr) => (
                                                        <div key={idx} className={`flex items-center justify-between py-4 px-5 bg-white dark:bg-[#1C3540] hover:bg-slate-50 dark:hover:bg-[#2A4550]/50 transition-colors ${idx !== arr.length - 1 ? 'border-b border-slate-100 dark:border-[#2A4550]' : ''}`}>
                                                            <div className="flex items-center gap-3 max-w-[70%]">
                                                                <ExternalLink size={16} className="text-slate-400 shrink-0" />
                                                                <span className="text-sm font-bold text-slate-800 dark:text-white capitalize truncate">{k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <a
                                                                    href={v}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-xs font-bold text-[#015A62] hover:text-[#014A51] hover:underline px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20"
                                                                >
                                                                    View
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                );
                            })()}
                        </div>

                        {/* Footer / Actions */}
                        <div className="px-8 py-5 border-t border-slate-100 dark:border-[#2A4550] bg-white dark:bg-[#1C3540] shrink-0 flex justify-end gap-4 rounded-b-3xl">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2A4550] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleChatClick(selectedOrder);
                                    setSelectedOrder(null);
                                }}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#001741] dark:bg-[#ED6E3F] hover:bg-[#000F2B] dark:hover:bg-[#D55F35] transition-colors shadow-sm"
                            >
                                Get Support
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* FLOATING CHAT - Compact */}
            {activeChatOrder && (
                <div className={`fixed bottom-4 right-4 z-[100] w-[320px] max-w-[calc(100vw-2rem)] shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-[#043E52] border border-gray-100 dark:border-[#1C3540] flex flex-col transition-all duration-300 ${isChatMinimized ? 'h-12' : 'h-[450px] max-h-[calc(100vh-2rem)]'}`}>
                    <div className="p-3 bg-[#015A62] text-white flex justify-between items-center cursor-pointer shrink-0 z-10 relative" onClick={() => setIsChatMinimized(!isChatMinimized)}>
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><ShieldCheck size={12} /></div>
                            <div>
                                <h3 className="font-bold text-xs">Support</h3>
                                <p className="text-[9px] text-white/70">#{activeChatOrder.id}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={(e) => { e.stopPropagation(); setIsChatMinimized(!isChatMinimized); }} className="p-1 hover:bg-white/10 rounded"><Minimize2 size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); setActiveChatOrder(null); }} className="p-1 hover:bg-white/10 rounded"><X size={14} /></button>
                        </div>
                    </div>

                    {!isChatMinimized && (
                        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#0D1C22] relative font-sans w-full">
                            <div className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar bg-[#F8FAFC] dark:bg-[#0D1C22]">
                                {chatHistory.length === 0 && <div className="text-center text-gray-400 text-[10px] py-4">Start a conversation...</div>}
                                {chatHistory.map((msg, i) => {
                                    const isUser = msg.sender === 'USER' || msg.senderRole === 'USER' || msg.senderRole === 'GUEST';
                                    return (
                                        <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'} group relative`}>
                                            {isUser && (
                                                <div className="absolute top-0 right-0 -mr-7 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                                                    <button onClick={() => handleEditClick(msg)} className="p-1 hover:bg-gray-100 dark:hover:bg-[#1C3540] rounded text-gray-500"><Terminal size={10} /></button>
                                                    <button onClick={() => handleDeleteClick(msg.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-red-500"><X size={10} /></button>
                                                </div>
                                            )}
                                            <div className={`max-w-[85%] p-2 px-3 text-[10px] shadow-sm ${isUser
                                                ? 'bg-[#015A62] dark:bg-[#ED6E3F] text-white rounded-xl rounded-tr-none'
                                                : 'bg-white dark:bg-[#1C3540] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-[#2A4550] rounded-xl rounded-tl-none'
                                                }`}>
                                                {!isUser && <p className="text-[8px] font-bold text-[#ED6E3F] mb-0.5 opacity-80">{msg.senderName}</p>}
                                                <p className="leading-relaxed break-words whitespace-pre-wrap">{msg.message} {msg.edited && <span className="text-[8px] opacity-50 italic">(edited)</span>}</p>
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
                                            <span className="animate-pulse">Agent is typing...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="p-2.5 bg-white dark:bg-[#043E52] border-t border-gray-100 dark:border-[#1C3540] flex items-center gap-2 shrink-0">
                                <button onClick={handleClearChat} className="text-gray-400 p-1 hover:text-red-500 transition" title="Clear Chat"><Archive size={16} /></button>
                                <input
                                    className="flex-1 bg-gray-50 dark:bg-[#1C3540] border border-gray-200 dark:border-[#2A4550] rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#ED6E3F] transition-colors dark:text-white"
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
                                <button onClick={handleSendMessage} disabled={!chatMessage.trim() || isMessageSending} className={`p-1.5 rounded-lg ${chatMessage.trim() ? 'bg-[#ED6E3F] text-white' : 'bg-gray-100 dark:bg-[#1C3540] text-gray-400'}`}>
                                    {isMessageSending ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {feedbackOrder && (
                <FeedbackModal
                    order={feedbackOrder}
                    onClose={() => setFeedbackOrder(null)}
                    onSubmit={() => setFeedbackOrder(null)}
                />
            )}
        </div >
    );
};

export default MyOrders;
