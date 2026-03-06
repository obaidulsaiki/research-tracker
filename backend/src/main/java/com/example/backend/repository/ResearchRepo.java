package com.example.backend.repository;

import com.example.backend.entity.research.Research;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResearchRepo extends JpaRepository<Research, Long> {
    boolean existsByTitleIgnoreCaseAndPublicationNameIgnoreCaseAndPublicationYearAndIdNot(String title, String name,
            String year, Long id);

    boolean existsByTitleIgnoreCaseAndPublicationNameIgnoreCaseAndPublicationYear(String title, String name,
            String year);

    java.util.List<Research> findByPublicationNameIgnoreCase(String name);

    java.util.List<Research> findByPublicationNameContainingIgnoreCase(String name);
}
