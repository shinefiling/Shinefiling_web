import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, CheckCircle, Clock, FileText, Bell, LogOut, Menu,
    ChevronRight, ArrowRight, User
} from 'lucide-react';
import { getEmployeeTasks, updateEmployeeTaskStatus as updateTaskStatus } from '../api';

const EmployeeDashboardPage = ({ onLogout }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tasks');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        if (!user.id) return;
        try {
            const data = await getEmployeeTasks(user.id);
            setTasks(data || []);
        } catch (e) {
            console.error("Failed to fetch tasks", e);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (task, newStatus) => {
        if (window.confirm(`Mark this task as ${newStatus}?`)) {
            try {
                await updateTaskStatus(task.id, newStatus);
                fetchTasks(); // Refresh
                alert("Status updated!");
            } catch (e) {
                alert("Failed: " + e.message);
            }
        }
    };

    const pendingTasks = tasks.filter(t => t.status !== 'COMPLETED' && t.caApprovalStatus !== 'WORK_COMPLETED_BY_EMPLOYEE');
    const completedTasks = tasks.filter(t => t.caApprovalStatus === 'WORK_COMPLETED_BY_EMPLOYEE' || t.status === 'COMPLETED');

    const TaskCard = ({ task, isCompleted }) => (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition group">
            <div className="flex justify-between items-start mb-3">
                <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide">
                    {task.serviceName}
                </div>
                <span className="text-xs text-gray-400 font-mono">#{task.id}</span>
            </div>

            <h3 className="font-bold text-slate-800 mb-1">{task.user?.fullName}</h3>
            <p className="text-xs text-slate-500 mb-4 truncate">{task.serviceName} Filing - {task.user?.companyName || 'Individual'}</p>

            {task.adminComments && (
                <div className="bg-yellow-50 p-3 rounded-lg mb-4 text-xs text-slate-700 italic border border-yellow-100">
                    <span className="font-bold not-italic text-yellow-600 block mb-1">Instruction:</span>
                    "{task.adminComments}"
                </div>
            )}

            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock size={14} /> {new Date(task.createdAt).toLocaleDateString()}
                </div>

                {!isCompleted ? (
                    <button
                        onClick={() => handleUpdateStatus(task, 'COMPLETED')}
                        className="flex items-center gap-2 bg-[#043E52] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 transition"
                    >
                        Mark Done <ArrowRight size={12} />
                    </button>
                ) : (
                    <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                        <CheckCircle size={14} /> Completed
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col md:flex-row">

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-[#043E52] text-white z-50 flex flex-col transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="h-48 flex items-center px-4 border-b border-white/5 justify-center relative">
                    <div className="flex flex-col items-center gap-1">
                        <img src="/logo.png" alt="ShineFiling" className="h-32 w-auto object-contain brightness-0 invert" />
                        <span className="text-sm font-bold tracking-tight text-white mt-1">Staff<span className="text-[#ED6E3F]">Portal</span></span>
                    </div>
                </div>

                <div className="p-4 space-y-2 flex-1">
                    <button onClick={() => { setActiveTab('tasks'); setIsSidebarOpen(false) }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'tasks' ? 'bg-[#ED6E3F] text-white font-bold' : 'text-slate-400 hover:text-white'}`}>
                        <FileText size={18} /> My Tasks
                    </button>
                    <button onClick={() => { setActiveTab('completed'); setIsSidebarOpen(false) }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'completed' ? 'bg-[#ED6E3F] text-white font-bold' : 'text-slate-400 hover:text-white'}`}>
                        <CheckCircle size={18} /> Completed History
                    </button>
                </div>

                <div className="p-6 bg-black/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#ED6E3F] flex items-center justify-center font-bold text-white shadow-lg">{user.fullName?.charAt(0)}</div>
                        <div>
                            <p className="font-bold text-sm text-white">{user.fullName}</p>
                            <p className="text-[10px] text-gray-400 font-mono">EMPLOYEE ID: {user.id}</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="w-full py-2 border border-white/10 rounded-lg text-xs font-bold text-gray-400 hover:bg-white/5 hover:text-white transition">Sign Out</button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
                <header className="bg-white border-b border-gray-200 p-4 md:px-8 flex justify-between items-center sticky top-0 z-30">
                    <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-800"><Menu /></button>
                    <h2 className="text-lg font-bold text-slate-800">
                        {activeTab === 'tasks' ? `Pending Tasks (${pendingTasks.length})` : 'Work History'}
                    </h2>
                    <Bell className="text-gray-400" size={20} />
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {loading ? (
                        <div className="text-center py-20 text-gray-400">Loading tasks...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activeTab === 'tasks' ? (
                                pendingTasks.length === 0 ? (
                                    <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                                        <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                                        <h3 className="text-lg font-bold text-slate-800">All Caught Up!</h3>
                                        <p className="text-gray-500 text-sm">You have no pending tasks assigned.</p>
                                    </div>
                                ) : pendingTasks.map(t => <TaskCard key={t.id} task={t} isCompleted={false} />)
                            ) : (
                                completedTasks.length === 0 ? (
                                    <div className="col-span-full text-center text-gray-400 py-20">No completed history yet.</div>
                                ) : completedTasks.map(t => <TaskCard key={t.id} task={t} isCompleted={true} />)
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}
        </div>
    );
};

export default EmployeeDashboardPage;
