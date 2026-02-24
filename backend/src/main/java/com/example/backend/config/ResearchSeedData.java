package com.example.backend.config;

import com.example.backend.entity.research.*;
import com.example.backend.repository.HistoryEntryRepo;
import com.example.backend.repository.ResearchRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;

@Configuration
public class ResearchSeedData {

    @Bean
    CommandLineRunner seedResearch(ResearchRepo researchRepo, HistoryEntryRepo historyRepo) {
        return args -> {
            if (researchRepo.count() == 0) {
                // Demo Research 1: Deep Learning for Agriculture
                Research r1 = new Research();
                r1.setTitle("Deep Learning for Precision Agriculture in South Asia");
                r1.setStatus(Status.WORKING);
                r1.setPublicVisibility(PublicVisibility.PUBLIC);
                r1.setFeatured(true);
                r1.setSubmissionDate(LocalDate.now().minusDays(10));

                // Demo Research 2: Privacy in Mobile Apps
                Research r2 = new Research();
                r2.setTitle("Analyzing Privacy Leakage in Popular Mobile Applications");
                r2.setStatus(Status.ACCEPTED);
                r2.setPublicVisibility(PublicVisibility.PUBLIC);
                r2.setSubmissionDate(LocalDate.now().minusDays(30));
                r2.setDecisionDate(LocalDate.now().minusDays(5));

                researchRepo.saveAll(Arrays.asList(r1, r2));

                // Seed History to populate Dashboard Activity Chart (weighted to recent days)
                LocalDateTime now = LocalDateTime.now();

                // Today (High Activity)
                historyRepo.save(createHistory(r1, "FIELD_UPDATE", "Drafting", "Experimentation", now.minusHours(2)));
                historyRepo.save(
                        createHistory(r1, "FIELD_UPDATE", "Notes", "Added dataset references", now.minusHours(4)));
                historyRepo.save(createHistory(r2, "STATUS_CHANGE", "WORKING", "ACCEPTED", now.minusHours(6)));

                // Yesterday
                historyRepo.save(createHistory(r1, "CREATED", null, r1.getTitle(), now.minusDays(1).minusHours(3)));

                // 3 Days ago
                historyRepo.save(createHistory(r2, "FIELD_UPDATE", "0%", "50%", now.minusDays(3).minusHours(1)));

                // 5 Days ago
                historyRepo.save(createHistory(r2, "CREATED", null, r2.getTitle(), now.minusDays(5).minusHours(2)));
            }
        };
    }

    private HistoryEntry createHistory(Research r, String type, String old, String next, LocalDateTime time) {
        HistoryEntry h = new HistoryEntry();
        h.setResearch(r);
        h.setChangeType(type);
        h.setOldValue(old);
        h.setNewValue(next);
        h.setTimestamp(time);
        return h;
    }
}
