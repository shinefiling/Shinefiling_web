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
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Master Admin
        User admin = userRepository.findByEmail("admin@shinefiling.com").orElse(new User());
        admin.setFullName("Master Admin");
        admin.setEmail("admin@shinefiling.com");
        admin.setMobile("9999999999");
        if (admin.getPassword() == null)
            admin.setPassword(passwordEncoder.encode("admin")); // Only set if new
        admin.setRole("MASTER_ADMIN");
        admin.setVerified(true);
        userRepository.save(admin);
        System.out.println("Master Admin synced: admin@shinefiling.com");

        // Sub Admin
        User sub = userRepository.findByEmail("sub@shinefiling.com").orElse(new User());
        sub.setFullName("Sub Admin");
        sub.setEmail("sub@shinefiling.com");
        sub.setMobile("8888888888");
        if (sub.getPassword() == null)
            sub.setPassword(passwordEncoder.encode("admin"));
        sub.setRole("SUB_ADMIN");
        sub.setVerified(true);
        userRepository.save(sub);
        System.out.println("Sub Admin synced: sub@shinefiling.com");

        // Agent Admin
        User agent = userRepository.findByEmail("agent@shinefiling.com").orElse(new User());
        agent.setFullName("Agent Admin");
        agent.setEmail("agent@shinefiling.com");
        agent.setMobile("7777777777");
        if (agent.getPassword() == null)
            agent.setPassword(passwordEncoder.encode("admin"));
        agent.setRole("AGENT");
        agent.setVerified(true);
        userRepository.save(agent);
        System.out.println("Agent synced: agent@shinefiling.com");
        // Ensure Client User exists
        User client = userRepository.findByEmail("client@shinefiling.com").orElse(new User());
        client.setFullName("Test Client");
        client.setEmail("client@shinefiling.com");
        client.setMobile("9000000000");
        client.setPassword(passwordEncoder.encode("admin")); // Enforcing 'admin' as password
        client.setRole("USER");
        client.setVerified(true);
        if (client.getStatus() == null)
            client.setStatus("Active");
        userRepository.save(client);

        // CA User
        User ca = userRepository.findByEmail("ca@shinefiling.com").orElse(new User());
        ca.setFullName("Chartered Accountant");
        ca.setEmail("ca@shinefiling.com");
        ca.setMobile("9988776655");
        if (ca.getPassword() == null)
            ca.setPassword(passwordEncoder.encode("admin"));
        ca.setRole("CA");
        ca.setVerified(true);
        userRepository.save(ca);
        System.out.println("CA synced: ca@shinefiling.com");
        // Seed Services
        seedServices();
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
}
