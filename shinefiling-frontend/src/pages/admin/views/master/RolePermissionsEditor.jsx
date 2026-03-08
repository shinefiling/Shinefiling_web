import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Shield, Check, AlertCircle } from 'lucide-react';
import { getPermissions, savePermissions, resetPermissions } from '../../../../utils/permissions';

const MODULES = [
    { id: 'dashboard', label: 'Dashboard Access' },
    { id: 'user_mgmt', label: 'User Management' },
    { id: 'service_mgmt', label: 'Services Management' },
    { id: 'order_mgmt', label: 'Orders & Applications' },
    { id: 'financials', label: 'Financials & Payments' },
    { id: 'reports', label: 'Reports & Analytics' },
    { id: 'file_manager', label: 'File Manager (Server)' },
    { id: 'content_mod', label: 'Content Moderation' },
    { id: 'logs', label: 'Audit Logs & Security' },
    { id: 'admin_controls', label: 'Admin Controls' },
    { id: 'notifications', label: 'Notifications System' },
    { id: 'cms', label: 'Content Management (CMS)' },
    // Agent Specific
    { id: 'agent_onboarding', label: 'Agent Onboarding' },
    { id: 'lead_assignment', label: 'Lead Assignment' },
    // Client Specific
    { id: 'new-filing', label: 'New Filing (Client)' },
];

const ROLES = [
    { id: 'SUB_ADMIN', label: 'Sub Admin' },
    { id: 'AGENT_ADMIN', label: 'Agent Admin' },
    { id: 'CLIENT', label: 'Client' },
    { id: 'EMPLOYEE', label: 'Employee' }
];

const RolePermissionsEditor = () => {
    const [permissions, setPermissions] = useState(getPermissions());
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setPermissions(getPermissions());
    }, []);

    const handleToggle = (roleId, moduleId) => {
        setPermissions(prev => ({
            ...prev,
            [roleId]: {
                ...prev[roleId],
                [moduleId]: !prev[roleId]?.[moduleId]
            }
        }));
        setSaved(false);
    };

    const handleSave = () => {
        savePermissions(permissions);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset all permissions to default?")) {
            const defaults = resetPermissions();
            setPermissions(defaults);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h3 className="font-bold text-[#043E52] text-lg flex items-center gap-2">
                        <Shield className="text-[#ED6E3F]" size={20} />
                        Access Control Matrix
                    </h3>
                    <p className="text-xs text-[#3D4D55] mt-1">
                        Manage granular permissions for all system roles. Super Admin has unrestricted access by default.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition"
                    >
                        <RotateCcw size={14} /> Reset Defaults
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 text-xs font-bold text-white bg-[#043E52] hover:bg-[#ED6E3F] rounded-lg flex items-center gap-2 shadow-lg shadow-[#043E52]/20 transition transform hover:scale-105 active:scale-95"
                    >
                        {saved ? <Check size={14} /> : <Save size={14} />}
                        {saved ? 'Saved!' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-4 bg-gray-50 border-b border-gray-200 min-w-[200px]">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Module / Feature</span>
                            </th>
                            {ROLES.map(role => (
                                <th key={role.id} className="p-4 bg-gray-50 border-b border-gray-200 text-center min-w-[120px]">
                                    <span className="text-xs font-bold text-[#043E52] uppercase tracking-wider">{role.label}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {MODULES.map(module => (
                            <tr key={module.id} className="hover:bg-indigo-50/30 transition">
                                <td className="p-4 border-r border-dashed border-gray-100">
                                    <div className="font-bold text-sm text-gray-700">{module.label}</div>
                                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">{module.id}</div>
                                </td>
                                {ROLES.map(role => {
                                    const isChecked = permissions[role.id]?.[module.id] || false;
                                    return (
                                        <td key={`${role.id}-${module.id}`} className="p-4 text-center">
                                            <div className="flex justify-center">
                                                <label className="relative inline-flex items-center cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={isChecked}
                                                        onChange={() => handleToggle(role.id, module.id)}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#ED6E3F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#043E52]"></div>
                                                </label>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 text-amber-800 rounded-lg text-xs border border-amber-100">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>
                    <strong>Note:</strong> Changes to permissions will take effect immediately for active users upon their next page refresh or action.
                    Master Admin permissions cannot be modified here and strictly follow system defaults.
                </p>
            </div>
        </div>
    );
};

export default RolePermissionsEditor;
