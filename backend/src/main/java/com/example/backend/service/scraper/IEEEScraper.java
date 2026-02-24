package com.example.backend.service.scraper;

import com.example.backend.dto.JournalMetadataDTO;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;

@Component
public class IEEEScraper extends BaseScraper {

    @Override
    public boolean supports(String url) {
        return url.contains("ieeexplore.ieee.org");
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
                    .impactFactor(extractMetric(doc, "Impact Factor"))
                    .quartile(extractQuartile(doc))
                    .url(url)
                    .build();
        } catch (Exception e) {
            return null;
        }
    }
}
