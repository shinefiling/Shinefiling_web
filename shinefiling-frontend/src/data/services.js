
import {
    User, Landmark, Briefcase, Shield, FileText, Database,
    Truck, Lock, Zap, GraduationCap, Building, Stamp, Award, Scale, Coins
} from 'lucide-react';

export const SERVICE_DATA = {
    business_reg: {
        id: 'business_reg',
        label: 'Business Registration',
        icon: Building,
        color: 'indigo',
        colorHex: '#6366f1',
        items: [
            'Private Limited Company Registration', 'One Person Company (OPC) Registration',
            'Limited Liability Partnership (LLP) Registration', 'Partnership Firm Registration',
            'Sole Proprietorship Registration', 'Section 8 (NGO) Company Registration',
            'Nidhi Company Registration', 'Producer Company Registration',
            'Public Limited Company Registration', 'Indian Subsidiary Registration',
            'Foreign Company Registration (India)', 'Startup Incorporation Advisory'
        ]
    },
    tax_compliance: {
        id: 'tax_compliance',
        label: 'Tax & GST Compliance',
        icon: Coins,
        color: 'emerald',
        colorHex: '#10b981',
        items: [
            'GST Registration', 'GST Amendment / Correction', 'GST Monthly Return (GSTR-1)',
            'GST Monthly Return (GSTR-3B)', 'GST Annual Return (GSTR-9)', 'GST Audit (GSTR-9C)',
            'GST Cancellation', 'Income Tax Return (ITR-1)', 'Income Tax Return (ITR-2)',
            'Income Tax Return (ITR-3)', 'Income Tax Return (ITR-4)', 'Income Tax Return (ITR-5/6/7)',
            'Advance Tax Filing', 'TDS Return Filing'
        ]
    },
    roc_compliance: {
        id: 'roc_compliance',
        label: 'ROC / MCA Compliance',
        icon: Briefcase,
        color: 'blue',
        colorHex: '#3b82f6',
        items: [
            'Annual ROC Filing (AOC-4)', 'Annual ROC Filing (MGT-7)', 'Director KYC (DIR-3 KYC)',
            'Add Director', 'Remove Director', 'Change Registered Office',
            'Increase Authorized Capital', 'Share Transfer Filing', 'MOA Amendment',
            'AOA Amendment', 'Company Name Change', 'Strike Off Company'
        ]
    },
    licenses: {
        id: 'licenses',
        label: 'Government Licenses',
        icon: Landmark,
        color: 'orange',
        colorHex: '#f97316',
        items: [
            'FSSAI Registration (Basic)', 'FSSAI License (State)', 'FSSAI License (Central)',
            'FSSAI Renewal', 'FSSAI Correction', 'Shop & Establishment License',
            'Trade License', 'Labour License', 'Factory License', 'Drug License',
            'Fire Safety NOC', 'Pollution Control (CTE / CTO)', 'Import Export Code (IEC)'
        ]
    },
    ipr: {
        id: 'ipr',
        label: 'Intellectual Property (IPR)',
        icon: Shield,
        color: 'violet',
        colorHex: '#8b5cf6',
        items: [
            'Trademark Registration', 'Trademark Objection Reply', 'Trademark Hearing Representation',
            'Trademark Renewal', 'Trademark Assignment', 'Copyright Registration',
            'Patent Provisional Filing', 'Patent Complete Filing', 'Design Registration'
        ]
    },
    labour_hr: {
        id: 'labour_hr',
        label: 'Labour Law & HR Compliance',
        icon: User,
        color: 'cyan',
        colorHex: '#06b6d4',
        items: [
            'PF Registration', 'PF Return Filing', 'ESI Registration', 'ESI Return Filing',
            'Professional Tax Registration', 'Professional Tax Filing', 'Labour Welfare Fund Filing',
            'Payroll Compliance'
        ]
    },
    certifications: {
        id: 'certifications',
        label: 'Business Certifications',
        icon: Award,
        color: 'amber',
        colorHex: '#f59e0b',
        items: [
            'MSME / Udyam Registration', 'ISO Certification (9001 / 14001 / 27001)',
            'Startup India Registration', 'Digital Signature Certificate (DSC)',
            'Barcode / GS1 Registration', 'PAN Application', 'TAN Application'
        ]
    },
    legal: {
        id: 'legal',
        label: 'Legal Drafting',
        icon: Scale,
        color: 'rose',
        colorHex: '#f43f5e',
        items: [
            'Partnership Deed Drafting', 'Founders Agreement', 'Shareholders Agreement',
            'Employment Agreement', 'Rent / Lease Agreement', 'Franchise Agreement',
            'NDA (Non-Disclosure Agreement)', 'Vendor / Service Agreement'
        ]
    },
    legal_notices: {
        id: 'legal_notices',
        label: 'Legal Notices & Disputes',
        icon: Scale,
        color: 'red',
        colorHex: '#ef4444',
        items: [
            'Legal Notice Drafting', 'Reply to Legal Notice', 'Cheque Bounce Notice (Section 138)',
            'GST / Income Tax Notice Reply', 'ROC Notice Reply'
        ]
    },
    corrections: {
        id: 'corrections',
        label: 'Corrections & Amendments',
        icon: Stamp,
        color: 'fuchsia',
        colorHex: '#d946ef',
        items: [
            'PAN Correction', 'GST Certificate Correction', 'FSSAI License Correction',
            'Company / LLP Detail Correction', 'DIN / DSC Correction'
        ]
    },
    closure: {
        id: 'closure',
        label: 'Closure / Exit Services',
        icon: Lock,
        color: 'slate',
        colorHex: '#64748b',
        items: [
            'LLP Closure', 'GST Cancellation (Business Closure)',
            'Proprietorship Closure', 'FSSAI License Cancellation'
        ]
    },
    financial: {
        id: 'financial',
        label: 'Financial & Startup Support',
        icon: FileText,
        color: 'teal',
        colorHex: '#14b8a6',
        items: [
            'CMA Data Preparation', 'Project Report for Bank Loan', 'Bank Loan Documentation', 'Business Valuation',
            'Startup Pitch Deck', 'Cash Flow Statement', 'Virtual CFO Services'
        ]
    }
};
