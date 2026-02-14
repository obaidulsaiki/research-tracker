package com.example.backend.service;

import com.example.backend.entity.research.Publication;
import com.example.backend.entity.research.Research;
import com.example.backend.repository.ResearchRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class DataMigrationService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ResearchRepo researchRepo;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void migrateLegacyPublicationData() {
        log.info("Starting Publication Data Migration...");

        // Find research records that don't have a publication object yet
        String checkSql = "SELECT id, paper_type, publisher_name, publisher_year, journal_quartile, conference_venue " +
                "FROM research WHERE publication_id IS NULL";

        try {
            List<Map<String, Object>> records = jdbcTemplate.queryForList(checkSql);

            if (records.isEmpty()) {
                log.info("No legacy publication data found to migrate.");
                return;
            }

            log.info("Found {} records with legacy publication data. Migrating...", records.size());

            for (Map<String, Object> record : records) {
                Long researchId = ((Number) record.get("id")).longValue();
                Research research = researchRepo.findById(researchId).orElse(null);

                if (research != null && research.getPublication() == null) {
                    Publication pub = new Publication();

                    // Map legacy columns to new Publication fields
                    pub.setType(getString(record, "paper_type"));
                    pub.setName(getString(record, "publisher_name"));
                    pub.setPublisher(getString(record, "publisher_name")); // Use same as default or extract if possible
                    pub.setYear(getString(record, "publisher_year"));

                    // Handle Venue (was sometimes in publisher_name or conference_venue)
                    String venue = getString(record, "conference_venue");
                    pub.setVenue(venue != null ? venue : "");

                    // Handle Impact Factor (was journal_quartile)
                    pub.setImpactFactor(getString(record, "journal_quartile"));

                    // Default URL if missing
                    pub.setUrl("");

                    research.setPublication(pub);
                    researchRepo.save(research);
                    log.info("Successfully migrated publication data for Research ID: {}", researchId);
                }
            }

            log.info("Publication Data Migration completed successfully.");

        } catch (Exception e) {
            log.warn("Migration skipped or failed (legacy columns may already be gone): {}", e.getMessage());
        }
    }

    private String getString(Map<String, Object> record, String column) {
        Object val = record.get(column);
        if (val == null)
            return null;
        String s = String.valueOf(val).trim();
        return s.isEmpty() ? null : s;
    }
}
