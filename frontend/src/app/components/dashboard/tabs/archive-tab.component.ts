import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Research, Author, ResearchService } from '../../../services/research.service';

@Component({
  selector: 'app-archive-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="reveal" style="display: flex; flex-direction: column; gap: 3rem;">
      <!-- FILTER SECTION -->
      <div class="p-card">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2.5rem;">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 2rem; font-weight: 800; letter-spacing: -1px; color: var(--p-text);">Research Archive</h2>
            <p style="color: var(--p-text-muted); font-size: 0.9rem; font-weight: 500;">Manage your comprehensive research database</p>
          </div>
          <div style="display: flex; gap: 1rem;">
             <button class="btn-glass" (click)="onClearFilters.emit()" title="Reset Filters">
                <span style="font-size: 1.1rem;">🔄</span>
             </button>
             <button class="btn-vibrant" (click)="onSyncPublic.emit()">
                <span>🌐</span> Publicize Database
             </button>
          </div>
        </div>
        
        <div class="filter-grid">
          <div class="filter-item">
            <label>Current Status</label>
            <select class="p-select" [value]="filterStatus" (change)="onFilterChange('status', $event)">
              <option value="all">Every Status</option>
              <option value="WORKING">Working</option>
              <option value="RUNNING">Running</option>
              <option value="HYPOTHESIS">Hypothesis</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="PUBLISHED">Published</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>

          <div class="filter-item" style="min-width: 180px;">
            <label>Doc Type</label>
            <select class="p-select" [value]="filterType" (change)="onFilterChange('type', $event)">
              <option value="all">All Document Types</option>
              @for (t of availableTypes; track t) {
                <option [value]="t">{{ t | titlecase }}</option>
              }
            </select>
          </div>

          <div class="filter-item" style="min-width: 130px; max-width: 140px;">
            <label>Year</label>
            <select class="p-select" [value]="filterYear" (change)="onFilterChange('year', $event)">
              <option value="all">Any Year</option>
              @for (y of availableYears; track y) {
                <option [value]="y">{{ y }}</option>
              }
            </select>
          </div>

          <div class="filter-item-wide">
            <label>Publisher</label>
            <select class="p-select" [value]="filterPublisher" (change)="onFilterChange('publisher', $event)">
              <option value="all">All Journals/Publishers</option>
              @for (p of availablePublishers; track p) {
                <option [value]="p">{{ formatPublisher(p) }}</option>
              }
            </select>
          </div>

          <div class="filter-item" style="min-width: 180px;">
            <label>Journal Quartile</label>
            <select class="p-select" [value]="filterQuartile" (change)="onFilterChange('quartile', $event)">
              <option value="all">All Rankings</option>
              <option value="Q1">Q1 Ranking</option>
              <option value="Q2">Q2 Ranking</option>
              <option value="Q3">Q3 Ranking</option>
              <option value="Q4">Q4 Ranking</option>
              <option value="NON-PREDATORY">NON-PREDATORY</option>
              <option value="NON INDEXED">NON INDEXED</option>
            </select>
          </div>
        </div>
      </div>

      <!-- DATA TABLE -->
      <div class="p-table-wrap">
        <table class="p-table">
          <thead>
            <tr>
            <tr>
              <th style="width: 70px; padding-left: 2rem;">#</th>
              <th style="width: 150px">
                <div class="sortable-header" (click)="toggleSort('status')">
                  Status
                  <span class="sort-icon" [class.active]="sortField === 'status'">
                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                  </span>
                </div>
              </th>
              <th style="width: 120px">
                <div class="sortable-header" (click)="toggleSort('pid')">
                  ID Code
                  <span class="sort-icon" [class.active]="sortField === 'pid'">
                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                  </span>
                </div>
              </th>
              <th style="width: 500px">
                <div class="sortable-header" (click)="toggleSort('title')">
                  Research Project & Synopsis
                  <span class="sort-icon" [class.active]="sortField === 'title'">
                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                  </span>
                </div>
              </th>
              <th style="width: 400px">
                <div class="sortable-header" (click)="toggleSort('authors')">
                  Collaborators
                  <span class="sort-icon" [class.active]="sortField === 'authors'">
                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                  </span>
                </div>
              </th>
              <th style="width: 280px">
                <div class="sortable-header" (click)="toggleSort('publication.name')">
                  Publication
                  <span class="sort-icon" [class.active]="sortField === 'publication.name'">
                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                  </span>
                </div>
              </th>
              <th style="width: 100px">
                <div class="sortable-header" (click)="toggleSort('publication.year')">
                  Year
                  <span class="sort-icon" [class.active]="sortField === 'publication.year'">
                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                  </span>
                </div>
              </th>
              <th style="width: 280px">Project Resources</th>
              <th style="width: 140px">
                <div class="sortable-header" (click)="toggleSort('publicVisibility')">
                  Visibility
                  <span class="sort-icon" [class.active]="sortField === 'publicVisibility'">
                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                  </span>
                </div>
              </th>
              <th style="width: 140px; text-align: center; position: sticky; right: 0; background: #fcfdfe; z-index: 11; border-bottom: 2px solid var(--p-bg-subtle);">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (item of sortedPapers; track item.id; let i = $index) {
              <tr [class.success-highlight]="item.id === researchService.lastActionItemId()">
                <td style="padding-left: 2rem; font-weight: 500; color: var(--p-text-muted);">{{ (currentPage - 1) * pageSize + i + 1 }}</td>
                <td>
                  <span class="p-badge" [attr.data-status]="item.status" style="border: 1px solid rgba(0,0,0,0.05); padding: 0.5rem 1rem; border-radius: 12px; font-weight: 800;">
                    {{ item.status }}
                  </span>
                </td>
                <td style="font-weight: 800; font-size: 0.75rem; color: var(--p-accent); letter-spacing: 0.8px;">{{ (item.pid !== 0 && item.pid) ? item.pid : 'NONE' }}</td>
                <td>
                  <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <div class="title-main" style="white-space: normal; font-weight: 800; line-height: 1.5; font-size: 0.95rem; color: var(--p-text);">{{ item.title || 'Untitled Research' }}</div>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                      <span class="p-badge" style="background: var(--p-bg-subtle); color: var(--p-accent); font-size: 0.65rem; border: 1px solid var(--p-border); border-radius: 6px;">
                        {{ formatPublisher(item.publication?.type || 'ARTICLE') }}
                      </span>
                      @if (item.featured) { 
                        <span class="p-badge" style="background: var(--p-gradient); color: white; font-size: 0.6rem; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);">★ FEATURED</span>
                      }
                    </div>
                  </div>
                </td>
                <td>
                  <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    @for (author of item.authors; track author.name) {
                      <span class="author-chip">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        {{ author.name }}
                      </span>
                    }
                  </div>
                </td>
                <td>
                  <div style="font-weight: 800; font-size: 0.9rem; margin-bottom: 6px; color: var(--p-text);">
                    {{ formatPublisher(item.publication?.name || item.publication?.publisher || 'NONE') }}
                  </div>
                  <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                    @if (item.publication) {
                      @if (item.publication.type && item.publication.type.toUpperCase().trim() === 'CONFERENCE') {
                        <!-- ONLY SHOW VENUE FOR CONFERENCES -->
                        <span class="p-badge" style="background: #fdf2f8; color: #9d174d; font-size: 0.65rem; font-weight: 800; border: 1px solid #fce7f3;">
                          📍 {{ formatPublisher(item.publication.venue || 'NONE') }}
                        </span>
                      } @else {
                        <!-- SHOW IF AND QUARTILE FOR JOURNALS/OTHERS -->
                        <span class="p-badge" style="background: #eff6ff; color: #1e40af; font-size: 0.65rem; font-weight: 800; border: 1px solid #dbeafe;">
                          IF: {{ (!item.publication.impactFactor || item.publication.impactFactor === '0.0' || item.publication.impactFactor === '0' || item.publication.impactFactor === '_' || item.publication.impactFactor === '-') ? '0.0' : item.publication.impactFactor }}
                        </span>
                        <span class="p-badge" [attr.data-q]="item.publication.quartile" 
                              style="font-size: 0.65rem; font-weight: 800; border: 1px solid rgba(0,0,0,0.1);">
                          RANK: {{ (!item.publication.quartile || item.publication.quartile === 'N/A' || item.publication.quartile === '_' || item.publication.quartile === '-') ? 'NONE' : item.publication.quartile }}
                        </span>
                      }
                    } @else {
                      <span class="p-badge" style="background: var(--p-bg-subtle); color: var(--p-text-muted); font-size: 0.65rem; font-weight: 800; border: 1px solid var(--p-border);">
                        DATA: NONE
                      </span>
                    }
                  </div>
                </td>
                <td style="font-weight: 900; color: var(--p-text); font-size: 0.9rem;">{{ item.publication?.year || 'NONE' }}</td>
                <td>
                   <div style="display: flex; gap: 0.85rem;">
                      @if (item.overleafUrl) { 
                        <a [href]="item.overleafUrl" target="_blank" class="link-icon-zoom" data-type="Overleaf">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </a>
                      }
                      @if (item.paperUrl) { 
                        <a [href]="item.paperUrl" target="_blank" class="link-icon-zoom" data-type="Article">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        </a>
                      }
                      @if (item.driveUrl) { 
                        <a [href]="item.driveUrl" target="_blank" class="link-icon-zoom" data-type="Cloud">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                        </a>
                      }
                      <a href="javascript:void(0)" class="link-icon-zoom" data-type="Data" style="opacity: 0.4;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                      </a>
                   </div>
                </td>
                <td>
                  <span class="p-badge" [style.background]="item.publicVisibility === 'PUBLIC' ? 'rgba(37, 99, 235, 0.1)' : 'var(--p-bg-subtle)'"
                        [style.color]="item.publicVisibility === 'PUBLIC' ? 'var(--p-accent)' : 'var(--p-text-muted)'"
                        style="font-size: 0.7rem; font-weight: 800; border: 1px solid rgba(0,0,0,0.05);">
                    {{ item.publicVisibility === 'PUBLIC' ? 'PUBLIC' : 'PRIVATE' }}
                  </span>
                </td>
                <td style="text-align: center; position: sticky; right: 0; background: white; z-index: 5; border-left: 1px solid var(--p-border);">
                  <div style="display: flex; gap: 0.6rem; justify-content: center;">
                    <button class="btn-glass" style="width: 42px; height: 42px; padding: 0;" (click)="onEdit.emit(item)">
                      <span style="font-size: 1rem;">✏️</span>
                    </button>
                    <button class="btn-glass icon-danger" style="width: 42px; height: 42px; padding: 0;" (click)="onDelete.emit(item.id!)">
                      <span style="font-size: 1rem;">🗑</span>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="10" style="text-align: center; padding: 8rem;">
                   <div style="font-size: 5rem; margin-bottom: 2rem; filter: saturate(0.5);">🧊</div>
                   <div style="font-weight: 800; font-size: 1.5rem; color: var(--p-text-muted); letter-spacing: -0.5px;">Archive is currently empty</div>
                   <p style="color: var(--p-text-muted); opacity: 0.6; margin-top: 0.5rem;">Start by importing or adding a new research paper.</p>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      @if (totalFilteredCount > 0) {
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 1rem;">
          <div style="font-size: 0.9rem; font-weight: 700; color: var(--p-text-muted);">
            Displaying <span style="color: var(--p-accent);">{{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalFilteredCount) }}</span> of <b>{{ totalFilteredCount }}</b> Project Records
          </div>

          @if (totalPages > 1) {
            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <button class="btn-glass" style="width: 44px; height: 44px; padding: 0;" [disabled]="currentPage === 1" (click)="onPageChange.emit(currentPage - 1)">‹</button>
              @for (p of pages; track p) {
                <button class="btn-glass" [class.active-page]="p === currentPage" 
                        [style.background]="p === currentPage ? 'var(--p-accent)' : 'white'" 
                        [style.color]="p === currentPage ? 'white' : 'inherit'" 
                        [style.box-shadow]="p === currentPage ? 'var(--p-shadow)' : 'none'"
                        style="width: 44px; height: 44px; padding: 0; font-weight: 800;"
                        (click)="onPageChange.emit(p)">
                  {{ p }}
                </button>
              }
              <button class="btn-glass" style="width: 44px; height: 44px; padding: 0;" [disabled]="currentPage === totalPages" (click)="onPageChange.emit(currentPage + 1)">›</button>
            </div>
          }

          <button class="btn-glass" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.2); font-size: 0.8rem; font-weight: 800;" (click)="onClearDatabase.emit()">
            ⚠️ RESET DATABASE
          </button>
        </div>
      }
    </section>
  `,
  styles: [`
    :host { display: contents; }
    .p-badge[data-q="Q1"] { background: #fef3c7 !important; color: #92400e !important; border-color: #fcd34d !important; }
    .p-badge[data-q="Q2"] { background: #f1f5f9 !important; color: #475569 !important; border-color: #cbd5e1 !important; }
    .p-badge[data-q="Q3"] { background: #ecfdf5 !important; color: #065f46 !important; border-color: #6ee7b7 !important; }
    .p-badge[data-q="Q4"] { background: #fff1f2 !important; color: #9f1239 !important; border-color: #fda4af !important; }
    .p-badge[data-q="NON-PREDATORY"] { background: #eff6ff !important; color: #1e40af !important; border-color: #93c5fd !important; }
    .p-badge[data-q="NON INDEXED"] { background: #f8fafc !important; color: #64748b !important; border-color: #e2e8f0 !important; }
    
    .author-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.25rem 0.6rem;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        color: #475569;
        transition: all 0.2s ease;
    }
    .author-chip:hover {
        background: white;
        border-color: #cbd5e1;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .success-highlight {
        animation: glow-success 3s ease-in-out;
    }
    .success-highlight td {
        background: rgba(16, 185, 129, 0.05) !important;
        border-bottom-color: rgba(16, 185, 129, 0.2) !important;
    }
    @keyframes glow-success {
        0% { background: rgba(16, 185, 129, 0); }
        15% { background: rgba(16, 185, 129, 0.15); box-shadow: inset 0 0 20px rgba(16, 185, 129, 0.1); }
        30% { background: rgba(16, 185, 129, 0.05); }
        45% { background: rgba(16, 185, 129, 0.1); }
        100% { background: rgba(16, 185, 129, 0); }
    }
  `]
})
export class ArchiveTabComponent {
  public researchService: ResearchService = inject(ResearchService);
  @Input() papers: Research[] = [];
  @Input() totalPapersCount: number = 0;
  @Input() totalFilteredCount: number = 0;
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 20;
  @Input() totalPages: number = 0;
  @Input() pages: number[] = [];

  @Input() filterStatus: string = 'all';
  @Input() filterType: string = 'all';
  @Input() filterYear: string = 'all';
  @Input() filterPublisher: string = 'all';
  @Input() filterQuartile: string = 'all';

  @Input() availableTypes: string[] = [];
  @Input() availableYears: string[] = [];
  @Input() availablePublishers: string[] = [];

  @Output() filterChange = new EventEmitter<{ key: string, value: string }>();
  @Output() onPageChange = new EventEmitter<number>();
  @Output() onEdit = new EventEmitter<Research>();
  @Output() onDelete = new EventEmitter<number>();
  @Output() onSyncPublic = new EventEmitter<void>();
  @Output() onClearFilters = new EventEmitter<void>();
  @Output() onClearDatabase = new EventEmitter<void>();

  protected readonly Math = Math;

  // SORTING STATE
  sortField: string = 'publication.year';
  sortDirection: 'asc' | 'desc' = 'desc';

  toggleSort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  get sortedPapers() {
    return [...this.papers].sort((a, b) => {
      let valA = this.resolveValue(a, this.sortField);
      let valB = this.resolveValue(b, this.sortField);

      // Handle Arrays (e.g. Authors) -> Join to string for sorting
      if (Array.isArray(valA)) valA = valA.map((x: any) => x.name || x).join(', ');
      if (Array.isArray(valB)) valB = valB.map((x: any) => x.name || x).join(', ');

      // SPECIAL HANDLING: Year & PID should always be numeric sort if possible
      const isNumericField = this.sortField.includes('year') || this.sortField === 'pid' || this.sortField === 'id';

      if (isNumericField) {
        // Extract numbers from strings (e.g. "2023" -> 2023, "Spring 2024" -> 2024)
        const numA = this.parseNumeric(valA);
        const numB = this.parseNumeric(valB);

        // DEBUG LOGGING
        if (this.sortField === 'pid') {
          console.log(`Sorting PID: ${valA} (${numA}) vs ${valB} (${numB}) -> ${this.sortDirection}`, numA, numB);
        }

        // If both are 0 (invalid/missing), keep original order
        if (numA === 0 && numB === 0) return 0;

        return this.sortDirection === 'asc' ? numA - numB : numB - numA;
      }

      // Default String Comparison
      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      // Fallback for other types
      return 0;
    });
  }

  // Helper to extract numbers from potential strings
  private parseNumeric(val: any): number {
    if (val == null) return 0;
    if (typeof val === 'number') return val;

    const s = String(val).trim();
    if (!s || s === 'NONE' || s === 'undefined') return 0;

    // Extract first sequence of digits
    const match = s.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  // Helper to resolve nested paths like "publication.year" or "authors.length"
  private resolveValue(item: any, path: string): any {
    if (!item) return null;
    return path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : null, item);
  }

  onFilterChange(key: string, event: any) {
    this.filterChange.emit({ key, value: event.target.value });
  }

  getAuthorList(item: Research): string {
    return (item.authors || []).map(a => a.name).join(', ');
  }
  formatPublisher(name: string): string {
    if (!name) return '';
    const acronyms = new Set(['ICCIT', 'ICECTE', 'ICEFRONT', 'PECCII', 'QPAIN', 'IEEE', 'ACM', 'SN', 'MDPI', 'IUBAT']);

    // Check if the whole string is a known acronym
    if (acronyms.has(name.trim().toUpperCase())) {
      return name.trim().toUpperCase();
    }

    // Heuristic: If name is already mixed case (e.g. from backend), trust it.
    // If name is ALL CAPS, try to Title Case it but preserve acronyms.
    if (name === name.toUpperCase() && name.length > 4) {
      return name.split(' ').map(w => {
        if (acronyms.has(w.toUpperCase())) return w.toUpperCase();
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      }).join(' ');
    }

    return name;
  }
}
