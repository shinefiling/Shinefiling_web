import React, { useState, useEffect } from 'react';
import {
    Shield, Lock, Globe, Server, Activity, AlertTriangle, RefreshCcw, Power, CheckCircle, Smartphone, Wifi, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- COMPONENT: Security Flow Visualization ---
const SecurityFlowDiagram = ({ status }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden h-[300px] flex flex-col items-center justify-center">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent dark:from-blue-900/10"></div>

            <div className="flex items-center justify-center gap-4 md:gap-12 relative z-10 w-full animate-in fade-in zoom-in duration-700">
                {/* Node 1: Public Internet */}
                <div className="flex flex-col items-center gap-3 w-24">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 relative group cursor-pointer hover:bg-white dark:hover:bg-slate-600 shadow-sm border border-slate-200 dark:border-slate-600 transition-all">
                        <Globe size={32} className="group-hover:scale-110 transition-transform" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">Public Internet</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">Source Traffic</p>
                    </div>
                </div>

                {/* Connection Line 1 */}
                <div className="hidden md:flex flex-1 h-[2px] bg-slate-200 dark:bg-slate-700 relative items-center justify-center">
                    <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full animate-[ping_1.5s_infinite]"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-[2px] bg-blue-500/20"></div>
                    <span className="bg-white dark:bg-slate-800 text-[10px] px-2 text-slate-400 font-mono absolute -top-4">HTTPS / TLS 1.3</span>
                </div>

                {/* Node 2: Firewall Core */}
                <div className="flex flex-col items-center gap-4 relative z-20">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#043E52] to-[#2B3446] dark:from-slate-700 dark:to-slate-900 flex items-center justify-center text-white shadow-xl shadow-blue-900/20 border-4 border-white dark:border-slate-800">
                            <Shield size={42} className="text-[#F97316]" />
                        </div>
                        {/* Orbiting Particles */}
                        <div className="absolute inset-0 border-2 border-dashed border-[#F97316]/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                        <div className="absolute -inset-2 border border-blue-500/20 rounded-full animate-[pulse_3s_infinite]"></div>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-[#043E52] dark:text-white uppercase tracking-wider">Firewall Core</p>
                        <p className="text-xs text-[#F97316] font-bold mt-0.5">Active Filtering</p>
                    </div>
                </div>

                {/* Connection Line 2 */}
                <div className="hidden md:flex flex-1 h-[2px] bg-slate-200 dark:bg-slate-700 relative items-center justify-center">
                    <div className={`absolute top-1/2 -translate-y-1/2 w-full h-[2px] ${status === 'secure' ? 'bg-green-500/20' : 'bg-red-500/20'}`}></div>
                    <div className={`w-2 h-2 rounded-full absolute top-1/2 -translate-y-1/2 animate-[ping_1.5s_infinite_reverse] ${status === 'secure' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="bg-white dark:bg-slate-800 text-[10px] px-2 text-slate-400 font-mono absolute -top-4">Filtered Req</span>
                </div>

                {/* Node 3: Secure Server */}
                <div className="flex flex-col items-center gap-3 w-24">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center relative shadow-sm border transition-all ${status === 'secure' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-100'}`}>
                        <Server size={30} />
                        {status === 'secure' && <CheckCircle size={16} className="absolute -top-2 -right-2 text-green-500 bg-white dark:bg-slate-800 rounded-full" />}
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">App Server</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">192.168.1.5</p>
                    </div>
                </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-600 flex items-center gap-4 text-[10px] font-bold text-slate-500 dark:text-slate-300 shadow-sm">
                    <span className="flex items-center gap-1.5"><Zap size={10} className="text-yellow-500" /> Latency: 24ms</span>
                    <span className="w-px h-3 bg-slate-300 dark:bg-slate-500"></span>
                    <span className="flex items-center gap-1.5"><Activity size={10} className="text-blue-500" /> Uptime: 99.99%</span>
                    <span className="w-px h-3 bg-slate-300 dark:bg-slate-500"></span>
                    <span className="flex items-center gap-1.5"><Shield size={10} className="text-green-500" /> Rules: 342 Active</span>
                </div>
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD COMPONENT ---
const FirewallDashboard = () => {
    const [stats, setStats] = useState({ blocked: 1240, attacks: 15, bandwidth: '45 GB/s' });
    const [statusLines, setStatusLines] = useState([
        'Initializing Firewall Subsystems...',
        'Loading Threat Intelligence Feed...',
        'Connecting to Geo-IP Database...',
        'Syncing Rule Definitions v24.1.5...',
        'System Active. Monitoring Traffic.'
    ]);
    const [systemStatus, setSystemStatus] = useState('secure');

    useEffect(() => {
        // Simulation of log feed
        const interval = setInterval(() => {
            setStats(prev => ({
                blocked: prev.blocked + Math.floor(Math.random() * 2),
                attacks: prev.attacks,
                bandwidth: (40 + Math.random() * 10).toFixed(1) + ' GB/s'
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const statCards = [
        { label: 'Threats Blocked', value: stats.blocked, icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Active Attacks', value: stats.attacks, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
        { label: 'Live Bandwidth', value: stats.bandwidth, icon: Activity, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 font-[Roboto,sans-serif]">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        <Lock className="text-[#F97316]" size={28} /> Security Command Center
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Real-time WAF monitoring, threat detection, and traffic analysis.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-xs font-bold border border-green-100 dark:border-green-900/30">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        SYSTEM SECURE
                    </div>
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-700/50 rounded-lg transition-colors">
                        <RefreshCcw size={18} />
                    </button>
                    <button className="px-4 py-2 bg-[#043E52] text-white text-sm font-bold rounded-lg hover:bg-[#F97316] transition shadow-lg shadow-orange-500/20 flex items-center gap-2">
                        <Power size={16} /> Emergency Shutdown
                    </button>
                </div>
            </div>

            {/* Main Visual & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Visualizer (2/3 width) */}
                <div className="lg:col-span-2">
                    <SecurityFlowDiagram status={systemStatus} />
                </div>

                {/* KPI Cards (1/3 width vertical stack) */}
                <div className="space-y-4">
                    {statCards.map((card, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between hover:border-[#F97316]/50 transition-colors cursor-default">
                            <div>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{card.label}</p>
                                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{card.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                                <card.icon size={24} />
                            </div>
                        </div>
                    ))}

                    {/* Console Log Area */}
                    <div className="bg-[#043E52] rounded-2xl p-4 h-[120px] overflow-hidden font-mono text-[10px] text-green-400 leading-relaxed shadow-inner">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-2 text-gray-400">
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                            <span>root@shine-firewall:~# tail -f /var/log/syslog</span>
                        </div>
                        <div className="space-y-1 opacity-90">
                            {statusLines.map((line, i) => (
                                <div key={i} className="truncate">
                                    <span className="text-blue-400">[{new Date().toLocaleTimeString().split(' ')[0]}]</span> {line}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Active Rules Grid */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Shield size={18} className="text-[#F97316]" /> Defense Matrix
                    </h3>
                    <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">21 Active Modules</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            title: 'Network Layer',
                            color: 'blue',
                            items: ['DDOS Mitigation', 'IP Rate Limiting', 'Packet Inspection', 'Geo-Blocking', 'Load Balancing', 'Traffic Shaping', 'VPN Tunneling']
                        },
                        {
                            title: 'Application Layer',
                            color: 'green',
                            items: ['SQL Injection', 'XSS Protection', 'CSRF Tokens', 'Bot Detection', 'API Throttling', 'Header Validation', 'Cookie Security']
                        },
                        {
                            title: 'Access Control',
                            color: 'purple',
                            items: ['JWT Validation', '2FA Enforcement', 'Session Timeout', 'Device Fingerprint', 'Role RBAC', 'OAuth Integration', 'IP Whitelisting']
                        },
                        {
                            title: 'Data Integrity',
                            color: 'orange',
                            items: ['File Scan', 'Payload Analysis', 'Encryption Check', 'Leak Prevention', 'Backup Verify', 'Checksum Validation', 'Audit Logging']
                        }
                    ].map((layer, i) => (
                        <div key={i} className="flex flex-col h-full bg-slate-50 dark:bg-slate-700/20 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
                            <h4 className={`text-xs font-bold uppercase tracking-wider text-${layer.color}-500 border-b border-slate-200 dark:border-slate-600 pb-2 mb-2`}>
                                {layer.title} <span className="text-[10px] opacity-60 ml-1">({layer.items.length})</span>
                            </h4>
                            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden">
                                {layer.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm p-2 bg-white dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-600 hover:border-[#F97316]/50 transition-colors group cursor-default">
                                        <span className="text-slate-600 dark:text-slate-300 text-xs font-medium">{item}</span>
                                        <div className={`w-1.5 h-1.5 rounded-full bg-${layer.color}-500 shadow-sm opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FirewallDashboard;
