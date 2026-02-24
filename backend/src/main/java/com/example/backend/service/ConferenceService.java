package com.example.backend.service;

import com.example.backend.dto.ConferenceDTO;
import com.example.backend.entity.Conference;
import com.example.backend.entity.research.Research;
import com.example.backend.repository.ConferenceRepo;
import com.example.backend.repository.ResearchRepo;
import com.example.backend.mapper.ResearchMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConferenceService {

    private final ConferenceRepo conferenceRepo;
    private final ResearchRepo researchRepo;
    private final ResearchMapper mapper;

    @Transactional(readOnly = true)
    public List<ConferenceDTO> getAllConferences() {
        return conferenceRepo.findAll().stream()
                .map(mapper::convertToConferenceDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ConferenceDTO createConference(ConferenceDTO dto) {
        Conference entity = mapper.convertToConferenceEntity(dto);
        Conference saved = conferenceRepo.save(entity);
        log.info("CONFERENCE SERVICE: Created new conference '{} {}'", saved.getName(), saved.getYear());

        // AUTO-LINK EXISTING PAPERS
        autoLinkPapersToConference(saved);

        return mapper.convertToConferenceDTO(saved);
    }

    @Transactional
    public ConferenceDTO updateConference(Long id, ConferenceDTO dto) {
        Conference entity = conferenceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Conference not found with ID: " + id));

        String oldShortName = entity.getShortName();
        String oldFullName = entity.getName();

        mapper.updateConferenceFromDTO(entity, dto);
        Conference saved = conferenceRepo.save(entity);
        log.info("CONFERENCE SERVICE: Updated conference '{} {}'", saved.getName(), saved.getYear());

        // If names changed, re-sync links
        if (!saved.getShortName().equalsIgnoreCase(oldShortName) || !saved.getName().equalsIgnoreCase(oldFullName)) {
            autoLinkPapersToConference(saved);
        }

        return mapper.convertToConferenceDTO(saved);
    }

    public void syncAllExistingData() {
        log.info("CONFERENCE SERVICE: Starting bulk sync of all papers to conferences...");
        List<Conference> conferences = conferenceRepo.findAll();
        conferences.forEach(this::autoLinkPapersToConference);
        log.info("CONFERENCE SERVICE: Bulk sync completed.");
    }

    private void autoLinkPapersToConference(Conference conf) {
        log.info("CONFERENCE SERVICE: Auto-linking papers for '{} {}'", conf.getName(), conf.getYear());
        java.util.Set<Research> allMatches = new java.util.HashSet<>();

        if (conf.getShortName() != null && !conf.getShortName().isBlank()) {
            allMatches.addAll(researchRepo.findByPublicationNameIgnoreCase(conf.getShortName()));
            allMatches.addAll(researchRepo.findByPublicationNameContainingIgnoreCase(conf.getShortName()));
        }
        if (conf.getName() != null && !conf.getName().isBlank()) {
            allMatches.addAll(researchRepo.findByPublicationNameContainingIgnoreCase(conf.getName()));
        }

        if (!allMatches.isEmpty()) {
            log.info("CONFERENCE SERVICE: Found {} potential paper matches", allMatches.size());
            for (Research p : allMatches) {
                p.setConference(conf);
                if (conf.getPapers() == null) {
                    conf.setPapers(new java.util.ArrayList<>());
                }
                if (!conf.getPapers().contains(p)) {
                    conf.getPapers().add(p);
                }
            }
            researchRepo.saveAll(allMatches);
            log.info("CONFERENCE SERVICE: Linked {} papers successfully", allMatches.size());
        } else {
            log.info("CONFERENCE SERVICE: No matching papers found for '{}'", conf.getName());
        }
    }

    @Transactional
    public void deleteConference(Long id) {
        conferenceRepo.deleteById(id);
        log.info("CONFERENCE SERVICE: Deleted conference with ID: {}", id);
    }

    @Transactional
    public void linkPaperToConference(Long paperId, Long conferenceId) {
        Research paper = researchRepo.findById(paperId)
                .orElseThrow(() -> new RuntimeException("Paper not found with ID: " + paperId));
        Conference conference = conferenceRepo.findById(conferenceId)
                .orElseThrow(() -> new RuntimeException("Conference not found with ID: " + conferenceId));

        paper.setConference(conference);
        researchRepo.save(paper);
        log.info("CONFERENCE SERVICE: Linked paper '{}' to conference '{} {}'", paper.getTitle(), conference.getName(),
                conference.getYear());
    }
}
