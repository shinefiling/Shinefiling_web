
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, Mail, Phone, Lock, X } from 'lucide-react';

const CaEmployees = ({ employees, createEmployee, user, fetchData }) => {
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ fullName: '', email: '', password: '', mobile: '' });

    const handleCreate = async () => {
        if (!form.fullName || !form.email || !form.password) return alert("Please fill all required fields");

        setSubmitting(true);
        try {
            await createEmployee(user.id, { ...form, role: 'EMPLOYEE' });
            setShowModal(false);
            setForm({ fullName: '', email: '', password: '', mobile: '' });
            fetchData();
        } catch (e) {
            alert("Error: " + e.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Team Management</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your employees and staff members.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-slate-800 dark:bg-[#F97316] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                    <Plus size={18} /> Add New Employee
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map(emp => (
                    <div key={emp.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-[#F97316]/30 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#F97316]/5 to-transparent rounded-bl-full pointer-events-none"></div>

                        <div className="flex items-center gap-4 mb-6 relative">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white flex items-center justify-center font-bold text-xl shadow-inner">
                                {emp.fullName?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">{emp.fullName}</h3>
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Active Staff
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                                <Mail size={16} className="text-slate-400" />
                                <span className="truncate">{emp.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                                <Phone size={16} className="text-slate-400" />
                                <span>{emp.mobile || 'No contact info'}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Card (Empty State) */}
                {employees.length === 0 && (
                    <div onClick={() => setShowModal(true)} className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 hover:text-[#F97316] hover:border-[#F97316] cursor-pointer transition-all min-h-[200px] group">
                        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Plus size={24} />
                        </div>
                        <span className="font-bold text-sm">Add First Employee</span>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden border border-slate-100 dark:border-slate-700"
                        >
                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 dark:bg-slate-700 p-2 rounded-full">
                                <X size={20} />
                            </button>

                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Add Team Member</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#F97316] transition-all text-sm font-medium dark:text-white"
                                            placeholder="Ex: John Doe"
                                            value={form.fullName}
                                            onChange={e => setForm({ ...form, fullName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#F97316] transition-all text-sm font-medium dark:text-white"
                                            placeholder="Ex: john@company.com"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Mobile Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#F97316] transition-all text-sm font-medium dark:text-white"
                                            placeholder="Ex: 7639227019"
                                            value={form.mobile}
                                            onChange={e => setForm({ ...form, mobile: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="password"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#F97316] transition-all text-sm font-medium dark:text-white"
                                            placeholder="••••••••"
                                            value={form.password}
                                            onChange={e => setForm({ ...form, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleCreate}
                                    disabled={submitting}
                                    className="w-full mt-4 bg-slate-800 dark:bg-[#F97316] text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {submitting ? 'Creating...' : 'Create Employee'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CaEmployees;
