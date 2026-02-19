import { Injectable, computed, Signal } from '@angular/core';
import { Research } from './research.service';
import { ResearchUtility } from '../utils/research.utils';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {

    getStatDistributions(researchItems: Signal<Research[]>) {

        // 1. Calculate Type, Status, Position, and Quartile Distributions
        const typeDistribution = computed(() => {
            const items = researchItems();
            const counts: Record<string, number> = { 'JOURNAL': 0, 'CONFERENCE': 0, 'REVIEW': 0 };
            for (let i of items) {
                let type = (i.publication?.type || 'Other').toUpperCase().trim();
                counts[type] = (counts[type] || 0) + 1;
            }
            return counts;
        });

        const statusDistribution = computed(() => {
            const items = researchItems();
            const counts: Record<string, number> = {
                'WORKING': 0, 'RUNNING': 0, 'HYPOTHESIS': 0,
                'ACCEPTED': 0, 'PUBLISHED': 0, 'REJECTED': 0, 'WITHDRAWN': 0
            };
            for (let i of items) {
                if (i.status) {
                    let s = i.status.toUpperCase();
                    counts[s] = (counts[s] || 0) + 1;
                }
            }
            return counts;
        });

        const positionDistribution = computed(() => {
            const items = researchItems();
            const targetAuthor = "Obaidul Haque";
            const counts: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0 };

            const targetNameLower = ResearchUtility.cleanName(targetAuthor).toLowerCase();

            for (let i of items) {
                if (i.authors && i.authors.length > 0) {
                    for (let idx = 0; idx < i.authors.length; idx++) {
                        let authorName = ResearchUtility.cleanName(i.authors[idx].name).toLowerCase();
                        if (authorName.includes(targetNameLower) || targetNameLower.includes(authorName)) {
                            let place = String(idx + 1);
                            if (counts[place] !== undefined) counts[place]++;
                            break;
                        }
                    }
                } else if (i.authorPlace) {
                    let p = String(i.authorPlace);
                    if (counts[p] !== undefined) counts[p]++;
                }
            }
            return counts;
        });

        const quartileDistribution = computed(() => {
            const items = researchItems();
            const counts: Record<string, number> = {
                'Q1': 0, 'Q2': 0, 'Q3': 0, 'Q4': 0, 'NON-PREDATORY': 0, 'NON INDEXED': 0
            };
            for (let i of items) {
                let q = i.publication?.quartile;
                if (q && q !== 'N/A') {
                    let key = q.toUpperCase();
                    if (counts[key] !== undefined) counts[key]++;
                }
            }
            return counts;
        });

        // 2. Calculate Co-Author Statistics (Simplified Logic)
        const coAuthorStats = computed(() => {
            const items = researchItems();
            const nameCounts = new Map<string, number>();

            // Step A: Basic counting
            for (let paper of items) {
                if (!paper.authors) continue;
                for (let author of paper.authors) {
                    if (author.name) {
                        let clean = ResearchUtility.cleanName(author.name);
                        if (clean) nameCounts.set(clean, (nameCounts.get(clean) || 0) + 1);
                    }
                }
            }

            // Step B: Resolve shorthand names (e.g., "O. Haque" vs "Obaidul Haque")
            const allNames = Array.from(nameCounts.keys());
            const resolvedCounts = new Map<string, number>();
            const displayNames = new Map<string, string>();

            for (let name of allNames) {
                let finalName = name;
                let parts = name.split(' ');
                let isShort = parts.some(p => p.length === 1) || parts.length === 1;

                if (isShort) {
                    // Look for a longer match
                    for (let other of allNames) {
                        if (other === name) continue;
                        // Simple match logic: if other contains this name as a substring
                        if (other.toLowerCase().includes(name.toLowerCase())) {
                            finalName = other;
                            break;
                        }
                    }
                }

                let count = nameCounts.get(name) || 0;
                resolvedCounts.set(finalName, (resolvedCounts.get(finalName) || 0) + count);

                let currentDisplay = displayNames.get(finalName) || '';
                if (name.length > currentDisplay.length) {
                    displayNames.set(finalName, name);
                }
            }

            // Step C: Convert map to sorted array
            const result = [];
            for (let [id, count] of resolvedCounts.entries()) {
                let displayName = displayNames.get(id) || id;
                if (/[a-z]/i.test(displayName)) {
                    result.push({ name: displayName, count: count });
                }
            }

            return result.sort((a, b) => b.count - a.count);
        });

        return {
            typeDistribution,
            statusDistribution,
            positionDistribution,
            quartileDistribution,
            coAuthorStats
        };
    }
}
