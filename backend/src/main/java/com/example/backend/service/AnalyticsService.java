package com.example.backend.service;

import com.example.backend.entity.research.Research;
import com.example.backend.repository.ResearchRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

        private final ResearchRepo researchRepo;

        public Map<String, Object> getAnalytics() {
                List<Research> all = researchRepo.findAll();
                Map<String, Object> stats = new HashMap<>();

                long publicCount = 0;
                long privateCount = 0;
                long featuredCount = 0;

                Map<String, Long> papersByType = new HashMap<>();
                Map<String, Long> papersByStatus = new HashMap<>();

                for (Research r : all) {
                        // Count Visibility
                        if (r.getPublicVisibility() != null && "PUBLIC".equals(r.getPublicVisibility().name())) {
                                publicCount++;
                        } else {
                                privateCount++;
                        }

                        // Count Featured
                        if (r.isFeatured()) {
                                featuredCount++;
                        }

                        // Group by Type
                        String type = "ARTICLE";
                        if (r.getPublication() != null && r.getPublication().getType() != null) {
                                type = r.getPublication().getType();
                        }
                        papersByType.put(type, papersByType.getOrDefault(type, 0L) + 1);

                        // Group by Status
                        String status = "WORKING";
                        if (r.getStatus() != null) {
                                status = r.getStatus().name();
                        }
                        papersByStatus.put(status, papersByStatus.getOrDefault(status, 0L) + 1);
                }

                stats.put("totalCount", all.size());
                stats.put("papersByType", papersByType);
                stats.put("papersByStatus", papersByStatus);
                stats.put("publicCount", publicCount);
                stats.put("privateCount", privateCount);
                stats.put("featuredCount", featuredCount);

                return stats;
        }
}
