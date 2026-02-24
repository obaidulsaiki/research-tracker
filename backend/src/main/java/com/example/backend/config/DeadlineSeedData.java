package com.example.backend.config;

import com.example.backend.entity.ConferenceDeadline;
import com.example.backend.repository.ConferenceDeadlineRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.time.LocalDateTime;
import java.util.Arrays;

@Configuration
public class DeadlineSeedData {

    @Bean
    CommandLineRunner seedDeadlines(ConferenceDeadlineRepo repo) {
        return args -> {
            System.out.println("DEADLINE SEEDER: Checking database... Current count: " + repo.count());
            if (repo.count() == 0) {
                System.out.println("DEADLINE SEEDER: Seeding 3 demo deadlines...");
                repo.saveAll(Arrays.asList(
                        ConferenceDeadline.builder()
                                .conferenceName("NeurIPS 2026")
                                .submissionDeadline(LocalDateTime.now().plusDays(45))
                                .priority("High")
                                .url("https://neurips.cc")
                                .notes("Flagship ML conference")
                                .build(),
                        ConferenceDeadline.builder()
                                .conferenceName("ICML 2026")
                                .submissionDeadline(LocalDateTime.now().plusDays(12).plusHours(5))
                                .priority("High")
                                .url("https://icml.cc")
                                .notes("Top-tier ML venue")
                                .build(),
                        ConferenceDeadline.builder()
                                .conferenceName("CVPR 2026")
                                .submissionDeadline(LocalDateTime.now().plusDays(3).plusHours(2))
                                .priority("Urgent")
                                .url("https://cvpr.thecvf.com")
                                .notes("Computer Vision flagship")
                                .build()));
                System.out.println("DEADLINE SEEDER: Done.");
            }
        };
    }
}
