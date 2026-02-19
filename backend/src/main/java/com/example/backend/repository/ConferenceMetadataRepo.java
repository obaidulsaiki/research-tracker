package com.example.backend.repository;

import com.example.backend.entity.ConferenceMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConferenceMetadataRepo extends JpaRepository<ConferenceMetadata, Long> {
    Optional<ConferenceMetadata> findTopByNameOrderByYearDesc(String name);
}
