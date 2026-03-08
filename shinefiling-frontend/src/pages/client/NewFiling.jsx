import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Upload, ArrowRight, Zap, Loader, ChevronRight, Briefcase, FileText } from 'lucide-react';
import { submitServiceRequest, getServiceCatalog } from '../../api';
import { getInactiveServices } from '../../utils/serviceManager';
import { SERVICE_DATA } from '../../data/services';

const NewFiling = ({ setActiveTab, initialCategory }) => {
    const [step, setStep] = useState(1);
    const [activeCategory, setActiveCategory] = useState(initialCategory || Object.keys(SERVICE_DATA)[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});

    // Data Loading
    const [serviceCatalog, setServiceCatalog] = useState({});
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (initialCategory) setActiveCategory(initialCategory);
    }, [initialCategory]);

    useEffect(() => {
        const loadServices = async () => {
            // Reusing the logic from previous version to populate data
            try {
                const apiData = await getServiceCatalog();
                const inactiveList = getInactiveServices();
                let rawServices = [];
                Object.values(SERVICE_DATA).forEach(cat => {
                    cat.items.forEach(item => {
                        rawServices.push({ name: item, category: cat.label, categoryId: cat.id, icon: cat.icon });
                    });
                });

                const activeServices = rawServices.filter(s => {
                    const isInactiveGlobally = s.status === 'INACTIVE';
                    const isInactiveLocally = inactiveList.includes(s.id || s.name);
                    return !isInactiveGlobally && !isInactiveLocally;
                });

                const grouped = {};
                const cats = [];
                const getIcon = (catId) => SERVICE_DATA[catId]?.icon || Zap;

                activeServices.forEach(s => {
                    const catId = s.categoryId || 'others';
                    const catLabel = s.category || 'Other Services';
                    if (!grouped[catId]) {
                        grouped[catId] = { id: catId, label: catLabel, icon: getIcon(catId), items: [] };
                        cats.push({ id: catId, label: catLabel, icon: getIcon(catId) });
                    }
                    grouped[catId].items.push(s);
                });
                setServiceCatalog(grouped);
                setCategories(cats);
                if (cats.length > 0 && !activeCategory) setActiveCategory(cats[0].id);
            } catch (err) { console.error(err); }
        };
        loadServices();
    }, []);

    const filteredServices = searchTerm
        ? Object.values(serviceCatalog).flatMap(c => c.items).filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : (serviceCatalog[activeCategory]?.items || []);

    const SERVICE_ROUTE_MAP = {
        // Business Registration
        'Private Limited Company Registration': '/services/private-limited-company',
        'One Person Company (OPC)': '/services/one-person-company',
        'Limited Liability Partnership (LLP)': '/services/llp-registration',
        'Partnership Firm Registration': '/services/partnership-firm',
        'Sole Proprietorship Registration': '/services/sole-proprietorship',
        'Section 8 Company Registration': '/services/section-8-company',
        'Nidhi Company Registration': '/services/nidhi-company-registration',
        'Producer Company Registration': '/services/producer-company-registration',
        'Public Limited Company Registration': '/services/public-limited-company',
        'Indian Subsidiary Registration': '/services/indian-subsidiary-registration',
        'Foreign Company Registration': '/services/foreign-company-registration',
        'Startup Incorporation Advisory': '/services/startup-incorporation-advisory',

        // Licenses
        'FSSAI Registration (State & Central)': '/services/licenses/fssai-license',
        'FSSAI State License': '/services/licenses/fssai-license',
        'FSSAI Central License': '/services/licenses/fssai-central-license',
        'FSSAI Renewal': '/services/licenses/fssai-renewal',
        'Shop & Establishment License': '/services/licenses/shop-establishment-license',
        'Trade License': '/services/licenses/trade-license',
        'Labour License': '/services/licenses/labour-license',
        'Factory License': '/services/licenses/factory-license',
        'Drug License': '/services/licenses/drug-license',
        'Fire Safety NOC': '/services/licenses/fire-safety-noc',
        'Pollution Control NOC': '/services/licenses/pollution-control',
        'Import Export Code (IEC)': '/services/licenses/import-export-code',
        'Gumastha License': '/services/licenses/gumastha-license',
        'Bar & Liquor License': '/services/licenses/bar-liquor-license',

        // Tax & Compliance
        'GST Registration': '/services/gst-registration',
        'GST Monthly Return Filing': '/services/gst-monthly-return-filing',
        'GST Annual Return Filing': '/services/gst-annual-return',
        'GST Amendment': '/services/tax-compliance/gst-amendment',
        'GST Cancellation': '/services/tax-compliance/gst-cancellation',
        'GST Audit': '/services/tax-compliance/gst-audit',
        'Income Tax Return Filing': '/services/tax-compliance/income-tax-return',
        'TDS Return Filing': '/services/tax-compliance/tds-return-filing',
        'Professional Tax Registration': '/services/labour/professional-tax-registration',
        'Advance Tax Filing': '/services/tax-compliance/advance-tax',
        'Tax Audit': '/services/tax-compliance/tax-audit',

        // ROC
        'Business Name Change': '/services/roc-filing/company-name-change',
        'Add/Remove Director': '/services/roc-filing/add-remove-director',
        'Registered Office Change': '/services/roc-filing/change-registered-office',
        'Increase Authorized Capital': '/services/roc-filing/increase-authorized-capital',
        'Share Transfer': '/services/roc-filing/share-transfer',
        'MOA Amendment': '/services/roc-filing/moa-amendment',
        'AOA Amendment': '/services/roc-filing/aoa-amendment',
        'Director KYC': '/services/roc-filing/director-kyc',
        'Company Strike Off': '/services/roc-filing/strike-off-company',
        'Annual ROC Filing': '/services/roc-filing/annual-return',

        // Legal Drafting
        'Partnership Deed': '/services/legal-drafting/partnership-deed',
        'Founders Agreement': '/services/legal-drafting/founders-agreement',
        'Shareholders Agreement': '/services/legal-drafting/shareholders-agreement',
        'Employment Agreement': '/services/legal-drafting/employment-agreement',
        'Rent Agreement': '/services/legal-drafting/rent-agreement',
        'Franchise Agreement': '/services/legal-drafting/franchise-agreement',
        'Non-Disclosure Agreement (NDA)': '/services/legal-drafting/nda',
        'Vendor Agreement': '/services/legal-drafting/vendor-agreement',

        // Intellectual Property
        'Trademark Registration': '/services/intellectual-property/trademark-registration',
        'Trademark Objection': '/services/intellectual-property/trademark-objection',
        'Trademark Hearing': '/services/intellectual-property/trademark-hearing',
        'Trademark Renewal': '/services/intellectual-property/trademark-renewal',
        'Trademark Assignment': '/services/intellectual-property/trademark-assignment',
        'Copyright Registration': '/services/intellectual-property/copyright-registration',
        'Patent Filing': '/services/intellectual-property/patent-filing',
        'Patent Provisional': '/services/intellectual-property/patent-provisional',
        'Patent Complete': '/services/intellectual-property/patent-complete',
        'Design Registration': '/services/intellectual-property/design-registration',

        // Corrections
        'PAN Correction': '/services/corrections/pan-correction',
        'GST Correction': '/services/corrections/gst-correction',
        'FSSAI Correction': '/services/corrections/fssai-correction',
        'Company/LLP Master Data Correction': '/services/corrections/company-llp-correction',
        'DIN/DSC Correction': '/services/corrections/din-dsc-correction',

        // Business Closure
        'LLP Closure': '/services/business-closure/llp-closure',
        'Proprietorship Closure': '/services/business-closure/proprietorship-closure',
        'FSSAI Cancellation': '/services/business-closure/fssai-cancellation',

        // Financial Services
        'CMA Data Preparation': '/services/financial-services/cma-data-preparation',
        'Project Report': '/services/financial-services/project-report',
        'Bank Loan Documentation': '/services/financial-services/bank-loan-documentation',
        'Cash Flow Statement': '/services/financial-services/cash-flow-compliance',
        'Startup Pitch Deck': '/services/financial-services/startup-pitch-deck',
        'Business Valuation': '/services/financial-services/business-valuation',
        'Virtual CFO Services': '/services/financial-services/virtual-cfo'
    };

    const handleSelectService = (serviceName, categoryLabel) => {
        // ... (Logic remains same)
        const route = SERVICE_ROUTE_MAP[serviceName];
        if (route) window.location.href = route;
        else window.location.href = `/services/apply?name=${encodeURIComponent(serviceName)}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user')) || { id: 1 };
            await submitServiceRequest({ userId: user.id || 1, serviceName: selectedService.name, status: 'Pending', ...formData });
            setStep(3);
        } catch (err) { alert("Submission Failed: " + err.message); }
        finally { setLoading(false); }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
            {step === 1 && (
                <>
                    {/* Header Section */}
                    <div className="bg-white dark:bg-[#043E52] rounded-3xl p-8 border border-slate-100 dark:border-[#1C3540] shadow-sm text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ED6E3F]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3 relative z-10">Start a New Service</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 max-w-xl mx-auto relative z-10">Select from our comprehensive list of legal, tax, and compliance services to get started.</p>

                        <div className="max-w-2xl mx-auto relative z-10">
                            <div className="relative">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-[#1C3540] border border-slate-200 dark:border-[#2A4550] rounded-2xl py-4 pl-14 pr-6 shadow-sm focus:outline-none focus:border-[#ED6E3F] focus:ring-4 focus:ring-[#ED6E3F]/10 transition text-base text-slate-800 dark:text-white placeholder:text-slate-400"
                                    placeholder="Search for a service (e.g. GST, Private Limited, Trademark)..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Categories */}
                        <div className="lg:w-72 space-y-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Service Categories</h3>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => { setActiveCategory(cat.id); setSearchTerm(''); }}
                                    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all text-left ${activeCategory === cat.id && !searchTerm
                                        ? 'bg-[#043E52] dark:bg-white text-white dark:text-[#043E52] shadow-lg'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1C3540]'
                                        }`}
                                >
                                    <cat.icon size={18} className={activeCategory === cat.id && !searchTerm ? 'text-[#ED6E3F] dark:text-[#043E52]' : 'text-slate-400'} />
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className={`flex-1 ${!searchTerm ? 'bg-white dark:bg-[#043E52] p-6 rounded-3xl border border-slate-100 dark:border-[#1C3540]' : ''}`}>
                            {filteredServices.length > 0 ? (
                                <>
                                    {!searchTerm && <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><Briefcase className="text-[#ED6E3F]" size={20} /> {categories.find(c => c.id === activeCategory)?.label || 'Services'}</h3>}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filteredServices.map((srv, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => handleSelectService(srv.name, srv.category)}
                                                className="bg-slate-50 dark:bg-[#1C3540] p-5 rounded-2xl border border-slate-100 dark:border-[#2A4550] hover:border-[#ED6E3F] dark:hover:border-[#ED6E3F] hover:shadow-md cursor-pointer transition-all group flex items-start justify-between"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#043E52] text-[#043E52] dark:text-white flex items-center justify-center shrink-0 group-hover:bg-[#043E52] dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-[#043E52] transition-colors shadow-sm">
                                                        <Zap size={18} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-[#ED6E3F] transition-colors line-clamp-2">{srv.name}</h4>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{srv.category}</p>
                                                    </div>
                                                </div>
                                                <ArrowRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-[#ED6E3F] group-hover:translate-x-1 transition-all" />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-20">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-[#1C3540] rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <Search size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-700 dark:text-white">No services found</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Try searching for something else.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Step 2 & 3 would remain similar but wrapped in the new container style */}
            {step === 2 && selectedService && (
                <div className="bg-white dark:bg-[#043E52] p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-[#1C3540] max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#ED6E3F]/10 text-[#ED6E3F] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FileText size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Service Agreement</h2>
                        <p className="text-slate-500 dark:text-slate-400">You are applying for <span className="font-bold text-[#043E52] dark:text-white">{selectedService.name}</span></p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-slate-50 dark:bg-[#1C3540] p-4 rounded-xl text-sm text-slate-600 dark:text-slate-300 max-h-40 overflow-y-auto border border-slate-100 dark:border-[#2A4550]">
                            <h4 className="font-bold mb-2 text-[#043E52] dark:text-white">Terms & Conditions</h4>
                            <p className="mb-2">1. <strong>Service Scope:</strong> ShineFiling will provide professional assistance for the selected service. Government fees are subject to change.</p>
                            <p className="mb-2">2. <strong>Documents:</strong> You agree to provide accurate and authentic documents. ShineFiling is not responsible for rejection due to incorrect data.</p>
                            <p className="mb-2">3. <strong>Timeline:</strong> Estimated timelines are subject to government processing speeds.</p>
                            <p className="mb-2">4. <strong>Refund Policy:</strong> Processing fees are non-refundable once the application work has commenced.</p>
                            <p>5. <strong>Communication:</strong> You agree to receive updates via Email/SMS/WhatsApp regarding your application.</p>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    required
                                    className="w-4 h-4 text-[#ED6E3F] border-slate-300 rounded focus:ring-[#ED6E3F]"
                                />
                            </div>
                            <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400">
                                I have read and agree to the <span className="text-[#ED6E3F] font-bold cursor-pointer hover:underline">Terms and Conditions</span> stated above.
                            </label>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex-1 py-3.5 border border-slate-200 dark:border-[#2A4550] text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-[#1C3540] transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3.5 bg-[#043E52] dark:bg-[#ED6E3F] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader className="animate-spin" size={20} /> : <>Confirm & Apply <ArrowRight size={18} /></>}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {step === 3 && (
                <div className="text-center py-20 bg-white dark:bg-[#043E52] rounded-3xl shadow-xl border border-slate-100 dark:border-[#1C3540] max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Application Submitted!</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">Your request for <strong>{selectedService?.name}</strong> has been received. Our team will contact you shortly.</p>
                    <button onClick={() => setActiveTab('orders')} className="bg-[#043E52] dark:bg-[#ED6E3F] text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">Track Application Status</button>
                </div>
            )}
        </div>
    );
};

export default NewFiling;
