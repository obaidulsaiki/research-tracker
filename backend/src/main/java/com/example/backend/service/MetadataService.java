package com.example.backend.service;

import com.example.backend.dto.AuthorDTO;
import com.example.backend.dto.PublicationDTO;
import com.example.backend.dto.ResearchDTO;
import com.example.backend.dto.JournalMetadataDTO;
import com.example.backend.dto.ConferenceMetadataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class MetadataService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private JournalService journalService;

    @SuppressWarnings("unchecked")
    public ResearchDTO fetchMetadataByDoiAsDTO(String doi) {
        String url = "https://api.crossref.org/works/" + doi;
        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("message")) {
                Map<String, Object> message = (Map<String, Object>) response.get("message");
                ResearchDTO dto = new ResearchDTO();

                // Title
                if (message.containsKey("title")) {
                    List<String> titles = (List<String>) message.get("title");
                    if (!titles.isEmpty()) {
                        dto.setTitle(titles.get(0));
                    }
                }

                // Authors
                if (message.containsKey("author")) {
                    List<Map<String, Object>> authorsList = (List<Map<String, Object>>) message.get("author");
                    List<AuthorDTO> authors = new ArrayList<>();
                    for (Map<String, Object> authorMap : authorsList) {
                        AuthorDTO author = new AuthorDTO();
                        String given = (String) authorMap.getOrDefault("given", "");
                        String family = (String) authorMap.getOrDefault("family", "");
                        author.setName((given + " " + family).trim());
                        author.setRole("Author");
                        authors.add(author);
                    }
                    dto.setAuthors(authors);
                }

                PublicationDTO pub = new PublicationDTO();
                dto.setPublication(pub);

                // Year
                if (message.containsKey("created")) {
                    Map<String, Object> created = (Map<String, Object>) message.get("created");
                    if (created.containsKey("date-parts")) {
                        List<List<Integer>> dateParts = (List<List<Integer>>) created.get("date-parts");
                        if (!dateParts.isEmpty() && !dateParts.get(0).isEmpty()) {
                            pub.setYear(String.valueOf(dateParts.get(0).get(0)));
                        }
                    }
                }

                // Publisher/Journal
                if (message.containsKey("container-title")) {
                    List<String> journals = (List<String>) message.get("container-title");
                    if (!journals.isEmpty()) {
                        pub.setName(journals.get(0));
                    }
                }

                if (message.containsKey("publisher")) {
                    pub.setPublisher((String) message.get("publisher"));
                }

                if (message.containsKey("type")) {
                    pub.setType((String) message.get("type"));
                }

                // IMPROVEMENT: Try to refine journal metadata using curated JournalService
                if (pub.getName() != null) {
                    journalService.lookup(pub.getName()).ifPresent(data -> {
                        if (data instanceof JournalMetadataDTO) {
                            JournalMetadataDTO journal = (JournalMetadataDTO) data;
                            pub.setImpactFactor(journal.getImpactFactor());
                            pub.setQuartile(journal.getQuartile());
                            if (pub.getPublisher() == null || pub.getPublisher().equals("Unknown")) {
                                pub.setPublisher(journal.getPublisher());
                            }
                            if (pub.getUrl() == null || pub.getUrl().isEmpty()) {
                                pub.setUrl(journal.getUrl());
                            }
                        } else if (data instanceof ConferenceMetadataDTO) {
                            ConferenceMetadataDTO conf = (ConferenceMetadataDTO) data;
                            pub.setVenue(conf.getVenue());
                            pub.setIndexedBy(conf.getIndexedBy());
                            if (pub.getPublisher() == null || pub.getPublisher().equals("Unknown")) {
                                pub.setPublisher(conf.getIndexedBy());
                            }
                            if (pub.getUrl() == null || pub.getUrl().isEmpty()) {
                                pub.setUrl(conf.getUrl());
                            }
                        }
                    });
                }

                dto.setPaperUrl("https://doi.org/" + doi);
                return dto;
            }
        } catch (Exception e) {
            System.err.println("Error fetching metadata: " + e.getMessage());
        }
        return null;
    }
}
