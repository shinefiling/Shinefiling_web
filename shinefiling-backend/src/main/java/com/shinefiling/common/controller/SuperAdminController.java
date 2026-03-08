package com.shinefiling.common.controller;

import com.shinefiling.common.service.NotificationService;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.model.User;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/super-admin")
@CrossOrigin(origins = "http://localhost:5173")
public class SuperAdminController {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    // Get All Requests (for Super Admin Dashboard)
    @GetMapping("/requests")
    public List<ServiceRequest> getAllRequests() {
        return serviceRequestRepository.findAll();
    }

    // Bind Amount (Fix Price)
    @PutMapping("/requests/{id}/bind-amount")
    public ResponseEntity<?> bindAmount(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!payload.containsKey("amount")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Amount is required"));
        }

        Double amount = Double.valueOf(payload.get("amount").toString());
        request.setBoundAmount(amount);

        // If amount is bound, we might want to notify the client or just set status
        // existing 'amount' field might be used for payment, 'boundAmount' is the
        // internal fixed cost?
        // Or is 'boundAmount' what the client must pay?
        // User said: "super admin amout fix panni bind panna amout la potu... CA
        // Dashbord ellathuku kamikanu... atha bind panna CA Dashbaord la show aganu"
        // So this amount is shown to CA.

        serviceRequestRepository.save(request);

        // Notify CA if already assigned
        if (request.getAssignedCa() != null) {
            notificationService.createNotification(
                    request.getAssignedCa(),
                    "AMOUNT_BOUND",
                    "Service Amount Fixed",
                    "Admin has fixed the amount to ₹" + amount + " for " + request.getServiceName(),
                    request.getId().toString(),
                    "ORDER");
        }

        return ResponseEntity.ok(Map.of("message", "Amount bound successfully", "request", request));
    }

    @Autowired
    private com.shinefiling.common.repository.CaBidRepository caBidRepository;

    // Existing "getAllRequests" at line 28

    // Broadcast Request to CAs (Open Bidding)
    @PostMapping("/requests/{id}/broadcast")
    public ResponseEntity<?> broadcastRequest(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!payload.containsKey("amount")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Max Budget Amount is required"));
        }

        Double amount = Double.valueOf(payload.get("amount").toString());
        request.setBoundAmount(amount);
        request.setBiddingStatus("OPEN");
        request.setStatus("OPEN_FOR_BIDDING");

        serviceRequestRepository.save(request);
        // Here we would ideally trigger a notification to all CAs, but we'll assume the
        // frontend poller handles it for now.

        return ResponseEntity.ok(Map.of("message", "Request broadcasted to CAs", "request", request));
    }

    // Get Bids for a Request
    @GetMapping("/requests/{id}/bids")
    public ResponseEntity<?> getBidsForRequest(@PathVariable Long id) {
        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        List<com.shinefiling.common.model.CaBid> bids = caBidRepository.findByServiceRequest(request);
        return ResponseEntity.ok(bids);
    }

    // Accept a Bid
    @PostMapping("/bids/{bidId}/accept")
    public ResponseEntity<?> acceptBid(@PathVariable Long bidId) {
        com.shinefiling.common.model.CaBid winningBid = caBidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        ServiceRequest request = winningBid.getServiceRequest();

        // 1. Assign CA
        request.setAssignedCa(winningBid.getCa());
        // request.setBoundAmount(winningBid.getBidAmount()); // Optional: Update agree
        // amount to bid amount? Usually yes.
        request.setStatus("ASSIGNED");
        request.setBiddingStatus("CLOSED");
        request.setCaApprovalStatus("ACCEPTED"); // CA implicitly accepted by bidding

        // 2. Close Bid Status
        winningBid.setStatus("ACCEPTED");
        caBidRepository.save(winningBid);
        serviceRequestRepository.save(request);

        // Notify CA
        notificationService.createNotification(
                winningBid.getCa(),
                "BID_ACCEPTED",
                "Bid Accepted!",
                "Your bid for " + request.getServiceName() + " has been accepted. You can start working now.",
                request.getId().toString(),
                "ORDER");

        // 3. Reject other bids
        List<com.shinefiling.common.model.CaBid> allBids = caBidRepository.findByServiceRequest(request);
        for (com.shinefiling.common.model.CaBid bid : allBids) {
            if (!bid.getId().equals(bidId)) {
                bid.setStatus("REJECTED");
                caBidRepository.save(bid);
            }
        }

        return ResponseEntity.ok(Map.of("message", "Bid accepted and CA assigned", "request", request));
    }

    // Existing "assignCa" (Manual Override without bidding) can stay or be
    // deprecated.
    @PutMapping("/requests/{id}/assign-ca")
    public ResponseEntity<?> assignCa(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!payload.containsKey("caUserId")) {
            return ResponseEntity.badRequest().body(Map.of("message", "CA User ID is required"));
        }

        Long caId = Long.valueOf(payload.get("caUserId").toString());
        User caUser = userRepository.findById(caId)
                .orElseThrow(() -> new RuntimeException("CA User not found"));

        if (!"CA".equalsIgnoreCase(caUser.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("message", "User is not a CA"));
        }

        String adminComments = (String) payload.get("adminComments");

        request.setAssignedCa(caUser);
        request.setAdminComments(adminComments);
        request.setStatus("ASSIGNED_TO_CA"); // Update status
        request.setCaApprovalStatus("PENDING_APPROVAL"); // Reset CA approval status

        serviceRequestRepository.save(request);

        // Notify CA
        notificationService.createNotification(
                caUser,
                "NEW_ASSIGNMENT",
                "New Task Assigned",
                "Admin has assigned a new task: " + request.getServiceName(),
                request.getId().toString(),
                "ORDER");

        return ResponseEntity.ok(Map.of("message", "Assigned to CA successfully", "request", request));
    }

    // List all CAs
    @GetMapping("/cas")
    public List<User> listCas() {
        return userRepository.findByRole("CA");
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getAdminStats() {
        long totalUsers = userRepository.count();
        long totalOrders = serviceRequestRepository.count();
        // We can add more specific DB-level stats here later
        return ResponseEntity.ok(Map.of(
                "totalUsers", totalUsers,
                "totalOrders", totalOrders));
    }
}
