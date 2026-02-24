package com.example.backend.repository;

import com.example.backend.entity.ConferenceDeadline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConferenceDeadlineRepo extends JpaRepository<ConferenceDeadline, Long> {
    List<ConferenceDeadline> findAllByOrderBySubmissionDeadlineAsc();

    boolean existsByConferenceNameAndSubmissionDeadline(String name, java.time.LocalDateTime deadline);
}
