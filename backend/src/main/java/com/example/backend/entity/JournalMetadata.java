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
public class JournalMetadata {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "publication_year")
    private Integer year;

    @Column(nullable = false)
    private String name;

    private String publisher;
    private String impactFactor;
    private String quartile;
    private String url;

    private LocalDateTime lastUpdated;
}
