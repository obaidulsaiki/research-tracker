package com.example.backend.service.scraper;

import com.example.backend.dto.JournalMetadataDTO;

public interface MetadataScraper {
    boolean supports(String url);

    JournalMetadataDTO scrape(String url, String journalName);
}
