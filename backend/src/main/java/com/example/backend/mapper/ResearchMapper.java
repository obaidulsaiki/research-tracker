package com.example.backend.mapper;

import com.example.backend.dto.*;
import com.example.backend.entity.Conference;
import com.example.backend.entity.research.AuthorResearch;
import com.example.backend.entity.research.HistoryEntry;
import com.example.backend.entity.research.Publication;
import com.example.backend.entity.research.Research;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

import com.example.backend.service.ChecklistService;
import lombok.RequiredArgsConstructor;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Component
@Slf4j
@RequiredArgsConstructor
public class ResearchMapper {

    private final ChecklistService checklistService;

    public ResearchDTO convertToDTO(Research r) {
        return convertToDTO(r, true);
    }

    public ResearchDTO convertToDTO(Research r, boolean includeConference) {
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

        // Populate checklist
        if (r.getId() != null) {
            dto.setChecklist(checklistService.getChecklist(r.getId()));
        }

        if (includeConference && r.getConference() != null) {
            dto.setConference(convertToConferenceDTO(r.getConference(), false));
        }

        return dto;
    }

    public ConferenceDTO convertToConferenceDTO(Conference c) {
        return convertToConferenceDTO(c, true);
    }

    public ConferenceDTO convertToConferenceDTO(Conference c, boolean includePapers) {
        ConferenceDTO dto = ConferenceDTO.builder()
                .id(c.getId())
                .name(c.getName())
                .shortName(c.getShortName())
                .year(c.getYear())
                .publisher(c.getPublisher())
                .portalLink(c.getPortalLink())
                .platformLink(c.getPlatformLink())
                .platformName(c.getPlatformName())
                .submissionDeadline(c.getSubmissionDeadline())
                .notificationDate(c.getNotificationDate())
                .cameraReadyDeadline(c.getCameraReadyDeadline())
                .registrationDeadline(c.getRegistrationDeadline())
                .conferenceDate(c.getConferenceDate())
                .build();

        if (includePapers && c.getPapers() != null) {
            dto.setPapers(c.getPapers().stream()
                    .map(p -> convertToDTO(p, false))
                    .collect(Collectors.toList()));
        } else {
            dto.setPapers(new java.util.ArrayList<>());
        }

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

    public AuthorDTO convertToAuthorDTO(AuthorResearch ar) {
        AuthorDTO dto = new AuthorDTO();
        if (ar.getAuthor() != null) {
            dto.setId(ar.getAuthor().getId());
            dto.setName(ar.getAuthor().getName());
        }
        dto.setRole(ar.getRole());
        dto.setAuthorOrder(ar.getAuthorOrder());
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
            java.util.List<AuthorResearch> authorEntities = new ArrayList<>();
            for (int i = 0; i < dto.getAuthors().size(); i++) {
                AuthorDTO authorDto = dto.getAuthors().get(i);
                AuthorResearch ar = convertToAuthorResearchEntity(authorDto);
                ar.setResearch(r);
                if (ar.getAuthorOrder() == null) {
                    ar.setAuthorOrder(i + 1);
                }
                authorEntities.add(ar);
            }
            r.setAuthors(authorEntities);
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

    public Conference convertToConferenceEntity(ConferenceDTO dto) {
        return Conference.builder()
                .id(dto.getId())
                .name(dto.getName())
                .shortName(dto.getShortName())
                .year(dto.getYear())
                .publisher(dto.getPublisher())
                .portalLink(dto.getPortalLink())
                .platformLink(dto.getPlatformLink())
                .platformName(dto.getPlatformName())
                .submissionDeadline(dto.getSubmissionDeadline())
                .notificationDate(dto.getNotificationDate())
                .cameraReadyDeadline(dto.getCameraReadyDeadline())
                .registrationDeadline(dto.getRegistrationDeadline())
                .conferenceDate(dto.getConferenceDate())
                .build();
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

    public AuthorResearch convertToAuthorResearchEntity(AuthorDTO dto) {
        AuthorResearch ar = new AuthorResearch();
        com.example.backend.entity.research.Author a = new com.example.backend.entity.research.Author();
        a.setId(dto.getId());
        a.setName(dto.getName());

        ar.setAuthor(a);
        ar.setRole(dto.getRole());
        ar.setAuthorOrder(dto.getAuthorOrder());
        return ar;
    }

    public void updateEntityFromDTO(Research entity, ResearchDTO dto) {
        entity.setStatus(dto.getStatus());
        entity.setPid(dto.getPid());
        entity.setTitle(dto.getTitle());
        entity.setAuthorPlace(dto.getAuthorPlace());

        if (dto.getAuthors() != null) {
            java.util.List<AuthorResearch> existingList = new java.util.ArrayList<>(entity.getAuthors());
            entity.getAuthors().clear();

            for (int i = 0; i < dto.getAuthors().size(); i++) {
                AuthorDTO authorDto = dto.getAuthors().get(i);

                AuthorResearch matchingAr = null;
                for (AuthorResearch existing : existingList) {
                    if (authorDto.getId() != null && existing.getAuthor() != null
                            && authorDto.getId().equals(existing.getAuthor().getId())) {
                        matchingAr = existing;
                        break;
                    } else if (authorDto.getId() == null && authorDto.getName() != null && existing.getAuthor() != null
                            && authorDto.getName().equalsIgnoreCase(existing.getAuthor().getName())) {
                        matchingAr = existing;
                        break;
                    }
                }

                if (matchingAr != null) {
                    matchingAr
                            .setAuthorOrder(authorDto.getAuthorOrder() != null ? authorDto.getAuthorOrder() : (i + 1));
                    matchingAr.setRole(authorDto.getRole());
                    entity.getAuthors().add(matchingAr);
                    existingList.remove(matchingAr);
                } else {
                    AuthorResearch ar = convertToAuthorResearchEntity(authorDto);
                    ar.setResearch(entity);
                    if (ar.getAuthorOrder() == null) {
                        ar.setAuthorOrder(i + 1);
                    }
                    entity.getAuthors().add(ar);
                }
            }
        }

        if (dto.getPublication() != null) {
            if (entity.getPublication() == null) {
                entity.setPublication(convertToPublicationEntity(dto.getPublication()));
            } else {
                updatePublicationFromDTO(entity.getPublication(), dto.getPublication());
            }
        } else {
            entity.setPublication(null);
        }

        if (dto.getConference() != null) {
            if (entity.getConference() == null || !entity.getConference().getId().equals(dto.getConference().getId())) {
                entity.setConference(convertToConferenceEntity(dto.getConference()));
            } else {
                updateConferenceFromDTO(entity.getConference(), dto.getConference());
            }
        } else {
            entity.setConference(null);
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

    public void updateConferenceFromDTO(Conference entity, ConferenceDTO dto) {
        entity.setName(dto.getName());
        entity.setShortName(dto.getShortName());
        entity.setYear(dto.getYear());
        entity.setPublisher(dto.getPublisher());
        entity.setPortalLink(dto.getPortalLink());
        entity.setPlatformLink(dto.getPlatformLink());
        entity.setPlatformName(dto.getPlatformName());
        entity.setSubmissionDeadline(dto.getSubmissionDeadline());
        entity.setNotificationDate(dto.getNotificationDate());
        entity.setCameraReadyDeadline(dto.getCameraReadyDeadline());
        entity.setRegistrationDeadline(dto.getRegistrationDeadline());
        entity.setConferenceDate(dto.getConferenceDate());
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

        if (original.getConference() != null) {
            copy.setConference(original.getConference());
        }

        return copy;
    }
}
