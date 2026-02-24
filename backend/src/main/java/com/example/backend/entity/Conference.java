package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.example.backend.entity.research.Research;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "conferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String shortName;
    private int year;
    private String publisher;
    private String portalLink;
    private String platformLink;
    private String platformName; // EasyChair, CMT, OpenReview, etc.

    private java.time.LocalDate submissionDeadline;
    private java.time.LocalDate notificationDate;
    private java.time.LocalDate cameraReadyDeadline;
    private java.time.LocalDate registrationDeadline;
    private java.time.LocalDate conferenceDate;

    @OneToMany(mappedBy = "conference")
    @JsonIgnore
    @Builder.Default
    private List<Research> papers = new ArrayList<>();
}
