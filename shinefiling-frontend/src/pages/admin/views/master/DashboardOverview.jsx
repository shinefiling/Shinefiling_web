import React, { useMemo, useState, useEffect } from 'react';
import { getNotifications } from '../../../../api';
import {
    Users, Briefcase, Calendar, CheckSquare, IndianRupee,
    TrendingUp, UserPlus, Clock, MoreVertical, Plus,
    FileText, Settings, CreditCard, Activity, AlertCircle, Phone, Mail, Scale
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, trend }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between hover:shadow-md transition-all duration-200">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-full ${colorClass} bg-opacity-10 text-white flex items-center justify-center`}>
                <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
            </div>
            {trend && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
            <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-800 dark:text-white">{value}</span>
            </div>
            {subtext && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtext}</p>}
        </div>
    </div>
);

const DashboardOverview = ({ user, orders = [], users = [], onNavigate, adminStats }) => {
    // Determine greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    const [realNotifications, setRealNotifications] = useState([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            if (user?.email) {
                try {
                    const data = await getNotifications(user.email);
                    if (data && Array.isArray(data)) {
                        setRealNotifications(data.filter(n => n.type === 'KYC_REVIEW' || n.type === 'SYSTEM_ALERT'));
                    }
                } catch (e) {
                    console.error("Dashboard failed to fetch alerts", e);
                }
            }
        };
        fetchAlerts();
        // Refresh every 30 seconds for real-time feel
        const timer = setInterval(fetchAlerts, 30000);
        return () => clearInterval(timer);
    }, [user?.email]);

    // --- Dynamic Stats Calculation ---
    const stats = useMemo(() => {
        const clients = users.filter(u => u.role === 'USER');
        const caPartners = users.filter(u => u.role === 'CA');
        const agents = users.filter(u => u.role === 'AGENT');
        const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.price || o.amount) || 0), 0);
        const pending = orders.filter(o => ['Pending', 'Submitted', 'Processing'].includes(o.status || 'Pending'));
        const completed = orders.filter(o => ['Completed', 'Approved'].includes(o.status));

        // Status for Pie Chart
        const statusDist = orders.reduce((acc, o) => {
            const s = (o.status || 'Unknown').split(' ')[0]; // Simplify
            acc[s] = (acc[s] || 0) + 1;
            return acc;
        }, {});
        const pieData = Object.keys(statusDist).map((k, i) => ({
            name: k, value: statusDist[k], color: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'][i % 4]
        }));

        // Service for Bar Chart
        const serviceDist = orders.reduce((acc, o) => {
            const s = (o.service || 'Other').substring(0, 12);
            acc[s] = (acc[s] || 0) + 1;
            return acc;
        }, {});
        const barData = Object.keys(serviceDist).map(k => ({ name: k, value: serviceDist[k] }));

        // Recent Orders (for Clock In/Out section)
        const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

        // Recent Activities (derived from orders + real notifications)
        const orderActivities = orders.slice(0, 4).map(o => ({
            name: o.client || 'Guest User',
            action: o.status === 'Pending' ? 'Created new order' : `Updated order to ${o.status}`,
            target: o.service,
            time: new Date(o.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: new Date(o.date).getTime(),
            isOrder: true
        }));

        const notificationActivities = realNotifications.slice(0, 4).map(n => ({
            name: 'System Alert',
            action: n.title,
            target: n.message,
            time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: new Date(n.createdAt).getTime(),
            isNotif: true
        }));

        const activities = [...orderActivities, ...notificationActivities]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 6);

        // Upcoming Deadlines (derived from pending orders)
        const deadlines = pending.slice(0, 3).map(o => ({
            role: 'Compliance',
            title: `Filing Due: ${o.service}`,
            date: new Date(new Date(o.date).getTime() + 15 * 86400000).toLocaleDateString(), // +15 days
            time: '05:00 PM'
        }));

        return {
            totalClients: clients.length,
            totalCAs: caPartners.length,
            totalAgents: agents.length,
            totalOrders: orders.length,
            totalRevenue,
            pendingCount: pending.length,
            completedCount: completed.length,
            profit: totalRevenue * 0.35, // Est 35% margin
            pieData: pieData.length ? pieData : [{ name: 'No Data', value: 1, color: '#eee' }],
            barData: barData.length ? barData : [{ name: 'No Data', value: 0 }],
            recentOrders,
            activities,
            deadlines,
            users
        };
    }, [orders, users]);

    return (
        <div className="space-y-6 font-sans text-slate-800 dark:text-slate-100">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-slate-700 flex items-center justify-center border-2 border-white dark:border-slate-600 shadow-sm overflow-hidden">
                        <img src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=random`} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{greeting}, {user?.fullName || 'Master Admin'}! 👋</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            You have <span className="text-orange-500 font-bold underline cursor-pointer" onClick={() => onNavigate && onNavigate('ops_orders')}>{stats.pendingCount} Pending Approvals</span>, <span className="text-orange-500 font-bold underline cursor-pointer" onClick={() => onNavigate && onNavigate('ca_list')}>{stats.totalCAs} Freelancer Partners</span> & <span className="text-orange-500 font-bold underline cursor-pointer" onClick={() => onNavigate && onNavigate('agent_list')}>{stats.totalAgents} Partners</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => onNavigate && onNavigate('order_mgmt')} className="px-4 py-2.5 bg-[#043E52] text-white text-sm font-bold rounded-lg hover:bg-[#1c3842] transition shadow-lg shadow-[#043E52]/20 flex items-center gap-2">
                        <Plus size={18} /> Add Project
                    </button>
                    <button onClick={() => onNavigate && onNavigate('service_mgmt')} className="px-4 py-2.5 bg-[#ED6E3F] text-white text-sm font-bold rounded-lg hover:bg-[#a37651] transition shadow-lg shadow-[#ED6E3F]/20 flex items-center gap-2">
                        <Plus size={18} /> Add Request
                    </button>
                </div>
            </div>

            {/* Stats Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Clients"
                    value={`${stats.totalClients}/${users.length}`}
                    trend={2.1}
                    icon={Users}
                    colorClass="text-orange-500 bg-orange-500"
                    subtext="Registered vs Total"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    trend={5.4}
                    icon={Briefcase}
                    colorClass="text-teal-600 bg-teal-600"
                    subtext="All service requests"
                />
                <StatCard
                    title="Completed Tasks"
                    value={stats.completedCount}
                    trend={12.5}
                    icon={CheckSquare}
                    colorClass="text-blue-500 bg-blue-500"
                    subtext="Succesfully filed"
                />
                <StatCard
                    title="Pending Actions"
                    value={stats.pendingCount}
                    trend={-2.1}
                    icon={Activity}
                    colorClass="text-pink-500 bg-pink-500"
                    subtext="Requires attention"
                />
            </div>

            {/* Stats Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    trend={10.2}
                    icon={IndianRupee}
                    colorClass="text-purple-500 bg-purple-500"
                    subtext="Gross earnings"
                />
                <StatCard
                    title="Est. Profit"
                    value={`₹${stats.profit.toLocaleString()}`}
                    trend={8.5}
                    icon={TrendingUp}
                    colorClass="text-red-500 bg-red-500"
                    subtext="Net margin (est. 35%)"
                />
                <StatCard
                    title="New Leads"
                    value={users.length - stats.totalClients} // Proxies for guests/leads
                    trend={4.2}
                    icon={UserPlus}
                    colorClass="text-green-500 bg-green-500"
                    subtext="Potential clients"
                />
                <StatCard
                    title="Freelancer Partners"
                    value={stats.totalCAs}
                    trend={0}
                    icon={Scale}
                    colorClass="text-slate-700 bg-slate-700"
                    subtext="Expert Professionals"
                />
                <StatCard
                    title="Business Partners"
                    value={stats.totalAgents}
                    trend={0}
                    icon={Briefcase}
                    colorClass="text-[#F97316] bg-[#F97316]"
                    subtext="Field Partners & Associates"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart 1: Order Status Distribution (Was Employee Status) */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Filing Status</h3>
                        <button className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-bold text-slate-500 dark:text-slate-400">This Week</button>
                    </div>
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <p className="text-xs text-slate-400 dark:text-slate-500">Total Filings</p>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{stats.totalOrders}</h2>
                        </div>
                    </div>
                    {/* Simplified Bar Visual */}
                    <div className="w-full h-4 bg-gray-100 rounded-full flex overflow-hidden mb-6">
                        {stats.pieData.map((d, i) => (
                            <div key={i} style={{ width: `${(d.value / stats.totalOrders) * 100}%`, backgroundColor: d.color }}></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {stats.pieData.slice(0, 4).map((d, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: d.color }}></div>
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">{d.name} ({d.value})</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chart 2: Order Pie (Was Attendance) */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Order Overview</h3>
                        <button className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-bold text-slate-500 dark:text-slate-400">Today</button>
                    </div>
                    <div className="h-64 relative min-w-[0] min-h-[0]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <PieChart>
                                <Pie data={stats.pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {stats.pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[20%] text-center">
                            <p className="text-xs text-slate-400">Total</p>
                            <h2 className="text-2xl font-bold text-slate-800">{stats.totalOrders}</h2>
                        </div>
                    </div>
                </div>

                {/* Chart 3: Services (Was Employees By Dept) */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Top Services</h3>
                        <button className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-bold text-slate-500 dark:text-slate-400">Popular</button>
                    </div>
                    <div className="h-80 min-w-[0] min-h-[0]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <BarChart data={stats.barData} layout="vertical" margin={{ left: -20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={11} fontWeight={600} width={70} />
                                <Bar dataKey="value" fill="#F97316" radius={[0, 4, 4, 0]} barSize={10} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* List 1: Recent Orders (Was Clock In/Out) */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Recent Applications</h3>
                        <button onClick={() => onNavigate && onNavigate('order_mgmt')} className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition">View All</button>
                    </div>
                    <div className="space-y-4">
                        {stats.recentOrders.length === 0 ? <p className="text-sm text-slate-500">No orders.</p> : stats.recentOrders.slice(0, 4).map((ord, i) => (
                            <div key={i} className="flex justify-between items-center border-b border-slate-50 dark:border-slate-700 pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">{ord.client[0]}</div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{ord.client}</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500">{ord.service}</p>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded text-[10px] font-bold ${ord.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {new Date(ord.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* List 2: New Users (Was Jobs) */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">New Registrations</h3>
                        <button onClick={() => onNavigate && onNavigate('user_mgmt')} className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-bold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition">View All</button>
                    </div>
                    <div className="space-y-4">
                        {stats.users.slice(0, 4).map((u, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                        <img src={u.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName || 'User')}&background=random`} alt={u.fullName} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{u.fullName}</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 capitalize">{u.role?.toLowerCase()}</p>
                                    </div>
                                </div>
                                <span className="bg-slate-800 dark:bg-slate-700 text-white dark:text-slate-200 text-[10px] px-2 py-1 rounded font-bold">
                                    Verified
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row - Restored Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Schedules -> Compliance Calendar */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Compliance Deadlines</h3>
                        <button onClick={() => onNavigate && onNavigate('ca_compliance')} className="text-xs text-slate-500 hover:text-slate-800 hover:underline">View</button>
                    </div>
                    <div className="space-y-4">
                        {stats.deadlines.length ? stats.deadlines.map((sch, i) => (
                            <div key={i} className="bg-[#FAFAFA] dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 p-4 rounded-xl">
                                <span className="inline-block bg-[#3B5B66] text-white text-[10px] px-2 py-0.5 rounded mb-2">{sch.role}</span>
                                <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-1">{sch.title}</h4>
                                <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                    <Calendar size={12} /> {sch.date} <Clock size={12} className="ml-2" /> {sch.time}
                                </p>
                            </div>
                        )) : <p className="text-sm text-slate-400">No upcoming deadlines.</p>}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">System Activities</h3>
                        <button onClick={() => onNavigate && onNavigate('audit')} className="text-xs text-slate-500 hover:text-slate-800 hover:underline">View All</button>
                    </div>
                    <div className="space-y-6">
                        {stats.activities.map((act, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="flex-shrink-0 relative">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden relative z-10 flex items-center justify-center font-bold text-xs">
                                        {act.name[0]}
                                    </div>
                                    {i !== stats.activities.length - 1 && <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1px] h-full bg-slate-200 dark:bg-slate-700 -z-0"></div>}
                                </div>
                                <div className="flex-1 pb-2">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{act.name}</h4>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{act.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        {act.action} <span className={act.isNotif ? "text-blue-500 font-bold" : "text-orange-500"}>{act.target}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Birthdays -> Pending Approvals / Partners */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Recent CRM Partners</h3>
                        <button onClick={() => onNavigate && onNavigate('access_agents')} className="text-xs text-slate-500 hover:text-slate-800 hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {users.filter(u => u.role !== 'USER').slice(0, 3).map((u, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                        <img src={u.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName || 'User')}&background=random`} alt={u.fullName} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{u.fullName}</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 capitalize">{u.role?.toLowerCase()}</p>
                                    </div>
                                </div>
                                <button className="bg-[#3B5B66] text-white text-[10px] font-bold px-3 py-1.5 rounded flex items-center gap-1 hover:bg-slate-700">
                                    <Mail size={12} /> Email
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Projects & Tasks Row (Restored "Projects" and "Tasks" Sections) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Projects Table */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Recent Projects (Orders)</h3>
                        <button onClick={() => onNavigate && onNavigate('order_mgmt')} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:underline">View All Projects</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700">
                                    <th className="font-medium py-3 px-2">Project Name</th>
                                    <th className="font-medium py-3 px-2">Client</th>
                                    <th className="font-medium py-3 px-2">Deadline</th>
                                    <th className="font-medium py-3 px-2">Status</th>
                                    <th className="font-medium py-3 px-2">Progress</th>
                                    <th className="font-medium py-3 px-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map((order, i) => (
                                    <tr key={i} className="text-sm text-slate-700 dark:text-slate-300 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                        <td className="py-3 px-2 font-bold">{order.service}</td>
                                        <td className="py-3 px-2 flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                                                {order.client[0]}
                                            </div>
                                            <span className="truncate max-w-[100px]">{order.client}</span>
                                        </td>
                                        <td className="py-3 px-2 text-slate-500 text-xs">
                                            {new Date(new Date(order.date).getTime() + 7 * 86400000).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' :
                                                order.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 w-24">
                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${order.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                                    style={{ width: order.status === 'Completed' ? '100%' : order.status === 'Pending' ? '10%' : '60%' }}
                                                ></div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-right">
                                            <MoreVertical size={14} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                                        </td>
                                    </tr>
                                ))}
                                {stats.recentOrders.length === 0 && (
                                    <tr><td colSpan="6" className="text-center py-4 text-slate-500 text-sm">No active projects found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Task Statistics */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">Task Statistics</h3>
                            <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: 'Doc Verification', val: 75, color: 'bg-indigo-500' },
                                { label: 'Application Filing', val: 45, color: 'bg-orange-500' },
                                { label: 'Client Follow-up', val: 90, color: 'bg-emerald-500' },
                                { label: 'Audit & Review', val: 20, color: 'bg-red-500' }
                            ].map((task, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                                        <span>{task.label}</span>
                                        <span>{task.val}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className={`h-full ${task.color} rounded-full`} style={{ width: `${task.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                                <Plus size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Create Task</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Assign to team members</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
