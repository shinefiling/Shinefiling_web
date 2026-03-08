import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, AlertTriangle, TrendingUp, Search, Filter } from 'lucide-react';
import { getAllUsers, getAllApplications } from '../../../api';

const SubAdminDashboard = ({ activeTab }) => {
    const [activeSection, setActiveSection] = useState('overview');
    const [users, setUsers] = useState([]);
    const [contentQueue, setContentQueue] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab === 'dashboard') setActiveSection('overview');
        if (activeTab === 'user_mgmt') setActiveSection('users');
        if (activeTab === 'content_mod') setActiveSection('moderation');
        if (activeTab === 'reports') setActiveSection('reports');
    }, [activeTab]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allUsers, allApps] = await Promise.all([getAllUsers(), getAllApplications()]);
                setUsers(allUsers);
                // Mock content queue from applications
                setContentQueue(allApps.map(app => ({
                    id: app.id,
                    title: `${app.serviceName} - ${app.user?.fullName || 'Client'}`,
                    type: 'Application Review',
                    status: app.status,
                    date: new Date(app.createdAt).toLocaleDateString()
                })));
            } catch (err) {
                console.error("Failed to fetch sub-admin data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const StatsCard = ({ label, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-[#3D4D55] text-sm font-medium">{label}</p>
                <h3 className="text-2xl font-bold text-[#043E52]">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
        </div>
    );

    const UserList = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-[#043E52]">User Management</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" placeholder="Search users..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
            </div>
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {users.slice(0, 5).map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-bold text-[#043E52]">{user.fullName}</td>
                            <td className="px-6 py-4 text-gray-500">{user.email}</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600">{user.role || 'USER'}</span></td>
                            <td className="px-6 py-4"><span className="text-green-600 font-bold text-xs">Active</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const ContentModeration = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#043E52]">Content & Service Moderation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentQueue.slice(0, 6).map((item, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-[#FDFBF7] text-[#ED6E3F] rounded-lg border border-[#ED6E3F]/20"><FileText size={20} /></div>
                            <span className="text-xs font-bold text-gray-400">{item.date}</span>
                        </div>
                        <h4 className="font-bold text-[#043E52] mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-500 mb-4">{item.type}</p>
                        <div className="flex gap-2">
                            <button className="flex-1 py-2 bg-green-50 text-green-600 text-sm font-bold rounded-lg hover:bg-green-100">Approve</button>
                            <button className="flex-1 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-lg hover:bg-red-100">Flag</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold text-[#043E52]">Sub-Admin Workspace</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">Regional Admin</span>
            </div>

            {activeSection === 'overview' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatsCard label="Total Users" value={users.length} icon={Users} color="bg-blue-500" />
                        <StatsCard label="Pending Review" value={contentQueue.length} icon={AlertTriangle} color="bg-yellow-500" />
                        <StatsCard label="Approved Today" value="12" icon={CheckCircle} color="bg-green-500" />
                        <StatsCard label="Growth Rate" value="+5.2%" icon={TrendingUp} color="bg-purple-500" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-[#043E52] mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="text-gray-500">User <strong className="text-gray-700">Amit Singh</strong> updated profile details.</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-gray-500">New registration from <strong className="text-gray-700">Mumbai Region</strong>.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeSection === 'users' && <UserList />}
            {activeSection === 'moderation' && <ContentModeration />}
        </motion.div>
    );
};

export default SubAdminDashboard;
