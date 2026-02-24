package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "conference_deadlines")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConferenceDeadline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String conferenceName;

    @Column(nullable = false)
    private LocalDateTime submissionDeadline;

    private String url;
    private String notes;

    @Column(length = 20)
    private String priority; // High, Medium, Low
}
