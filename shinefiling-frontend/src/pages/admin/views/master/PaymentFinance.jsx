import React, { useState, useEffect } from 'react';
import {
    IndianRupee, Download, CreditCard, RefreshCcw, CheckCircle,
    ArrowUpRight, ArrowDownLeft, Search, Filter, FileText, AlertCircle,
    Calendar, MoreVertical, ChevronDown, PieChart as PieChartIcon, TrendingUp,
    Wallet, Landmark, Receipt, ExternalLink, ArrowRight, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFinancialData } from '../../../../api';

// --- MOCK DATA FOR FALLBACK ---
const MOCK_DATA = {
    stats: {
        revenue: { total: 1250000, growth: 12.5 },
        pending: { total: 45000, count: 3 },
        refunds: { total: 1200, count: 2 },
        netProfit: { total: 980000, growth: 8.2 }
    },
    transactions: [
        { id: 'TXN-88230', date: '2023-11-12', client: 'TechCorp Solutions', amount: 14999, type: 'Credit', status: 'Success', method: 'Razorpay' },
        { id: 'TXN-88231', date: '2023-11-12', client: 'Alpha Traders', amount: 4999, type: 'Credit', status: 'Success', method: 'UPI' },
        { id: 'TXN-88232', date: '2023-11-11', client: 'John Doe Enterprise', amount: 2500, type: 'Debit', status: 'Refunded', method: 'Reversal' },
        { id: 'TXN-88233', date: '2023-11-10', client: 'Global Exports', amount: 29999, type: 'Credit', status: 'Pending', method: 'Net Banking' },
        { id: 'TXN-88234', date: '2023-11-09', client: 'StartUp Hub', amount: 999, type: 'Credit', status: 'Success', method: 'Card' },
    ],
    invoices: [
        { id: 'INV-2023-001', client: 'TechCorp Solutions', date: 'Nov 12, 2023', amount: 14999, status: 'Paid', items: ['Pvt Ltd Registration', 'DIN Application'] },
        { id: 'INV-2023-002', client: 'Alpha Traders', date: 'Nov 10, 2023', amount: 4999, status: 'Paid', items: ['FSSAI License'] },
        { id: 'INV-2023-003', client: 'Global Exports', date: 'Nov 08, 2023', amount: 29999, status: 'Overdue', items: ['Trademark Filing', 'Patent Search'] },
    ]
};

// --- COMPONENTS ---

const StatCard = ({ label, value, subtext, icon: Icon, color }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
        <div>
            <p className="text-[10px] font-bold text-[#3D4D55] uppercase tracking-widest">{label}</p>
            <h3 className="text-2xl font-extrabold text-[#043E52] mt-1">{value}</h3>
            {subtext && <p className={`text-[10px] font-bold mt-1 ${color?.text || 'text-[#3D4D55]'}`}>{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color?.bg} ${color?.text} group-hover:scale-110 transition-transform`}>
            <Icon size={22} />
        </div>
    </div>
);

const InvoiceCard = ({ invoice }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <FileText size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-[#043E52] text-sm">{invoice.id}</h4>
                    <p className="text-xs text-[#3D4D55]">{invoice.client}</p>
                </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${invoice.status === 'Paid' ? 'bg-green-50 text-green-700' :
                invoice.status === 'Overdue' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'
                }`}>
                {invoice.status}
            </span>
        </div>

        <div className="space-y-2 mb-6 flex-1">
            {invoice.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <div className="w-1 h-1 rounded-full bg-gray-300"></div> {item}
                </div>
            ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div>
                <p className="text-[10px] text-[#3D4D55] font-bold uppercase">Total Amount</p>
                <p className="font-extrabold text-[#043E52]">₹{invoice.amount.toLocaleString()}</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition">
                <Download size={16} />
            </button>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        'Success': 'bg-green-50 text-green-700 border-green-100',
        'Paid': 'bg-green-50 text-green-700 border-green-100',
        'Pending': 'bg-orange-50 text-orange-700 border-orange-100',
        'Refunded': 'bg-purple-50 text-purple-700 border-purple-100',
        'Failed': 'bg-red-50 text-red-700 border-red-100'
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${styles[status] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
            {status}
        </span>
    );
};

const PaymentFinance = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [financialData, setFinancialData] = useState(MOCK_DATA);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetch = async () => {
            // setLoading(true); // Uncomment if using real API
            try {
                const data = await getFinancialData();
                if (data && data.stats) setFinancialData(data);
            } catch (e) {
                console.warn("Using mock financial data");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const filteredTransactions = financialData.transactions.filter(t =>
        t.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                        <Landmark size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[#043E52]">Financial Operations</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                                Live Gateway
                            </span>
                            <span className="text-[#3D4D55] text-xs">| Razorpay Connected</span>
                        </div>
                    </div>
                </div>

                <div className="flex bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm">
                    {[
                        { id: 'dashboard', label: 'Overview', icon: PieChartIcon },
                        { id: 'transactions', label: 'Transactions', icon: ArrowRight },
                        { id: 'invoices', label: 'Invoices', icon: FileText },
                        { id: 'refunds', label: 'Refunds', icon: RefreshCcw },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-[#043E52] text-white shadow-md'
                                : 'text-[#3D4D55] hover:bg-gray-50 hover:text-[#043E52]'
                                }`}
                        >
                            <tab.icon size={14} /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            {activeTab === 'dashboard' && (
                <div className="space-y-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            label="Total Revenue"
                            value={`₹${((financialData?.stats?.revenue?.total || 0) / 100000).toFixed(2)}L`}
                            subtext={`+${financialData?.stats?.revenue?.growth || 0}% vs last month`}
                            icon={IndianRupee}
                            color={{ bg: 'bg-emerald-50', text: 'text-emerald-600' }}
                        />
                        <StatCard
                            label="Net Profit"
                            value={`₹${((financialData?.stats?.netProfit?.total || 0) / 100000).toFixed(2)}L`}
                            subtext="After taxes & fees"
                            icon={Wallet}
                            color={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
                        />
                        <StatCard
                            label="Pending Payouts"
                            value={`₹${(financialData?.stats?.pending?.total || 0).toLocaleString()}`}
                            subtext={`${financialData?.stats?.pending?.count || 0} transactions processing`}
                            icon={Receipt}
                            color={{ bg: 'bg-orange-50', text: 'text-orange-600' }}
                        />
                        <StatCard
                            label="Refund Ratio"
                            value="0.8%"
                            subtext="Low chargeback rate"
                            icon={RefreshCcw}
                            color={{ bg: 'bg-purple-50', text: 'text-purple-600' }}
                        />
                    </div>

                    {/* Charts Section (Mock Visuals) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="font-bold text-[#043E52]">Revenue Flow</h3>
                                    <p className="text-xs text-[#3D4D55]">Net transaction volume over time</p>
                                </div>
                                <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"><Calendar size={18} /></button>
                            </div>
                            {/* CSS-Only Chart Mockup */}
                            <div className="h-48 flex items-end justify-between px-2 gap-2">
                                {[35, 45, 30, 60, 75, 50, 65, 80, 70, 90, 85, 95].map((h, i) => (
                                    <div key={i} className="w-full bg-emerald-50 rounded-t-lg relative group">
                                        <div
                                            className="absolute bottom-0 left-0 right-0 bg-emerald-500 rounded-t-lg transition-all duration-1000 group-hover:bg-emerald-600"
                                            style={{ height: `${h}%` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold uppercase">
                                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                            </div>
                        </div>

                        <div className="bg-[#1e293b] p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5"><Wallet size={120} /></div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Balance</p>
                                <h3 className="text-3xl font-extrabold">₹4,25,000.00</h3>
                                <p className="text-[10px] text-gray-400 mt-2">Available for payout</p>
                            </div>
                            <div className="space-y-3">
                                <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                                    <ArrowUpRight size={16} /> Withdraw Funds
                                </button>
                                <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2">
                                    <ExternalLink size={16} /> View Statement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[#2B3446]">Recent Transactions</h3>
                            <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-[10px] font-bold">{filteredTransactions.length}</span>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                            <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600"><Filter size={16} /></button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Transaction Details</th>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Method</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredTransactions.map((t, i) => (
                                    <tr key={i} className="hover:bg-blue-50/30 transition group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${t.type === 'Credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                    {t.type === 'Credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#043E52] text-xs">{t.id}</p>
                                                    <p className="text-[10px] text-[#3D4D55]">{t.date}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-[#043E52] text-xs">{t.client}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <CreditCard size={12} /> {t.method}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-mono font-bold ${t.type === 'Credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {t.type === 'Credit' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <StatusBadge status={t.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {financialData.invoices.map((inv, i) => <InvoiceCard key={i} invoice={inv} />)}
                    <button className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all min-h-[200px] group">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Plus size={24} className="group-hover:text-emerald-600" />
                        </div>
                        <span className="font-bold text-sm">Draft New Invoice</span>
                    </button>
                </div>
            )}

            {/* Refunds Tab */}
            {activeTab === 'refunds' && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm text-center max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-6 shadow-sm">
                        <RefreshCcw size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#2B3446]">Refund Processing</h3>
                    <p className="text-gray-400 text-sm max-w-md mt-2 mb-8">
                        Initiate refunds safely. All actions are logged for audit purposes.
                        Please ensure you have the correct Transaction ID.
                    </p>
                    <div className="flex w-full max-w-md gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D4D55]" size={18} />
                            <input
                                type="text"
                                placeholder="Enter Transaction ID (e.g. TXN-9988)"
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#ED6E3F]/20 focus:bg-white transition"
                            />
                        </div>
                        <button className="px-6 py-3 bg-[#043E52] text-white font-bold rounded-xl hover:bg-[#ED6E3F] transition shadow-lg">
                            Search
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};



export default PaymentFinance;
