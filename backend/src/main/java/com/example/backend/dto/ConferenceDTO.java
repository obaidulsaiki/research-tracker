package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConferenceDTO {
    private Long id;
    private String name;
    private String shortName;
    private int year;
    private String publisher;
    private String portalLink;
    private String platformLink;
    private String platformName;

    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
    private java.time.LocalDate submissionDeadline;

    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
    private java.time.LocalDate notificationDate;

    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
    private java.time.LocalDate cameraReadyDeadline;

    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
    private java.time.LocalDate registrationDeadline;

    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
    private java.time.LocalDate conferenceDate;

    @Builder.Default
    private java.util.List<ResearchDTO> papers = new java.util.ArrayList<>();
}
