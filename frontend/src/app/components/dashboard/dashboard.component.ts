import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AddPaperModalComponent } from '../add-paper-modal/add-paper-modal.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ResearchService, Research } from '../../services/research.service';
import { SearchFilterService } from '../../services/search-filter.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    AddPaperModalComponent,
    ConfirmModalComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Services
  protected researchService = inject(ResearchService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected filterSvc = inject(SearchFilterService); // Required for header search

  // Expose Research Items from service for template
  researchItems = this.researchService.researchItems;

  searchTerm = this.filterSvc.searchTerm;
  currentPage = this.filterSvc.currentPage;

  // Sidebar State
  activeTab = signal('overview');

  // Notification State
  successNotification = signal<string | null>(null);
  errorNotification = signal<string | null>(null);

  // Modal State
  showModal = signal(false);
  itemToEdit = signal<Research | undefined>(undefined);
  confirmDeleteId = signal<number | null>(null);
  showBulkConfirm = signal(false);

  ngOnInit() {
    this.researchService.loadAll();

    // Sync tab state with current route so sidebar highlights correct tab
    this.route.url.subscribe(() => {
      // Child components handle their own routes, but we can determine active tab by checking window.location or injected router events later if needed
      // For now, simple matching off the URL path
      const currentUrl = this.router.url;
      if (currentUrl.includes('/author/')) {
        this.activeTab.set('author-detail');
      } else if (currentUrl === '/') {
        this.activeTab.set('overview');
      } else {
        const pathSegment = currentUrl.split('/')[1];
        this.activeTab.set(pathSegment || 'overview');
      }
    });
  }

  onTabChange(tab: string) {
    this.router.navigate(['/' + tab]);
  }

  // Methods used by layout components
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

  closeModal(msg?: string) {
    this.showModal.set(false);
    this.itemToEdit.set(undefined);
    this.researchService.refresh();
    if (msg) this.showSuccess(msg);
  }

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

  // Global Export/Import Handlers injected into Header
  exportData() {
    this.researchService.exportCsv();
    this.showSuccess('CSV Export started');
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
}
