package com.shinefiling.common.service;

import com.shinefiling.common.model.User;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TemplateService templateService;

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email address already exists. Please login or use a different email.");
        }
        if (user.getMobile() != null && !user.getMobile().isEmpty() && userRepository.existsByMobile(user.getMobile())) {
            throw new RuntimeException("Mobile number already exists. Please login or use a different mobile number.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Default role is USER
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        // Generate OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setOtp(otp);
        user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));
        user.setVerified(false);

        User savedUser = userRepository.save(user);

        // Send OTP Email via Template
        java.util.Map<String, String> vars = new java.util.HashMap<>();
        vars.put("otp", otp);
        templateService.sendTemplatedEmail(user.getEmail(), "EMAIL_VERIFICATION_OTP", vars);

        return savedUser;
    }

    public boolean verifyUser(String email, String otp) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getOtp() != null && user.getOtp().equals(otp) &&
                    user.getOtpExpiry().isAfter(java.time.LocalDateTime.now())) {
                user.setVerified(true);
                user.setOtp(null); // Clear OTP
                userRepository.save(user);
                
                // Send KYC Reminder for CA/Agent if KYC is not yet submitted
                if (("CA".equalsIgnoreCase(user.getRole()) || "AGENT".equalsIgnoreCase(user.getRole())) && "PENDING".equalsIgnoreCase(user.getKycStatus())) {
                    sendKycReminder(user);
                }
                return true;
            }
        }
        return false;
    }

    private void sendKycReminder(User user) {
        String roleLabel = "CA".equalsIgnoreCase(user.getRole()) ? "Chartered Accountant (CA)" : "Service Agent";
        
        java.util.Map<String, String> vars = new java.util.HashMap<>();
        vars.put("name", user.getFullName());
        vars.put("roleLabel", roleLabel);
        
        templateService.sendTemplatedEmail(user.getEmail(), "KYC_REMINDER", vars);
    }

    public void resendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Account not found with this email."));

        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setOtp(otp);
        user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        java.util.Map<String, String> vars = new java.util.HashMap<>();
        vars.put("otp", otp);
        templateService.sendTemplatedEmail(user.getEmail(), "EMAIL_VERIFICATION_OTP", vars);
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with this email address. Please check and try again."));

        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setOtp(otp);
        user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        java.util.Map<String, String> vars = new java.util.HashMap<>();
        vars.put("otp", otp);
        templateService.sendTemplatedEmail(user.getEmail(), "EMAIL_VERIFICATION_OTP", vars);
    }

    public void resetPassword(String email, String otp, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Account not found."));

        if (user.getOtp() != null && user.getOtp().equals(otp) &&
                user.getOtpExpiry().isAfter(java.time.LocalDateTime.now())) {
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setOtp(null); // Clear OTP after use
            user.setOtpExpiry(null);
            userRepository.save(user);
        } else {
            throw new RuntimeException("Invalid or expired OTP");
        }
    }

    public User loginUser(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return user;
            }
        }
        return null;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserRole(Long userId, String newRole) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(newRole);
        return userRepository.save(user);
    }

    public User processGoogleLogin(String email, String fullName, String googleId, String role) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Update googleId/method if missing
            if (user.getGoogleId() == null) {
                user.setGoogleId(googleId);
                user.setLoginMethod("google");
                userRepository.save(user);
            }
            return user;
        } else {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(fullName);
            newUser.setGoogleId(googleId);
            newUser.setRole(role != null ? role : "USER"); // Dynamic role
            newUser.setVerified(true); // Google users are pre-verified
            newUser.setLoginMethod("google");
            // Set dummy password
            newUser.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
            User savedUser = userRepository.save(newUser);
            
            // Send KYC Reminder for CA/Agent if KYC is not yet submitted (usually true for new Google users)
            if (("CA".equalsIgnoreCase(savedUser.getRole()) || "AGENT".equalsIgnoreCase(savedUser.getRole())) && "PENDING".equalsIgnoreCase(savedUser.getKycStatus())) {
                sendKycReminder(savedUser);
            }
            return savedUser;
        }
    }
}
