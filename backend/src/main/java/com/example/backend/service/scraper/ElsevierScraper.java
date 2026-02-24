package com.example.backend.service.scraper;

import com.example.backend.dto.JournalMetadataDTO;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;

@Component
public class ElsevierScraper extends BaseScraper {

    @Override
    public boolean supports(String url) {
        return url.contains("elsevier.com") || url.contains("sciencedirect.com");
    }

    @Override
    public JournalMetadataDTO scrape(String url, String journalName) {
        try {
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0")
                    .timeout(10000)
                    .get();

            return JournalMetadataDTO.builder()
                    .name(journalName)
                    .publisher(extractPublisherFromUrl(url))
                    .impactFactor(extractMetric(doc, "Impact Factor", "CiteScore"))
                    .quartile(extractQuartile(doc))
                    .url(url)
                    .build();
        } catch (Exception e) {
            System.err.println("ELSEVIER SCRAPER ERROR for " + url + ": " + e.getMessage());
            return JournalMetadataDTO.builder()
                    .name(journalName)
                    .url(url)
                    .publisher("Elsevier")
                    .impactFactor("N/A")
                    .quartile("N/A")
                    .build();
        }
    }
}
