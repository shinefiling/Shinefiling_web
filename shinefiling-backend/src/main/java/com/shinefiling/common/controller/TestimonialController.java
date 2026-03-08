package com.shinefiling.common.controller;

import com.shinefiling.common.model.Testimonial;
import com.shinefiling.common.repository.TestimonialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/testimonials")
@CrossOrigin(origins = "http://localhost:5173")
public class TestimonialController {

    @Autowired
    private TestimonialRepository testimonialRepository;

    @GetMapping("/approved")
    public List<Testimonial> getApproved() {
        List<Testimonial> list = testimonialRepository.findByApprovedTrue();
        if (list.isEmpty()) {
            // Provide some default ones if empty to avoid blank homepage
            Testimonial t1 = new Testimonial();
            t1.setCustomerName("Rajesh Kumar");
            t1.setServiceName("GST Registration");
            t1.setFeedback(
                    "ShineFiling made my GST registration incredibly easy. Their team was professional and handled everything online.");
            t1.setRating(5);
            t1.setApproved(true);

            Testimonial t2 = new Testimonial();
            t2.setCustomerName("Priya Sharma");
            t2.setServiceName("Pvt Ltd Company");
            t2.setFeedback(
                    "Fastest company incorporation I've experienced. The dashboard makes it very simple to track document status.");
            t2.setRating(5);
            t2.setApproved(true);

            Testimonial t3 = new Testimonial();
            t3.setCustomerName("Amit Patel");
            t3.setServiceName("Trademark Filing");
            t3.setFeedback("Helped me protect my brand without any hassle. Highly recommended for startups in India.");
            t3.setRating(4);
            t3.setApproved(true);

            return List.of(t1, t2, t3);
        }
        return list;
    }

    @PostMapping
    public ResponseEntity<?> submit(@RequestBody Testimonial testimonial) {
        testimonial.setApproved(false); // New testimonials need approval
        return ResponseEntity.ok(testimonialRepository.save(testimonial));
    }

    @GetMapping("/all")
    public List<Testimonial> getAll() {
        return testimonialRepository.findAll();
    }
}
