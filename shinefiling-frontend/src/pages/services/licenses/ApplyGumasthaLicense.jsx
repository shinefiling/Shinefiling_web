import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Upload, AlertTriangle, FileText, ArrowRight, CreditCard, Store, MapPin } from 'lucide-react';
import { uploadFile, submitGumasthaLicense } from '../../../api'; // ensure in api.js

const ApplyGumasthaLicense = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadingFiles, setUploadingFiles] = useState({});

    // User data form local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        userEmail: user.email || '',
        establishmentName: '',
        city: 'Mumbai',
        establishmentType: 'SHOP', // SHOP, COMMERCIAL, RESIDENTIAL_HOTEL

        // Form Data
        ownerName: '',
        natureOfBusiness: '',
        address: '',
        numberOfEmployees: 0,
        isRented: false,

        // Docs
        uploadedDocuments: []
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/licenses/gumastha-license/apply` } });
        }
    }, [isLoggedIn, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileChange = async (docType, e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadingFiles(prev => ({ ...prev, [docType]: true }));

            try {
                const response = await uploadFile(file, 'gumastha');
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
                submissionId: `GUM-${Date.now()}`,
                userEmail: formData.userEmail,
                establishmentName: formData.establishmentName,
                city: formData.city,
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    ownerName: formData.ownerName,
                    establishmentType: formData.establishmentType,
                    natureOfBusiness: formData.natureOfBusiness,
                    address: formData.address,
                    numberOfEmployees: parseInt(formData.numberOfEmployees),
                    isRented: formData.isRented
                },
                documents: formData.uploadedDocuments
            };

            await submitGumasthaLicense(payload);
            setCurrentStep(3); // Success
        } catch (err) {
            setError(err.message || 'Submission failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF7ED] font-sans pt-24 pb-24">
            {/* Header */}
            <div className="bg-[#2B3446] text-white py-6 px-6 shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-300 hover:text-white transition">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2"><Store size={20} className="text-orange-400" /> Gumastha License Application</h1>
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
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Business Details</h2>
                            <p className="text-slate-500 mb-8">Establishment and Ownership information.</p>

                            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }} className="space-y-6">

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Shop / Establishment Name</label>
                                        <input type="text" name="establishmentName" value={formData.establishmentName} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">City / Municipality</label>
                                        <select name="city" value={formData.city} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="Mumbai">Mumbai (MCGM)</option>
                                            <option value="Pune">Pune (PMC)</option>
                                            <option value="Nagpur">Nagpur</option>
                                            <option value="Thane">Thane</option>
                                            <option value="Other">Other Municipality</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Owner Name</label>
                                        <input type="text" name="ownerName" value={formData.ownerName} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Establishment Category</label>
                                        <select name="establishmentType" value={formData.establishmentType} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="SHOP">Shop</option>
                                            <option value="COMMERCIAL">Commercial Establishment</option>
                                            <option value="RESIDENTIAL_HOTEL">Residential Hotel</option>
                                            <option value="THEATRE">Theatre / Public Amusement</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Address with Pincode</label>
                                    <textarea name="address" rows="2" value={formData.address} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange}></textarea>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Total Employees</label>
                                        <input type="number" name="numberOfEmployees" value={formData.numberOfEmployees} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} min="0" />
                                        {parseInt(formData.numberOfEmployees) > 9 ? (
                                            <span className="text-xs text-orange-600 font-bold mt-1 block">Requires Form F (Registration)</span>
                                        ) : (
                                            <span className="text-xs text-green-600 font-bold mt-1 block">Requires Intimation Only</span>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Nature of Business</label>
                                        <input type="text" name="natureOfBusiness" value={formData.natureOfBusiness} placeholder="e.g. Grocery Store" required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
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
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Property & Docs</h2>
                            <p className="text-slate-500 mb-8">Upload proofs for owner and premises.</p>

                            <div className="mb-6">
                                <label className="flex items-center gap-3 cursor-pointer p-4 border border-orange-200 rounded-xl bg-orange-50 hover:bg-orange-100 transition">
                                    <input type="checkbox" name="isRented" checked={formData.isRented} onChange={handleChange} className="w-5 h-5 text-orange-600 rounded" />
                                    <div>
                                        <span className="text-slate-800 font-bold block">Is the premise Rented?</span>
                                        <span className="text-xs text-slate-500">If yes, Rent Agreement & NOC is mandatory.</span>
                                    </div>
                                </label>
                            </div>

                            <div className="space-y-4 mb-8">
                                {[
                                    { id: 'OWNER_PHOTO', label: 'Owner Photo (Passport Size)' },
                                    { id: 'AADHAAR_CARD', label: 'Owner Aadhaar / PAN' },
                                    { id: 'LIGHT_BILL', label: 'Electricity Bill (Premises)' },
                                    ...(formData.isRented ? [
                                        { id: 'RENT_AGREEMENT', label: 'Rent Agreement' },
                                        { id: 'OWNER_NOC', label: 'NOC from Owner' }
                                    ] : [])
                                ].map((doc, i) => {
                                    const uploadedDoc = formData.uploadedDocuments.find(d => d.type === doc.id);
                                    return (
                                        <div key={i} className={`flex items-center justify-between p-4 border rounded-xl transition-all ${uploadedDoc ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg border ${uploadedDoc ? 'bg-white border-orange-200 text-orange-600 shadow-sm' : 'bg-white border-slate-200 text-slate-400'}`}>
                                                    {uploadedDoc ? <CheckCircle size={20} /> : <FileText size={20} />}
                                                </div>
                                                <div>
                                                    <span className={`font-bold text-sm block ${uploadedDoc ? 'text-orange-800' : 'text-slate-700'}`}>{doc.label}</span>
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
                            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-[#2B3446] mb-4">Application Submitted!</h2>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                We have received your request for <strong>{formData.establishmentName}</strong>. Our team will file it with <strong>{formData.city} Corporation</strong>.
                            </p>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 max-w-xs mx-auto">
                                <p className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-bold">Total Fees</p>
                                <p className="text-4xl font-black text-[#2B3446]">₹1,499<span className="text-sm font-normal text-slate-400 block">+ Govt Challan</span></p>
                            </div>

                            <button onClick={() => navigate('/dashboard')} className="w-full max-w-xs py-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 transition flex items-center justify-center gap-2 mx-auto">
                                <CreditCard size={18} /> Proceed to Dashboard
                            </button>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ApplyGumasthaLicense;
