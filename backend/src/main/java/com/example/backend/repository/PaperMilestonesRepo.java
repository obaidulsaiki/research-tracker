package com.example.backend.repository;

import com.example.backend.entity.PaperMilestones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaperMilestonesRepo extends JpaRepository<PaperMilestones, Long> {
}
