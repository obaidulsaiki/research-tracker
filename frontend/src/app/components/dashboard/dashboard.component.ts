import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ResearchService, Research, Author, Publication } from '../../services/research.service';
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
import { AuthorDetailComponent } from './tabs/author-detail.component';
// Dynamically handling exports to avoid environment-specific install blocks

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AddPaperModalComponent, ConfirmModalComponent, SidebarComponent, HeaderComponent, OverviewTabComponent, ArchiveTabComponent, AnalyticsTabComponent, HistoryTabComponent, AuthorsTabComponent, DownloadTabComponent, AuthorDetailComponent],
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
  selectedAuthor = signal<string>('');
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
  successNotification = signal<string | null>(null);
  errorNotification = signal<string | null>(null);

  showSuccess(message: string) {
    this.successNotification.set(message);
    setTimeout(() => this.successNotification.set(null), 4000);
  }

  showError(message: string) {
    this.errorNotification.set(message);
    setTimeout(() => this.errorNotification.set(null), 5000);
  }

  viewAuthor(name: string) {
    this.selectedAuthor.set(name);
    this.activeTab.set('author-detail');
  }

  backToAuthors() {
    this.selectedAuthor.set('');
    this.activeTab.set('authors');
  }

  availableTypes = computed(() => {
    const types = (this.researchItems()
      .map(i => i.publication?.type?.toUpperCase().trim())
      .filter(t => !!t && t !== '---' && t !== '-' && t !== '_' && t !== 'UNKNOWN') as string[]);
    return [...new Set(types)].sort();
  });

  availableYears = computed(() => {
    const years = (this.researchItems()
      .map(i => i.publication?.year?.trim())
      .filter(y => !!y && /^\d{4}$/.test(y)) as string[]);
    return [...new Set(years)].sort((a, b) => b.localeCompare(a));
  });

  groupedPublishers = computed(() => {
    const isValid = (s: string) => {
      if (!s) return false;
      const n = s.trim().toUpperCase();
      if (['---', '-', '–', '—', '_', '.', 'UNKNOWN', 'NONE', 'UNDEFINED', 'NULL', 'N/A'].includes(n)) return false;
      if (!/[a-zA-Z0-9]/.test(s)) return false;
      return true;
    };

    // Use a Map keyed by name to deduplicate and accumulate metadata
    const journalMap = new Map<string, { name: string; publisher: string }>();
    const confMap = new Map<string, { name: string; venue: string; year: string }>();

    this.researchItems().forEach(i => {
      const type = (i.publication?.type || '').toUpperCase().trim();
      const name = (i.publication?.name || '').trim();
      const publisher = (i.publication?.publisher || '').trim();
      const venue = (i.publication?.venue || '').trim();
      const year = (i.publication?.year || '').trim();

      if (!isValid(name)) return;

      if (type === 'CONFERENCE') {
        if (!confMap.has(name)) {
          confMap.set(name, { name, venue: isValid(venue) ? venue : '', year: /^\d{4}$/.test(year) ? year : '' });
        }
      } else {
        if (!journalMap.has(name)) {
          journalMap.set(name, { name, publisher: isValid(publisher) ? publisher : '' });
        }
      }
    });

    const sortFn = (a: { name: string }, b: { name: string }) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });

    return {
      journals: [...journalMap.values()].sort(sortFn),
      conferences: [...confMap.values()].sort(sortFn)
    };
  });

  availablePublishers = computed(() => {
    const j = this.groupedPublishers().journals.map(j => j.name);
    const c = this.groupedPublishers().conferences.map(c => c.name);
    return [...new Set([...j, ...c])].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
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
      const t = (i.publication?.type || 'Unknown').toUpperCase().trim();
      dist[t] = (dist[t] || 0) + 1;
    });
    return dist;
  });

  statusDistribution = computed(() => {
    const items = this.researchItems();
    // Pre-initialize with ALL standard statuses for completeness as requested
    const dist: Record<string, number> = {
      'WORKING': 0, 'RUNNING': 0, 'HYPOTHESIS': 0,
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
    // Target author for ownership calculation (will be replaced by logged-in user later)
    const targetAuthor = "Obaidul Haque";

    // Pre-initialize with numerical keys for consistency
    const dist: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0 };

    items.forEach(i => {
      // Logic: Find the index of the target author in the authors list
      if (i.authors && i.authors.length > 0) {
        const targetClean = this.cleanName(targetAuthor).toLowerCase();

        const idx = i.authors.findIndex(a => {
          const authClean = this.cleanName(a.name).toLowerCase();
          // Flexible matching: check if normalized names contain each other
          return authClean.includes(targetClean) || targetClean.includes(authClean);
        });

        if (idx !== -1) {
          const place = String(idx + 1);
          dist[place] = (dist[place] || 0) + 1;
        }
      }
      // Fallback: If no authors list but explicit place is set (legacy behavior)
      else if (i.authorPlace) {
        const p = String(i.authorPlace);
        dist[p] = (dist[p] || 0) + 1;
      }
    });
    return dist;
  });

  quartileDistribution = computed(() => {
    const items = this.researchItems();
    const dist: Record<string, number> = { 'Q1': 0, 'Q2': 0, 'Q3': 0, 'Q4': 0, 'NON-PREDATORY': 0, 'NON INDEXED': 0 };
    items.forEach(i => {
      const q = i.publication?.quartile;
      if (q && q !== 'N/A') {
        const key = q.toUpperCase();
        if (dist[key] !== undefined) {
          dist[key] = (dist[key] || 0) + 1;
        }
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
      items = items.filter(i => (i.publication?.type || '').toUpperCase().trim() === this.filterType());
    }
    if (this.filterYear() !== 'all') {
      items = items.filter(i => i.publication?.year === this.filterYear());
    }
    if (this.filterPublisher() !== 'all') {
      const filterVal = this.filterPublisher().toUpperCase();
      items = items.filter(i =>
        (i.publication?.name || '').toUpperCase().trim() === filterVal ||
        (i.publication?.publisher || '').toUpperCase().trim() === filterVal
      );
    }
    if (this.filterQuartile() !== 'all') {
      items = items.filter(i => i.publication?.quartile === this.filterQuartile());
    }

    // Default Sorting by Status Weight
    const statusWeights: Record<string, number> = {
      'PUBLISHED': 1,
      'ACCEPTED': 2,
      'RUNNING': 3,
      'WORKING': 4,
      'HYPOTHESIS': 5,
      'REJECTED': 6,
      'WITHDRAWN': 7
    };

    return [...items].sort((a, b) => {
      const weightA = statusWeights[a.status || ''] || 99;
      const weightB = statusWeights[b.status || ''] || 99;

      if (weightA !== weightB) return weightA - weightB;
      // Secondary sort by PID (higher first) within same status
      return (b.pid || 0) - (a.pid || 0);
    });
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
    this.loadInitialData();
  }

  loadInitialData() {
    this.researchService.loadAll();
    this.researchService.loadAnalytics();
    this.researchService.loadHistory();
  }

  syncPublicProfile() {
    const toUpdate = this.researchItems().filter(i => {
      const status = String(i.status || '').toUpperCase();
      const visibility = String(i.publicVisibility || '').toUpperCase();
      return (status === 'ACCEPTED' || status === 'PUBLISHED') && visibility !== 'PUBLIC';
    });

    if (toUpdate.length === 0) {
      this.showSuccess('Public profile is already up to date!');
      return;
    }

    const updated = toUpdate.map(i => ({ ...i, publicVisibility: 'PUBLIC' }));
    this.researchService.bulkSave(updated).subscribe({
      next: () => {
        this.researchService.loadAnalytics();
        this.showSuccess(`Public profile synchronized! ${updated.length} records updated.`);
      },
      error: (err) => {
        console.error('Sync failed:', err);
        this.showError('Coordination failed: ' + (err.error?.message || 'Server error during synchronization.'));
      }
    });
  }

  getAuthorList(r: Research): string {
    return this.formatAuthors(r.authors || []);
  }

  exportToExcel() {
    // No-dependency approach: Generate a specialized CSV that Excel recognizes as a spreadsheet
    let csvContent = '\uFEFF'; // Add BOM for Excel UTF-8 support

    // Header for 23-column format
    csvContent += 'No,Status,PID,Title,Type,Publication Name,Publisher,Year,Venue,Impact Factor,Quartile,Direct Link,Authors,Overleaf,Drive,Dataset,Visibility,Featured,Tags,Notes,Submission Date,Decision Date,Publication Date\n';

    this.researchItems().forEach((r, index) => {
      const pub = (r.publication || {}) as any;
      const row = [
        index + 1,
        `"${r.status || 'WORKING'}"`,
        `"${r.pid || '0'}"`,
        `"${(r.title || 'NONE').replace(/"/g, '""')}"`,
        `"${pub.type || 'ARTICLE'}"`,
        `"${(pub.name || 'NONE').replace(/"/g, '""')}"`,
        `"${(pub.publisher || 'NONE').replace(/"/g, '""')}"`,
        `"${pub.year || 'NONE'}"`,
        `"${(pub.venue || 'NONE').replace(/"/g, '""')}"`,
        `"${pub.impactFactor || '0.0'}"`,
        `"${pub.quartile || 'N/A'}"`,
        `"${pub.url || 'NONE'}"`,
        `"${(this.getAuthorList(r) || '').replace(/"/g, '""')}"`,
        `"${(r.overleafUrl || 'NONE').replace(/"/g, '""')}"`,
        `"${(r.driveUrl || 'NONE').replace(/"/g, '""')}"`,
        `"${(r.datasetUrl || 'NONE').replace(/"/g, '""')}"`,
        `"${r.publicVisibility || 'PRIVATE'}"`,
        `"${r.featured || 'false'}"`,
        `"${(r.tags ? r.tags.join(', ') : '').replace(/"/g, '""')}"`,
        `"${(r.notes || '').replace(/"/g, '""')}"`,
        `"${r.submissionDate || ''}"`,
        `"${r.decisionDate || ''}"`,
        `"${r.publicationDate || ''}"`
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
    // PREMIUM PRINT SYSTEM: Generate a dedicated report in a hidden iframe
    const reportHtml = this.generateReportHtml();

    // Create hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(reportHtml);
      doc.close();

      // Ensure images/styles are loaded before printing
      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
      };
    }
  }

  private generateReportHtml(): string {
    const items = this.filteredPapers();
    const date = new Date().toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const clean = (val: any) => {
      if (!val || val === '_' || val === '-' || val === '---' || val === 'Unknown' || val === 'N/A') return 'NONE';
      return val;
    };

    const stats = {
      total: items.length,
      published: items.filter(i => i.status === 'PUBLISHED').length,
      accepted: items.filter(i => i.status === 'ACCEPTED').length,
      inProgress: items.filter(i => ['RUNNING', 'WORKING', 'HYPOTHESIS'].includes(i.status || '')).length
    };

    const getStatusCSS = (status: string = '') => {
      const s = status.toUpperCase();
      if (s.includes('PUBLISHED')) return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0', accent: '#22c55e' };
      if (s.includes('ACCEPTED')) return { bg: '#eff6ff', text: '#1e40af', border: '#dbeafe', accent: '#3b82f6' };
      if (s.includes('REVIEW') || s.includes('RUNNING') || s.includes('WORKING') || s.includes('HYPOTHESIS'))
        return { bg: '#fef9c3', text: '#854d0e', border: '#fef08a', accent: '#eab308' };
      if (s.includes('REJECTED') || s.includes('WITHDRAWN')) return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca', accent: '#ef4444' };
      return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0', accent: '#64748b' };
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          :root {
            --primary: #4f46e5;
            --primary-dark: #3730a3;
            --bg: #f8fafc;
            --card-bg: #ffffff;
            --text-main: #0f172a;
            --text-muted: #64748b;
          }
          
          @page { size: A4 portrait; margin: 15mm; }
          
          body { 
            font-family: 'Plus Jakarta Sans', sans-serif; 
            background: var(--bg); 
            color: var(--text-main); 
            margin: 0; 
            padding: 0;
            -webkit-print-color-adjust: exact;
          }

          .container { max-width: 680px; margin: 0 auto; }

          /* Exhibition Header */
          .exhibition-header {
            background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
            color: white;
            padding: 40px;
            border-radius: 24px;
            margin-bottom: 40px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }

          .header-accent {
            position: absolute;
            top: -50px;
            right: -50px;
            width: 200px;
            height: 200px;
            background: rgba(255,255,255,0.05);
            border-radius: 50%;
          }

          .header-content h1 {
            font-size: 32px;
            font-weight: 800;
            margin: 0 0 8px 0;
            letter-spacing: -1px;
          }

          .header-subtitle {
            font-size: 14px;
            opacity: 0.8;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 600;
          }

          /* Metric Cards */
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 30px;
          }

          .metric-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.15);
          }

          .metric-value {
            font-size: 24px;
            font-weight: 700;
            display: block;
          }

          .metric-label {
            font-size: 11px;
            opacity: 0.7;
            text-transform: uppercase;
            font-weight: 600;
          }

          /* Research Cards */
          .research-card {
            background: var(--card-bg);
            border-radius: 20px;
            margin-bottom: 24px;
            padding: 24px;
            position: relative;
            display: flex;
            gap: 24px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            page-break-inside: avoid;
          }

          .status-sidebar {
            width: 6px;
            border-radius: 10px;
            flex-shrink: 0;
          }

          .card-main { flex-grow: 1; }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
          }

          .paper-title {
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
            margin: 0;
            line-height: 1.4;
            max-width: 80%;
          }

          .status-badge {
            padding: 6px 14px;
            border-radius: 100px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 1px solid transparent;
          }

          .metadata-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            background: #f8fafc;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 16px;
          }

          .badge-box {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 20px;
          }

          .metadata-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            border-radius: 100px;
            font-size: 13px;
            font-weight: 700;
            border: 1px solid transparent;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          }

          .badge-venue { background: #fff1f2; color: #9f1239; border-color: #fecdd3; }
          .badge-if { background: #eff6ff; color: #1e40af; border-color: #dbeafe; }
          .badge-rank { background: #f8fafc; color: #475569; border-color: #e2e8f0; }

          .meta-item { display: flex; flex-direction: column; gap: 4px; }
          .meta-label { font-size: 10px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }
          .meta-value { font-size: 13px; font-weight: 600; color: #334155; }

          .authors-section {
            font-size: 13px;
            color: #475569;
            line-height: 1.6;
            margin-bottom: 16px;
            padding-left: 4px;
          }

          .authors-section strong { color: #1e293b; }

          .links-row {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            border-top: 1px solid #f1f5f9;
            padding-top: 16px;
          }

          .clean-link {
            font-size: 11px;
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
            background: #eef2ff;
            padding: 4px 10px;
            border-radius: 6px;
          }

          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: var(--text-muted);
            border-top: 1px dashed #cbd5e1;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="exhibition-header">
            <div class="header-accent"></div>
            <div class="header-content">
              <span class="header-subtitle">Academic Research Portfolio</span>
              <h1>Impact Summary</h1>
              
              <div class="metrics-grid">
                <div class="metric-card">
                  <span class="metric-value">${stats.total}</span>
                  <span class="metric-label">Total Projects</span>
                </div>
                <div class="metric-card" style="border-left: 3px solid #22c55e;">
                  <span class="metric-value">${stats.published}</span>
                  <span class="metric-label">Published</span>
                </div>
                <div class="metric-card" style="border-left: 3px solid #3b82f6;">
                  <span class="metric-value">${stats.accepted}</span>
                  <span class="metric-label">Accepted</span>
                </div>
                <div class="metric-card" style="border-left: 3px solid #eab308;">
                  <span class="metric-value">${stats.inProgress}</span>
                  <span class="metric-label">In Progress</span>
                </div>
              </div>
            </div>
            <div style="position: absolute; bottom: 20px; right: 40px; opacity: 0.6; font-size: 12px;">
              Generated on ${date}
            </div>
          </div>

          ${items.map(r => {
      const pub = (r.publication || {}) as Publication;
      const style = getStatusCSS(r.status);
      return `
              <div class="research-card">
                <div class="status-sidebar" style="background: ${style.accent}"></div>
                <div class="card-main">
                  <div class="card-header">
                    <h3 class="paper-title">${r.title}</h3>
                    <span class="status-badge" style="background: ${style.bg}; color: ${style.text}; border-color: ${style.border}">
                      ${r.status}
                    </span>
                  </div>

                  <div class="authors-section">
                    <strong>Investigators:</strong> ${this.getAuthorList(r)}
                  </div>

                  <div class="badge-box">
                    <span class="metadata-badge badge-venue">
                      <span style="font-size: 15px;">📍</span> ${clean(pub.name)}
                    </span>
                    <span class="metadata-badge badge-if">IF: ${pub.impactFactor || '0.0'}</span>
                    <span class="metadata-badge badge-rank">RANK: ${clean(pub.quartile)}</span>
                  </div>

                  <div class="metadata-grid">
                    <div class="meta-item">
                      <span class="meta-label">Type</span>
                      <span class="meta-value">${clean(pub.type)}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Publisher & Year</span>
                      <span class="meta-value">${clean(pub.publisher)} (${clean(pub.year)})</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">ID / PID</span>
                      <span class="meta-value">${r.pid}</span>
                    </div>
                  </div>

                  <div class="links-row">
                    ${r.paperUrl ? `<a href="${r.paperUrl}" class="clean-link">Research Link</a>` : ''}
                    ${r.overleafUrl ? `<a href="${r.overleafUrl}" class="clean-link">Overleaf</a>` : ''}
                    ${r.driveUrl ? `<a href="${r.driveUrl}" class="clean-link">Drive Repo</a>` : ''}
                    ${r.datasetUrl ? `<a href="${r.datasetUrl}" class="clean-link">Dataset</a>` : ''}
                  </div>
                </div>
              </div>
            `;
    }).join('')}

          <div class="footer">
            Digital Research Archive &copy; ${new Date().getFullYear()} • Intellectual Property of the Investigator
          </div>
        </div>
      </body>
      </html>
    `;
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

    // If a record was just saved, show the splashy global toast
    if (this.researchService.lastActionItemId()) {
      this.showSuccess('Record synchronized across database and dashboard.');
    }
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
        next: () => {
          alert('CSV Imported Successfully!');
          this.loadInitialData(); // Refresh the table
        },
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
        // Try exact match first
        let idx = headers.findIndex(h => h === search.toLowerCase());
        if (idx === -1) {
          // Then try includes, but avoid ambiguous ones like 'year' matching 'publisher \ year'
          idx = headers.findIndex(h => {
            const lowH = h.toLowerCase();
            const lowS = search.toLowerCase();
            if (lowS === 'year') {
              return lowH === 'year' || (lowH.endsWith('year') && !lowH.includes('publisher'));
            }
            if (lowS === 'publisher') return lowH === 'publisher' || lowH.startsWith('publisher');
            return lowH.includes(lowS);
          });
        }
        return idx !== -1 ? row[idx] : null;
      };

      const parseNum = (v: any) => {
        if (!v) return 0;
        const n = parseInt(String(v).replace(/\D/g, ''), 10);
        return isNaN(n) ? 0 : n;
      };

      const getGuess = (type: 'year' | 'impact' | 'url' | 'name') => {
        // Positional guesses for legacy formats
        if (type === 'name' && !headers.includes('publication') && row.length >= 8) {
          return row[7]; // Ghost column 7 is often publication name
        }
        for (const cell of row) {
          const s = String(cell || '').trim();
          if (!s) continue;
          if (type === 'year' && /^\d{4}$/.test(s)) return s;
          if (type === 'impact' && /^[Qq][1-4]$/.test(s)) return s.toUpperCase();
          if (type === 'url' && s.startsWith('http')) return s;
        }
        return null;
      };

      const rawYear = String(getVal('year') || '');
      const finalYear = /^\d{4}$/.test(rawYear) ? rawYear : (getGuess('year') || '');
      const finalName = String(getVal('publication') || getVal('journal') || getVal('name') || getGuess('name') || getVal('publisher') || '');

      return {
        title: String(getVal('title') || 'Untitled'),
        status: this.mapStatus(String(getVal('status') || '')),
        pid: parseNum(getVal('pid')),
        publication: {
          type: this.mapPaperType(String(getVal('type') || '')),
          name: finalName,
          publisher: String(getVal('publisher') || (finalName !== getVal('publisher') ? getVal('publisher') : '') || ''),
          year: finalYear,
          venue: String(getVal('place') || getVal('venue') || ''),
          impactFactor: (() => {
            const val = String(getVal('impact') || getVal('if') || '0.0');
            // If it looks like a quartile (Q1, Q2..), don't put it in impactFactor
            return /^[Qq][1-4]$/.test(val) ? '0.0' : val;
          })(),
          quartile: (() => {
            const q = String(getVal('quartile') || getVal('journal q') || '');
            if (q && q !== 'null' && q !== 'undefined' && q !== '') return q;
            const guess = getGuess('impact');
            if (guess) return guess;
            const ifVal = String(getVal('impact') || getVal('if') || '');
            if (/^[Qq][1-4]$/.test(ifVal)) return ifVal.toUpperCase();
            return 'N/A';
          })(),
          url: String(getVal('link') || getVal('online') || getGuess('url') || '')
        },
        authorPlace: parseNum(getVal('place')),
        overleafUrl: String(getVal('overleaf') || getVal('overlink') || ''),
        paperUrl: String(getVal('online') || getVal('article') || ''),
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
    const valid = ['WORKING', 'RUNNING', 'HYPOTHESIS', 'ACCEPTED', 'PUBLISHED', 'REJECTED'];
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
      case 'RUNNING': return '#3b82f6';
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
