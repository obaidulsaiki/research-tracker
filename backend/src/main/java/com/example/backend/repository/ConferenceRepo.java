package com.example.backend.repository;

import com.example.backend.entity.Conference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConferenceRepo extends JpaRepository<Conference, Long> {
    java.util.List<Conference> findByShortNameIgnoreCase(String shortName);

    java.util.List<Conference> findByNameIgnoreCase(String name);
}
