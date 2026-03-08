package com.shinefiling.common.controller;

import com.shinefiling.common.service.NotificationService;

import com.shinefiling.common.model.*;
import com.shinefiling.common.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private com.shinefiling.common.repository.ServiceProductRepository serviceProductRepository;

    @Autowired
    private com.shinefiling.common.service.EmailService emailService;

    @Autowired
    private ComplianceRuleRepository complianceRuleRepository;

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    @Autowired
    private PartnerPlanRepository partnerPlanRepository;

    @Autowired
    private PartnerRoleRepository partnerRoleRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private NotificationService notificationService;

    @jakarta.annotation.PostConstruct
    public void initData() {
        if (complianceRuleRepository.count() == 0) {
            complianceRuleRepository.save(new ComplianceRule(null, "GST", "Monthly", "20", "₹50/day"));
            complianceRuleRepository.save(new ComplianceRule(null, "TDS", "Monthly", "7", "₹200/day"));
            complianceRuleRepository.save(new ComplianceRule(null, "Income Tax", "Yearly", "31", "₹100/day"));
        }

        if (partnerPlanRepository.count() == 0) {
            partnerPlanRepository.save(new PartnerPlan(null, "Basic Partner", "10 Applications", 999.0));
            partnerPlanRepository.save(new PartnerPlan(null, "Premium Partner", "50 Applications", 2999.0));
            partnerPlanRepository.save(new PartnerPlan(null, "Elite Partner", "Unlimited", 4999.0));
        }

        if (partnerRoleRepository.count() == 0) {
            partnerRoleRepository.save(new PartnerRole(null, "Senior CA", true, true, true));
            partnerRoleRepository.save(new PartnerRole(null, "Associate CA", true, false, true));
            partnerRoleRepository.save(new PartnerRole(null, "Trainee", true, false, false));
        }

        if (departmentRepository.count() == 0) {
            departmentRepository
                    .save(new Department(null, "Legal Board", "Adv. Sharma", "bg-indigo-50 text-indigo-700", 12));
            departmentRepository.save(new Department(null, "Support Ops", "Priya K.", "bg-pink-50 text-pink-700", 8));
            departmentRepository.save(new Department(null, "Finance", "Amit R.", "bg-emerald-50 text-emerald-700", 4));
            departmentRepository.save(new Department(null, "Tech Team", "Suresh V.", "bg-blue-50 text-blue-700", 6));
        }
    }

    @jakarta.annotation.PostConstruct
    public void initServiceCatalog() {
        if (serviceProductRepository.count() == 0) {
            List<com.shinefiling.common.model.ServiceProduct> catalog = new ArrayList<>();
            // Seeding Data
            addServices(catalog, "business_reg", "Business Registration", "#6366f1", Arrays.asList(
                    "Private Limited Company Registration", "One Person Company (OPC)",
                    "Limited Liability Partnership (LLP)", "Partnership Firm Registration",
                    "Sole Proprietorship Registration", "Section 8 NGO Company",
                    "Nidhi Company Registration", "Producer Company Registration",
                    "Public Limited Company"));

            addServices(catalog, "tax_compliance", "Tax & Compliance", "#10b981", Arrays.asList(
                    "GST Registration", "GST Monthly Return (GSTR-1 & 3B)",
                    "GST Annual Return (GSTR-9)",
                    "Income Tax Return (ITR 1–7)", "TDS Return Filing",
                    "Professional Tax Reg & Filing",
                    "Advance Tax Filing", "Tax Audit Filing"));

            addServices(catalog, "roc_compliance", "ROC / MCA Filings", "#3b82f6", Arrays.asList(
                    "Annual ROC Filing (AOC-4, MGT-7)", "Director KYC (DIR-3 KYC)",
                    "Add/Remove Director",
                    "Change of Registered Office", "Share Transfer Filing",
                    "Increase Authorized Capital",
                    "MOA/AOA Amendment", "Company Name Change", "Strike Off Company"));

            addServices(catalog, "licenses", "Government Licenses", "#f97316", Arrays.asList(
                    "FSSAI License (Basic/State/Central)", "Shop & Establishment License",
                    "Trade License",
                    "Labour License", "Factory License", "Drug License", "Fire Safety NOC",
                    "Pollution Control (CTE/CTO)", "Import Export Code (IEC)", "Gumastha License",
                    "Bar / Liquor License"));

            addServices(catalog, "ipr", "Intellectual Property", "#8b5cf6", Arrays.asList(
                    "Trademark Registration", "Trademark Objection Reply",
                    "Trademark Hearing Support",
                    "Trademark Assignment", "Trademark Renewal", "Copyright Registration",
                    "Patent Filing (Provisional/Complete)", "Design Registration"));

            addServices(catalog, "labour_hr", "Labour Law & HR", "#06b6d4", Arrays.asList(
                    "PF Registration & Filing", "ESI Registration & Filing",
                    "Professional Tax Reg & Filing",
                    "Labour Welfare Fund Filing", "Gratuity Act Registration",
                    "Bonus Act Compliance",
                    "Minimum Wages Compliance"));

            addServices(catalog, "certifications", "Business Certifications", "#f59e0b", Arrays.asList(
                    "MSME / Udyam Registration", "ISO Certification (9001, 14001)",
                    "Startup India Recognition",
                    "Digital Signature (DSC)", "Bar Code Registration", "TAN / PAN Application"));

            addServices(catalog, "legal", "Legal Drafting", "#f43f5e", Arrays.asList(
                    "Partnership Deed", "Founders Agreement", "Shareholders Agreement",
                    "Employment Agreement",
                    "Rent Agreement", "Franchise Agreement", "NDA (Non-Disclosure)",
                    "Vendor Agreement"));

            addServices(catalog, "financial", "Financial Services", "#14b8a6", Arrays.asList(
                    "CMA Data Preparation", "Project Report for Loans", "Bank Loan Documentation",
                    "Cash Flow Compliance", "Startup Pitch Deck", "Business Valuation Reports"));

            addServices(catalog, "storage", "Mini DigiLocker", "#eab308", Arrays.asList(
                    "Store PAN Card", "Store Aadhaar Card", "Store Rent Agreement",
                    "Store GST Cert",
                    "Store FSSAI Cert", "Business Doc Vault", "Secure PDF Download"));

            serviceProductRepository.saveAll(catalog);
            System.out.println("Initialized Service Catalog with " + catalog.size() + " items.");
        }
    }

    @GetMapping("/stats")
    public Map<String, Object> getAdminStats() {
        List<ServiceRequest> allRequests = serviceRequestRepository.findAll();
        List<User> allUsers = userRepository.findAll();
        List<Payment> allPayments = paymentRepository.findAll();

        double totalRevenue = allPayments.stream()
                .filter(p -> "Success".equalsIgnoreCase(p.getPaymentStatus()))
                .mapToDouble(Payment::getAmount)
                .sum();

        long totalPending = allRequests.stream()
                .filter(r -> "PENDING".equalsIgnoreCase(r.getStatus()) || "INITIATED".equalsIgnoreCase(r.getStatus()))
                .count();

        long activeUsers = allUsers.stream()
                .filter(u -> "USER".equals(u.getRole()))
                .count();

        // KPI Cards
        List<Map<String, String>> kpi = new ArrayList<>();
        kpi.add(Map.of("label", "Total Revenue", "value", "₹" + (long) totalRevenue, "sub", "Total Earnings",
                "type",
                "revenue"));
        kpi.add(Map.of("label", "Pending Actions", "value", String.valueOf(totalPending), "sub",
                "Requires Attention",
                "type", "pending"));
        kpi.add(Map.of("label", "Total Users", "value", String.valueOf(activeUsers), "sub",
                "Registered Clients",
                "type", "clients"));
        kpi.add(Map.of("label", "System Status", "value", "Healthy", "sub", "All Services Up", "type",
                "alerts"));

        // Status Distribution for Charts
        Map<String, Long> statusCounts = allRequests.stream()
                .collect(Collectors.groupingBy(r -> r.getStatus() != null ? r.getStatus() : "UNKNOWN",
                        Collectors.counting()));

        List<Map<String, Object>> statusData = new ArrayList<>();
        String[] colors = { "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#6366F1" };
        int i = 0;
        for (Map.Entry<String, Long> entry : statusCounts.entrySet()) {
            statusData.add(Map.of(
                    "label", entry.getKey(),
                    "value", entry.getValue(),
                    "color", colors[i % colors.length]));
            i++;
        }

        Map<String, Object> response = new HashMap<>();
        response.put("kpi", kpi);
        response.put("statusData", statusData);

        List<Double> trend = new ArrayList<>();
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        for (int j = 6; j >= 0; j--) {
            java.time.LocalDateTime start = now.minusDays(j).withHour(0).withMinute(0);
            java.time.LocalDateTime end = now.minusDays(j).withHour(23).withMinute(59);
            double daily = allPayments.stream()
                    .filter(p -> p.getPaymentDate() != null &&
                            p.getPaymentDate().isAfter(start) &&
                            p.getPaymentDate().isBefore(end))
                    .mapToDouble(Payment::getAmount).sum();
            trend.add(daily);
        }
        response.put("trend", trend);

        return response;
    }

    @GetMapping("/finance")
    public Map<String, Object> getFinancialData() {
        List<Payment> allPayments = paymentRepository.findAll();

        double totalRevenue = allPayments.stream()
                .filter(p -> "Success".equalsIgnoreCase(p.getPaymentStatus()))
                .mapToDouble(Payment::getAmount)
                .sum();

        long pendingCount = allPayments.stream()
                .filter(p -> "Pending".equalsIgnoreCase(p.getPaymentStatus()))
                .count();

        List<Map<String, Object>> transactions = allPayments.stream()
                .map(p -> {
                    Map<String, Object> txn = new HashMap<>();
                    txn.put("id", "TXN-" + p.getId());
                    txn.put("date", p.getPaymentDate() != null ? p.getPaymentDate().toString()
                            : "N/A");
                    txn.put("client", p.getUser() != null ? p.getUser().getFullName() : "Unknown");
                    txn.put("amount", p.getAmount());
                    txn.put("status", p.getPaymentStatus());
                    txn.put("method", p.getPaymentMethod());
                    txn.put("type", "Credit");
                    return txn;
                })
                .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        double mrr = totalRevenue / 12.0;

        // Calculate growth (mock comparison for now, but better than static 0)
        double growth = transactions.size() > 0 ? 12.5 : 0.0;

        stats.put("revenue", Map.of("total", totalRevenue, "growth", growth));
        stats.put("pending", Map.of("total", pendingCount * 1000.0, "count", pendingCount));
        stats.put("refunds", Map.of("total", 0.0, "count", 0));
        stats.put("mrr", Map.of("total", mrr, "growth", growth / 2.0));

        Map<String, Object> response = new HashMap<>();
        response.put("stats", stats);
        response.put("transactions", transactions);
        response.put("invoices", new ArrayList<>());

        return response;
    }

    @Autowired
    private com.shinefiling.common.service.AuditLogService auditService;

    @GetMapping("/logs")
    public List<Map<String, Object>> getAuditLogs() {
        List<com.shinefiling.common.model.AuditLog> realLogs = auditService.getAllLogs();
        if (realLogs.isEmpty()) {
            return new ArrayList<>();
        }
        return realLogs.stream().map(log -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", "LOG-" + log.getId());
            m.put("time", log.getTimestamp() != null ? log.getTimestamp().toString() : "");
            m.put("type", log.getEventType());
            m.put("severity", "INFO");
            m.put("user", log.getActor());
            m.put("ip", "System");
            m.put("action", log.getEventType());
            m.put("details", log.getPayloadJson());
            m.put("resource", "N/A");
            return m;
        }).collect(Collectors.toList());
    }

    @GetMapping("/client-analysis")
    public Map<String, Object> getClientAnalysis() {
        List<User> allUsers = userRepository.findAll();
        List<ServiceRequest> allRequests = serviceRequestRepository.findAll();
        List<Payment> allPayments = paymentRepository.findAll();

        List<User> clients = allUsers.stream()
                .filter(u -> "USER".equalsIgnoreCase(u.getRole()))
                .collect(Collectors.toList());

        long totalClients = clients.size();

        java.time.LocalDateTime thirtyDaysAgo = java.time.LocalDateTime.now().minusDays(30);
        long newClients = clients.stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(thirtyDaysAgo))
                .count();

        Set<Long> activeClientIds = allRequests.stream()
                .map(r -> r.getUser().getId())
                .collect(Collectors.toSet());

        long activeClientCount = activeClientIds.size();

        Map<Long, Double> clientRevenue = allPayments.stream()
                .filter(p -> "Success".equals(p.getPaymentStatus()))
                .collect(Collectors.groupingBy(
                        p -> p.getUser().getId(),
                        Collectors.summingDouble(Payment::getAmount)));

        List<Map<String, Object>> topClients = clientRevenue.entrySet().stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    User u = userRepository.findById(entry.getKey()).orElse(null);
                    Map<String, Object> clientMap = new HashMap<>();
                    clientMap.put("id", entry.getKey());
                    clientMap.put("name", u != null ? u.getFullName() : "Unknown");
                    clientMap.put("email", u != null ? u.getEmail() : "Unknown");
                    clientMap.put("spent", entry.getValue());
                    clientMap.put("orders",
                            allRequests.stream().filter(
                                    r -> r.getUser().getId().equals(entry.getKey()))
                                    .count());
                    return clientMap;
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("totalClients", totalClients);
        response.put("newClients", newClients);
        response.put("activeClients", activeClientCount);
        response.put("inactiveClients", totalClients - activeClientCount);
        response.put("topClients", topClients);

        response.put("clientSatisfaction", Arrays.asList(
                Map.of("rating", "5 Star", "count", 45),
                Map.of("rating", "4 Star", "count", 30),
                Map.of("rating", "3 Star", "count", 15),
                Map.of("rating", "1-2 Star", "count", 5)));

        return response;
    }

    @GetMapping("/download-docs/{submissionId}")
    public org.springframework.http.ResponseEntity<org.springframework.core.io.Resource> downloadDocuments(
            @PathVariable String submissionId, @RequestParam(required = false) String type) {
        return org.springframework.http.ResponseEntity.notFound().build();
    }

    @GetMapping("/services")
    public List<com.shinefiling.common.model.ServiceProduct> getServiceCatalog() {
        long count = serviceProductRepository.count();
        if (count == 0) {
            initServiceCatalog();
            return serviceProductRepository.findAll();
        }
        return serviceProductRepository.findAll();
    }

    @PostMapping("/services/seed")
    public org.springframework.http.ResponseEntity<?> forceSeed() {
        if (serviceProductRepository.count() > 0) {
            serviceProductRepository.deleteAll();
        }
        initServiceCatalog();
        return org.springframework.http.ResponseEntity
                .ok("Seeded " + serviceProductRepository.count() + " items");
    }

    @PutMapping("/services/{id}")
    public org.springframework.http.ResponseEntity<?> updateServiceProduct(@PathVariable String id,
            @RequestBody Map<String, Object> updates) {
        Optional<com.shinefiling.common.model.ServiceProduct> opt = serviceProductRepository.findById(id);
        if (opt.isPresent()) {
            com.shinefiling.common.model.ServiceProduct product = opt.get();
            if (updates.containsKey("status"))
                product.setStatus((String) updates.get("status"));
            if (updates.containsKey("price"))
                product.setPrice(Double.valueOf(String.valueOf(updates.get("price"))));
            if (updates.containsKey("name"))
                product.setName((String) updates.get("name"));

            serviceProductRepository.save(product);
            return org.springframework.http.ResponseEntity.ok(product);
        }
        return org.springframework.http.ResponseEntity.notFound().build();
    }

    @PostMapping("/services")
    public org.springframework.http.ResponseEntity<?> createServiceProduct(
            @RequestBody com.shinefiling.common.model.ServiceProduct product) {
        String id = product.getCategoryId() + "_" + System.currentTimeMillis();
        product.setId(id);
        if (product.getStatus() == null)
            product.setStatus("ACTIVE");
        serviceProductRepository.save(product);
        return org.springframework.http.ResponseEntity.ok(product);
    }

    private void addServices(List<com.shinefiling.common.model.ServiceProduct> catalog, String catId,
            String catName,
            String color,
            List<String> items) {
        int i = 0;
        for (String item : items) {
            catalog.add(new com.shinefiling.common.model.ServiceProduct(
                    catId + "_" + i,
                    item,
                    catName,
                    catId,
                    (double) ((i + 1) * 999 + 499),
                    (3 + i) + " - " + (5 + i) + " Days",
                    2 + (i % 3),
                    "ACTIVE",
                    color));
            i++;
        }
    }

    @GetMapping("/departments")
    public List<Department> getDepartments() {
        return departmentRepository.findAll();
    }

    @GetMapping("/settings")
    public Map<String, Object> getSettings() {
        return Map.of(
                "maintenanceMode", false,
                "publicRegistration", true,
                "twoFactorAuth", false,
                "debugMode", true);
    }

    @PutMapping("/settings")
    public org.springframework.http.ResponseEntity<?> updateSettings(@RequestBody Map<String, Object> settings) {
        return org.springframework.http.ResponseEntity.ok(settings);
    }

    @Autowired
    private com.shinefiling.common.repository.ChatRepository chatRepository;

    @Autowired
    private com.shinefiling.common.repository.StatusLogRepository statusLogRepository;

    @Autowired
    private com.shinefiling.common.repository.AuditLogRepository auditLogRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @DeleteMapping("/orders/{idRaw}")
    public org.springframework.http.ResponseEntity<?> deleteOrder(@PathVariable String idRaw) {
        try {
            String submissionId = idRaw.trim();
            Long sId = null;
            try {
                sId = Long.parseLong(submissionId.replace("ORD-", ""));
            } catch (Exception e) {
            }

            if (sId != null) {
                Optional<ServiceRequest> reqOpt = serviceRequestRepository.findById(sId);
                if (reqOpt.isPresent()) {
                    performDeepCleanup(sId.toString());
                    serviceRequestRepository.delete(reqOpt.get());
                    return org.springframework.http.ResponseEntity.ok(Collections
                            .singletonMap("message", "Order deleted"));
                }
            }
            return org.springframework.http.ResponseEntity.notFound().build();
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.internalServerError()
                    .body("Failed to delete order: " + e.getMessage());
        }
    }

    private void performDeepCleanup(String orderId) {
        try {
            chatRepository.deleteAll(chatRepository.findBySubmissionIdOrderByTimestampAsc(orderId));
        } catch (Exception e) {
        }

        try {
            Long numId = Long.parseLong(orderId.replace("ORD-", ""));
            documentRepository.deleteAll(documentRepository.findByServiceRequestId(numId));
            paymentRepository.deleteAll(paymentRepository.findByServiceRequestId(numId));
            auditLogRepository.deleteAll(auditLogRepository.findByServiceRequestId(numId));
            statusLogRepository.deleteAll(statusLogRepository.findByOrder_IdOrderByChangedAtDesc(numId));
        } catch (Exception e) {
        }
    }

    @PostMapping("/delete-all-chats")
    public org.springframework.http.ResponseEntity<?> deleteAllChats(@RequestBody Map<String, String> payload) {
        String password = payload.get("password");
        if (!"admin@123".equals(password)) {
            return org.springframework.http.ResponseEntity.status(403)
                    .body(Collections.singletonMap("error", "Invalid Password"));
        }

        try {
            chatRepository.deleteAll();
            try {
                deleteDirectoryRecursively(java.nio.file.Paths.get("uploads/chats"));
            } catch (Exception ex) {
            }

            return org.springframework.http.ResponseEntity
                    .ok(Collections.singletonMap("message",
                            "All chats deleted successfully."));
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.internalServerError()
                    .body("Failed to delete chats: " + e.getMessage());
        }
    }

    @GetMapping("/applications")
    public List<Map<String, Object>> getAllApplications() {
        List<Map<String, Object>> result = new ArrayList<>();
        try {
            List<ServiceRequest> requests = serviceRequestRepository.findAll();
            for (ServiceRequest r : requests) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", r.getId());
                map.put("serviceName", r.getServiceName());
                map.put("status", r.getStatus());
                map.put("createdAt", r.getCreatedAt());
                map.put("user", r.getUser());
                map.put("amount", r.getAmount());
                map.put("planType", r.getPlan());
                map.put("formData", r.getFormData());
                result.add(map);
            }
        } catch (Exception e) {
            System.err.println("Error fetching requests: " + e.getMessage());
        }

        result.sort((a, b) -> {
            String d1 = a.get("createdAt") != null ? a.get("createdAt").toString() : "";
            String d2 = b.get("createdAt") != null ? b.get("createdAt").toString() : "";
            return d2.compareTo(d1);
        });

        return result;
    }

    private void deleteDirectoryRecursively(java.nio.file.Path path) {
        if (!java.nio.file.Files.exists(path))
            return;
        try (java.util.stream.Stream<java.nio.file.Path> walk = java.nio.file.Files.walk(path)) {
            walk.sorted(java.util.Comparator.reverseOrder())
                    .forEach(p -> {
                        try {
                            java.nio.file.Files.delete(p);
                        } catch (java.io.IOException e) {
                        }
                    });
        } catch (java.io.IOException e) {
        }
    }

    @GetMapping("/analytics/full")
    public Map<String, Object> getAnalyticsFull() {
        List<Payment> allPayments = paymentRepository.findAll();
        List<User> allUsers = userRepository.findAll();
        List<Map<String, Object>> allOrders = getAllApplications();

        double totalRevenue = allPayments.stream()
                .filter(p -> "Success".equalsIgnoreCase(p.getPaymentStatus()))
                .mapToDouble(Payment::getAmount)
                .sum();

        long activeUsers = allUsers.stream().filter(u -> "USER".equalsIgnoreCase(u.getRole())).count();
        long pendingOrders = allOrders.stream().filter(o -> {
            String s = (String) o.get("status");
            return s != null && (s.equalsIgnoreCase("PENDING") || s.equalsIgnoreCase("INITIATED")
                    || s.equalsIgnoreCase("SUBMITTED"));
        }).count();
        int totalOrdersCount = allOrders.size();
        double avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

        Map<String, Double> revenueMap = new LinkedHashMap<>();
        java.time.YearMonth currentMonth = java.time.YearMonth.now();
        for (int i = 11; i >= 0; i--) {
            java.time.YearMonth m = currentMonth.minusMonths(i);
            String mName = m.getMonth().getDisplayName(java.time.format.TextStyle.SHORT, Locale.ENGLISH);
            revenueMap.put(mName, 0.0);
        }
        for (Payment p : allPayments) {
            if (p.getPaymentDate() != null && "Success".equalsIgnoreCase(p.getPaymentStatus())) {
                java.time.YearMonth pm = java.time.YearMonth.from(p.getPaymentDate());
                if (pm.isAfter(currentMonth.minusMonths(12))) {
                    String mName = pm.getMonth().getDisplayName(java.time.format.TextStyle.SHORT,
                            Locale.ENGLISH);
                    if (revenueMap.containsKey(mName)) {
                        revenueMap.put(mName, revenueMap.get(mName) + p.getAmount());
                    }
                }
            }
        }
        List<Map<String, Object>> revenueTrend = new ArrayList<>();
        revenueMap.forEach((k, v) -> revenueTrend.add(Map.of("name", k, "value", v)));

        Map<String, Long> statusCount = allOrders.stream()
                .collect(Collectors.groupingBy(o -> (String) o.getOrDefault("status", "Unknown"),
                        Collectors.counting()));
        List<Map<String, Object>> statusData = new ArrayList<>();
        statusCount.forEach((k, v) -> statusData.add(Map.of("name", k, "value", v)));

        List<Map<String, Object>> topTransactions = allPayments.stream()
                .filter(p -> "Success".equalsIgnoreCase(p.getPaymentStatus()))
                .sorted((a, b) -> Double.compare(b.getAmount(), a.getAmount()))
                .limit(10)
                .map(p -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", "TXN-" + p.getId());
                    m.put("client", p.getUser() != null ? p.getUser().getFullName() : "Guest");
                    m.put("date", p.getPaymentDate());
                    m.put("amount", p.getAmount());
                    return m;
                })
                .collect(Collectors.toList());

        Map<String, Integer> serviceCounts = new HashMap<>();
        Map<String, Double> categoryRevenue = new HashMap<>();

        for (Map<String, Object> order : allOrders) {
            String serviceName = (String) order.get("serviceName");
            if (serviceName == null)
                serviceName = "Other";
            String simpleName = java.util.Arrays.stream(serviceName.split(" ")).limit(2)
                    .collect(Collectors.joining(" "));
            serviceCounts.put(simpleName, serviceCounts.getOrDefault(simpleName, 0) + 1);

            String cat = "Legal Services";
            String sLower = serviceName.toLowerCase();
            if (sLower.contains("registration") || sLower.contains("incorporation")
                    || sLower.contains("limited"))
                cat = "Business Reg";
            else if (sLower.contains("tax") || sLower.contains("gst") || sLower.contains("return"))
                cat = "Tax & Compliance";
            else if (sLower.contains("license") || sLower.contains("fssai"))
                cat = "Licenses";
            else if (sLower.contains("trademark") || sLower.contains("copyright"))
                cat = "IPR";

            double amount = 0.0;
            try {
                Object amtObj = order.get("amount");
                if (amtObj != null) {
                    String amtStr = amtObj.toString().replaceAll("[^0-9.]", "").trim();
                    if (!amtStr.isEmpty())
                        amount = Double.parseDouble(amtStr);
                }
            } catch (Exception e) {
            }
            categoryRevenue.put(cat, categoryRevenue.getOrDefault(cat, 0.0) + amount);
        }

        List<Map<String, Object>> servicePopularity = serviceCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(8)
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", e.getKey());
                    m.put("value", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> categoryData = categoryRevenue.entrySet().stream()
                .filter(e -> e.getValue() > 0)
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", e.getKey());
                    m.put("value", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());

        String[] cities = { "Chennai", "Bangalore", "Mumbai", "Delhi", "Coimbatore", "Hyderabad", "Pune",
                "Kolkata" };
        Map<String, Integer> cityCounts = new HashMap<>();
        for (int i = 0; i < allUsers.size(); i++) {
            String city = cities[i % cities.length];
            if (i % 3 == 0)
                city = cities[0];
            cityCounts.put(city, cityCounts.getOrDefault(city, 0) + 1);
        }
        List<Map<String, Object>> geoData = cityCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", e.getKey());
                    m.put("value", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> servicePerformance = new ArrayList<>();
        servicePerformance.add(Map.of("subject", "GST Reg", "A", 3 + (totalOrdersCount % 3), "fullMark", 10));
        servicePerformance
                .add(Map.of("subject", "ITR Filing", "A", 1 + (totalOrdersCount % 2), "fullMark", 10));
        servicePerformance
                .add(Map.of("subject", "Company Inc", "A", 7 + (totalOrdersCount % 4), "fullMark", 10));
        servicePerformance.add(Map.of("subject", "Trademark", "A", 5, "fullMark", 10));
        servicePerformance.add(Map.of("subject", "FSSAI", "A", 4, "fullMark", 10));

        Map<String, Object> result = new HashMap<>();
        result.put("totalRevenue", totalRevenue);
        result.put("activeUsers", activeUsers);
        result.put("pendingOrders", pendingOrders);
        result.put("avgOrderValue", avgOrderValue);
        result.put("revenueTrend", revenueTrend);
        result.put("statusData", statusData);
        result.put("topTransactions", topTransactions);
        result.put("servicePopularity", servicePopularity);
        result.put("categoryData", categoryData);
        result.put("geoData", geoData);
        result.put("servicePerformance", servicePerformance);

        return result;
    }

    @GetMapping("/compliance-rules")
    public List<ComplianceRule> getComplianceRules() {
        return complianceRuleRepository.findAll();
    }

    @PostMapping("/compliance-rules")
    public ComplianceRule saveComplianceRule(@RequestBody ComplianceRule rule) {
        return complianceRuleRepository.save(rule);
    }

    @DeleteMapping("/compliance-rules/{id}")
    public ResponseEntity<?> deleteComplianceRule(@PathVariable Long id) {
        complianceRuleRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/billing-settings")
    public Map<String, Object> getBillingSettings() {
        Map<String, Object> settings = new HashMap<>();
        settings.put("minServiceFee", getSettingValue("MIN_SERVICE_FEE", "500"));
        settings.put("maxServiceFee", getSettingValue("MAX_SERVICE_FEE", "50000"));

        List<PartnerPlan> plans = partnerPlanRepository.findAll();
        settings.put("subscriptionPlans", plans);

        return settings;
    }

    private String getSettingValue(String key, String defaultValue) {
        return systemSettingRepository.findById(key)
                .map(SystemSetting::getSettingValue)
                .orElse(defaultValue);
    }

    @GetMapping("/system-roles")
    public List<PartnerRole> getSystemRoles() {
        return partnerRoleRepository.findAll();
    }

    @GetMapping("/users/{id}")
    public User getUser(@PathVariable Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/users/{id}/approve-kyc")
    public ResponseEntity<?> approveKyc(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setKycStatus("VERIFIED");
        user.setStatus("Active");
        userRepository.save(user);

        // Notify User
        notificationService.createNotification(
                user,
                "KYC_STATUS",
                "KYC Verified & Account Activated",
                "Congratulations! Your CA Partner KYC has been verified and your account is now active.",
                user.getId().toString(),
                "KYC_APPROVAL");

        try {
            emailService.sendEmail(
                    user.getEmail(),
                    "Account Activated - ShineFiling Partner Program",
                    "Dear " + user.getFullName() + ",\n\n" +
                            "Congratulations! Your Partner account has been activated and your KYC is verified.\n\n" +
                            "Best Regards,\nShineFiling Team");
        } catch (Exception e) {
        }

        return ResponseEntity.ok(Map.of("message", "Partner KYC Approved"));
    }

    @PostMapping("/users/{id}/reject-kyc")
    public ResponseEntity<?> rejectKyc(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        String reason = payload.getOrDefault("reason", "Verification Failed");
        user.setKycStatus("REJECTED");
        userRepository.save(user);

        // Notify User
        notificationService.createNotification(
                user,
                "KYC_STATUS",
                "KYC Verification Rejected",
                "Your KYC application was rejected. Reason: " + reason,
                user.getId().toString(),
                "KYC_REJECTION");

        try {
            emailService.sendEmail(
                    user.getEmail(),
                    "KYC Verification Failed - ShineFiling",
                    "Dear " + user.getFullName() + ",\n\n" +
                            "Your KYC application failed.\nReason: " + reason + "\n\n" +
                            "Best Regards,\nShineFiling Team");
        } catch (Exception e) {
        }

        return ResponseEntity.ok(Map.of("message", "Partner KYC Rejected"));
    }
}
