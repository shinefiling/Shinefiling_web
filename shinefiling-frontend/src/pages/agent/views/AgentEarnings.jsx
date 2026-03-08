
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Download, ArrowUpRight, IndianRupee, Clock } from 'lucide-react';
import { requestWithdrawal } from '../../../api'; // Ensure this import path is correct based on where api.js is relative to this file

const AgentEarnings = ({ stats, user }) => {
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const handleWithdraw = async (e) => {
        e.preventDefault();
        setIsWithdrawing(true);
        try {
            await requestWithdrawal(user.id, parseFloat(withdrawAmount));
            alert("Withdrawal request submitted successfully!");
            setWithdrawAmount('');
        } catch (error) {
            console.error(error);
            alert("Failed to submit request.");
        } finally {
            setIsWithdrawing(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-[#043E52] dark:text-white">Finance & Earnings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Wallet Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-[#043E52] to-[#1C3540] dark:from-[#ED6E3F] dark:to-[#8C6B4A] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <p className="text-white/70 font-medium mb-1">Total Wallet Balance</p>
                                <h3 className="text-4xl font-bold">₹{stats.walletBalance.toLocaleString()}</h3>
                            </div>
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                                <Wallet size={24} className="text-white" />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                                <p className="text-xs text-white/60 font-bold uppercase tracking-wider mb-1">Withdrawable</p>
                                <p className="text-xl font-bold">₹{stats.walletBalance.toLocaleString()}</p>
                            </div>
                            <div className="flex-1 bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                                <p className="text-xs text-white/60 font-bold uppercase tracking-wider mb-1">Pending Clearance</p>
                                <p className="text-xl font-bold">₹0</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Withdrawal Form */}
                <div className="bg-white dark:bg-[#043E52] p-6 rounded-3xl border border-slate-100 dark:border-[#1C3540] shadow-sm">
                    <h3 className="font-bold text-lg text-[#043E52] dark:text-white mb-4">Request Withdrawal</h3>
                    <form onSubmit={handleWithdraw} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Amount (₹)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="number"
                                    min="500"
                                    value={withdrawAmount}
                                    onChange={e => setWithdrawAmount(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#1C3540] border-none rounded-xl focus:ring-2 focus:ring-[#ED6E3F] dark:text-white font-bold"
                                    placeholder="Enter amount"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2">Minimum withdrawal amount is ₹500. Processed within 24 hours.</p>
                        </div>
                        <button
                            type="submit"
                            disabled={isWithdrawing || !withdrawAmount}
                            className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${isWithdrawing || !withdrawAmount
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-[#043E52] dark:bg-[#ED6E3F] text-white hover:shadow-xl hover:scale-[1.02]'
                                }`}
                        >
                            {isWithdrawing ? 'Processing...' : 'Request Payout'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white dark:bg-[#043E52] rounded-3xl border border-slate-100 dark:border-[#1C3540] shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-[#043E52] dark:text-white">Recent Transactions</h3>
                    <button className="p-2 hover:bg-slate-50 dark:hover:bg-[#1C3540] rounded-lg text-slate-400 transition-colors"><Download size={20} /></button>
                </div>

                <div className="space-y-4">
                    {/* Mock Data */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1C3540]/30 rounded-2xl hover:bg-slate-100 dark:hover:bg-[#1C3540] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                    <ArrowUpRight size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#043E52] dark:text-white text-sm">Commission Payout</h4>
                                    <p className="text-xs text-slate-500">Service ID #WX92{i}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">+ ₹500.00</p>
                                <p className="text-[10px] text-slate-400 flex items-center gap-1 justify-end"><Clock size={10} /> 2 days ago</p>
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1C3540]/30 rounded-2xl opacity-70">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center justify-center">
                                <Download size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#043E52] dark:text-white text-sm">Withdrawal to Bank</h4>
                                <p className="text-xs text-slate-500">HDFC **** 8892</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-slate-800 dark:text-white text-sm">- ₹2,000.00</p>
                            <p className="text-[10px] text-slate-400">5 days ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AgentEarnings;
