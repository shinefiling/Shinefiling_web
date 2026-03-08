package com.shinefiling.common.service;

import com.shinefiling.common.model.ServiceCatalog;
import com.shinefiling.common.repository.ServiceCatalogRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Arrays;

@Service
public class ServiceCatalogInitService {

        @Autowired
        private ServiceCatalogRepository repo;

        @PostConstruct
        public void init() {
                repo.deleteAll(); // Reset catalog to ensure full list is present

                // 1. BUSINESS REGISTRATION
                add("business_reg", "Business Registration", "#6366f1", Arrays.asList(
                                "Private Limited Company Registration", "One Person Company (OPC) Registration",
                                "Limited Liability Partnership (LLP) Registration", "Partnership Firm Registration",
                                "Sole Proprietorship Registration", "Section 8 (NGO) Company Registration",
                                "Nidhi Company Registration", "Producer Company Registration",
                                "Public Limited Company Registration", "Indian Subsidiary Registration",
                                "Foreign Company Registration (India)", "Startup Incorporation Advisory"));

                // 2. TAX & GST COMPLIANCE
                add("tax_compliance", "Tax & GST Compliance", "#10b981", Arrays.asList(
                                "GST Registration", "GST Amendment / Correction", "GST Monthly Return (GSTR-1)",
                                "GST Monthly Return (GSTR-3B)", "GST Annual Return (GSTR-9)", "GST Audit (GSTR-9C)",
                                "GST Cancellation", "Income Tax Return (ITR-1)", "Income Tax Return (ITR-2)",
                                "Income Tax Return (ITR-3)", "Income Tax Return (ITR-4)",
                                "Income Tax Return (ITR-5/6/7)",
                                "Advance Tax Filing", "TDS Return Filing"));

                // 3. ROC / MCA COMPLIANCE
                add("roc_compliance", "ROC / MCA Compliance", "#3b82f6", Arrays.asList(
                                "Annual ROC Filing (AOC-4)", "Annual ROC Filing (MGT-7)", "Director KYC (DIR-3 KYC)",
                                "Add Director", "Remove Director", "Change Registered Office",
                                "Increase Authorized Capital", "Share Transfer Filing", "MOA Amendment",
                                "AOA Amendment", "Company Name Change", "Strike Off Company"));

                // 4. GOVERNMENT LICENSES
                add("licenses", "Government Licenses", "#f97316", Arrays.asList(
                                "FSSAI Registration (Basic)", "FSSAI License (State)", "FSSAI License (Central)",
                                "FSSAI Renewal", "FSSAI Correction", "Shop & Establishment License",
                                "Trade License", "Labour License", "Factory License", "Drug License",
                                "Fire Safety NOC", "Pollution Control (CTE / CTO)", "Import Export Code (IEC)"));

                // 5. INTELLECTUAL PROPERTY (IPR)
                add("ipr", "Intellectual Property (IPR)", "#8b5cf6", Arrays.asList(
                                "Trademark Registration", "Trademark Objection Reply",
                                "Trademark Hearing Representation",
                                "Trademark Renewal", "Trademark Assignment", "Copyright Registration",
                                "Patent Provisional Filing", "Patent Complete Filing", "Design Registration"));

                // 6. LABOUR LAW & HR COMPLIANCE
                add("labour_hr", "Labour Law & HR Compliance", "#06b6d4", Arrays.asList(
                                "PF Registration", "PF Return Filing", "ESI Registration", "ESI Return Filing",
                                "Professional Tax Registration", "Professional Tax Filing",
                                "Labour Welfare Fund Filing",
                                "Payroll Compliance"));

                // 7. BUSINESS CERTIFICATIONS
                add("certifications", "Business Certifications", "#f59e0b", Arrays.asList(
                                "MSME / Udyam Registration", "ISO Certification (9001 / 14001 / 27001)",
                                "Startup India Registration", "Digital Signature Certificate (DSC)",
                                "Barcode / GS1 Registration", "PAN Application", "TAN Application"));

                // 8. LEGAL DRAFTING
                add("legal", "Legal Drafting", "#f43f5e", Arrays.asList(
                                "Partnership Deed Drafting", "Founders Agreement", "Shareholders Agreement",
                                "Employment Agreement", "Rent / Lease Agreement", "Franchise Agreement",
                                "NDA (Non-Disclosure Agreement)", "Vendor / Service Agreement"));

                // 9. LEGAL NOTICES & DISPUTES
                add("legal_notices", "Legal Notices & Disputes", "#ef4444", Arrays.asList(
                                "Legal Notice Drafting", "Reply to Legal Notice", "Cheque Bounce Notice (Section 138)",
                                "GST / Income Tax Notice Reply", "ROC Notice Reply"));

                // 10. CORRECTIONS & AMENDMENTS
                add("corrections", "Corrections & Amendments", "#d946ef", Arrays.asList(
                                "PAN Correction", "GST Certificate Correction", "FSSAI License Correction",
                                "Company / LLP Detail Correction", "DIN / DSC Correction"));

                // 11. CLOSURE / EXIT SERVICES
                add("closure", "Closure / Exit Services", "#64748b", Arrays.asList(
                                "LLP Closure", "GST Cancellation (Business Closure)",
                                "Proprietorship Closure", "FSSAI License Cancellation"));

                // 12. FINANCIAL & STARTUP SUPPORT
                add("financial", "Financial & Startup Support", "#14b8a6", Arrays.asList(
                                "CMA Data Preparation", "Project Report for Bank Loan", "Business Valuation",
                                "Startup Pitch Deck", "Cash Flow Statement", "Virtual CFO Services"));
        }

        private void add(String cat, String title, String color, java.util.List<String> services) {
                repo.save(new ServiceCatalog(cat, title, color, services));
        }
}
