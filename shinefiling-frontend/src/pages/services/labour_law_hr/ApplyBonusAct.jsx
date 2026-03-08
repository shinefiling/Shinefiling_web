import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Upload, AlertTriangle, FileText, ArrowRight, CreditCard, Award, AlertCircle, Plus, Trash2, Calculator, X, IndianRupee } from 'lucide-react';
import { uploadFile, submitBonusAct } from '../../../api';

const ApplyBonusAct = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadingFiles, setUploadingFiles] = useState({});
    const [eligibilityWarning, setEligibilityWarning] = useState('');

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        userEmail: user.email || '',
        businessName: '',
        companyType: 'COMPANY',
        state: 'MAHARASHTRA',
        employeeCount: '',
        financialYear: '2023-2024',
        bonusPercentage: '8.33',
        allocableSurplus: '',
        totalBonusPayable: '',
        paymentMode: 'BANK',
        paymentDate: '',
        employees: [],
        uploadedDocuments: []
    });

    const [newEmployee, setNewEmployee] = useState({
        name: '',
        employeeId: '',
        basicSalary: '',
        daAmount: '',
        workingDays: '365',
        isEligible: true,
        bonusAmount: 0
    });

    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/labour-law/bonus-act/apply` } });
        }
    }, [isLoggedIn, navigate, isModal]);

    useEffect(() => {
        if (formData.employeeCount) {
            const count = parseInt(formData.employeeCount);
            if (count < 20) {
                setEligibilityWarning('⚠️ Bonus Act applies to establishments with 20+ employees. Your application may not be applicable.');
            } else {
                setEligibilityWarning('');
            }
        }
    }, [formData.employeeCount]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleEmployeeChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        const updatedEmployee = { ...newEmployee, [name]: newValue };

        if (name === 'basicSalary' || name === 'daAmount') {
            const basic = parseFloat(updatedEmployee.basicSalary || 0);
            const da = parseFloat(updatedEmployee.daAmount || 0);
            const totalSalary = basic + da;
            updatedEmployee.isEligible = totalSalary <= 21000;
        }

        setNewEmployee(updatedEmployee);
    };

    const calculateBonus = (employee) => {
        const basic = parseFloat(employee.basicSalary || 0);
        const da = parseFloat(employee.daAmount || 0);
        const workingDays = parseFloat(employee.workingDays || 365);
        const bonusPercentage = parseFloat(formData.bonusPercentage || 8.33);

        const annualSalary = (basic + da) * 12;
        const bonusAmount = (annualSalary * bonusPercentage) / 100;
        const proportionateBonus = (bonusAmount * workingDays) / 365;

        return proportionateBonus.toFixed(2);
    };

    const addEmployee = () => {
        if (newEmployee.name && newEmployee.basicSalary) {
            const bonusAmount = calculateBonus(newEmployee);
            setFormData({
                ...formData,
                employees: [...formData.employees, { ...newEmployee, bonusAmount, id: Date.now() }]
            });
            setNewEmployee({
                name: '',
                employeeId: '',
                basicSalary: '',
                daAmount: '',
                workingDays: '365',
                isEligible: true,
                bonusAmount: 0
            });
        }
    };

    const removeEmployee = (id) => {
        setFormData({
            ...formData,
            employees: formData.employees.filter(emp => emp.id !== id)
        });
    };

    const calculateTotalBonus = () => {
        return formData.employees
            .filter(emp => emp.isEligible)
            .reduce((sum, emp) => sum + parseFloat(emp.bonusAmount || 0), 0)
            .toFixed(2);
    };

    const handleFileChange = async (docType, e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadingFiles(prev => ({ ...prev, [docType]: true }));

            try {
                const response = await uploadFile(file, 'bonus-act');
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
        if (e) e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const totalBonus = calculateTotalBonus();

            const payload = {
                submissionId: `BON-${Date.now()}`,
                userEmail: formData.userEmail,
                businessName: formData.businessName,
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    companyType: formData.companyType,
                    state: formData.state,
                    employeeCount: formData.employeeCount,
                    financialYear: formData.financialYear,
                    bonusPercentage: formData.bonusPercentage,
                    allocableSurplus: formData.allocableSurplus,
                    totalBonusPayable: totalBonus,
                    paymentMode: formData.paymentMode,
                    paymentDate: formData.paymentDate,
                    hasMinimum20Employees: parseInt(formData.employeeCount) >= 20
                },
                employees: formData.employees,
                documents: formData.uploadedDocuments
            };

            await submitBonusAct(payload);
            setCurrentStep(4);
        } catch (err) {
            setError(err.message || 'Submission failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getFee = () => {
        const count = parseInt(formData.employeeCount || 0);
        return count >= 50 ? '₹3,999' : '₹2,499';
    };

    const stepContent = (
        <AnimatePresence mode="wait">
            {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-2xl font-black text-[#2B3446] mb-2 uppercase tracking-tight">Company Details</h2>
                    <p className="text-slate-500 mb-8 font-medium">As per Payment of Bonus Act, 1965.</p>

                    {eligibilityWarning && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                            <AlertCircle size={20} className="text-yellow-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-yellow-800 font-bold">{eligibilityWarning}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">Business Name *</label>
                                <input type="text" name="businessName" value={formData.businessName} required className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">Company Type *</label>
                                <select name="companyType" value={formData.companyType} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg outline-none cursor-pointer">
                                    <option value="COMPANY">Private Limited Company</option>
                                    <option value="LLP">LLP</option>
                                    <option value="PARTNERSHIP">Partnership Firm</option>
                                    <option value="FACTORY">Factory</option>
                                    <option value="SHOP">Shop & Establishment</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">State *</label>
                                <select name="state" value={formData.state} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg outline-none cursor-pointer">
                                    <option value="MAHARASHTRA">Maharashtra</option>
                                    <option value="KARNATAKA">Karnataka</option>
                                    <option value="TAMIL_NADU">Tamil Nadu</option>
                                    <option value="DELHI">Delhi</option>
                                    <option value="GUJARAT">Gujarat</option>
                                    <option value="WEST_BENGAL">West Bengal</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">Total Employees *</label>
                                <input type="number" name="employeeCount" value={formData.employeeCount} required min="1" className="w-full p-3 border border-slate-200 rounded-lg outline-none" onChange={handleChange} placeholder="Minimum 20" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">Financial Year *</label>
                                <select name="financialYear" value={formData.financialYear} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg outline-none cursor-pointer">
                                    <option value="2023-2024">2023-2024</option>
                                    <option value="2022-2023">2022-2023</option>
                                    <option value="2021-2022">2021-2022</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">Bonus Percentage (%) *</label>
                                <input type="number" name="bonusPercentage" value={formData.bonusPercentage} required min="8.33" max="20" step="0.01" className="w-full p-3 border border-slate-200 rounded-lg outline-none" onChange={handleChange} placeholder="8.33 - 20%" />
                                <p className="text-[10px] text-slate-400 mt-1 font-bold">MIN: 8.33% | MAX: 20%</p>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">Allocable Surplus (₹)</label>
                                <input type="number" name="allocableSurplus" value={formData.allocableSurplus} className="w-full p-3 border border-slate-200 rounded-lg outline-none" onChange={handleChange} placeholder="From P&L Statement" />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button onClick={() => setCurrentStep(2)} disabled={!formData.businessName || !formData.employeeCount} className="w-full py-4 bg-amber-600 text-white font-black rounded-xl shadow-lg hover:bg-black transition flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-50">
                                Next Step <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-2xl font-black text-[#2B3446] mb-2 uppercase tracking-tight">Employee & Payroll Data</h2>
                    <p className="text-slate-500 mb-8 font-medium">Add eligible employees (Salary ≤ ₹21,000/month).</p>

                    <div className="space-y-6">
                        <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                            <h3 className="font-black text-amber-900 mb-4 flex items-center gap-2 uppercase tracking-wider text-sm">
                                <Plus size={18} /> Add Employee
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <input type="text" name="name" value={newEmployee.name} onChange={handleEmployeeChange} placeholder="Employee Name" className="p-3 border border-amber-200 rounded-lg outline-none" />
                                <input type="text" name="employeeId" value={newEmployee.employeeId} onChange={handleEmployeeChange} placeholder="Employee ID" className="p-3 border border-amber-200 rounded-lg outline-none" />
                                <input type="number" name="basicSalary" value={newEmployee.basicSalary} onChange={handleEmployeeChange} placeholder="Basic Salary (₹)" className="p-3 border border-amber-200 rounded-lg outline-none" />
                            </div>
                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <input type="number" name="daAmount" value={newEmployee.daAmount} onChange={handleEmployeeChange} placeholder="DA Amount (₹)" className="p-3 border border-amber-200 rounded-lg outline-none" />
                                <input type="number" name="workingDays" value={newEmployee.workingDays} onChange={handleEmployeeChange} placeholder="Working Days" className="p-3 border border-amber-200 rounded-lg outline-none" />
                                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-amber-200">
                                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                                        <input type="checkbox" name="isEligible" checked={newEmployee.isEligible} onChange={handleEmployeeChange} className="w-4 h-4 accent-amber-600" />
                                        <span>Eligible (≤₹21k)</span>
                                    </label>
                                </div>
                            </div>
                            <button type="button" onClick={addEmployee} className="w-full py-2 bg-amber-600 text-white font-black rounded-lg hover:bg-amber-700 transition uppercase text-sm tracking-widest">
                                Add Employee
                            </button>
                        </div>

                        {formData.employees.length > 0 && (
                            <div>
                                <h3 className="font-black text-slate-700 mb-3 flex items-center gap-2 uppercase tracking-wider text-xs">
                                    <Calculator size={18} /> Added Employees ({formData.employees.length}) - Total Bonus: ₹{calculateTotalBonus()}
                                </h3>
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                    {formData.employees.map((emp) => (
                                        <div key={emp.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition">
                                            <div className="flex-1">
                                                <p className="font-black text-sm text-navy">{emp.name} ({emp.employeeId})</p>
                                                <p className="text-[10px] text-slate-500 font-bold">
                                                    Basic: ₹{emp.basicSalary} | DA: ₹{emp.daAmount} | Days: {emp.workingDays} | <span className="text-amber-600 text-xs font-black">Bonus: ₹{emp.bonusAmount}</span>
                                                </p>
                                            </div>
                                            <button onClick={() => removeEmployee(emp.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-6">
                            <button onClick={() => setCurrentStep(1)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 font-black rounded-xl hover:bg-slate-50 transition uppercase text-sm">Back</button>
                            <button onClick={() => setCurrentStep(3)} disabled={formData.employees.length === 0} className="flex-1 py-4 bg-amber-600 text-white font-black rounded-xl shadow-lg hover:bg-amber-700 transition disabled:opacity-50 uppercase text-sm tracking-wide">Next Step</button>
                        </div>
                    </div>
                </motion.div>
            )}

            {currentStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-2xl font-black text-[#2B3446] mb-2 uppercase tracking-tight">Upload & Payment</h2>
                    <p className="text-slate-500 mb-8 font-medium">Verify documents and complete submission.</p>

                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4 bg-amber-50 p-6 rounded-xl border border-amber-200">
                            <div>
                                <label className="block text-xs font-black text-amber-900 mb-2 uppercase">Payment Mode *</label>
                                <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className="w-full p-3 border border-amber-200 rounded-lg outline-none cursor-pointer text-sm font-bold">
                                    <option value="BANK">Bank Transfer</option>
                                    <option value="CASH">Cash Payment</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-amber-900 mb-2 uppercase">Payment Date *</label>
                                <input type="date" name="paymentDate" value={formData.paymentDate} required className="w-full p-3 border border-amber-200 rounded-lg outline-none text-sm font-bold" onChange={handleChange} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[
                                { id: 'EMPLOYEE_LIST', label: 'Employee List (Excel) *' },
                                { id: 'SALARY_SHEET', label: 'Salary Sheet (Basic + DA) *' },
                                { id: 'PL_STATEMENT', label: 'P&L Statement *' }
                            ].map((doc, i) => {
                                const uploadedDoc = formData.uploadedDocuments.find(d => d.type === doc.id);
                                return (
                                    <div key={i} className={`flex items-center justify-between p-4 border rounded-xl transition-all ${uploadedDoc ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg border ${uploadedDoc ? 'bg-white border-green-200 text-green-600' : 'bg-white border-slate-200 text-slate-400'}`}>
                                                {uploadedDoc ? <CheckCircle size={20} /> : <FileText size={20} />}
                                            </div>
                                            <div>
                                                <span className="font-black text-xs block text-navy uppercase tracking-tight">{doc.label}</span>
                                                {uploadedDoc && <span className="text-[10px] text-green-600 font-bold truncate max-w-[150px] inline-block">{uploadedDoc.filename}</span>}
                                            </div>
                                        </div>
                                        <label className="cursor-pointer">
                                            <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${uploadedDoc ? 'bg-green-600 text-white' : 'bg-navy text-white hover:bg-black'}`}>
                                                {uploadingFiles[doc.id] ? '...' : uploadedDoc ? 'Change' : 'Upload'}
                                            </span>
                                            <input type="file" className="hidden" disabled={uploadingFiles[doc.id]} onChange={(e) => handleFileChange(doc.id, e)} />
                                        </label>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                            <h3 className="font-black text-green-900 mb-3 text-xs uppercase tracking-widest">Bonus Summary</h3>
                            <div className="space-y-1 text-sm font-bold">
                                <div className="flex justify-between text-slate-600">
                                    <span>Eligible Count:</span>
                                    <span>{formData.employees.filter(e => e.isEligible).length}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-green-200">
                                    <span className="text-navy">Total Bonus Payable:</span>
                                    <span className="text-lg text-green-700">₹{calculateTotalBonus()}</span>
                                </div>
                            </div>
                        </div>

                        {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-200 flex items-center gap-2"><AlertTriangle size={16} /> {error}</div>}

                        <div className="flex gap-4">
                            <button onClick={() => setCurrentStep(2)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 font-black rounded-xl hover:bg-slate-50 transition uppercase text-sm">Back</button>
                            <button onClick={handleSubmit} disabled={loading || !formData.paymentDate} className="flex-1 py-4 bg-amber-600 text-white font-black rounded-xl shadow-lg hover:bg-amber-700 transition flex justify-center items-center disabled:opacity-50 uppercase text-sm tracking-wide">
                                {loading ? 'Processing...' : 'Submit Application'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {currentStep === 4 && (
                <motion.div key="step4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6 shadow-inner">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-navy mb-4 uppercase tracking-tighter">Compliance Submitted!</h2>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto font-medium">
                        We've received your Bonus Act compliance for <strong>{formData.businessName}</strong>. Our team will verify the data and prepare statutory registers.
                    </p>

                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mb-8 max-w-xs mx-auto shadow-sm">
                        <p className="text-xs text-slate-400 mb-2 uppercase tracking-widest font-black">Service Fee</p>
                        <p className="text-5xl font-black text-navy">{getFee()}</p>
                    </div>

                    {isModal ? (
                        <button onClick={onClose} className="w-full max-w-xs py-4 bg-amber-600 text-white font-black rounded-xl shadow-lg hover:bg-black transition uppercase tracking-widest mx-auto">
                            Close Window
                        </button>
                    ) : (
                        <button onClick={() => navigate('/dashboard')} className="w-full max-w-xs py-4 bg-[#2B3446] text-white font-black rounded-xl shadow-lg hover:bg-black transition flex items-center justify-center gap-2 mx-auto uppercase tracking-widest">
                            <CreditCard size={18} /> Go to Dashboard
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );

    if (isModal) {
        return (
            <div className="flex flex-row h-[85vh] overflow-hidden bg-white">
                {/* Sidebar */}
                <div className="w-72 bg-[#043E52] text-white flex flex-col p-6 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight">
                            <span className="text-[#ED6E3F]">Bonus Act</span> Returns
                        </h1>
                        <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/10 backdrop-blur-sm space-y-2">
                            <div>
                                <p className="text-[10px] uppercase text-blue-200 tracking-wider mb-1">Service Type</p>
                                <p className="font-bold text-white leading-tight">Annual Filing</p>
                            </div>
                            <div className="pt-2 border-t border-white/10 space-y-1">
                                <div className="flex justify-between text-xs text-blue-200">
                                    <span>Service Fee</span>
                                    <span>{getFee()}</span>
                                </div>
                                <div className="flex justify-between text-xs text-blue-200">
                                    <span>Govt Fees</span>
                                    <span>Extra</span>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-white/10 flex justify-between items-end">
                                <span className="text-xs font-bold text-white">Total</span>
                                <p className="text-[#ED6E3F] font-bold text-lg leading-none">{getFee()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['Company Details', 'Employees', 'Upload & Pay', 'Success'].map((s, i) => (
                            <div key={i} onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }} className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${currentStep === i + 1 ? 'bg-white/10 text-white' : 'text-blue-200 hover:bg-white/5'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === i + 1 ? 'bg-[#ED6E3F] text-white' : currentStep > i + 1 ? 'bg-green-500 text-white' : 'bg-white/20 text-blue-200'}`}>
                                    {currentStep > i + 1 ? <CheckCircle size={12} /> : i + 1}
                                </div>
                                <span className={`text-xs font-medium ${currentStep === i + 1 ? 'text-white font-bold' : ''}`}>{s}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-auto pt-6 border-t border-white/10 relative z-10">
                        <div className="flex justify-between items-end">
                            <div><p className="text-[10px] text-blue-200 uppercase">Total Payable</p><p className="text-xl font-bold text-white">{getFee()}</p></div>
                            <IndianRupee className="text-white/20" size={24} />
                        </div>
                    </div>
                </div>
                {/* Content */}
                <div className="flex-1 flex flex-col h-full relative bg-[#F8F9FA]">
                    <div className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-20">
                        <h2 className="font-bold text-navy text-lg">{['Company Details', 'Employee & Payroll Data', 'Upload & Payment', 'Submission Successful'][currentStep - 1]}</h2>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition"><X size={18} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        {stepContent}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFBF0] font-sans pt-24 pb-24 px-4">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-[#f59e0b] text-white py-6 px-6 shadow-md">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-amber-200 hover:text-white transition">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2"><Award size={20} className="text-amber-300" /> Bonus Act Compliance</h1>
                    <div />
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
                {/* Progress */}
                <div className="mb-8 flex items-center justify-between relative px-2">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-amber-200 -z-0"></div>
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all relative z-10 ${currentStep >= s ? 'bg-amber-600 text-white shadow-lg' : 'bg-white border-2 border-amber-200 text-amber-400'}`}>
                            {s}
                        </div>
                    ))}
                </div>
                {stepContent}
            </div>
        </div>
    );
};

export default ApplyBonusAct;
