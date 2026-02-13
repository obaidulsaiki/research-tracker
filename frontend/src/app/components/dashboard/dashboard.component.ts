import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ResearchService, Research, Author } from '../../services/research.service';
import readXlsxFile from 'read-excel-file';
import { AddPaperModalComponent } from '../add-paper-modal/add-paper-modal.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { OverviewTabComponent } from './tabs/overview-tab.component';
import { ArchiveTabComponent } from './tabs/archive-tab.component';
import { AnalyticsTabComponent } from './tabs/analytics-tab.component';
import { HistoryTabComponent } from './tabs/history-tab.component';
import { AuthorsTabComponent } from './tabs/authors-tab.component';
import { DownloadTabComponent } from './tabs/download-tab.component';
// Dynamically handling exports to avoid environment-specific install blocks

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AddPaperModalComponent, ConfirmModalComponent, SidebarComponent, HeaderComponent, OverviewTabComponent, ArchiveTabComponent, AnalyticsTabComponent, HistoryTabComponent, AuthorsTabComponent, DownloadTabComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private researchService = inject(ResearchService);
  private router = inject(Router);

  researchItems = this.researchService.researchItems;
  analytics = this.researchService.analytics;
  history = this.researchService.history;

  activeTab = signal('overview');
  searchTerm = signal('');
  filterStatus = signal('all');
  filterType = signal('all');
  filterYear = signal('all');
  filterPublisher = signal('all');
  filterQuartile = signal('all');
  showModal = signal(false);
  itemToEdit = signal<Research | undefined>(undefined);
  confirmDeleteId = signal<number | null>(null);
  currentPage = signal(1);
  pageSize = signal(20);
  showBulkConfirm = signal(false);

  availableTypes = computed(() => {
    const types = this.researchItems().map(i => i.paperType).filter(Boolean);
    return [...new Set(types)].sort();
  });

  availableYears = computed(() => {
    const years = this.researchItems().map(i => i.publisherYear).filter(Boolean);
    return [...new Set(years)].sort((a, b) => b.localeCompare(a));
  });

  availablePublishers = computed(() => {
    const pubs = this.researchItems().map(i => i.publisherName).filter(Boolean);
    return [...new Set(pubs)].sort();
  });

  private cleanName(name: string): string {
    if (!name) return '';
    // Strip titles and common symbols
    // Expand to handle Mohammad/Mohammed and ensure trim before regex matching
    const cleaned = name.trim()
      .replace(/^(Md\.?|Dr\.?|Prof\.?|Mr\.?|Mrs\.?|Mohammad\.?|Mohammed\.?)/i, '')
      .replace(/[*†‡§]/g, '')
      .replace(/[.,]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return cleaned; // If it's just symbols, it becomes empty string
  }

  coAuthorStats = computed(() => {
    const items = this.researchItems();
    const rawStatsMap = new Map<string, number>(); // Clean Name -> Count

    // 1. Collect all names and counts with basic cleaning
    items.forEach(paper => {
      paper.authors?.forEach(author => {
        if (author.name) {
          const cleaned = this.cleanName(author.name);
          if (cleaned) {
            rawStatsMap.set(cleaned, (rawStatsMap.get(cleaned) || 0) + 1);
          }
        }
      });
    });

    const uniqueCleanNames = Array.from(rawStatsMap.keys());
    const finalStatsMap = new Map<string, number>();
    const bestDisplayMap = new Map<string, string>(); // Canonical -> Best Display

    // 2. Resolve initials or single-names to full names when unambiguous
    uniqueCleanNames.forEach(name => {
      const parts = name.split(' ');
      // Shorthand if it has initials OR is a single name
      const isShorthand = parts.some(p => p.length === 1) || parts.length === 1;
      let resolvedName = name;

      if (isShorthand) {
        // Find potential full name candidates
        const candidates = uniqueCleanNames.filter(other => {
          if (other === name) return false;
          const otherParts = other.split(' ');

          if (parts.length === 1) {
            // Single name matching (e.g. Istiak -> Istiak Ahmed)
            // Match if other name contains this name as a whole word part
            return otherParts.some(p => p.toLowerCase() === name.toLowerCase());
          } else {
            // Initials matching (e.g. A. B. Rakib -> Abu Bakar Rakib)
            if (otherParts.length !== parts.length) return false;
            return parts.every((p, i) => {
              if (p.length === 1) return otherParts[i][0].toLowerCase() === p.toLowerCase();
              return otherParts[i].toLowerCase() === p.toLowerCase();
            });
          }
        });

        // Only resolve if exactly one candidate exists to avoid collisions
        if (candidates.length === 1) {
          resolvedName = candidates[0];
        }
      }

      const count = rawStatsMap.get(name) || 0;
      finalStatsMap.set(resolvedName, (finalStatsMap.get(resolvedName) || 0) + count);

      // Keep the longer name for display (but only if it's not a garbage symbol)
      const existingDisplay = bestDisplayMap.get(resolvedName) || '';
      if (name.length > existingDisplay.length) {
        bestDisplayMap.set(resolvedName, name);
      }
    });

    return Array.from(finalStatsMap.entries())
      .map(([canonical, count]) => {
        const display = bestDisplayMap.get(canonical) || canonical;
        return { name: display, count };
      })
      // FINAL DEFENSIVE FILTER: Name must contain at least one letter (a-z)
      // This kills standalone symbols (*), numbers, and empty strings for good.
      .filter(s => s.name && /[a-z]/i.test(s.name.replace(/[*†‡§.,]/g, '')))
      .sort((a, b) => b.count - a.count);
  });

  totalPages = computed(() => {
    const total = this.filteredPapers().length;
    return Math.max(1, Math.ceil(total / this.pageSize()));
  });

  paginatedPapers = computed(() => {
    const items = this.filteredPapers();
    const start = (this.currentPage() - 1) * this.pageSize();
    return items.slice(start, start + this.pageSize());
  });

  pages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const maxVisible = 5;

    if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i + 1);

    let start = Math.max(current - 2, 1);
    let end = Math.min(start + maxVisible - 1, total);

    if (end === total) start = Math.max(end - maxVisible + 1, 1);

    return Array.from({ length: (end - start + 1) }, (_, i) => start + i);
  });

  mainStats = computed(() => {
    const dist = this.statusDistribution();
    return [
      { label: 'Working', value: dist['WORKING'] || 0 },
      { label: 'Submitted', value: dist['SUBMITTED'] || 0 },
      { label: 'Running', value: dist['RUNNING'] || 0 },
      { label: 'Hypothesis', value: dist['HYPOTHESIS'] || 0 },
      { label: 'Accepted', value: dist['ACCEPTED'] || 0 },
      { label: 'Published', value: dist['PUBLISHED'] || 0 },
      { label: 'Rejected', value: dist['REJECTED'] || 0 },
      { label: 'Withdrawn', value: dist['WITHDRAWN'] || 0 }
    ];
  });

  recentHistory = computed(() => this.history().slice(0, 5));
  featuredItems = computed(() => this.researchItems().filter(i => i.featured));

  groupedHistory = computed(() => {
    const logs = this.history();
    const groups: Record<string, any[]> = {};

    // Sort logs descending by timestamp first (should already be from service but double check)
    const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    sortedLogs.forEach(log => {
      const d = new Date(log.timestamp);
      const dateStr = d.toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(log);
    });

    return Object.entries(groups).map(([date, items]) => ({ date, items }));
  });
  typeDistribution = computed(() => {
    const items = this.researchItems();
    // Pre-initialize with common types from mockup
    const dist: Record<string, number> = { 'JOURNAL': 0, 'CONFERENCE': 0, 'REVIEW': 0 };
    items.forEach(i => {
      const t = i.paperType || 'Unknown';
      dist[t] = (dist[t] || 0) + 1;
    });
    return dist;
  });

  statusDistribution = computed(() => {
    const items = this.researchItems();
    // Pre-initialize with ALL standard statuses for completeness as requested
    const dist: Record<string, number> = {
      'WORKING': 0, 'SUBMITTED': 0, 'RUNNING': 0, 'HYPOTHESIS': 0,
      'ACCEPTED': 0, 'PUBLISHED': 0, 'REJECTED': 0, 'WITHDRAWN': 0
    };
    items.forEach(i => {
      const s = i.status?.toUpperCase();
      if (s) {
        dist[s] = (dist[s] || 0) + 1;
      }
    });
    return dist;
  });

  positionDistribution = computed(() => {
    const items = this.researchItems();
    // Pre-initialize with 1st through 4th as per mockup
    const dist: Record<string, number> = { '1st': 0, '2nd': 0, '3rd': 0, '4th': 0 };
    items.forEach(i => {
      if (i.authorPlace) {
        const p = `${i.authorPlace}${this.getOrdinal(i.authorPlace)}`;
        dist[p] = (dist[p] || 0) + 1;
      }
    });
    return dist;
  });

  quartileDistribution = computed(() => {
    const items = this.researchItems();
    const dist: Record<string, number> = { 'Q1': 0, 'Q2': 0, 'Q3': 0, 'Q4': 0 };
    items.forEach(i => {
      const q = i.journalQuartile;
      if (q && q !== 'NONE' && q !== 'PREDATORY' && q !== 'NON_INDEXED') {
        dist[q] = (dist[q] || 0) + 1;
      }
    });
    return dist;
  });

  private getOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return (s[(v - 20) % 10] || s[v] || s[0]);
  }

  filteredPapers = computed(() => {
    let items = this.researchItems();

    // Search by Title or Author
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      items = items.filter(i =>
        i.title.toLowerCase().includes(term) ||
        (i.authors && i.authors.some(a => a.name.toLowerCase().includes(term))) ||
        (i.tags && i.tags.some(t => t.toLowerCase().includes(term)))
      );
    }

    // Filters
    if (this.filterStatus() !== 'all') {
      items = items.filter(i => i.status === this.filterStatus());
    }
    if (this.filterType() !== 'all') {
      items = items.filter(i => i.paperType === this.filterType());
    }
    if (this.filterYear() !== 'all') {
      items = items.filter(i => i.publisherYear === this.filterYear());
    }
    if (this.filterPublisher() !== 'all') {
      items = items.filter(i => i.publisherName === this.filterPublisher());
    }
    if (this.filterQuartile() !== 'all') {
      items = items.filter(i => i.journalQuartile === this.filterQuartile());
    }

    return items;
  });

  onTabFilterChange(event: { key: string; value: string }) {
    switch (event.key) {
      case 'status':
        this.filterStatus.set(event.value);
        break;
      case 'type':
        this.filterType.set(event.value);
        break;
      case 'year':
        this.filterYear.set(event.value);
        break;
      case 'publisher':
        this.filterPublisher.set(event.value);
        break;
      case 'quartile':
        this.filterQuartile.set(event.value);
        break;
    }
    this.currentPage.set(1);
  }

  ngOnInit() {
    this.researchService.loadAll();
    this.researchService.loadAnalytics();
    this.researchService.loadHistory();
  }

  syncPublicProfile() {
    const toUpdate = this.researchItems().filter(i =>
      (i.status === 'ACCEPTED' || i.status === 'PUBLISHED') &&
      i.publicVisibility !== 'PUBLIC'
    );

    if (toUpdate.length === 0) return;

    const updated = toUpdate.map(i => ({ ...i, publicVisibility: 'PUBLIC' }));
    this.researchService.bulkSave(updated).subscribe(() => {
      // Refresh analytics to show updated public count
      this.researchService.loadAnalytics();
    });
  }

  getAuthorList(r: Research): string {
    return this.formatAuthors(r.authors || []);
  }

  exportToExcel() {
    // No-dependency approach: Generate a specialized CSV that Excel recognizes as a spreadsheet
    let csvContent = '\uFEFF'; // Add BOM for Excel UTF-8 support
    csvContent += 'No,Status,PID,Title,Type,Authors,Publisher,Year,Quartile\n';

    this.researchItems().forEach((r, index) => {
      const row = [
        index + 1,
        `"${r.status || ''}"`,
        `"${r.pid || ''}"`,
        `"${(r.title || '').replace(/"/g, '""')}"`,
        `"${r.paperType || ''}"`,
        `"${(this.getAuthorList(r) || '').replace(/"/g, '""')}"`,
        `"${(r.publisherName || '').replace(/"/g, '""')}"`,
        `"${r.publisherYear || ''}"`,
        `"${r.journalQuartile || ''}"`
      ];
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'research_archive.csv'); // Using CSV for maximum compatibility
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToPdf() {
    // Premium Print Approach: Use window.print() on the archive view
    // This is the most reliable "No-Dependency" way to get a high-quality PDF
    const originalTab = this.activeTab();
    this.activeTab.set('archive');
    setTimeout(() => {
      window.print();
      this.activeTab.set(originalTab);
    }, 500);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  goToPage(page: number) {
    this.currentPage.set(page);
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

  openAddModal() {
    this.itemToEdit.set(undefined);
    this.showModal.set(true);
  }

  openEditModal(item: Research) {
    console.log('DASHBOARD[openEditModal] Source item:', item);
    const clone = JSON.parse(JSON.stringify(item));
    console.log('DASHBOARD[openEditModal] Cloned item to edit:', clone);

    // Set data first, then show modal to ensure lifecycle picks it up
    this.itemToEdit.set(clone);
    setTimeout(() => {
      this.showModal.set(true);
    }, 0);
  }

  closeModal() {
    this.showModal.set(false);
    this.itemToEdit.set(undefined);
  }

  deleteItem(id: number) {
    if (id === undefined || id === null) return;
    this.confirmDeleteId.set(id);
  }

  handleDelete() {
    const id = this.confirmDeleteId();
    if (id !== null) {
      this.researchService.delete(id).subscribe({
        next: () => {
          this.confirmDeleteId.set(null);
        },
        error: (err) => {
          alert('Delete failed: ' + (err.error?.message || err.message));
          this.confirmDeleteId.set(null);
        }
      });
    }
  }

  viewPortfolio() { this.router.navigate(['/portfolio']); }

  exportData() {
    this.researchService.exportCsv();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.researchService.importCsv(file).subscribe({
        next: () => alert('CSV Imported Successfully!'),
        error: (err) => alert('Failed to import CSV: ' + err.message)
      });
    }
  }

  onExcelSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    readXlsxFile(file).then((rows: any[]) => {
      this.processExcelRows(rows);
    }).catch((err: any) => {
      alert('Failed to parse Excel file: ' + err.message);
    });
  }

  private processExcelRows(rows: any[][]) {
    if (rows.length < 2) {
      alert('The Excel file appears to be empty or missing headers.');
      return;
    }

    const headers = rows[0].map(h => String(h || '').trim().toLowerCase());
    const dataRows = rows.slice(1);

    const items: Research[] = dataRows.map(row => {
      const getVal = (search: string) => {
        const idx = headers.findIndex(h => h.includes(search.toLowerCase()));
        return idx !== -1 ? row[idx] : null;
      };

      const parseNum = (v: any) => {
        if (!v) return 0;
        const n = parseInt(String(v).replace(/\D/g, ''), 10);
        return isNaN(n) ? 0 : n;
      };

      return {
        title: String(getVal('title') || 'Untitled'),
        status: this.mapStatus(String(getVal('status') || '')),
        pid: parseNum(getVal('pid')),
        paperType: this.mapPaperType(String(getVal('type') || '')),
        authorPlace: parseNum(getVal('place')),
        publisherName: String(getVal('publisher') || ''),
        publisherYear: String(getVal('year') || ''),
        journalQuartile: String(getVal('quartile') || 'NONE'),
        overleafUrl: String(getVal('overleaf') || ''),
        paperUrl: String(getVal('online') || ''),
        driveUrl: String(getVal('drive') || getVal('file') || ''),
        datasetUrl: String(getVal('dataset') || ''),
        authors: this.parseAuthors(getVal('authors')),
        publicVisibility: 'PRIVATE',
        tags: [],
        featured: false
      };
    });

    if (confirm(`Detected ${items.length} records. Import now?`)) {
      this.researchService.bulkSave(items).subscribe({
        next: () => alert('Excel Data Extracted and Saved!'),
        error: (err) => alert('Import Error: ' + err.message)
      });
    }
  }

  private mapStatus(val: string): string {
    const s = String(val || '').toUpperCase().trim();
    const valid = ['WORKING', 'SUBMITTED', 'RUNNING', 'HYPOTHESIS', 'ACCEPTED', 'PUBLISHED', 'REJECTED'];
    return valid.includes(s) ? s : 'WORKING';
  }

  private mapPaperType(val: string): string {
    const t = String(val || '').toUpperCase();
    const valid = ['ARTICLE', 'JOURNAL', 'CONFERENCE', 'REVIEW', 'BOOK_CHAPTER', 'PREPRINT', 'POSTER', 'THESIS', 'HYPOTHESIS'];
    return valid.includes(t) ? t : 'ARTICLE';
  }

  private parseAuthors(val: any): Author[] {
    if (!val) return [];

    // 1. Initial split by common delimiters
    const rawInput = String(val);
    let chunks = rawInput.split(/[,;]|\s+and\s+/i)
      .map(n => n.trim())
      .filter(n => n.length > 0);

    const knownAuthors = this.coAuthorStats().map(s => s.name);
    const finalAuthors: string[] = [];

    // 2. Smart Split for chunks without delimiters (e.g., "ASM Shakil Ahamed Obaidul Haque")
    chunks.forEach(chunk => {
      // If chunk has 3+ words and no comma, try splitting by known names
      const words = chunk.split(/\s+/);
      if (words.length >= 4 && knownAuthors.length > 0) {
        let remaining = chunk;
        let foundAny = false;

        // Sort known authors by length descending to match longest names first
        const sortedKnown = [...knownAuthors].sort((a, b) => b.length - a.length);

        for (const known of sortedKnown) {
          if (remaining.includes(known)) {
            // Check if it's a whole word match to avoid partial name matches
            const regex = new RegExp(`\\b${known}\\b`, 'i');
            if (regex.test(remaining)) {
              finalAuthors.push(known);
              remaining = remaining.replace(regex, '').trim();
              foundAny = true;
            }
          }
        }

        if (remaining.length > 0) {
          // If something left but no known names found, treat as one or split by common patterns
          if (!foundAny) {
            finalAuthors.push(chunk);
          } else if (remaining.split(/\s+/).length >= 2) {
            finalAuthors.push(remaining);
          }
        }
      } else {
        finalAuthors.push(chunk);
      }
    });

    return [...new Set(finalAuthors)].map(name => {
      const clean = name.replace(/[*†‡§]/g, '').trim();
      return {
        name: clean,
        role: 'Author',
        contributionPercentage: 0
      };
    }).filter(a => a.name.length > 0);
  }

  formatTime(ts: string) {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatFullTime(ts: string) {
    const date = new Date(ts);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatAuthors(authors: Author[]): string {
    if (!authors || authors.length === 0) return '---';
    return authors.map(a => a.name).join(', ');
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PUBLISHED': return '#10b981';
      case 'ACCEPTED': return '#22c55e';
      case 'WORKING': return '#94a3b8';
      case 'SUBMITTED': return '#3b82f6';
      case 'RUNNING': return '#eab308';
      case 'HYPOTHESIS': return '#8b5cf6';
      case 'REJECTED': return '#ef4444';
      default: return '#64748b';
    }
  }

  handleBulkDelete() {
    this.researchService.deleteAll().subscribe({
      next: () => {
        this.showBulkConfirm.set(false);
        alert('Database wiped successfully.');
      },
      error: (err) => {
        alert('Bulk delete failed: ' + err.message);
        this.showBulkConfirm.set(false);
      }
    });
  }
}
