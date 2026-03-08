import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FileText, CheckCircle, XCircle, Upload,
    Calendar, AlertTriangle, ArrowLeft, Loader2, Shield,
    Building2, MapPin, User, Phone, Mail, Clock, FileCheck,
    ChevronRight, ExternalLink, RefreshCw, LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { BASE_URL } from '../../../../api';

const API_URL = `${BASE_URL}/fssai`;

const FssaiOrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const [order, setOrder] = useState(null);
    const [docs, setDocs] = useState([]);
    const [genDocs, setGenDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Forms
    const [govDetails, setGovDetails] = useState({ arn: '', date: '' });
    const [rejectReason, setRejectReason] = useState('');
    const [rejectingDocId, setRejectingDocId] = useState(null);

    useEffect(() => {
        fetchData();
    }, [orderId]);

    const fetchData = async () => {
        try {
            // Parallel fetch
            const [docsRes, genDocsRes, orderRes] = await Promise.all([
                axios.get(`${API_URL}/${orderId}/documents`),
                axios.get(`${API_URL}/${orderId}/generated-docs`),
                axios.get(`${API_URL}/${orderId}`)
            ]);

            setDocs(docsRes.data);
            setGenDocs(genDocsRes.data);

            const data = orderRes.data;
            setOrder({
                id: data.submissionId,
                status: data.status,
                createdAt: data.createdAt,
                client: data.applicantName || 'Guest User',
                email: data.applicantEmail || data.user?.email || 'N/A',
                phone: data.applicantPhone || 'N/A',
                businessName: data.businessName,
                constitution: data.constitution,
                kindOfBusiness: data.kindOfBusiness,
                foodCategory: data.foodCategory,
                validity: `${data.numberOfYears} Year${data.numberOfYears > 1 ? 's' : ''}`,
                address: `${data.addressLine1}, ${data.addressLine2 || ''}, ${data.district}, ${data.state} - ${data.pincode}`,
                plan: data.licenseType ? data.licenseType.replace(/_/g, ' ') : 'Standard Plan'
            });

            setLoading(false);

        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleVerify = async (docId, approved, reason = null) => {
        setActionLoading(true);
        try {
            await axios.post(`${API_URL}/${orderId}/verify-doc/${docId}`, { approved, reason });
            // Optimistic update or refetch
            setDocs(prev => prev.map(d => d.id === docId ? { ...d, status: approved ? 'VERIFIED' : 'REJECTED', remark: reason } : d));
            setRejectingDocId(null);
            fetchData(); // Refetch to check if status changed
        } catch (err) {
            console.error(err);
            alert("Verification failed");
        } finally {
            setActionLoading(false);
        }
    };


    const handleSubmitGovt = async () => {
        if (!govDetails.arn) return alert("Please enter ARN Number");
        setActionLoading(true);
        try {
            await axios.post(`${API_URL}/${orderId}/submit-govt`, govDetails);
            fetchData();
            setActiveTab('overview');
        } catch (err) {
            console.error(err);
            alert("Submission failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleUploadCert = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setActionLoading(true);
        try {
            await axios.post(`${API_URL}/${orderId}/upload-certificate`, formData);
            fetchData();
            alert("Certificate Uploaded! Order Completed.");
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setActionLoading(false);
        }
    };

    const downloadFile = (url) => {
        if (!url) return alert("File URL not available");
        window.open(url, '_blank');
    };

    if (loading) return (
        <div className="flex bg-[#F8FAFC] h-screen items-center justify-center">
            <div className="text-center">
                <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={40} />
                <p className="text-slate-500 font-medium animate-pulse">Loading Order Details...</p>
            </div>
        </div>
    );

    const allVerified = docs.length > 0 && docs.every(d => d.status === 'VERIFIED');
    const isReadyForGovt = allVerified;

    return (
        <div className="min-h-screen bg-[#F0F4F8] font-sans pb-12">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-[#043E52]">Order #{orderId}</h1>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FDFBF7] text-[#ED6E3F] border border-[#ED6E3F]/20 uppercase tracking-wide">
                                {order.status.replace(/_/g, ' ')}
                            </span>
                        </div>
                        <p className="text-xs text-[#3D4D55] mt-1 flex items-center gap-2">
                            <Clock size={12} /> Created: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-[#3D4D55] font-bold rounded-lg text-sm hover:bg-slate-50 transition flex items-center gap-2">
                        <Mail size={16} /> Email Client
                    </button>
                    <button className="px-4 py-2 bg-[#043E52] text-white font-bold rounded-lg text-sm hover:bg-[#ED6E3F] transition shadow-lg shadow-[#043E52]/20 flex items-center gap-2">
                        <Phone size={16} /> Call Client
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-12 gap-8">

                {/* LEFT COLUMN: MAIN CONTENT */}
                <div className="col-span-12 lg:col-span-8 space-y-8">

                    {/* PROGRESS STEPPER */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
                        <div className="flex items-center justify-between min-w-[600px]">
                            {[
                                { id: 1, label: "Application", status: "completed" },
                                { id: 2, label: "Verification", status: allVerified ? "completed" : "active" },
                                { id: 3, label: "Govt Submission", status: order.status === 'GOVT_SUBMITTED' ? "completed" : (allVerified ? "active" : "pending") },
                                { id: 4, label: "Completion", status: order.status === 'COMPLETED' ? "completed" : "pending" }
                            ].map((step, idx, arr) => (
                                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                                    <div className="flex flex-col items-center relative z-10">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${step.status === 'completed' ? 'bg-green-500 text-white shadow-lg shadow-green-200' :
                                            step.status === 'active' ? 'bg-[#043E52] text-white ring-4 ring-[#ED6E3F]/20' :
                                                'bg-slate-100 text-slate-400'
                                            }`}>
                                            {step.status === 'completed' ? <CheckCircle size={14} /> : step.id}
                                        </div>
                                        <span className={`text-xs font-bold mt-2 ${step.status === 'active' ? 'text-[#ED6E3F]' :
                                            step.status === 'completed' ? 'text-green-600' : 'text-[#3D4D55]'
                                            }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                    {idx < arr.length - 1 && (
                                        <div className={`h-1 flex-1 mx-4 rounded-full transition-colors duration-300 ${step.status === 'completed' ? 'bg-green-500' : 'bg-slate-100'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TABS HEADER */}
                    <div className="flex border-b border-slate-200">
                        {['overview', 'documents', 'govt_filing'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors ${activeTab === tab
                                    ? 'border-[#ED6E3F] text-[#ED6E3F] bg-[#FDFBF7]'
                                    : 'border-transparent text-[#3D4D55] hover:text-[#043E52] hover:bg-slate-50'
                                    }`}
                            >
                                {tab.replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    {/* TAB: OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Stats/Quick Actions Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-[#3D4D55] text-xs font-bold uppercase">Plan Type</p>
                                        <p className="text-lg font-black text-[#043E52]">{order.plan}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-[#FDFBF7] text-[#ED6E3F] flex items-center justify-center border border-[#ED6E3F]/20"><Shield size={20} /></div>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-[#3D4D55] text-xs font-bold uppercase">Documents</p>
                                        <p className="text-lg font-black text-[#043E52]">{docs.filter(d => d.status === 'VERIFIED').length} / {docs.length} Verified</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><FileCheck size={20} /></div>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* TAB: DOCUMENTS */}
                    {activeTab === 'documents' && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                <h3 className="font-bold text-[#043E52]">Uploaded Documents</h3>
                                <button className="text-[#ED6E3F] text-xs font-bold hover:underline">Download All</button>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {docs.map(doc => (
                                    <div key={doc.id} className="p-4 hover:bg-slate-50/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-sm">{doc.type}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${doc.status === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                                                        doc.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {doc.status}
                                                    </span>
                                                    <button onClick={() => downloadFile(doc.url)} className="text-[10px] text-blue-500 hover:underline flex items-center gap-1">
                                                        <ExternalLink size={10} /> View
                                                    </button>
                                                </div>
                                                {doc.remark && <p className="text-xs text-red-500 mt-1">Reason: {doc.remark}</p>}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {rejectingDocId === doc.id ? (
                                                <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                                                    <input
                                                        autoFocus
                                                        placeholder="Rejection Reason..."
                                                        className="text-xs border rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-red-200 outline-none w-40"
                                                        value={rejectReason}
                                                        onChange={e => setRejectReason(e.target.value)}
                                                    />
                                                    <button onClick={() => handleVerify(doc.id, false, rejectReason)} className="p-1.5 bg-red-500 text-white rounded-md"><CheckCircle size={14} /></button>
                                                    <button onClick={() => setRejectingDocId(null)} className="p-1.5 bg-slate-200 text-slate-500 rounded-md"><XCircle size={14} /></button>
                                                </div>
                                            ) : (
                                                <>
                                                    {doc.status !== 'VERIFIED' && (
                                                        <button
                                                            onClick={() => handleVerify(doc.id, true)}
                                                            className="px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-lg text-xs font-bold hover:bg-green-100"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    {doc.status !== 'REJECTED' && (
                                                        <button
                                                            onClick={() => setRejectingDocId(doc.id)}
                                                            className="px-3 py-1.5 bg-white text-red-500 border border-slate-200 rounded-lg text-xs font-bold hover:bg-red-50 hover:border-red-200"
                                                        >
                                                            Reject
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB: GOVT FILING */}
                    {activeTab === 'govt_filing' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-[#1E293B]">Govt Portal Submission</h3>
                                    <a href="https://foscos.fssai.gov.in" target="_blank" rel="noreferrer" className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1">
                                        Open FOSCoS <ExternalLink size={12} />
                                    </a>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">ARN Number</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 bg-white rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                            placeholder="Enter ARN"
                                            value={govDetails.arn}
                                            onChange={e => setGovDetails({ ...govDetails, arn: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Submission Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2 bg-white rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                            value={govDetails.date}
                                            onChange={e => setGovDetails({ ...govDetails, date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSubmitGovt}
                                    disabled={actionLoading}
                                    className="mt-4 w-full py-2.5 bg-orange-500 text-white font-bold rounded-xl shadow hover:bg-orange-600 transition"
                                >
                                    Mark as Submitted
                                </button>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                                <h3 className="font-bold text-[#1E293B] mb-2">Final Certificate Upload</h3>
                                <p className="text-sm text-slate-500 mb-4">Once approved by Govt, upload the final license PDF here to notify client.</p>

                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-green-300 border-dashed rounded-xl cursor-pointer bg-green-50 hover:bg-green-100 transition">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 text-green-500 mb-2" />
                                        <p className="text-sm text-slate-500 font-bold">Click to upload Certificate</p>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleUploadCert} />
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: SIDEBAR */}
                <div className="col-span-12 lg:col-span-4 space-y-6">

                    {/* CLIENT CARD */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#043E52] to-[#ED6E3F] flex items-center justify-center text-white font-bold text-lg">
                                {order.client.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-[#043E52]">{order.client}</h3>
                                <p className="text-xs text-[#3D4D55]/60">Client ID: #CLI-8821</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Mail size={16} className="text-slate-400" /> {order.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Phone size={16} className="text-slate-400" /> {order.phone}
                            </div>
                            <div className="flex items-start gap-3 text-sm text-slate-600">
                                <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                <span className="leading-tight">{order.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* BUSINESS INFO CARD */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-[#043E52] mb-4 flex items-center gap-2">
                            <Building2 size={18} className="text-[#ED6E3F]" /> Business Details
                        </h3>
                        <div className="space-y-4 divide-y divide-slate-50">
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Entity Name</p>
                                <p className="font-bold text-slate-700">{order.businessName}</p>
                            </div>
                            <div className="pt-3">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Constitution</p>
                                <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                                    {order.constitution}
                                </span>
                            </div>
                            <div className="pt-3">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Kind of Business</p>
                                <p className="text-sm font-medium text-slate-700 leading-snug">{order.kindOfBusiness}</p>
                            </div>
                            <div className="pt-3">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Food Category</p>
                                <p className="text-sm text-slate-600 leading-snug">{order.foodCategory}</p>
                            </div>
                            <div className="pt-3">
                                <p className="text-xs text-[#3D4D55] font-bold uppercase mb-1">Validity</p>
                                <p className="text-sm font-bold text-[#ED6E3F]">{order.validity}</p>
                            </div>
                        </div>
                    </div>

                    {/* NOTES CARD (Mock) */}
                    <div className="bg-yellow-50 rounded-2xl border border-yellow-100 p-6">
                        <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                            <AlertTriangle size={16} /> Admin Notes
                        </h3>
                        <textarea
                            className="w-full bg-white rounded-xl border border-yellow-200 p-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 min-h-[100px]"
                            placeholder="Add internal notes info here..."
                        />
                        <button className="mt-2 text-xs font-bold text-yellow-700 hover:underline">Save Note</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FssaiOrderDetails;
