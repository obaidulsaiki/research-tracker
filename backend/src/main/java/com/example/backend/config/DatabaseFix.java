package com.example.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseFix implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("DATABASE FIX: Checking for stale constraints...");
        try {
            // Spring Boot 3+ Hibernate generates check constraints for enums.
            jdbcTemplate.execute("ALTER TABLE research DROP CONSTRAINT IF EXISTS research_status_check;");

            // SCHEMA OPTIMIZATION: Refine author_research table
            // 1. Rename column if it exists in 'author_research'
            try {
                jdbcTemplate
                        .execute("ALTER TABLE author_research RENAME COLUMN contribution_percentage TO author_order;");
            } catch (Exception ignore) {
                // Column might already be renamed or not exist
            }

            try {
                // 2. Drop the redundant surrogate ID if it exists
                jdbcTemplate.execute("ALTER TABLE author_research DROP COLUMN IF EXISTS id;");
                System.out.println("DATABASE FIX: Successfully optimized author_research table.");
            } catch (Exception ignore) {
                // Column might already be dropped or not exist
            }

            try {
                // CLEANUP: Remove "Phantom Authors" (standalone symbols like * or empty names)
                // Using plural table name 'authors' as defined in Author entity
                jdbcTemplate.execute(
                        "DELETE FROM authors WHERE name IS NULL OR TRIM(name) = '' OR name = '*' OR name = '†' OR name = '‡' OR name = '§'");
            } catch (Exception ignore) {
                // Table might still be 'author' in legacy DBs or not exist yet
                try {
                    jdbcTemplate.execute(
                            "DELETE FROM author WHERE name IS NULL OR TRIM(name) = '' OR name = '*' OR name = '†' OR name = '‡' OR name = '§'");
                } catch (Exception e2) {
                    // Ignore second failure
                }
            }

            System.out.println("DATABASE FIX: Successfully optimized and cleaned database.");
        } catch (Exception e) {
            System.err.println("DATABASE FIX CRITICAL ERROR: " + e.getMessage());
        }
    }
}
