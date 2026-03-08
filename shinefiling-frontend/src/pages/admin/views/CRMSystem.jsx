import React, { useState, useEffect } from 'react';
import {
    Users, Briefcase, FileText, CheckSquare, File, CreditCard, Bell, BarChart3, Lock,
    Plus, Search, Filter, Edit2, Trash2, ChevronRight, Phone, Mail, MapPin, Building,
    Download, Upload, Clock, IndianRupee, Calendar, MoreVertical, Folder, FileIcon,
    AlertCircle, CheckCircle2, XCircle, TrendingUp, TrendingDown
} from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getAllUsers } from '../../../api';

// --- Sub-Components (Inline for single-file requirement) ---

// 1. Client Management View
const ClientManagement = ({ clients, onAddClient, onEditClient }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search clients by name, email, or mobile..."
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#F97316]/20 outline-none text-slate-700 dark:text-slate-200 text-sm"
                    />
                </div>
                <button
                    onClick={onAddClient}
                    className="bg-[#F97316] hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-orange-500/20"
                >
                    <Plus size={18} /> Add New Client
                </button>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="p-4 rounded-tl-xl">Client Name</th>
                            <th className="p-4">Contact Info</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Companies</th>
                            <th className="p-4 rounded-tr-xl text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {clients.length > 0 ? (
                            clients.map((client, i) => (
                                <tr key={client.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                                                {client.fullName?.[0] || 'C'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white text-sm">{client.fullName || 'Unknown'}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">ID: CLI-{1000 + i}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center gap-2 text-xs"><Mail size={12} /> {client.email}</div>
                                            <div className="flex items-center gap-2 text-xs"><Phone size={12} /> {client.mobile || 'N/A'}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-[10px] font-bold uppercase border border-blue-100 dark:border-blue-900/30">
                                            {client.type || 'Individual'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${client.active !== false ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30'}`}>
                                            {client.active !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex -space-x-2">
                                            {[1, 2].map((_, idx) => (
                                                <div key={idx} className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-600 dark:text-slate-300">
                                                    <Building size={10} />
                                                </div>
                                            ))}
                                            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-500 dark:text-slate-400">+1</div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => onEditClient(client)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-red-500 dark:text-red-400 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400">
                                    No clients found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// 2. Company Management View
const CompanyManagement = ({ orders = [] }) => {
    // Filter for incorporation services
    const companies = orders.filter(o => {
        const s = (o.service || o.serviceName || '').toLowerCase();
        return s.includes('private limited') || s.includes('llp') || s.includes('one person') || s.includes('limited') || s.includes('section 8');
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
            {companies.length > 0 ? companies.map((comp, i) => (
                <div key={comp.id || i} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-105 transition-transform">
                            <Building size={24} />
                        </div>
                        <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${comp.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                            {comp.status || 'Active'}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate" title={comp.details || 'New Entity'}>
                        {comp.details || (comp.formData && comp.formData.companyName) || 'New Entity'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 truncate">{comp.serviceName}</p>

                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-6">
                        <div className="flex justify-between"><span>Date:</span> <span className="font-medium">{new Date(comp.createdAt || comp.date).toLocaleDateString()}</span></div>
                        <div className="flex justify-between"><span>ID:</span> <span className="font-medium">#{comp.submissionId}</span></div>
                        <div className="flex justify-between"><span>Client:</span> <span className="text-[#F97316]">{comp.client}</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-auto">
                        <button className="px-3 py-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                            <Edit2 size={14} /> Edit
                        </button>
                        <button className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                            <FileText size={14} /> View Docs
                        </button>
                    </div>
                </div>
            )) : (
                <div className="col-span-3 text-center p-12 text-slate-500">No registered companies found.</div>
            )}

            <button className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-[#F97316] hover:text-[#F97316] transition-colors group min-h-[250px]">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20">
                    <Plus size={24} />
                </div>
                <span className="font-bold">Register New Company</span>
            </button>
        </div>
    );
};

// 3. Service & Compliance View
const ServiceTracking = ({ orders = [] }) => {
    // Determine status colors for UI
    const getStatusColor = (status) => {
        const s = (status || '').toLowerCase();
        if (s.includes('complete') || s === 'approved') return 'green';
        if (s.includes('pending') || s === 'submitted') return 'orange';
        if (s.includes('process')) return 'blue';
        return 'slate';
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white">Active Services</h3>
                <button className="text-sm font-bold text-[#F97316] flex items-center gap-1">+ Assign Service</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">
                        <tr>
                            <th className="p-4">Service Name</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Assigned To</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                        {orders.map((svc, i) => {
                            const color = getStatusColor(svc.status);
                            return (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{svc.serviceName || svc.service}</td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">{svc.client}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase bg-${color}-100 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400`}>
                                            {svc.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{new Date(svc.date || svc.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 text-[10px] flex items-center justify-center font-bold">A</div>
                                            <span className="text-slate-600 dark:text-slate-300">Admin</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-blue-600 text-xs font-bold hover:underline">Manage</button>
                                    </td>
                                </tr>
                            );
                        })}
                        {orders.length === 0 && (
                            <tr><td colSpan={6} className="p-6 text-center text-slate-500">No active services found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// 4. Tasks & Workflow View
const TasksWorkflow = ({ orders = [] }) => {
    // Simulate tasks from orders status
    const tasks = {
        'Todo': orders.filter(o => o.status === 'Pending' || o.status === 'Submitted'),
        'In Progress': orders.filter(o => o.status === 'Processing' || o.status === 'In Progress'),
        'Completed': orders.filter(o => o.status === 'Completed' || o.status === 'Approved')
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
            {Object.entries(tasks).map(([status, list], i) => (
                <div key={status} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 h-full">
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center justify-between">
                        {status}
                        <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-xs">{list.length}</span>
                    </h4>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {list.length > 0 ? list.map((task, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-600 cursor-move hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${status === 'Todo' ? 'bg-orange-100 text-orange-600' : status === 'In Progress' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                        {task.serviceName || 'Task'}
                                    </span>
                                    <MoreVertical size={14} className="text-slate-400" />
                                </div>
                                <h5 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">{task.client}</h5>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">ID: #{task.submissionId}</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 border border-white dark:border-slate-700 flex items-center justify-center text-[8px] font-bold">
                                            {task.client?.[0]}
                                        </div>
                                    </div>
                                    <Clock size={14} className="text-slate-400" />
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-xs text-slate-400 py-4">No tasks in this stage</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

// 5. Document Management View
const DocumentManagement = () => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-in fade-in">
        <div className="flex justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white">Client Documents</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <Upload size={16} /> Upload New
            </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['PAN Card', 'Adhaar Card', 'GST Cert', 'Inc Cert', 'MOA', 'AOA'].map((file, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600 flex flex-col items-center justify-center text-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer group">
                    <FileIcon size={32} className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{file}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">1.2 MB • PDF</p>
                </div>
            ))}
            {['Invoices', 'Tax Returns', 'Legal', 'Agreements'].map((folder, i) => (
                <div key={i + 10} className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/20 flex flex-col items-center justify-center text-center hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors cursor-pointer">
                    <Folder size={32} className="text-orange-500 mb-3" />
                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{folder}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">4 Files</p>
                </div>
            ))}
        </div>
    </div>
);

// 6. Billing & Payments View
const BillingPayments = ({ analytics }) => {
    const invoices = analytics?.topTransactions || [];

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-in fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 dark:text-white">Recent Payments</h3>
                <button className="text-[#F97316] font-bold text-sm">+ Create Invoice</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">
                        <tr>
                            <th className="p-4">Transaction ID</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {invoices.length > 0 ? invoices.map((inv, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="p-4 font-bold text-slate-800 dark:text-slate-200 text-xs font-mono">{inv.id}</td>
                                <td className="p-4 text-slate-600 dark:text-slate-400">{inv.client}</td>
                                <td className="p-4 font-bold text-green-600">₹{inv.amount}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">{new Date(inv.date).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                        Success
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Download size={16} /></button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={6} className="p-6 text-center text-slate-500">No payment records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// 7. Reports & Analytics View with Charts
const ReportsAnalytics = ({ analytics }) => {
    // Dynamic Data from Analytics Prop
    const revenueData = analytics?.revenueTrend || [];
    const serviceData = analytics?.categoryData || [];
    const activeClients = analytics?.activeUsers || 0;
    const pendingOrders = analytics?.pendingOrders || 0;
    const totalRevenue = analytics?.totalRevenue || 0;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8b5cf6'];

    return (
        <div className="animate-in fade-in space-y-6">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start">
                        <div><p className="text-slate-500 uppercase text-xs font-bold">Total Clients</p><h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">{activeClients}</h3></div>
                        <div className="p-2 rounded bg-blue-50 text-blue-500"><Users size={20} /></div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start">
                        <div><p className="text-slate-500 uppercase text-xs font-bold">Pending Actions</p><h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">{pendingOrders}</h3></div>
                        <div className="p-2 rounded bg-orange-50 text-orange-500"><CheckSquare size={20} /></div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start">
                        <div><p className="text-slate-500 uppercase text-xs font-bold">Total Revenue</p><h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">₹{totalRevenue.toLocaleString()}</h3></div>
                        <div className="p-2 rounded bg-green-50 text-green-500"><IndianRupee size={20} /></div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend - Area Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-6">Revenue Trends</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#F97316', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Service Distribution - Pie Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-6">Service Distribution</h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={serviceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {serviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- IMPORT EXTERNAL MODULES ---
import OrdersManagement from './master/OrdersManagement';

// --- MAIN CRM COMPONENT ---

const CRMSystem = ({ defaultTab = 'clients', orders = [], users = [], analytics = null }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [clients, setClients] = useState([]);

    useEffect(() => {
        if (defaultTab) setActiveTab(defaultTab);
    }, [defaultTab]);

    // Derived State: Filter clients from users prop
    useEffect(() => {
        if (users && users.length > 0) {
            const clientUsers = users.filter(u => !u.role || u.role === 'USER');
            setClients(clientUsers);
        }
    }, [users]);

    const sectionTitles = {
        clients: 'Client Directory',
        companies: 'Company Management',
        orders: 'Service Order Management',
        services: 'Compliance & Services',
        tasks: 'Tasks & Workflow',
        documents: 'Document Vault',
        billing: 'Billing & Payments',
        reports: 'Reports & Analytics'
    };

    return (
        <div className="space-y-6 font-[Roboto,sans-serif]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Users className="text-[#F97316]" /> Client CRM <span className="text-slate-300 dark:text-slate-600">/</span> {sectionTitles[activeTab] || 'Dashboard'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Manage all clients, companies, filings, and compliance from a single dashboard.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                        <Bell size={18} /> Reminders
                    </button>
                    <button className="px-4 py-2 bg-[#F97316] text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition">
                        <Plus size={18} /> Quick Action
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'clients' && (
                    <ClientManagement
                        clients={clients}
                        onAddClient={() => alert('Add Client Modal')}
                        onEditClient={(c) => alert(`Edit ${c.fullName}`)}
                    />
                )}
                {activeTab === 'companies' && <CompanyManagement orders={orders} />}
                {activeTab === 'orders' && <OrdersManagement orders={orders} />}
                {activeTab === 'services' && <ServiceTracking orders={orders} />}
                {activeTab === 'tasks' && <TasksWorkflow orders={orders} />}
                {activeTab === 'documents' && <DocumentManagement />}
                {activeTab === 'billing' && <BillingPayments analytics={analytics} />}
                {activeTab === 'reports' && <ReportsAnalytics analytics={analytics} />}
            </div>
        </div>
    );
};

export default CRMSystem;
