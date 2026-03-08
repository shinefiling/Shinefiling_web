import React, { useState, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
    TrendingUp, Users, IndianRupee, Activity, Calendar, Download, Filter,
    ArrowUpRight, ArrowDownRight, CreditCard, PieChart as PieIcon,
    BarChart as BarIcon, Target, ShoppingBag, MapPin, Smartphone,
    Clock, Monitor, Globe, CheckCircle, AlertCircle, Timer, Server,
    FileText, UserCheck, Briefcase, MousePointer, Layers, MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- UTILS & COMPONENTS ---

const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

const GlassCard = ({ children, className = "" }) => (
    <div className={`bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-3xl ${className}`}>
        {children}
    </div>
);

const KPICard = ({ title, value, subtext, trend, trendValue, icon: Icon, color }) => {
    const colorClasses = {
        emerald: "bg-emerald-500 text-emerald-600 dark:text-emerald-400",
        blue: "bg-blue-500 text-blue-600 dark:text-blue-400",
        violet: "bg-violet-500 text-violet-600 dark:text-violet-400",
        amber: "bg-amber-500 text-amber-600 dark:text-amber-400",
        rose: "bg-rose-500 text-rose-600 dark:text-rose-400",
        teal: "bg-teal-500 text-teal-600 dark:text-teal-400",
        indigo: "bg-indigo-500 text-indigo-600 dark:text-indigo-400"
    };

    return (
        <GlassCard className="p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            {/* Decorative Background Blob */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-3xl ${colorClasses[color].split(' ')[0]}`}></div>

            <div className="relative z-10 flex justify-between items-start mb-4">
                <div className={`p-3.5 rounded-2xl ${colorClasses[color].split(' ')[0]} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center`}>
                    <Icon size={22} className={colorClasses[color].split(' ')[1]} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${trend === 'up' ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800'}`}>
                        {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {trendValue}%
                    </div>
                )}
            </div>
            <div className="relative z-10">
                <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
                <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{value}</h2>
                {subtext && <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium flex items-center gap-1"><Clock size={10} /> {subtext}</p>}
            </div>
        </GlassCard>
    );
};

const ChartContainer = ({ title, subtitle, children, action }) => (
    <GlassCard className="p-8 flex flex-col h-full">
        <div className="flex justify-between items-start mb-8">
            <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{title}</h3>
                {subtitle && <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
            </div>
            {action || (
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            )}
        </div>
        <div className="flex-1 w-full min-h-[320px] relative">
            {children}
        </div>
    </GlassCard>
);

// --- TABS CONTENT ---

const OverviewTab = ({ data, orders }) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard title="Total Revenue" value={formatCurrency(data.totalRevenue)} subtext="All-time earnings" trend="up" trendValue={14.2} icon={IndianRupee} color="emerald" />
            <KPICard title="Total Orders" value={orders.length} subtext={`${data.pendingOrders} pending`} trend="up" trendValue={8.5} icon={ShoppingBag} color="blue" />
            <KPICard title="Avg Order Value" value={formatCurrency(data.avgOrderValue)} subtext="Per transaction" trend="down" trendValue={2.1} icon={CreditCard} color="violet" />
            <KPICard title="Active Users" value={data.usersCount} subtext="Registered accounts" trend="up" trendValue={12.4} icon={Users} color="amber" />
        </div>

        {/* Main Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[450px]">
                <ChartContainer title="Revenue Growth" subtitle="Monthly earnings overview vs targets">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '12px 16px' }}
                                itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                                formatter={(val) => [formatCurrency(val), 'Revenue']}
                            />
                            <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" shadowFilter="drop-shadow(0 4px 6px rgba(139, 92, 246, 0.3))" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>

            <div className="lg:col-span-1 h-[450px]">
                <ChartContainer title="Order Status" subtitle="Real-time distribution">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.statusData}
                                cx="50%" cy="50%"
                                innerRadius={80}
                                outerRadius={110}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={data.COLORS[index % data.COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} formatter={(val) => <span className="text-slate-500 font-medium text-xs ml-1">{val}</span>} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
        </div>
    </div>
);

const RevenueTab = ({ data }) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartContainer title="Revenue Source" subtitle="Income by payment gateway">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[{ name: 'Razorpay', value: data.totalRevenue * 0.7 }, { name: 'Bank Transfer', value: data.totalRevenue * 0.2 }, { name: 'UPI', value: data.totalRevenue * 0.1 }]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={40}>
                            {[{ name: 'Razorpay', value: data.totalRevenue * 0.7 }, { name: 'Bank Transfer', value: data.totalRevenue * 0.2 }, { name: 'UPI', value: data.totalRevenue * 0.1 }].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b'][index]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
            <ChartContainer title="Category Performance" subtitle="Revenue split by service vertical">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={data.categoryData} cx="50%" cy="50%" outerRadius={100} innerRadius={60} fill="#8884d8" dataKey="value" paddingAngle={2}>
                            {data.categoryData.map((entry, index) => <Cell key={index} fill={data.COLORS[index % data.COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Legend iconType="circle" iconSize={8} formatter={(val) => <span className="text-slate-500 font-medium text-xs ml-1">{val}</span>} />
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>

        <GlassCard className="overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Top High-Value Transactions</h3>
                    <p className="text-xs text-slate-500 mt-1">Recent successful payments &gt; ₹5000</p>
                </div>
                <button className="text-violet-600 text-xs font-bold hover:bg-violet-50 px-3 py-2 rounded-lg transition-colors">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/50 dark:bg-slate-700/30 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                        <tr>
                            <th className="p-5 pl-8">Transaction ID</th>
                            <th className="p-5">Client</th>
                            <th className="p-5">Date</th>
                            <th className="p-5 text-right">Amount</th>
                            <th className="p-5 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {data.topTransactions.map((tx, i) => (
                            <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                                <td className="p-5 pl-8 font-mono text-slate-400 group-hover:text-violet-500 transition-colors text-xs">#{tx.id}</td>
                                <td className="p-5 font-bold text-slate-700 dark:text-slate-200 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-200 to-fuchsia-200 text-violet-700 flex items-center justify-center text-xs font-bold">
                                        {tx.client.charAt(0)}
                                    </div>
                                    {tx.client}
                                </td>
                                <td className="p-5 text-slate-500 text-xs font-medium">{new Date(tx.date).toLocaleDateString()}</td>
                                <td className="p-5 text-right font-bold text-slate-700 dark:text-white">{formatCurrency(tx.amount)}</td>
                                <td className="p-5 text-center">
                                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-emerald-200">PAID</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    </div>
);

const UsersTab = ({ data }) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KPICard title="Total Users" value={data.usersCount} trend="up" trendValue={5.4} icon={Users} color="indigo" />
            <KPICard title="New This Month" value={Math.floor(data.usersCount * 0.12)} trend="up" trendValue={18.2} icon={UserCheck} color="teal" />
            <KPICard title="Active Sessions" value={24} subtext="Right now" icon={Activity} color="rose" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartContainer title="Geographic Distribution" subtitle="Top 5 Cities">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart layout="vertical" data={data.geoData} margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="value" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={24} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
            <ChartContainer title="Device Usage" subtitle="Client platform preference">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={[{ name: 'Desktop', value: 65 }, { name: 'Mobile', value: 30 }, { name: 'Tablet', value: 5 }]} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value" paddingAngle={4}>
                            <Cell fill="#6366f1" />
                            <Cell fill="#10b981" />
                            <Cell fill="#f59e0b" />
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" iconSize={8} />
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    </div>
);

const ServicesTab = ({ data }) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartContainer title="Service Popularity" subtitle="Most requested services">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data.servicePopularity} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="value" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
            <ChartContainer title="Turnaround Efficiency" subtitle="Avg. days to complete vs Target">
                <ResponsiveContainer width="100%" height={400}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.servicePerformance}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 15]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <Radar name="Actual Days" dataKey="A" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.5} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    </RadarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    </div>
);

// --- MAIN ANALYTICS DASHBOARD ---


const AnalyticsDashboard = ({ orders = [], users = [], activeTab = 'overview', analyticsData = null }) => {
    // --- DATA PROCESSING ---
    const data = useMemo(() => {
        const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'];

        if (analyticsData) {
            return { ...analyticsData, COLORS };
        }

        // Fallback to client-side calculation if no API data
        const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.price || o.amount) || 0), 0);
        const avgOrderValue = totalRevenue / (orders.length || 1);
        const pendingOrders = orders.filter(o => ['Pending', 'Submitted', 'Processing'].includes(o.status)).length;

        // ... (rest of the logic usually follows) 
        // Note: reusing existing logic is fine for fallback

        // Status Dist
        const statusCounts = {};
        orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
        const statusData = Object.keys(statusCounts).map(k => ({ name: k, value: statusCounts[k] }));

        // Revenue Trend
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueByMonth = months.map(m => ({ name: m, value: 0 }));
        orders.forEach(o => {
            const d = new Date(o.date || o.createdAt);
            if (!isNaN(d)) revenueByMonth[d.getMonth()].value += (Number(o.price || o.amount) || 0);
        });

        // Top Transactions
        const topTransactions = [...orders].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0)).slice(0, 10).map(o => ({
            id: o.id, client: o.client, date: o.date, amount: o.price || o.amount
        }));

        // Geographic (Mock)
        const geoData = [
            { name: 'Chennai', value: 120 }, { name: 'Bangalore', value: 98 },
            { name: 'Mumbai', value: 86 }, { name: 'Delhi', value: 72 },
            { name: 'Coimbatore', value: 45 }
        ];

        // Service Popularity
        const servCounts = {};
        orders.forEach(o => {
            const n = (o.service || 'Other').split(' ').slice(0, 2).join(' ');
            servCounts[n] = (servCounts[n] || 0) + 1;
        });
        const servicePopularity = Object.entries(servCounts).map(([k, v]) => ({ name: k, value: v })).sort((a, b) => b.value - a.value).slice(0, 8);

        // Service Radar (Mock)
        const servicePerformance = [
            { subject: 'GST Reg', A: 5, fullMark: 15 },
            { subject: 'ITR Filing', A: 2, fullMark: 15 },
            { subject: 'Company Inc', A: 12, fullMark: 15 },
            { subject: 'Trademark', A: 8, fullMark: 15 },
            { subject: 'FSSAI', A: 6, fullMark: 15 },
            { subject: 'DSC', A: 1, fullMark: 15 },
        ];

        // Categories
        const catCounts = { 'Registration': 0, 'Compliance': 0, 'Tax': 0, 'Legal': 0 };
        orders.forEach(o => {
            const s = (o.service || '').toLowerCase();
            if (s.includes('registration') || s.includes('incorporation')) catCounts['Registration'] += (Number(o.price) || 0);
            else if (s.includes('return') || s.includes('filing')) catCounts['Compliance'] += (Number(o.price) || 0);
            else if (s.includes('tax')) catCounts['Tax'] += (Number(o.price) || 0);
            else catCounts['Legal'] += (Number(o.price) || 0);
        });
        const categoryData = Object.entries(catCounts).map(([k, v]) => ({ name: k, value: v })).filter(x => x.value > 0);

        // COLORS already defined above

        return {
            totalRevenue, avgOrderValue, pendingOrders, usersCount: users.length,
            statusData, revenueTrend: revenueByMonth, topTransactions,
            geoData, servicePopularity, servicePerformance, categoryData, COLORS
        };
    }, [orders, users]);

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-slate-900">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 px-8 py-6 flex justify-between items-center sticky top-0 z-20 shadow-sm transition-all">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
                        <span className="p-2 rounded-xl bg-violet-600 shadow-lg shadow-violet-500/30 text-white"><Activity size={24} /></span>
                        Analytics Suite.
                    </h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 pl-1">
                        Comprehensive overview of performance, revenue, and user metrics.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-200 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-sm">
                        <Calendar size={14} /> This Month
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-500/20 active:scale-95 transition-all">
                        <Download size={14} /> Export Data
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'overview' && <OverviewTab data={data} orders={orders} />}
                        {activeTab === 'revenue' && <RevenueTab data={data} />}
                        {activeTab === 'users' && <UsersTab data={data} />}
                        {activeTab === 'services' && <ServicesTab data={data} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
