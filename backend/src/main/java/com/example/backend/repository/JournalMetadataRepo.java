package com.example.backend.repository;

import com.example.backend.entity.JournalMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface JournalMetadataRepo extends JpaRepository<JournalMetadata, Long> {
    Optional<JournalMetadata> findByNameAndYear(String name, Integer year);

    Optional<JournalMetadata> findTopByNameOrderByYearDesc(String name);
}
