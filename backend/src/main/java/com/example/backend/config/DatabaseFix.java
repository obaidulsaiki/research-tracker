package com.example.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseFix implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("DATABASE FIX: Checking for stale constraints...");
        try {
            // Spring Boot 3+ Hibernate generates check constraints for enums.
            jdbcTemplate.execute("ALTER TABLE research DROP CONSTRAINT IF EXISTS research_status_check;");

            // CLEANUP: Remove "Phantom Authors" (standalone symbols like * or empty names)
            // 1. Delete authors where the name is purely symbols (using REGEXP_REPLACE if
            // available, else specific symbols)
            // SQL Standard / H2 / PostgreSql approach
            jdbcTemplate.execute("DELETE FROM author WHERE TRIM(name) = '' OR name REGEXP '^[*†‡§]+$'");

            System.out.println("DATABASE FIX: Successfully dropped constraint and cleaned phantom authors.");
        } catch (Exception e) {
            System.err.println("DATABASE FIX ERROR: " + e.getMessage());
        }
    }
}
