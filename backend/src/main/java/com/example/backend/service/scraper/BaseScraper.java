package com.example.backend.service.scraper;

import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public abstract class BaseScraper implements MetadataScraper {

    protected String extractMetric(Document doc, String... keywords) {
        // Nature/Springer specific high-accuracy selector
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

        // Body text search fallback
        String text = doc.body().text();
        for (String keyword : keywords) {
            Pattern pattern = Pattern.compile(keyword + ".*?(\\d+\\.\\d+)(?!\\s*[kKmM])", Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(text);
            if (matcher.find()) {
                String val = matcher.group(1);
                if (Double.parseDouble(val) < 150.0)
                    return val;
            }
        }

        return "0.0";
    }

    protected String extractQuartile(Document doc) {
        String text = doc.body().text();
        Pattern pattern = Pattern.compile("(Q[1-4])", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(1).toUpperCase();
        }
        return "N/A";
    }

    protected String extractPublisherFromUrl(String url) {
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
