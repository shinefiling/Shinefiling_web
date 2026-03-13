import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    Wallet, IndianRupee, ArrowUpRight, Clock, 
    CheckCircle2, AlertCircle, Landmark, ExternalLink, 
    Filter, Search, Briefcase, Download, MoreVertical, TrendingUp,
    ChevronDown, CreditCard
} from 'lucide-react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, 
    XAxis, YAxis, CartesianGrid, Tooltip, 
    AreaChart, Area
} from 'recharts';
import { getCaWalletTransactions, requestCaWithdrawal } from '../../../api';

const CaWallet = ({ user, requests }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [withdrawing, setWithdrawing] = useState(false);
    const [walletBalance, setWalletBalance] = useState(user?.walletBalance || 0);
    const [alert, setAlert] = useState(null);

    // Modal States
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");

    // Dynamic Theme Colors
    const ORANGE = "#F97316"; 
    const TEAL = "#0D9488";
    const DUAL_GRADIENT = "from-[#F97316] to-[#0D9488]";

    // Calculate dynamic data
    const stats = useMemo(() => {
        const completed = requests.filter(r => r.status === 'COMPLETED');
        const inProgress = requests.filter(r => r.status !== 'COMPLETED' && r.caApprovalStatus === 'ACCEPTED');
        
        const totalEarnings = completed.reduce((sum, r) => sum + (Number(r.boundAmount) || 0), 0);
        const pendingAmount = inProgress.reduce((sum, r) => sum + (Number(r.boundAmount) || 0), 0);
        
        return {
            total: totalEarnings,
            pending: pendingAmount,
            count: completed.length
        };
    }, [requests]);

    const fetchTransactions = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const data = await getCaWalletTransactions(user.id);
            if (Array.isArray(data)) {
                setTransactions(data);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            const localTxns = requests.filter(r => r.status === 'COMPLETED').map(r => ({
                id: r.id,
                type: 'CREDIT',
                amount: r.boundAmount,
                description: r.serviceName,
                createdAt: r.updatedAt || new Date().toISOString(),
                status: 'SUCCESS'
            })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTransactions(localTxns);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [user?.id, requests]);

    const handleWithdraw = async () => {
        if (!user?.accountNumber || !user?.bankName) {
            setAlert({ type: 'error', message: 'Bank details not linked. Please update your profile.' });
            return;
        }
        if (walletBalance <= 0) {
            setAlert({ type: 'error', message: 'Insufficient balance to withdraw.' });
            return;
        }
        setWithdrawAmount(walletBalance.toString());
        setIsWithdrawModalOpen(true);
    };

    const confirmWithdraw = async () => {
        const amount = Number(withdrawAmount);
        if (!amount || isNaN(amount) || amount <= 0) {
            setAlert({ type: 'error', message: 'Please enter a valid amount.' });
            return;
        }
        
        if (amount > walletBalance) {
            setAlert({ type: 'error', message: 'Amount exceeds available balance.' });
            return;
        }

        try {
            setWithdrawing(true);
            const response = await requestCaWithdrawal(user.id, amount, "Wallet Payout Request");
            setAlert({ type: 'success', message: 'Withdrawal request sent to Admin!' });
            setWalletBalance(response.newBalance);
            setIsWithdrawModalOpen(false);
            fetchTransactions(); 
        } catch (error) {
            setAlert({ type: 'error', message: error.message || 'Withdrawal failed.' });
        } finally {
            setWithdrawing(false);
            setTimeout(() => setAlert(null), 5000);
        }
    };

    // Gauge Chart Data
    const gaugeData = [
        { name: 'Balance', value: Number(walletBalance) },
        { name: 'Remaining', value: Math.max(0, 50000 - Number(walletBalance)) },
    ];

    // Performance Data (Derived from Transactions)
    const performanceData = useMemo(() => {
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            last6Months.push({
                name: date.toLocaleString('default', { month: 'short' }),
                monthNum: date.getMonth(),
                year: date.getFullYear(),
                earnings: 0,
                referrals: 0 
            });
        }

        transactions.forEach(txn => {
            const d = new Date(txn.createdAt);
            const m = d.getMonth();
            const y = d.getFullYear();
            const entry = last6Months.find(l => l.monthNum === m && l.year === y);
            if (entry) {
                if (txn.type === 'CREDIT') entry.earnings += Number(txn.amount);
                else if (txn.type === 'REFERRAL') entry.referrals += Number(txn.amount);
            }
        });

        return last6Months;
    }, [transactions]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 font-roboto pb-10 relative"
        >
            {/* Custom Alert Toast */}
            {alert && (
                <div className={`fixed top-20 right-10 z-[100] px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-bounce ${
                    alert.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
                }`}>
                    {alert.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-black text-xs uppercase tracking-widest">{alert.message}</span>
                </div>
            )}
            {/* Top Row: Overview & Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Overview Gauge Card */}
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2 h-64 relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={gaugeData}
                                    cx="50%"
                                    cy="70%"
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={0}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell key="cell-0" fill={ORANGE} fillOpacity={0.8} />
                                    <Cell key="cell-1" fill="#F1F5F9" fillOpacity={1} />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-[60%] flex flex-col items-center">
                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Available Balance</span>
                            <span className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">
                                ₹{Number(walletBalance).toLocaleString()}
                            </span>
                            <div className={`flex items-center gap-1 text-[10px] font-bold text-[#0D9488] mt-1`}>
                                <TrendingUp size={10} /> +12% this month
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 space-y-5 w-full">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Dashboard Overview</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></div>
                                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Total Confirmed</span>
                                </div>
                                <span className="text-sm font-black text-slate-800 dark:text-white">₹{Number(walletBalance).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full bg-[#0D9488]`}></div>
                                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">On Process</span>
                                </div>
                                <span className="text-sm font-black text-slate-800 dark:text-white">₹{stats.pending.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Other Benefits</span>
                                </div>
                                <span className="text-sm font-black text-slate-800 dark:text-white">₹0.00</span>
                            </div>
                        </div>
                        <button 
                            disabled={withdrawing || walletBalance <= 0 || !user?.accountNumber}
                            onClick={handleWithdraw}
                            className={`w-full mt-4 ${!user?.accountNumber ? 'bg-slate-200 dark:bg-slate-700 text-slate-400' : 'bg-[#F97316] hover:bg-[#EA580C] text-white shadow-orange-500/20'} py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                        >
                            {withdrawing ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : !user?.accountNumber ? 'Link Bank to Withdraw' : 'Withdraw Now'}
                        </button>
                    </div>
                </div>

                {/* Performance Analytics Card */}
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Monthly Analytics</h3>
                        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-wider">
                            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></div> Earnings</div>
                            <div className="flex items-center gap-1.5"><div className={`w-2.5 h-2.5 rounded-full bg-[#0D9488]`}></div> Referrals</div>
                        </div>
                    </div>
                    <div className="flex-1 h-64 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={ORANGE} stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor={ORANGE} stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorTeal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={TEAL} stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor={TEAL} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: '900' }}
                                />
                                <Area type="monotone" dataKey="earnings" stroke={ORANGE} strokeWidth={4} fillOpacity={1} fill="url(#colorOrange)" />
                                <Area type="monotone" dataKey="referrals" stroke={TEAL} strokeWidth={4} fillOpacity={1} fill="url(#colorTeal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Middle Row: Settlement Account & Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Settlement Card */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden relative group">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
                        <div className="space-y-2">
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Settlement Account</span>
                            <h4 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">₹{stats.total.toLocaleString()}</h4>
                            <div className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest">
                                <Clock size={12} strokeWidth={3} /> Processing Bank Payout
                            </div>
                        </div>
                        <div className="flex-1 w-full max-w-sm space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">
                                    <span>Verified Funds</span>
                                    <span className="text-[#0D9488]">75%</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} className={`h-full bg-[#0D9488] rounded-full`} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">
                                    <span>Pending Sync</span>
                                    <span className="text-[#F97316]">25%</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '25%' }} className={`h-full bg-[#F97316] rounded-full`} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Background decoration */}
                    <div className={`absolute bottom-0 right-0 w-64 h-64 bg-[#0D9488]/5 rounded-full translate-x-1/2 translate-y-1/2 group-hover:scale-110 transition-transform`}></div>
                </div>

                {/* Bank Card */}
                <div className={`bg-gradient-to-br ${DUAL_GRADIENT} rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-orange-500/10`}>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md">
                                <CreditCard size={28} strokeWidth={2} />
                            </div>
                            <Landmark size={24} className="opacity-40" />
                        </div>
                        <div className="space-y-1 mt-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Primary Settlement</p>
                            <p className="text-xl font-black tracking-[0.15em]">
                                {user.accountNumber 
                                    ? `•••• •••• •••• ${user.accountNumber.slice(-4)}` 
                                    : 'NOT LINKED'}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold uppercase">{user.fullName?.charAt(0)}</div>
                                <p className="text-[10px] font-black opacity-90 uppercase tracking-[0.1em]">{user.bankName || user.fullName}</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                </div>
            </div>

            {/* Bottom Row: Transaction History */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-8 pb-4 border-b border-slate-50 dark:border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Transaction Logs</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mt-1.5 flex items-center gap-2">
                             Full financial record tracking <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488]"></div>
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0D9488] transition-colors" size={14} />
                            <input 
                                placeholder="Search transactions..." 
                                className={`bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-[11px] font-black focus:ring-2 focus:ring-[#0D9488] outline-none w-56 transition-all`}
                            />
                        </div>
                        <button className={`p-2.5 bg-slate-900 text-white rounded-xl hover:bg-[#0D9488] transition-colors shadow-xl shadow-slate-900/10`}>
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/30 dark:bg-slate-900/30">
                                <th className="text-left py-6 px-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Source Details</th>
                                <th className="text-left py-6 px-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Identity / Email</th>
                                <th className="text-left py-6 px-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount (INR)</th>
                                <th className="text-left py-6 px-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Type</th>
                                <th className="text-left py-6 px-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Log Status</th>
                                <th className="text-right py-6 px-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700/30">
                            {transactions.length > 0 ? transactions.map((txn, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-all cursor-default text-[13px]">
                                    <td className="py-7 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-2xl bg-${txn.type === 'DEBIT' ? 'rose' : 'emerald'}-50 dark:bg-${txn.type === 'DEBIT' ? 'rose' : 'emerald'}-950/20 flex items-center justify-center text-xs font-black text-${txn.type === 'DEBIT' ? 'rose' : 'emerald'}-600 transition-transform group-hover:scale-110`}>
                                                {txn.description?.charAt(0) || 'P'}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 dark:text-white mb-0.5 group-hover:text-[#0D9488] transition-colors">{txn.description || 'Service Partner'}</p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ORDER-ID: {txn.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-7 px-8">
                                        <p className="font-bold text-slate-500 dark:text-slate-400">{user.email}</p>
                                        <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-tighter">{new Date(txn.createdAt).toLocaleDateString()} • {new Date(txn.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    </td>
                                    <td className="py-7 px-8">
                                        <p className={`text-xl font-black tracking-tighter ${txn.type === 'DEBIT' ? 'text-rose-500' : 'text-slate-800 dark:text-white'}`}>
                                            {txn.type === 'DEBIT' ? '-' : '+'}₹{Number(txn.amount).toLocaleString()}
                                        </p>
                                    </td>
                                    <td className="py-7 px-8">
                                        <span className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border ${
                                            txn.type === 'DEBIT' 
                                            ? 'bg-rose-50 text-rose-500 border-rose-100/50' 
                                            : `bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20`
                                        }`}>
                                            {txn.type}
                                        </span>
                                    </td>
                                    <td className="py-7 px-8">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-2 h-2 rounded-full ${txn.status === 'SUCCESS' ? 'bg-[#0D9488] animate-pulse' : 'bg-[#F97316]'}`}></div>
                                            <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{txn.status}</span>
                                        </div>
                                    </td>
                                    <td className="py-7 px-8 text-right">
                                        <button className="p-2 text-slate-300 hover:text-[#0D9488] transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-24 text-center">
                                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-5">
                                            <AlertCircle size={36} className="text-slate-200" />
                                        </div>
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">No Financial History Found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Withdraw Modal */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsWithdrawModalOpen(false)}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] p-8 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-700"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/30 rounded-full flex items-center justify-center text-[#F97316] mb-2">
                                <Wallet size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Withdraw Funds</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-loose">
                                Enter the amount you wish to withdraw to your linked bank account.
                            </p>
                        </div>

                        <div className="mt-8 space-y-6">
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</div>
                                <input 
                                    type="number"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-10 pr-4 text-lg font-black text-slate-800 dark:text-white outline-none focus:border-[#F97316] transition-all"
                                />
                                <div className="flex justify-between mt-2 px-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available: ₹{walletBalance}</span>
                                    <button 
                                        onClick={() => setWithdrawAmount(walletBalance.toString())}
                                        className="text-[10px] font-black text-[#F97316] uppercase tracking-widest hover:underline"
                                    >
                                        Use Max
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={() => setIsWithdrawModalOpen(false)}
                                    className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmWithdraw}
                                    disabled={withdrawing}
                                    className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-[#F97316] text-white shadow-lg shadow-orange-500/20 hover:bg-[#EA580C] transition-all flex items-center justify-center gap-2"
                                >
                                    {withdrawing ? (
                                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : 'Confirm Payout'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default CaWallet;
