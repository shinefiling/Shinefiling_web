import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Upload, CheckCircle, AlertCircle, ArrowRight, Loader2,
    Shield, Briefcase, User, MapPin, Grid, CheckSquare
} from 'lucide-react';
import axios from 'axios';

// API Base URL (adjust if needed, usually passed via config or context)
import { BASE_URL, uploadFile } from '../../../api';

// API Base URL
const API_URL = `${BASE_URL}/fssai`;

const FssaiApplication = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialPlan = searchParams.get('plan') || 'basic';

    // User Context (Mocking extraction from localStorage for this step)
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [currentStep, setCurrentStep] = useState(1); // 1: Details, 2: Uploads, 3: Success
    const [orderId, setOrderId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        businessName: '',
        constitution: '', // renamed from businessType
        kindOfBusiness: '',
        foodCategory: '',
        years: '1',
        addressLine1: '',
        addressLine2: '',
        state: '',
        city: '',
        pincode: '',
        ownerName: '',
        panNumber: '',
        email: user.email || '',
        phone: user.phone || ''
    });

    // File Uploads State
    const [files, setFiles] = useState({
        aadhaar: null,
        photo: null,
        addressProof: null,
        constitutionDocs: null,
        other: null
    });

    // Upload Progress
    const [uploadStatus, setUploadStatus] = useState({});

    useEffect(() => {
        if (!user.email) navigate('/login');
    }, [user, navigate]);

    // Plan Prices
    const PRICES = {
        'BASIC': 999,
        'STANDARD': 1999,
        'PREMIUM': 2999,
        'STATE': 3999,
        'CENTRAL': 5999,
        'RENEWAL': 999
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // --- STEP 1: SAVE DRAFT & NEXT ---
    const handleCreateOrder = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Create Payload matching Backend DTO (FssaiRegistrationRequest)
            const payload = {
                userEmail: user.email,
                status: 'DRAFT',
                formData: {
                    businessName: formData.businessName,
                    licenseType: initialPlan.toUpperCase(),
                    numberOfYears: parseInt(formData.years),
                    constitution: formData.constitution,
                    kindOfBusiness: formData.kindOfBusiness,
                    foodCategory: formData.foodCategory,
                    addressLine1: formData.addressLine1,
                    addressLine2: formData.addressLine2,
                    state: formData.state,
                    district: formData.city,
                    pincode: formData.pincode,
                    applicantName: formData.ownerName,
                    applicantEmail: formData.email,
                    applicantPhone: formData.phone,
                    applicantPan: formData.panNumber
                }
            };

            // Create "Draft" Order in Backend
            const res = await axios.post(`${API_URL}/submit`, payload);

            // Backend should return submissionId even for drafts
            setOrderId(res.data.submissionId);
            setCurrentStep(2);

        } catch (err) {
            console.error(err);
            alert("Failed to save details. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- STEP 2: UPLOAD DOCS ---
    const handleFileUpload = async (type, file) => {
        if (!file) return;

        setUploadStatus(prev => ({ ...prev, [type]: 'uploading' }));

        try {
            // 1. Upload to Server (Centralized Storage)
            const uploadRes = await uploadFile(file, 'fssai_docs');
            const fileUrl = uploadRes.fileUrl;

            // 2. Link Document to FSSAI Application
            await axios.post(`${API_URL}/${orderId}/document`, {
                type: type,
                fileUrl: fileUrl
            });

            setUploadStatus(prev => ({ ...prev, [type]: 'done' }));
            setFiles(prev => ({ ...prev, [type]: file }));
        } catch (err) {
            console.error(err);
            setUploadStatus(prev => ({ ...prev, [type]: 'error' }));
            alert(`Failed to upload ${type}. Please try again.`);
        }
    };

    const handlePaymentAndSubmit = async () => {
        // Validation
        if (!files.aadhaar || !files.photo || !files.addressProof) {
            alert("Please upload all required documents.");
            return;
        }

        setIsLoading(true);
        try {
            // 1. Load Razorpay
            const res = await loadRazorpay();
            if (!res) { alert('Razorpay failed to load'); return; }

            // 2. Create Payment Order
            const planKey = initialPlan.toUpperCase();
            const amount = PRICES[planKey] || 999;
            const paymentRes = await axios.post(`${BASE_URL}/payment/create-order`, { amount });
            const paymentData = typeof paymentRes.data === 'string' ? JSON.parse(paymentRes.data) : paymentRes.data;

            // 3. Open Razorpay
            const options = {
                key: "rzp_test_v9bZpQvmrVnUzZ",
                amount: paymentData.amount,
                currency: "INR",
                name: "ShineFiling",
                description: `FSSAI Registration - ${initialPlan} Plan`,
                order_id: paymentData.id,
                handler: async function (response) {
                    // 4. On Success -> Complete Backend Order
                    try {
                        await axios.post(`${API_URL}/${orderId}/complete-payment`, {
                            paymentId: response.razorpay_payment_id,
                            amount: amount
                        });
                        setCurrentStep(3);
                    } catch (postPayErr) {
                        console.error(postPayErr);
                        alert("Payment noted, but final submission failed. Please contact support.");
                    }
                },
                prefill: {
                    name: formData.ownerName,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: { color: "#1E293B" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err);
            alert("Payment initialization failed");
        } finally {
            setIsLoading(false);
        }
    };

    // --- RENDER HELPERS ---

    const FileUploadField = ({ label, type, required }) => (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="font-bold text-[#1E293B] flex items-center gap-2">
                        {label} {required && <span className="text-red-500">*</span>}
                    </h4>
                    <p className="text-xs text-slate-500">JPG, PNG or PDF (Max 5MB)</p>
                </div>
                {uploadStatus[type] === 'done' ? (
                    <CheckCircle className="text-green-500" size={24} />
                ) : uploadStatus[type] === 'uploading' ? (
                    <Loader2 className="animate-spin text-blue-500" size={24} />
                ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
                )}
            </div>

            <input
                type="file"
                onChange={(e) => handleFileUpload(type, e.target.files[0])}
                className="w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-xs file:font-semibold
                    file:bg-slate-100 file:text-slate-700
                    hover:file:bg-slate-200 cursor-pointer"
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-32 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-black text-[#1E293B] mb-2">FSSAI Registration Application</h1>
                    <p className="text-slate-500 text-lg">Plan Selected: <span className="font-bold text-yellow-600 uppercase">{initialPlan.replace('_', ' ')}</span></p>
                </div>

                {/* Steps Indicator */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center gap-4">
                        {[1, 2, 3].map((step) => (
                            <React.Fragment key={step}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step === currentStep ? 'bg-[#1E293B] text-white shadow-lg' :
                                    step < currentStep ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'
                                    }`}>
                                    {step < currentStep ? <CheckCircle size={18} /> : step}
                                </div>
                                {step < 3 && <div className={`w-16 h-1 rounded-full ${step < currentStep ? 'bg-green-500' : 'bg-slate-200'}`} />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* STEP 1: DETAILS */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100"
                        >
                            <h2 className="text-xl font-bold text-[#1E293B] mb-6 flex items-center gap-2">
                                <FileText size={20} className="text-yellow-500" /> Business Details
                            </h2>
                            <form onSubmit={handleCreateOrder} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition"
                                            placeholder="Ex: My Food Company"
                                            value={formData.businessName}
                                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Business Constitution</label>
                                        <select
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition"
                                            value={formData.constitution}
                                            onChange={(e) => setFormData({ ...formData, constitution: e.target.value })}
                                        >
                                            <option value="">Select Constitution</option>
                                            <option value="Proprietorship">Proprietorship</option>
                                            <option value="Partnership">Partnership Firm</option>
                                            <option value="LLP">Limited Liability Partnership (LLP)</option>
                                            <option value="Pvt Ltd">Private Limited Company</option>
                                            <option value="Public Ltd">Public Limited Company</option>
                                            <option value="NGO">NGO / Trust / Society</option>
                                        </select>
                                    </div>
                                </div>

                                {/* FSSAI Specific Details */}
                                <div className="space-y-4 pt-2">
                                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">FSSAI Specifics</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Kind of Business (KoB)</label>
                                            <select
                                                required
                                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition"
                                                value={formData.kindOfBusiness}
                                                onChange={(e) => setFormData({ ...formData, kindOfBusiness: e.target.value })}
                                            >
                                                <option value="">Select Activity</option>
                                                <option value="Manufacturer">Manufacturer</option>
                                                <option value="General Manufacturing">General Manufacturing</option>
                                                <option value="Retailer">Retailer</option>
                                                <option value="Wholesaler">Wholesaler</option>
                                                <option value="Distributor">Distributor</option>
                                                <option value="Supplier">Supplier</option>
                                                <option value="Food Services">Food Services (Hotel/Restaurant/Canteen)</option>
                                                <option value="Importer">Importer</option>
                                                <option value="Exporter">Exporter</option>
                                                <option value="E-Commerce">E-Commerce</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Number of Years (Validity)</label>
                                            <select
                                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition"
                                                value={formData.years}
                                                onChange={(e) => setFormData({ ...formData, years: e.target.value })}
                                            >
                                                {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>{y} Year{y > 1 ? 's' : ''}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Food Categories (Main Items)</label>
                                        <textarea
                                            required
                                            rows="2"
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition"
                                            placeholder="Ex: Dairy Products, Meat, Vegetable Oil, Ready to Eat Savouries, Beverages..."
                                            value={formData.foodCategory}
                                            onChange={(e) => setFormData({ ...formData, foodCategory: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <h3 className="font-bold text-slate-800 border-b pb-2">Business Address</h3>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Address Line 1</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition"
                                            placeholder="Shop No, Building Name, Street"
                                            value={formData.addressLine1}
                                            onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">City / District</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition"
                                                placeholder="Enter City"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Pincode</label>
                                            <input
                                                required
                                                type="text"
                                                maxLength="6"
                                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition"
                                                placeholder="110001"
                                                value={formData.pincode}
                                                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">State</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition"
                                            placeholder="Enter State"
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Owner / Auth Signatory Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition"
                                            value={formData.ownerName}
                                            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">PAN Number</label>
                                        <input
                                            type="text"
                                            maxLength="10"
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition uppercase"
                                            placeholder="ABCDE1234F"
                                            value={formData.panNumber}
                                            onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Contact Phone</label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-[#1E293B] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : <>Next Step <ArrowRight size={20} /></>}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* STEP 2: DOCUMENTS */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100 flex items-start gap-4">
                                <AlertCircle className="text-yellow-600 shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-[#1E293B]">Document Guidelines</h3>
                                    <ul className="text-sm text-slate-600 list-disc list-inside mt-2 space-y-1">
                                        <li>Photos must be clear and recent (Passport Size).</li>
                                        <li>Address proof should be recent (Elec Bill / Rent Agreement / NOC).</li>
                                        {formData.constitution !== 'Proprietorship' && <li>Ensure all incorporation documents are readable.</li>}
                                        {formData.kindOfBusiness?.includes('Manufacturer') && <li>Upload Layout Plan / Machinery List if available.</li>}
                                    </ul>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <FileUploadField label="Passport Photo (Proprietor / Partner / Director)" type="photo" required />
                                <FileUploadField label="Identity Proof (Aadhaar / Voter ID)" type="aadhaar" required />
                                <FileUploadField label="Business Address Proof (Elec Bill / Rent Agreement)" type="addressProof" required />

                                {formData.constitution !== 'Proprietorship' && (
                                    <FileUploadField label="Partnership Deed / MOA & AOA / COI" type="constitutionDocs" required />
                                )}

                                <FileUploadField label="Other Supporting Docs (NOC / Blueprint / Food List)" type="other" />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    onClick={() => setCurrentStep(1)}
                                    className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handlePaymentAndSubmit}
                                    disabled={isLoading}
                                    className="flex-1 py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : (
                                        <>
                                            Pay ₹{(PRICES[initialPlan.toUpperCase()] || 999)} & Submit <CheckCircle size={20} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: SUCCESS */}
                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-100"
                        >
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                                <CheckCircle size={48} />
                            </div>
                            <h2 className="text-3xl font-black text-[#1E293B] mb-4">Application Submitted!</h2>
                            <p className="text-slate-500 text-lg mb-8 max-w-lg mx-auto">
                                Your application has been successfully submitted for review. Your Order ID is <span className="font-bold text-slate-800">#{orderId}</span>.
                            </p>

                            <div className="bg-slate-50 p-6 rounded-2xl mb-8 text-left max-w-md mx-auto">
                                <h4 className="font-bold text-slate-700 mb-4">What happens next?</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-sm text-slate-600">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                                        Admin reviews documents (24-48 Hours)
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-600">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                                        Automation generates filing forms
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-600">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                                        Submission to Govt Portal
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-10 py-4 bg-[#1E293B] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition flex items-center mx-auto gap-2"
                            >
                                Go to Dashboard <ArrowRight size={20} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FssaiApplication;
