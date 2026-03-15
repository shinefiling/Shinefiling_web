import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Shield, Settings, Activity, Save, Trash2, Edit2, CheckCircle, XCircle,
    FileText, DollarSign, Layout, Lock as LockIcon, RefreshCcw, Search, Filter, Plus, Eye, BarChart3, Database,
    Cpu, MessageSquare, Globe, Bell, Zap, Download, CreditCard, PieChart as PieIcon, FileCheck, AlertTriangle, X,
    ArrowUpRight, ArrowDownRight, Clock, Calendar
} from 'lucide-react';
import { getAllUsers, updateUserRole, getAllApplications, getAdminStats, getFullAnalytics } from '../../../api';

import CRMSystem from './CRMSystem';
import EmailTemplates from './master/EmailTemplates';

// --- IMPORT SUB-MODULES ---
import AnalyticsDashboard from './master/AnalyticsDashboard';
import ServicesManagement from './master/ServicesManagement';
import OrdersManagement from './master/OrdersManagement';
import PaymentFinance from './master/PaymentFinance';
import AdminControls from './master/AdminControls';
import Notifications from './master/Notifications';

import SystemSettings from './master/SystemSettings';
import UserManagement from './master/UserManagement';
import FileManager from './master/FileManager';
import FirewallDashboard from './master/FirewallDashboard';
import AgentApprovals from './master/AgentApprovals';
import CareersControl from './master/CareersControl';
import DashboardOverview from './master/DashboardOverview';
import CACRMControl from './master/CACRMControl';
import AuditLogs from './master/AuditLogs';

// --- MAIN ORCHESTRATOR ---
const MasterDashboard = ({ activeTab, onNavigate, user }) => {
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null); // Current Admin Stats
    const [analytics, setAnalytics] = useState(null); // New Full Analytics
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                // Fetch all data in parallel
                const [u, o, s, a] = await Promise.all([
                    getAllUsers(),
                    getAllApplications(),
                    getAdminStats(),
                    getFullAnalytics()
                ]);
                setUsers(u);
                setOrders(o.map(app => ({
                    ...app, // Spread all properties first
                    id: `ORD-${app.id}`,
                    realId: app.id,
                    submissionId: app.submissionId,
                    service: app.service || app.serviceName || 'N/A', // Prioritize constructed service name
                    client: app.client || app.user?.fullName || 'Guest', // Prioritize constructed client name
                    email: app.email || app.user?.email || 'N/A',
                    mobile: app.mobile || app.user?.mobile || 'N/A',
                    status: app.status,
                    tasks: app.tasks, // Pass tasks for granular view
                    date: app.createdAt || new Date().toISOString() // Capture date for analytics
                })));
                setStats(s); // Set KPI stats
                setAnalytics(a); // Set Detailed Analytics
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    if (loading) return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardOverview user={user} orders={orders} users={users} onNavigate={onNavigate} adminStats={stats} />;
            // Analytics Suite
            case 'analytics_suite':
            case 'analytics_overview': return <AnalyticsDashboard activeTab="overview" user={user} orders={orders} users={users} analyticsData={analytics} />;
            case 'analytics_revenue': return <AnalyticsDashboard activeTab="revenue" user={user} orders={orders} users={users} analyticsData={analytics} />;
            case 'analytics_users': return <AnalyticsDashboard activeTab="users" user={user} orders={orders} users={users} analyticsData={analytics} />;
            case 'analytics_services': return <AnalyticsDashboard activeTab="services" user={user} orders={orders} users={users} analyticsData={analytics} />;

            case 'user_mgmt': return <UserManagement />;

            // --- NEW SECTIONS MAPPING ---
            // LEADS
            case 'leads_crm':
            case 'leads_all': return <CRMSystem defaultTab="clients" orders={orders} users={users} analytics={analytics} />;
            case 'leads_followup': return <CRMSystem defaultTab="tasks" orders={orders} users={users} analytics={analytics} />;
            case 'leads_sources': return <CRMSystem defaultTab="reports" orders={orders} users={users} analytics={analytics} />;

            // OPERATIONS
            case 'ops_mgmt':
            case 'ops_orders': return <OrdersManagement orders={orders} />;
            case 'ops_tasks': return <CRMSystem defaultTab="tasks" orders={orders} users={users} analytics={analytics} />; // Reuse CRM Tasks
            case 'ops_chat': return <Notifications hideTabs={true} />;

            // FINANCE
            case 'finance_mgmt':
            case 'fin_invoices':
            case 'fin_trans':
            case 'fin_tax': return <PaymentFinance />;
            case 'fin_pricing': return <CACRMControl defaultTab="billing" />; // Reuse Billing

            // MARKETING
            case 'marketing_mgmt':
            case 'mkt_campaigns': return <div className="p-8 text-center text-gray-500">Marketing Module Unavailable</div>;
            case 'mkt_email': return <EmailTemplates />;
            case 'mkt_offers': return <div className="p-8 text-center text-gray-500">Marketing Module Unavailable</div>;

            // SUPPORT
            case 'support_mgmt':
            case 'sup_tickets':
            case 'sup_kb': return <Notifications hideTabs={true} />;

            // Client CRM Sub-pages
            case 'crm':
            case 'crm_clients': return <CRMSystem defaultTab="clients" orders={orders} users={users} analytics={analytics} />;
            case 'crm_companies': return <CRMSystem defaultTab="companies" orders={orders} users={users} analytics={analytics} />;
            case 'crm_orders': return <CRMSystem defaultTab="orders" orders={orders} users={users} analytics={analytics} />;
            case 'crm_services': return <CRMSystem defaultTab="services" orders={orders} users={users} analytics={analytics} />;
            case 'crm_tasks': return <CRMSystem defaultTab="tasks" orders={orders} users={users} analytics={analytics} />;
            case 'crm_documents': return <CRMSystem defaultTab="documents" orders={orders} users={users} analytics={analytics} />;
            case 'crm_billing': return <CRMSystem defaultTab="billing" orders={orders} users={users} analytics={analytics} />;
            case 'crm_reports': return <CRMSystem defaultTab="reports" orders={orders} users={users} analytics={analytics} />;

            case 'agent_approvals':
            case 'agent_dashboard': return <AgentApprovals viewMode="overview" defaultFilter="ALL" users={users} targetRole="AGENT" />;
            case 'agent_list': return <AgentApprovals viewMode="list" defaultFilter="ALL" users={users} targetRole="AGENT" />;
            case 'agent_pending': return <AgentApprovals viewMode="list" defaultFilter="PENDING" users={users} targetRole="AGENT" />;
            case 'agent_active': return <AgentApprovals viewMode="list" defaultFilter="VERIFIED" users={users} targetRole="AGENT" />;

            // CA CRM Sub-pages
            case 'ca_crm':
            case 'ca_dashboard': return <AgentApprovals viewMode="overview" defaultFilter="ALL" targetRole="CA" users={users} />;
            case 'ca_list': return <AgentApprovals viewMode="list" defaultFilter="ALL" targetRole="CA" users={users} />;
            case 'ca_pending': return <AgentApprovals viewMode="list" defaultFilter="PENDING" targetRole="CA" users={users} />;
            case 'ca_active': return <AgentApprovals viewMode="list" defaultFilter="VERIFIED" targetRole="CA" users={users} />;
            case 'ca_compliance': return <CACRMControl defaultTab="compliance" />;
            case 'ca_services': return <CACRMControl defaultTab="services" />;
            case 'ca_billing': return <CACRMControl defaultTab="billing" />;
            case 'ca_payouts': return <CACRMControl defaultTab="payouts" />;
            case 'ca_roles': return <CACRMControl defaultTab="roles" />;
            case 'ca_audit': return <CACRMControl defaultTab="audit" />;
            case 'ca_power': return <CACRMControl defaultTab="power" />;

            case 'service_mgmt': return <ServicesManagement />;
            case 'order_mgmt': return <OrdersManagement orders={orders} />; // Updated
            case 'finance': return <PaymentFinance />;
            case 'admin_controls':
            case 'access_users': return <AdminControls defaultTab="users" />;
            case 'access_cas': return <AdminControls defaultTab="cas" />;
            case 'access_agents': return <AdminControls defaultTab="agents" />;
            case 'notifications': return <Notifications />;
            case 'cms': return <div className="p-8 text-center text-gray-500">CMS Module Removed</div>;
            case 'file_manager':
            case 'file_all': return <FileManager defaultFolder="all" />;
            case 'file_client': return <FileManager defaultFolder="client_docs" />;
            case 'file_company': return <FileManager defaultFolder="company_docs" />;
            case 'file_services': return <FileManager defaultFolder="service_files" />;
            case 'file_marketing': return <FileManager defaultFolder="marketing" />;
            case 'file_certs': return <FileManager defaultFolder="certificates" />;
            case 'audit': return <AuditLogs />;
            // System Settings
            case 'settings_suite':
            case 'settings_profile': return <SystemSettings activeTab="profile" />;
            case 'settings_general': return <SystemSettings activeTab="general" />;
            case 'settings_security': return <SystemSettings activeTab="security" />;
            case 'settings_integrations': return <SystemSettings activeTab="integrations" />;
            case 'settings_logs': return <SystemSettings activeTab="logs" />;
            case 'firewall': return <FirewallDashboard />;
            case 'careers_control': return <CareersControl />;
            default: return <DashboardOverview user={user} orders={orders} users={users} onNavigate={onNavigate} adminStats={stats} />;
        }
    };
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="pb-20">
            {renderContent()}
        </motion.div>
    );
};

export default MasterDashboard;
