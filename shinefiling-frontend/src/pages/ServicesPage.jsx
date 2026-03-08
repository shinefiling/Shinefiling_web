import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Filter, CheckCircle, FileText, Clock, Star, ArrowLeft } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SERVICE_DATA } from '../data/services';
import Navbar from '../components/Navbar';

const ServicesPage = ({ isLoggedIn, onLogout }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const query = searchParams.get('search');
        if (query) {
            setSearchTerm(query);
        }
    }, [searchParams]);

    // Helper to verify if we have details for a service
    const getServiceSlug = (name) => {
        const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        const map = {
            "privatelimitedcompanyregistration": "private-limited-company",
            "onepersoncompanyopc": "one-person-company",
            "limitedliabilitypartnershipllp": "llp-registration",
            "partnershipfirmregistration": "partnership-firm",
            "soleproprietorshipregistration": "sole-proprietorship",
            "section8ngocompany": "section-8-company",
            "nidhicompanyregistration": "nidhi-company-registration",
            "producercompanyregistration": "producer-company-registration",
            "publiclimitedcompany": "public-limited-company",
            "rentagreement": "rent-agreement",

            // Tax & Compliance
            "gstregistration": "tax-compliance/gst-registration",
            "gstmonthlyreturngstr13b": "tax-compliance/gst-monthly-return",
            "gstannualreturngstr9": "tax-compliance/gst-annual-return",
            "incometaxreturnitr17": "tax-compliance/income-tax-return",
            "tdsreturnfiling": "tax-compliance/tds-return-filing",
            "professionaltaxregfiling": "tax-compliance/professional-tax",
            "advancetaxfiling": "tax-compliance/advance-tax",
            "taxauditfiling": "tax-compliance/tax-audit",
        };
        return map[normalize(name)];
    };

    const filteredServices = Object.values(SERVICE_DATA).flatMap(module => {
        if (activeFilter !== 'all' && module.id !== activeFilter) return [];
        return module.items.map(item => ({
            name: item,
            category: module.label,
            color: module.color,
            items: module.items,
            icon: module.icon
        }));
    }).filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white text-gray-900 pb-24 font-sans">
            <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />

            <div className="pt-32 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Explore <span className="text-brand-gold">150+ Services</span></h1>
                    <p className="text-gray-600">Everything you need for your Citizen, Business, and Tax compliance.</p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between bg-white shadow-lg border border-gray-100 p-4 rounded-2xl">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for 'GST', 'Rent', 'PAN'..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 text-gray-900 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition placeholder:text-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        <button
                            onClick={() => setActiveFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                        >
                            All
                        </button>
                        {Object.values(SERVICE_DATA).map(mod => (
                            <button
                                key={mod.id}
                                onClick={() => setActiveFilter(mod.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeFilter === mod.id ? `bg-${mod.color}-100 text-${mod.color}-700 border border-${mod.color}-200` : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                            >
                                {mod.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredServices.map((service, idx) => {
                        const slug = getServiceSlug(service.name);
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5 }}
                                onClick={() => {
                                    if (slug) {
                                        navigate(`/services/${slug}`);
                                    } else {
                                        // Use Generic Page for "Coming Soon" items
                                        navigate(`/services/apply?name=${encodeURIComponent(service.name)}`);
                                    }
                                }}
                                className={`p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-xl hover:border-brand-gold/30 transition group cursor-pointer shadow-sm`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-${service.color}-50 text-${service.color}-600`}>
                                    <service.icon size={20} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-brand-gold transition line-clamp-1" title={service.name}>{service.name}</h3>
                                <p className="text-xs text-gray-500 mb-4">{service.category}</p>
                                <div className="flex items-center text-xs font-bold text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">
                                    {slug ? 'View Details' : 'Apply Now'} <ArrowRight size={12} className="ml-1" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
