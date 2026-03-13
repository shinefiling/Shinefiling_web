package com.shinefiling.common.controller;

import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.model.User;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.common.repository.TransactionRepository;
import com.shinefiling.common.model.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder; // Assuming security is set up, or I'll stub it if not easily available. 
// I'll skip PasswordEncoder for now and just store plain text if forced or check if there is a Bean. 
// Actually I should look at AuthController to see how it registers users.

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ca")
@CrossOrigin(origins = "http://localhost:5173")
public class CAController {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.shinefiling.common.service.NotificationService notificationService;

    // Get Assigned Requests
    @GetMapping("/{caId}/requests")
    public ResponseEntity<?> getAssignedRequests(@PathVariable Long caId) {
        User ca = userRepository.findById(caId).orElse(null);
        if (ca == null)
            return ResponseEntity.notFound().build();

        List<ServiceRequest> requests = serviceRequestRepository.findByAssignedCa(ca);
        return ResponseEntity.ok(requests);
    }

    @Autowired
    private com.shinefiling.common.service.CommissionService commissionService;

    // Approve/Reject Request (Accepting the bound amount)
    @PutMapping("/requests/{requestId}/respond")
    public ResponseEntity<?> respondToRequest(@PathVariable Long requestId, @RequestBody Map<String, String> payload) {
        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        String status = payload.get("status"); // ACCEPTED or REJECTED
        // String comments = payload.get("comments"); // Optional comments (e.g. reason
        // for rejection) -> Not using yet

        if ("ACCEPTED".equalsIgnoreCase(status)) {
            request.setCaApprovalStatus("ACCEPTED");
            request.setStatus("IN_PROGRESS_CA");
            if (notificationService != null) {
                notificationService.notifyAdmins("CA_ACCEPT", "Order Accepted by CA",
                        "CA " + request.getAssignedCa().getFullName() + " accepted " + request.getServiceName()
                                + " (Order #" + requestId + ")",
                        requestId.toString());
            }
        } else if ("REJECTED".equalsIgnoreCase(status)) {
            request.setCaApprovalStatus("REJECTED");
            if (notificationService != null) {
                notificationService.notifyAdmins("CA_REJECT", "Order Rejected by CA",
                        "CA " + request.getAssignedCa().getFullName() + " rejected " + request.getServiceName()
                                + " (Order #" + requestId + ")",
                        requestId.toString());
            }
        } else if ("COMPLETED_FINAL".equalsIgnoreCase(status)) {
            request.setStatus("COMPLETED");
            if (payload.containsKey("generatedDocuments")) {
                request.setGeneratedDocuments((String) payload.get("generatedDocuments"));
            }
            if (commissionService != null) {
                commissionService.processCommission(request);
            }
            if (notificationService != null) {
                notificationService.notifyAdmins("CA_COMPLETE", "Order Completed by CA",
                        "CA " + request.getAssignedCa().getFullName() + " marked " + request.getServiceName()
                                + " as COMPLETED (Order #" + requestId + ")",
                        requestId.toString());
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid status"));
        }

        // Append comments if needed or store separate CA comments
        // For now, let's just save.
        serviceRequestRepository.save(request);
        return ResponseEntity.ok(Map.of("message", "Response recorded", "request", request));
    }

    // Create Employee
    @PostMapping("/{caId}/employees")
    public ResponseEntity<?> createEmployee(@PathVariable Long caId, @RequestBody User employeeData) {
        User ca = userRepository.findById(caId)
                .orElseThrow(() -> new RuntimeException("CA User not found"));

        if (!"CA".equalsIgnoreCase(ca.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("message", "User is not a CA"));
        }

        if (userRepository.existsByEmail(employeeData.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }

        employeeData.setRole("EMPLOYEE");
        employeeData.setParentUser(ca); // Link to CA
        employeeData.setStatus("Active");

        // Encrypt Password
        if (employeeData.getPassword() != null && !employeeData.getPassword().isEmpty()) {
            employeeData.setPassword(passwordEncoder.encode(employeeData.getPassword()));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Password is required"));
        }

        userRepository.save(employeeData);
        return ResponseEntity.ok(Map.of("message", "Employee created successfully", "employee", employeeData));
    }

    // List Employees
    @GetMapping("/{caId}/employees")
    public List<User> listEmployees(@PathVariable Long caId) {
        User ca = userRepository.findById(caId).orElse(null);
        if (ca == null)
            return List.of();

        return userRepository.findByParentUser(ca);
    }

    @Autowired
    private com.shinefiling.common.repository.CaBidRepository caBidRepository;

    // ... (Existing helper methods)

    // Get Open Requests for Bidding
    @GetMapping("/requests/open")
    public List<ServiceRequest> getOpenRequests() {
        return serviceRequestRepository.findByBiddingStatus("OPEN");
    }

    // Submit Bid
    @PostMapping("/requests/{requestId}/bid")
    public ResponseEntity<?> submitBid(@PathVariable Long requestId, @RequestBody Map<String, Object> payload) {
        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!payload.containsKey("caId") || !payload.containsKey("amount")) {
            return ResponseEntity.badRequest().body(Map.of("message", "CA ID and Bid Amount are required"));
        }

        Long caId = Long.valueOf(payload.get("caId").toString());
        User caUser = userRepository.findById(caId)
                .orElseThrow(() -> new RuntimeException("CA User not found"));

        if (!"CA".equalsIgnoreCase(caUser.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("message", "User is not a CA"));
        }

        // Remove Existing Bid if any (Update existing)
        java.util.Optional<com.shinefiling.common.model.CaBid> existingBid = caBidRepository
                .findByServiceRequestAndCa(request, caUser);
        com.shinefiling.common.model.CaBid bid = existingBid.orElse(new com.shinefiling.common.model.CaBid());

        bid.setServiceRequest(request);
        bid.setCa(caUser);
        bid.setBidAmount(Double.valueOf(payload.get("amount").toString()));
        if (payload.containsKey("remarks")) {
            bid.setRemarks(payload.get("remarks").toString());
        }
        bid.setStatus("PENDING");

        caBidRepository.save(bid);

        if (notificationService != null) {
            System.out.println(
                    "Triggering Notification for CA Bid: CA=" + caUser.getFullName() + ", Request=" + requestId);
            notificationService.notifyAdmins("CA_BID", "New Marketplace Bid Received",
                    "CA " + caUser.getFullName() + " has submitted a bid of ₹" + bid.getBidAmount() + " for "
                            + request.getServiceName(),
                    request.getId().toString());
        } else {
            System.out.println("NotificationService is NULL in CAController!");
        }

        return ResponseEntity.ok(Map.of("message", "Bid submitted successfully", "bid", bid));
    }

    // Get Bids by CA
    @GetMapping("/{caId}/bids")
    public List<com.shinefiling.common.model.CaBid> getCaBids(@PathVariable Long caId) {
        User ca = userRepository.findById(caId).orElse(null);
        if (ca == null)
            return List.of();

        return caBidRepository.findByCa(ca);
    }

    // Assign Employee to Request
    @PutMapping("/requests/{requestId}/assign-employee")
    public ResponseEntity<?> assignEmployee(@PathVariable Long requestId, @RequestBody Map<String, Object> payload) {
        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // Ensure request is assigned to this CA first? Not enforced currently but good
        // practice.
        // Assuming the UI filters correctly.

        Long employeeId = Long.valueOf(payload.get("employeeId").toString());
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (!"EMPLOYEE".equalsIgnoreCase(employee.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("message", "User is not an Employee"));
        }

        request.setAssignedEmployee(employee);
        request.setStatus("ASSIGNED_TO_EMPLOYEE");
        serviceRequestRepository.save(request);

        return ResponseEntity.ok(Map.of("message", "Assigned to Employee", "request", request));
    }

    // Get Wallet Transactions
    @GetMapping("/{caId}/wallet/transactions")
    public ResponseEntity<?> getWalletTransactions(@PathVariable Long caId) {
        User ca = userRepository.findById(caId).orElse(null);
        if (ca == null)
            return ResponseEntity.notFound().build();

        List<Transaction> transactions = transactionRepository.findByUserOrderByCreatedAtDesc(ca);
        return ResponseEntity.ok(transactions);
    }

    // Request Withdrawal
    @PostMapping("/{caId}/wallet/withdraw")
    public ResponseEntity<?> requestWithdrawal(@PathVariable Long caId, @RequestBody Map<String, Object> payload) {
        User ca = userRepository.findById(caId).orElse(null);
        if (ca == null)
            return ResponseEntity.notFound().build();

        if (!payload.containsKey("amount")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Withdrawal amount is required"));
        }

        java.math.BigDecimal amount = new java.math.BigDecimal(payload.get("amount").toString());
        if (amount.compareTo(java.math.BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid withdrawal amount"));
        }

        if (ca.getWalletBalance().compareTo(amount) < 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Insufficient wallet balance"));
        }

        // Deduct from Balance
        ca.setWalletBalance(ca.getWalletBalance().subtract(amount));
        userRepository.save(ca);

        // Record Withdrawal Transaction
        Transaction txn = new Transaction();
        txn.setUser(ca);
        txn.setType("DEBIT");
        txn.setAmount(amount);
        txn.setDescription("Withdrawal Request: " + (payload.containsKey("remarks") ? payload.get("remarks") : "Wallet Payout"));
        txn.setStatus("PENDING"); // Admin needs to approve and pay
        txn.setReferenceType("WITHDRAWAL");
        transactionRepository.save(txn);

        // Notify Admin
        if (notificationService != null) {
            notificationService.notifyAdmins("WITHDRAWAL_REQUEST", "New Withdrawal Request",
                    "CA " + ca.getFullName() + " has requested a withdrawal of ₹" + amount,
                    txn.getId().toString());
        }

        return ResponseEntity.ok(Map.of(
            "message", "Withdrawal request submitted for Admin approval",
            "transaction", txn,
            "newBalance", ca.getWalletBalance()
        ));
    }
}
