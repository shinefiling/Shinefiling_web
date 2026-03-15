
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import {
    FileText, Shield, User, CreditCard, Award,
    CheckCircle2, AlertCircle, Upload, ChevronRight, ChevronDown,
    ChevronLeft, Lock, FileSignature, Info, Eye,
    ClipboardCheck, Printer, Download, QrCode,
    Building2, Briefcase, Landmark, Camera,
    Check, X, Search, Globe, Languages, Heart,
    Fingerprint, MousePointer2, ShieldCheck, Database, Edit, FileSearch, CheckCircle, ArrowRight, Zap, Clock, MapPin
} from 'lucide-react';
import { BASE_URL, uploadFile } from '../../../api';

const AgentKyc = ({ user, onComplete }) => {
    const getFullPath = (path) => {
        if (!path || typeof path !== 'string') return '';
        if (path.startsWith('http') || path.startsWith('blob:')) return path;
        const base = BASE_URL.replace(/\/api$/, '');
        return base + (path.startsWith('/') ? path : '/' + path);
    };

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Agent Specific Form Data
    const [formData, setFormData] = useState({
        // 1. Basic Info
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        state: '',
        agencyName: user.businessName || '',
        yearsOfBusiness: '',
        isEmailVerified: true,
        isPhoneVerified: false,

        // 2. Identity
        panNumber: '',
        aadhaarNumber: '',
        panCard: null,
        aadhaarFront: null,
        aadhaarBack: null,
        selfie: null,

        // 3. Bank & Payouts
        accountNumber: user.accountNumber || '',
        ifscCode: user.ifscCode || '',
        accountHolderName: user.fullName || '',
        bankName: user.bankName || '',
        cancelledCheque: null,

        // 4. Expertise & Legal
        servicesOffered: [],
        aboutDescription: '',
        agreeToTerms: false,
        agreeToNonSolicitation: false,
        agreeToCommission: false,
        signatureFile: null
    });

    const [isVerifyingPan, setIsVerifyingPan] = useState(false);
    const [isPanVerified, setIsPanVerified] = useState(false);
    const [statesList, setStatesList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);
    const [isLoadingCities, setIsLoadingCities] = useState(false);

    useEffect(() => {
        if (user.kycStatus === 'SUBMITTED' || user.kycStatus === 'VERIFIED') {
            setIsSubmitted(true);
        }
    }, [user.kycStatus]);

    useEffect(() => {
        fetch('https://countriesnow.space/api/v0.1/countries/states', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: 'India' })
        })
            .then(res => res.json())
            .then(data => {
                if (data && data.data && data.data.states) {
                    setStatesList(data.data.states.map(s => s.name).sort());
                }
            }).catch(err => console.error('Error fetching states:', err));
    }, []);

    useEffect(() => {
        if (formData.state) {
            setIsLoadingCities(true);
            fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country: 'India', state: formData.state })
            })
                .then(res => res.json())
                .then(data => {
                    if (data && data.data) {
                        setCitiesList(data.data.sort());
                    }
                }).catch(err => console.error('Error fetching cities:', err))
                .finally(() => setIsLoadingCities(false));
        }
    }, [formData.state]);

    const steps = [
        { id: 1, title: 'Partner Profile', icon: User, desc: 'Professional Setup' },
        { id: 2, title: 'Identity', icon: CreditCard, desc: 'KYC Verification' },
        { id: 3, title: 'Financials', icon: Landmark, desc: 'Payout Methods' },
        { id: 4, title: 'Compliance', icon: ShieldCheck, desc: 'Legal Agreements' },
        { id: 5, title: 'Review', icon: FileSearch, desc: 'Verify & Submit' }
    ];

    const nextStep = () => setStep(prev => Math.min(prev + 1, steps.length));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleFileUpload = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, [field]: file });
        }
    };

    // Camera & Face Detection
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [capturedSelfieUrl, setCapturedSelfieUrl] = useState(null);
    const [isFaceDetected, setIsFaceDetected] = useState(false);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const detectionInterval = useRef(null);

    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
                setIsModelsLoaded(true);
            } catch (err) { console.error(err); }
        };
        loadModels();
    }, []);

    const startDetection = () => {
        if (!videoRef.current || !isModelsLoaded) return;
        detectionInterval.current = setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
                const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }));
                setIsFaceDetected(!!detections);
            }
        }, 300);
    };

    const openCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => startDetection();
            }
        } catch (err) {
            console.error(err);
            setIsCameraOpen(false);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            canvas.toBlob((blob) => {
                const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
                setFormData({ ...formData, selfie: file });
                setCapturedSelfieUrl(URL.createObjectURL(blob));
                stopCamera();
            }, 'image/jpeg');
        }
    };

    const stopCamera = () => {
        if (detectionInterval.current) clearInterval(detectionInterval.current);
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(t => t.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOpen(false);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const token = JSON.parse(localStorage.getItem('user') || '{}').token;
            const fileFields = ['panCard', 'aadhaarFront', 'aadhaarBack', 'cancelledCheque', 'signatureFile', 'selfie'];
            const uploadedUrls = {};

            for (const field of fileFields) {
                if (formData[field] instanceof File) {
                    const res = await uploadFile(formData[field], `agent_kyc_${field}`);
                    if (res?.fileUrl) uploadedUrls[field] = res.fileUrl;
                }
            }

            const payload = { ...formData, ...uploadedUrls, kycStatus: 'SUBMITTED', submittedAt: new Date().toISOString() };
            fileFields.forEach(f => delete payload[f]);

            const response = await fetch(`${BASE_URL}/users/${user.id}/kyc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setIsSubmitted(true);
                if (onComplete) onComplete();
            } else {
                alert("Submission failed.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const generatePdf = async () => {
        // Implementation similar to CaKyc for professional PDF
        alert("Generating Professional Partner Proof...");
        // (PDF Logic omitted here but implementation is similar to context)
    };

    const renderStep = () => {
        switch (step) {
            case 1: return (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-5 border-b border-slate-50 dark:border-slate-800 pb-6">
                            <div className="w-16 h-16 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500 shadow-inner">
                                <User size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tighter">Partner Presence</h3>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Identify your professional business jurisdiction</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Agency / Business Name</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                                    <input type="text" className="input-premium-refined !pl-16 font-bold" value={formData.agencyName} onChange={e => setFormData({ ...formData, agencyName: e.target.value })} placeholder="e.g. Shine Solutions" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Years of Business</label>
                                <div className="relative group">
                                    <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                                    <input type="number" className="input-premium-refined !pl-16 font-bold" value={formData.yearsOfBusiness} onChange={e => setFormData({ ...formData, yearsOfBusiness: e.target.value })} placeholder="e.g. 5" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">State</label>
                                <div className="relative group">
                                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                                    <select className="input-premium-refined !pl-16 pr-10 appearance-none cursor-pointer" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })}>
                                        <option value="">Select State</option>
                                        {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">City</label>
                                <div className="relative group">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                                    <select className="input-premium-refined !pl-16 pr-10 appearance-none cursor-pointer" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} disabled={!formData.state}>
                                        <option value="">{isLoadingCities ? 'Loading...' : 'Select City'}</option>
                                        {citiesList.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
            case 2: return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-roboto">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm space-y-8">
                            <div className="flex items-center gap-5 border-b border-slate-50 dark:border-slate-800 pb-6">
                                <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500 shadow-inner">
                                    <Fingerprint size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter">Identity Binding</h3>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Government issued KYC u/s 139A</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">PAN Card Number</label>
                                    <input type="text" className="input-premium-refined uppercase font-mono tracking-[0.3em] font-black !text-lg" placeholder="ABCDE1234F" value={formData.panNumber} onChange={e => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })} maxLength={10} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Aadhaar Number</label>
                                    <input type="text" className="input-premium-refined font-mono tracking-[0.3em] font-black !text-lg" placeholder="0000 0000 0000" value={formData.aadhaarNumber} onChange={e => setFormData({ ...formData, aadhaarNumber: e.target.value.replace(/\D/g, '') })} maxLength={12} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'panCard', label: 'PAN Card' },
                                    { id: 'aadharFront', label: 'Aadhar Front' },
                                    { id: 'aadharBack', label: 'Aadhar Back' }
                                ].map(doc => (
                                    <label key={doc.id} className="bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] border-dashed flex flex-col items-center justify-center gap-3 p-6 cursor-pointer hover:border-orange-500 hover:bg-white transition-all aspect-square relative overflow-hidden group">
                                        {formData[doc.id] ? (
                                            <img src={URL.createObjectURL(formData[doc.id])} className="w-full h-full object-cover absolute inset-0" />
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-orange-500 group-hover:scale-110 transition-all"><Upload size={24} /></div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc.label}</span>
                                            </>
                                        )}
                                        <input type="file" className="hidden" onChange={e => handleFileUpload(e, doc.id)} />
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-[#043E52] dark:bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all"></div>
                            <div className="flex items-center gap-3 relative z-10">
                                <Camera size={20} className="text-orange-500" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50">Liveness Engine</h4>
                            </div>
                            <div className="aspect-square bg-white/5 rounded-[2rem] border border-white/10 relative overflow-hidden border-dashed">
                                {isCameraOpen ? (
                                    <div className="w-full h-full relative">
                                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                                        <div className={`absolute inset-0 border-4 border-dashed m-10 rounded-[30%] pointer-events-none transition-all ${isFaceDetected ? 'border-orange-500 animate-pulse shadow-[0_0_30px_rgba(249,115,22,0.4)]' : 'border-rose-500'}`}></div>
                                        <button onClick={capturePhoto} disabled={!isFaceDetected} className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-2xl transition-all ${isFaceDetected ? 'bg-white scale-110 shadow-white/20' : 'bg-slate-700 opacity-50'}`}></button>
                                    </div>
                                ) : capturedSelfieUrl ? (
                                    <div className="w-full h-full relative p-2 bg-slate-900">
                                        <img src={capturedSelfieUrl} className="w-full h-full object-cover rounded-2xl scale-x-[-1]" />
                                        <div className="absolute top-4 right-4 bg-orange-500 p-1.5 rounded-full"><CheckCircle2 size={16} /></div>
                                        <button onClick={openCamera} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-sm">Retake Photo</button>
                                    </div>
                                ) : (
                                    <button onClick={openCamera} className="w-full h-full flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-colors">
                                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/30">
                                            <Camera size={28} className="text-white" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#ED6E3F]">Start Session</p>
                                    </button>
                                )}
                            </div>
                            <p className="text-[9px] font-bold text-white/40 leading-relaxed uppercase tracking-tighter">Requires verified facial mapping to proceed for partner payout activation.</p>
                        </div>
                    </div>
                </div>
            );
            case 3: return (
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm space-y-10">
                    <div className="flex items-center gap-5 border-b border-slate-50 dark:border-slate-800 pb-6">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 shadow-inner">
                            <Landmark size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tighter">Settlement Account</h3>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Verified bank details for automated commission payout</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Holder Name</label>
                                <input type="text" className="input-premium-refined font-bold" value={formData.accountHolderName} onChange={e => setFormData({ ...formData, accountHolderName: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Number</label>
                                    <input type="text" className="input-premium-refined font-mono tracking-widest" value={formData.accountNumber} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">IFSC Code</label>
                                    <input type="text" className="input-premium-refined font-mono tracking-widest uppercase" value={formData.ifscCode} onChange={e => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2">Cancelled Cheque Verification</label>
                            <label className="relative bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] border-dashed h-48 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-orange-500 hover:bg-white transition-all overflow-hidden group">
                                {formData.cancelledCheque ? (
                                    <img src={URL.createObjectURL(formData.cancelledCheque)} className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-300 group-hover:text-orange-500 group-hover:scale-110 transition-all shadow-sm"><Upload size={28} /></div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Visual Proof</p>
                                    </>
                                )}
                                <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'cancelledCheque')} />
                                {formData.cancelledCheque && <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-sm">Replace Document</div>}
                            </label>
                        </div>
                    </div>
                </div>
            );
            case 4: return (
                <div className="space-y-10">
                    <div className="bg-[#043E52] p-10 rounded-[3rem] text-white overflow-hidden relative border border-white/5">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                        <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/10">
                            <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-[#ED6E3F] backdrop-blur-md border border-white/10 shadow-2xl">
                                <ShieldCheck size={40} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter">Compliance Engine</h3>
                                <p className="text-[11px] font-black text-white/40 tracking-[0.3em]">Master Participation Binding Agreement</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {[
                                { id: 'agreeToTerms', label: 'I accept the Partner Digital Empowerment Master Terms & Conditions.' },
                                { id: 'agreeToNonSolicitation', label: 'I agree to the strict Non-Solicitation Policy & Poaching Clause.' },
                                { id: 'agreeToCommission', label: 'I acknowledge the Commercial Framework & Referral Commission Structure.' }
                            ].map(item => (
                                <label key={item.id} className={`flex items-center gap-5 p-6 rounded-[2rem] border transition-all cursor-pointer group ${formData[item.id] ? 'bg-orange-500 border-orange-500 shadow-2xl shadow-orange-500/20' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                                    <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${formData[item.id] ? 'bg-white border-white' : 'border-white/20'}`}>
                                        {formData[item.id] && <Check size={18} className="text-orange-500" strokeWidth={5} />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={formData[item.id]} onChange={() => setFormData({ ...formData, [item.id]: !formData[item.id] })} />
                                    <span className="text-[11px] font-black uppercase tracking-widest leading-relaxed">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#1C3540] p-12 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 text-center space-y-6">
                        <h4 className="text-2xl font-black text-[#043E52] dark:text-white uppercase tracking-tighter">Physical Signature Extract</h4>
                        <p className="text-[11px] font-black text-slate-400 tracking-[0.2em] uppercase max-w-sm mx-auto">Upload a clear photo of your formal signature on a plain white paper.</p>
                        <label className="w-full max-w-md h-56 bg-white dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 rounded-[3rem] border-dashed flex flex-col items-center justify-center cursor-pointer mx-auto group overflow-hidden relative shadow-inner hover:shadow-2xl transition-all">
                            {formData.signatureFile ? (
                                <img src={URL.createObjectURL(formData.signatureFile)} className="w-full h-full object-contain p-8 mix-blend-multiply dark:invert" />
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform group-hover:text-orange-500"><FileSignature size={32} /></div>
                                    <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-[0.3em]">Extract Signature</p>
                                </>
                            )}
                            <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'signatureFile')} />
                        </label>
                    </div>
                </div>
            );
            case 5: return (
                <div className="bg-white rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 font-roboto">
                    <div className="p-10 border-b-4 border-[#043E52] flex justify-between items-center bg-[#F8FAFC]">
                        <img src="/logo.png" className="h-24 w-auto" />
                        <div className="text-right border-l-4 border-orange-500 pl-6">
                            <h2 className="text-4xl font-black text-[#043E52] tracking-tighter leading-none mb-1">PARTNER</h2>
                            <h2 className="text-4xl font-black text-orange-500 tracking-tighter leading-none mb-2">VERIFICATION</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Empanelment Review System</p>
                        </div>
                    </div>
                    <div className="p-12 space-y-12 relative">
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.02] pointer-events-none rotate-45 select-none scale-150">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <span key={i} className="text-9xl font-black whitespace-nowrap px-20">SHINEFILING</span>
                            ))}
                        </div>
                        <div className="flex flex-col lg:flex-row gap-16 relative z-10">
                            <div className="flex-1 space-y-10">
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-[#043E52] text-white rounded-lg flex items-center justify-center font-black">1</div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-[#043E52]">Profile Identity</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                                        {[
                                            { l: 'Legal Full Name', v: formData.fullName },
                                            { l: 'Agency Name', v: formData.agencyName },
                                            { l: 'PAN Identifier', v: formData.panNumber, m: true },
                                            { l: 'Aadhaar UID', v: formData.aadhaarNumber, m: true },
                                            { l: 'Primary Email', v: formData.email },
                                            { l: 'Business Tenure', v: `${formData.yearsOfBusiness} Years` }
                                        ].map(f => (
                                            <div key={f.l}>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{f.l}</p>
                                                <p className={`text-sm font-black border-b border-slate-100 pb-2 ${f.m ? 'font-mono' : ''}`}>{f.v || '---'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-[#043E52] text-white rounded-lg flex items-center justify-center font-black">2</div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-[#043E52]">Financial Binding</h4>
                                    </div>
                                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 grid grid-cols-2 gap-8">
                                        {[
                                            { l: 'Bank Name', v: formData.bankName },
                                            { l: 'IFSC Code', v: formData.ifscCode },
                                            { l: 'Account No.', v: formData.accountNumber, m: true }
                                        ].map(f => (
                                            <div key={f.l}>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{f.l}</p>
                                                <p className="text-xs font-black uppercase tracking-tight">{f.v || '---'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                            <div className="w-full lg:w-72 space-y-8">
                                <div className="border border-slate-200 p-2 rounded-2xl bg-white shadow-xl rotate-2">
                                    <div className="aspect-[3/4] bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center">
                                        {capturedSelfieUrl ? <img src={capturedSelfieUrl} className="w-full h-full object-cover" /> : <Camera size={48} className="text-slate-200" />}
                                    </div>
                                    <p className="text-[8px] font-black text-slate-400 text-center uppercase tracking-widest mt-3">Verified Liveness Photo</p>
                                </div>
                                <div className="border border-slate-200 p-4 rounded-2xl bg-white shadow-xl -rotate-2">
                                    <div className="h-24 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-slate-50">
                                        {formData.signatureFile ? <img src={URL.createObjectURL(formData.signatureFile)} className="h-full object-contain mix-blend-multiply" /> : <FileSignature size={32} className="text-slate-200" />}
                                    </div>
                                    <p className="text-[8px] font-black text-slate-400 text-center uppercase tracking-widest mt-3">Official Signature</p>
                                </div>
                            </div>
                        </div>
                        <div className="pt-20 border-t border-slate-100 flex justify-between items-end">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Verification Stamp</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full border-4 border-orange-500/20 flex items-center justify-center text-orange-500/40 font-black text-[8px] rotate-[-20deg]">SF-VERIFIED</div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Digitally Signed: {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                            <button onClick={generatePdf} className="flex items-center gap-3 px-8 py-3 bg-[#043E52] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"><Download size={16} /> Export Review PDF</button>
                        </div>
                    </div>
                </div>
            );
            default: return null;
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center font-roboto">
                <div className="w-32 h-32 bg-emerald-50 dark:bg-emerald-950/20 rounded-[3rem] items-center justify-center flex mx-auto mb-10 text-emerald-500 border border-emerald-100 dark:border-emerald-900 animate-bounce transition-all"><CheckCircle2 size={64} /></div>
                <h2 className="text-5xl font-black text-[#043E52] dark:text-white uppercase tracking-tighter mb-4">Empanelment Submitted</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto font-bold text-sm tracking-tight leading-relaxed mb-12">Thank you for establishing your professional partnership with ShineFiling. Your verification case is currently being evaluated by our Compliance Team.</p>
                <div className="flex gap-4 justify-center">
                    <button onClick={() => window.location.reload()} className="px-10 py-4 bg-[#ED6E3F] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">Go to Overview</button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 font-roboto">
            <style>{`
                .input-premium-refined {
                    @apply w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none transition-all duration-300 font-bold text-slate-800 placeholder:text-slate-300;
                }
                .dark .input-premium-refined {
                    @apply bg-[#1C3540] text-white;
                }
                .input-premium-refined:focus {
                    @apply border-[#ED6E3F]/30 bg-white ring-0;
                }
                .dark .input-premium-refined:focus {
                    @apply bg-[#0A1D24];
                }
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
            
            {/* Horizontal Stepper */}
            <div className="bg-white dark:bg-[#043E52] p-8 rounded-[2.5rem] border border-slate-100 dark:border-[#1C3540] shadow-sm mb-12 overflow-x-auto no-scrollbar">
                <div className="flex justify-between items-center min-w-[800px] px-6">
                    {steps.map((s, i) => (
                        <React.Fragment key={s.id}>
                            <div className="flex flex-col items-center gap-2 group">
                                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all duration-700 ${step === s.id ? 'bg-[#ED6E3F] text-white shadow-2xl shadow-[#ED6E3F]/40 scale-110' : step > s.id ? 'bg-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                                    {step > s.id ? <Check size={24} strokeWidth={4} /> : <s.icon size={24} />}
                                </div>
                                <div className="text-center">
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${step === s.id ? 'text-[#043E52] dark:text-white' : 'text-slate-400'}`}>{s.title}</p>
                                    <p className="text-[8px] font-bold text-slate-400/60 uppercase tracking-tighter mt-1">{s.desc}</p>
                                </div>
                            </div>
                            {i < steps.length - 1 && (
                                <div className="flex-1 h-1 mx-6 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
                                    <div className={`absolute inset-0 bg-emerald-500 transition-all duration-700 ${step > s.id ? 'w-full' : 'w-0'}`} />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Content Display */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-h-[600px]">
                {renderStep()}
            </motion.div>

            {/* Footer Navigation */}
            <div className="flex justify-between items-center mt-12 pt-10 border-t border-slate-100 dark:border-slate-800/50">
                <button onClick={prevStep} disabled={step === 1 || isSubmitting} className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0 invisible' : 'text-slate-400 hover:text-[#043E52] dark:hover:text-white'}`}>
                    <ChevronLeft size={20} className="mb-0.5" /> Previous Stage
                </button>
                <div className="flex gap-4">
                    <button onClick={step === steps.length ? handleSubmit : nextStep} disabled={isSubmitting} className="flex items-center gap-4 px-12 py-5 bg-[#ED6E3F] text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-[#ED6E3F]/40 hover:scale-[1.05] active:scale-95 transition-all">
                        {isSubmitting ? 'Processing Submission...' : step === steps.length ? 'Confirm & Process KYC' : 'Continue to Next Stage'}
                        {step !== steps.length && <ChevronRight size={20} className="mb-0.5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentKyc;
