package com.example.backend.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthorMigrationService {

    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    @Transactional
    public void migrateData() {
        try {
            // 1. Check if the old columns still exist in the 'author' table
            List<Map<String, Object>> columns = jdbcTemplate.queryForList(
                    "SELECT column_name FROM information_schema.columns WHERE table_name = 'author' AND column_name IN ('research_id', 'role', 'contribution_percentage')");

            if (columns.isEmpty()) {
                return; // Silently skip if no columns
            }

            Integer legacyCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM author", Integer.class);
            if (legacyCount == null || legacyCount == 0) {
                return; // Silently skip if table is empty
            }

            System.out.println("AUTHOR MIGRATION: Found " + legacyCount + " legacy records. Starting migration...");

            // 2. Fetch all legacy author data
            List<Map<String, Object>> legacyAuthors = jdbcTemplate.queryForList(
                    "SELECT id, name, role, contribution_percentage, research_id FROM author");

            // 3. Group by name to identify unique authors
            for (Map<String, Object> legacy : legacyAuthors) {
                String name = (String) legacy.get("name");
                String role = (String) legacy.get("role");
                Double percentage = (Double) legacy.get("contribution_percentage");
                Long researchId = (Long) legacy.get("research_id");

                if (name == null || researchId == null)
                    continue;

                // Find or create the UNIQUE author in 'authors' table
                List<Long> existingIds = jdbcTemplate.queryForList(
                        "SELECT id FROM authors WHERE name = ?", Long.class, name);

                Long authorId;
                if (existingIds.isEmpty()) {
                    jdbcTemplate.update("INSERT INTO authors (name) VALUES (?)", name);
                    authorId = jdbcTemplate.queryForObject("SELECT id FROM authors WHERE name = ?", Long.class, name);
                } else {
                    authorId = existingIds.get(0);
                }

                // Create the link in mapping table (Composite PK: author_id + research_id)
                // We map percentage to order (casted to int)
                int order = percentage != null ? percentage.intValue() : 1;
                jdbcTemplate.update(
                        "INSERT INTO author_research (author_id, research_id, role, author_order) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING",
                        authorId, researchId, role, order);
            }

            System.out.println("AUTHOR MIGRATION: Successfully migrated records.");

        } catch (Exception e) {
            System.err.println("AUTHOR MIGRATION ERROR: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
