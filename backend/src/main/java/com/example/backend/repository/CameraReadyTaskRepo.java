package com.example.backend.repository;

import com.example.backend.entity.CameraReadyTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CameraReadyTaskRepo extends JpaRepository<CameraReadyTask, Long> {
    List<CameraReadyTask> findAllByResearchId(Long researchId);

    void deleteAllByResearchId(Long researchId);
}
