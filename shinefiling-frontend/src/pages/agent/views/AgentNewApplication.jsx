
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, Briefcase, Users, FileText, CheckCircle, Smartphone, Mail, MapPin, Calendar, CreditCard, Upload, AlertCircle } from 'lucide-react';
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
                // Group by category
                const grouped = (data || []).reduce((acc, service) => {
                    const cat = service.category || 'Business Services';
                    if (!acc[cat]) acc[cat] = { label: cat, services: [] };
                    acc[cat].services.push(service);
                    return acc;
                }, {});
                setServices(Object.values(grouped));
            } catch (err) {
                console.error("Failed to fetch services", err);
                // Fallback to mock if API fails
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-[#043E52] dark:text-white">New Application</h2>

            {/* Steps Progress */}
            <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-[#1C3540] -z-10 rounded-full"></div>
                {[1, 2, 3].map(s => (
                    <div key={s} className={`flex items-center justify-center w-10 h-10 rounded-full border-4 transition-colors ${step >= s ? 'bg-[#ED6E3F] border-[#043E52] dark:border-[#0D1C22] text-white' : 'bg-slate-200 dark:bg-[#1C3540] border-[#F3F4F6] dark:border-[#0D1C22] text-slate-500'
                        }`}>
                        {step > s ? <CheckCircle size={16} /> : <span className="font-bold text-sm">{s}</span>}
                    </div>
                ))}
            </div>

            {/* Step 1: Service Selection */}
            {step === 1 && (
                <div className="space-y-6">
                    <p className="text-slate-500 dark:text-slate-400">Select the service you want to apply for your client.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.length > 0 ? services.map(cat => (
                            <div key={cat.label} className="space-y-4">
                                <h3 className="font-bold text-[#043E52] dark:text-white flex items-center gap-2">
                                    <Briefcase size={20} className="text-[#ED6E3F]" /> {cat.label}
                                </h3>
                                <div className="space-y-2">
                                    {cat.services.map(service => (
                                        <button
                                            key={service.id}
                                            onClick={() => handleServiceSelect(service)}
                                            className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1C3540] border border-slate-100 dark:border-[#2C4A57] rounded-xl hover:border-[#ED6E3F] dark:hover:border-[#ED6E3F] hover:shadow-md transition-all group text-left"
                                        >
                                            <span className="font-medium text-slate-700 dark:text-slate-200">{service.name || service.title}</span>
                                            <ChevronRight size={16} className="text-slate-300 group-hover:text-[#ED6E3F] transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )) : (
                            <div className="md:col-span-2 py-12 text-center text-slate-400">
                                <Briefcase size={40} className="mx-auto mb-4 opacity-20" />
                                <p>Loading services...</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Step 2: Client Details */}
            {step === 2 && (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-[#043E52] p-8 rounded-3xl border border-slate-100 dark:border-[#1C3540] shadow-sm space-y-6">
                    {error && (
                        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400 text-sm flex items-center gap-3">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}
                    <div className="flex items-center gap-3 bg-[#ED6E3F]/10 p-4 rounded-xl border border-[#ED6E3F]/20 mb-6">
                        <FileText className="text-[#ED6E3F]" />
                        <div>
                            <p className="text-xs font-bold text-[#ED6E3F] uppercase">Selected Service</p>
                            <p className="font-bold text-[#043E52] dark:text-white">{selectedService?.name || selectedService?.title}</p>
                        </div>
                        <button type="button" onClick={() => setStep(1)} className="ml-auto text-xs font-bold text-slate-400 hover:text-[#043E52] dark:hover:text-white underline">Change</button>
                    </div>

                    <h3 className="text-lg font-bold text-[#043E52] dark:text-white">Client Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Client Name</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input name="fullName" required value={clientDetails.fullName} onChange={handleClientChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#1C3540] rounded-xl outline-none focus:ring-2 focus:ring-[#ED6E3F] text-sm dark:text-white" placeholder="John Doe" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input name="userEmail" type="email" required value={clientDetails.userEmail} onChange={handleClientChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#1C3540] rounded-xl outline-none focus:ring-2 focus:ring-[#ED6E3F] text-sm dark:text-white" placeholder="client@example.com" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input name="phone" required value={clientDetails.phone} onChange={handleClientChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#1C3540] rounded-xl outline-none focus:ring-2 focus:ring-[#ED6E3F] text-sm dark:text-white" placeholder="7639227019" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">State</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input name="state" required value={clientDetails.state} onChange={handleClientChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#1C3540] rounded-xl outline-none focus:ring-2 focus:ring-[#ED6E3F] text-sm dark:text-white" placeholder="Tamil Nadu" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button type="button" onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-600 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1C3540]">Back</button>
                        <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-[#043E52] dark:bg-[#ED6E3F] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-70">
                            {loading ? 'Submitting Application...' : 'Create Application'}
                        </button>
                    </div>
                </form>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
                <div className="bg-white dark:bg-[#043E52] p-12 rounded-3xl border border-slate-100 dark:border-[#1C3540] shadow-sm text-center">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-[#043E52] dark:text-white mb-2">Application Created!</h2>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                        Successfully initiated application for {selectedService?.name}. An email has been sent to the client ({clientDetails.userEmail}) to upload documents.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => { setStep(1); setClientDetails({ fullName: '', userEmail: '', phone: '', state: '' }); setSelectedService(null); }} className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-600 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1C3540]">Create Another</button>
                        <button onClick={() => setActiveTab('applications')} className="px-6 py-3 bg-[#ED6E3F] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">View Applications</button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default AgentNewApplication;
