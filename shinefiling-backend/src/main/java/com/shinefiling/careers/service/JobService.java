package com.shinefiling.careers.service;

import com.shinefiling.careers.model.Job;
import com.shinefiling.careers.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class JobService {
    @Autowired
    private JobRepository jobRepository;

    public List<Job> getAllActiveJobs() {
        return jobRepository.findByActiveTrue();
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job saveJob(Job job) {
        return jobRepository.save(job);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }
}
