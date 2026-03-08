import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, Clock, Target, DollarSign, Briefcase } from 'lucide-react';
import { getAgentApplications, assignAgentToRequest } from '../../../api'; // Assume filter means 'get available'

const AgentDashboard = ({ activeTab }) => {
    const [activeSection, setActiveSection] = useState('overview');
    const [leads, setLeads] = useState([]); // Assigned leads
    const [performance, setPerformance] = useState({ completed: 0, pending: 0, earnings: 0 });
    const [loading, setLoading] = useState(true);

    // Mock accessing current agent email
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (activeTab === 'dashboard') setActiveSection('overview');
        if (activeTab === 'lead_assignment') setActiveSection('leads');
        if (activeTab === 'performance') setActiveSection('stats');
        if (activeTab === 'agent_onboarding') setActiveSection('onboarding'); // Maybe for training
    }, [activeTab]);

    useEffect(() => {
        const fetchAgentData = async () => {
            try {
                // For now, getting 'Agent Applications' returns those assigned to this agent (by email logic in mock or real backend)
                const apps = await getAgentApplications(user.email);
                setLeads(apps.map(app => ({
                    id: app.id,
                    service: app.serviceName,
                    client: app.user?.fullName || 'Client',
                    status: app.status,
                    date: new Date(app.createdAt).toLocaleDateString(),
                    priority: 'High' // Mock
                })));

                // Mock Stats
                setPerformance({
                    completed: apps.filter(a => a.status === 'Approved').length,
                    pending: apps.filter(a => a.status !== 'Approved').length,
                    earnings: apps.filter(a => a.status === 'Approved').length * 500 // 500 per task
                });
            } catch (err) {
                console.error("Failed to fetch agent data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAgentData();
    }, [user.email]);

    const LeadCard = ({ lead }) => (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-1 rounded text-xs font-bold ${lead.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {lead.status}
                </span>
                <span className="text-xs text-gray-400">{lead.date}</span>
            </div>
            <h4 className="font-bold text-[#043E52] mb-1">{lead.service}</h4>
            <p className="text-sm text-[#3D4D55] mb-4">Client: {lead.client}</p>

            <div className="flex gap-2 pt-4 border-t border-gray-50">
                <button className="flex-1 text-sm font-bold text-[#ED6E3F] hover:underline">View Details</button>
                {lead.status !== 'Approved' && (
                    <button className="px-4 py-1.5 bg-[#043E52] text-white text-xs font-bold rounded-lg hover:bg-[#ED6E3F] transition shadow-md shadow-[#043E52]/20">Process</button>
                )}
            </div>
        </div>
    );

    const Overview = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-[#3D4D55] text-sm">Assigned Leads</p>
                <h3 className="text-3xl font-bold text-[#043E52]">{leads.length}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm">Completed Tasks</p>
                <h3 className="text-3xl font-bold text-green-600">{performance.completed}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm">Total Earnings</p>
                <h3 className="text-3xl font-bold text-[#F59E0B]">₹{performance.earnings}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm">Target Achievement</p>
                <h3 className="text-3xl font-bold text-blue-600">85%</h3>
            </div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold text-[#043E52]">Field Agent Portal</h2>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">Authorized Agent</span>
            </div>

            {activeSection === 'overview' && (
                <>
                    <Overview />
                    <h3 className="text-lg font-bold text-[#2B3446] mb-4">Recent Leads</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {leads.slice(0, 3).map((lead, i) => <LeadCard key={i} lead={lead} />)}
                    </div>
                </>
            )}

            {activeSection === 'leads' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-[#043E52]">My Assigned Leads</h3>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-600">Filter: All</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {leads.map((lead, i) => <LeadCard key={i} lead={lead} />)}
                        {leads.length === 0 && <p className="text-gray-400 col-span-3 text-center py-10">No leads assigned. Check back later.</p>}
                    </div>
                </div>
            )}

            {activeSection === 'stats' && (
                <div className="bg-white p-10 rounded-2xl shadow-sm text-center">
                    <Target size={48} className="mx-auto text-[#ED6E3F] mb-4" />
                    <h2 className="text-2xl font-bold text-[#043E52]">Performance Analytics</h2>
                    <p className="text-[#3D4D55]"> detailed charts coming soon.</p>
                </div>
            )}
        </motion.div>
    );
};

export default AgentDashboard;
