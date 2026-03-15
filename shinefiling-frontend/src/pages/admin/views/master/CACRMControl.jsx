import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings, Shield, FileText, Calendar, IndianRupee, Users, Bell,
    Activity, Lock, Save, Plus, Trash2, CheckCircle, AlertTriangle, Briefcase,
    Clock, Scale, Database, FileCheck, Search, Filter, Download, Loader2,
    Edit, X
} from 'lucide-react';
import {
    getComplianceRules, saveComplianceRule, deleteComplianceRule,
    getServiceConfigs, saveServiceConfig,
    getBillingSettings,
    getSystemRoles,
    getPendingPayouts, approvePayout, rejectPayout
} from '../../../../api';

const CACRMControl = ({ defaultTab = 'compliance' }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);

    useEffect(() => {
        if (defaultTab) setActiveTab(defaultTab);
    }, [defaultTab]);

    // Dynamic Data State
    const [complianceRules, setComplianceRules] = useState([]);
    const [allowedServices, setAllowedServices] = useState([]);
    const [billingRules, setBillingRules] = useState({ minServiceFee: '', maxServiceFee: '', subscriptionPlans: [] });
    const [caRoles, setCaRoles] = useState([]);
    const [pendingPayouts, setPendingPayouts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [newRule, setNewRule] = useState({ type: 'GST', frequency: 'Monthly', dueDateDays: '20', penaltyMetrics: '₹50/day' });

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'compliance') {
                const data = await getComplianceRules();
                // Mock data if empty to show functionality
                if (data && data.length > 0) {
                    setComplianceRules(data);
                } else {
                    setComplianceRules([
                        { id: 1, type: 'GST', frequency: 'Monthly', dueDateDays: '20', penaltyMetrics: '₹50/day' },
                        { id: 2, type: 'Income Tax', frequency: 'Yearly', dueDateDays: '31', penaltyMetrics: '₹100/day' }
                    ]);
                }
            }
            if (activeTab === 'services') {
                const data = await getServiceConfigs();
                if (data && data.length > 0) {
                    setAllowedServices(data);
                } else {
                    setAllowedServices([
                        { id: 1, name: 'GST Registration', docsRequired: ['PAN', 'Aadhar', 'Photo'], enabled: true },
                        { id: 2, name: 'Private Limited Company', docsRequired: ['PAN', 'Aadhar', 'Address Proof'], enabled: true },
                        { id: 3, name: 'Income Tax Filing', docsRequired: ['Form 16', 'Bank Statement'], enabled: true }
                    ]);
                }
            }
            if (activeTab === 'billing') {
                const data = await getBillingSettings();
                setBillingRules(prev => ({
                    ...prev,
                    minServiceFee: data?.minServiceFee || '500',
                    maxServiceFee: data?.maxServiceFee || '50000',
                    subscriptionPlans: data?.subscriptionPlans || [
                        { name: 'Basic Partner', limit: '10 Applications', price: '999' },
                        { name: 'Premium Partner', limit: '50 Applications', price: '2999' },
                        { name: 'Elite Partner', limit: 'Unlimited', price: '4999' }
                    ]
                }));
            }
            if (activeTab === 'roles') {
                const data = await getSystemRoles();
                if (data && data.length > 0) {
                    setCaRoles(data);
                } else {
                    setCaRoles([
                        { id: 1, name: 'Senior CA', canView: true, canApprove: true, canFile: true },
                        { id: 2, name: 'Associate CA', canView: true, canApprove: false, canFile: true },
                        { id: 3, name: 'Trainee', canView: true, canApprove: false, canFile: false }
                    ]);
                }
            }
            if (activeTab === 'payouts') {
                const data = await getPendingPayouts();
                setPendingPayouts(data || []);
            }
        } catch (error) {
            console.error("Failed to load data for tab:", activeTab, error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveRule = async () => {
        try {
            await saveComplianceRule(editingRule || newRule);
            setShowModal(false);
            setEditingRule(null);
            loadData();
        } catch (e) { alert("Failed to save rule"); }
    };

    const handleDeleteRule = async (id) => {
        if (confirm("Delete this rule?")) {
            await deleteComplianceRule(id);
            loadData();
        }
    };

    const handleApprovePayout = async (id) => {
        if (window.confirm("Mark this payout as SUCCESS? Have you transferred the funds manually?")) {
            try {
                await approvePayout(id);
                loadData();
            } catch (e) { alert(e.message); }
        }
    };

    const handleRejectPayout = async (id) => {
        const reason = window.prompt("Reason for rejection:");
        if (reason === null) return;
        try {
            await rejectPayout(id, reason);
            loadData();
        } catch (e) { alert(e.message); }
    };

    const renderComplianceTab = () => (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Compliance & Due Dates</h3>
                    <p className="text-sm text-slate-500">Define filing frequencies, due dates, and penalty logic.</p>
                </div>
                <button
                    onClick={() => { setEditingRule(null); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#F97316] text-white rounded-lg font-bold text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition"
                >
                    <Plus size={16} /> Add Rule
                </button>
            </div>

            {complianceRules.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500 font-bold">No compliance rules found.</p>
                    <p className="text-xs text-slate-400 mt-1">Add a new rule to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {complianceRules.map(rule => (
                        <div key={rule.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm relative group hover:border-[#F97316]/50 transition-all">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingRule(rule); setShowModal(true); }} className="p-1.5 bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-[#F97316] rounded-lg"><Edit size={14} /></button>
                                <button onClick={() => handleDeleteRule(rule.id)} className="p-1.5 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg"><Trash2 size={14} /></button>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                    {rule.type}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">{rule.type} Compliance</h4>
                                    <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500 font-bold">{rule.frequency}</span>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Due Date Logic</span>
                                    <span className="font-bold text-slate-700 dark:text-slate-200">Day {rule.dueDateDays}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Penalty</span>
                                    <span className="font-bold text-red-500">{rule.penaltyMetrics}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderServicesTab = () => (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Service Configuration</h3>
                    <p className="text-sm text-slate-500">Control which services CAs can offer and approval workflows.</p>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-bold">Service Name</th>
                            <th className="px-6 py-4 font-bold">Mandatory Docs</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {allowedServices.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-slate-500">No services configured.</td>
                            </tr>
                        ) : allowedServices.map(svc => (
                            <tr key={svc.id}>
                                <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{svc.name}</td>
                                <td className="px-6 py-4 text-slate-500">
                                    <div className="flex gap-2 flex-wrap">
                                        {Array.isArray(svc.docsRequired)
                                            ? svc.docsRequired.map(d => <span key={d} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">{d}</span>)
                                            : <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">{svc.docsRequired} Documents Required</span>
                                        }
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${svc.enabled ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {svc.enabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-500 hover:underline font-bold text-xs">Configure</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderBillingTab = () => (
        <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Fee Limits */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                        <IndianRupee size={18} className="text-[#F97316]" /> Service Fee Limits
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Minimum Service Fee (₹)</label>
                            <input type="number" value={billingRules.minServiceFee} className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Maximum Service Fee (₹)</label>
                            <input type="number" value={billingRules.maxServiceFee} className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold" />
                        </div>
                    </div>
                </div>

                {/* Subscription Plans */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Activity size={18} className="text-[#F97316]" /> CA Subscriptions
                        </h3>
                        <button className="text-xs text-[#F97316] font-bold">Manage Plans</button>
                    </div>
                    <div className="space-y-3">
                        {billingRules.subscriptionPlans.map((plan, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-white text-sm">{plan.name}</p>
                                    <p className="text-xs text-slate-500">{plan.limit}</p>
                                </div>
                                <span className="font-bold text-slate-600 dark:text-slate-300">₹{plan.price}/mo</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRolesTab = () => (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm animate-in fade-in">
            <h3 className="font-bold text-slate-800 dark:text-white mb-6">Freelancer Role & Permission Matrix</h3>
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-10 text-slate-500"><Loader2 className="animate-spin inline mr-2" /> Loading Roles...</div>
                ) : caRoles.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">No roles configured.</div>
                ) : (
                    caRoles.map(role => (
                        <div key={role.id || role.name} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">{(role.name || 'R')[0]}</div>
                                <span className="font-bold text-sm text-slate-800 dark:text-white">{role.name}</span>
                            </div>
                            <div className="flex gap-4 text-xs font-bold text-slate-500">
                                <label className="flex items-center gap-2"><input type="checkbox" checked={role.canView} readOnly /> View</label>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={role.canApprove} readOnly /> Approve</label>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={role.canFile} readOnly /> File</label>
                                <button className="text-[#F97316] hover:underline">Edit</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const renderPayoutsTab = () => (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Freelancer Withdrawal Requests</h3>
                    <p className="text-sm text-slate-500">Review and process pending payout requests from Freelancers.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-bold">Freelancer Details</th>
                            <th className="px-6 py-4 font-bold">Bank Info</th>
                            <th className="px-6 py-4 font-bold">Amount</th>
                            <th className="px-6 py-4 font-bold">Date</th>
                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {pendingPayouts.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-slate-500 font-bold">No pending withdrawal requests.</td>
                            </tr>
                        ) : pendingPayouts.map(payout => (
                            <tr key={payout.id}>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-800 dark:text-white">{payout.user?.fullName}</span>
                                        <span className="text-[10px] text-slate-400">{payout.user?.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col text-xs">
                                        <span className="font-bold text-slate-700 dark:text-slate-200">{payout.user?.bankName}</span>
                                        <span className="text-slate-500">A/C: {payout.user?.accountNumber}</span>
                                        <span className="text-slate-400 text-[10px]">IFSC: {payout.user?.ifscCode}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-bold text-emerald-600">₹{payout.amount}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-xs text-nowrap">
                                    {new Date(payout.createdAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleApprovePayout(payout.id)}
                                            className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-lg shadow-sm hover:bg-emerald-600 transition"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleRejectPayout(payout.id)}
                                            className="px-3 py-1.5 bg-rose-50 text-rose-500 text-[10px] font-bold border border-rose-100 rounded-lg hover:bg-rose-500 hover:text-white transition"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const TAB_NAMES = {
        compliance: 'Compliance & Due Dates',
        services: 'Service Configuration',
        billing: 'Billing & Fees',
        roles: 'Roles & Access',
        payouts: 'Withdrawal Requests',
        audit: 'System Audit Logs',
        power: 'Power Actions'
    };

    return (
        <div className="space-y-6 font-[Roboto,sans-serif]">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                    <Scale className="text-[#F97316]" size={28} /> Freelancer CRM Control Center <span className="text-slate-300 dark:text-slate-600">/</span> {TAB_NAMES[activeTab] || 'Settings'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Master controls for Freelancer onboarding, compliance rules, service configuration, and system-wide settings.
                </p>
            </div>

            {/* Content Body - Driven by activeTab (from prop/sidebar) */}
            <div className="min-h-[400px]">
                {activeTab === 'compliance' && (isLoading ? <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div> : renderComplianceTab())}
                {activeTab === 'services' && (isLoading ? <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div> : renderServicesTab())}
                {activeTab === 'billing' && (isLoading ? <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div> : renderBillingTab())}
                {activeTab === 'roles' && (isLoading ? <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div> : renderRolesTab())}
                {activeTab === 'payouts' && (isLoading ? <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div> : renderPayoutsTab())}
                {activeTab === 'audit' && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-slate-700 dark:text-white flex items-center gap-2"><FileCheck size={20} className="text-blue-500" /> Recent System Logs</h3>
                            <button className="text-xs text-blue-500 font-bold hover:underline">Download Report</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50/50 dark:bg-slate-900/30 text-slate-500 text-[10px] uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-3 font-black">Timestamp</th>
                                        <th className="px-6 py-3 font-black">User / CA</th>
                                        <th className="px-6 py-3 font-black">Action Type</th>
                                        <th className="px-6 py-3 font-black">Target Object</th>
                                        <th className="px-6 py-3 font-black">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {[
                                        { time: '2 mins ago', user: 'Admin System', action: 'BULK_REMINDER', target: '342 Clients', status: 'SUCCESS' },
                                        { time: '1 hour ago', user: 'Freelancer Rahul Sharma', action: 'CERTIFICATE_UPLOAD', target: 'Order #8832', status: 'VERIFIED' },
                                        { time: '3 hours ago', user: 'System Auto', action: 'STATUS_UPDATE', target: 'Order #7721', status: 'AUTO_FILED' },
                                        { time: 'Yesterday', user: 'Admin Master', action: 'PERMISSION_CHANGE', target: 'Associate CA Role', status: 'UPDATED' }
                                    ].map((log, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4 text-slate-400 font-mono text-[10px]">{log.time}</td>
                                            <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">{log.user}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-black tracking-tighter">{log.action}</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{log.target}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                    <span className="text-[10px] font-bold text-emerald-600">{log.status}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'power' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 scale-95 origin-top animate-in zoom-in-95 duration-200">
                        <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30">
                            <h3 className="text-red-600 font-black tracking-tight flex items-center gap-2 mb-4 uppercase text-xs"><AlertTriangle size={18} /> Emergency Controls</h3>
                            <div className="space-y-3">
                                <button className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-red-200 text-red-600 font-bold text-sm rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">Suspend All Freelancer Portal Access</button>
                                <button className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-red-200 text-red-600 font-bold text-sm rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">Force Termination of All Bids</button>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <h3 className="text-slate-700 dark:text-slate-200 font-black tracking-tight flex items-center gap-2 mb-4 uppercase text-xs"><Database size={18} /> Maintenance Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all">Clear Client Cache</button>
                                <button className="px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all">Recalculate Fees</button>
                                <button className="px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all">Sync Cloud Docs</button>
                                <button className="px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all">Reset API Keys</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal for Compliance Rule */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                            <div className="bg-[#043E52] p-5 text-white flex justify-between items-center">
                                <h3 className="font-bold flex items-center gap-2"><Settings size={18} /> {editingRule ? 'Edit' : 'Create'} Compliance Rule</h3>
                                <button onClick={() => setShowModal(false)}><X size={20} /></button>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rule Type</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 text-sm font-bold"
                                            value={editingRule ? editingRule.type : newRule.type}
                                            onChange={(e) => editingRule ? setEditingRule({ ...editingRule, type: e.target.value }) : setNewRule({ ...newRule, type: e.target.value })}
                                            placeholder="e.g. GST GSTR-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Frequency</label>
                                        <select
                                            className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 text-sm font-bold"
                                            value={editingRule ? editingRule.frequency : newRule.frequency}
                                            onChange={(e) => editingRule ? setEditingRule({ ...editingRule, frequency: e.target.value }) : setNewRule({ ...newRule, frequency: e.target.value })}
                                        >
                                            <option>Monthly</option>
                                            <option>Quarterly</option>
                                            <option>Yearly</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Due Date Days (of month)</label>
                                        <input
                                            type="number"
                                            className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 text-sm font-bold"
                                            value={editingRule ? editingRule.dueDateDays : newRule.dueDateDays}
                                            onChange={(e) => editingRule ? setEditingRule({ ...editingRule, dueDateDays: e.target.value }) : setNewRule({ ...newRule, dueDateDays: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Penalty Logic</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 text-sm font-bold"
                                            value={editingRule ? editingRule.penaltyMetrics : newRule.penaltyMetrics}
                                            onChange={(e) => editingRule ? setEditingRule({ ...editingRule, penaltyMetrics: e.target.value }) : setNewRule({ ...newRule, penaltyMetrics: e.target.value })}
                                            placeholder="e.g. ₹50/day"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 bg-slate-50 dark:bg-slate-700/50 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-500 font-bold text-sm">Cancel</button>
                                <button onClick={handleSaveRule} className="px-6 py-2 bg-[#F97316] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all">Save Rule</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CACRMControl;
