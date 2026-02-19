package com.example.backend.service;

import com.example.backend.dto.JournalMetadataDTO;
import com.example.backend.dto.ConferenceMetadataDTO;
import com.example.backend.entity.JournalMetadata;
import com.example.backend.entity.ConferenceMetadata;
import com.example.backend.repository.JournalMetadataRepo;
import com.example.backend.repository.ConferenceMetadataRepo;
import com.example.backend.config.JournalSeedData;
import com.example.backend.config.ConferenceSeedData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class JournalService implements CommandLineRunner {

        private final JournalMetadataRepo journalRepo;
        private final ConferenceMetadataRepo conferenceRepo;
        private final SmartScraperService scraperService;

        @Autowired
        public JournalService(JournalMetadataRepo journalRepo, ConferenceMetadataRepo conferenceRepo,
                        SmartScraperService scraperService) {
                this.journalRepo = journalRepo;
                this.conferenceRepo = conferenceRepo;
                this.scraperService = scraperService;
        }

        @Override
        public void run(String... args) throws Exception {
                seedDatabase();
        }

        @Transactional
        public void seedDatabase() {
                System.out.println("JOURNAL SERVICE: Seeding database from JournalSeedData...");
                JournalSeedData.getSeedData().forEach(record -> {
                        addJournal(record.name, record.publisher, record.ifFactor, record.quartile, record.url,
                                        record.year, true);
                });

                System.out.println("JOURNAL SERVICE: Seeding database from ConferenceSeedData...");
                ConferenceSeedData.getSeedData().forEach(record -> {
                        addConference(record.name, record.venue, record.indexedBy, record.url, record.year, true);
                });
        }

        private void addJournal(String name, String publisher, String ifFactor, String quartile, String url, int year,
                        boolean force) {
                Optional<JournalMetadata> existing = journalRepo.findTopByNameOrderByYearDesc(name);

                if (!existing.isPresent()) {
                        journalRepo.save(JournalMetadata.builder()
                                        .name(name)
                                        .publisher(publisher)
                                        .impactFactor(ifFactor)
                                        .quartile(quartile)
                                        .url(url)
                                        .year(year)
                                        .lastUpdated(java.time.LocalDateTime.now())
                                        .build());
                } else if (force) {
                        JournalMetadata m = existing.get();
                        m.setPublisher(publisher);
                        m.setImpactFactor(ifFactor);
                        m.setQuartile(quartile);
                        m.setUrl(url);
                        m.setLastUpdated(java.time.LocalDateTime.now());
                        journalRepo.save(m);
                }
        }

        private void addConference(String name, String venue, String indexedBy, String url, int year, boolean force) {
                Optional<ConferenceMetadata> existing = conferenceRepo.findTopByNameOrderByYearDesc(name);

                if (!existing.isPresent()) {
                        conferenceRepo.save(ConferenceMetadata.builder()
                                        .name(name)
                                        .venue(venue)
                                        .indexedBy(indexedBy)
                                        .url(url)
                                        .year(year)
                                        .lastUpdated(java.time.LocalDateTime.now())
                                        .build());
                } else if (force) {
                        ConferenceMetadata m = existing.get();
                        m.setVenue(venue);
                        m.setIndexedBy(indexedBy);
                        m.setUrl(url);
                        m.setYear(year);
                        m.setLastUpdated(java.time.LocalDateTime.now());
                        conferenceRepo.save(m);
                }
        }

        public Optional<?> lookup(String name) {
                if (name == null || name.isBlank())
                        return Optional.empty();

                String search = name.trim();
                System.out.println("METADATA LOOKUP: Request for '" + search + "'");

                // 1. Check Conference Database
                Optional<ConferenceMetadata> confCached = conferenceRepo.findTopByNameOrderByYearDesc(search);
                if (confCached.isPresent()) {
                        System.out.println("METADATA LOOKUP: Found in conference database: " + search);
                        return Optional.of(convertToConfDTO(confCached.get()));
                }

                // 2. Check Journal Database
                Optional<JournalMetadata> journalCached = journalRepo.findTopByNameOrderByYearDesc(search);
                if (journalCached.isPresent()) {
                        System.out.println("METADATA LOOKUP: Found in journal database: " + search);
                        return Optional.of(convertToJournalDTO(journalCached.get()));
                }

                // 3. Check Static Seed Data (Fallback)
                for (ConferenceSeedData.ConferenceRecord record : ConferenceSeedData.getSeedData()) {
                        if (record.name.equalsIgnoreCase(search)) {
                                addConference(record.name, record.venue, record.indexedBy, record.url, record.year,
                                                false);
                                return Optional.of(ConferenceMetadataDTO.builder()
                                                .name(record.name)
                                                .venue(record.venue)
                                                .indexedBy(record.indexedBy)
                                                .url(record.url)
                                                .year(record.year)
                                                .build());
                        }
                }

                for (JournalSeedData.JournalRecord record : JournalSeedData.getSeedData()) {
                        if (record.name.equalsIgnoreCase(search)) {
                                addJournal(record.name, record.publisher, record.ifFactor, record.quartile, record.url,
                                                record.year, false);
                                return Optional.of(JournalMetadataDTO.builder()
                                                .name(record.name)
                                                .publisher(record.publisher)
                                                .impactFactor(record.ifFactor)
                                                .quartile(record.quartile)
                                                .url(record.url)
                                                .build());
                        }
                }

                // 4. FINAL FALLBACK: Smart Scraper
                System.out.println("METADATA LOOKUP: No local match. Triggering Smart Scraper for '" + search + "'...");
                JournalMetadataDTO scraped = scraperService.scrape(search);
                if (scraped != null) {
                        addJournal(scraped.getName(), scraped.getPublisher(), scraped.getImpactFactor(),
                                        scraped.getQuartile(), scraped.getUrl(), 2024, false);
                        return Optional.of(scraped);
                }

                return Optional.empty();
        }

        private JournalMetadataDTO convertToJournalDTO(JournalMetadata m) {
                return JournalMetadataDTO.builder()
                                .name(m.getName())
                                .publisher(m.getPublisher())
                                .impactFactor(m.getImpactFactor())
                                .quartile(m.getQuartile())
                                .url(m.getUrl())
                                .build();
        }

        private ConferenceMetadataDTO convertToConfDTO(ConferenceMetadata m) {
                return ConferenceMetadataDTO.builder()
                                .name(m.getName())
                                .venue(m.getVenue())
                                .indexedBy(m.getIndexedBy())
                                .url(m.getUrl())
                                .year(m.getYear())
                                .build();
        }
}
