package com.shinefiling.common.controller;

import com.shinefiling.common.service.EmailService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/common")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/send-mail")
    public ResponseEntity<String> sendMail(@RequestBody EmailRequest request) {
        try {
            emailService.sendEmail(request.getTo(), request.getSubject(), request.getBody());
            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending email: " + e.getMessage());
        }
    }

    @Data
    public static class EmailRequest {
        private String to;
        private String subject;
        private String body;
    }
}
