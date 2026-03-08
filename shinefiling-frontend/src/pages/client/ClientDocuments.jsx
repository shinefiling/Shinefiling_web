import React, { useState, useEffect } from 'react';
import { Folder, FileText, Download, Upload, Search, Filter, MoreVertical, Shield, FileCheck, Loader2, X, CheckCircle } from 'lucide-react';
import { getUserApplications, getUserDocuments, uploadUserDocument } from '../../api';

const ClientDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    // Upload Modal State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadCategory, setUploadCategory] = useState('kyc');
    const [uploadName, setUploadName] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.email) return;

                // Fetch both applications (service docs) and direct documents (vault)
                const [applications, directDocs] = await Promise.all([
                    getUserApplications(user.email),
                    getUserDocuments(user.email)
                ]);

                const allDocs = [];

                // 1. Process Service Documents (from Applications)
                if (applications) {
                    applications.forEach(app => {
                        // Standard Arrays
                        if (Array.isArray(app.documents)) {
                            app.documents.forEach(doc => {
                                const type = (doc.filename || doc.name || '').split('.').pop().toUpperCase() || 'FILE';
                                allDocs.push({
                                    id: doc.id || `doc-${Math.random()}`,
                                    name: doc.filename || doc.name || 'Untitled Document',
                                    type: type,
                                    size: '---',
                                    date: new Date(app.createdAt).toLocaleDateString(),
                                    category: 'incorporation', // Assume service docs are incorporation related mainly
                                    url: doc.fileUrl,
                                    source: 'Service',
                                    isGenerated: false
                                });
                            });
                        }

                        // Generated Certificates (Mock simulation)
                        if (app.status === 'Completed') {
                            allDocs.push({
                                id: `GEN-${app.id}`,
                                name: `${app.serviceName || 'Service'} - Completion Certificate`,
                                type: 'PDF',
                                size: '1.2 MB',
                                date: new Date().toLocaleDateString(),
                                category: 'incorporation',
                                url: '#',
                                source: 'System',
                                isGenerated: true
                            });
                        }
                    });
                }

                // 2. Process Direct Documents (Vault/Digilocker uploads)
                if (Array.isArray(directDocs)) {
                    directDocs.forEach(doc => {
                        const type = (doc.filename || doc.name || '').split('.').pop().toUpperCase() || 'FILE';
                        allDocs.push({
                            id: doc.id || `vault-${Math.random()}`,
                            name: doc.name || doc.filename || 'Vault Document',
                            type: type,
                            size: doc.size || '---',
                            date: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Just now',
                            category: doc.category || 'others',
                            url: doc.fileUrl,
                            source: 'Vault',
                            isGenerated: false
                        });
                    });
                }

                setDocuments(allDocs);
            } catch (error) {
                console.error("Failed to load documents", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [isUploadModalOpen]); // Re-fetch when upload modal closes (success)

    const filteredDocs = documents.filter(doc => {
        const matchesFilter = filter === 'all' || doc.category === filter;
        const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleDownload = (doc) => {
        if (doc.url && doc.url !== '#') {
            window.open(doc.url, '_blank');
        } else {
            alert("Document preview not available.");
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setUploadFile(e.dataTransfer.files[0]);
            setUploadName(e.dataTransfer.files[0].name.split('.')[0]); // Auto-fill name
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUploadFile(e.target.files[0]);
            setUploadName(e.target.files[0].name.split('.')[0]);
        }
    };

    const submitUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile) return;

        setIsUploading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.email) {
                await uploadUserDocument(user.email, uploadFile, uploadCategory, uploadName);
                setIsUploadModalOpen(false);
                setUploadFile(null);
                setUploadName('');
                // Data refresh triggered by useEffect dependency
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload document");
        } finally {
            setIsUploading(false);
        }
    };



    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-[#043E52] dark:text-white">Document Vault</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Secure, encrypted storage for your business files.</p>
                </div>
                <button onClick={() => setIsUploadModalOpen(true)} className="px-6 py-3 bg-[#ED6E3F] hover:bg-[#A57753] text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2">
                    <Upload size={18} /> Upload New
                </button>
            </div>

            {/* Digital Document Wallet (Quick Access) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: 'Aadhaar Card', sub: 'Unique Identification Authority', color: 'bg-red-50 text-red-600', border: 'border-red-100', icon: 'Fingerprint' },
                    { title: 'PAN Card', sub: 'Income Tax Department', color: 'bg-blue-50 text-blue-600', border: 'border-blue-100', icon: 'CreditCard' },
                    { title: 'Driving License', sub: 'Ministry of Road Transport', color: 'bg-green-50 text-green-600', border: 'border-green-100', icon: 'Car' },
                    { title: 'Voter ID', sub: 'Election Commission of India', color: 'bg-orange-50 text-orange-600', border: 'border-orange-100', icon: 'Vote' },
                ].map((item, idx) => (
                    <div key={idx} className={`bg-white dark:bg-[#043E52] p-4 rounded-xl border ${item.border} dark:border-[#2A4550] shadow-sm hover:shadow-md transition-all cursor-pointer group`}>
                        <div className="flex justify-between items-start mb-3">
                            <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                                {/* Simple Text Icon Fallback since generic icon logic is complex here without imports */}
                                {idx === 0 ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg> :
                                    idx === 1 ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> :
                                        idx === 2 ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg> :
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            </div>
                            <span className="bg-gray-100 dark:bg-black/20 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded">ADD</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-sm">{item.title}</h4>
                            <p className="text-[10px] text-slate-400 font-medium group-hover:text-[#ED6E3F] transition-colors">{item.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Storage Stats (Static Visuals for now, can be made dynamic later) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#043E52] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#ED6E3F]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-white/10 rounded-xl"><Folder size={24} className="text-[#ED6E3F]" /></div>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">Safe & Secure</span>
                    </div>
                    <h3 className="text-4xl font-bold tracking-tight">{documents.length}<span className="text-xl text-white/50"> Files</span></h3>
                    <p className="text-white/60 text-xs mt-1">Total Uploaded Documents</p>
                    <div className="mt-6 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#ED6E3F] w-[45%] rounded-full shadow-[0_0_10px_rgba(181,136,99,0.5)]"></div>
                    </div>
                </div>

                <div className="col-span-2 bg-white dark:bg-[#043E52] border border-slate-100 dark:border-[#1C3540] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-full text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#043E52] dark:text-white text-lg">Encrypted & Secure</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Your documents are protected with enterprise-grade AES-256 encryption.</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Filter</p>
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {['all', 'incorporation', 'tax', 'legal', 'kyc'].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setFilter(tag)}
                                    className={`px-4 py-2 ${filter === tag ? 'bg-[#043E52] text-white dark:bg-white dark:text-[#043E52]' : 'bg-slate-50 dark:bg-[#1C3540] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2A4550]'} text-xs font-bold rounded-xl whitespace-nowrap transition capitalize`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Document List */}
            <div className="bg-white dark:bg-[#043E52] border border-slate-100 dark:border-[#1C3540] rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
                {/* Toolbar */}
                <div className="p-5 border-b border-slate-100 dark:border-[#1C3540] flex items-center gap-4 bg-[#FDFBF7] dark:bg-[#043E52]">
                    <div className="relative flex-1 max-w-md">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search documents by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-[#1C3540] border border-slate-200 dark:border-[#2A4550] rounded-xl text-sm font-medium text-slate-700 dark:text-white focus:ring-4 focus:ring-[#ED6E3F]/10 focus:border-[#ED6E3F] outline-none transition"
                        />
                    </div>
                    <div className="hidden md:flex ml-auto text-slate-400 text-xs font-bold items-center gap-2">
                        <FileCheck size={14} /> {filteredDocs.length} Documents
                    </div>
                </div>

                {/* List */}
                <div className="divide-y divide-slate-50 dark:divide-[#1C3540]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                            <Loader2 size={32} className="animate-spin mb-4" />
                            <p className="text-sm font-medium">Fetching your secure documents...</p>
                        </div>
                    ) : filteredDocs.length > 0 ? (
                        filteredDocs.map((doc) => (
                            <div key={doc.id} className="p-5 flex items-center justify-between hover:bg-[#F9FAFB] dark:hover:bg-[#152a33] transition group cursor-pointer">
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${doc.source === 'Vault' ? 'bg-[#ED6E3F]/10 text-[#ED6E3F]' : 'bg-indigo-50 dark:bg-[#1C3540] text-indigo-600 dark:text-indigo-400'}`}>
                                        <FileText size={22} />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-[#043E52] dark:text-white group-hover:text-[#ED6E3F] transition">{doc.name}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide bg-slate-100 dark:bg-[#1C3540] px-2 py-0.5 rounded">{doc.type}</span>
                                            <span className="text-[10px] font-medium text-slate-400">• {doc.size}</span>
                                            <span className="text-[10px] font-medium text-slate-400">• {doc.date}</span>
                                            {doc.isGenerated && <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-bold">Certificate</span>}
                                            {doc.source === 'Vault' && <span className="text-[10px] bg-[#ED6E3F]/10 text-[#ED6E3F] px-2 py-0.5 rounded font-bold">Vault Upload</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDownload(doc)} className="p-2.5 bg-white dark:bg-[#043E52] border border-slate-200 dark:border-[#1C3540] rounded-lg text-slate-500 hover:text-[#ED6E3F] hover:border-[#ED6E3F] transition shadow-sm" title="Download">
                                        <Download size={18} />
                                    </button>
                                    <button className="p-2.5 bg-white dark:bg-[#043E52] border border-slate-200 dark:border-[#1C3540] rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:border-slate-300 transition shadow-sm">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-[#1C3540] rounded-full flex items-center justify-center mb-4 text-slate-300">
                                <Search size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">No documents found</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Try adjusting your search query.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
                    onClick={() => setIsUploadModalOpen(false)}
                >
                    <div
                        className="bg-white dark:bg-[#043E52] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-slate-100 dark:border-[#1C3540] flex justify-between items-center">
                            <h3 className="text-xl font-bold text-[#043E52] dark:text-white">Upload Document</h3>
                            <button onClick={() => setIsUploadModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-[#1C3540] rounded-full text-slate-500 transition">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Drag & Drop Area */}
                            <div
                                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${dragActive ? 'border-[#ED6E3F] bg-[#ED6E3F]/5' : 'border-slate-200 dark:border-[#1C3540] hover:border-[#ED6E3F]/50'}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <div className="w-16 h-16 bg-slate-50 dark:bg-[#1C3540] rounded-full flex items-center justify-center mx-auto mb-4 text-[#ED6E3F]">
                                    <Upload size={28} />
                                </div>
                                {uploadFile ? (
                                    <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold">
                                        <CheckCircle size={18} />
                                        <span>{uploadFile.name}</span>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-slate-800 dark:text-white font-bold text-sm">Click to upload or drag and drop</p>
                                        <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG or DOCX (MAX. 5MB)</p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileSelect}
                                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                                />
                            </div>

                            {/* Metadata Inputs */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Document Name</label>
                                <input
                                    type="text"
                                    value={uploadName}
                                    onChange={(e) => setUploadName(e.target.value)}
                                    placeholder="e.g. Aadhar Card Front"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1C3540] border border-slate-200 dark:border-[#2A4550] rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#ED6E3F] outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Category</label>
                                <select
                                    value={uploadCategory}
                                    onChange={(e) => setUploadCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1C3540] border border-slate-200 dark:border-[#2A4550] rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#ED6E3F] outline-none transition"
                                >
                                    <option value="kyc">KYC Document</option>
                                    <option value="incorporation">Incorporation</option>
                                    <option value="legal">Legal / Agreements</option>
                                    <option value="tax">Tax / GST</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 dark:border-[#1C3540] flex justify-end gap-3 bg-slate-50 dark:bg-[#043E52]">
                            <button onClick={() => setIsUploadModalOpen(false)} className="px-5 py-2.5 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-[#1C3540] rounded-xl transition">
                                Cancel
                            </button>
                            <button
                                onClick={submitUpload}
                                disabled={!uploadFile || isUploading}
                                className="px-6 py-2.5 bg-[#ED6E3F] hover:bg-[#A57753] text-white font-bold text-sm rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isUploading ? <Loader2 size={16} className="animate-spin" /> : 'Upload Document'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientDocuments;
