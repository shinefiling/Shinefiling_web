package com.shinefiling.common.controller;

import com.shinefiling.common.model.User;
import com.shinefiling.common.model.ClientDetails;
import com.shinefiling.common.model.Payment;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.common.repository.ClientDetailsRepository;
import com.shinefiling.common.repository.PaymentRepository;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.service.ServiceRequestService;
import com.shinefiling.common.service.EmailService;
import com.shinefiling.common.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.nio.file.*;
import java.net.MalformedURLException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClientDetailsRepository clientDetailsRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}/payments")
    public List<Payment> getUserPayments(@PathVariable Long id) {
        return paymentRepository.findByUserId(id);
    }

    @GetMapping("/{id}/stats")
    public Map<String, Object> getUserStats(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null)
            return Map.of("activeServices", 0, "pendingActions", 0, "totalDocuments", 0);

        String email = user.getEmail();
        List<ServiceRequest> requests = serviceRequestService.getKeyRequests(email);

        long active = requests.stream()
                .filter(r -> !"COMPLETED".equalsIgnoreCase(r.getStatus())
                        && !"CANCELLED".equalsIgnoreCase(r.getStatus()))
                .count();

        long actions = requests.stream()
                .filter(r -> "ACTION_REQUIRED".equalsIgnoreCase(r.getStatus())
                        || "CORRECTION_REQUIRED".equalsIgnoreCase(r.getStatus()))
                .count();

        // Documents are not easily countable from ServiceRequest yet, returning 0 or
        // placeholder
        return Map.of(
                "activeServices", active,
                "pendingActions", actions,
                "totalDocuments", 0);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (payload.containsKey("fullName"))
            user.setFullName((String) payload.get("fullName"));
        if (payload.containsKey("mobile"))
            user.setMobile((String) payload.get("mobile"));

        userRepository.save(user);

        Optional<ClientDetails> detailsOpt = clientDetailsRepository.findByUserId(id);
        ClientDetails details = detailsOpt.orElse(new ClientDetails());
        if (!detailsOpt.isPresent()) {
            details.setUser(user);
        }

        if (payload.containsKey("companyName"))
            details.setCompanyName((String) payload.get("companyName"));
        if (payload.containsKey("gstNumber"))
            details.setGstNumber((String) payload.get("gstNumber"));
        if (payload.containsKey("address"))
            details.setAddress((String) payload.get("address"));

        clientDetailsRepository.save(details);

        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    @PostMapping("/{id}/profile-image")
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "File is empty"));
            }

            String uploadDir = System.getProperty("user.home") + "/.shinefiling/uploads/";
            Files.createDirectories(Paths.get(uploadDir));

            String fileName = "PROFILE_" + id + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.write(filePath, file.getBytes());

            String fileUrl = "/api/users/uploads/" + fileName;
            user.setProfileImage(fileUrl);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Profile image updated", "profileImage", fileUrl));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Upload failed: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/kyc")
    public ResponseEntity<?> submitKyc(
            @PathVariable Long id,
            @RequestBody Map<String, Object> kycData) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (kycData.get("panNumber") != null) {
            user.setPanNumber(kycData.get("panNumber").toString());
        }
        if (kycData.get("aadhaarNumber") != null) {
            user.setAadhaarNumber(kycData.get("aadhaarNumber").toString());
        }

        try {
            // Since files are now uploaded separately via the separate upload endpoint,
            // we just store the metadata/URLs provided in the JSON payload.
            user.setKycDocuments(new ObjectMapper().writeValueAsString(kycData));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Processing KYC data failed: " + e.getMessage()));
        }

        user.setKycStatus("SUBMITTED");
        userRepository.save(user);

        String refNo = "KYC-" + user.getId() + "-" + System.currentTimeMillis();

        // Notify Admins
        notificationService.notifyAdmins(
                "KYC_REVIEW",
                "New KYC Submission",
                "A new KYC request has been submitted by " + user.getFullName() + " for review. Ref: " + refNo,
                user.getId().toString());

        emailService.sendEmail(
                user.getEmail(),
                "KYC Submission Received - ShineFiling",
                "Dear " + user.getFullName() + ",\n\n" +
                        "Your KYC details have been successfully submitted.\n" +
                        "Reference Number: " + refNo + "\n\n" +
                        "Our team will review your documents shortly.\n\n" +
                        "Best Regards,\nShineFiling Team");

        return ResponseEntity.ok(Map.of("message", "KYC submitted successfully", "kycStatus", "SUBMITTED"));
    }

    @PutMapping("/{id}/approve-kyc")
    public ResponseEntity<?> approveAgentKyc(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setKycStatus("VERIFIED");
        user.setStatus("Active");
        userRepository.save(user);

        // Notify User
        notificationService.createNotification(
                user,
                "KYC_STATUS",
                "KYC Verified & Account Activated",
                "Congratulations! Your KYC documents have been verified and your account is now active.",
                user.getId().toString(),
                "KYC_APPROVAL");

        try {
            emailService.sendEmail(
                    user.getEmail(),
                    "Account Activated - ShineFiling Partner Program",
                    "Dear " + user.getFullName() + ",\n\n" +
                            "Congratulations! Your KYC documents have been verified and your account is now active.\n\n"
                            +
                            "Best Regards,\nShineFiling Team");
        } catch (Exception e) {
        }

        return ResponseEntity.ok(Map.of("message", "Agent KYC Approved and Account Activated"));
    }

    @PutMapping("/{id}/reject-kyc")
    public ResponseEntity<?> rejectAgentKyc(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        String reason = payload.getOrDefault("reason", "Documents Verification Failed");

        user.setKycStatus("REJECTED");
        userRepository.save(user);

        // Notify User
        notificationService.createNotification(
                user,
                "KYC_STATUS",
                "KYC Application Requires Action",
                "Your KYC application was reviewed and requires attention. Reason: " + reason,
                user.getId().toString(),
                "KYC_REJECTION");

        try {
            emailService.sendEmail(
                    user.getEmail(),
                    "KYC Application Requires Action - ShineFiling",
                    "Dear " + user.getFullName() + ",\n\n" +
                            "Your KYC application has been reviewed and requires attention.\n\n" +
                            "Reason: " + reason + "\n\n" +
                            "Best Regards,\nShineFiling Team");
        } catch (Exception e) {
        }

        return ResponseEntity.ok(Map.of("message", "Agent KYC Rejected"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to delete user: " + e.getMessage()));
        }
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = Paths.get(System.getProperty("user.home") + "/.shinefiling/uploads/").resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok().body(resource);
            } else {
                throw new RuntimeException("Could not read file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
}
