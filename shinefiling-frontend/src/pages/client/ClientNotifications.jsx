import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCircle, Trash2, MailOpen, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../api';

const ClientNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setUserEmail(user.email);
            fetchNotifications(user.email);
        }
    }, []);

    const fetchNotifications = async (email) => {
        try {
            setLoading(true);
            const data = await getNotifications(email);
            if (Array.isArray(data)) {
                setNotifications(data);
            }
        } catch (error) {
            console.error("Failed to load notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead(userEmail);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const unreadCount = notifications.filter(n => !(n.isRead || n.read)).length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-[#043E52] dark:text-white flex items-center gap-3">
                        Notifications
                        <span className="text-xs font-medium bg-[#ED6E3F]/10 text-[#ED6E3F] px-2 py-0.5 rounded-full border border-[#ED6E3F]/20">{unreadCount} New</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Stay updated with your application status and alerts.</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1C3540] border border-slate-200 dark:border-[#2A4550] text-[#043E52] dark:text-white rounded-xl hover:bg-[#ED6E3F] hover:text-white dark:hover:bg-[#ED6E3F] hover:border-[#ED6E3F] transition-all font-bold text-xs shadow-sm"
                    >
                        <CheckCircle size={14} /> Mark all read
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-[#043E52] rounded-3xl shadow-sm border border-slate-100 dark:border-[#1C3540] overflow-hidden min-h-[400px] relative">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-12 text-slate-400 h-full absolute inset-0">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED6E3F] mb-4"></div>
                        <p className="text-xs font-bold">Loading notifications...</p>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="divide-y divide-slate-100 dark:divide-[#1C3540]">
                        {notifications.map((notification) => {
                            const isRead = notification.isRead || notification.read;
                            return (
                                <div
                                    key={notification.id}
                                    className={`p-6 transition-all group flex items-start gap-5 ${isRead ? 'bg-white dark:bg-[#043E52] hover:bg-slate-50 dark:hover:bg-[#152a30]' : 'bg-[#ED6E3F]/5 dark:bg-[#1C3540]/30 hover:bg-[#ED6E3F]/10 dark:hover:bg-[#1C3540]/50'}`}
                                >
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${notification.type === 'SUCCESS' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                                        notification.type === 'WARNING' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                                            notification.type === 'ERROR' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' :
                                                'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                        }`}>
                                        {notification.type === 'SUCCESS' ? <CheckCircle2 size={18} /> :
                                            notification.type === 'WARNING' ? <AlertTriangle size={18} /> :
                                                notification.type === 'ERROR' ? <AlertTriangle size={18} /> :
                                                    <Info size={18} />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
                                            <h4 className={`font-bold text-sm ${isRead ? 'text-slate-700 dark:text-slate-200' : 'text-[#043E52] dark:text-white'}`}>
                                                {notification.title}
                                                {!isRead && <span className="inline-block w-2 H-2 bg-red-500 rounded-full ml-2 align-middle"></span>}
                                            </h4>
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-medium">
                                                {new Date(notification.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                            </span>
                                        </div>
                                        <p className={`text-xs mt-1.5 leading-relaxed ${isRead ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {notification.message}
                                        </p>
                                        {!isRead && (
                                            <button
                                                onClick={() => handleMarkRead(notification.id)}
                                                className="text-[10px] font-bold text-[#ED6E3F] mt-3 hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Check size={12} /> Mark as Read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-20 text-slate-400 dark:text-slate-500">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-[#1C3540] rounded-full flex items-center justify-center mb-4 border border-dashed border-slate-200 dark:border-[#2A4550]">
                            <Bell size={24} />
                        </div>
                        <h3 className="text-base font-bold text-slate-600 dark:text-white mb-1">No Notifications</h3>
                        <p className="max-w-xs text-center text-xs">You're all caught up! New updates will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientNotifications;
