package com.example.backend.service.scraper;

import com.example.backend.dto.JournalMetadataDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScraperManager {

    private final List<MetadataScraper> scrapers;
    private final GenericScraper genericScraper;

    public JournalMetadataDTO scrape(String url, String journalName) {
        if (url == null || url.isEmpty())
            return null;

        for (MetadataScraper scraper : scrapers) {
            if (!(scraper instanceof GenericScraper) && scraper.supports(url)) {
                JournalMetadataDTO result = scraper.scrape(url, journalName);
                if (result != null)
                    return result;
            }
        }

        return genericScraper.scrape(url, journalName);
    }
}
