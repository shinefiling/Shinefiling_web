import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Upload, AlertTriangle, FileText, ArrowRight, CreditCard, Factory, Droplets, MapPin } from 'lucide-react';
import { uploadFile, submitPollutionControl } from '../../../api'; // ensure in api.js

const ApplyPollutionControl = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const plan = searchParams.get('plan') || 'cte'; // cte, cto

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadingFiles, setUploadingFiles] = useState({});

    // User data form local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        userEmail: user.email || '',
        industryName: '',
        state: '',
        businessCategory: '', // RED, ORANGE, GREEN, WHITE
        certificateType: plan.toUpperCase() === 'CTO' ? 'CTO' : 'CTE',

        // Form Data
        industryActivity: '', // e.g., Chemical
        address: '',
        investmentAmount: '',
        dailyWaterConsumption: '',
        dailyEffluentDischarge: '',

        // Enviro Details
        hasEtpStp: false,
        hasAirPollutionControl: false,
        generatesHazardousWaste: false,

        // Docs
        uploadedDocuments: []
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/licenses/pollution-control/apply?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, plan]);

    // Auto-categorize based on industry activity (Simulated)
    const handleActivityChange = (e) => {
        const val = e.target.value;
        let cat = 'GREEN';
        if (val.toLowerCase().includes('chemical') || val.toLowerCase().includes('pharma') || val.toLowerCase().includes('dye')) cat = 'RED';
        else if (val.toLowerCase().includes('food') || val.toLowerCase().includes('hotel')) cat = 'ORANGE';
        else if (val.toLowerCase().includes('solar') || val.toLowerCase().includes('assembly')) cat = 'WHITE';

        setFormData(prev => ({ ...prev, industryActivity: val, businessCategory: cat }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileChange = async (docType, e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadingFiles(prev => ({ ...prev, [docType]: true }));

            try {
                const response = await uploadFile(file, 'pollution-control');
                if (response && response.fileUrl) {
                    setFormData(prev => ({
                        ...prev,
                        uploadedDocuments: [
                            ...prev.uploadedDocuments.filter(d => d.id !== docType),
                            {
                                id: docType,
                                type: docType,
                                filename: response.originalName || file.name,
                                fileUrl: response.fileUrl
                            }
                        ]
                    }));
                } else {
                    alert('Upload failed. Please try again.');
                }
            } catch (error) {
                console.error("File upload error:", error);
                alert('Error uploading file.');
            } finally {
                setUploadingFiles(prev => ({ ...prev, [docType]: false }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                submissionId: `PCB-${Date.now()}`,
                userEmail: formData.userEmail,
                industryName: formData.industryName,
                state: formData.state,
                businessCategory: formData.businessCategory,
                certificateType: formData.certificateType,
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    industryActivity: formData.industryActivity,
                    address: formData.address,
                    investmentAmount: parseFloat(formData.investmentAmount),
                    dailyWaterConsumption: parseFloat(formData.dailyWaterConsumption),
                    dailyEffluentDischarge: parseFloat(formData.dailyEffluentDischarge),
                    hasEtpStp: formData.hasEtpStp,
                    hasAirPollutionControl: formData.hasAirPollutionControl,
                    generatesHazardousWaste: formData.generatesHazardousWaste
                },
                documents: formData.uploadedDocuments
            };

            await submitPollutionControl(payload);
            setCurrentStep(3); // Success
        } catch (err) {
            setError(err.message || 'Submission failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0FDF4] font-sans pt-24 pb-24">
            {/* Header */}
            <div className="bg-[#2B3446] text-white py-6 px-6 shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-300 hover:text-white transition">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2"><Factory size={20} className="text-green-400" /> Pollution Control Board Application</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 mt-12">
                {/* Progress */}
                <div className="mb-8 flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10"></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= s ? 'bg-[#2B3446] text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                            {s}
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">

                    {currentStep === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Industry Details</h2>
                            <p className="text-slate-500 mb-8">Enter business activity to determine category.</p>

                            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }} className="space-y-6">

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Industry Name</label>
                                        <input type="text" name="industryName" value={formData.industryName} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Primary Activity</label>
                                        <input type="text" name="industryActivity" value={formData.industryActivity} onChange={handleActivityChange} placeholder="e.g. Chemical Manufacturing" required className="w-full p-3 border border-slate-300 rounded-lg" />
                                        {formData.businessCategory && (
                                            <span className={`text-xs font-bold mt-1 block uppercase ${formData.businessCategory === 'RED' ? 'text-red-500' :
                                                    formData.businessCategory === 'ORANGE' ? 'text-orange-500' :
                                                        'text-green-500'
                                                }`}>
                                                Category: {formData.businessCategory}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Application Type</label>
                                        <select name="certificateType" value={formData.certificateType} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="CTE">CTE (Establish)</option>
                                            <option value="CTO">CTO (Operate)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">State</label>
                                        <select name="state" value={formData.state} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="">Select State</option>
                                            <option value="Maharashtra">Maharashtra (MPCB)</option>
                                            <option value="Karnataka">Karnataka (KSPCB)</option>
                                            <option value="Delhi">Delhi (DPCC)</option>
                                            <option value="Gujarat">Gujarat (GPCB)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><MapPin size={16} /> Site Address</label>
                                    <textarea name="address" rows="2" value={formData.address} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange}></textarea>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Investment (Cr)</label>
                                        <input type="number" step="0.01" name="investmentAmount" value={formData.investmentAmount} required className="w-full p-3 border border-slate-300 rounded-lg" placeholder="Crores" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Water Req (KLD)</label>
                                        <input type="number" step="0.1" name="dailyWaterConsumption" value={formData.dailyWaterConsumption} required className="w-full p-3 border border-slate-300 rounded-lg" placeholder="Daily KLD" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Effluent (KLD)</label>
                                        <input type="number" step="0.1" name="dailyEffluentDischarge" value={formData.dailyEffluentDischarge} required className="w-full p-3 border border-slate-300 rounded-lg" placeholder="Discharge" onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="w-full py-4 bg-[#2B3446] text-white font-bold rounded-xl shadow-lg hover:bg-black transition flex items-center justify-center gap-2">
                                        Next Step <ArrowRight size={18} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Environmental Compliance</h2>
                            <p className="text-slate-500 mb-8">Declare pollution control measures.</p>

                            <div className="bg-green-50 p-6 rounded-xl border border-green-100 mb-8">
                                <h3 className="font-bold text-green-800 mb-4 text-sm uppercase tracking-wide flex items-center gap-2"><Droplets size={16} /> Control Measures</h3>
                                <div className="space-y-4">
                                    {[
                                        { key: 'hasEtpStp', label: 'Effluent / Sewage Treatment Plant (ETP/STP) Installed?', desc: 'Mandatory for Red/Orange categories.' },
                                        { key: 'hasAirPollutionControl', label: 'Air Pollution Control Devices (Scrubbers/Filters)?', desc: 'Required if emissions present.' },
                                        { key: 'generatesHazardousWaste', label: 'Does unit generate Hazardous Waste?', desc: 'Requires Form-1 Authorization.' }
                                    ].map((item) => (
                                        <label key={item.key} className="flex items-start gap-3 cursor-pointer p-2 hover:bg-green-100 rounded-lg transition">
                                            <input type="checkbox" name={item.key} checked={formData[item.key]} onChange={handleChange} className="w-5 h-5 text-green-600 rounded mt-1" />
                                            <div>
                                                <span className="text-slate-800 font-bold block">{item.label}</span>
                                                <span className="text-xs text-slate-500">{item.desc}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                {[
                                    { id: 'SITE_PLAN', label: 'Site Plan / Layout Map' },
                                    { id: 'PROCESS_FLOW', label: 'Manufacturing Process Flow Chart' },
                                    { id: 'CA_CERT', label: 'CA Certificate for Capital Investment' },
                                    { id: 'LAND_DOCS', label: 'Land Ownership / Rent Agreement' }
                                ].map((doc, i) => {
                                    const uploadedDoc = formData.uploadedDocuments.find(d => d.type === doc.id);
                                    return (
                                        <div key={i} className={`flex items-center justify-between p-4 border rounded-xl transition-all ${uploadedDoc ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg border ${uploadedDoc ? 'bg-white border-green-200 text-green-600 shadow-sm' : 'bg-white border-slate-200 text-slate-400'}`}>
                                                    {uploadedDoc ? <CheckCircle size={20} /> : <FileText size={20} />}
                                                </div>
                                                <div>
                                                    <span className={`font-bold text-sm block ${uploadedDoc ? 'text-green-800' : 'text-slate-700'}`}>{doc.label}</span>
                                                    {uploadingFiles[doc.id] ? (
                                                        <span className="text-xs text-blue-600 font-medium animate-pulse">Uploading...</span>
                                                    ) : uploadedDoc ? (
                                                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">Attached</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <label className={`cursor-pointer text-sm font-bold px-4 py-2 rounded-lg transition-all ${uploadingFiles[doc.id] ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-500' : uploadedDoc ? 'text-green-700 bg-green-100 hover:bg-green-200' : 'text-orange-600 bg-orange-50 hover:bg-orange-100'}`}>
                                                {uploadingFiles[doc.id] ? '...' : uploadedDoc ? 'Change' : 'Upload'}
                                                <input type="file" className="hidden" disabled={uploadingFiles[doc.id]} onChange={(e) => handleFileChange(doc.id, e)} />
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>

                            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm mb-6 border border-red-200 flex items-center gap-2"><AlertTriangle size={18} /> {error}</div>}

                            <div className="flex gap-4">
                                <button onClick={() => setCurrentStep(1)} className="flex-1 py-4 bg-white border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition">
                                    Back
                                </button>
                                <button onClick={handleSubmit} disabled={loading} className="flex-1 py-4 bg-[#2B3446] text-white font-bold rounded-xl shadow-lg hover:bg-black transition flex justify-center items-center">
                                    {loading ? 'Processing...' : 'Submit Assessment'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-[#2B3446] mb-4">Application Submitted!</h2>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                We have received your request for <strong>{formData.industryName}</strong>. Our environmental engineer will review your categorization.
                            </p>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 max-w-xs mx-auto">
                                <p className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-bold">Estimated Cost</p>
                                <p className="text-4xl font-black text-[#2B3446]">
                                    {formData.businessCategory === 'RED' ? '₹24,999' : formData.businessCategory === 'WHITE' ? '₹4,999' : '₹14,999'}
                                    <span className="text-sm font-normal text-slate-400 block">+ Govt Challan</span>
                                </p>
                            </div>

                            <button onClick={() => navigate('/dashboard')} className="w-full max-w-xs py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2 mx-auto">
                                <CreditCard size={18} /> Proceed to Dashboard
                            </button>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ApplyPollutionControl;
