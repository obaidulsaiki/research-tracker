package com.example.backend.mapper;

import com.example.backend.dto.AuthorDTO;
import com.example.backend.dto.HistoryEntryDTO;
import com.example.backend.dto.PublicationDTO;
import com.example.backend.dto.ResearchDTO;
import com.example.backend.entity.research.Author;
import com.example.backend.entity.research.HistoryEntry;
import com.example.backend.entity.research.Publication;
import com.example.backend.entity.research.Research;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.stream.Collectors;

@Component
public class ResearchMapper {

    public ResearchDTO convertToDTO(Research r) {
        ResearchDTO dto = new ResearchDTO();
        dto.setId(r.getId());
        dto.setStatus(r.getStatus());
        dto.setPid(r.getPid());
        dto.setTitle(r.getTitle());
        dto.setAuthorPlace(r.getAuthorPlace());
        dto.setAuthors(r.getAuthors().stream().map(this::convertToAuthorDTO).collect(Collectors.toList()));
        if (r.getPublication() != null) {
            dto.setPublication(convertToPublicationDTO(r.getPublication()));
        }
        dto.setPaperUrl(r.getPaperUrl());
        dto.setOverleafUrl(r.getOverleafUrl());
        dto.setDriveUrl(r.getDriveUrl());
        dto.setDatasetUrl(r.getDatasetUrl());
        dto.setPublicVisibility(r.getPublicVisibility());
        dto.setTags(r.getTags());
        dto.setFeatured(r.isFeatured());
        dto.setAbstractText(r.getAbstractText());
        dto.setNotes(r.getNotes());
        dto.setSubmissionDate(r.getSubmissionDate());
        dto.setDecisionDate(r.getDecisionDate());
        dto.setPublicationDate(r.getPublicationDate());
        return dto;
    }

    public PublicationDTO convertToPublicationDTO(Publication p) {
        PublicationDTO dto = new PublicationDTO();
        dto.setId(p.getId());
        dto.setType(p.getType());
        dto.setName(p.getName());
        dto.setPublisher(p.getPublisher());
        dto.setYear(p.getYear());
        dto.setVenue(p.getVenue());
        dto.setImpactFactor(p.getImpactFactor());
        dto.setQuartile(p.getQuartile());
        dto.setUrl(p.getUrl());
        return dto;
    }

    public AuthorDTO convertToAuthorDTO(Author a) {
        AuthorDTO dto = new AuthorDTO();
        dto.setId(a.getId());
        dto.setName(a.getName());
        dto.setRole(a.getRole());
        dto.setContributionPercentage(a.getContributionPercentage());
        return dto;
    }

    public HistoryEntryDTO convertToHistoryDTO(HistoryEntry h) {
        HistoryEntryDTO dto = new HistoryEntryDTO();
        dto.setId(h.getId());
        dto.setTimestamp(h.getTimestamp());
        dto.setChangeType(h.getChangeType());
        dto.setOldValue(h.getOldValue());
        dto.setNewValue(h.getNewValue());

        if (h.getResearch() != null) {
            dto.setResearchId(h.getResearch().getId());
        }

        String type = h.getChangeType() != null ? h.getChangeType() : "";
        String fieldName = switch (type) {
            case "STATUS_CHANGE" -> "Status";
            case "VISIBILITY_CHANGE" -> "Visibility";
            case "TITLE_CHANGE" -> "Title";
            case "FEATURED_CHANGE" -> "Featured";
            case "NOTES_CHANGE" -> "Notes";
            case "OVERLEAF_URL_CHANGE" -> "Overleaf URL";
            case "DRIVE_URL_CHANGE" -> "Drive URL";
            case "DATASET_URL_CHANGE" -> "Dataset URL";
            case "SUBMISSION_DATE_CHANGE" -> "Submission Date";
            case "DECISION_DATE_CHANGE" -> "Decision Date";
            case "PUBLICATION_DATE_CHANGE" -> "Publication Date";
            case "PUBLICATION_NAME_CHANGE" -> "Publication Name";
            case "PUBLICATION_TYPE_CHANGE" -> "Publication Type";
            case "PUBLICATION_YEAR_CHANGE" -> "Publication Year";
            case "QUARTILE_CHANGE" -> "Quartile";
            case "IMPACT_FACTOR_CHANGE" -> "Impact Factor";
            case "PUBLISHER_CHANGE" -> "Publisher";
            case "VENUE_CHANGE" -> "Venue";
            case "CREATED" -> "New Record";
            case "DELETED" -> "Deleted Record";
            default -> type.replace("_", " ").toLowerCase();
        };
        dto.setFieldName(fieldName);

        return dto;
    }

    public Research convertToEntity(ResearchDTO dto) {
        Research r = new Research();
        r.setId(dto.getId());
        r.setStatus(dto.getStatus());
        r.setPid(dto.getPid());
        r.setTitle(dto.getTitle());
        r.setAuthorPlace(dto.getAuthorPlace());
        if (dto.getAuthors() != null) {
            r.setAuthors(dto.getAuthors().stream().map(this::convertToAuthorEntity).collect(Collectors.toList()));
        }
        if (dto.getPublication() != null) {
            r.setPublication(convertToPublicationEntity(dto.getPublication()));
        }
        r.setPaperUrl(dto.getPaperUrl());
        r.setOverleafUrl(dto.getOverleafUrl());
        r.setDriveUrl(dto.getDriveUrl());
        r.setDatasetUrl(dto.getDatasetUrl());
        r.setPublicVisibility(dto.getPublicVisibility());
        r.setTags(dto.getTags());
        r.setFeatured(dto.isFeatured());
        r.setAbstractText(dto.getAbstractText());
        r.setNotes(dto.getNotes());
        r.setSubmissionDate(dto.getSubmissionDate());
        r.setDecisionDate(dto.getDecisionDate());
        r.setPublicationDate(dto.getPublicationDate());
        return r;
    }

    public Publication convertToPublicationEntity(PublicationDTO dto) {
        Publication p = new Publication();
        p.setId(dto.getId());
        p.setType(dto.getType());
        p.setName(dto.getName());
        p.setPublisher(dto.getPublisher());
        p.setYear(dto.getYear());
        p.setVenue(dto.getVenue());
        p.setImpactFactor(dto.getImpactFactor());
        p.setQuartile(dto.getQuartile());
        p.setUrl(dto.getUrl());
        return p;
    }

    public Author convertToAuthorEntity(AuthorDTO dto) {
        Author a = new Author();
        a.setId(dto.getId());
        a.setName(dto.getName());
        a.setRole(dto.getRole());
        a.setContributionPercentage(dto.getContributionPercentage());
        return a;
    }

    public void updateEntityFromDTO(Research entity, ResearchDTO dto) {
        entity.setStatus(dto.getStatus());
        entity.setPid(dto.getPid());
        entity.setTitle(dto.getTitle());
        entity.setAuthorPlace(dto.getAuthorPlace());

        if (dto.getAuthors() != null) {
            entity.getAuthors().clear();
            entity.getAuthors().addAll(dto.getAuthors().stream()
                    .map(this::convertToAuthorEntity)
                    .collect(Collectors.toList()));
        }

        if (dto.getPublication() != null) {
            if (entity.getPublication() == null) {
                entity.setPublication(convertToPublicationEntity(dto.getPublication()));
            } else {
                updatePublicationFromDTO(entity.getPublication(), dto.getPublication());
            }
        }

        entity.setPaperUrl(dto.getPaperUrl());
        entity.setOverleafUrl(dto.getOverleafUrl());
        entity.setDriveUrl(dto.getDriveUrl());
        entity.setDatasetUrl(dto.getDatasetUrl());
        entity.setPublicVisibility(dto.getPublicVisibility());
        entity.setTags(dto.getTags());
        entity.setFeatured(dto.isFeatured());
        entity.setAbstractText(dto.getAbstractText());
        entity.setNotes(dto.getNotes());
        entity.setSubmissionDate(dto.getSubmissionDate());
        entity.setDecisionDate(dto.getDecisionDate());
        entity.setPublicationDate(dto.getPublicationDate());
    }

    public void updatePublicationFromDTO(Publication entity, PublicationDTO dto) {
        entity.setType(dto.getType());
        entity.setName(dto.getName());
        entity.setPublisher(dto.getPublisher());
        entity.setYear(dto.getYear());
        entity.setVenue(dto.getVenue());
        entity.setImpactFactor(dto.getImpactFactor());
        entity.setQuartile(dto.getQuartile());
        entity.setUrl(dto.getUrl());
    }

    public Research copyEntityState(Research original) {
        Research copy = new Research();
        copy.setStatus(original.getStatus());
        copy.setPublicVisibility(original.getPublicVisibility());
        copy.setTitle(original.getTitle());
        copy.setFeatured(original.isFeatured());
        copy.setNotes(original.getNotes());
        copy.setOverleafUrl(original.getOverleafUrl());
        copy.setDriveUrl(original.getDriveUrl());
        copy.setDatasetUrl(original.getDatasetUrl());
        copy.setTags(original.getTags() != null ? new ArrayList<>(original.getTags()) : null);
        copy.setSubmissionDate(original.getSubmissionDate());
        copy.setDecisionDate(original.getDecisionDate());
        copy.setPublicationDate(original.getPublicationDate());
        if (original.getPublication() != null) {
            Publication pub = new Publication();
            pub.setName(original.getPublication().getName());
            pub.setType(original.getPublication().getType());
            pub.setYear(original.getPublication().getYear());
            pub.setQuartile(original.getPublication().getQuartile());
            pub.setImpactFactor(original.getPublication().getImpactFactor());
            pub.setPublisher(original.getPublication().getPublisher());
            pub.setVenue(original.getPublication().getVenue());
            copy.setPublication(pub);
        }
        return copy;
    }
}
