package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "paper_milestones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaperMilestones {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private com.example.backend.entity.research.Research research;

    private String conferenceShortName;
    private String portalLink;
    private String platformName; // EasyChair, CMT, OpenReview, etc.

    private LocalDateTime submissionDeadline;
    private LocalDateTime notificationDate;
    private LocalDateTime cameraReadyDeadline;
    private LocalDateTime registrationDeadline;
    private LocalDateTime conferenceDate;
}
