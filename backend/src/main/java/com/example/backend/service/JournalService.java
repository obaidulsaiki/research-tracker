package com.example.backend.service;

import com.example.backend.dto.JournalMetadataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class JournalService {

        @Autowired
        private RestTemplate restTemplate;

        private final Map<String, JournalMetadataDTO> journalDatabase = new HashMap<>();

        public JournalService() {
                // CURATED JOURNAL DATABASE
                addJournal("IEEE Access", "IEEE", "3.9", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6287639");
                addJournal("Heliyon", "Cell Press", "4.0", "Q1", "https://www.cell.com/heliyon/home");
                addJournal("Scientific Reports", "Nature Portfolio", "4.6", "Q1", "https://www.nature.com/srep/");
                addJournal("Discover Computing", "Springer Nature", "2.1", "Q2",
                                "https://www.springer.com/journal/44196");
                addJournal("I-ST Computer Science", "Springer Nature", "1.8", "Q2",
                                "https://www.springer.com/journal/13278");
                addJournal("Biomedical Materials & Devices", "Springer Nature", "3.2", "Q2",
                                "https://link.springer.com/journal/44227");
                addJournal("Journal of Neuroscience Methods", "Elsevier", "2.5", "Q3",
                                "https://www.sciencedirect.com/journal/journal-of-neuroscience-methods");
                addJournal("Data in Brief", "Elsevier", "1.2", "Q3",
                                "https://www.sciencedirect.com/journal/data-in-brief");
                addJournal("Open Cell Signaling", "PeerJ", "1.0", "Q4", "https://peerj.com/journals/cell-signaling/");

                // Regional / Conference Publishers fallback
                addJournal("ICCIT", "IEEE Xplore", "0.0", "CONFERENCE",
                                "https://ieeexplore.ieee.org/xpl/conhome/1000346/all-proceedings");
                addJournal("ICECTE", "IEEE Xplore", "0.0", "CONFERENCE",
                                "https://ieeexplore.ieee.org/xpl/conhome/1000346/all-proceedings");
                addJournal("ICEFRONT", "IEEE Xplore", "0.0", "CONFERENCE",
                                "https://ieeexplore.ieee.org/xpl/conhome/1000346/all-proceedings");
        }

        private void addJournal(String name, String publisher, String ifFactor, String quartile, String url) {
                journalDatabase.put(name.toLowerCase(), JournalMetadataDTO.builder()
                                .name(name)
                                .publisher(publisher)
                                .impactFactor(ifFactor)
                                .quartile(quartile)
                                .url(url)
                                .build());
        }

        public Optional<JournalMetadataDTO> lookup(String name) {
                if (name == null || name.isBlank())
                        return Optional.empty();

                String search = name.toLowerCase().trim();
                System.out.println("JOURNAL LOOKUP: Request for '" + name + "' (search: '" + search + "')");

                // 1. Try curated database first (exact)
                if (journalDatabase.containsKey(search)) {
                        System.out.println("JOURNAL LOOKUP: Exact match found in curated DB for '" + search + "'");
                        return Optional.of(journalDatabase.get(search));
                }

                // 2. Try curated database (partial)
                Optional<JournalMetadataDTO> localMatch = journalDatabase.entrySet().stream()
                                .filter(entry -> search.contains(entry.getKey()) || entry.getKey().contains(search))
                                .map(Map.Entry::getValue)
                                .findFirst();

                if (localMatch.isPresent()) {
                        System.out.println("JOURNAL LOOKUP: Partial match found in curated DB: "
                                        + localMatch.get().getName());
                        return localMatch;
                }

                // 3. Fallback to OpenAlex API
                System.out.println("JOURNAL LOOKUP: No local match. Calling OpenAlex API for: " + name);
                try {
                        String apiUrl = "https://api.openalex.org/sources?search=" + name;
                        Map<String, Object> response = restTemplate.getForObject(apiUrl, Map.class);
                        if (response != null && response.containsKey("results")) {
                                List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
                                if (!results.isEmpty()) {
                                        Map<String, Object> topResult = results.get(0);

                                        String foundName = (String) topResult.get("display_name");

                                        // OpenAlex response structure for publisher can be complex
                                        Object publisherObj = topResult.get("host_organization_name");
                                        String publisher = publisherObj != null ? publisherObj.toString()
                                                        : (String) topResult.get("publisher");

                                        String website = (String) topResult.get("homepage_url");

                                        System.out.println("JOURNAL LOOKUP: OpenAlex found: " + foundName);

                                        return Optional.of(JournalMetadataDTO.builder()
                                                        .name(foundName)
                                                        .publisher(publisher != null ? publisher : "Unknown")
                                                        .impactFactor("0.0") // API doesn't provide IF directly
                                                        .quartile("N/A") // API doesn't provide Quartile directly
                                                        .url(website != null ? website : "")
                                                        .build());
                                }
                        }
                } catch (Exception e) {
                        System.err.println("JOURNAL LOOKUP: OpenAlex API failed: " + e.getMessage());
                }

                System.out.println("JOURNAL LOOKUP: No match found anywhere for '" + name + "'");
                return Optional.empty();
        }
}
