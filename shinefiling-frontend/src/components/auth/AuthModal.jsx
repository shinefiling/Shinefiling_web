import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Mail, Lock, Smartphone, ChevronRight, ChevronDown, 
    Shield, CheckCircle, ArrowRight, User, Users,
    AlertCircle, Eye, EyeOff, Building, Briefcase
} from 'lucide-react';
import axios from 'axios';
import { loginUser, signupUser, verifyOtp, resendOtp, googleLogin, forgotPassword, resetPassword } from '../../api';
import { useGoogleLogin } from '@react-oauth/google';

const AuthModal = ({ isOpen, onClose, initialMode = 'login', initialRole = null, onAuthSuccess }) => {
    const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'otp'
    const [step, setStep] = useState('details'); // 'details' or 'otp' for signup
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otp, setOtp] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        mobile: '',
        role: initialRole || 'USER',
        businessName: '',
        city: '',
        specialization: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [signupStep, setSignupStep] = useState(initialRole ? 'details' : 'selection'); // Skip selection if initialRole is provided

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setStep('details');
            setSignupStep(initialRole ? 'details' : 'selection');
            setError('');
            setFormData({
                fullName: '',
                email: '',
                password: '',
                mobile: '',
                role: initialRole || 'USER',
                businessName: '',
                city: '',
                specialization: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [isOpen, initialMode, initialRole]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSignupRoleSelect = (role) => {
        setFormData({ ...formData, role });
        setSignupStep('details');
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setLoading(true);
                // 1. Fetch User Info using Access Token
                const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });

                const { email, name, sub: googleId } = userInfoResponse.data;

                // 2. Send Profile to Backend - Pass the selected role
                const data = await googleLogin({
                    email,
                    name,
                    googleId,
                    role: formData.role // Include selected role
                });

                // Robust User/Token Handling
                const userObj = data.user || data;
                const token = data.token || userObj.token;
                const finalUser = { ...userObj, token };

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(finalUser));
                onAuthSuccess(finalUser);
                onClose();
            } catch (err) {
                console.error("Google Login Error:", err);
                setError(err.response?.data?.message || 'Google login failed');
            } finally {
                setLoading(false);
            }
        },
        onError: error => console.error('Login Failed:', error)
    });

    const validateForm = () => {
        if (mode === 'signup' && step === 'details') {
            if (!formData.fullName.trim()) return "Full name is required";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Invalid email format";
            if (formData.password.length < 6) return "Password must be at least 6 characters";
            if (formData.password !== formData.confirmPassword) return "Passwords do not match";
            if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) return "Invalid mobile number (10 digits required)";
            
            if (formData.role === 'AGENT' && !formData.businessName.trim()) return "Agency/Business name is required";
            if (formData.role === 'CA' && !formData.specialization) return "Please select your profession";
            if ((formData.role === 'AGENT' || formData.role === 'CA') && !formData.city.trim()) return "City is required";
        }
        if (mode === 'login' && loginMethod === 'email') {
            if (!formData.email || !formData.password) return "All fields are required";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            if (mode === 'signup') {
                if (step === 'details') {
                    // Request OTP
                    await signupUser({ ...formData, step: 'initiate' });
                    setStep('otp');
                    setLoading(false);
                } else {
                    // Verify OTP and Finalize Signup
                    if (!otp || otp.length < 6) {
                        setError("Please enter a valid 6-digit OTP");
                        setLoading(false);
                        return;
                    }
                    const data = await verifyOtp({ email: formData.email, otp, type: 'signup' });

                    const userObj = data.user || data;
                    const token = data.token || userObj.token;
                    const finalUser = { ...userObj, token };

                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(finalUser));
                    onAuthSuccess(finalUser);
                    onClose();
                }
            } else if (mode === 'forgot') {
                // ... same as before
                if (step === 'email') {
                    await forgotPassword(formData.email);
                    setStep('otp');
                    setLoading(false);
                } else if (step === 'otp') {
                    setStep('reset');
                    setLoading(false);
                } else if (step === 'reset') {
                    if (formData.newPassword !== formData.confirmPassword) {
                        throw new Error("Passwords do not match");
                    }
                    await resetPassword({
                        email: formData.email,
                        otp: otp,
                        newPassword: formData.newPassword
                    });
                    setError('');
                    alert("Password reset successful! You can now login.");
                    setMode('login');
                    setStep('details');
                    setLoading(false);
                }
            } else {
                // Login
                if (loginMethod === 'email') {
                    const data = await loginUser({ email: formData.email, password: formData.password });

                    const userObj = data.user || data;
                    const token = data.token || userObj.token;
                    const finalUser = { ...userObj, token };

                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(finalUser));
                    onAuthSuccess(finalUser);
                    onClose();
                } else {
                    if (step === 'details') {
                        setStep('otp');
                        setLoading(false);
                    }
                }
            }
        } catch (err) {
            console.error("Auth Error:", err);
            setError(err.response?.data?.message || err.message || 'Authentication failed');
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#043E52]/60 backdrop-blur-sm"
                />

                {/* Modal Container - Compact Split Design */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-[800px] h-[500px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
                >
                    {/* Left Side - Brand Panel */}
                    <div className="hidden md:flex w-[40%] bg-[#043E52] relative flex-col justify-between p-8 text-white overflow-hidden">
                        {/* Background Effects */}
                        <div className="absolute top-0 left-0 w-full h-full z-0">
                            <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#ED6E3F] rounded-full blur-[80px] opacity-30"></div>
                            <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#022c3a] rounded-full blur-[60px] opacity-50"></div>
                            <div className="w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                        <Building size={20} className="text-white" />
                                    </div>
                                    <span className="font-bold text-xl tracking-wide">ShineFiling</span>
                                </div>
                                <h2 className="text-3xl font-bold leading-tight mb-3 text-[#ED6E3F]">
                                    {mode === 'login' ? 'Welcome Back!' : mode === 'signup' ? 'Start Your Journey' : 'Reset Password'}
                                </h2>
                                <p className="text-white/70 text-xs leading-relaxed max-w-xs">
                                    {mode === 'forgot' ? 'Get back into your account easily.' : 'Experience the easiest way to manage your business compliance.'}
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-[#043E52] flex items-center justify-center text-[8px] font-bold text-[#043E52]">
                                                <User size={10} />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold text-[#ED6E3F] ml-2">15k+ Users</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form Panel */}
                    <div className="flex-1 bg-white relative flex flex-col h-full w-full">
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 text-slate-400 hover:text-[#ED6E3F] hover:bg-orange-50 p-2 rounded-full transition-all group"
                        >
                            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 w-full">
                            <div className="max-w-xs mx-auto pt-2">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-[#043E52] mb-1">
                                        {mode === 'login' ? 'Sign In' :
                                            mode === 'signup' ? (signupStep === 'selection' ? 'Choose Account Type' : step === 'details' ? 'Create Account' : 'Verify OTP') :
                                                (step === 'email' ? 'Forgot Password' : step === 'otp' ? 'Validate OTP' : 'New Password')}
                                    </h3>
                                    <p className="text-slate-500 text-xs font-semibold">
                                        {mode === 'login'
                                            ? 'Enter your credentials to access.'
                                            : mode === 'signup' ? (signupStep === 'selection' ? 'Select how you want to use ShineFiling' : 'Fill in your details to get started.') : 'Follow steps to reset your password.'}
                                    </p>
                                </div>

                                {error && (
                                    <div className="mb-4 text-xs font-bold text-red-500 bg-red-50 p-3 rounded-lg flex items-center gap-2 border border-red-100">
                                        <AlertCircle size={14} /> {error}
                                    </div>
                                )}

                                {mode === 'signup' && signupStep === 'selection' ? (
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-3">
                                            {[
                                                {
                                                    id: 'AGENT',
                                                    title: 'Business Agent / Partner',
                                                    desc: 'Refer clients, manage services & earn commissions',
                                                    icon: Users,
                                                    color: 'text-emerald-600',
                                                    bgColor: 'bg-emerald-50'
                                                },
                                                {
                                                    id: 'CA',
                                                    title: 'Professional / Freelancer',
                                                    desc: 'Provide CA, Legal or Professional services as an expert',
                                                    icon: Briefcase,
                                                    color: 'text-indigo-600',
                                                    bgColor: 'bg-indigo-50'
                                                },
                                                {
                                                    id: 'USER',
                                                    title: 'Individual / Company',
                                                    desc: 'Register business, file taxes or manage compliance',
                                                    icon: Building,
                                                    color: 'text-blue-600',
                                                    bgColor: 'bg-blue-50'
                                                }
                                            ].map((option) => (
                                                <div 
                                                    key={option.id}
                                                    onClick={() => handleSignupRoleSelect(option.id)}
                                                    className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex items-center gap-4 ${formData.role === option.id ? 'border-[#ED6E3F] bg-orange-50/30' : 'border-slate-50 hover:border-slate-200 bg-white'}`}
                                                >
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${option.bgColor} ${option.color} group-hover:scale-110 transition-transform`}>
                                                        <option.icon size={20} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-[#043E52] text-sm mb-0.5">{option.title}</h4>
                                                        <p className="text-[10px] text-slate-500 font-medium leading-tight">{option.desc}</p>
                                                    </div>
                                                    <div className="shrink-0 flex items-center justify-center">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.role === option.id ? 'border-[#ED6E3F] bg-[#ED6E3F]' : 'border-slate-200'}`}>
                                                            {formData.role === option.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="text-center mt-8">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                Already have an account?
                                                <button
                                                    onClick={() => setMode('login')}
                                                    className="text-[#ED6E3F] ml-2 font-black hover:underline tracking-tight"
                                                >
                                                    Sign In
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                                        {mode === 'signup' && (
                                            <div className="mb-4 flex items-center justify-between bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                                <div className="flex items-center gap-3 pl-2">
                                                    <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#ED6E3F]">
                                                        {formData.role === 'AGENT' ? <Users size={14} /> : formData.role === 'CA' ? <Briefcase size={14} /> : <Building size={14} />}
                                                    </div>
                                                    <span className="text-[9px] font-black uppercase text-[#043E52] tracking-widest">
                                                        {formData.role === 'AGENT' ? 'Agent / Partner' : formData.role === 'CA' ? 'Freelancer' : 'Company'}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setSignupStep('selection')}
                                                    className="px-2.5 py-1 rounded-xl bg-white text-[8px] font-black text-[#ED6E3F] hover:bg-[#ED6E3F] hover:text-white transition-all uppercase tracking-widest border border-slate-50"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        )}

                                        {mode === 'signup' && step === 'details' && (
                                             <div className="space-y-3">
                                                 <div className="space-y-1">
                                                     <label className="text-[10px] font-bold text-slate-500 ml-1">Full Name</label>
                                                     <input
                                                         type="text"
                                                         name="fullName"
                                                         value={formData.fullName}
                                                         onChange={handleChange}
                                                         className="w-full h-11 border-2 border-slate-50 rounded-xl px-4 text-xs font-bold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] transition-all bg-slate-50/50 focus:bg-white placeholder:text-slate-400"
                                                         placeholder="Enter your full name"
                                                         required
                                                     />
                                                 </div>
                                                 <div className="space-y-1">
                                                     <label className="text-[10px] font-bold text-slate-500 ml-1">Email Address</label>
                                                     <input
                                                         type="email"
                                                         name="email"
                                                         value={formData.email}
                                                         onChange={handleChange}
                                                         className="w-full h-11 border-2 border-slate-50 rounded-xl px-4 text-xs font-bold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] transition-all bg-slate-50/50 focus:bg-white placeholder:text-slate-400"
                                                         placeholder="email@example.com"
                                                         required
                                                     />
                                                 </div>
                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                     <div className="space-y-1">
                                                         <label className="text-[10px] font-bold text-slate-500 ml-1">Mobile Number</label>
                                                         <input
                                                             type="tel"
                                                             name="mobile"
                                                             value={formData.mobile}
                                                             onChange={handleChange}
                                                             className="w-full h-11 border-2 border-slate-50 rounded-xl px-4 text-xs font-bold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] transition-all bg-slate-50/50 focus:bg-white placeholder:text-slate-400"
                                                             placeholder="10-digit number"
                                                             required
                                                         />
                                                     </div>
                                                     <div className="space-y-1">
                                                         <label className="text-[10px] font-bold text-slate-500 ml-1">Password</label>
                                                         <input
                                                             type="password"
                                                             name="password"
                                                             value={formData.password}
                                                             onChange={handleChange}
                                                             className="w-full h-11 border-2 border-slate-50 rounded-xl px-4 text-xs font-bold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] transition-all bg-slate-50/50 focus:bg-white placeholder:text-slate-400"
                                                             placeholder="••••••••"
                                                             required
                                                         />
                                                     </div>
                                                 </div>

                                                 {formData.role === 'AGENT' && (
                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                         <div className="space-y-1">
                                                             <label className="text-[10px] font-bold text-slate-500 ml-1">Agency / Business Name</label>
                                                             <input
                                                                 type="text"
                                                                 name="businessName"
                                                                 value={formData.businessName}
                                                                 onChange={handleChange}
                                                                 className="w-full h-11 border-2 border-slate-50 rounded-xl px-4 text-xs font-bold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] transition-all bg-slate-50/50 focus:bg-white placeholder:text-slate-400"
                                                                 placeholder="e.g. Shine Services Agency"
                                                                 required
                                                             />
                                                         </div>
                                                         <div className="space-y-1">
                                                             <label className="text-[10px] font-bold text-slate-500 ml-1">City of Operation</label>
                                                             <input
                                                                 type="text"
                                                                 name="city"
                                                                 value={formData.city}
                                                                 onChange={handleChange}
                                                                 className="w-full h-11 border-2 border-slate-50 rounded-xl px-4 text-xs font-bold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] transition-all bg-slate-50/50 focus:bg-white placeholder:text-slate-400"
                                                                 placeholder="e.g. Chennai"
                                                                 required
                                                             />
                                                         </div>
                                                     </div>
                                                 )}

                                                 {formData.role === 'CA' && (
                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                         <div className="space-y-1">
                                                             <label className="text-[10px] font-bold text-slate-500 ml-1">Your Profession</label>
                                                             <div className="relative">
                                                                 <select
                                                                     name="specialization"
                                                                     value={formData.specialization}
                                                                     onChange={handleChange}
                                                                     className="w-full h-11 border-2 border-slate-50 rounded-xl px-4 text-xs font-bold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] transition-all bg-slate-50/50 focus:bg-white appearance-none cursor-pointer"
                                                                     required
                                                                 >
                                                                     <option value="">Select Profession</option>
                                                                     <option value="CA">Chartered Accountant (CA)</option>
                                                                     <option value="CS">Company Secretary (CS)</option>
                                                                     <option value="LAWYER">Advocate / Lawyer</option>
                                                                     <option value="TAX_CONSULTANT">Tax Consultant</option>
                                                                     <option value="BUSINESS_CONSULTANT">Business Consultant</option>
                                                                     <option value="OTHER">Other Professional</option>
                                                                 </select>
                                                                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                                     <ChevronDown size={14} />
                                                                 </div>
                                                             </div>
                                                         </div>
                                                         <div className="space-y-1">
                                                             <label className="text-[10px] font-bold text-slate-500 ml-1">City of Operation</label>
                                                             <input
                                                                 type="text"
                                                                 name="city"
                                                                 value={formData.city}
                                                                 onChange={handleChange}
                                                                 className="w-full h-11 border-2 border-slate-50 rounded-xl px-4 text-xs font-bold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] transition-all bg-slate-50/50 focus:bg-white placeholder:text-slate-400"
                                                                 placeholder="e.g. Chennai"
                                                                 required
                                                             />
                                                         </div>
                                                     </div>
                                                 )}

                                                 <div className="space-y-1">
                                                     <label className="text-[10px] font-bold text-slate-500 ml-1">Confirm Password</label>
                                                     <input
                                                         type="password"
                                                         name="confirmPassword"
                                                         value={formData.confirmPassword}
                                                         onChange={handleChange}
                                                         className="w-full h-11 border-2 border-slate-50 rounded-xl px-4 text-xs font-bold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] transition-all bg-slate-50/50 focus:bg-white placeholder:text-slate-400"
                                                         placeholder="Re-enter password"
                                                         required
                                                     />
                                                 </div>
                                                 <div className="flex items-start gap-2 pt-1 px-1">
                                                     <input type="checkbox" required className="mt-1 accent-[#ED6E3F]" id="terms" />
                                                     <label htmlFor="terms" className="text-[10px] text-slate-500 leading-tight">
                                                         I agree to the <span className="text-[#ED6E3F] font-bold">Terms of Service</span> and <span className="text-[#ED6E3F] font-bold">Privacy Policy</span>.
                                                     </label>
                                                 </div>
                                             </div>
                                         )}

                                         {mode === 'login' && step === 'details' && (
                                             <div className="space-y-4">
                                                 <div className="space-y-1">
                                                     <label className="text-[10px] font-bold text-slate-500 ml-1">Email Address</label>
                                                     <input
                                                         type="email"
                                                         name="email"
                                                         value={formData.email}
                                                         onChange={handleChange}
                                                         className="w-full h-11 border-2 border-slate-50 rounded-xl px-4 text-xs font-bold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] transition-all bg-slate-50/50 focus:bg-white placeholder:text-slate-400"
                                                         placeholder="email@example.com"
                                                         required
                                                     />
                                                 </div>
                                                 <div className="space-y-1">
                                                     <div className="flex justify-between items-center px-1">
                                                         <label className="text-[10px] font-bold text-slate-500">Password</label>
                                                         <button type="button" onClick={() => { setMode('forgot'); setStep('email'); }} className="text-[9px] font-bold text-[#ED6E3F] hover:underline uppercase">Forgot?</button>
                                                     </div>
                                                     <div className="relative">
                                                         <input
                                                             type={showPassword ? "text" : "password"}
                                                             name="password"
                                                             value={formData.password}
                                                             onChange={handleChange}
                                                             className="w-full h-11 border-2 border-slate-50 rounded-xl pl-4 pr-12 text-xs font-bold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] transition-all bg-slate-50/50 focus:bg-white placeholder:text-slate-400"
                                                             placeholder="••••••••"
                                                             required
                                                         />
                                                         <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ED6E3F]">
                                                             {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                         </button>
                                                     </div>
                                                 </div>
                                             </div>
                                         )}

                                         {step === 'otp' && (
                                             <div className="space-y-6 py-4 text-center">
                                                 <div>
                                                     <p className="text-xs text-slate-600 font-medium">Verify your email</p>
                                                     <p className="text-xs font-bold text-[#043E52]">{formData.email}</p>
                                                 </div>
                                                 <div className="relative">
                                                     <input
                                                         type="text"
                                                         maxLength="6"
                                                         value={otp}
                                                         onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                         className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-3xl font-black focus:outline-none focus:border-[#ED6E3F] transition-all tracking-[0.2em] text-[#043E52]"
                                                         placeholder="000000"
                                                         required
                                                         autoFocus
                                                     />
                                                 </div>
                                                 <div className="flex flex-col gap-2">
                                                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Didn't receive code?</p>
                                                     <button 
                                                        type="button" 
                                                        onClick={async () => {
                                                            try {
                                                                await resendOtp(formData.email);
                                                                alert("New OTP sent!");
                                                            } catch(err) {
                                                                setError(err.message);
                                                            }
                                                        }}
                                                        className="text-[10px] font-black text-[#ED6E3F] hover:underline uppercase tracking-widest"
                                                     >
                                                         Resend Now
                                                     </button>
                                                 </div>
                                             </div>
                                         )}

                                         {mode === 'forgot' && step === 'email' && (
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-500 ml-1">Account Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full h-11 border-2 border-slate-50 rounded-xl px-4 text-xs font-bold"
                                                    placeholder="Enter your registered email"
                                                    required
                                                />
                                            </div>
                                         )}

                                         {(mode === 'forgot' || mode === 'reset') && step === 'reset' && (
                                             <div className="space-y-4">
                                                 <div className="space-y-1">
                                                     <label className="text-[10px] font-bold text-slate-500 ml-1">New Password</label>
                                                     <input
                                                         type="password"
                                                         name="newPassword"
                                                         value={formData.newPassword}
                                                         onChange={handleChange}
                                                         className="w-full h-11 border-2 border-slate-50 rounded-xl px-4 text-xs font-bold"
                                                         required
                                                     />
                                                 </div>
                                                 <div className="space-y-1">
                                                     <label className="text-[10px] font-bold text-slate-500 ml-1">Confirm New Password</label>
                                                     <input
                                                         type="password"
                                                         name="confirmPassword"
                                                         value={formData.confirmPassword}
                                                         onChange={handleChange}
                                                         className="w-full h-11 border-2 border-slate-50 rounded-xl px-4 text-xs font-bold"
                                                         required
                                                     />
                                                 </div>
                                             </div>
                                         )}

                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full h-12 bg-[#ED6E3F] text-white rounded-2xl font-black text-sm hover:bg-[#d55f34] transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                                            >
                                                {loading ? 'Processing...' : (
                                                    <>
                                                        {mode === 'login' ? 'Sign In' : mode === 'signup' ? (step === 'details' ? 'Create Account' : 'Verify OTP') :
                                                            (step === 'email' ? 'Send OTP' : step === 'otp' ? 'Continue' : 'Update Password')}
                                                        <ArrowRight size={18} strokeWidth={3} />
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <div className="mt-8 flex flex-col gap-4">
                                            {step === 'details' && (
                                                <>
                                                    <div className="relative">
                                                        <div className="absolute inset-0 flex items-center">
                                                            <div className="w-full border-t border-slate-100"></div>
                                                        </div>
                                                        <div className="relative flex justify-center text-[10px]">
                                                            <span className="px-2 bg-white text-slate-300 font-black uppercase tracking-widest">Or Secure Link</span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleGoogleLogin()}
                                                        className="w-full h-10 border-2 border-slate-50 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all font-bold text-xs text-slate-600 bg-white"
                                                    >
                                                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
                                                        <span>Google Secure</span>
                                                    </button>
                                                </>
                                            )}

                                            <div className="text-center">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                    {mode === 'login' ? "New to ShineFiling?" : "Already a member?"}
                                                    <button
                                                        onClick={mode === 'login' ? () => { setMode('signup'); setSignupStep('selection'); } : () => setMode('login')}
                                                        className="text-[#ED6E3F] ml-2 hover:underline tracking-tight"
                                                    >
                                                        {mode === 'login' ? 'Sign Up' : 'Log In'}
                                                    </button>
                                                </p>
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Scrollbar CSS */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #e2e8f0;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #cbd5e1;
                    }
                `}} />
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
