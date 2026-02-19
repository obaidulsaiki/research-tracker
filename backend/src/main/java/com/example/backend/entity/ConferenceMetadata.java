package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = { "name", "publication_year" })
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConferenceMetadata {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "publication_year")
    private Integer year;

    @Column(nullable = false)
    private String name;

    private String venue;
    private String indexedBy;
    private String url;

    private LocalDateTime lastUpdated;
}
