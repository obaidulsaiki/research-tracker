package com.example.backend.repository;

import com.example.backend.entity.research.HistoryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoryEntryRepo extends JpaRepository<HistoryEntry, Long> {
}
