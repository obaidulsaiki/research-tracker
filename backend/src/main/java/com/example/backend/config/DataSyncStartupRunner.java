package com.example.backend.config;

import com.example.backend.service.ConferenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Configuration
@RequiredArgsConstructor
@Slf4j
@Order(10) // Run after initial seeders if any
public class DataSyncStartupRunner implements CommandLineRunner {

    private final ConferenceService conferenceService;

    @Override
    public void run(String... args) throws Exception {
        log.info("STARTUP: Running automated data sync for papers and conferences...");
        try {
            conferenceService.syncAllExistingData();
            log.info("STARTUP: Data sync successful.");
        } catch (Exception e) {
            log.error("STARTUP ERROR: Failed to sync data: {}", e.getMessage());
        }
    }
}
