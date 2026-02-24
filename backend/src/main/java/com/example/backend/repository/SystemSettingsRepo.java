package com.example.backend.repository;

import com.example.backend.entity.SystemSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemSettingsRepo extends JpaRepository<SystemSettings, Long> {
}
