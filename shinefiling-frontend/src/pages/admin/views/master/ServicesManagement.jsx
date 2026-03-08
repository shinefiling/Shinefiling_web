import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    FileText, Plus, Edit2, CheckCircle, X, Search, Filter, FolderOpen,
    Tag, Box, Power, LayoutGrid, List, Clock, MoreVertical, AlertCircle,
    DollarSign, BarChart3, ChevronDown, Layers, Shield, Globe, Database, User, Zap,
    Building, Coins, Briefcase, Landmark, Award, Scale, Stamp, Lock, Trash2, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICE_DATA } from '../../../../data/services';
import { getInactiveServices, toggleServiceStatus } from '../../../../utils/serviceManager';
import { getServiceProducts as getServiceCatalog, createServiceProduct, updateServiceProduct } from '../../../../api';

const ServicesManagement = () => {
    // State
    const [viewMode, setViewMode] = useState('list'); // Default to list for better admin view
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [services, setServices] = useState([]);
    const [inactiveIds, setInactiveIds] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [actionMessage, setActionMessage] = useState(null);

    const initialForm = {
        name: '', categoryId: 'business_reg', price: '', sla: '3-5 Days', docsRequired: 2, description: '', status: 'ACTIVE'
    };
    const [formData, setFormData] = useState(initialForm);

    const loadServices = async () => {
        try {
            // 1. Fetch from Backend
            const backendData = await getServiceCatalog();
            // 2. Fetch local inactive override
            const inactive = getInactiveServices();
            setInactiveIds(inactive);

            // 3. Merge or Format
            // 3. Merge Local Data with Backend Data to ensure all 103 services are shown
            // 3. Smart Merge: Ensure exactly 103 items, prioritizing Backend Data
            const localData = Object.values(SERVICE_DATA).flatMap(cat =>
                cat.items.map(itemName => ({
                    name: itemName,
                    categoryId: cat.id,
                    category: cat.label,
                    color: cat.color,
                    status: 'ACTIVE',
                    price: 4999,
                    sla: '3-5 Days',
                    docsRequired: 2,
                    isGhost: true
                }))
            );

            // Create a Map keyed by normalized name to ensure uniqueness
            // 1. Start with Local Data (Ghost items)
            const serviceMap = new Map();
            localData.forEach(item => {
                serviceMap.set(item.name.trim().toLowerCase(), item);
            });

            // 2. Overlay Backend Data (Real items)
            // If backend has "GST Registration", it replaces the local ghost version
            if (backendData && Array.isArray(backendData)) {
                backendData.forEach(backendItem => {
                    const key = backendItem.name.trim().toLowerCase();
                    // We only care about backend items that match our official list (or we can append them if dynamic)
                    // For now, let's allow backend to override strict local keys
                    if (serviceMap.has(key)) {
                        const localDef = serviceMap.get(key);
                        serviceMap.set(key, {
                            ...backendItem, // Use DB values (price, id, etc)
                            // Restore UI meta-data from local def if missing in DB
                            category: localDef.category,
                            color: localDef.color,
                            icon: resolveIcon(backendItem.icon),
                            isGhost: false
                        });
                    }
                });
            }

            // 3. Convert Map back to Array
            const finalUniqueServices = Array.from(serviceMap.values());

            setServices(finalUniqueServices);
        } catch (e) {
            console.error(e);
        }
    };

    const handleToggleStatus = async (id) => {
        const newStatus = await toggleServiceStatus(id); // Returns bool isInactive
        setInactiveIds(prev => newStatus ? [...prev, id] : prev.filter(x => x !== id));
    };

    // Helper to resolve icon
    const resolveIcon = (iconName) => {
        const iconMap = {
            FileText, Box, Shield, Zap, Globe, Database, User,
            Building, Coins, Briefcase, Landmark, Award, Scale,

            // Legacy Mappings
            'fssai': Landmark,
            'inc': Building,
            'tax': Coins,
            'ip': Shield,

            // New Backend Mappings
            'business_reg': Building,
            'tax_compliance': Coins,
            'roc_compliance': Briefcase,
            'licenses': Landmark,
            'ipr': Shield,
            'labour_hr': User,
            'certifications': Award,
            'legal': Scale,
            'financial': FileText,
            'storage': Database,

            // New Categories
            'legal_notices': Scale,
            'corrections': Stamp,
            'closure': Lock
        };
        // If it's already a component (from local data), return it
        if (typeof iconName !== 'string') return iconName;
        // If string, lookup or default
        return iconMap[iconName] || Box;
    };

    useEffect(() => {
        loadServices();
    }, []);

    const handleEdit = (service) => {
        setSelectedService(service);
        setFormData({
            name: service.name,
            categoryId: service.categoryId,
            price: service.price,
            sla: service.sla,
            docsRequired: service.docsRequired,
            description: service.description || '',
            status: service.status
        });
        setModalOpen(true);
    };

    const handleCreateNew = () => {
        setSelectedService(null);
        setFormData(initialForm);
        setModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setActionMessage(null);

        try {
            if (selectedService && selectedService.id) {
                // Update existing record
                await updateServiceProduct(selectedService.id, formData);
                setActionMessage({ type: 'success', text: 'Service updated successfully!' });
            } else {
                // Create new record (New Service OR Saving a Ghost Service)
                await createServiceProduct(formData);
                setActionMessage({ type: 'success', text: 'Service created successfully!' });
            }
            // Close after delay or immediately refresh
            setTimeout(() => {
                setModalOpen(false);
                loadServices();
            }, 1000);
        } catch (error) {
            setActionMessage({ type: 'error', text: error.message || 'Operation failed' });
        } finally {
            setIsSaving(false);
        }
    };

    const filteredServices = useMemo(() => {
        return services.filter(s => {
            // Check both API status and LocalStorage override
            const isInactive = s.status === 'INACTIVE' || inactiveIds.includes(s.id);
            const matchesCat = filterCategory === 'ALL' || s.categoryId === filterCategory;
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'ALL' || (filterStatus === 'ACTIVE' && !isInactive) || (filterStatus === 'INACTIVE' && isInactive);
            return matchesCat && matchesSearch && matchesStatus;
        });
    }, [services, inactiveIds, filterCategory, filterStatus, searchQuery]);

    // Metrics
    const metrics = useMemo(() => {
        const total = services.length;
        const active = total - inactiveIds.length;
        const inactive = inactiveIds.length;
        const avgPrice = total > 0 ? Math.round(services.reduce((acc, curr) => acc + curr.price, 0) / total) : 0;
        return { total, active, inactive, avgPrice };
    }, [services, inactiveIds]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-[Roboto,sans-serif]">
            {/* Header & Metrics */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        <Tag className="text-[#F97316]" size={28} /> Pricing & Service Catalog
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Global pricing control and service requirement management.</p>
                </div>
                <div className="flex gap-4">
                    {[
                        { label: 'Total Services', val: metrics.total, icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                        { label: 'Active', val: metrics.active, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
                        { label: 'Avg Price', val: `₹${metrics.avgPrice}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    ].map((m, i) => (
                        <div key={i} className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                            <div className={`p-2 rounded-lg ${m.bg} ${m.color}`}><m.icon size={16} /></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{m.label}</p>
                                <p className="font-extrabold text-slate-800 dark:text-white">{m.val}</p>
                            </div>
                        </div>
                    ))}
                    <button onClick={handleCreateNew} className="bg-[#043E52] hover:bg-[#F97316] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 transition flex items-center gap-2 shrink-0 self-center h-12">
                        <Plus size={18} /> New Service
                    </button>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-center gap-3">
                <div className="flex flex-1 gap-3 w-full md:w-auto items-center">

                    <div className="relative flex-1 md:max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by service name or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border-none rounded-xl text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#F97316]/20 transition"
                        />
                    </div>

                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-600 mx-2 shrink-0 hidden md:block"></div>

                    {/* Filters */}
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-700 border-none text-sm font-bold text-slate-600 dark:text-slate-300 rounded-lg py-2 px-3 outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition appearance-none"
                        >
                            <option value="ALL">All Categories</option>
                            {Object.values(SERVICE_DATA).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-700 border-none text-sm font-bold text-slate-600 dark:text-slate-300 rounded-lg py-2 px-3 outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition appearance-none"
                        >
                            <option value="ALL">Status: All</option>
                            <option value="ACTIVE">Active Only</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg shrink-0 ml-auto">
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow text-[#F97316]' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                            <List size={16} />
                        </button>
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow text-[#F97316]' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                            <LayoutGrid size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {filteredServices.length === 0 ? (
                <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-full"><Box size={40} /></div>
                    <p className="font-bold">No services found matching your criteria.</p>
                    <button onClick={() => { setFilterCategory('ALL'); setSearchQuery('') }} className="text-[#F97316] text-sm font-bold hover:underline">Clear Filters</button>
                </div>
            ) : (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredServices.map((s) => {
                            const isInactive = inactiveIds.includes(s.id);
                            const ServiceIcon = s.icon || Box;
                            return (
                                <div key={s.id} className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 flex flex-col ${isInactive ? 'border-slate-200 dark:border-slate-700 opacity-60 grayscale' : 'border-slate-100 dark:border-slate-700 hover:border-[#F97316]/30'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md transform group-hover:scale-110 transition-transform" style={{ backgroundColor: s.color }}>
                                            <ServiceIcon size={24} />
                                        </div>
                                        <div className="relative">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${!isInactive ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-700 dark:text-slate-400'}`}>
                                                {!isInactive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.category}</span>
                                        <h3 className="font-bold text-slate-800 dark:text-white text-sm mt-1 leading-snug line-clamp-2 min-h-[40px] group-hover:text-[#F97316] transition-colors">{s.name}</h3>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="px-2 py-1 bg-slate-50 dark:bg-slate-700/50 rounded-md text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                <Clock size={10} /> {s.sla}
                                            </span>
                                            <span className="px-2 py-1 bg-slate-50 dark:bg-slate-700/50 rounded-md text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                <FileText size={10} /> {s.docsRequired} Docs
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Pricing</p>
                                            <p className="font-extrabold text-lg text-slate-800 dark:text-white">₹{s.price.toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(s)} className="p-2 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-[#F97316] rounded-lg transition">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleToggleStatus(s.id)} className="p-2 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-red-500 rounded-lg transition">
                                                <Power size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Service Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Base Price</th>
                                    <th className="px-6 py-4">SLA Time</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredServices.map((s) => {
                                    const isInactive = inactiveIds.includes(s.id);
                                    const ServiceIcon = s.icon || Box;
                                    return (
                                        <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm" style={{ backgroundColor: s.color }}>
                                                        <ServiceIcon size={18} />
                                                    </div>
                                                    <div>
                                                        <span className={`font-bold text-sm block ${isInactive ? 'text-slate-400' : 'text-slate-800 dark:text-white'}`}>{s.name}</span>
                                                        <span className="text-xs text-slate-400">{s.docsRequired} Documents Required</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">{s.category}</span>
                                            </td>
                                            <td className="px-6 py-4 font-mono font-bold text-slate-800 dark:text-white">₹{s.price.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><Clock size={12} /> {s.sla}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${!isInactive ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${!isInactive ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                                    {!isInactive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(s)} className="p-2 text-slate-400 hover:text-[#F97316] hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition" title="Edit Service">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleToggleStatus(s.id)} className={`p-2 rounded-lg transition ${!isInactive ? 'text-green-500 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-100'}`} title="Toggle Activation">
                                                        <Power size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            )}

            {/* Create Service Modal */}
            {createPortal(
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{selectedService ? 'Update Pricing' : 'Create New Service'}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure details, pricing, and requirements.</p>
                                    </div>
                                    <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-red-100 hover:text-red-500 dark:text-slate-400 flex items-center justify-center transition"><X size={18} /></button>
                                </div>
                                <form onSubmit={handleSave} className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                                    {actionMessage && (
                                        <div className={`p-3 rounded-lg text-sm font-bold flex items-center gap-2 ${actionMessage.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                            {actionMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                            {actionMessage.text}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Service Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="e.g. Private Limited Company Registration"
                                                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-[#F97316]/50 transition text-sm font-medium text-slate-800 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Category</label>
                                            <select
                                                required
                                                value={formData.categoryId}
                                                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-[#F97316]/50 transition text-sm font-medium text-slate-800 dark:text-white"
                                            >
                                                {Object.values(SERVICE_DATA).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Base Price (₹)</label>
                                            <div className="relative">
                                                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="number"
                                                    required
                                                    value={formData.price}
                                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                    placeholder="4999"
                                                    className="w-full pl-9 p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-[#F97316]/50 transition text-sm font-medium text-slate-800 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Est. SLA (Days)</label>
                                            <select
                                                value={formData.sla}
                                                onChange={e => setFormData({ ...formData, sla: e.target.value })}
                                                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-[#F97316]/50 transition text-sm font-medium text-slate-800 dark:text-white"
                                            >
                                                <option>1-3 Days</option>
                                                <option>3-5 Days</option>
                                                <option>7-10 Days</option>
                                                <option>15+ Days</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Required Docs Count</label>
                                            <input
                                                type="number"
                                                value={formData.docsRequired}
                                                onChange={e => setFormData({ ...formData, docsRequired: e.target.value })}
                                                placeholder="2"
                                                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-[#F97316]/50 transition text-sm font-medium text-slate-800 dark:text-white"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Description & Deliverables</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Describe the service..."
                                                rows="4"
                                                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-[#F97316]/50 transition text-sm font-medium text-slate-800 dark:text-white resize-none"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                                        <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition text-sm">Cancel</button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-6 py-2.5 bg-[#043E52] text-white font-bold rounded-xl hover:bg-[#F97316] shadow-lg shadow-orange-500/20 transition text-sm flex items-center gap-2"
                                        >
                                            {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircle size={16} />}
                                            {isSaving ? 'Saving...' : selectedService ? 'Update Product' : 'Create Product'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default ServicesManagement;
