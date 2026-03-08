import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, DollarSign, UserCheck, CheckCircle, X, Search, Filter, AlertCircle } from 'lucide-react';
import { getSuperAdminRequests, bindRequestAmount, getAllCas, assignRequestToCa } from '../../../../api';

const ServiceRequestManager = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cas, setCas] = useState([]);

    // Modals
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showBindModal, setShowBindModal] = useState(false);

    // Form States
    const [bindAmount, setBindAmount] = useState('');
    const [selectedCaId, setSelectedCaId] = useState('');
    const [adminComments, setAdminComments] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [reqData, casData] = await Promise.all([
                getSuperAdminRequests(),
                getAllCas()
            ]);
            setRequests(reqData || []);
            setCas(casData || []);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBindClick = (req) => {
        setSelectedRequest(req);
        setBindAmount(req.boundAmount || '');
        setSelectedCaId(req.assignedCa?.id || '');
        setAdminComments(req.adminComments || '');
        setShowBindModal(true);
    };

    const handleSave = async () => {
        if (!selectedRequest) return;

        try {
            // 1. Bind Amount
            if (bindAmount && bindAmount !== selectedRequest.boundAmount) {
                await bindRequestAmount(selectedRequest.id, bindAmount);
            }

            // 2. Assign CA
            if (selectedCaId) {
                await assignRequestToCa(selectedRequest.id, selectedCaId, adminComments);
            }

            setShowBindModal(false);
            fetchData(); // Refresh
            alert("Updated successfully!");
        } catch (e) {
            alert("Failed to update: " + e.message);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="text-[#ED6E3F]" /> Service Requests & Binding
                </h2>
                <button onClick={fetchData} className="text-sm text-[#ED6E3F] font-bold hover:underline">Refresh</button>
            </div>

            <div className="flex-1 overflow-x-auto p-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                            <th className="p-4">ID</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Service</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Bound Amount</th>
                            <th className="p-4">Assigned CA</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {loading ? (
                            <tr><td colSpan="7" className="p-8 text-center text-gray-400">Loading...</td></tr>
                        ) : requests.length === 0 ? (
                            <tr><td colSpan="7" className="p-8 text-center text-gray-400">No requests found.</td></tr>
                        ) : (
                            requests.map(req => (
                                <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                    <td className="p-4 font-mono text-xs text-gray-400">#{req.id}</td>
                                    <td className="p-4 font-bold text-slate-700">{req.user?.fullName}</td>
                                    <td className="p-4 text-slate-600">{req.serviceName}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${req.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                            req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono">
                                        {req.boundAmount ? `₹${req.boundAmount}` : <span className="text-gray-300">-</span>}
                                    </td>
                                    <td className="p-4">
                                        {req.assignedCa ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                                                    {req.assignedCa.fullName?.charAt(0)}
                                                </div>
                                                <span className="text-slate-700">{req.assignedCa.fullName}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleBindClick(req)}
                                            className="px-3 py-1.5 bg-[#043E52] text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition shadow-sm"
                                        >
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Bind/Assign Modal */}
            <AnimatePresence>
                {showBindModal && selectedRequest && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="bg-[#043E52] p-4 text-white flex justify-between items-center">
                                <h3 className="font-bold">Manage Request #{selectedRequest.id}</h3>
                                <button onClick={() => setShowBindModal(false)}><X size={20} /></button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* 1. Bind Amount */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bind Service Amount (₹)</label>
                                    <div className="relative">
                                        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED6E3F] focus:border-transparent outline-none"
                                            placeholder="Enter amount to fix..."
                                            value={bindAmount}
                                            onChange={e => setBindAmount(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">This amount will be visible to the CA.</p>
                                </div>

                                {/* 2. Assign CA */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Assign Chartered Accountant</label>
                                    <div className="relative">
                                        <UserCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <select
                                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED6E3F] focus:border-transparent outline-none appearance-none bg-white"
                                            value={selectedCaId}
                                            onChange={e => setSelectedCaId(e.target.value)}
                                        >
                                            <option value="">Select CA CRM Partner...</option>
                                            {cas.map(ca => (
                                                <option key={ca.id} value={ca.id}>{ca.fullName} ({ca.email})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* 3. Comments */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Instructions / Work Details</label>
                                    <textarea
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED6E3F] outline-none text-sm h-24"
                                        placeholder="Enter work details for CA..."
                                        value={adminComments}
                                        onChange={e => setAdminComments(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <button onClick={() => setShowBindModal(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg">Cancel</button>
                                <button onClick={handleSave} className="px-6 py-2 bg-[#ED6E3F] text-white font-bold rounded-lg hover:bg-[#a07452] shadow-lg shadow-[#ED6E3F]/20">Save & Update</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ServiceRequestManager;
