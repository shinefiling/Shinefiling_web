package com.shinefiling.careers.controller;

import com.shinefiling.careers.model.Job;
import com.shinefiling.careers.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/careers")
@CrossOrigin(origins = "*") // Allow frontend access
public class JobController {

    @Autowired
    private JobService jobService;

    // Public endpoint for Career Page
    @GetMapping("/jobs")
    public List<Job> getActiveJobs() {
        return jobService.getAllActiveJobs();
    }

    // Admin endpoints
    @GetMapping("/admin/jobs")
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    @PostMapping("/admin/jobs")
    public Job createJob(@RequestBody Job job) {
        return jobService.saveJob(job);
    }

    @PutMapping("/admin/jobs/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job jobDetails) {
        return jobService.getJobById(id)
                .map(job -> {
                    job.setTitle(jobDetails.getTitle());
                    job.setDepartment(jobDetails.getDepartment());
                    job.setLocation(jobDetails.getLocation());
                    job.setType(jobDetails.getType());
                    job.setDescription(jobDetails.getDescription());
                    job.setActive(jobDetails.isActive());
                    return ResponseEntity.ok(jobService.saveJob(job));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/admin/jobs/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok().build();
    }
}
