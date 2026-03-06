package com.example.backend.service.validation;

import com.example.backend.dto.ResearchDTO;
import com.example.backend.repository.ResearchRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ResearchValidator {

    private final ResearchRepo researchRepo;

    public void validateUniqueness(ResearchDTO dto) {
        String title = normalize(dto.getTitle());
        String pubName = (dto.getPublication() != null) ? normalize(dto.getPublication().getName()) : "";
        String year = (dto.getPublication() != null) ? normalize(dto.getPublication().getYear()) : "";

        log.debug("VALIDATING: Title={}, Pub={}, Year={}, ID={}", title, pubName, year, dto.getId());

        if (dto.getId() != null) {
            boolean exists = researchRepo.existsByTitleIgnoreCaseAndPublicationNameIgnoreCaseAndPublicationYearAndIdNot(
                    title, pubName, year, dto.getId());
            if (exists) {
                throw new RuntimeException("A record with this Title, Publication, and Year already exists.");
            }
        } else if (researchRepo.existsByTitleIgnoreCaseAndPublicationNameIgnoreCaseAndPublicationYear(title, pubName,
                year)) {
            throw new RuntimeException("A record with this Title, Publication, and Year already exists.");
        }
    }

    private String normalize(String s) {
        if (s == null)
            return "";
        return s.trim().toLowerCase().replaceAll("\\s+", " ");
    }
}
