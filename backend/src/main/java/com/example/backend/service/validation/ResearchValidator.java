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
        String title = dto.getTitle();
        String pubName = dto.getPublication() != null ? dto.getPublication().getName() : null;
        String year = dto.getPublication() != null ? dto.getPublication().getYear() : null;

        if (dto.getId() != null) {
            boolean exists = researchRepo.existsByTitleAndPublicationNameAndPublicationYearAndIdNot(
                    title, pubName, year, dto.getId());
            if (exists) {
                throw new RuntimeException("A record with this Title, Publication, and Year already exists.");
            }
        } else if (researchRepo.existsByTitleAndPublicationNameAndPublicationYear(title, pubName, year)) {
            throw new RuntimeException("A record with this Title, Publication, and Year already exists.");
        }
    }
}
