package com.shinefiling.config;

import com.shinefiling.common.model.User;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.shinefiling.common.repository.ServiceProductRepository serviceProductRepository;

    @Autowired
    private com.shinefiling.common.repository.NotificationTemplateRepository templateRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Services
        seedServices();
        seedTemplates();
    }

    private void seedServices() {
        if (serviceProductRepository.count() > 0)
            return;

        java.util.List<com.shinefiling.common.model.ServiceProduct> catalog = new java.util.ArrayList<>();

        addServices(catalog, "business_reg", "Business Registration", "#6366f1", java.util.Arrays.asList(
                "Private Limited Company Registration", "One Person Company (OPC)",
                "Limited Liability Partnership (LLP)", "Partnership Firm Registration",
                "Sole Proprietorship Registration", "Section 8 NGO Company",
                "Nidhi Company Registration", "Producer Company Registration",
                "Public Limited Company"));

        addServices(catalog, "tax_compliance", "Tax & Compliance", "#10b981", java.util.Arrays.asList(
                "GST Registration", "GST Monthly Return (GSTR-1 & 3B)",
                "GST Annual Return (GSTR-9)",
                "Income Tax Return (ITR 1–7)", "TDS Return Filing",
                "Professional Tax Reg & Filing",
                "Advance Tax Filing", "Tax Audit Filing"));

        addServices(catalog, "roc_compliance", "ROC / MCA Filings", "#3b82f6", java.util.Arrays.asList(
                "Annual ROC Filing (AOC-4, MGT-7)", "Director KYC (DIR-3 KYC)",
                "Add/Remove Director",
                "Change of Registered Office", "Share Transfer Filing",
                "Increase Authorized Capital",
                "MOA/AOA Amendment", "Company Name Change", "Strike Off Company"));

        addServices(catalog, "licenses", "Government Licenses", "#f97316", java.util.Arrays.asList(
                "FSSAI License (Basic/State/Central)", "Shop & Establishment License",
                "Trade License",
                "Labour License", "Factory License", "Drug License", "Fire Safety NOC",
                "Pollution Control (CTE/CTO)", "Import Export Code (IEC)", "Gumastha License",
                "Bar / Liquor License"));

        addServices(catalog, "ipr", "Intellectual Property", "#8b5cf6", java.util.Arrays.asList(
                "Trademark Registration", "Trademark Objection Reply",
                "Trademark Hearing Support",
                "Trademark Assignment", "Trademark Renewal", "Copyright Registration",
                "Patent Filing (Provisional/Complete)", "Design Registration"));

        addServices(catalog, "labour_hr", "Labour Law & HR", "#06b6d4", java.util.Arrays.asList(
                "PF Registration & Filing", "ESI Registration & Filing",
                "Professional Tax Reg & Filing",
                "Labour Welfare Fund Filing", "Gratuity Act Registration",
                "Bonus Act Compliance",
                "Minimum Wages Compliance"));

        addServices(catalog, "certifications", "Business Certifications", "#f59e0b", java.util.Arrays.asList(
                "MSME / Udyam Registration", "ISO Certification (9001, 14001)",
                "Startup India Recognition",
                "Digital Signature (DSC)", "Bar Code Registration", "TAN / PAN Application"));

        addServices(catalog, "legal", "Legal Drafting", "#f43f5e", java.util.Arrays.asList(
                "Partnership Deed", "Founders Agreement", "Shareholders Agreement",
                "Employment Agreement",
                "Rent Agreement", "Franchise Agreement", "NDA (Non-Disclosure)",
                "Vendor Agreement"));

        addServices(catalog, "financial", "Financial Services", "#14b8a6", java.util.Arrays.asList(
                "CMA Data Preparation", "Project Report for Loans", "Bank Loan Documentation",
                "Cash Flow Compliance", "Startup Pitch Deck", "Business Valuation Reports"));

        serviceProductRepository.saveAll(catalog);
        System.out.println("Seeded " + catalog.size() + " services.");
    }

    private void addServices(java.util.List<com.shinefiling.common.model.ServiceProduct> catalog, String catId,
            String catName,
            String color, java.util.List<String> serviceNames) {
        for (String name : serviceNames) {
            String id = name.toLowerCase().replace(" ", "-").replace("/", "-").replace("&", "and").replace("(", "")
                    .replace(")", "").replace("–", "-");
            // Basic Price Logic
            double price = 1999.0;
            if (name.contains("Private Limited") || name.contains("Public Limited") || name.contains("Producer"))
                price = 6999.0;
            if (name.contains("LLP") || name.contains("OPC"))
                price = 4999.0;
            if (name.contains("GST"))
                price = 1499.0;

            com.shinefiling.common.model.ServiceProduct p = new com.shinefiling.common.model.ServiceProduct(
                    id, name, catName, catId, price, "7-10 Days", 5, "ACTIVE", color);
            catalog.add(p);
        }
    }

    private void seedTemplates() {
        createTemplateIfMissing("KYC_APPROVAL", "EMAIL", "Congratulations! Your KYC is Verified - ShineFiling",
                "Dear {{name}},\n\n" +
                "Great news! Your KYC documents have been successfully verified by our team.\n\n" +
                "Your account is now fully activated, and you can start accepting service requests on the ShineFiling platform.\n\n" +
                "Next Steps:\n" +
                "1. Login to your dashboard.\n" +
                "2. Complete your profile if you haven't already.\n" +
                "3. Start providing services and growing your business.\n\n" +
                "If you have any questions, feel free to reach out to us.\n\n" +
                "Warm Regards,\n" +
                "Team ShineFiling", "name");

        createTemplateIfMissing("KYC_REJECTION", "EMAIL", "Action Required: Update Your KYC Documents - ShineFiling",
                "Dear {{name}},\n\n" +
                "We reviewed your KYC submission and unfortunately, we couldn't verify your documents at this time.\n\n" +
                "Reason for Rejection: {{reason}}\n\n" +
                "Please login to your dashboard and re-upload the correct documents to proceed with account activation.\n\n" +
                "Warm Regards,\n" +
                "Team ShineFiling", "name,reason");

        createTemplateIfMissing("KYC_REMINDER", "EMAIL", "Action Required: Complete Your KYC - ShineFiling",
                "Dear {{name}},\n\n" +
                "Welcome to ShineFiling! We are excited to have you onboard as a {{roleLabel}}.\n\n" +
                "To activate your account and start accepting service requests, you are required to complete your KYC (Know Your Customer) verification.\n\n" +
                "How to complete your KYC:\n" +
                "1. Login to your dashboard: https://shinefiling.com/login\n" +
                "2. Navigate to the 'KYC & Compliance' section.\n" +
                "3. Upload your documents.\n\n" +
                "Warm Regards,\n" +
                "Team ShineFiling", "name,roleLabel");

        createTemplateIfMissing("EMAIL_VERIFICATION_OTP", "EMAIL", "Verify your email - ShineFiling",
                "Hi there,\n\n" +
                "Your OTP for verification is: <strong style='font-size: 24px; color: #F97316;'>{{otp}}</strong>\n\n" +
                "This code expires in 10 minutes. If you did not request this, please ignore this email.\n\n" +
                "Warm Regards,\n" +
                "Team ShineFiling", "otp");
        
        System.out.println("Verified/Seeded notification templates.");
    }

    private void createTemplateIfMissing(String name, String type, String subject, String body, String vars) {
        if (!templateRepository.findByName(name).isPresent()) {
            com.shinefiling.common.model.NotificationTemplate t = new com.shinefiling.common.model.NotificationTemplate();
            t.setName(name);
            t.setType(type);
            t.setSubject(subject);
            t.setBody(body);
            t.setVariables(vars);
            t.setActive(true);
            templateRepository.save(t);
        }
    }
}
