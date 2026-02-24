package com.example.backend.service;

import com.example.backend.entity.ConferenceDeadline;
import com.example.backend.repository.ConferenceDeadlineRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeadlineService implements CommandLineRunner {

    private final ConferenceDeadlineRepo repo;

    @Override
    public void run(String... args) throws Exception {
        seedInitialData();
    }

    @Transactional
    public void seedInitialData() {
        if (repo.count() == 0) {
            log.info("DEADLINE SERVICE: Seeding initial conference deadlines...");
            repo.saveAll(Arrays.asList(
                    ConferenceDeadline.builder()
                            .conferenceName("NeurIPS 2026")
                            .submissionDeadline(LocalDateTime.now().plusDays(45))
                            .priority("High")
                            .url("https://neurips.cc")
                            .notes("Primary target for ML research")
                            .build(),
                    ConferenceDeadline.builder()
                            .conferenceName("ICML 2026")
                            .submissionDeadline(LocalDateTime.now().plusDays(12).plusHours(5))
                            .priority("High")
                            .url("https://icml.cc")
                            .notes("Top-tier machine learning venue")
                            .build(),
                    ConferenceDeadline.builder()
                            .conferenceName("CVPR 2026")
                            .submissionDeadline(LocalDateTime.now().plusDays(3).plusHours(2))
                            .priority("Urgent")
                            .url("https://cvpr.thecvf.com")
                            .notes("Computer Vision flagship conference")
                            .build()));
            log.info("DEADLINE SERVICE: Seeding complete.");
        } else {
            log.info("DEADLINE SERVICE: Database already contains {} deadlines. Skipping seed.", repo.count());
        }
    }

    public List<ConferenceDeadline> getAllDeadlines() {
        return repo.findAllByOrderBySubmissionDeadlineAsc();
    }

    @Transactional
    public ConferenceDeadline saveDeadline(ConferenceDeadline deadline) {
        // Prevent exact duplicates
        if (repo.existsByConferenceNameAndSubmissionDeadline(deadline.getConferenceName(),
                deadline.getSubmissionDeadline())) {
            log.warn("DEADLINE SERVICE: Duplicate deadline detected for '{}'. Skipping save.",
                    deadline.getConferenceName());
            return null;
        }
        return repo.save(deadline);
    }

    @Transactional
    public void deleteDeadline(Long id) {
        repo.deleteById(id);
    }
}
