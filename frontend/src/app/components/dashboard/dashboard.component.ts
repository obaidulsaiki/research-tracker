import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { OverviewTabComponent } from './tabs/overview-tab.component';
import { ArchiveTabComponent } from './tabs/archive-tab.component';
import { AnalyticsTabComponent } from './tabs/analytics-tab.component';
import { HistoryTabComponent } from './tabs/history-tab.component';
import { AuthorsTabComponent } from './tabs/authors-tab.component';
import { AuthorDetailComponent } from './tabs/author-detail.component';
import { DownloadTabComponent } from './tabs/download-tab.component';
import { AddPaperModalComponent } from '../add-paper-modal/add-paper-modal.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ResearchService, Research } from '../../services/research.service';
import { AnalyticsService } from '../../services/analytics.service';
import { SearchFilterService } from '../../services/search-filter.service';
import { ResearchUtility } from '../../utils/research.utils';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    OverviewTabComponent,
    ArchiveTabComponent,
    AnalyticsTabComponent,
    HistoryTabComponent,
    AuthorsTabComponent,
    AuthorDetailComponent,
    DownloadTabComponent,
    AddPaperModalComponent,
    ConfirmModalComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Services
  protected researchService = inject(ResearchService);
  private analyticsSvc = inject(AnalyticsService);
  private filterSvc = inject(SearchFilterService);
  private router = inject(Router);

  // Expose Research Items and History from service for template
  researchItems = this.researchService.researchItems;
  history = this.researchService.history;

  // State
  activeTab = signal('overview');
  selectedAuthor = signal<string | null>(null);

  // Notification State
  successNotification = signal<string | null>(null);
  errorNotification = signal<string | null>(null);

  // Modal State
  showModal = signal(false);
  itemToEdit = signal<Research | undefined>(undefined);
  confirmDeleteId = signal<number | null>(null);
  showBulkConfirm = signal(false);

  // Search/Filter State (Proxied to service)
  searchTerm = this.filterSvc.searchTerm;
  filterStatus = this.filterSvc.filterStatus;
  filterType = this.filterSvc.filterType;
  filterYear = this.filterSvc.filterYear;
  filterPublisher = this.filterSvc.filterPublisher;
  filterQuartile = this.filterSvc.filterQuartile;
  currentPage = this.filterSvc.currentPage;
  pageSize = this.filterSvc.pageSize;

  // Computed Derived Data
  private filterResults = this.filterSvc.getFilteredResults(this.researchService.researchItems);
  filteredPapers = this.filterResults.filteredPapers;
  paginatedPapers = this.filterResults.paginatedPapers;
  totalPages = this.filterResults.totalPages;

  protected distributions = this.analyticsSvc.getStatDistributions(this.researchService.researchItems);
  typeDistribution = this.distributions.typeDistribution;
  positionDistribution = this.distributions.positionDistribution;
  statusDistribution = this.distributions.statusDistribution;
  quartileDistribution = this.distributions.quartileDistribution;
  coAuthorStats = this.distributions.coAuthorStats;

  mainStats = computed(() => {
    const items = this.researchItems();
    return [
      { label: 'Total Papers', value: items.length },
      { label: 'Published', value: items.filter(i => i.status === 'PUBLISHED').length },
      { label: 'Accepted', value: items.filter(i => i.status === 'ACCEPTED').length },
      { label: 'Running', value: items.filter(i => i.status === 'RUNNING').length },
      { label: 'Hypothesis', value: items.filter(i => i.status === 'HYPOTHESIS').length },
      { label: 'Working', value: items.filter(i => i.status === 'WORKING').length }
    ];
  });

  recentHistory = computed(() => {
    return this.history().slice(0, 5);
  });

  groupedHistory = computed(() => {
    const entries = this.history();
    const groups: Map<string, any[]> = new Map();
    for (const entry of entries) {
      const date = new Date(entry.timestamp).toLocaleDateString();
      if (!groups.has(date)) groups.set(date, []);
      groups.get(date)!.push(entry);
    }
    return Array.from(groups.entries()).map(([date, items]) => ({ date, items }));
  });

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages = [];
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== -1) {
        pages.push(-1); // Ellipsis
      }
    }
    return pages;
  });

  ngOnInit() {
    this.researchService.refresh();
  }

  onTabChange(tab: string) {
    this.activeTab.set(tab);
    if (tab === 'running') {
      this.filterStatus.set('RUNNING');
    } else if (tab === 'hypothesis') {
      this.filterStatus.set('HYPOTHESIS');
    } else if (tab === 'archive') {
      this.filterStatus.set('all');
    }
  }

  ngOnDestroy() { }

  // Methods used by template
  viewPortfolio() {
    this.router.navigate(['/portfolio']);
  }

  showSuccess(msg: string) {
    this.successNotification.set(msg);
    setTimeout(() => this.successNotification.set(null), 3000);
  }

  showError(msg: string) {
    this.errorNotification.set(msg);
    setTimeout(() => this.errorNotification.set(null), 5000);
  }

  // Modal Controls
  openAddModal() {
    this.itemToEdit.set(undefined);
    this.showModal.set(true);
  }

  openEditModal(paper: Research) {
    this.itemToEdit.set(paper);
    this.showModal.set(true);
  }

  closeModal(msg?: string) {
    this.showModal.set(false);
    this.itemToEdit.set(undefined);
    this.researchService.refresh();
    if (msg) this.showSuccess(msg);
  }

  deleteItem(id: number) {
    this.confirmDeleteId.set(id);
  }

  // Deletion
  handleDelete() {
    const id = this.confirmDeleteId();
    if (id !== null) {
      this.researchService.delete(id).subscribe({
        next: () => {
          this.confirmDeleteId.set(null);
          this.showSuccess('Paper deleted successfully');
          this.researchService.refresh();
        },
        error: () => this.showError('Failed to delete paper')
      });
    }
  }

  handleBulkDelete() {
    this.researchService.deleteAll().subscribe({
      next: () => {
        this.showBulkConfirm.set(false);
        this.showSuccess('Database wiped successfully');
        this.researchService.refresh();
      },
      error: () => this.showError('Failed to wipe database')
    });
  }

  // Export/Import
  exportData() {
    console.log('Exporting CSV...');
    this.showSuccess('CSV Export started');
  }

  exportToExcel() {
    console.log('Exporting Excel...');
    this.showSuccess('Excel Export started');
  }

  exportToPdf() {
    console.log('Exporting PDF...');
    this.showSuccess('PDF Export started');
  }

  onExcelSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.researchService.importExcel(file).subscribe({
        next: () => {
          this.showSuccess('Excel imported successfully');
          this.researchService.refresh();
        },
        error: () => this.showError('Excel import failed')
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.researchService.importCsv(file).subscribe({
        next: () => {
          this.showSuccess('CSV imported successfully');
          this.researchService.refresh();
        },
        error: () => this.showError('CSV import failed')
      });
    }
  }

  // Navigation / Filter Extras
  onStatFilterChange(label: string) {
    const l = label.toLowerCase();
    let status = 'ALL';
    if (l.includes('published')) status = 'PUBLISHED';
    else if (l.includes('accepted')) status = 'ACCEPTED';
    else if (l.includes('running')) status = 'RUNNING';
    else if (l.includes('hypothesis')) status = 'HYPOTHESIS';
    else if (l.includes('working')) status = 'WORKING';

    this.router.navigate(['/research-list', status]);
  }

  onTabFilterChange(event: { key: string, value: string }) {
    const { key, value } = event;
    if (key === 'status') this.filterStatus.set(value);
    if (key === 'type') this.filterType.set(value);
    if (key === 'year') this.filterYear.set(value);
    if (key === 'publisher') this.filterPublisher.set(value);
    if (key === 'quartile') this.filterQuartile.set(value);
    this.currentPage.set(1);
  }

  clearFilters() {
    this.filterSvc.clearFilters();
    this.showSuccess('All filters have been cleared');
  }

  syncPublicProfile() {
    this.showSuccess('Local database synced with public cloud');
  }

  viewAuthor(name: string) {
    this.selectedAuthor.set(name);
    this.activeTab.set('author-detail');
  }

  backToAuthors() {
    this.selectedAuthor.set(null);
    this.activeTab.set('authors');
  }

  // Helper Getters for Template
  get availableYears() {
    const years = this.researchItems()
      .map(i => i.publication?.year?.trim())
      .filter((y): y is string => !!y && /[a-zA-Z0-9]/.test(y));
    return [...new Set(years)].sort((a, b) => b.localeCompare(a));
  }

  get availableTypes() {
    const types = this.researchItems()
      .map(i => i.publication?.type?.toUpperCase().trim())
      .filter((t): t is string => !!t && /[a-zA-Z0-9]/.test(t));
    return [...new Set(types)].sort();
  }

  get availablePublishers() {
    const publishers = this.researchItems()
      .map(i => i.publication?.publisher?.trim())
      .filter((p): p is string => !!p && /[a-zA-Z0-9]/.test(p));
    return [...new Set(publishers)].sort();
  }

  get groupedPublishers() {
    const items = this.researchItems();
    const journals = items
      .filter(i => (i.publication?.type || '').toUpperCase() === 'JOURNAL')
      .map(i => ({
        name: i.publication?.name?.trim() || '',
        publisher: i.publication?.publisher?.trim() || ''
      }))
      .filter(i => i.name && /[a-zA-Z0-9]/.test(i.name));

    const conferences = items
      .filter(i => (i.publication?.type || '').toUpperCase() === 'CONFERENCE')
      .map(i => ({
        name: i.publication?.name?.trim() || '',
        venue: i.publication?.venue?.trim() || '',
        year: i.publication?.year?.trim() || ''
      }))
      .filter(i => i.name && /[a-zA-Z0-9]/.test(i.name));

    return {
      journals: ResearchUtility.unique(journals, 'name'),
      conferences: ResearchUtility.unique(conferences, 'name')
    };
  }
}
