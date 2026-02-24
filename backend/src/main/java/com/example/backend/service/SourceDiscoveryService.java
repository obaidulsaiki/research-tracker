package com.example.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SourceDiscoveryService {

    private final RestTemplate restTemplate;

    public OpenAlexSource discoverSource(String journalName) {
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
            log.error("SOURCE DISCOVERY: OpenAlex lookup failed: {}", e.getMessage());
        }
        return null;
    }

    public String getOpenAlexMetric(String journalName) {
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
            log.error("SOURCE DISCOVERY: OpenAlex metric fallback failed: {}", e.getMessage());
        }
        return "0.0";
    }

    public static record OpenAlexSource(String homepageUrl, String issn) {
    }
}
