import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, Calendar, CheckCircle, ChevronRight, Clock,
    IndianRupee, FileText, Filter, MoreVertical, Plus, Search,
    TrendingUp, User, X, Zap, Shield, List, Eye
} from 'lucide-react';
import { getOpenBiddingRequests, submitCaBid, getCaBids } from '../../../api';

const CaOpportunities = ({ setActiveTab }) => {
    const [opportunities, setOpportunities] = useState([]);
    const [myBids, setMyBids] = useState([]);
    const [viewMode, setViewMode] = useState('opportunities'); // 'opportunities' | 'my-bids'
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [bidRemarks, setBidRemarks] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [caUser] = useState(() => JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        if (viewMode === 'opportunities') {
            fetchOpportunities();
        } else {
            fetchMyBids();
        }
    }, [viewMode]);

    const fetchOpportunities = async () => {
        try {
            setLoading(true);
            const data = await getOpenBiddingRequests();
            setOpportunities(data || []);
        } catch (error) {
            console.error("Failed to fetch opportunities", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyBids = async () => {
        if (!caUser?.id) return;
        try {
            setLoading(true);
            const data = await getCaBids(caUser.id);
            setMyBids(data || []);
        } catch (error) {
            console.error("Failed to fetch bids", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitBid = async (e) => {
        e.preventDefault();
        if (!selectedRequest || !bidAmount) return;

        setIsSubmitting(true);
        try {
            await submitCaBid(selectedRequest.id, caUser.id, parseFloat(bidAmount), bidRemarks);
            alert("Bid submitted successfully!");
            setSelectedRequest(null);
            setBidAmount('');
            setBidRemarks('');
            fetchOpportunities(); // Refresh list (though the request still exists until closed)
        } catch (error) {
            alert("Failed to submit bid: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredOpportunities = opportunities.filter(op =>
        op.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.id?.toString().includes(searchTerm)
    );

    const filteredBids = myBids.filter(bid =>
        bid.serviceRequest?.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.id?.toString().includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Zap className="text-amber-500" fill="currentColor" /> Marketplace
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Manage your opportunities and track submitted bids.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode('opportunities')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'opportunities'
                            ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-[#F97316]'}`}
                    >
                        Active Opportunities
                    </button>
                    <button
                        onClick={() => setViewMode('my-bids')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'my-bids'
                            ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-[#F97316]'}`}
                    >
                        My Submitted Bids
                    </button>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search Input (same as before) */}
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder={viewMode === 'opportunities' ? "Search requests..." : "Search my bids..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 transition-all text-slate-800 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Content Switch */}
            {viewMode === 'opportunities' ? (
                // OPPORTUNITIES GRID
                loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316] mb-4"></div>
                        <p className="text-sm">Loading opportunities...</p>
                    </div>
                ) : filteredOpportunities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOpportunities.map((op) => (
                            <div key={op.id} className="bg-white dark:bg-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-700 flex flex-col justify-between group">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                                            <Briefcase size={20} />
                                        </div>
                                        <span className="px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-wide border border-green-100 dark:border-green-500/20">
                                            Open
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-[#F97316] transition-colors line-clamp-2 mb-2">
                                        {op.serviceName}
                                    </h3>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                <span>Posted {new Date(op.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-indigo-400" />
                                                <span>Est. 7 Days</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                            <IndianRupee size={14} className="text-emerald-500" />
                                            <span>Max Budget: <span className="font-bold text-slate-800 dark:text-white">₹{op.boundAmount?.toLocaleString()}</span></span>
                                        </div>
                                        <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                                Looking for a professional CA to handle {op.serviceName} quickly and efficiently. Please provide your best quote and strategy.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedRequest(op)}
                                    className="w-full py-2.5 bg-slate-800 dark:bg-white text-white dark:text-slate-800 rounded-xl text-xs font-bold hover:bg-[#F97316] dark:hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                                >
                                    Place Bid <ChevronRight size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-slate-700 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500">
                        <Shield size={48} className="opacity-20 mb-4" />
                        <p className="font-bold text-lg text-slate-800 dark:text-white mb-1">No Opportunities Found</p>
                        <p className="text-xs">There are no open requests for bidding at the moment.</p>
                    </div>
                )
            ) : (
                // MY BIDS LIST
                loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316] mb-4"></div>
                        <p className="text-sm">Loading your bids...</p>
                    </div>
                ) : filteredBids.length > 0 ? (
                    <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Service Request</th>
                                    <th className="px-6 py-4">My Bid Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredBids.map(bid => (
                                    <tr key={bid.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800 dark:text-white text-sm">{bid.serviceRequest?.serviceName}</div>
                                            <div className="text-[10px] text-slate-500 font-mono">#{bid.serviceRequest?.id}</div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-white text-sm">
                                            ₹{bid.bidAmount?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${bid.status === 'ACCEPTED' ? 'bg-green-50 text-green-600 border-green-100' :
                                                bid.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' :
                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                {bid.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {new Date(bid.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-slate-700 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500">
                        <List size={48} className="opacity-20 mb-4" />
                        <p className="font-bold text-lg text-slate-800 dark:text-white mb-1">No Bids Submitted</p>
                        <p className="text-xs">You haven't placed any bids yet.</p>
                    </div>
                )
            )}

            {/* Bidding Modal */}
            <AnimatePresence>
                {selectedRequest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRequest(null)}
                            className="absolute inset-0 bg-slate-800/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700"
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Submit Proposal</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Order #{selectedRequest.id}</p>
                                </div>
                                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitBid} className="p-6 space-y-4">
                                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Client's Budget</p>
                                        <p className="text-lg font-bold text-slate-800 dark:text-white font-mono">₹{selectedRequest.boundAmount?.toLocaleString() || 'Flexible'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Est. Duration</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 justify-end"><Clock size={14} className="text-indigo-400" /> 7 Days</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-1">
                                        <label className="block text-xs font-bold text-slate-800 dark:text-white uppercase mb-2">Bid Amount (₹) <span className="text-rose-500">*</span></label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(e.target.value)}
                                                className="w-full pl-8 pr-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#F97316] focus:outline-none font-bold text-slate-800 dark:text-white text-lg transition-all"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-bold text-slate-800 dark:text-white uppercase mb-2">Delivery (Days) <span className="text-rose-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                className="w-full pr-4 pl-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#F97316] focus:outline-none font-bold text-slate-800 dark:text-white text-lg transition-all"
                                                placeholder="e.g. 5"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-800 dark:text-white uppercase mb-2 flex justify-between">
                                        <span>Cover Letter / Strategy <span className="text-rose-500">*</span></span>
                                    </label>
                                    <textarea
                                        rows="4"
                                        required
                                        value={bidRemarks}
                                        onChange={(e) => setBidRemarks(e.target.value)}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#F97316] focus:outline-none text-sm text-slate-800 dark:text-white transition-all resize-none"
                                        placeholder="Introduce yourself, explain why you're a good fit, and share your strategy for completing this service request..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-[#F97316] hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-[#F97316]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>Submit Bid Now <ChevronRight size={16} /></>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CaOpportunities;
