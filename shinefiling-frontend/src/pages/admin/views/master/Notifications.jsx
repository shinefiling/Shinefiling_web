import React, { useState, useEffect } from 'react';
import {
    Bell, CheckCircle, XCircle, Search, List, Zap, Video, Phone, Mail, FileText, ChevronDown, Trash2, Edit2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getNotifications, markNotificationRead } from '../../../../api';

const Notifications = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [activities, setActivities] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        const fetchNotifs = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.email) {
                try {
                    const data = await getNotifications(user.email);
                    if (data && Array.isArray(data)) {
                        const mapped = data.map(n => {
                            let icon = Bell;
                            let color = 'yellow';
                            if (n.type?.includes('CA_BID')) { icon = Zap; color = 'blue'; }
                            if (n.type?.includes('CA_ACCEPT')) { icon = CheckCircle; color = 'green'; }
                            if (n.type?.includes('CA_REJECT')) { icon = XCircle; color = 'pink'; }
                            if (n.type?.includes('CA_COMPLETE')) { icon = FileText; color = 'purple'; }

                            return {
                                id: n.id,
                                title: n.title + ": " + n.message,
                                type: n.type?.replace('_', ' ') || 'Alert',
                                dueDate: 'N/A',
                                owner: 'System',
                                created: new Date(n.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
                                icon: icon,
                                color: color,
                                isRead: n.isRead
                            };
                        });
                        setActivities(mapped);
                    }
                } catch (e) {
                    console.error("Failed to fetch notifications in view", e);
                }
            }
        };
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 15000);
        return () => clearInterval(interval);
    }, []);

    const toggleSelectAll = (e) => {
        if (e.target.checked) setSelectedRows(activities.map(a => a.id));
        else setSelectedRows([]);
    };

    const toggleSelectRow = (id) => {
        if (selectedRows.includes(id)) setSelectedRows(prev => prev.filter(r => r !== id));
        else setSelectedRows(prev => [...prev, id]);
    };

    const getTypeStyles = (type, color) => {
        const styleMap = {
            'pink': 'bg-pink-100 text-pink-600',
            'purple': 'bg-purple-100 text-purple-600',
            'blue': 'bg-blue-100 text-blue-600',
            'yellow': 'bg-yellow-100 text-yellow-600',
            'green': 'bg-green-100 text-green-600',
        };
        const defaultStyle = 'bg-slate-100 text-slate-600';
        return styleMap[color] || defaultStyle;
    };

    const filteredActivities = activities.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 h-full flex flex-col font-[Roboto,sans-serif] animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Bell className="text-[#F97316]" size={28} /> System Notifications
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Real-time alerts and activity logs for your administrative actions.</p>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recent Activity</h2>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Sort By: Newest First</span>
                            <ChevronDown size={14} className="text-slate-400" />
                        </div>
                    </div>
                </div>

                <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-800">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span>Show</span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                            className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-2 py-1 outline-none text-slate-800 dark:text-slate-200 font-bold"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span>entries</span>
                    </div>

                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search activities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-4 pr-10 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg outline-none text-slate-700 dark:text-slate-200 focus:border-[#F97316] transition-colors"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#F3F4F6] dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-sm font-bold uppercase tracking-wide border-y border-slate-200 dark:border-slate-600 sticky top-0">
                            <tr>
                                <th className="p-4 w-12 text-center">
                                    <input type="checkbox" onChange={toggleSelectAll} checked={selectedRows.length === filteredActivities.length && filteredActivities.length > 0} className="w-4 h-4 rounded border-slate-300 text-[#F97316] focus:ring-[#F97316]" />
                                </th>
                                <th className="p-4">Notification</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Time</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
                            {filteredActivities.slice(0, rowsPerPage).map((row) => (
                                <tr key={row.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group ${!row.isRead ? 'bg-orange-50/20 dark:bg-orange-900/10' : ''}`}>
                                    <td className="p-4 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(row.id)}
                                            onChange={() => toggleSelectRow(row.id)}
                                            className="w-4 h-4 rounded border-slate-300 text-[#F97316] focus:ring-[#F97316]"
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className={`text-sm ${!row.isRead ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                {row.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold border border-transparent ${getTypeStyles(row.type, row.color)}`}>
                                            <row.icon size={12} />
                                            {row.type}
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                        {row.created}
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!row.isRead && (
                                                <button
                                                    onClick={async () => {
                                                        await markNotificationRead(row.id);
                                                    }}
                                                    className="p-1.5 text-emerald-500 hover:text-emerald-700 transition-colors"
                                                    title="Mark as Read"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                            )}
                                            <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredActivities.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <Bell size={64} className="mb-4 opacity-10" />
                                            <p className="text-lg font-medium">No new notifications</p>
                                            <p className="text-sm">Your inbox is clear!</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
