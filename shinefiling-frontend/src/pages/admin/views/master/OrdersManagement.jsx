import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, Activity, ChevronRight, X, User, Search, RefreshCcw, Shield, Zap, Terminal, Play, Eye, Archive, MessageCircle, ShieldCheck, MoreVertical, Paperclip, Smile, Minimize2, Loader2, Send, Mail, Phone, ExternalLink, Trash2, Database, FileCheck, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    updateApplicationStatus, verifyPrivateLimitedDocs, getAllApplications, broadcastRequest, getBidsForRequest, acceptBid, BASE_URL, getChatHistory, sendChatMessage, getUnreadChatCounts, markChatAsRead, editChatMessage, deleteChatMessage, clearChatHistory, setTypingStatus, getTypingStatus, updateTradeLicenseStatus,
    updateLabourLicenseStatus, updateDrugLicenseStatus, updatePollutionControlStatus, updateGumasthaLicenseStatus,
    updateTrademarkRegistrationStatus, updateTrademarkObjectionStatus, updateTrademarkHearingStatus, updateTrademarkAssignmentStatus, updateTrademarkRenewalStatus,
    updateCopyrightRegistrationStatus, updatePatentFilingStatus, updateDesignRegistrationStatus,
    updatePFRegistrationStatus, updateESIRegistrationStatus, updateProfessionalTaxStatus, updateLabourWelfareFundStatus, updateGratuityActStatus, updateBonusActStatus, updateMinimumWagesStatus, updateFactoryLicenseStatus,
    updateMSMERegistrationStatus, updateISOCertificationStatus, updateStartupIndiaStatus, updateDigitalSignatureStatus, updateBarCodeStatus, updateTanPanStatus,
    updatePartnershipDeedStatus, updateFoundersAgreementStatus, updateShareholdersAgreementStatus, updateEmploymentAgreementStatus, updateRentAgreementStatus, updateFranchiseAgreementStatus, updateNDAStatus, updateVendorAgreementStatus,
    updateFinancialServiceStatus, deleteOrder, deleteAllChats,
    getAllCas, assignRequestToCa
} from '../../../../api';


import axios from 'axios';
// Unified Order Details & Bidding panel replaces specific workflow panels.

// --- CHART COMPONENTS (Inlined for self-containment) ---
const AreaChart = ({ data, color = "#2563EB", height = 60 }) => {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];
        return data.map(d => d.value);
    }, [data]);

    if (!chartData.length) return null;
    const max = Math.max(...chartData) || 1;
    const min = 0;
    const points = chartData.map((val, i) => {
        const x = (i / (chartData.length - 1)) * 100;
        const y = 100 - ((val - min) / max) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="relative w-full overflow-hidden" style={{ height }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <defs>
                    <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polygon points={`0,100 ${points} 100,100`} fill={`url(#grad-${color})`} />
                <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            </svg>
        </div>
    );
};

const DonutChart = ({ data, size = 60 }) => {
    const total = data.reduce((a, b) => a + b.value, 0) || 1;
    let accum = 0;
    const radius = size / 2 - 4;
    const circumference = 2 * Math.PI * radius;

    return (
        <svg width={size} height={size} className="transform -rotate-90">
            {data.map((item, i) => {
                const percent = item.value / total;
                const dashArray = percent * circumference;
                const dashOffset = -(accum * circumference);
                accum += percent;
                return (
                    <circle key={i} r={radius} cx={size / 2} cy={size / 2} fill="transparent" stroke={item.color} strokeWidth="8" strokeDasharray={`${dashArray} ${circumference}`} strokeDashoffset={dashOffset} />
                );
            })}
        </svg>
    );
};

const OrdersManagement = ({ orders = [] }) => {
    const navigate = useNavigate();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [localOrders, setLocalOrders] = useState(orders);

    // Bidding State
    const [bids, setBids] = useState([]);
    const [isBidsModalOpen, setIsBidsModalOpen] = useState(false);
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
    const [broadcastAmount, setBroadcastAmount] = useState('');
    const [broadcastDuration, setBroadcastDuration] = useState('7');
    const [broadcastDescription, setBroadcastDescription] = useState('');

    // CA Assignment State
    const [allCas, setAllCas] = useState([]);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assigningToCa, setAssigningToCa] = useState(false);
    const [assignmentComments, setAssignmentComments] = useState('');
    const [selectedCaId, setSelectedCaId] = useState('');

    const [mainTab, setMainTab] = useState('details'); // details | bidding

    const [fssaiData, setFssaiData] = useState({ docs: [], genDocs: [] });
    const [rejectReason, setRejectReason] = useState('');
    const [rejectingDocId, setRejectingDocId] = useState(null);

    // Chat State (Floating Widget)
    const [activeChatOrder, setActiveChatOrder] = useState(null);
    const [isChatMinimized, setIsChatMinimized] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatMessage, setChatMessage] = useState('');
    const [isMessageSending, setIsMessageSending] = useState(false);
    const [whoIsTyping, setWhoIsTyping] = useState([]);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const prevUnreadCounts = useRef({});
    const localOrdersRef = useRef(orders);
    const [unreadCounts, setUnreadCounts] = useState({});
    const chatEndRef = useRef(null); // Fix: Define chatEndRef

    useEffect(() => {
        localOrdersRef.current = localOrders;
    }, [localOrders]);

    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        fetchUnreadCounts();
        const interval = setInterval(fetchUnreadCounts, 15000); // Poll unread counts every 15s
        return () => clearInterval(interval);
    }, []);

    const hasUnread = (order) => {
        if (!order) return false;
        const ids = [
            order.submissionId,
            order.id,
            order.realId,
            String(order.realId),
            String(order.id),
            (order.id || '').toString().replace('ORD-', '')
        ];
        return ids.some(id => id && unreadCounts[id] > 0);
    };

    const getUnreadCount = (order) => {
        if (!order) return 0;
        const ids = [
            order.submissionId,
            order.id,
            order.realId,
            String(order.realId),
            String(order.id),
            (order.id || '').toString().replace('ORD-', '')
        ];
        for (const id of ids) {
            if (id && unreadCounts[id] > 0) return unreadCounts[id];
        }
        return 0;
    };

    // DEBUG: Show order count
    /*
    console.log("OrdersManagement Rendered. Orders Prop Length:", orders.length);
    if (orders.length > 0) console.log("First Order Sample:", orders[0]);
    */

    const fetchUnreadCounts = async () => {
        try {
            const counts = await getUnreadChatCounts();
            if (counts) {
                Object.keys(counts).forEach(chatId => {
                    const prev = prevUnreadCounts.current[chatId] || 0;
                    const curr = counts[chatId];
                    if (curr > prev) {
                        const order = localOrdersRef.current.find(o =>
                            o.submissionId === chatId || o.id === chatId || String(o.realId) === String(chatId) || String(o.id) === String(chatId)
                        );
                        if (order) {
                            if (Notification.permission === 'granted' && (!activeChatOrder || (activeChatOrder.id !== order.id))) {
                                new Notification(`New Message from ${order.client}`, { body: `Order #${order.id}` })
                                    .onclick = () => { window.focus(); openChat(order); };
                            }
                        }
                    }
                });
                prevUnreadCounts.current = counts;
                setUnreadCounts(counts);
            }
        } catch (e) { console.error(e); }
    };

    // --- PRICING HELPER ---
    const getOrderAmount = (order) => {
        if (order.amount) return order.amount;

        const plan = (order.plan || order.formData?.plan || 'basic').toLowerCase();
        const service = (order.service || '').toLowerCase();

        // 1. Private Limited Company
        if (service.includes('private limited') || service.includes('pvt ltd')) {
            if (plan === 'startup') return 6999;
            if (plan === 'growth') return 14999;
            if (plan === 'enterprise') return 24999;
            return 6999; // default
        }

        // 2. One Person Company (OPC)
        if (service.includes('one person') || service.includes('opc')) {
            if (plan === 'basic') return 4999;
            if (plan === 'standard') return 8999;
            if (plan === 'premium') return 12999;
            return 4999; // default
        }

        // 3. FSSAI (Mock prices based on typical plans if not provided)
        if (service.includes('fssai')) {
            if (plan.includes('1 year')) return 1499;
            if (plan.includes('3 year')) return 2999;
            if (plan.includes('5 year')) return 4999;
            return 1999;
        }

        return 4999; // Fallback for unknown services
    };

    // --- ANALYTICS CALCULATION ---
    const analytics = useMemo(() => {
        const total = localOrders.length;
        const pending = localOrders.filter(o => o.status === 'PENDING').length;

        const completed = localOrders.filter(o => o.status === 'COMPLETED').length;

        // Calculate dynamic revenue
        const revenue = localOrders.reduce((acc, order) => acc + getOrderAmount(order), 0);

        // Status Dist
        const statusDist = [
            { label: 'Completed', value: completed, color: '#10B981' },
            { label: 'Pending', value: pending, color: '#F59E0B' },

            { label: 'Other', value: total - (pending + completed), color: '#94A3B8' }
        ].filter(d => d.value > 0);

        // Revenue Trend (Mock 6 Days based on dynamic total)
        const trend = [0.4, 0.6, 0.5, 0.7, 0.8, 1].map(m => ({ value: m * revenue / 6 })); // Normalized shape

        return { total, pending, completed, revenue, statusDist, trend };
    }, [localOrders]);

    // Sync local orders if props change
    useEffect(() => {
        setLocalOrders(orders);
    }, [orders]);

    useEffect(() => {
        getAllCas().then(setAllCas).catch(console.error);
    }, []);


    const refreshOrderDetails = async () => {
        if (!selectedOrder) return;
        try {
            const allRaw = await getAllApplications();
            // Normalize data to match MasterDashboard structure
            const all = allRaw.map(app => ({
                ...app,
                id: `ORD-${app.id}`,
                realId: app.id,
                submissionId: app.submissionId,
                service: app.service || app.serviceName || 'N/A',
                client: app.client || app.user?.fullName || 'Guest',
                email: app.email || app.user?.email || 'N/A',
                mobile: app.mobile || app.user?.mobile || 'N/A',
                status: app.status,
                tasks: app.tasks,
                date: app.createdAt || new Date().toISOString()
            }));

            const updated = all.find(o =>
                String(o.realId) === String(selectedOrder.realId || selectedOrder.id.toString().replace('ORD-', '')) ||
                o.submissionId === selectedOrder.submissionId
            );

            if (updated) {
                setLocalOrders(all);
                setSelectedOrder(prev => ({ ...prev, ...updated }));
            }
        } catch (e) {
            console.error("Failed to refresh order", e);
        }
    };

    // Auto-refresh when opening modal
    useEffect(() => {
        if (selectedOrder) {
            refreshOrderDetails();


            // FSSAI Fetch
            if (selectedOrder.service?.toLowerCase().includes('fssai')) {
                const realId = selectedOrder.realId || selectedOrder.id.toString().replace('ORD-', '');
                // Simple parallel fetch
                Promise.all([
                    axios.get(`${BASE_URL}/fssai/${realId}/documents`),
                    axios.get(`${BASE_URL}/fssai/${realId}/generated-docs`)
                ]).then(([d, g]) => {
                    setFssaiData({ docs: d.data, genDocs: g.data });
                }).catch(err => console.error("FSSAI Fetch Error", err));
            }
        }
    }, [selectedOrder?.id]);



    const statusColors = {
        'PENDING': 'bg-yellow-100 text-yellow-700',
        'IN_PROGRESS': 'bg-blue-100 text-blue-700',
        'COMPLETED': 'bg-green-100 text-green-700',
        'REJECTED': 'bg-red-100 text-red-700',
        'ASSIGNED': 'bg-purple-100 text-purple-700',
        'AUTOMATION_STARTED': 'bg-indigo-100 text-indigo-700',
        'DOCUMENTS_VERIFIED': 'bg-purple-100 text-purple-700'
    };

    const filteredOrders = localOrders.filter(order => {
        let matchesFilter = false;
        if (filter === 'ALL') matchesFilter = true;
        else if (filter === 'CHAT_PENDING') {
            const chatId = order.submissionId || order.id || order.realId;
            matchesFilter = (unreadCounts[chatId] > 0 || unreadCounts[order.id] > 0 || unreadCounts[order.realId] > 0);
        }
        else matchesFilter = order.status === filter;
        const matchesSearch =
            (order.id?.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.service?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.client?.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const handleUpdateStatus = async (newStatus) => {
        if (!selectedOrder) return;
        setStatusUpdating(true);
        try {
            const realId = selectedOrder.dbId || selectedOrder.realId || selectedOrder.id.toString().replace('ORD-', '');

            // Check if it's a Trade License
            if (selectedOrder.service?.toLowerCase().includes('trade license') || selectedOrder.id.toString().startsWith('TL-')) {
                await updateTradeLicenseStatus(selectedOrder.id, newStatus);
            } else if (selectedOrder.service?.toLowerCase().includes('factory license') || selectedOrder.id.toString().startsWith('FL-')) {
                await updateFactoryLicenseStatus(selectedOrder.id, newStatus);
            } else if (selectedOrder.id.toString().startsWith('LAB-')) {
                await updateLabourLicenseStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('DRUG-')) {
                await updateDrugLicenseStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('PCB-')) {
                await updatePollutionControlStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('GUM-')) {
                await updateGumasthaLicenseStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('TM-')) { // Trademark Reg
                await updateTrademarkRegistrationStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('TM_OBJ-')) {
                await updateTrademarkObjectionStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('TM_HEAR-')) {
                await updateTrademarkHearingStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('TM_ASN-')) {
                await updateTrademarkAssignmentStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('TM_REN-')) {
                await updateTrademarkRenewalStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('CPY-')) {
                await updateCopyrightRegistrationStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('PAT-')) {
                await updatePatentFilingStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('DES-')) {
                await updateDesignRegistrationStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('PF-')) {
                await updatePFRegistrationStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('ESI-')) {
                await updateESIRegistrationStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('PT-')) {
                await updateProfessionalTaxStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('LWF-')) {
                await updateLabourWelfareFundStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('GRA-')) {
                await updateGratuityActStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('BONUS-')) {
                await updateBonusActStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('MW-')) {
                await updateMinimumWagesStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('MSME-')) {
                await updateMSMERegistrationStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('ISO-')) {
                await updateISOCertificationStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('STARTUP-')) {
                await updateStartupIndiaStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('DSC-')) {
                await updateDigitalSignatureStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('BAR-')) {
                await updateBarCodeStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('TP-')) {
                await updateTanPanStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('PARTNER-')) {
                await updatePartnershipDeedStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('FOUNDER-')) {
                await updateFoundersAgreementStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('SHARE-')) {
                await updateShareholdersAgreementStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('EMPLOY-')) {
                await updateEmploymentAgreementStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('RENT-')) {
                await updateRentAgreementStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('FRANCHISE-')) {
                await updateFranchiseAgreementStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('NDA-')) {
                await updateNDAStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('VENDOR-')) {
                await updateVendorAgreementStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('CMA-')) {
                await updateFinancialServiceStatus('cma-data-preparation', realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('DPR-')) {
                await updateFinancialServiceStatus('project-report', realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('BL-')) {
                await updateFinancialServiceStatus('bank-loan-documentation', realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('CF-')) {
                await updateFinancialServiceStatus('cash-flow-compliance', realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('PD-')) {
                await updateFinancialServiceStatus('startup-pitch-deck', realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('BV-')) {
                await updateFinancialServiceStatus('business-valuation', realId, newStatus);
            } else {
                // Generic Service Request
                await updateApplicationStatus(realId, newStatus);
            }

            setLocalOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
            setSelectedOrder(prev => ({ ...prev, status: newStatus }));

            alert('Status updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to update status: ' + error.message);
        } finally {
            setStatusUpdating(false);
        }
    };

    const openBroadcastModal = () => {
        if (!selectedOrder) return;
        setBroadcastAmount(getOrderAmount(selectedOrder));
        setIsBroadcastModalOpen(true);
    };

    const confirmBroadcast = async () => {
        if (!selectedOrder || !broadcastAmount) return;
        setIsBroadcasting(true);
        try {
            const realId = selectedOrder.id.toString().replace('ORD-', '');
            // We can pass duration and description to the API if the backend gets updated to save them
            // For now, making the UI robust like a freelancer job post.
            await broadcastRequest(realId, parseFloat(broadcastAmount), broadcastDuration, broadcastDescription);
            alert("Job posted to all CAs successfully!");
            setIsBroadcastModalOpen(false);
            refreshOrderDetails();
        } catch (e) {
            alert("Failed to broadcast: " + e.message);
        } finally {
            setIsBroadcasting(false);
        }
    };

    const handleViewBids = async () => {
        if (!selectedOrder) return;
        try {
            const realId = selectedOrder.id.toString().replace('ORD-', '');
            const fetchedBids = await getBidsForRequest(realId);
            setBids(fetchedBids || []);
        } catch (e) {
            alert("Failed to fetch bids: " + e.message);
        }
    };

    const handleAcceptBid = async (bidId) => {
        if (!confirm("Are you sure you want to accept this bid? This will assign the CA to this request.")) return;
        try {
            await acceptBid(bidId);
            alert("Bid accepted successfully!");
            setIsBidsModalOpen(false);
            refreshOrderDetails();
        } catch (e) {
            alert("Failed to accept bid: " + e.message);
        }
    };

    const handleDirectAssignCa = async (caId, comments) => {
        if (!selectedOrder) return;
        setAssigningToCa(true);
        try {
            const realId = selectedOrder.id.toString().replace('ORD-', '');
            await assignRequestToCa(realId, caId, comments);
            alert("CA assigned successfully!");
            setIsAssignModalOpen(false);
            refreshOrderDetails();
        } catch (e) {
            alert("Failed to assign CA: " + e.message);
        } finally {
            setAssigningToCa(false);
        }
    };






    // Poll Chat
    useEffect(() => {
        let interval;
        if (activeChatOrder) {
            const fetchChat = async () => {
                if (activeChatOrder && !isChatMinimized) {
                    const chatId = activeChatOrder.submissionId || activeChatOrder.id || activeChatOrder.realId;
                    const msgs = await getChatHistory(chatId);
                    if (JSON.stringify(msgs) !== JSON.stringify(chatHistory)) {
                        setChatHistory(msgs || []);
                        // Assuming `shouldScroll` and `scrollToBottom` are defined elsewhere or will be added.
                        // For now, we'll just scroll if chat history changes.
                        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }

                    // Poll typing status
                    const typing = await getTypingStatus(chatId); // Assuming getTypingStatus is defined
                    const othersTyping = typing.filter(role => role !== 'ADMIN');
                    setWhoIsTyping(othersTyping);
                }
            };
            fetchChat();
            interval = setInterval(fetchChat, 3000);
        }
        return () => {
            clearInterval(interval);
            // Clear typing status when chat is closed or order changes
            if (activeChatOrder) {
                const chatId = activeChatOrder.submissionId || activeChatOrder.id || activeChatOrder.realId;
                setTypingStatus(chatId, 'ADMIN', false); // Assuming setTypingStatus is defined
            }
        };
    }, [activeChatOrder, isChatMinimized, chatHistory, whoIsTyping]); // Added chatHistory to dependencies for comparison

    const handleAdminSendMessage = async () => {
        if (!chatMessage.trim() || !activeChatOrder) return;
        setIsMessageSending(true);
        try {
            const chatId = activeChatOrder.submissionId || activeChatOrder.id;
            if (editingMessageId) {
                await editChatMessage(editingMessageId, chatMessage); // Assuming editChatMessage is defined
                setEditingMessageId(null);
            } else {
                await sendChatMessage({
                    message: chatMessage,
                    ticketId: chatId,
                    email: 'admin@shinefiling.com', // Admin logic
                    role: 'ADMIN'
                });
            }
            setChatMessage('');
            // Trigger immediate fetch
            const history = await getChatHistory(chatId);
            setChatHistory(history || []);
        } catch (e) {
            alert("Failed to send message: " + e.message);
        } finally {
            setIsMessageSending(false);
            // Clear typing status after sending message
            if (activeChatOrder) {
                const chatId = activeChatOrder.submissionId || activeChatOrder.id || activeChatOrder.realId;
                setTypingStatus(chatId, 'ADMIN', false);
            }
        }
    };

    const openChat = async (order) => {
        setActiveChatOrder(order);
        setIsChatMinimized(false);
        setChatHistory([]);

        const chatId = order.submissionId || order.id || order.realId;
        // Mark as read immediately when opening
        if (unreadCounts[chatId] > 0) {
            setUnreadCounts(prev => ({ ...prev, [chatId]: 0 }));
            await markChatAsRead(chatId, 'ADMIN');
            fetchUnreadCounts(); // Refresh to be sure
        }
    };

    const handleTyping = (e) => {
        setChatMessage(e.target.value);
        if (activeChatOrder) {
            const chatId = activeChatOrder.submissionId || activeChatOrder.id || activeChatOrder.realId;
            setTypingStatus(chatId, 'ADMIN', true); // Assuming setTypingStatus is defined

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
                setTypingStatus(chatId, 'ADMIN', false);
            }, 5000); // Stop typing status after 5 seconds of inactivity
        }
    };

    const handleEditClick = (message) => {
        setEditingMessageId(message.id);
        setChatMessage(message.message);
    };

    const handleDeleteClick = async (messageId) => {
        if (!activeChatOrder || !window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await deleteChatMessage(messageId); // Assuming deleteChatMessage is defined
            const chatId = activeChatOrder.submissionId || activeChatOrder.id || activeChatOrder.realId;
            const history = await getChatHistory(chatId);
            setChatHistory(history || []);
        } catch (e) {
            alert("Failed to delete message: " + e.message);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("CRITICAL: Are you sure you want to permanently delete this order? All related data (chats, files) will be removed.")) return;

        try {
            await deleteOrder(orderId);
            setOrders(orders.filter(o => o.id !== orderId)); // Optimistic update
            alert("Order deleted successfully.");
            refreshOrderDetails(); // Refresh list just in case
        } catch (e) {
            alert("Failed to delete order: " + e.message);
        }
    };

    const handleClearChat = async () => {
        if (!activeChatOrder || !window.confirm("Are you sure you want to clear this chat? This action cannot be undone.")) return;
        try {
            const chatId = activeChatOrder.submissionId || activeChatOrder.id || activeChatOrder.realId;
            await clearChatHistory(chatId); // Assuming clearChatHistory is defined
            setChatHistory([]);
        } catch (e) {
            alert("Failed to clear chat: " + e.message);
        }
    };

    const handleDeleteAllChats = async () => {
        const pwd = prompt("CRITICAL: Enter Admin Password to DELETE ALL CHAT HISTORY globally:");
        if (pwd) {
            try {
                await deleteAllChats(pwd);
                alert("All chats deleted successfully.");
                setChatHistory([]); // Clear current view if any
                setUnreadCounts({}); // Reset counts
            } catch (e) {
                alert("Operation failed: " + e.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#043E52]">Global Order Management ({localOrders.length})</h2>
                    <p className="text-[#3D4D55] text-sm">Track and manage client applications.</p>
                </div>
                <div>
                    <button onClick={handleDeleteAllChats} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition flex items-center gap-2 border border-red-100">
                        <Trash2 size={16} /> Delete All Chats
                    </button>
                </div>
            </div>

            {/* ANALYTICS DASHBOARD ROW */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* 1. Revenue Card */}
                <div className="bg-white dark:bg-[#1C3540] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-[#2A4550] flex flex-col justify-between transition-colors">
                    <div>
                        <p className="text-[10px] font-bold text-[#3D4D55] dark:text-slate-400 uppercase tracking-wide">Total Revenue</p>
                        <h3 className="text-2xl font-extrabold text-[#043E52] dark:text-white mt-1">₹{analytics.revenue.toLocaleString()}</h3>
                    </div>
                    <div className="mt-4">
                        <AreaChart data={analytics.trend} color="#10B981" height={40} />
                    </div>
                </div>

                {/* 2. Total Orders */}
                <div className="bg-white dark:bg-[#1C3540] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-[#2A4550] flex items-center justify-between transition-colors">
                    <div>
                        <p className="text-[10px] font-bold text-[#3D4D55] dark:text-slate-400 uppercase">Total Orders</p>
                        <h3 className="text-2xl font-extrabold text-[#043E52] dark:text-white">{analytics.total}</h3>
                        <p className="text-[10px] text-green-500 font-bold mt-1">+12% vs last week</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50/50 dark:bg-slate-700/50 flex items-center justify-center text-[#ED6E3F]">
                        <FileText size={20} />
                    </div>
                </div>

                {/* 3. Status Distribution */}
                <div className="bg-white dark:bg-[#1C3540] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-[#2A4550] flex items-center gap-4 transition-colors">
                    <DonutChart data={analytics.statusDist} size={60} />
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase mb-2">Order Status</p>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                            {analytics.statusDist.slice(0, 4).map((d, i) => (
                                <div key={i} className="flex items-center gap-1 text-[10px]">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                                    <span className="text-gray-600 dark:text-slate-300 font-medium truncate">{d.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. Action Card */}
                <div className="bg-gradient-to-br from-[#043E52] to-[#1e2430] dark:from-[#0D1C22] dark:to-[#1a2b33] p-4 rounded-xl shadow-sm text-white flex flex-col justify-center items-center text-center transition-all">
                    <p className="text-xs font-bold text-white/60 uppercase">Pending Actions</p>
                    <h3 className="text-3xl font-extrabold mt-1 text-[#ED6E3F]">{analytics.pending}</h3>
                    <button className="mt-3 px-3 py-1 bg-[#ED6E3F] hover:bg-[#A57753] rounded-lg text-[10px] font-bold transition">Process Now</button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 w-full items-center">
                {/* Search */}
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2.5 border border-gray-200 dark:border-[#2A4550] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED6E3F]/20 focus:border-[#ED6E3F] w-full text-sm bg-white dark:bg-[#1C3540] text-slate-800 dark:text-white transition-colors"
                    />
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3D4D55] dark:text-slate-400" />
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-white dark:bg-[#1C3540] p-1 rounded-xl border border-gray-200 dark:border-[#2A4550] overflow-x-auto w-full md:w-auto items-center max-w-full no-scrollbar transition-colors">
                    {['ALL', 'CHAT_PENDING', 'PENDING', 'COMPLETED'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filter === f ? 'bg-[#FDFBF7] dark:bg-slate-700/50 text-[#ED6E3F] border border-[#ED6E3F]/20 shadow-sm' : 'text-[#3D4D55] dark:text-slate-400 hover:text-[#043E52] dark:hover:text-white'}`}
                        >
                            {f === 'CHAT_PENDING' ? 'PENDING REPLY' : f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="hidden md:block bg-white dark:bg-[#1C3540] rounded-2xl shadow-sm border border-gray-100 dark:border-[#2A4550] overflow-hidden transition-colors">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#F8FAFC] dark:bg-[#0D1C22] text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100 dark:border-[#2A4550]">
                            <tr>
                                <th className="px-6 py-4">Order ID / Date</th>
                                <th className="px-6 py-4">Service Details</th>
                                <th className="px-6 py-4">Client Info</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-center">Payment</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-[#2A4550]">
                            {filteredOrders.length > 0 ? filteredOrders.map((o, i) => (
                                <tr key={i} className="hover:bg-blue-50/50 dark:hover:bg-slate-700/30 transition duration-200 cursor-pointer group" onClick={() => setSelectedOrder(o)}>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-mono font-bold text-[#ED6E3F] text-xs">{o.submissionId}</span>
                                            <span className="text-[10px] text-[#3D4D55] dark:text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                                                <Activity size={10} /> {new Date(o.createdAt || o.date || Date.now()).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-[#FDFBF7] dark:bg-slate-800 text-[#ED6E3F] rounded-lg border border-[#ED6E3F]/20">
                                                <FileText size={14} />
                                            </div>
                                            <div className="max-w-[180px]">
                                                <div className="font-bold text-slate-700 dark:text-slate-200 text-xs truncate" title={o.service}>{o.service}</div>
                                                <div className="text-[10px] text-gray-400 dark:text-slate-500 truncate">Standard Plan</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm ring-2 ring-white dark:ring-slate-700">
                                                {(o.client || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{o.client || 'Unknown Client'}</span>
                                                <span className="text-[10px] text-gray-400 dark:text-slate-500">{o.email || 'N/A'}</span>
                                                <span className="text-[9px] text-gray-400 dark:text-slate-500">{o.mobile || ''}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-bold text-slate-700 dark:text-slate-200 text-xs">₹{(getOrderAmount(o)).toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 text-[10px] font-bold uppercase">
                                            <CheckCircle size={10} /> Paid
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${statusColors[o.status]
                                            ? statusColors[o.status].replace('bg-', 'bg-opacity-10 border-').replace('text-', 'text-')
                                            : 'bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-gray-100 dark:border-slate-700'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusColors[o.status]?.includes('green') ? 'bg-green-500' : 'bg-current'}`}></span>
                                            {o.status?.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteOrder(o.realId || o.id.replace('ORD-', '')); }}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                title="Delete Order"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openChat(o); }}
                                                className={`p-2 rounded-lg transition-colors relative ${hasUnread(o) ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse' : 'text-indigo-500 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'}`}
                                                title="Chat with Client"
                                            >
                                                <MessageCircle size={16} />
                                                {hasUnread(o) && (
                                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 z-20">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 text-[9px] text-white font-bold items-center justify-center border-2 border-white dark:border-slate-800">
                                                            {getUnreadCount(o)}
                                                        </span>
                                                    </span>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (o.service === 'FSSAI License' || o.service === 'FSSAI Registration') {
                                                        // Navigate to dedicated FSSAI Admin Page
                                                        // Ensure we use the correct ID (submissionId or id depending on what API expects)
                                                        navigate(`/admin/fssai/${o.submissionId || o.realId || o.id.replace('ORD-', '')}`);
                                                    } else {
                                                        setSelectedOrder(o);
                                                    }
                                                }}
                                                className="px-3 py-1.5 bg-[#043E52] dark:bg-[#ED6E3F] text-white text-[10px] font-bold rounded-lg hover:bg-[#ED6E3F] dark:hover:bg-[#D55A2A] transition-colors shadow-sm flex items-center gap-1"
                                            >
                                                Details <ChevronRight size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-16 text-center text-gray-400 dark:text-slate-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-full"><Search size={24} className="opacity-20" /></div>
                                            <p className="font-bold text-sm">No orders found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {filteredOrders.length > 0 ? filteredOrders.map((o, i) => (
                    <div key={i} className="bg-white dark:bg-[#1C3540] rounded-xl shadow-sm border border-gray-100 dark:border-[#2A4550] p-4 active:scale-[0.99] transition-transform" onClick={() => setSelectedOrder(o)}>
                        <div className="flex justify-between items-start mb-4 border-b border-gray-50 dark:border-[#2A4550] pb-3">
                            <div>
                                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs block">{o.submissionId}</span>
                                <span className="text-[10px] text-gray-400 dark:text-slate-400 font-medium flex items-center gap-1 mt-1">
                                    <Activity size={10} /> {new Date(o.createdAt || o.date || Date.now()).toLocaleDateString()}
                                </span>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${statusColors[o.status]
                                ? statusColors[o.status].replace('bg-', 'bg-opacity-10 border-').replace('text-', 'text-')
                                : 'bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-gray-100 dark:border-slate-700'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusColors[o.status]?.includes('green') ? 'bg-green-500' : 'bg-current'}`}></span>
                                {o.status?.replace(/_/g, ' ')}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                                    <FileText size={16} />
                                </div>
                                <div className="overflow-hidden">
                                    <div className="font-bold text-slate-700 dark:text-slate-200 text-xs truncate">{o.service}</div>
                                    <div className="text-[10px] text-gray-400 dark:text-slate-500">Standard Plan</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm shrink-0">
                                    {(o.client || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{o.client || 'Unknown Client'}</div>
                                    <div className="text-[10px] text-gray-400 dark:text-slate-500 truncate">{o.email || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-50 dark:border-[#2A4550] flex items-center justify-between">
                            <div>
                                <span className="block text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase">Amount</span>
                                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">₹{(o.amount || 4999).toLocaleString()}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteOrder(o.realId || o.id); }}
                                    className="p-2 text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); openChat(o); }}
                                    className="p-2 text-indigo-500 hover:text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg"
                                >
                                    <MessageCircle size={18} />
                                </button>
                                <button
                                    className="px-4 py-2 bg-slate-800 dark:bg-[#ED6E3F] text-white text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-[#A57753] dark:hover:bg-[#D55A2A] transition"
                                >
                                    Details <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10 text-gray-400 dark:text-slate-500 bg-white dark:bg-[#1C3540] rounded-xl border border-dashed border-gray-200 dark:border-[#2A4550]">
                        <div className="flex flex-col items-center gap-2">
                            <Search size={20} className="opacity-20" />
                            <p className="font-bold text-xs">No orders found.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Detail Modal - Revamped Design */}
            {createPortal(
                <AnimatePresence>
                    {selectedOrder && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedOrder(null)}
                                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                            />
                            <motion.div
                                initial={{ scale: 0.98, opacity: 0, y: 10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.98, opacity: 0, y: 10 }}
                                className="relative bg-[#F8FAFC] dark:bg-[#0D1C22] rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden ring-1 ring-white/20 dark:ring-[#2A4550]"
                            >
                                {/* 1. HEADER */}
                                <div className="bg-white dark:bg-[#152A33] border-b border-slate-200 dark:border-[#2A4550] px-6 py-4 flex justify-between items-center shrink-0">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-800/50">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                                                Order #{selectedOrder.id.replace('ORD-', '')}
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide border ${statusColors[selectedOrder.status] ? statusColors[selectedOrder.status].replace('bg-', 'bg-opacity-10 dark:bg-opacity-30 border-').replace('text-', 'text-') : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700'}`}>
                                                    {selectedOrder.status?.replace(/_/g, ' ')}
                                                </span>
                                            </h2>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                                                {selectedOrder.service}
                                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                                <span className="text-slate-400 dark:text-slate-500 text-xs">{new Date(selectedOrder.createdAt || selectedOrder.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                        <button
                                            onClick={refreshOrderDetails}
                                            className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                            title="Refresh Data"
                                        >
                                            <RefreshCcw size={18} />
                                        </button>
                                        <button
                                            onClick={() => setSelectedOrder(null)}
                                            className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                            title="Close"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* 2. BODY CONTENT */}
                                <div className="flex-1 flex overflow-hidden">
                                    {/* LEFT SIDEBAR (Metadata) */}
                                    <div className="w-80 bg-white dark:bg-[#152A33] border-r border-slate-200 dark:border-[#2A4550] overflow-y-auto p-5 space-y-6 shrink-0 hidden lg:block custom-scrollbar">
                                        {/* Client Card */}
                                        <div className="bg-slate-50 dark:bg-[#1C3540] rounded-xl p-4 border border-slate-100 dark:border-[#2A4550]">
                                            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-3 flex items-center justify-between">
                                                Client Profile
                                                <button onClick={() => openChat(selectedOrder)} className="text-indigo-500 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-1 rounded"><MessageCircle size={14} /></button>
                                            </h4>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                                                    {(selectedOrder.client || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate" title={selectedOrder.client}>{selectedOrder.client || 'Guest User'}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Customer ID: #{selectedOrder.userId || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2.5">
                                                <div className="flex items-center gap-3 p-2 bg-white dark:bg-[#152A33] rounded-lg border border-slate-100 dark:border-[#2A4550]">
                                                    <Mail size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
                                                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate" title={selectedOrder.email}>{selectedOrder.email || 'No Email'}</span>
                                                </div>
                                                <div className="flex items-center gap-3 p-2 bg-white dark:bg-[#152A33] rounded-lg border border-slate-100 dark:border-[#2A4550]">
                                                    <Phone size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
                                                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{selectedOrder.mobile || 'No Mobile'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Financials */}
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Payment Details</h4>
                                            <div className="p-4 rounded-xl border border-slate-100 dark:border-[#2A4550] bg-emerald-50/50 dark:bg-emerald-900/20 flex flex-col gap-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Amount</span>
                                                    <span className="text-sm font-bold text-slate-800 dark:text-emerald-400">₹{(getOrderAmount(selectedOrder)).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Payment Status</span>
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                                                        <CheckCircle size={10} /> PAID
                                                    </span>
                                                </div>
                                                <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Transaction ID</span>
                                                    <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">{selectedOrder.paymentId || 'TXN_MOCK_12345'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Admin Actions</h4>

                                            {/* CA BIDDING ACTIONS */}
                                            {(!selectedOrder.status || selectedOrder.status === 'PENDING' || selectedOrder.status === 'INITIATED') && (
                                                <div className="space-y-2">
                                                    <button
                                                        onClick={openBroadcastModal}
                                                        disabled={isBroadcasting}
                                                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                                                    >
                                                        {isBroadcasting ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />} Broadcast to CAs
                                                    </button>
                                                    <button
                                                        onClick={() => setIsAssignModalOpen(true)}
                                                        className="w-full py-2.5 bg-white dark:bg-[#1C3540] border border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
                                                    >
                                                        <User size={14} /> Directly Assign CA
                                                    </button>
                                                </div>
                                            )}


                                            {(selectedOrder.status === 'OPEN_FOR_BIDDING' || selectedOrder.biddingStatus === 'OPEN') && (
                                                <div className="space-y-2">
                                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 rounded text-center text-[10px] text-indigo-700 dark:text-indigo-400 font-bold animate-pulse">
                                                        Bidding in Progress...
                                                    </div>
                                                    <button
                                                        onClick={handleViewBids}
                                                        className="w-full py-2.5 bg-white dark:bg-[#1C3540] border border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
                                                    >
                                                        <ShieldCheck size={14} /> View Received Bids
                                                    </button>
                                                </div>
                                            )}

                                            {selectedOrder.status !== 'COMPLETED' && (
                                                <button
                                                    onClick={() => handleUpdateStatus('COMPLETED')}
                                                    disabled={statusUpdating}
                                                    className="w-full py-2.5 bg-slate-800 dark:bg-emerald-600 hover:bg-slate-900 dark:hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    {statusUpdating ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle size={14} />} Mark as Completed
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteOrder(selectedOrder.realId || selectedOrder.id.replace('ORD-', ''))}
                                                className="w-full py-2.5 bg-white dark:bg-[#1C3540] border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
                                            >
                                                <Trash2 size={14} /> Delete Order
                                            </button>
                                        </div>
                                    </div>

                                    {/* MAIN WORK AREA */}
                                    <div className="flex-1 bg-slate-50/50 dark:bg-[rgba(13,28,34,0.5)] flex flex-col min-w-0">
                                        {/* Tabs */}
                                        <div className="sticky top-0 z-30 bg-white dark:bg-[#152A33] border-b border-slate-200 dark:border-[#2A4550] px-6 pt-2 flex overflow-x-auto no-scrollbar shadow-sm shrink-0">
                                            <button
                                                onClick={() => setMainTab('details')}
                                                className={`px-5 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${mainTab === 'details'
                                                    ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-t-lg'
                                                    : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-t-lg'
                                                    }`}
                                            >
                                                <FileText size={16} className="inline-block mr-2" /> Application Details
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setMainTab('bidding');
                                                    handleViewBids(); // Load bids automatically when tab is opened
                                                }}
                                                className={`px-5 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${mainTab === 'bidding'
                                                    ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-t-lg'
                                                    : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-t-lg'
                                                    }`}
                                            >
                                                <ShieldCheck size={16} className="inline-block mr-2" /> CA Bidding & Assignment
                                            </button>
                                        </div>

                                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                            {mainTab === 'details' && (
                                                <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
                                                    {/* Data Key-Value Pairs */}
                                                    <div className="bg-white dark:bg-[#1C3540] rounded-xl shadow-sm border border-slate-200 dark:border-[#2A4550] overflow-hidden">
                                                        <div className="px-6 py-4 border-b border-slate-100 dark:border-[#2A4550] flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                                                            <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                                                <Database size={16} className="text-slate-400 dark:text-slate-500" /> Application Data
                                                            </h3>
                                                        </div>
                                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                                            {(() => {
                                                                let objToRender = {};
                                                                if (selectedOrder.formData && typeof selectedOrder.formData === 'string') {
                                                                    try { objToRender = JSON.parse(selectedOrder.formData); } catch (e) { }
                                                                } else if (selectedOrder.formData && typeof selectedOrder.formData === 'object') {
                                                                    objToRender = selectedOrder.formData;
                                                                } else {
                                                                    // Fallback keys if generic extraction fails
                                                                    ['businessName', 'tradeType', 'businessType', 'applicantName', 'municipality', 'ward', 'factoryAddress', 'workerCount', 'factoryType'].forEach(key => {
                                                                        if (selectedOrder[key]) objToRender[key] = selectedOrder[key];
                                                                    });
                                                                }

                                                                const entries = Object.entries(objToRender).filter(([k, v]) => typeof v === 'string' || typeof v === 'number');

                                                                if (entries.length === 0) {
                                                                    return <div className="col-span-full text-center text-slate-400 dark:text-slate-500 text-sm italic py-4">No specific form data captured.</div>;
                                                                }

                                                                return entries.map(([key, val]) => (
                                                                    <div key={key}>
                                                                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1 block">
                                                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                                                        </label>
                                                                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-words">{String(val)}</div>
                                                                    </div>
                                                                ));
                                                            })()}
                                                        </div>
                                                    </div>

                                                    {/* Documents Section */}
                                                    <div className="grid grid-cols-1 gap-6">
                                                        {/* Uploaded Documents */}
                                                        <div className="bg-white dark:bg-[#1C3540] rounded-xl shadow-sm border border-slate-200 dark:border-[#2A4550] flex flex-col">
                                                            <div className="px-5 py-4 border-b border-slate-100 dark:border-[#2A4550] bg-slate-50/50 dark:bg-slate-800/50">
                                                                <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                                                    <Paperclip size={16} className="text-indigo-500 dark:text-indigo-400" /> Client Uploads
                                                                </h3>
                                                            </div>
                                                            <div className="p-5 flex-1">
                                                                {selectedOrder.uploadedDocuments && Object.keys(selectedOrder.uploadedDocuments).length > 0 ? (
                                                                    <ul className="space-y-3">
                                                                        {Object.entries(selectedOrder.uploadedDocuments).map(([docName, url]) => (
                                                                            <li key={docName} className="flex items-center group">
                                                                                <div className="w-8 h-8 rounded bg-slate-100 dark:bg-[#152A33] flex items-center justify-center text-slate-500 dark:text-slate-400 mr-3 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                                                    <FileText size={16} />
                                                                                </div>
                                                                                <div className="flex-1 min-w-0 mr-4">
                                                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase truncate">{docName.replace(/_/g, ' ')}</p>
                                                                                    <p className="text-[10px] text-slate-400 dark:text-slate-500">PDF / Image</p>
                                                                                </div>
                                                                                <a href={url} target="_blank" rel="noreferrer" className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors border border-transparent group-hover:border-indigo-100 dark:group-hover:border-indigo-800/50">
                                                                                    <Eye size={16} />
                                                                                </a>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <div className="flex flex-col items-center justify-center h-32 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-xl">
                                                                        <Paperclip size={24} className="mb-2 opacity-20" />
                                                                        <span className="text-xs font-medium">No uploads found</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {mainTab === 'bidding' && (
                                                <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
                                                    {/* Status Banner */}
                                                    {(selectedOrder.status === 'OPEN_FOR_BIDDING' || selectedOrder.biddingStatus === 'OPEN') && (
                                                        <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 p-4 rounded-xl flex justify-between items-center shadow-sm">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-indigo-100 rounded-lg"><Activity size={20} className="text-indigo-600" /></div>
                                                                <div>
                                                                    <h4 className="font-bold">Bidding is Active</h4>
                                                                    <p className="text-xs opacity-80">Waiting for Chartered Accountants to bid on this request.</p>
                                                                </div>
                                                            </div>
                                                            <Loader2 className="animate-spin text-indigo-500" size={24} />
                                                        </div>
                                                    )}

                                                    {/* Action Cards Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {/* Broadcast Card */}
                                                        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group">
                                                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-xl mb-4 group-hover:scale-110 transition-transform">
                                                                <Zap size={24} />
                                                            </div>
                                                            <h3 className="text-lg font-bold text-slate-800 mb-2">Broadcast to all CAs</h3>
                                                            <p className="text-sm text-slate-500 mb-6 min-h-[40px]">Send this order to all registered Chartered Accountants. They will review the details and place their bids.</p>
                                                            <button
                                                                onClick={openBroadcastModal}
                                                                disabled={isBroadcasting}
                                                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20 active:scale-95 disabled:opacity-70"
                                                            >
                                                                {isBroadcasting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} Start Bidding Process
                                                            </button>
                                                        </div>

                                                        {/* Direct Assign Card */}
                                                        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group">
                                                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl mb-4 group-hover:scale-110 transition-transform">
                                                                <User size={24} />
                                                            </div>
                                                            <h3 className="text-lg font-bold text-slate-800 mb-2">Direct CA Assignment</h3>
                                                            <p className="text-sm text-slate-500 mb-6 min-h-[40px]">Skip the bidding process and directly assign this order to a specific Chartered Accountant from your network.</p>
                                                            <button
                                                                onClick={() => setIsAssignModalOpen(true)}
                                                                className="w-full py-3 bg-white border-2 border-emerald-600 text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition flex items-center justify-center gap-2 active:scale-95"
                                                            >
                                                                <ShieldCheck size={18} /> Assign Specific CA
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Received Bids */}
                                                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mt-8">
                                                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                                                <ShieldCheck size={18} className="text-indigo-600" /> Received Bids
                                                            </h3>
                                                            <button onClick={handleViewBids} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                                                                <RefreshCcw size={14} /> Refresh Bids
                                                            </button>
                                                        </div>
                                                        <div className="p-6">
                                                            {bids.length === 0 ? (
                                                                <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                                                    <Shield size={36} className="mx-auto mb-3 opacity-20 text-slate-600" />
                                                                    <p className="font-bold text-slate-600">No bids received yet.</p>
                                                                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Click "Refresh Bids" to check for new submissions, or start the bidding process using the Broadcast button above.</p>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-4">
                                                                    {bids.map(bid => {
                                                                        const isUnderBudget = selectedOrder?.boundAmount && bid.bidAmount <= selectedOrder.boundAmount;
                                                                        const difference = selectedOrder?.boundAmount ? Math.abs(selectedOrder.boundAmount - bid.bidAmount) : 0;
                                                                        const mockRating = (Math.random() * (5.0 - 4.5) + 4.5).toFixed(1);
                                                                        const mockJobs = Math.floor(Math.random() * 50) + 10;

                                                                        return (
                                                                            <div key={bid.id} className={`border-2 ${bid.status === 'ACCEPTED' ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200 hover:border-indigo-300'} rounded-2xl p-6 flex flex-col md:flex-row gap-6 bg-white transition-all shadow-sm`}>
                                                                                {/* Left Profile Section */}
                                                                                <div className="flex flex-col items-center gap-2 min-w-[120px]">
                                                                                    <div className="relative">
                                                                                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-3xl shadow-md border-4 border-white">
                                                                                            {(bid.ca?.fullName || bid.caName || "C").charAt(0)}
                                                                                        </div>
                                                                                        {bid.status === 'ACCEPTED' && (
                                                                                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white">
                                                                                                <CheckCircle size={14} />
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="text-center">
                                                                                        <p className="font-bold text-slate-800 text-sm whitespace-nowrap">{bid.ca?.fullName || bid.caName || "CA Agent"}</p>
                                                                                        <div className="flex items-center justify-center gap-1 text-[10px] text-amber-500 mt-1">
                                                                                            <span className="font-bold">{mockRating}</span>
                                                                                            <span>★</span>
                                                                                            <span className="text-slate-400">({mockJobs} jobs)</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Center Proposal Section */}
                                                                                <div className="flex-1 flex flex-col justify-center">
                                                                                    <div className="flex items-center gap-3 mb-3">
                                                                                        <h4 className="font-bold text-slate-800 flex items-center gap-2">Proposal Details
                                                                                            {bid.status === 'ACCEPTED' && <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Awarded to Freelancer</span>}
                                                                                            {bid.status === 'REJECTED' && <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Rejected</span>}
                                                                                        </h4>
                                                                                        <span className="text-xs text-slate-400 font-medium">· {new Date(bid.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                                                                                    </div>

                                                                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 relative">
                                                                                        <div className="absolute top-0 left-4 -translate-y-1/2 bg-white px-2 py-0.5 text-[9px] font-bold tracking-wider text-slate-400 uppercase rounded-full border border-slate-100">Cover Letter</div>
                                                                                        <p className="text-sm text-slate-600 leading-relaxed italic">
                                                                                            "{bid.remarks || "No cover letter provided. Ready to start immediately."}"
                                                                                        </p>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Right Action Section */}
                                                                                <div className="flex flex-col md:w-48 items-center md:items-end justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 pl-0 md:pl-6">
                                                                                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Bid Amount</p>
                                                                                    <p className="font-extrabold text-3xl text-slate-800">₹{bid.bidAmount?.toLocaleString()}</p>

                                                                                    {selectedOrder?.boundAmount && (
                                                                                        <p className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${isUnderBudget ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                                                            {isUnderBudget ? `₹${difference.toLocaleString()} Under Budget` : `₹${difference.toLocaleString()} Over Budget`}
                                                                                        </p>
                                                                                    )}

                                                                                    {bid.status === 'PENDING' && (
                                                                                        <button
                                                                                            onClick={() => handleAcceptBid(bid.id)}
                                                                                            className="w-full mt-4 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold transition shadow-md shadow-indigo-600/20 active:scale-95 flex justify-center items-center gap-2"
                                                                                        >
                                                                                            <CheckCircle size={16} /> Award Job
                                                                                        </button>
                                                                                    )}
                                                                                    {bid.status === 'ACCEPTED' && (
                                                                                        <button disabled className="w-full mt-4 text-sm bg-emerald-100 text-emerald-700 px-5 py-3 rounded-xl font-bold flex justify-center items-center gap-2 opacity-80 cursor-not-allowed">
                                                                                            <CheckCircle size={16} /> Assigned
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* LOGS PANEL (Animated Slide-in) */}

                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
            {/* FLOATING CHAT WIDGET */}
            {/* FLOATING CHAT WIDGET */}
            {/* FLOATING CHAT WIDGET */}
            {activeChatOrder && (
                <div className={`fixed bottom-4 right-4 z-[200] w-[320px] shadow-2xl rounded-2xl overflow-hidden bg-white border border-gray-200 flex flex-col transition-all duration-300 ${isChatMinimized ? 'h-12' : 'h-[450px]'}`}>
                    {/* Chat Header */}
                    <div
                        className="p-3 bg-[#4A3B89] text-white flex justify-between items-center cursor-pointer shrink-0 z-10 relative"
                        onClick={() => setIsChatMinimized(!isChatMinimized)}
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
                                <User size={12} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xs">{activeChatOrder.client || 'Client'}</h3>
                                <p className="text-[9px] text-white/70 font-mono">#{activeChatOrder.id.toString().replace('ORD-', '')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={(e) => { e.stopPropagation(); setIsChatMinimized(!isChatMinimized); }} className="p-1 hover:bg-white/10 rounded"><Minimize2 size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); setActiveChatOrder(null); }} className="p-1 hover:bg-white/10 rounded"><X size={14} /></button>
                        </div>
                    </div>

                    {!isChatMinimized && (
                        <div className="flex-1 flex flex-col min-h-0 bg-white relative font-sans">
                            {/* Chat Messages */}
                            <div className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar bg-[#F8FAFC]">
                                {chatHistory.length === 0 && (
                                    <div className="text-center text-gray-400 text-[10px] py-8 flex flex-col items-center gap-2">
                                        <MessageCircle size={20} className="opacity-20" />
                                        <span>Start conversation with client...</span>
                                    </div>
                                )}
                                {chatHistory.map((msg, i) => {
                                    const isAdmin = msg.sender === 'ADMIN' || msg.senderRole === 'ADMIN' || msg.senderRole === 'SUB_ADMIN';
                                    return (
                                        <div key={i} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} group relative`}>
                                            {/* Messages Actions (Edit/Delete) - Only for own messages */}
                                            {isAdmin && (
                                                <div className="absolute top-0 right-0 -mr-7 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                                                    <button onClick={() => handleEditClick(msg)} className="p-1 hover:bg-gray-100 rounded text-gray-500"><Terminal size={10} /></button>
                                                    <button onClick={() => handleDeleteClick(msg.id)} className="p-1 hover:bg-red-50 rounded text-red-500"><X size={10} /></button>
                                                </div>
                                            )}

                                            <div className={`max-w-[85%] p-2 px-3 text-[10px] shadow-sm ${isAdmin
                                                ? 'bg-[#4A3B89] text-white rounded-xl rounded-tr-none'
                                                : 'bg-white text-gray-800 border-gray-100 rounded-xl rounded-tl-none'
                                                }`}>
                                                {!isAdmin && <p className="text-[8px] font-bold text-[#4A3B89] mb-0.5 opacity-80">{msg.senderName}</p>}
                                                <p className="leading-relaxed">{msg.message} {msg.edited && <span className="text-[8px] opacity-50 italic">(edited)</span>}</p>
                                                <div className={`flex items-center justify-end gap-1 mt-0.5`}>
                                                    <span className={`text-[8px] font-bold ${isAdmin ? 'text-white/60' : 'text-gray-300'}`}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isAdmin && (
                                                        <span className="text-white/80">
                                                            {msg.read ? (
                                                                // Double tick (Read)
                                                                <div className="flex -space-x-1">
                                                                    <CheckCircle size={10} className="fill-blue-400 text-white" />
                                                                </div>
                                                            ) : (
                                                                // Single tick (Sent)
                                                                <CheckCircle size={10} />
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {whoIsTyping.length > 0 && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 text-gray-500 rounded-xl rounded-tl-none p-2 px-3 text-[10px] flex items-center gap-1">
                                            <span className="animate-pulse">Typing...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input Area - Static Compact */}
                            <div className="p-2.5 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
                                <button onClick={handleClearChat} className="text-gray-400 p-1 hover:text-red-500 transition" title="Clear Chat"><Archive size={16} /></button>
                                <input
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#4A3B89] transition-colors"
                                    placeholder={editingMessageId ? "Edit message..." : "Reply to client..."}
                                    value={chatMessage}
                                    onChange={handleTyping}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAdminSendMessage();
                                        }
                                    }}
                                />                   <button
                                    onClick={handleAdminSendMessage}
                                    disabled={!chatMessage.trim() || isMessageSending}
                                    className={`p-1.5 rounded-lg transition-colors ${chatMessage.trim() ? 'bg-[#4A3B89] text-white shadow-sm' : 'bg-gray-100 text-gray-400'}`}
                                >
                                    {isMessageSending ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {/* Broadcast Modal */}
            {isBroadcastModalOpen && createPortal(
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsBroadcastModalOpen(false)} />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden"
                    >
                        <div className="p-1 px-4 py-3 bg-indigo-600 flex justify-between items-center text-white">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <Zap size={16} /> Broadcast Request to CAs
                            </h3>
                            <button onClick={() => setIsBroadcastModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Service Name</label>
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 break-words">
                                    {selectedOrder?.service}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Budget Limit (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 bg-white border border-slate-300 rounded-xl text-lg font-bold text-emerald-600 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono"
                                        value={broadcastAmount}
                                        onChange={(e) => setBroadcastAmount(e.target.value)}
                                        min="0"
                                        placeholder="Max Budget"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Expected Duration (Days)</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 bg-white border border-slate-300 rounded-xl text-lg font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono"
                                        value={broadcastDuration}
                                        onChange={(e) => setBroadcastDuration(e.target.value)}
                                        min="1"
                                        placeholder="e.g. 7"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Project Description / Requirements</label>
                                <textarea
                                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all min-h-[100px] resize-none"
                                    value={broadcastDescription}
                                    onChange={(e) => setBroadcastDescription(e.target.value)}
                                    placeholder="Add any specific requirements or details for the CAs..."
                                />
                                <p className="text-xs text-slate-400 mt-2">These details will be visible to all CAs on their opportunity board.</p>
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => setIsBroadcastModalOpen(false)}
                                    className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmBroadcast}
                                    disabled={!broadcastAmount || isBroadcasting}
                                    className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 transition-all shadow-lg shadow-indigo-600/20 text-sm flex items-center justify-center gap-2"
                                >
                                    {isBroadcasting ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Broadcast'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>,
                document.body
            )}

            {/* Direct Assign CA Modal */}
            {isAssignModalOpen && createPortal(
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAssignModalOpen(false)} />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden"
                    >
                        <div className="p-1 px-4 py-3 bg-indigo-600 flex justify-between items-center text-white">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <User size={16} /> Assign Chartered Accountant
                            </h3>
                            <button onClick={() => setIsAssignModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Select Chartered Accountant</label>
                                <div className="relative">
                                    <select
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none pr-10 font-medium"
                                        value={selectedCaId}
                                        onChange={(e) => setSelectedCaId(e.target.value)}
                                    >
                                        <option value="">-- Choose CA from List --</option>
                                        {allCas.map(ca => (
                                            <option key={ca.id} value={ca.id}>{ca.fullName || ca.name} ({ca.email})</option>
                                        ))}
                                    </select>
                                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" size={16} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Special Instructions</label>
                                <textarea
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 h-28 resize-none transition-all"
                                    placeholder="Add any specific requirements or notes for the CA..."
                                    value={assignmentComments}
                                    onChange={(e) => setAssignmentComments(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setIsAssignModalOpen(false)}
                                    className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDirectAssignCa(selectedCaId, assignmentComments)}
                                    disabled={!selectedCaId || assigningToCa}
                                    className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 transition-all shadow-lg shadow-indigo-600/20 text-sm flex items-center justify-center gap-2"
                                >
                                    {assigningToCa ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Assignment'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default OrdersManagement;
