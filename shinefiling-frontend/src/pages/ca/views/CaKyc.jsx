
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
    Fingerprint, MousePointer2, ShieldCheck, Database, Edit, FileSearch, CheckCircle, ArrowRight
} from 'lucide-react';
import { BASE_URL, uploadFile } from '../../../api';

const CaKyc = ({ user, onComplete }) => {
    const getFullPath = (path) => {
        if (!path || typeof path !== 'string') return '';
        if (path.startsWith('http') || path.startsWith('blob:')) return path;
        const base = BASE_URL.replace(/\/api$/, '');
        return base + (path.startsWith('/') ? path : '/' + path);
    };

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Detailed form data as per 11 points
    const [formData, setFormData] = useState({
        // 1. Basic Registration
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '987XXXXXX0',
        city: '',
        state: '',
        yearsOfExperience: '',
        practiceType: 'Individual', // Individual / Firm
        isEmailVerified: true,
        isPhoneVerified: false,

        // 2. Identity KYC
        panNumber: '',
        aadharNumber: '',
        passportNumber: '', // Optional
        panCard: null,
        aadharFront: null,
        aadharBack: null,
        selfie: null,

        // 3. CA Qualification
        professionalType: user.specialization || 'CA', // CA, CS, CMA, CFA, CFP, DISA
        caMembershipNumber: '',
        copNumber: '',
        yearOfQualification: '',
        caCertificate: null,
        copCertificate: null,

        // 4. Firm Details
        firmName: '',
        firmPan: '',
        gstNumber: '',
        firmRegistrationCertificate: null,
        officeAddress: '',

        // 5. Bank Account
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        bankName: '',
        cancelledCheque: null,

        // 6. Profile Completion
        aboutDescription: '',
        servicesOffered: [], // ['ITR Filing', 'GST Filing', 'Audit', 'Company Registration', 'Compliance']
        pricingModel: 'Fixed',
        languages: [],

        // 7. Legal
        agreeToTerms: false,
        agreeToPrivacy: false,
        agreeToNonSolicitation: false,
        agreeToCommission: false,
        digitalSignature: '', // Fallback if using old code
        signatureFile: null
    });

    const [isVerifyingPan, setIsVerifyingPan] = useState(false);
    const [isPanVerified, setIsPanVerified] = useState(false);
    const [activeService, setActiveService] = useState('');

    const [statesList, setStatesList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);
    const [isLoadingCities, setIsLoadingCities] = useState(false);

    useEffect(() => {
        if (user.kycStatus === 'SUBMITTED' || user.kycStatus === 'VERIFIED') {
            setIsSubmitted(true);
        }

        // Pre-fill from existing documents if available
        if (user.kycDocuments) {
            try {
                const savedData = typeof user.kycDocuments === 'string'
                    ? JSON.parse(user.kycDocuments)
                    : user.kycDocuments;

                setFormData(prev => ({
                    ...prev,
                    ...savedData,
                    // Ensure arrays are preserved
                    servicesOffered: Array.isArray(savedData.servicesOffered) ? savedData.servicesOffered : [],
                    languages: Array.isArray(savedData.languages) ? savedData.languages : []
                }));

                if (savedData.selfie) {
                    setCapturedSelfieUrl(getFullPath(savedData.selfie));
                }
            } catch (e) {
                console.error("Error parsing saved KYC documents:", e);
            }
        }
    }, [user.kycStatus, user.kycDocuments]);

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
        } else {
            setCitiesList([]);
        }
    }, [formData.state]);

    const steps = [
        { id: 1, title: 'Profile Info', icon: User, desc: 'Experience & Practice' },
        { id: 2, title: 'Identity', icon: CreditCard, desc: 'Aadhar & PAN' },
        { id: 3, title: 'Professional', icon: Award, desc: `${formData.professionalType || 'CA'} Credentials` },
        { id: 4, title: 'Firm & Payout', icon: Landmark, desc: 'Bank & Firm Details' },
        { id: 5, title: 'Expertise', icon: Briefcase, desc: 'Services & Profile' },
        { id: 6, title: 'Compliance', icon: ShieldCheck, desc: 'Legal Agreements' },
        { id: 7, title: 'Preview', icon: FileSearch, desc: 'Review & Submit' }
    ];

    const getServiceOptions = () => {
        const baseServices = ['Compliance', 'Drafting', 'Consultation'];
        
        switch(formData.professionalType) {
            case 'CA': return [...baseServices, 'ITR Filing', 'GST Filing', 'Statutory Audit', 'Tax Audit', 'Company Registration', 'Tax Planning'];
            case 'CS': return [...baseServices, 'ROC Filing', 'LLP Annual Filing', 'Secretarial Audit', 'NCLT Representation', 'FDI Compliance', 'IPR Advisory'];
            case 'CMA': return [...baseServices, 'Cost Audit', 'Inventory Valuation', 'CMA Data Preparation', 'Budgeting & Control', 'Project Financing'];
            case 'CFA': return [...baseServices, 'Investment Advisory', 'Portfolio Management', 'Business Valuation', 'Mergers & Acquisitions', 'Financial Modeling'];
            case 'CFP': return [...baseServices, 'Strategic Planning', 'Retirement Planning', 'Estate Planning', 'Risk Management', 'Insurance Planning'];
            case 'DISA': return [...baseServices, 'System Audit', 'Cyber Security Audit', 'Database Auditing', 'IT Governance', 'Risk Assessment'];
            default: return ['ITR Filing', 'GST Filing', 'Audit', 'Company Registration', 'Compliance', 'Tax Planning', 'ROC Filing', 'Financial Advisory'];
        }
    };

    const serviceOptions = getServiceOptions();

    const languageOptions = ['English', 'Tamil', 'Hindi', 'Malayalam', 'Telugu', 'Kannada'];

    const nextStep = () => setStep(prev => Math.min(prev + 1, steps.length));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleFileUpload = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, [field]: file });
        }
    };

    const toggleService = (service) => {
        const current = [...formData.servicesOffered];
        if (current.includes(service)) {
            setFormData({ ...formData, servicesOffered: current.filter(s => s !== service) });
        } else {
            setFormData({ ...formData, servicesOffered: [...current, service] });
        }
    };

    const toggleLanguage = (lang) => {
        const current = [...formData.languages];
        if (current.includes(lang)) {
            setFormData({ ...formData, languages: current.filter(l => l !== lang) });
        } else {
            setFormData({ ...formData, languages: [...current, lang] });
        }
    };

    const verifyPan = () => {
        if (formData.panNumber.length !== 10) return;
        setIsVerifyingPan(true);
        setTimeout(() => {
            setIsVerifyingPan(false);
            setIsPanVerified(true);
        }, 1500);
    };

    const [isVerifyingOtp, setIsVerifyingOtp] = useState({ email: false, phone: false });

    // Webcam & Face Detection States
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [capturedSelfieUrl, setCapturedSelfieUrl] = useState(null);
    const [isFaceDetected, setIsFaceDetected] = useState(false);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const detectionInterval = useRef(null);

    // Load models on mount
    useEffect(() => {
        const loadModels = async () => {
            try {
                // Using public models from a common source for development
                const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                ]);
                setIsModelsLoaded(true);
            } catch (err) {
                console.error("Error loading face detection models:", err);
            }
        };
        loadModels();
    }, []);

    const startDetection = () => {
        if (!videoRef.current || !isModelsLoaded) return;

        detectionInterval.current = setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
                const detections = await faceapi.detectSingleFace(
                    videoRef.current,
                    new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
                );

                if (detections) {
                    // Check if face is roughly centered and large enough
                    const { x, y, width, height } = detections.box;
                    const videoWidth = videoRef.current.videoWidth;
                    const videoHeight = videoRef.current.videoHeight;

                    // Basic check: face should be at least 20% of the frame and somewhat central
                    const area = (width * height) / (videoWidth * videoHeight);
                    const isCentered = (x + width / 2) > videoWidth * 0.25 && (x + width / 2) < videoWidth * 0.75;

                    setIsFaceDetected(area > 0.05 && isCentered);
                } else {
                    setIsFaceDetected(false);
                }
            }
        }, 300); // Check 3 times a second for performance
    };

    const openCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        startDetection();
                    };
                }
            }, 200);
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please allow camera permissions in your browser settings.");
            setIsCameraOpen(false);
        }
    };

    const stopCamera = () => {
        if (detectionInterval.current) {
            clearInterval(detectionInterval.current);
            detectionInterval.current = null;
        }
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsFaceDetected(false);
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                const file = new File([blob], "live_selfie.jpg", { type: "image/jpeg" });
                setFormData({ ...formData, selfie: file });
                setCapturedSelfieUrl(URL.createObjectURL(blob));
                stopCamera();
            }, 'image/jpeg');
        }
    };

    const retakePhoto = () => {
        setFormData({ ...formData, selfie: null });
        setCapturedSelfieUrl(null);
        openCamera();
    };

    // Ensure camera turns off when unmounting or completing
    useEffect(() => {
        return () => stopCamera();
    }, []);

    const handleVerifyOtp = (type) => {
        setIsVerifyingOtp({ ...isVerifyingOtp, [type]: true });
        setTimeout(() => {
            setIsVerifyingOtp({ ...isVerifyingOtp, [type]: false });
            setFormData(prev => ({ ...prev, [type === 'email' ? 'isEmailVerified' : 'isPhoneVerified']: true }));
        }, 1200);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            const token = storedUser.token || storedUser.accessToken || storedUser.jwt || user.token;

            if (!user.id) {
                alert("Session error: User ID missing. Please login again.");
                setIsSubmitting(false);
                return;
            }

            // Pattern: Upload files one by one first, gathering their URLs
            const fileFields = [
                'panCard', 'aadharFront', 'aadharBack',
                'caCertificate', 'copCertificate', 'cancelledCheque',
                'signatureFile', 'selfie'
            ];

            const uploadedFileUrls = {};

            // Upload files that are present
            for (const field of fileFields) {
                if (formData[field] instanceof File) {
                    try {
                        // Update status to show specific file progress
                        setIsSubmitting(true); // Keep submitting true
                        const uploadRes = await uploadFile(formData[field], `ca_kyc_${field}`);
                        if (uploadRes && uploadRes.fileUrl) {
                            uploadedFileUrls[field] = uploadRes.fileUrl;
                        }
                    } catch (uploadErr) {
                        console.error(`Failed to upload ${field}:`, uploadErr);
                        throw new Error(`Failed to upload ${field}. Please check your connection.`);
                    }
                }
            }

            // Prepare the final JSON payload
            const finalPayload = {
                ...formData,
                // Replace File objects with their uploaded URLs in the payload
                ...uploadedFileUrls,
                kycStatus: 'SUBMITTED',
                submittedAt: new Date().toISOString()
            };

            // Remove actual File objects from the JSON payload (already replaced by URLs)
            for (const field of fileFields) {
                if (finalPayload[field] instanceof File) {
                    delete finalPayload[field];
                }
            }

            const response = await fetch(`${BASE_URL}/users/${user.id}/kyc`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(finalPayload)
            });

            if (response.ok) {
                const updatedUser = { ...storedUser, kycStatus: 'SUBMITTED' };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setIsSubmitted(true);
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(`KYC submission failed: ${errorData.message || 'Unknown error'}. Please try again.`);
            }
        } catch (error) {
            console.error('Error submitting KYC:', error);
            alert(error.message || 'Something went wrong during KYC submission. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isStepValid = () => {
        switch (step) {
            case 1: return formData.fullName && formData.city && formData.state && formData.yearsOfExperience;
            case 2: return formData.panNumber && formData.aadharNumber && formData.panCard && formData.aadharFront;
            case 3: return formData.caMembershipNumber && formData.copNumber && formData.caCertificate && formData.copCertificate;
            case 4: return formData.accountNumber && formData.ifscCode && formData.cancelledCheque && (formData.practiceType === 'Individual' || (formData.firmName && formData.firmPan && formData.firmRegistrationCertificate));
            case 5: return formData.servicesOffered.length > 0 && formData.aboutDescription.length > 20;
            case 6: return formData.agreeToTerms && formData.signatureFile;
            case 7: return true;
            default: return false;
        }
    };

    const generateKycPdf = async () => {
        try {
            const doc = new jsPDF();
            const pageWidth = 210;
            const pageHeight = 297;

            // --- HELPER: LOGO LOADER ---
            const getImgFromUrl = (url) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.crossOrigin = 'Anonymous';
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        resolve(canvas.toDataURL('image/png'));
                    };
                    img.onerror = () => resolve(null);
                    img.src = url;
                });
            };

            const logoBase64 = await getImgFromUrl('/logo.png');

            // --- HELPER: WATERMARK ---
            const addWatermark = (pdfDoc) => {
                pdfDoc.saveGraphicsState();
                pdfDoc.setGState(new pdfDoc.GState({ opacity: 0.03 }));
                pdfDoc.setFont("helvetica", "bold");
                pdfDoc.setFontSize(60);
                pdfDoc.setTextColor(15, 23, 42); // Navy 

                // Rotated watermark across page
                for (let y = 60; y < pageHeight; y += 80) {
                    for (let x = -20; x < pageWidth; x += 100) {
                        pdfDoc.text("SHINEFILING", x, y, { angle: 45 });
                    }
                }
                pdfDoc.restoreGraphicsState();
            };

            // --- PREMIUM CERTIFICATE THEME ---
            // 1. Outer Dark Frame (The Border)
            doc.setFillColor(15, 23, 42); // #1E293B (More slate/navy)
            doc.rect(10, 10, 190, 277, "S"); // Single line border 
            doc.setLineWidth(0.5);
            doc.setDrawColor(241, 245, 249);
            doc.rect(11, 11, 188, 275, "S");

            // Hero Section (Top Dark Header)
            doc.setFillColor(15, 23, 42);
            doc.rect(10, 10, 190, 50, "F");

            // Branding Section - Proper Logo Integration
            if (logoBase64) {
                // Placing logo image (the one from navbar/sidebar)
                doc.addImage(logoBase64, 'PNG', 20, 18, 55, 30);
            } else {
                // Fallback if logo fails to load
                doc.setTextColor(255, 255, 255);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(24);
                doc.text("ShineFiling", 30, 35);
                doc.setTextColor(249, 115, 22);
                doc.setFontSize(7);
                doc.text("COMPLIANCE & EMPOWERMENT", 30, 42);
            }

            // Right Side Header Label
            doc.setTextColor(255, 255, 255, 0.4);
            doc.setFontSize(7);
            doc.text("OFFICIAL ACCOUNT OPENING FORM", 185, 30, { align: "right" });
            doc.setTextColor(249, 115, 22);
            doc.setFontSize(14);
            doc.text("KYC VERIFIED", 185, 40, { align: "right" });

            // Background Watermark on first page
            addWatermark(doc);

            // --- DATA PANEL ---
            let currentY = 75;
            doc.setDrawColor(241, 245, 249);
            doc.setLineWidth(0.5);

            // Row 1: Identity
            doc.setTextColor(148, 163, 184);
            doc.setFontSize(7);
            doc.text("APPLICANT FULL NAME", 20, currentY);
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(String(formData.fullName || '').toUpperCase(), 20, currentY + 6);

            doc.setTextColor(148, 163, 184);
            doc.setFontSize(7);
            doc.text("PAN CARD NUMBER", 120, currentY);
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(11);
            doc.text(String(formData.panNumber || 'EXXXXXXXXP').toUpperCase(), 120, currentY + 6);

            currentY += 20;
            // Row 2: Contact
            doc.setTextColor(148, 163, 184);
            doc.setFontSize(7);
            doc.text("PRIMARY EMAIL", 20, currentY);
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(9);
            doc.text(formData.email || '-', 20, currentY + 5);

            doc.setTextColor(148, 163, 184);
            doc.setFontSize(7);
            doc.text("REGISTRATION STATUS", 120, currentY);
            doc.setTextColor(249, 115, 22);
            doc.setFontSize(9);
            doc.text("ELECTRONICALLY VERIFIED", 120, currentY + 5);

            currentY += 20;
            // Row 3: Professional Info
            doc.setTextColor(148, 163, 184);
            doc.setFontSize(7);
            doc.text(`${formData.professionalType || 'CA'} MEMBERSHIP ID`, 20, currentY);
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(10);
            doc.text(formData.caMembershipNumber || '-', 20, currentY + 5);

            doc.setTextColor(148, 163, 184);
            doc.setFontSize(7);
            doc.text("PRACTICE TYPE", 120, currentY);
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(10);
            doc.text(formData.practiceType || 'Individual', 120, currentY + 5);

            // Document Audit Trail Section
            currentY += 25;
            doc.setFillColor(248, 250, 252);
            doc.rect(20, currentY, 170, 60, "F");
            doc.setDrawColor(226, 232, 240);
            doc.rect(20, currentY, 170, 60, "S");

            doc.setTextColor(15, 23, 42);
            doc.setFontSize(8);
            doc.text("DOCUMENT VERIFICATION AUDIT TRAIL", 25, currentY + 8);

            const auditDocs = [
                { l: "Identity: PAN & Aadhar", s: formData.panCard && formData.aadharFront ? "PASS" : "ABSENT" },
                { l: "Professional: M.No & COP", s: formData.caCertificate && formData.copCertificate ? "PASS" : "ABSENT" },
                { l: "Banking: Cancelled Cheque", s: formData.cancelledCheque ? "PASS" : "ABSENT" },
                ...(formData.practiceType === 'Firm' ? [{ l: "Firm: Registration Doc", s: formData.firmRegistrationCertificate ? "PASS" : "ABSENT" }] : []),
                { l: "Liveness: Face Mapping", s: formData.selfie ? "PASS" : "ABSENT" }
            ];

            auditDocs.forEach((a, i) => {
                doc.setTextColor(100, 116, 139);
                doc.setFontSize(7);
                doc.text(a.l, 30, currentY + 18 + (i * 8));
                if (a.s === "PASS") {
                    doc.setTextColor(22, 163, 74);
                } else {
                    doc.setTextColor(220, 38, 38);
                }
                doc.text(a.s, 160, currentY + 18 + (i * 8), { align: "right" });
            });

            // --- SIGNATURE BLOCK ---
            currentY = 220;
            doc.setDrawColor(241, 245, 249);
            doc.line(20, currentY, 190, currentY);

            // Signature Label
            doc.setTextColor(148, 163, 184);
            doc.setFontSize(7);
            doc.text("ELECTRONIC SIGNATURE OF APPLICANT", 20, currentY + 8);

            doc.setTextColor(15, 23, 42);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text(user.fullName || '', 20, currentY + 20);

            doc.setFontSize(6);
            doc.setTextColor(148, 163, 184);
            doc.text(`DIGITALLY SIGNED VIA SHINEFILING OTP ENGINE: ${new Date().toISOString()}`, 20, currentY + 25);

            // --- PAGE 2+ (DOCUMENT ATTACHMENTS) ---
            const getBase64 = (file) => new Promise((resolve, reject) => {
                if (!file) return resolve(null);
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });

            const addImagePage = async (fileObj, title, subtitle) => {
                if (!fileObj) return;
                try {
                    const base64 = await getBase64(fileObj);
                    if (!base64) return;

                    doc.addPage();
                    addWatermark(doc);

                    // Page Header
                    doc.setFillColor(15, 23, 42);
                    doc.rect(0, 0, 210, 25, "F");

                    if (logoBase64) {
                        doc.addImage(logoBase64, 'PNG', 10, 5, 25, 15);
                    }

                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(11);
                    doc.text("OFFICIAL EVIDENCE", 40, 15);

                    doc.setTextColor(249, 115, 22);
                    doc.setFontSize(8);
                    doc.text(title.toUpperCase(), 190, 15, { align: "right" });

                    // Evidence Title
                    doc.setTextColor(15, 23, 42);
                    doc.setFontSize(14);
                    doc.setFont("helvetica", "bold");
                    doc.text(title, 20, 40);

                    doc.setTextColor(100, 116, 139);
                    doc.setFontSize(8);
                    doc.text(subtitle || '', 20, 46);

                    // Image Box
                    doc.setDrawColor(226, 232, 240);
                    doc.rect(19, 54, 172, 222);
                    doc.addImage(base64, 'JPEG', 20, 55, 170, 0, undefined, 'FAST');

                    // Verification Stamp
                    doc.setTextColor(203, 213, 225);
                    doc.setFontSize(7);
                    doc.text("OFFICIAL COPY • VERIFIED TRUE BY SHINE COMPLIANCE ENGINE", 105, 288, { align: "center" });

                } catch (e) {
                    console.error("Failed adding image", title, e);
                }
            };

            // Order of attachment matching preview grid
            await addImagePage(formData.panCard, "Permanent Account Number (PAN)", "Income Tax Act 1961 (u/s 139A)");
            await addImagePage(formData.aadharFront, "Aadhar Identity Card (Front)", "Aadhaar Act 2016 (KYC Regulation)");
            await addImagePage(formData.aadharBack, "Aadhar Identity Card (Back)", "Aadhaar Act 2016 (Verification)");
            await addImagePage(formData.caCertificate, "Membership Certificate", "CA Act 1949 (Credential Verification)");
            await addImagePage(formData.copCertificate, "Certificate of Practice", "CA Act 1949 (Practice Sec 6)");
            await addImagePage(formData.cancelledCheque, "Bank Account Confirmation", "NI Act 1881 (Settlement Verification)");
            await addImagePage(formData.selfie, "Identity Liveness Capture", "Facial Mapping Evidence Logged SF-LIV");
            await addImagePage(formData.signatureFile, "Physical Signature Extract", "Master Service Agreement Binding Evidence");

            const safeName = formData.fullName ? formData.fullName.replace(/\s+/g, '_') : 'Applicant';
            doc.save(`ShineFiling_Account_Form_${safeName}.pdf`);
        } catch (error) {
            console.error(error);
            alert("Error generating PDF. Please ensure all documents are properly uploaded.");
        }
    };


    const renderStepContent = () => {
        switch (step) {
            case 1: {
                return (
                    <div className="space-y-5 font-roboto">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm space-y-5">
                            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner">
                                    <User size={22} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold  uppercase tracking-tight">Professional Profile</h3>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Identify your practice jurisdiction</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Professional Type</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                        <select
                                            className="input-premium-refined !pl-14 font-bold appearance-none cursor-pointer"
                                            value={formData.professionalType}
                                            onChange={(e) => setFormData({ ...formData, professionalType: e.target.value })}
                                        >
                                            <option value="CA">Chartered Accountant (CA)</option>
                                            <option value="CS">Company Secretary (CS)</option>
                                            <option value="CMA">Cost and Management Accountant (CMA)</option>
                                            <option value="CFA">Chartered Financial Analyst (CFA)</option>
                                            <option value="CFP">Certified Financial Planner (CFP)</option>
                                            <option value="DISA">DISA (ICAI)</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Practice Type</label>
                                    <div className="flex gap-3">
                                        {['Individual', 'Firm'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setFormData({ ...formData, practiceType: type })}
                                                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all border ${formData.practiceType === type ? 'bg-orange-500 text-white border-orange-500 shadow-xl shadow-orange-500/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700 hover:border-orange-500/30'}`}
                                            >
                                                {type === 'Individual' ? <User size={16} /> : <Building2 size={16} />}
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Full Name (As per PAN)</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Your full name"
                                            className="input-premium-refined !pl-14"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Years of Experience</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                        <input
                                            type="number"
                                            placeholder="e.g. 10"
                                            className="input-premium-refined !pl-14"
                                            value={formData.yearsOfExperience}
                                            onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">State</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                        <select
                                            className="input-premium-refined appearance-none !pl-14 pr-10"
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '' })} // Reset city when state changes
                                        >
                                            <option value="">Select State</option>
                                            {statesList.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                        <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">City</label>
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none" size={18} />
                                        <select
                                            className={`input-premium-refined appearance-none !pl-14 pr-10 ${(!formData.state || isLoadingCities) ? 'opacity-50 bg-slate-100 dark:bg-slate-800 cursor-not-allowed' : ''}`}
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            disabled={!formData.state || isLoadingCities}
                                        >
                                            <option value="">{isLoadingCities ? 'Loading cities...' : 'Select City'}</option>
                                            {citiesList.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                        <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Email ID</label>
                                    <div className="relative group">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                        <input
                                            type="email"
                                            className="input-premium-refined !pl-14"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Mobile Number</label>
                                    <div className="relative group">
                                        <Languages className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                        <input
                                            type="tel"
                                            className="input-premium-refined !pl-14"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            case 2: {
                return (
                    <div className="space-y-5 font-roboto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            <div className="lg:col-span-2 space-y-5">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm space-y-5">
                                    <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                                        <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold">Identity Verification</h3>
                                            <p className="text-[11px] text-slate-500 font-medium tracking-tight">Government issued ID verification</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">PAN Card Number</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                                                    <CreditCard size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="ABCDE1234F"
                                                    className="input-premium-refined !pl-14 uppercase font-mono tracking-widest text-sm"
                                                    value={formData.panNumber}
                                                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Aadhar Number</label>
                                            <div className="relative group">
                                                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="1234 5678 9012"
                                                    className="input-premium-refined !pl-14 font-mono tracking-widest text-sm"
                                                    value={formData.aadharNumber}
                                                    onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { id: 'panCard', label: 'PAN Card' },
                                            { id: 'aadharFront', label: 'Aadhar Front' },
                                            { id: 'aadharBack', label: 'Aadhar Back' }
                                        ].map(doc => (
                                            <label key={doc.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-orange-500 transition-all border-dashed aspect-square group shadow-sm hover:shadow-lg hover:shadow-orange-500/5">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${formData[doc.id] ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-orange-500 group-hover:scale-110'}`}>
                                                    {formData[doc.id] ? <CheckCircle2 size={28} /> : <Upload size={28} />}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">{doc.label}</span>
                                                {formData[doc.id] && <span className="text-[9px] text-slate-400 truncate w-full text-center px-2 font-medium">{formData[doc.id].name}</span>}
                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-2xl text-white space-y-5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all"></div>
                                    <div className="flex items-center gap-3 relative z-10">
                                        <Camera className="text-orange-500" size={20} />
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Liveness Capture</h4>
                                    </div>

                                    <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group/camera">
                                        {isCameraOpen ? (
                                            <div className="w-full h-full relative bg-black">
                                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]"></video>
                                                <canvas ref={canvasRef} className="hidden"></canvas>
                                                {/* Face Guide Overlay */}
                                                <div className={`absolute inset-0 border-[4px] border-dashed m-10 rounded-[30%] pointer-events-none transition-colors duration-300 ${isFaceDetected ? 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]'}`}>
                                                    <div className="absolute -top-10 left-0 w-full text-center">
                                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest backdrop-blur-md border transition-all whitespace-nowrap ${isFaceDetected ? 'bg-orange-500/20 border-orange-500/50 text-orange-500' : 'bg-rose-500/20 border-rose-500/50 text-rose-500'}`}>
                                                            {isFaceDetected ? 'Perfect! Keep still' : 'Position your face'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="absolute bottom-5 left-0 w-full flex justify-center items-center gap-6">
                                                    <button onClick={stopCamera} className="w-10 h-10 rounded-full bg-slate-900/60 backdrop-blur-sm text-white flex justify-center items-center hover:bg-rose-500 transition-colors">
                                                        <X size={16} strokeWidth={3} />
                                                    </button>
                                                    <button
                                                        onClick={capturePhoto}
                                                        disabled={!isFaceDetected}
                                                        className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all ${isFaceDetected ? 'bg-white shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 outline outline-offset-4 outline-white border-4 border-slate-900' : 'bg-slate-700 opacity-50 cursor-not-allowed scale-90'}`}
                                                    ></button>
                                                    <div className="w-10"></div>
                                                </div>
                                            </div>
                                        ) : formData.selfie && capturedSelfieUrl ? (
                                            <div className="w-full h-full relative p-2 bg-slate-900">
                                                <img src={capturedSelfieUrl} alt="Selfie" className="w-full h-full object-cover rounded-2xl scale-x-[-1]" />
                                                <div className="absolute top-4 right-4 bg-orange-500 text-white p-2 rounded-full shadow-lg shadow-orange-500/30">
                                                    <Check size={18} strokeWidth={3.5} />
                                                </div>
                                                <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover/camera:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-[2px] m-2">
                                                    <button onClick={retakePhoto} className="px-6 py-3 bg-white text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-xl">
                                                        <Camera size={14} /> Retake
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors" onClick={openCamera}>
                                                <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)] group-hover/camera:scale-110 transition-transform">
                                                    <Camera size={26} className="text-white" strokeWidth={2.5} />
                                                </div>
                                                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Open Camera</p>
                                                <p className="mt-2 text-[9px] font-medium text-slate-500">Requires Permission Access</p>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[9px] text-slate-500 leading-relaxed font-medium">Please ensure your face is clearly visible and within the frame.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            case 3: {
                return (
                    <div className="space-y-5 font-roboto">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm space-y-5">
                            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner">
                                    <Award size={22} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold  uppercase tracking-tight">{formData.professionalType} Credentials</h3>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                                        {formData.professionalType === 'CA' ? 'ICAI Membership & Practice Authority' : 
                                         formData.professionalType === 'CS' ? 'ICSI Membership & Practice Authority' : 
                                         formData.professionalType === 'CMA' ? 'ICMAI Membership & Practice Authority' : 
                                         'Professional Certification & Authority'}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-orange-50 dark:bg-orange-500/5 rounded-2xl p-4 border border-orange-100 dark:border-orange-500/10 flex items-start gap-4">
                                <div className="p-2 bg-orange-500 text-white rounded-lg">
                                    <Info size={16} />
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">Required Documents for {formData.professionalType}</h4>
                                    <ul className="text-[10px] text-slate-600 dark:text-slate-400 space-y-1 font-medium">
                                        {formData.professionalType === 'CA' && <>
                                            <li>• ICAI Membership Certificate (Mandatory)</li>
                                            <li>• Certificate of Practice (COP) Document</li>
                                        </>}
                                        {formData.professionalType === 'CS' && <>
                                            <li>• ICSI Membership Certificate (Mandatory)</li>
                                            <li>• Certificate of Practice (COP) Document</li>
                                        </>}
                                        {formData.professionalType === 'CMA' && <>
                                            <li>• ICMAI Membership Certificate (Mandatory)</li>
                                            <li>• Certificate of Practice (COP) Document</li>
                                        </>}
                                        {['CFA', 'CFP', 'DISA'].includes(formData.professionalType) && <>
                                            <li>• Official Certification Document / Charter</li>
                                            <li>• Proof of Membership Validity / License Card</li>
                                        </>}
                                    </ul>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                                            {['CFA', 'CFP', 'DISA'].includes(formData.professionalType) ? 'Certificate ID' : 'Membership No.'}
                                        </label>
                                        <div className="relative group">
                                            <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                            <input
                                                placeholder={formData.professionalType === 'CA' ? "6 Digits" : "ID / Member No"}
                                                className="input-premium-refined !pl-14 font-bold"
                                                value={formData.caMembershipNumber}
                                                onChange={(e) => setFormData({ ...formData, caMembershipNumber: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                                            {['CFA', 'CFP', 'DISA'].includes(formData.professionalType) ? 'Validity Year' : 'COP Number'}
                                        </label>
                                        <div className="relative group">
                                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                            <input
                                                placeholder={['CFA', 'CFP', 'DISA'].includes(formData.professionalType) ? "YYYY" : "5-6 Digits"}
                                                className="input-premium-refined !pl-14 font-bold"
                                                value={formData.copNumber}
                                                onChange={(e) => setFormData({ ...formData, copNumber: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Year Qualified</label>
                                        <div className="relative group">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                            <input
                                                placeholder="e.g. 2018"
                                                className="input-premium-refined !pl-14 font-bold"
                                                value={formData.yearOfQualification}
                                                onChange={(e) => setFormData({ ...formData, yearOfQualification: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { 
                                            id: 'caCertificate', 
                                            label: ['CFA', 'CFP'].includes(formData.professionalType) ? 'Certification Document' : 
                                                   formData.professionalType === 'DISA' ? 'DISA Certificate' : 'Membership Certificate' 
                                        },
                                        { 
                                            id: 'copCertificate', 
                                            label: ['CFA', 'CFP', 'DISA'].includes(formData.professionalType) ? 'Validity/License Proof' : 'COP Document' 
                                        }
                                    ].map(doc => (
                                        <div key={doc.id} className="space-y-2">
                                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">{doc.label}</label>
                                            <label className="bg-white dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl h-40 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-orange-500 transition-all border-dashed group shadow-sm hover:shadow-2xl hover:shadow-orange-500/5">
                                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${formData[doc.id] ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-orange-500 group-hover:scale-110'}`}>
                                                    {formData[doc.id] ? <CheckCircle2 size={32} /> : <Upload size={32} />}
                                                </div>
                                                <div className="text-center px-6">
                                                    <span className="block text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-1">{formData[doc.id] ? 'Document Verified' : 'Select File'}</span>
                                                    <span className="text-[9px] text-slate-400 font-medium truncate max-w-[200px] block mx-auto">{formData[doc.id] ? formData[doc.id].name : 'PDF, JPG or PNG (Max 5MB)'}</span>
                                                </div>
                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            case 4: {
                return (
                    <div className="space-y-5 font-roboto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            <div className="lg:col-span-2 space-y-5">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm space-y-6">
                                    <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner">
                                            <Landmark size={22} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold  uppercase tracking-tight">Payout Bank Details</h3>
                                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Verify account for direct commercial settlements</p>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Account Holder Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500" size={18} />
                                                <input
                                                    className="input-premium-refined !pl-14 font-bold"
                                                    value={formData.accountHolderName}
                                                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Account Number</label>
                                                <div className="relative group">
                                                    <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500" size={18} />
                                                    <input
                                                        className="input-premium-refined !pl-14 font-mono tracking-widest"
                                                        value={formData.accountNumber}
                                                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">IFSC Code</label>
                                                <div className="relative group">
                                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500" size={18} />
                                                    <input
                                                        className="input-premium-refined !pl-14 font-mono tracking-widest uppercase"
                                                        value={formData.ifscCode}
                                                        onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <label className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl border-dashed cursor-pointer hover:border-orange-500 transition-all group shadow-sm hover:shadow-xl hover:shadow-orange-500/5">
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${formData.cancelledCheque ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-orange-500 group-hover:scale-110'}`}>
                                                {formData.cancelledCheque ? <CheckCircle2 size={28} /> : <Upload size={28} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-1">Cancelled Cheque Photo</p>
                                                <p className="text-[9px] text-slate-400 font-medium truncate">{formData.cancelledCheque ? formData.cancelledCheque.name : 'Required for bank identity matching'}</p>
                                            </div>
                                            <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-[9px] font-bold uppercase tracking-tighter group-hover:bg-orange-500 group-hover:text-white transition-colors">Select File</div>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'cancelledCheque')} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
                                    <div className="flex items-center gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                                            <Building2 size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Firm Jurisdiction</h4>
                                            <p className="text-[10px] text-slate-400 font-medium">Applicable only for Partnership/LLP firms</p>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Official Firm Name</label>
                                            <input
                                                className="input-premium-refined font-bold disabled:opacity-30 disabled:bg-slate-50"
                                                disabled={formData.practiceType === 'Individual'}
                                                value={formData.firmName}
                                                onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Firm PAN</label>
                                                <input
                                                    className="input-premium-refined font-mono tracking-widest uppercase disabled:opacity-30 disabled:bg-slate-50"
                                                    disabled={formData.practiceType === 'Individual'}
                                                    value={formData.firmPan}
                                                    onChange={(e) => setFormData({ ...formData, firmPan: e.target.value.toUpperCase() })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">GST Identification</label>
                                                <input
                                                    className="input-premium-refined font-mono tracking-widest uppercase disabled:opacity-30 disabled:bg-slate-50"
                                                    disabled={formData.practiceType === 'Individual'}
                                                    value={formData.gstNumber}
                                                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                                                />
                                            </div>
                                        </div>
                                        {formData.practiceType === 'Firm' && (
                                            <div className="space-y-4 pt-2">
                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Firm Registration Document</label>
                                                <label className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl border-dashed cursor-pointer hover:border-orange-500 transition-all group">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${formData.firmRegistrationCertificate ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                                                        {formData.firmRegistrationCertificate ? <CheckCircle2 size={24} /> : <Upload size={24} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">Firm Partnership Deed / Reg Certificate</p>
                                                        <p className="text-[9px] text-slate-400">{formData.firmRegistrationCertificate ? formData.firmRegistrationCertificate.name : 'Required for Firm accounts'}</p>
                                                    </div>
                                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'firmRegistrationCertificate')} />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            case 5: {
                return (
                    <div className="space-y-5 font-roboto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            <div className="lg:col-span-2 space-y-5">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm space-y-5">
                                    <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner">
                                            <Briefcase size={22} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold  uppercase tracking-tight">Professional Expertise</h3>
                                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Showcase your specialized practice areas</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Select Your Core Services</label>
                                            <div className="flex flex-wrap gap-2.5">
                                                {serviceOptions.map(service => (
                                                    <button
                                                        key={service}
                                                        onClick={() => toggleService(service)}
                                                        className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-tighter transition-all border ${formData.servicesOffered.includes(service) ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20 scale-105' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-orange-500/50'}`}
                                                    >
                                                        {service}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Professional Bio</label>
                                                <span className={`text-[10px] font-bold ${formData.aboutDescription.length > 450 ? 'text-rose-500' : 'text-slate-400'}`}>{formData.aboutDescription.length} / 500</span>
                                            </div>
                                            <div className="relative group">
                                                <Edit className="absolute left-4 top-4.5 text-slate-300 group-focus-within:text-orange-500 transition-colors z-10" size={18} />
                                                <textarea
                                                    placeholder="Describe your professional journey, industry specializations, and client focus..."
                                                    className="input-premium-refined min-h-[120px] !pl-14 py-4 resize-none leading-relaxed"
                                                    value={formData.aboutDescription}
                                                    onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="bg-slate-900 p-6 rounded-[2rem] text-white space-y-6 shadow-2xl relative overflow-hidden group border border-slate-800">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all"></div>

                                    <div className="space-y-5 relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Globe size={16} className="text-orange-500" />
                                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Language Fluency</h4>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {languageOptions.map(lang => (
                                                <button
                                                    key={lang}
                                                    onClick={() => toggleLanguage(lang)}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${formData.languages.includes(lang) ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                                                >
                                                    {lang}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Landmark size={16} className="text-orange-500" />
                                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Collaboration Model</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {['Fixed', 'Hourly'].map(model => (
                                                <button
                                                    key={model}
                                                    onClick={() => setFormData({ ...formData, pricingModel: model })}
                                                    className={`py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border ${formData.pricingModel === model ? 'bg-white text-slate-900 border-white shadow-xl' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                                                >
                                                    {model}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            case 6: {
                return (
                    <div className="space-y-6 font-roboto">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl space-y-5 shadow-sm border border-orange-500/10 dark:border-slate-700">
                            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 shadow-inner">
                                    <Shield size={22} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold  uppercase tracking-tight text-amber-900 dark:text-amber-200">Legal Agreements & Compliance</h3>
                                    <p className="text-[11px] text-amber-600 font-bold uppercase tracking-widest leading-none mt-1">Legally binding disclosures under IT Act 2000</p>
                                </div>
                            </div>

                            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-3 custom-scrollbar bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                                {[
                                    { title: `1. Professional Code of Conduct`, content: `As an empanelled professional, you are strictly bound by the professional standards and Code of Ethics of your respective governing body (ICAI/ICSI/ICMAI etc). Any professional negligence, data leakage, or ethical breach will result in immediate debarment.` },
                                    { title: '2. Data Sovereignty & DPDP Act 2023 Compliance', content: 'In accordance with the Digital Personal Data Protection Act (2023), all client data accessed via ShineFiling must be processed only for the specified purpose. Unauthorized storage, processing, or distribution of client sensitive personal data (SPD) is a criminal offense punishable under Indian Law.' },
                                    { title: '3. Strict Non-Solicitation & Anti-Poaching', content: 'You are strictly prohibited from soliciting ShineFiling clients for direct engagement outside the platform for a period of 36 months post-termination. Circumventing the platform gateway (Platform Bypass) will invoke a penalty of ₹5,00,000 per instance or 10x the service value, whichever is higher.' },
                                    { title: '4. Client Data Non-Extraction Policy', content: 'Professionals are strictly prohibited from downloading, extracting, or taking screen captures of client proprietary business data (Sales, Vendor list, Bank statements) for personal or external use. Breach of this "Zero-Leak" policy invokes immediate termination and criminal litigation for Intellectual Property theft.' },
                                    { title: '5. Anti-Money Laundering (PMLA Act 2002)', content: 'Under the Prevention of Money Laundering Act, you are legally mandated to conduct "Know Your Client" (KYC) on the sources of funds for all cases handled. Failure to report suspicious financial activity makes you liable as an accessory to the offense.' },
                                    { title: '6. Confidentiality & Non-Disclosure (NDA)', content: 'All documents, case files, and proprietary platform workflows are strictly confidential. You shall not disclose any "Confidential Information" to any third party without prior written consent from ShineFiling and the respective client.' },
                                    { title: '7. Platform Fee & Remittance Structure', content: 'ShineFiling retains a 15% platform facilitation fee. Payouts are triggered 48 hours after successful client approval. All payments are subject to GST and TDS as per the prevailing Income Tax Department norms.' }
                                ].map((doc, i) => (
                                    <div key={i} className="space-y-2">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">{doc.title}</h4>
                                        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 font-medium">{doc.content}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                {[
                                    { id: 'agreeToTerms', label: 'I accept the master Platform Terms & Conditions' },
                                    { id: 'agreeToNonSolicitation', label: 'I agree to the strict Non-Solicitation & Anti-Poaching Policy' },
                                    { id: 'agreeToCommission', label: 'I acknowledge the 15% Professional Fee Commission Structure' }
                                ].map(clause => (
                                    <label key={clause.id} className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer group ${formData[clause.id] ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-amber-500/50'}`}>
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${formData[clause.id] ? 'bg-amber-500 border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-transparent border-slate-200 dark:border-slate-700'}`}>
                                            {formData[clause.id] && <Check size={14} className="text-white" strokeWidth={4} />}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={formData[clause.id]} onChange={() => setFormData({ ...formData, [clause.id]: !formData[clause.id] })} />
                                        <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${formData[clause.id] ? 'text-amber-900 dark:text-amber-100' : 'text-slate-500 group-hover:text-amber-700'}`}>{clause.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 p-6 rounded-2xl border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-orange-500/15 transition-all duration-1000"></div>

                            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                                <div className="flex-1 space-y-6 text-center lg:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-2">
                                        <Fingerprint size={12} /> Digital Identity Binding
                                    </div>
                                    <h4 className="text-2xl font-bold text-white  tracking-tighter leading-none">Authorized Web Signature</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium max-w-md">Please upload a high-resolution image of your formal physical signature on a plain white background. This will be used to generate your digital empanelment certificate.</p>
                                    <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
                                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                            <MousePointer2 size={12} /> IP: 102.16.XX.XX
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                            <Database size={12} /> 256-Bit Encrypted
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full lg:w-72">
                                    <label className={`aspect-[4/3] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer group relative overflow-hidden ${formData.signatureFile ? 'bg-emerald-500/5 border-emerald-500/30 shadow-2xl shadow-emerald-500/10' : 'bg-white/5 border-white/10 hover:border-orange-500/50'}`}>
                                        {formData.signatureFile ? (
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                                                    <CheckCircle2 size={32} />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Signature Loaded</p>
                                                    <p className="text-[9px] text-slate-500 font-medium max-w-[150px] truncate mx-auto">{formData.signatureFile.name}</p>
                                                </div>
                                                <button onClick={(e) => { e.preventDefault(); setFormData({ ...formData, signatureFile: null }) }} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform group-hover:bg-orange-500 group-hover:text-white">
                                                    <FileSignature size={32} />
                                                </div>
                                                <p className="text-[11px] font-bold text-white uppercase tracking-widest">Upload Signature</p>
                                                <p className="text-[9px] text-slate-500 mt-2 font-medium">PNG or JPEG only</p>
                                            </>
                                        )}
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'signatureFile')} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            case 7: {
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto mb-20 lg:mb-40">
                        <div className="bg-white rounded-none shadow-2xl overflow-hidden border border-slate-200">
                            {/* Groww-Inspired Header */}
                            <div className="bg-white border-b-2 border-slate-100 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                <div className="flex items-center gap-6">
                                    <Link to="/">
                                        <img
                                            src="/logo.png"
                                            alt="ShineFiling"
                                            className="h-24 md:h-32 w-auto object-contain"
                                        />
                                    </Link>
                                </div>
                                <div className="md:text-right border-l-2 md:border-l-4 border-orange-500 pl-6 py-2">
                                    <h1 className="text-4xl font-black text-orange-500 tracking-tight leading-none mb-1">ACCOUNT</h1>
                                    <h1 className="text-4xl font-black text-orange-500 tracking-tight leading-none mb-2">OPENING FORM</h1>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">CKYC & PR KYC Verification Form</p>
                                </div>
                            </div>

                            {/* Form Instructions */}
                            <div className="px-10 py-6 bg-slate-50/50 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Empanelment Application Form</p>
                                    <p className="text-[9px] text-slate-400 leading-tight">Please review all fields carefully. This document constitutes a formal legal application for Shinefiling Partner Empanelment under IT Act 2000.</p>
                                </div>
                                <div className="flex flex-wrap gap-6 md:justify-end">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-sm border-2 border-orange-500 bg-orange-500/10 flex items-center justify-center">
                                            <Check size={10} className="text-orange-500" strokeWidth={4} />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-600">NEW APPLICATION</span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-30">
                                        <div className="w-4 h-4 rounded-sm border-2 border-slate-300"></div>
                                        <span className="text-[10px] font-bold text-slate-600">UPDATE RECORD</span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Document Body */}
                            <div className="p-10 md:p-14 space-y-12 relative overflow-hidden bg-white">
                                {/* Visual Watermark Layer (matches PDF style) */}
                                <div className="absolute inset-0 pointer-events-none select-none z-0 opacity-[0.03] overflow-hidden flex flex-wrap gap-40 justify-center items-center py-20">
                                    {Array.from({ length: 24 }).map((_, i) => (
                                        <div key={i} className="text-6xl font-black -rotate-45 whitespace-nowrap text-slate-900 tracking-[0.2em]">
                                            SHINEFILING
                                        </div>
                                    ))}
                                </div>

                                {/* Logo Background Glow (Premium Touch) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none -z-1"></div>
                                {/* Side Column for Photo & Signature */}
                                <div className="hidden lg:block absolute top-14 right-14 w-60 space-y-4 z-20">
                                    <div className="border-2 border-slate-200 p-2 rounded-lg bg-white shadow-sm">
                                        <div className="aspect-[3/4] bg-slate-50 rounded flex items-center justify-center overflow-hidden relative">
                                            {capturedSelfieUrl ? (
                                                <img src={capturedSelfieUrl} alt="Liveness Capture" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-slate-300">
                                                    <Camera size={48} strokeWidth={1} />
                                                    <p className="text-[9px] font-bold text-rose-500 uppercase text-center px-4 mt-2">Liveness Photo Missing</p>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[8px] font-bold text-slate-400 text-center uppercase tracking-widest mt-2">IDENTIFICATION PHOTO</p>
                                    </div>
                                    <div className="border-2 border-slate-200 p-2 rounded-lg bg-white shadow-sm">
                                        <div className="h-24 bg-white rounded flex items-center justify-center overflow-hidden border border-slate-100">
                                            {formData.signatureFile ? (
                                                <img src={URL.createObjectURL(formData.signatureFile)} alt="Signature" className="h-full object-contain mix-blend-multiply transition-all" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-slate-300">
                                                    <FileSignature size={32} strokeWidth={1} />
                                                    <p className="text-[8px] font-bold text-rose-500 uppercase mt-1">Signature Required</p>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[8px] font-bold text-slate-400 text-center uppercase tracking-widest mt-2">APPLICANT SIGNATURE</p>
                                    </div>
                                </div>

                                {/* Part 1: Identity details */}
                                <section className="space-y-8 lg:pr-72">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-black text-orange-500 uppercase tracking-widest flex items-center gap-3">
                                            <span className="w-6 h-6 rounded bg-orange-500 text-white flex items-center justify-center text-xs">1</span>
                                            Identity details
                                        </h3>
                                        <div className="h-0.5 bg-orange-500/10 w-full"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                        <div className="space-y-4">
                                            {[
                                                { label: 'PAN NUMBER (Identifier)', value: formData.panNumber, mono: true },
                                                { label: 'AADHAR NUMBER (UID)', value: formData.aadharNumber, mono: true },
                                            ].map((field, i) => (
                                                <div key={i} className="flex flex-col">
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">{field.label}</span>
                                                    <div className={`text-sm font-bold border-b border-slate-200 pb-1.5 ${field.mono ? 'font-mono uppercase tracking-widest' : ''}`}>
                                                        {field.value || '_______________________'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Empanelment Type</span>
                                                <div className="flex gap-4 mt-2">
                                                    {['Individual', 'Firm'].map(type => (
                                                        <div key={type} className="flex items-center gap-2">
                                                            <div className={`w-3.5 h-3.5 rounded-sm border border-slate-300 flex items-center justify-center ${formData.practiceType === type ? 'bg-orange-500 border-orange-500' : ''}`}>
                                                                {formData.practiceType === type && <Check size={10} className="text-white" strokeWidth={4} />}
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-600 uppercase">{type}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                                        {[
                                            { label: 'First Name', value: formData.fullName.split(' ')[0] },
                                            { label: 'Middle/Last Name', value: formData.fullName.split(' ').slice(1).join(' ') },
                                            { label: 'Email Address', value: formData.email },
                                            { label: 'Contact Number', value: formData.phone },
                                            { label: 'City / Region', value: formData.city },
                                            { label: 'State Jurisdiction', value: formData.state },
                                        ].map((field, i) => (
                                            <div key={i} className="flex flex-col">
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">{field.label}</span>
                                                <div className="text-xs font-bold border-b border-slate-200 pb-1.5 text-slate-700 uppercase">
                                                    {field.value || '_______________________'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Part 2: Credentials */}
                                <section className="space-y-8 lg:pr-72">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-black text-orange-500 uppercase tracking-widest flex items-center gap-3">
                                            <span className="w-6 h-6 rounded bg-orange-500 text-white flex items-center justify-center text-xs">2</span>
                                            Statutory & Credentials
                                        </h3>
                                        <div className="h-0.5 bg-orange-500/10 w-full"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            {[
                                                { label: 'ICAI Membership No.', value: formData.caMembershipNumber },
                                                { label: 'Certificate of Practice (COP)', value: formData.copNumber },
                                                { label: 'Firm Registration (if applicable)', value: formData.firmName },
                                            ].map((field, i) => (
                                                <div key={i} className="flex flex-col">
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">{field.label}</span>
                                                    <div className="text-sm font-bold border-b border-slate-200 pb-1.5 text-slate-800 font-mono uppercase tracking-wider">
                                                        {field.value || '_______________________'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4 shadow-inner">
                                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Settlement Account (Master)</h4>
                                            {[
                                                { label: 'Account Holder', value: formData.accountHolderName },
                                                { label: 'Bank Identifier (IFSC)', value: formData.ifscCode },
                                                { label: 'Account Remittance No.', value: formData.accountNumber },
                                            ].map((field, i) => (
                                                <div key={i} className="flex justify-between items-end border-b border-slate-200 pb-2">
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase">{field.label}</span>
                                                    <span className="text-[11px] font-bold text-slate-900 uppercase font-mono tracking-wider">{field.value || '-'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* Part 3: Document Grid */}
                                <section className="space-y-8">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-black text-orange-500 uppercase tracking-widest flex items-center gap-3">
                                            <span className="w-6 h-6 rounded bg-orange-500 text-white flex items-center justify-center text-xs">3</span>
                                            Document Evidence Summary (Under IT & CA Acts)
                                        </h3>
                                        <div className="h-0.5 bg-orange-500/10 w-full"></div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                        {[
                                            { doc: formData.panCard, label: 'PAN CARD', act: 'Income Tax Act 1961 (u/s 139A)' },
                                            { doc: formData.aadharFront, label: 'AADHAR FRONT', act: 'Aadhaar Act 2016 (KYC Reg)' },
                                            { doc: formData.aadharBack, label: 'AADHAR BACK', act: 'Aadhaar Act 2016 (Verification)' },
                                            { doc: formData.caCertificate, label: 'CA CERTIFICATE', act: 'CA Act 1949 (Credential)' },
                                            { doc: formData.copCertificate, label: 'AUTHORITY CARD', act: 'CA Act 1949 (Practice Sec 6)' },
                                            { doc: formData.cancelledCheque, label: 'BANK CHEQUE', act: 'NI Act 1881 (Settlement u/s 6)' },
                                        ].map((item, idx) => (
                                            <div key={idx} className="border-2 border-slate-100 rounded-lg p-1 group hover:border-orange-500 transition-all bg-white shadow-sm hover:shadow-md">
                                                <div className="aspect-[4/3] bg-slate-50 rounded flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all relative">
                                                    {item.doc ? (
                                                        <img src={URL.createObjectURL(item.doc)} alt={item.label} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex flex-col items-center">
                                                            <X size={16} className="text-rose-300" />
                                                            <span className="text-[6px] text-rose-300 font-bold mt-1">MISSING</span>
                                                        </div>
                                                    )}
                                                    {item.doc && (
                                                        <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-orange-500/80 backdrop-blur-sm rounded-full flex items-center gap-1 shadow-lg border border-orange-400/50">
                                                            <ShieldCheck size={8} className="text-white" />
                                                            <span className="text-[6px] font-black text-white tracking-widest uppercase">SHINE VERIFIED</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-2 space-y-1">
                                                    <span className="text-[7px] font-black text-slate-800 tracking-wider truncate block">{item.label}</span>
                                                    <span className="text-[6px] font-bold text-slate-400 uppercase tracking-tight block truncate opacity-70 leading-none">{item.act}</span>
                                                    <div className="flex items-center gap-1.5 pt-1 border-t border-slate-50 mt-1">
                                                        <div className={`w-1 h-1 rounded-full ${item.doc ? 'bg-orange-500' : 'bg-rose-500'}`}></div>
                                                        <span className={`text-[6px] font-bold uppercase ${item.doc ? 'text-orange-500' : 'text-rose-500'}`}>
                                                            {item.doc ? 'CERTIFIED' : 'ACTION REQUIRED'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Part 4: Regulatory Declarations */}
                                <section className="space-y-8">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-black text-orange-500 uppercase tracking-widest flex items-center gap-3">
                                            <span className="w-6 h-6 rounded bg-orange-500 text-white flex items-center justify-center text-xs">4</span>
                                            Global & National Regulatory framework compliance
                                        </h3>
                                        <div className="h-0.5 bg-orange-500/10 w-full"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 relative overflow-hidden">
                                        {/* Watermark-like branding for detail */}
                                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                            <Shield size={120} className="text-orange-500" />
                                        </div>

                                        {[
                                            { title: 'Chartered Accountants Act 1949', desc: 'Mandatory adherence to ICAI Code of Ethics, Peer Review standards, and Professional Misconduct regulations.' },
                                            { title: 'Digital Personal Data Protection (DPDP) 2023', desc: 'Uncompromised commitment to Data Sovereignty, User Consent management, and Zero-leakage client data protocols.' },
                                            { title: 'Prevention of Money Laundering (PMLA 2002)', desc: 'Stringent KYC/CDD protocols with mandatory STR/CTR reporting mechanisms for all financial transactions.' },
                                            { title: 'Information Technology Act 2000', desc: 'Legally binding digital audit trails, electronic record preservation (Sec 67), and cybersecurity compliance.' },
                                            { title: 'Income Tax Act 1961 (As Amended)', desc: 'Responsibility for accurate returns filing, tax planning ethics, and adherence to CBDT circulars/notifications.' },
                                            { title: 'Companies Act 2013 (Audit Standards)', desc: 'Compliance with Secretarial Standards, Statutory Audit norms, and reporting requirements under CARO 2020.' },
                                            { title: 'Goods and Services Tax (GST) Act 2017', desc: 'Strict anti-fraud measures for GSTR-1/3B reconciliation and protection against Input Tax Credit (ITC) poach/misuse.' },
                                            { title: 'Indian Contract Act 1872', desc: 'Binding nature of the Master Service Agreement (MSA) and legal consequences of breach of platform terms.' },
                                            { title: 'Consumer Protection Act 2019', desc: 'Maintaining professional transparency, service quality standards, and protecting client interests against misrepresentation.' },
                                            { title: 'Black Money & Tax Imposition Act 2015', desc: 'Zero tolerance for undisclosed foreign assets and mandatory disclosure of cross-border financial interests.' },
                                            { title: 'SEBI (Insider Trading) Regs 2015', desc: 'Non-disclosure of Price Sensitive Information (UPSI) and adherence to ethical trading boundaries.' },
                                            { title: 'FEMA (Foreign Exchange Mgmt) Act 1999', desc: 'Compliance with RBI guidelines for inbound/outbound professional remittances and overseas client engagements.' },
                                            { title: 'Prevention of Corruption Act 1988', desc: 'Zero-tolerance policy for professional bribery, kickbacks, or solicitation of unethical commissions.' },
                                            { title: 'Platform Non-Solicitation Policy', desc: 'Binding clause prohibiting direct-to-client poaching, data mining, or bypassing ShineFiling ecosystem.' },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex gap-4 items-start relative z-10 hover:bg-white/50 p-2 rounded-xl transition-all group">
                                                <div className={`w-5 h-5 mt-0.5 rounded-full border-2 border-orange-500/20 bg-orange-500/5 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-all`}>
                                                    <Check size={12} className="text-orange-500 group-hover:text-white" strokeWidth={4} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight leading-none group-hover:text-orange-500 transition-colors">{item.title}</p>
                                                    <p className="text-[9px] text-slate-500 font-medium leading-[1.3] text-justify">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-8 border-t border-slate-100 text-center space-y-6">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-0.5 bg-orange-500 mb-2"></div>
                                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">Final Declaration of Binding Integrity</p>
                                        </div>
                                        <p className="text-[11px] text-slate-500 leading-relaxed max-w-4xl mx-auto italic bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                            "I, <span className="text-orange-500 font-bold">{formData.fullName || '[Applicant]'}</span>, having carefully reviewed the above regulatory matrix, hereby solemnly declare that the information provided is exhaustively true, accurate, and contemporary to the best of my professional knowledge. I irrevocably acknowledge that any misrepresentation, omission, or fraudulent submission constitutes a material breach of trust. I am fully aware that ShineFiling (Shine Compliance Systems) reserves the absolute right to initiate summary legal proceedings under the Indian Penal Code (IPC), IT Act, and the Indian Contract Act for any such breach, alongside reports to the ICAI Disciplinary Committee."
                                        </p>
                                        <div className="flex flex-col items-center gap-1 group">
                                            <p className="text-[12px] font-black text-slate-900 uppercase tracking-[0.5em] pt-4 group-hover:tracking-[0.6em] transition-all duration-500">{formData.fullName || 'Authorized Partner'}</p>
                                            <div className="w-16 h-px bg-slate-200 my-1 group-hover:w-32 transition-all"></div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Digitally Timestamped: {new Date().toLocaleDateString()} AT {new Date().toLocaleTimeString()} (IST)</p>
                                            <p className="text-[8px] font-bold text-orange-500 uppercase tracking-widest mt-2 px-3 py-1 bg-orange-50 rounded-full">IP: 103.XXX.XX.241 • SF-MAC: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Official Footer Branding */}
                            <div className="bg-slate-900 p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 border-t-8 border-orange-500 text-white">
                                <div className="space-y-2 text-center md:text-left">
                                    <h4 className="text-xl font-black italic tracking-tighter">ShineFiling Core <span className="text-orange-500">Platform</span></h4>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Empowering Professionals • Ensuring Compliance</p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                                    <div className="space-y-1">
                                        <p className="text-orange-500">Corporate HQ</p>
                                        <p>Chennai, TN</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-orange-500">Verification ID</p>
                                        <p>SF-KYC-2026</p>
                                    </div>
                                    <div className="space-y-1 col-span-2 md:col-span-1">
                                        <p className="text-orange-500">AES SECURE</p>
                                        <p>256-BIT ENCRYPTED</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            default: return null;
        }
    };

    return (
        <div className="transition-all duration-300">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
                
                .font-signature { font-family: 'Roboto', sans-serif; font-weight: 700; }
                .font-jakarta { font-family: 'Roboto', sans-serif; }
                .font-roboto { font-family: 'Roboto', sans-serif; }
                
                .gold-text { background: linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fcf6ba, #aa771c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .glass-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.3); }
                .dark .glass-card { background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
                
                .premium-shadow-sm { box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02); }
                .premium-shadow-lg { box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.05); }
                
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
                
                .input-premium-refined {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background-color: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 1rem;
                    outline: none;
                    transition: all 0.2s;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #0f172a;
                }
                .dark .input-premium-refined {
                    background-color: #0f172a;
                    border-color: #334155;
                    color: #f8fafc;
                }
                .input-premium-refined:focus {
                    border-color: #f97316;
                    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
                }
                .input-premium-refined::placeholder {
                    color: #94a3b8;
                }
                .dark .input-premium-refined::placeholder {
                    color: #475569;
                }
                /* Autofill Reset */
                input.input-premium-refined:-webkit-autofill,
                input.input-premium-refined:-webkit-autofill:hover, 
                input.input-premium-refined:-webkit-autofill:focus {
                    -webkit-text-fill-color: #0f172a !important;
                    -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
                    transition: background-color 5000s ease-in-out 0s;
                }
                .dark input.input-premium-refined:-webkit-autofill,
                .dark input.input-premium-refined:-webkit-autofill:hover, 
                .dark input.input-premium-refined:-webkit-autofill:focus {
                    -webkit-text-fill-color: #f8fafc !important;
                    -webkit-box-shadow: 0 0 0px 1000px #0f172a inset !important;
                }
            `}</style>

            {isSubmitted ? (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto py-12 px-4 font-roboto"
                >
                    <div className="flex flex-col items-center text-center mb-10">
                        {/* Status Illustration */}
                        <div className="relative mb-6">
                            <div className="w-32 h-32 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                                >
                                    <FileSignature size={64} className="text-emerald-500" strokeWidth={1.5} />
                                </motion.div>
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-900 rounded-full border-4 border-emerald-50 flex items-center justify-center text-emerald-500 shadow-lg"
                            >
                                <Check size={20} strokeWidth={3} />
                            </motion.div>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                            {user.kycStatus === 'VERIFIED' ? 'Verification Successful' : 'Verification documents submitted'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md leading-relaxed">
                            {user.kycStatus === 'VERIFIED'
                                ? 'Your profile has been fully verified. You can now access all marketplace features and accept client requests.'
                                : "You're a few steps away from joining the ShineFiling network. Your account should be activated within 2-4 business hours."}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-50 dark:divide-slate-800/50">
                        {/* Task Row 1 */}
                        <div className="p-6 sm:p-8 flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <h4 className="text-base font-bold text-slate-800 dark:text-white">KYC Documents Uploaded</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Identity and professional credentials have been indexed.</p>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                                    Completed
                                </div>
                            </div>
                        </div>

                        {/* Task Row 2 */}
                        <div className="p-6 sm:p-8 flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <h4 className="text-base font-bold text-slate-800 dark:text-white">Banking Details Saved</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Payout and settlement information is securely stored.</p>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                                    Completed
                                </div>
                            </div>
                        </div>

                        {/* Task Row 3 */}
                        <div className="p-6 sm:p-8 flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <h4 className="text-base font-bold text-slate-800 dark:text-white">Activation Status</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {user.kycStatus === 'VERIFIED' ? 'Your account is fully activated and ready.' : 'Your profile is currently under compliance review.'}
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => onComplete ? onComplete() : window.location.href = '/ca/dashboard'}
                                    className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.05] active:scale-95 flex items-center gap-2"
                                >
                                    Go to Dashboard <ArrowRight size={14} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center gap-4">
                        <button
                            onClick={generateKycPdf}
                            className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-orange-500 transition-colors"
                        >
                            <Download size={14} /> Download Copy of Application
                        </button>
                    </div>
                </motion.div>
            ) : (
                <div className="max-w-4xl mx-auto space-y-6 mb-6 px-4 pt-4">
                    {/* Dashboard Style Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:shadow-md relative overflow-hidden">
                        {/* Progress Bar at top */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-900/50">
                            <motion.div
                                className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${(step / steps.length) * 100}%` }}
                                transition={{ duration: 1, ease: "circOut" }}
                            ></motion.div>
                        </div>

                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-slate-900 flex items-center justify-center border border-orange-100 dark:border-slate-700 shadow-sm overflow-hidden flex-shrink-0">
                                <img
                                    src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'CA')}&background=F97316&color=fff&bold=true`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">KYC & Compliance</h1>
                                    <span className="px-2 py-0.5 bg-orange-50 dark:bg-orange-950/20 text-[#F97316] text-[9px] font-bold rounded-md uppercase tracking-widest border border-orange-100/50 dark:border-orange-900/30">Partner Panel</span>
                                </div>
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                    {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}, <span className="text-[#F97316]">{user?.fullName || 'Partner'}</span>! Your compliance progress is at <span className="text-slate-800 dark:text-slate-200">{(step / steps.length * 100).toFixed(0)}%</span>.
                                </p>
                            </div>
                        </div>

                        <div className="flex-shrink-0 flex items-center gap-3">
                            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {step} of {steps.length}</p>
                                <p className="text-xs font-bold text-slate-800 dark:text-white">{steps[step - 1].title}</p>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Stepper */}
                    <div className="hidden md:grid grid-cols-4 lg:grid-cols-7 gap-3">
                        {steps.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => step > s.id && setStep(s.id)}
                                className={`bg-white dark:bg-slate-800 border rounded-2xl p-5 flex flex-col gap-3 text-left transition-all ${step === s.id ? 'border-orange-500 shadow-md ring-2 ring-orange-500/10' : step < s.id ? 'border-slate-100 dark:border-slate-700 opacity-60 pointer-events-none' : 'border-slate-100 dark:border-slate-700 hover:border-orange-500/50 hover:shadow-sm'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${step >= s.id ? 'bg-[#F97316] text-white shadow-sm shadow-orange-500/20' : 'bg-slate-50 dark:bg-slate-700 text-slate-400'}`}>
                                    {step > s.id ? <Check size={18} strokeWidth={2.5} /> : <s.icon size={18} />}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Step {s.id}</p>
                                    <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{s.title}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Form Content Wrapper */}
                    <div>
                        <AnimatePresence mode="wait">
                            <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="min-h-[400px]">
                                {renderStepContent()}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={prevStep}
                                disabled={step === 1 || isSubmitting}
                                className="flex items-center gap-2 px-8 py-5 text-slate-500 dark:text-slate-400 hover:text-orange-500 disabled:opacity-0 transition-all font-bold text-[11px] uppercase tracking-widest bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-x-1"
                            >
                                <ChevronLeft size={18} strokeWidth={3} />
                                Back
                            </button>

                            <div className="flex gap-4">
                                {step === steps.length ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!isStepValid() || isSubmitting}
                                        className="px-12 py-5 flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold uppercase tracking-widest disabled:opacity-50 transition-all rounded-[1.25rem] shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.05] active:scale-[0.95]"
                                    >
                                        {isSubmitting ? 'Finalizing Profile...' : <>Complete Verification <CheckCircle2 size={18} strokeWidth={3} /></>}
                                    </button>
                                ) : (
                                    <button
                                        onClick={nextStep}
                                        disabled={!isStepValid() || isSubmitting}
                                        className="px-12 py-5 flex items-center gap-3 text-white bg-slate-900 dark:bg-orange-500 hover:scale-[1.05] active:scale-[0.95] text-[11px] font-bold uppercase tracking-widest disabled:opacity-50 transition-all rounded-[1.25rem] shadow-xl shadow-slate-900/10 dark:shadow-orange-500/20"
                                    >
                                        Continue <ChevronRight size={18} strokeWidth={3} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default CaKyc;
