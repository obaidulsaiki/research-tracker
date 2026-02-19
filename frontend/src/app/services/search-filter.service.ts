import { Injectable, signal, computed, Signal } from '@angular/core';
import { Research } from './research.service';

@Injectable({ providedIn: 'root' })
export class SearchFilterService {
    searchTerm = signal('');
    filterStatus = signal('all');
    filterType = signal('all');
    filterYear = signal('all');
    filterPublisher = signal('all');
    filterQuartile = signal('all');

    pageSize = signal(10);
    currentPage = signal(1);

    getFilteredResults(researchItems: Signal<Research[]>) {
        const filteredPapers = computed(() => {
            let items = [...researchItems()];

            // 1. Search Logic
            const term = this.searchTerm().toLowerCase();
            if (term) {
                let searchedItems = [];
                for (let i of items) {
                    let matchesTitle = i.title.toLowerCase().includes(term);
                    let matchesAuthor = i.authors && i.authors.some(a => a.name.toLowerCase().includes(term));
                    let matchesTag = i.tags && i.tags.some(t => t.toLowerCase().includes(term));

                    if (matchesTitle || matchesAuthor || matchesTag) {
                        searchedItems.push(i);
                    }
                }
                items = searchedItems;
            }

            // 2. Filter Logic
            if (this.filterStatus() !== 'all') {
                const val = this.filterStatus();
                items = items.filter(i => i.status === val);
            }
            if (this.filterType() !== 'all') {
                const val = this.filterType().toUpperCase();
                items = items.filter(i => (i.publication?.type || '').toUpperCase() === val);
            }
            if (this.filterYear() !== 'all') {
                const val = this.filterYear();
                items = items.filter(i => i.publication?.year === val);
            }
            if (this.filterPublisher() !== 'all') {
                const val = this.filterPublisher().toUpperCase();
                items = items.filter(i =>
                    (i.publication?.name || '').toUpperCase() === val ||
                    (i.publication?.publisher || '').toUpperCase() === val
                );
            }
            if (this.filterQuartile() !== 'all') {
                const val = this.filterQuartile();
                items = items.filter(i => i.publication?.quartile === val);
            }

            // 3. Sorting Logic
            const statusWeights: Record<string, number> = {
                'PUBLISHED': 1, 'ACCEPTED': 2, 'RUNNING': 3, 'WORKING': 4, 'HYPOTHESIS': 5, 'REJECTED': 6, 'WITHDRAWN': 7
            };

            items.sort((a, b) => {
                const weightA = statusWeights[a.status || ''] || 99;
                const weightB = statusWeights[b.status || ''] || 99;
                if (weightA !== weightB) {
                    return weightA - weightB;
                }
                return (b.pid || 0) - (a.pid || 0);
            });

            return items;
        });

        const totalPages = computed(() => {
            const count = filteredPapers().length;
            const size = this.pageSize();
            return Math.max(1, Math.ceil(count / size));
        });

        const paginatedPapers = computed(() => {
            const items = filteredPapers();
            const startIdx = (this.currentPage() - 1) * this.pageSize();
            const endIdx = startIdx + this.pageSize();
            return items.slice(startIdx, endIdx);
        });

        return {
            filteredPapers,
            totalPages,
            paginatedPapers
        };
    }

    clearFilters() {
        this.searchTerm.set('');
        this.filterStatus.set('all');
        this.filterType.set('all');
        this.filterYear.set('all');
        this.filterPublisher.set('all');
        this.filterQuartile.set('all');
        this.currentPage.set(1);
    }
}
