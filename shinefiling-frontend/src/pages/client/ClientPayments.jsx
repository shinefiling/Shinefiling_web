import React, { useState, useEffect } from 'react';
import { CreditCard, Download, Clock, CheckCircle } from 'lucide-react';
import { getUserPayments, getUserApplications, BASE_URL } from '../../api';

const ClientPayments = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || user.id === undefined) return; // Ensure basic user data, though id/email might vary by auth method

                // Use email for applications, id for direct payments
                const [payments, applications] = await Promise.all([
                    getUserPayments(user.id),
                    getUserApplications(user.email)
                ]);

                let combinedHistory = [];

                // 1. Process Direct Payments
                if (Array.isArray(payments)) {
                    combinedHistory = [...payments];
                }

                // 2. Process Service Orders (Applications) as Invoices
                if (Array.isArray(applications)) {
                    const appInvoices = applications.map(app => {
                        // Create a transaction-like object for the service fee
                        return {
                            id: app.submissionId || `ORD-${app.id}`,
                            desc: `Service Fee - ${app.serviceName}`,
                            description: `Service Fee - ${app.serviceName}`,
                            method: app.paymentMode || 'Online',
                            date: new Date(app.createdAt).toLocaleDateString(),
                            amount: app.amount || app.price || '---',
                            status: app.paymentStatus || 'Success', // Assume success if app exists/is active
                            invoiceUrl: null, // Logic will construct this
                            orderId: app.id,
                            isServiceOrder: true
                        };
                    });
                    combinedHistory = [...combinedHistory, ...appInvoices];
                }

                // Sort by date (newest first)
                combinedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

                setHistory(combinedHistory);
            } catch (error) {
                console.error("Failed to load billing data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDownloadInvoice = (txn) => {
        // Construct URL based on type
        let url = txn.invoiceUrl;

        if (!url) {
            if (txn.isServiceOrder) {
                // For service orders, use the specific order invoice endpoint
                url = `${BASE_URL}/payment/invoice/${txn.orderId || txn.id}`;
            } else {
                // Fallback for generic transactions
                url = `${BASE_URL}/payment/invoice/${txn.orderId || txn.submissionId}`;
            }
        }

        if (url) {
            window.open(url, '_blank');
        } else {
            alert("Invoice generated and attempting to download...");
            // For now, simpler to assume backend handles the /invoice/{id} route 
            window.open(`${BASE_URL}/payment/invoice/${txn.id}`, '_blank');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Cards Header */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Total Spend Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-[#043E52] via-[#1C3540] to-[#2A4550] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#ED6E3F]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Total Expenditure</p>
                                <h3 className="text-3xl font-bold tracking-tight">₹{history.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0).toLocaleString()}<span className="text-xl text-slate-500">.00</span></h3>
                            </div>
                            <div className="p-2.5 bg-white/5 rounded-xl backdrop-blur-md border border-white/10">
                                <CreditCard size={20} className="text-[#ED6E3F]" />
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button className="px-4 py-2 bg-[#ED6E3F] text-white rounded-xl text-xs font-bold shadow-lg hover:bg-[#A57753] transition flex items-center gap-2">
                                Add Funds Credit
                            </button>
                            <button className="px-4 py-2 bg-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/20 transition flex items-center gap-2">
                                <Download size={14} /> Statement
                            </button>
                        </div>
                    </div>
                </div>

                {/* Saved Methods */}
                <div className="bg-white dark:bg-[#043E52] border border-slate-200 dark:border-[#1C3540] rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-base mb-1">Payment Methods</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Manage your saved cards and UPI handles used for checkout.</p>

                        <div className="space-y-2">
                            <div className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-[#1C3540] rounded-xl border border-slate-100 dark:border-[#2A4550]">
                                <div className="w-8 h-5 bg-slate-800 dark:bg-[#0D1C22] rounded flex items-center justify-center text-[7px] text-white font-mono">VISA</div>
                                <span className="text-xs font-mono text-slate-600 dark:text-slate-300 font-medium">•••• 4242</span>
                            </div>
                        </div>
                    </div>
                    <button className="w-full mt-4 py-2.5 border border-slate-200 dark:border-[#1C3540] rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1C3540] transition border-dashed">
                        + Add New Method
                    </button>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white dark:bg-[#043E52] border border-slate-200 dark:border-[#1C3540] rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-[#1C3540] flex items-center justify-center md:justify-between bg-[#FDFBF7] dark:bg-[#043E52]">
                    <h3 className="font-bold text-[#043E52] dark:text-white text-base">Billing & Invoices</h3>
                    <button className="text-[#ED6E3F] text-xs font-bold hover:underline hidden md:block">View All</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-[#1C3540] text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold border-b border-slate-100 dark:border-[#1C3540]">
                            <tr>
                                <th className="px-6 py-3">Order / Tax ID</th>
                                <th className="px-6 py-3">Service Details</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400 font-medium text-xs">Loading billing history...</td></tr>
                            ) : history.length > 0 ? (
                                history.map((txn, i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-[#1C3540] transition border-b border-slate-50 dark:border-[#1C3540] last:border-none">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{txn.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">{txn.desc || txn.description}</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">{txn.method}</div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 font-medium">{txn.date}</td>
                                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-white text-xs">₹{txn.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${txn.status === 'Success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                                {txn.status === 'Success' ? <CheckCircle size={10} /> : <Clock size={10} />}
                                                {txn.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDownloadInvoice(txn)}
                                                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white text-[10px] font-bold transition">
                                                <Download size={12} /> Download
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-slate-400 text-xs">
                                        No invoices found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClientPayments;
