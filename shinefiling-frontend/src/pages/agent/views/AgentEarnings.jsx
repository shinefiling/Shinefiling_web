import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Download, ArrowUpRight, IndianRupee, Clock, Zap, ShieldCheck, History, ArrowDownLeft, Landmark } from 'lucide-react';
import { requestWithdrawal } from '../../../api';

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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 font-roboto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <div>
                    <h2 className="text-2xl font-black text-[#043E52] dark:text-white uppercase tracking-tight">Financial Center</h2>
                    <p className="text-slate-500 text-sm">Manage your payouts, commissions and wallet</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-full border border-emerald-100 dark:border-emerald-800/30 uppercase tracking-widest">
                        10% Partner Share
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Master Wallet Card */}
                <div className="xl:col-span-2 relative group uppercase">
                    <div className="absolute inset-0 bg-[#ED6E3F] rounded-[48px] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative bg-[#043E52] dark:bg-[#043E52] border border-white/10 rounded-[48px] p-10 text-white overflow-hidden shadow-2xl">
                        {/* Decorative background elements */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#ED6E3F]/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-16">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 opacity-60">
                                        <Landmark size={14} />
                                        <span className="text-[10px] font-black tracking-[0.2em]">Total Partner Balance</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-5xl font-black tracking-tighter">₹{Number(stats.walletBalance).toLocaleString()}</span>
                                        <div className="bg-[#ED6E3F] p-1.5 rounded-lg">
                                            <TrendingUp size={20} className="text-white" />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-16 h-10 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full border-2 border-[#ED6E3F]/50 flex items-center justify-center">
                                        <div className="w-4 h-4 bg-[#ED6E3F] rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mt-auto">
                                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                                    <p className="text-[10px] font-black text-white/40 tracking-widest mb-2">Available for Payout</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold">₹{Number(stats.walletBalance).toLocaleString()}</span>
                                        <ShieldCheck size={20} className="text-emerald-400" />
                                    </div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                                    <p className="text-[10px] font-black text-white/40 tracking-widest mb-2">Bonus Credits</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold">₹0</span>
                                        <Zap size={20} className="text-amber-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Payout Form */}
                <div className="bg-white dark:bg-[#043E52] p-8 rounded-[40px] border border-slate-100 dark:border-[#1C3540] shadow-xl flex flex-col justify-between uppercase">
                    <div>
                        <h3 className="font-black text-lg text-[#043E52] dark:text-white mb-2 tracking-tight">Withdraw Funds</h3>
                        <p className="text-slate-400 text-[11px] font-bold mb-8">Process your earnings to bank</p>
                        
                        <form onSubmit={handleWithdraw} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 mb-2 tracking-widest text-center">Amount to Transfer</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <IndianRupee size={20} className="text-[#ED6E3F]" />
                                    </div>
                                    <input
                                        type="number"
                                        min="500"
                                        max={stats.walletBalance}
                                        value={withdrawAmount}
                                        onChange={e => setWithdrawAmount(e.target.value)}
                                        className="w-full pl-12 pr-4 py-5 bg-slate-50 dark:bg-[#1C3540] border-2 border-transparent focus:border-[#ED6E3F]/30 rounded-[24px] focus:ring-0 dark:text-white text-2xl font-black text-center transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-4 px-2">
                                    <span className="text-[9px] font-black text-slate-400 tracking-widest">MIN: ₹500</span>
                                    <button 
                                        type="button" 
                                        onClick={() => setWithdrawAmount(stats.walletBalance)}
                                        className="text-[9px] font-black text-[#ED6E3F] tracking-widest hover:underline"
                                    >
                                        MAX AMOUNT
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isWithdrawing || !withdrawAmount || Number(withdrawAmount) < 500}
                                className={`w-full py-5 rounded-[24px] font-black text-xs tracking-[0.2em] transition-all shadow-2xl ${
                                    isWithdrawing || !withdrawAmount || Number(withdrawAmount) < 500
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                                    : 'bg-[#ED6E3F] text-white hover:scale-[1.02] active:scale-95 shadow-[#ED6E3F]/40'
                                }`}
                            >
                                {isWithdrawing ? 'PROCESSING...' : 'REQUEST PAYOUT'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-white dark:bg-[#043E52] rounded-[48px] border border-slate-100 dark:border-[#1C3540] shadow-sm overflow-hidden uppercase">
                <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                            <History size={24} className="text-[#ED6E3F]" />
                        </div>
                        <div>
                            <h3 className="font-black text-lg text-[#043E52] dark:text-white tracking-tight">Transaction History</h3>
                            <p className="text-slate-400 text-[10px] font-bold tracking-widest">Tracking last 30 activities</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 rounded-2xl transition-all text-[11px] font-black tracking-widest text-[#043E52] dark:text-white border border-transparent">
                        <Download size={16} /> Export Statement
                    </button>
                </div>

                <div className="p-8">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="group flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-50/50 dark:bg-[#1C3540]/30 rounded-[32px] border border-transparent hover:border-[#ED6E3F]/20 hover:bg-white dark:hover:bg-[#1C3540] transition-all">
                                <div className="flex items-center gap-6 w-full sm:w-auto mb-4 sm:mb-0">
                                    <div className="w-14 h-14 rounded-[20px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                        <ArrowUpRight size={28} />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-black text-[#043E52] dark:text-white text-sm tracking-tight">Commission Credited</h4>
                                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black rounded uppercase tracking-widest">Verified</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold tracking-widest">SERVICE ORDER ID: #SF-ORDER-882{i}</p>
                                    </div>
                                </div>
                                <div className="text-center sm:text-right flex flex-col items-center sm:items-end w-full sm:w-auto">
                                    <p className="text-xl font-black text-emerald-500 tracking-tight">+ ₹500.00</p>
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <Clock size={12} className="opacity-50" />
                                        <span className="text-[9px] font-black tracking-widest">{i * 2} DAYS AGO</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Withdrawal Example */}
                        <div className="group flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-50/30 dark:bg-[#1C3540]/10 rounded-[32px] border border-transparent">
                            <div className="flex items-center gap-6 w-full sm:w-auto mb-4 sm:mb-0">
                                <div className="w-14 h-14 rounded-[20px] bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
                                    <ArrowDownLeft size={28} />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-black text-[#043E52] dark:text-white text-sm tracking-tight font-serif italic text-slate-400">Payout Initiation</h4>
                                        <span className="px-2 py-0.5 bg-slate-500/10 text-slate-500 text-[8px] font-black rounded uppercase tracking-widest">Completed</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold tracking-widest">TRANSFER TO BANK ID: ****8812</p>
                                </div>
                            </div>
                            <div className="text-center sm:text-right flex flex-col items-center sm:items-end w-full sm:w-auto">
                                <p className="text-xl font-black text-slate-400 tracking-tight">- ₹2,000.00</p>
                                <div className="flex items-center gap-1.5 text-slate-300">
                                    <Clock size={12} />
                                    <span className="text-[9px] font-black tracking-widest">5 DAYS AGO</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AgentEarnings;
