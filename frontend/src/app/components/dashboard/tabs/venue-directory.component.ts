import { Component, inject, signal, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetadataService, JournalMetadata, ConferenceMetadata } from '../../../services/metadata.service';

interface UnifiedVenue {
  type: 'JOURNAL' | 'CONFERENCE';
  name: string;
  url: string;
  publisher?: string;
  impactFactor?: string;
  quartile?: string;
  venue?: string;
  indexedBy?: string;
  year?: number;
}

@Component({
  selector: 'app-venue-directory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-wrapper">
      <header class="dashboard-header animate-fade-in">
        <div class="header-main">
          <h1 class="glow-text">Venues</h1>
          <p class="subtitle">Global directory of research journals and conferences</p>
        </div>
      </header>

      <div class="stats-row animate-slide-up">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" placeholder="Search by name, publisher, venue or index..." class="search-input">
        </div>

        <div class="quartile-filter" *ngIf="activeCategory() !== 'CONFERENCES'">
          <select [ngModel]="activeQuartile()" (ngModelChange)="activeQuartile.set($event)" class="q-select">
            <option value="ALL">All Rankings</option>
            <option value="Q1">Q1 Ranking</option>
            <option value="Q2">Q2 Ranking</option>
            <option value="Q3">Q3 Ranking</option>
            <option value="Q4">Q4 Ranking</option>
            <option value="PREDATORY">PREDATORY</option>
            <option value="NON INDEXED">NON INDEXED</option>
          </select>
        </div>
        
        <div class="filter-group">
          <button class="stat-pill interactive" 
                  [class.active-filter]="activeCategory() === 'ALL'" 
                  (click)="activeCategory.set('ALL')">
            <span class="label">ALL</span> 
            <span class="value">{{ filteredCount() }}</span>
          </button>
          <button class="stat-pill interactive" 
                  [class.active-filter]="activeCategory() === 'JOURNALS'" 
                  (click)="activeCategory.set('JOURNALS')">
            <span class="label">JOURNALS</span> 
            <span class="value">{{ filteredJournalCount() }}</span>
          </button>
          <button class="stat-pill interactive" 
                  [class.active-filter]="activeCategory() === 'CONFERENCES'" 
                  (click)="activeCategory.set('CONFERENCES')">
            <span class="label">CONFERENCES</span> 
            <span class="value">{{ filteredConferenceCount() }}</span>
          </button>
        </div>
      </div>

      <div class="venue-grid" *ngIf="!loading()">
        @for (venue of paginatedVenues(); track (venue.name + venue.type)) {
          <div class="venue-card animate-slide-up" [style.--index]="$index">
            <div class="card-header">
              <span class="type-badge" [class.journal]="venue.type === 'JOURNAL'" [class.conference]="venue.type === 'CONFERENCE'">
                {{ venue.type }}
              </span>
              <div class="metrics" *ngIf="venue.type === 'JOURNAL'">
                <span class="quartile" [class.predatory]="venue.quartile === 'PREDATORY'">{{ venue.quartile }}</span>
                <span class="impact">IF: {{ venue.impactFactor }}</span>
              </div>
              <div class="metrics" *ngIf="venue.type === 'CONFERENCE'">
                <span class="year">{{ venue.year }}</span>
                <span class="nearby-badge" *ngIf="venue.venue?.toLowerCase()?.includes(userCountry().toLowerCase())">Nearby</span>
              </div>
            </div>
            
            <h3 class="venue-name">{{ venue.name }}</h3>
            <p class="venue-meta">{{ venue.type === 'JOURNAL' ? venue.publisher : venue.venue }}</p>
            
            <div class="card-footer">
              <span class="indexed" *ngIf="venue.indexedBy">Indexed: {{ venue.indexedBy }}</span>
              <a [href]="venue.url" target="_blank" class="visit-link" *ngIf="venue.url">
                VISIT SITE ↗
              </a>
            </div>
          </div>
        }
      </div>

      <div class="loading-state" *ngIf="loading()">
        <div class="spinner"></div>
        <p>Crunching metadata directory...</p>
      </div>

      <div class="empty-state" *ngIf="!loading() && filteredVenues().length === 0">
        <p>No venues match your search criteria.</p>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination-container animate-fade-in" *ngIf="!loading() && totalPages() > 1">
        <button class="pag-btn" [disabled]="currentPage() === 1" (click)="currentPage.set(currentPage() - 1)">
          ← PREV
        </button>
        <div class="page-indicators">
          <button *ngFor="let p of pageArray()" 
                  class="page-num" 
                  [class.active]="currentPage() === p"
                  (click)="currentPage.set(p)">
            {{ p }}
          </button>
        </div>
        <button class="pag-btn" [disabled]="currentPage() === totalPages()" (click)="currentPage.set(currentPage() + 1)">
          NEXT →
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper { padding: 0 2rem 2rem 2rem; max-width: 1200px; margin: 0 auto; color: #1e293b; }
    .dashboard-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
    .glow-text { font-size: 3.5rem; font-weight: 900; margin: 0; letter-spacing: -2px; background: linear-gradient(135deg, #1e293b 0%, #64748b 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle { margin: 0; color: #64748b; font-weight: 600; font-size: 0.9rem; }

    .stats-row { display: flex; justify-content: space-between; align-items: center; gap: 2rem; margin-bottom: 2rem; }
    
    .search-box { 
      flex: 1; position: relative; display: flex; align-items: center;
      background: #f1f5f9; border-radius: 12px; padding: 0.5rem 1rem; border: 1px solid #e2e8f0;
    }
    .search-icon { font-size: 0.9rem; margin-right: 0.75rem; color: #94a3b8; }
    .search-input { 
      background: transparent; border: none; outline: none; width: 100%; 
      font-size: 0.9rem; font-weight: 600; color: #1e293b;
    }
    .search-input::placeholder { color: #94a3b8; }
    
    .q-select {
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 0.5rem 1rem;
        font-size: 0.75rem;
        font-weight: 800;
        color: #1e293b;
        cursor: pointer;
        outline: none;
        transition: all 0.2s;
        min-width: 140px;
    }
    .q-select:hover { border-color: #3b82f6; background: white; }
    .q-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }

    .filter-group { display: flex; gap: 0.75rem; }
    .stat-pill { 
      background: #f1f5f9; padding: 0.5rem 1.25rem; border-radius: 30px; font-size: 0.75rem; 
      font-weight: 800; border: 2px solid transparent; display: flex; gap: 0.75rem; 
      align-items: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .stat-pill.active-filter { background: white; border-color: #3b82f6; box-shadow: 0 4px 12px rgba(59,130,246,0.1); transform: translateY(-2px); }
    .stat-pill .label { color: #64748b; }
    .stat-pill.active-filter .label { color: #2563eb; }

    .venue-grid { 
      display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
      gap: 1.5rem; margin-top: 2rem;
    }
    
    .venue-card {
      background: white; border-radius: 20px; border: 1px solid #e2e8f0;
      padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;
      transition: all 0.3s ease; position: relative; overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    .venue-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border-color: #cbd5e1; }

    .card-header { display: flex; justify-content: space-between; align-items: center; }
    .type-badge { 
      font-size: 0.55rem; font-weight: 900; padding: 2px 8px; border-radius: 6px; 
      letter-spacing: 0.5px;
    }
    .type-badge.journal { background: #eef2ff; color: #6366f1; }
    .type-badge.conference { background: #fff7ed; color: #f59e0b; }

    .metrics { display: flex; gap: 0.5rem; }
    .quartile { font-size: 0.6rem; font-weight: 900; color: #166534; background: #dcfce7; padding: 2px 6px; border-radius: 4px; }
    .quartile.predatory { background: #fee2e2; color: #dc2626; }
    .impact { font-size: 0.6rem; font-weight: 900; color: #64748b; }
    .year { font-size: 0.6rem; font-weight: 900; color: #64748b; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; }
    .nearby-badge { font-size: 0.55rem; font-weight: 900; color: #2563eb; background: #dbeafe; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }

    .venue-name { font-size: 1.1rem; font-weight: 800; margin: 0; color: #1e293b; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .venue-meta { font-size: 0.75rem; color: #64748b; font-weight: 600; margin: 0; }

    .card-footer { 
      margin-top: auto; padding-top: 1rem; border-top: 1px solid #f1f5f9;
      display: flex; justify-content: space-between; align-items: center;
    }
    .indexed { font-size: 0.6rem; color: #94a3b8; font-weight: 700; }
    .visit-link { font-size: 0.6rem; font-weight: 900; color: #6366f1; text-decoration: none; letter-spacing: 0.5px; }
    .visit-link:hover { text-decoration: underline; }

    .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; gap: 1rem; }
    .spinner { width: 40px; height: 40px; border: 3px solid #f1f5f9; border-top-color: #6366f1; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    .empty-state { text-align: center; padding: 4rem; color: #94a3b8; font-weight: 600; }

    .pagination-container {
      margin-top: 3rem; display: flex; justify-content: center; align-items: center; gap: 1.5rem;
      padding: 1rem; border-top: 1px solid #f1f5f9;
    }
    .pag-btn {
      background: #f1f5f9; border: none; padding: 0.6rem 1.25rem; border-radius: 10px;
      font-size: 0.7rem; font-weight: 800; color: #475569; cursor: pointer; transition: all 0.2s;
    }
    .pag-btn:hover:not(:disabled) { background: #e2e8f0; color: #1e293b; }
    .pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    
    .page-indicators { display: flex; gap: 0.5rem; }
    .page-num {
      width: 32px; height: 32px; border-radius: 8px; border: none; background: transparent;
      font-size: 0.75rem; font-weight: 700; color: #64748b; cursor: pointer; transition: all 0.2s;
    }
    .page-num:hover { background: #f1f5f9; color: #1e293b; }
    .page-num.active { background: #3b82f6; color: white; box-shadow: 0 4px 6px -1px rgba(59,130,246,0.3); }

    .animate-fade-in { animation: fIn 0.6s ease-out backwards; }
    .animate-slide-up { animation: sUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards; animation-delay: calc(var(--index, 0) * 0.05s); }
    @keyframes fIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes sUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class VenueDirectoryComponent implements OnInit {
  private metadataService = inject(MetadataService);

  searchTerm = signal('');
  activeCategory = signal<'ALL' | 'JOURNALS' | 'CONFERENCES'>('ALL');
  activeQuartile = signal<string>('ALL');
  userCountry = signal<string>('Bangladesh'); // Default to Bangladesh
  loading = this.metadataService.loading;

  // Pagination state
  pageSize = 30;
  currentPage = signal(1);

  constructor() {
    // Reset to page 1 whenever filters change
    effect(() => {
      this.searchTerm();
      this.activeCategory();
      this.activeQuartile();
      this.currentPage.set(1);
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.metadataService.loadAll();
    this.detectLocation();
  }

  detectLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos: GeolocationPosition) => {
          console.log('Location detected:', pos.coords);
        },
        () => console.log('Location access denied, using default country.')
      );
    }
  }

  allVenues = computed<UnifiedVenue[]>(() => {
    const journals = this.metadataService.journals().map(j => ({ ...j, type: 'JOURNAL' } as UnifiedVenue));
    const conferences = this.metadataService.conferences().map(c => ({ ...c, type: 'CONFERENCE' } as UnifiedVenue));

    return [...journals, ...conferences].sort((a, b) => {
      const country = this.userCountry().toLowerCase();

      // 1. Sort by Location (Local first)
      const aLoc = (a.venue || a.publisher || '').toLowerCase();
      const bLoc = (b.venue || b.publisher || '').toLowerCase();

      const aIsLocal = aLoc.includes(country);
      const bIsLocal = bLoc.includes(country);

      if (aIsLocal && !bIsLocal) return -1;
      if (!aIsLocal && bIsLocal) return 1;

      // 2. Sort by Year (Recent first)
      const aYear = a.year || 0;
      const bYear = b.year || 0;
      if (aYear !== bYear) return bYear - aYear;

      // 3. Name fallback
      return a.name.localeCompare(b.name);
    });
  });

  searchedVenues = computed(() => {
    const list = this.allVenues();
    const query = this.searchTerm().trim().toLowerCase();
    if (query) {
      return list.filter((v: UnifiedVenue) =>
        v.name.toLowerCase().includes(query) ||
        (v.publisher?.toLowerCase().includes(query)) ||
        (v.venue?.toLowerCase().includes(query)) ||
        (v.indexedBy?.toLowerCase().includes(query))
      );
    }
    return list;
  });

  filteredCount = computed(() => this.searchedVenues().length);
  filteredJournalCount = computed(() => this.searchedVenues().filter((v: UnifiedVenue) => v.type === 'JOURNAL').length);
  filteredConferenceCount = computed(() => this.searchedVenues().filter((v: UnifiedVenue) => v.type === 'CONFERENCE').length);

  filteredVenues = computed(() => {
    let list = this.searchedVenues();

    // Category Filter
    if (this.activeCategory() === 'JOURNALS') {
      list = list.filter((v: UnifiedVenue) => v.type === 'JOURNAL');
    } else if (this.activeCategory() === 'CONFERENCES') {
      list = list.filter((v: UnifiedVenue) => v.type === 'CONFERENCE');
    }

    // Quartile Filter (Only for Journals)
    const q = this.activeQuartile();
    if (q !== 'ALL') {
      list = list.filter((v: UnifiedVenue) => v.type === 'JOURNAL' && v.quartile === q);
    }

    return list;
  });

  totalPages = computed(() => Math.ceil(this.filteredVenues().length / this.pageSize));

  pageArray = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  paginatedVenues = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredVenues().slice(start, start + this.pageSize);
  });
}
