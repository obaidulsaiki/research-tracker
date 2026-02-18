package com.example.backend.service;

import com.example.backend.dto.JournalMetadataDTO;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class SmartScraperService {

    @Autowired
    private RestTemplate restTemplate;

    public JournalMetadataDTO scrape(String journalName) {
        System.out.println("SMART SCRAPER: Initiating search for '" + journalName + "'");

        // 1. Discover official URL and ISSN using OpenAlex
        OpenAlexSource source = discoverSource(journalName);
        if (source == null || source.homepageUrl == null) {
            System.err.println("SMART SCRAPER: Could not discover source for " + journalName);
            return null;
        }

        String homepageUrl = source.homepageUrl;
        String issn = source.issn;
        System.out.println("SMART SCRAPER: Discovered source: " + homepageUrl + " (ISSN: " + issn + ")");

        try {
            // 2. Clear common junk from URL and connect (Use more headers)
            Document doc = Jsoup.connect(homepageUrl)
                    .userAgent(
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                    .header("Accept-Language", "en-US,en;q=0.5")
                    .followRedirects(true)
                    .timeout(10000)
                    .get();

            String impactFactor = "0.0";
            String quartile = "N/A";
            String publisher = extractPublisher(homepageUrl);

            // 3. Extraction Logic (Publisher Specific Patterns)
            if (homepageUrl.contains("springer.com") || homepageUrl.contains("link.springer.com")) {
                impactFactor = extractMetric(doc, "Impact Factor", "2-year Impact Factor", "CiteScore");
            } else if (homepageUrl.contains("elsevier.com") || homepageUrl.contains("sciencedirect.com")) {
                impactFactor = extractMetric(doc, "Impact Factor", "CiteScore");
            } else if (homepageUrl.contains("ieeexplore.ieee.org")) {
                impactFactor = extractMetric(doc, "Impact Factor");
            } else {
                // Generic fallback scraper
                impactFactor = extractMetric(doc, "Impact Factor", "CiteScore", "IF");
            }

            // 4. Try to determine Quartile
            quartile = extractQuartile(doc);

            // 4. SECONDARY FALLBACK: Resurchify (Better than OpenAlex proxy for Quartiles)
            if ("0.0".equals(impactFactor) || "N/A".equals(quartile)) {
                if (issn != null) {
                    System.out.println(
                            "SMART SCRAPER: Scraping failed for publisher, attempting Resurchify with ISSN: " + issn);
                    JournalMetadataDTO resurchify = scrapeResurchify(issn, journalName);
                    if (resurchify != null) {
                        if ("0.0".equals(impactFactor))
                            impactFactor = resurchify.getImpactFactor();
                        if ("N/A".equals(quartile))
                            quartile = resurchify.getQuartile();
                        System.out.println("SMART SCRAPER: Resurchify Match: IF=" + impactFactor + ", Q=" + quartile);
                    }
                }
            }

            // 5. FINAL FALLBACK: OpenAlex Metrics (Proxy)
            if ("0.0".equals(impactFactor)) {
                System.out.println("SMART SCRAPER: All scraping failed, using OpenAlex proxy...");
                impactFactor = getOpenAlexMetric(journalName);
            }

            return JournalMetadataDTO.builder()
                    .name(journalName)
                    .publisher(publisher)
                    .impactFactor(impactFactor)
                    .quartile(quartile)
                    .url(homepageUrl)
                    .build();

        } catch (IOException e) {
            System.err.println("SMART SCRAPER: Failed to scrape " + homepageUrl + ": " + e.getMessage());
        }

        return null;
    }

    private String getOpenAlexMetric(String journalName) {
        try {
            String apiUrl = "https://api.openalex.org/sources?search=" + journalName;
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(apiUrl, Map.class);
            if (response != null && response.containsKey("results")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
                if (!results.isEmpty()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> stats = (Map<String, Object>) results.get(0).get("summary_stats");
                    if (stats != null && stats.containsKey("2yr_mean_citedness")) {
                        Object val = stats.get("2yr_mean_citedness");
                        if (val instanceof Number) {
                            return String.format("%.2f", ((Number) val).doubleValue());
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("SMART SCRAPER: OpenAlex metric fallback failed: " + e.getMessage());
        }
        return "0.0";
    }

    private JournalMetadataDTO scrapeResurchify(String issn, String journalName) {
        try {
            String url = "https://www.resurchify.com/impact/details/" + issn;
            Document doc = Jsoup.connect(url)
                    .userAgent(
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .timeout(5000)
                    .get();

            String impactScore = extractMetric(doc, "Impact Score", "Impact Factor");
            String quartile = extractQuartile(doc);

            return JournalMetadataDTO.builder()
                    .impactFactor(impactScore)
                    .quartile(quartile)
                    .build();
        } catch (Exception e) {
            return null;
        }
    }

    private OpenAlexSource discoverSource(String journalName) {
        try {
            String apiUrl = "https://api.openalex.org/sources?search=" + journalName;
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(apiUrl, Map.class);
            if (response != null && response.containsKey("results")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
                if (!results.isEmpty()) {
                    Map<String, Object> top = results.get(0);
                    return new OpenAlexSource(
                            (String) top.get("homepage_url"),
                            (String) top.get("issn_l"));
                }
            }
        } catch (Exception e) {
            System.err.println("SMART SCRAPER: OpenAlex lookup failed: " + e.getMessage());
        }
        return null;
    }

    private static class OpenAlexSource {
        String homepageUrl;
        String issn;

        OpenAlexSource(String url, String issn) {
            this.homepageUrl = url;
            this.issn = issn;
        }
    }

    private String extractMetric(Document doc, String... keywords) {
        // 1. Specific Selector Search (High Accuracy)
        // Springer/Nature often use these classes
        Element springerMetric = doc.selectFirst(".c-journal-metrics__item .c-journal-metrics__value");
        if (springerMetric != null) {
            String text = springerMetric.text();
            if (text.contains(".") && !text.contains("k") && !text.contains("m")) {
                return text.replaceAll("[^0-9.]", "");
            }
        }

        // Generic selector search
        Element ifElement = doc.selectFirst("span:contains(Impact Factor), div:contains(Impact Factor)");
        if (ifElement != null) {
            Matcher m = Pattern.compile("(\\d+\\.\\d+)").matcher(ifElement.text());
            if (m.find()) {
                String val = m.group(1);
                if (Double.parseDouble(val) < 150.0)
                    return val;
            }
        }

        // 2. Body Text Search (Regex Fallback)
        String text = doc.body().text();
        for (String keyword : keywords) {
            // Refined regex: Ensure keyword is near a number, but ignore if followed by
            // k/K/million/downloads
            Pattern pattern = Pattern.compile(keyword + ".*?(\\d+\\.\\d+)(?!\\s*[kKmM])", Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(text);
            if (matcher.find()) {
                String val = matcher.group(1);
                double dVal = Double.parseDouble(val);
                // Magnitude guard: IF > 150 is statistically zero except for very special cases
                // like Nature/Lancet
                // which are already in our Seed anyway.
                if (dVal < 150.0) {
                    return val;
                }
            }
        }

        return "0.0";
    }

    private String extractQuartile(Document doc) {
        String text = doc.body().text();
        Pattern pattern = Pattern.compile("(Q[1-4])", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(1).toUpperCase();
        }
        return "N/A";
    }

    private String extractPublisher(String url) {
        if (url.contains("springer"))
            return "Springer Nature";
        if (url.contains("elsevier") || url.contains("sciencedirect"))
            return "Elsevier";
        if (url.contains("ieee"))
            return "IEEE";
        if (url.contains("nature.com"))
            return "Nature Portfolio";
        if (url.contains("wiley"))
            return "Wiley";
        if (url.contains("tandfonline"))
            return "Taylor & Francis";
        return "Unknown Publisher";
    }
}
