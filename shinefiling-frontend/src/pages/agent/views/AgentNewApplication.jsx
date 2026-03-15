import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, Briefcase, Users, FileText, CheckCircle, Smartphone, Mail, MapPin, Calendar, CreditCard, Upload, AlertCircle, Sparkles, Zap, ArrowRight, ArrowLeft } from 'lucide-react';
import { getServiceCatalog, createAgentClientApplication } from '../../../api';

const AgentNewApplication = ({ setActiveTab }) => {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [clientDetails, setClientDetails] = useState({
        fullName: '',
        userEmail: '',
        phone: '',
        state: ''
    });
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await getServiceCatalog();
                const grouped = (data || []).reduce((acc, service) => {
                    const cat = service.category || 'Business Services';
                    if (!acc[cat]) acc[cat] = { label: cat, services: [] };
                    acc[cat].services.push(service);
                    return acc;
                }, {});
                setServices(Object.values(grouped));
            } catch (err) {
                console.error("Failed to fetch services", err);
            }
        };
        fetchServices();
    }, []);

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setStep(2);
    };

    const handleClientChange = (e) => {
        setClientDetails({ ...clientDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await createAgentClientApplication(user.id, {
                serviceId: selectedService.id,
                serviceName: selectedService.name || selectedService.title,
                ...clientDetails
            });
            setStep(3);
        } catch (err) {
            setError(err.message || "Failed to create application. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 font-roboto uppercase">
            <div className="flex items-center gap-4 px-2">
                <div className="p-3 bg-[#ED6E3F]/10 rounded-2xl">
                    <Sparkles className="text-[#ED6E3F]" size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-[#043E52] dark:text-white tracking-tight">New Service Registry</h2>
                    <p className="text-slate-400 text-[10px] font-bold tracking-widest mt-0.5">Initialize a new client application process</p>
                </div>
            </div>

            {/* Stepper Display */}
            <div className="flex items-center justify-between px-10 relative mb-12">
                <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 dark:bg-slate-800 -z-10"></div>
                {[
                    { s: 1, l: 'Selection' },
                    { s: 2, l: 'Registry' },
                    { s: 3, l: 'Deployment' }
                ].map(item => (
                    <div key={item.s} className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all duration-500 border-2 ${
                            step >= item.s 
                            ? 'bg-[#ED6E3F] border-[#ED6E3F] text-white shadow-lg shadow-[#ED6E3F]/30 scale-110' 
                            : 'bg-white dark:bg-[#043E52] border-slate-200 dark:border-slate-800 text-slate-400'
                        }`}>
                            {step > item.s ? <CheckCircle size={16} /> : item.s}
                        </div>
                        <span className={`text-[9px] font-black tracking-widest ${step >= item.s ? 'text-[#ED6E3F]' : 'text-slate-400 opacity-50'}`}>
                            {item.l}
                        </span>
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* Step 1: Catalog Selection */}
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8 px-2"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {services.length > 0 ? services.map(cat => (
                                <div key={cat.label} className="space-y-4">
                                    <div className="flex items-center gap-2 px-2">
                                        <div className="w-1.5 h-6 bg-[#ED6E3F] rounded-full"></div>
                                        <h3 className="font-black text-[12px] text-[#043E52] dark:text-white tracking-[0.15em]">{cat.label}</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {cat.services.map(service => (
                                            <button
                                                key={service.id}
                                                onClick={() => handleServiceSelect(service)}
                                                className="w-full flex items-center justify-between p-5 bg-white dark:bg-[#043E52] border border-slate-100 dark:border-[#1C3540] rounded-3xl hover:border-[#ED6E3F] dark:hover:border-[#ED6E3F] hover:shadow-2xl hover:-translate-y-1 transition-all group text-left"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-black text-[13px] text-slate-700 dark:text-slate-200 tracking-tight group-hover:text-[#ED6E3F] transition-colors">{service.name || service.title}</span>
                                                    <span className="text-[9px] font-black text-slate-400 opacity-60 tracking-widest mt-1">Institutional Service</span>
                                                </div>
                                                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl group-hover:bg-[#ED6E3F] group-hover:text-white transition-all">
                                                    <ArrowRight size={14} />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )) : (
                                <div className="md:col-span-2 py-24 text-center">
                                    <div className="w-16 h-16 border-4 border-[#ED6E3F]/10 border-t-[#ED6E3F] rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Catalog Synchronization...</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Protocol Entry */}
                {step === 2 && (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#043E52] p-10 rounded-[48px] border border-slate-100 dark:border-[#1C3540] shadow-2xl space-y-8">
                            {error && (
                                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border-l-4 border-rose-500 rounded-r-2xl text-rose-600 dark:text-rose-400 text-[11px] font-black flex items-center gap-3">
                                    <AlertCircle size={18} /> {error}
                                </div>
                            )}

                            <div className="flex items-center gap-6 bg-slate-50 dark:bg-[#1C3540]/30 p-6 rounded-[32px] border border-transparent border-dashed group">
                                <div className="w-14 h-14 bg-[#ED6E3F] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#ED6E3F]/20">
                                    <Zap size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">Target Protocol</p>
                                    <p className="text-lg font-black text-[#043E52] dark:text-white tracking-tight">{selectedService?.name || selectedService?.title}</p>
                                </div>
                                <button type="button" onClick={() => setStep(1)} className="px-4 py-2 bg-white dark:bg-slate-800 text-[10px] font-black text-[#ED6E3F] tracking-widest rounded-xl hover:bg-[#ED6E3F] hover:text-white transition-all shadow-sm">REPROGRAM</button>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-[#043E52] dark:text-white tracking-[0.2em] border-l-4 border-[#ED6E3F] pl-4">Client Identity Vector</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 tracking-widest ml-1">Entity/Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute left-0 inset-y-0 flex items-center pl-4 text-slate-400 group-focus-within:text-[#ED6E3F] transition-colors">
                                                <Users size={18} />
                                            </div>
                                            <input 
                                                name="fullName" 
                                                required 
                                                value={clientDetails.fullName} 
                                                onChange={handleClientChange} 
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#1C3540] border-2 border-transparent focus:border-[#ED6E3F]/30 rounded-2xl outline-none text-sm font-bold dark:text-white transition-all shadow-inner" 
                                                placeholder="ALEX MERCER" 
                                            />
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 tracking-widest ml-1">Communication Node (Email)</label>
                                        <div className="relative group">
                                            <div className="absolute left-0 inset-y-0 flex items-center pl-4 text-slate-400 group-focus-within:text-[#ED6E3F] transition-colors">
                                                <Mail size={18} />
                                            </div>
                                            <input 
                                                name="userEmail" 
                                                type="email" 
                                                required 
                                                value={clientDetails.userEmail} 
                                                onChange={handleClientChange} 
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#1C3540] border-2 border-transparent focus:border-[#ED6E3F]/30 rounded-2xl outline-none text-sm font-bold dark:text-white transition-all shadow-inner lowercase" 
                                                placeholder="NODE@SYSTEM.DOMAIN" 
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Field */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 tracking-widest ml-1">Access Protocol (Mobile)</label>
                                        <div className="relative group">
                                            <div className="absolute left-0 inset-y-0 flex items-center pl-4 text-slate-400 group-focus-within:text-[#ED6E3F] transition-colors">
                                                <Smartphone size={18} />
                                            </div>
                                            <input 
                                                name="phone" 
                                                required 
                                                value={clientDetails.phone} 
                                                onChange={handleClientChange} 
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#1C3540] border-2 border-transparent focus:border-[#ED6E3F]/30 rounded-2xl outline-none text-sm font-bold dark:text-white transition-all shadow-inner" 
                                                placeholder="+91 00000 00000" 
                                            />
                                        </div>
                                    </div>

                                    {/* Location Field */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 tracking-widest ml-1">Geographic Vector (State)</label>
                                        <div className="relative group">
                                            <div className="absolute left-0 inset-y-0 flex items-center pl-4 text-slate-400 group-focus-within:text-[#ED6E3F] transition-colors">
                                                <MapPin size={18} />
                                            </div>
                                            <input 
                                                name="state" 
                                                required 
                                                value={clientDetails.state} 
                                                onChange={handleClientChange} 
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#1C3540] border-2 border-transparent focus:border-[#ED6E3F]/30 rounded-2xl outline-none text-sm font-bold dark:text-white transition-all shadow-inner" 
                                                placeholder="CENTRAL OVERRIDE" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setStep(1)} 
                                    className="flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-[10px] font-black tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                                >
                                    <ArrowLeft size={16} /> REVERT
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-[#ED6E3F] text-white rounded-2xl text-[11px] font-black tracking-[0.2em] shadow-2xl shadow-[#ED6E3F]/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'INITIALIZING...' : 'AUTHORIZE REGISTRY'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Step 3: Deployment Success */}
                {step === 3 && (
                    <motion.div 
                        key="step3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-[#043E52] p-16 rounded-[64px] border border-slate-100 dark:border-[#1C3540] shadow-2xl text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                        <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner group transition-transform hover:rotate-12">
                            <CheckCircle size={48} />
                        </div>
                        <h2 className="text-4xl font-black text-[#043E52] dark:text-white mb-4 tracking-tighter">SUCCESSFULLY DEPLOYED</h2>
                        <p className="text-slate-400 text-sm font-bold tracking-widest max-w-lg mx-auto mb-12 leading-relaxed">
                            Application for <span className="text-[#ED6E3F] font-black">{selectedService?.name}</span> has been successfully logged. Notification dispatched to <span className="text-[#043E52] dark:text-white font-black">{clientDetails.userEmail}</span>.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button 
                                onClick={() => { setStep(1); setClientDetails({ fullName: '', userEmail: '', phone: '', state: '' }); setSelectedService(null); }} 
                                className="px-10 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-[10px] font-black tracking-widest text-slate-500 hover:bg-slate-50 transition-all uppercase"
                            >
                                New Registry
                            </button>
                            <button 
                                onClick={() => setActiveTab('applications')} 
                                className="px-10 py-4 bg-[#043E52] dark:bg-white text-white dark:text-[#043E52] rounded-2xl text-[10px] font-black tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all uppercase"
                            >
                                Track Status
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AgentNewApplication;
