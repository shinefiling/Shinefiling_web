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

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
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

        // Send OTP Email
        emailService.sendEmail(
                user.getEmail(),
                "ShineFiling - Verify your email",
                "Your OTP for verification is: " + otp + "\nIt expires in 10 minutes.");

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
                return true;
            }
        }
        return false;
    }

    public void resendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setOtp(otp);
        user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        emailService.sendEmail(
                user.getEmail(),
                "ShineFiling - Resend OTP",
                "Your new OTP for verification is: " + otp + "\nIt expires in 10 minutes.");
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

    public User processGoogleLogin(String email, String fullName, String googleId) {
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
            newUser.setRole("USER");
            newUser.setVerified(true); // Google users are pre-verified
            newUser.setLoginMethod("google");
            // Set dummy password
            newUser.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
            return userRepository.save(newUser);
        }
    }
}
