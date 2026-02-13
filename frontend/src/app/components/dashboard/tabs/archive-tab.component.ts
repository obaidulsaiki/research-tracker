import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Research, Author } from '../../../services/research.service';

@Component({
    selector: 'app-archive-tab',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="view-tab">
      <!-- FILTER BAR -->
      <div class="filter-bar data-card animate-fade-in">
        <div class="filter-group">
          <label>Status</label>
          <select [value]="filterStatus" (change)="onFilterChange('status', $event)">
            <option value="all">All Status</option>
            <option value="WORKING">Working</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="RUNNING">Running</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="PUBLISHED">Published</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Type</label>
          <select [value]="filterType" (change)="onFilterChange('type', $event)">
            <option value="all">All Types</option>
            @for (t of availableTypes; track t) {
              <option [value]="t">{{ t }}</option>
            }
          </select>
        </div>

        <div class="filter-group">
          <label>Year</label>
          <select [value]="filterYear" (change)="onFilterChange('year', $event)">
            <option value="all">All Years</option>
            @for (y of availableYears; track y) {
              <option [value]="y">{{ y }}</option>
            }
          </select>
        </div>

        <div class="filter-group">
          <label>Publisher</label>
          <select [value]="filterPublisher" (change)="onFilterChange('publisher', $event)">
            <option value="all">All Publishers</option>
            @for (p of availablePublishers; track p) {
              <option [value]="p">{{ p }}</option>
            }
          </select>
        </div>

        <div class="filter-group">
          <label>Quartile</label>
          <select [value]="filterQuartile" (change)="onFilterChange('quartile', $event)">
            <option value="all">All Quartiles</option>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
            <option value="PREDATORY">Predatory</option>
            <option value="NON_INDEXED">Non-Indexed</option>
            <option value="NONE">None</option>
          </select>
        </div>

        <button class="btn-pg-num" style="margin-top: 1.25rem; font-size: 1rem;" (click)="onClearFilters.emit()" title="Clear All Filters">🔄</button>
        <button class="btn-sync-public slide-up" (click)="onSyncPublic.emit()" title="Make all Accepted/Published papers Public">
          <span class="btn-icon">🌐</span>
          <span class="btn-text">Make it public</span>
        </button>
      </div>

      <div class="data-card archive-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th class="col-no">No</th>
              <th class="col-status">Status</th>
              <th class="col-pid">PID</th>
              <th class="col-title">Title</th>
              <th class="col-type">Type</th>
              <th class="col-place">Place</th>
              <th class="col-authors">Authors</th>
              <th class="col-pub">Publisher Name</th>
              <th class="col-year">Year</th>
              <th class="col-q">Journal Quartile</th>
              <th class="col-link-lg">Overleaf</th>
              <th class="col-link-lg">Online</th>
              <th class="col-link-lg">Drive</th>
              <th class="col-link-lg">Dataset</th>
              <th class="col-vis">Visibility</th>
              <th class="sticky-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (item of papers; track item.id; let i = $index) {
              <tr>
                <td class="col-no">{{ (currentPage - 1) * pageSize + i + 1 }}</td>
                <td class="col-status">
                  <span class="badge-status" [attr.data-status]="item.status">
                    {{ item.status }}
                  </span>
                </td>
                <td class="col-pid">{{ item.pid || '---' }}</td>
                <td class="col-title" [title]="item.title || ''">
                  <div class="title-wrap">{{ item.title || 'Untitled' }}</div>
                  @if (item.featured) { <div class="view-pill">Featured</div> }
                </td>
                <td class="col-type">
                  <span class="view-pill">{{ item.paperType }}</span>
                </td>
                <td class="col-place">{{ item.authorPlace }}</td>
                <td class="col-authors" [title]="getAuthorList(item)">
                  {{ getAuthorList(item) }}
                </td>
                <td class="col-pub">{{ item.publisherName || '---' }}</td>
                <td class="col-year">{{ item.publisherYear || '---' }}</td>
                <td class="col-q">{{ item.journalQuartile || '---' }}</td>
                <td class="col-link-lg">
                  @if (item.overleafUrl) { <a [href]="item.overleafUrl" target="_blank" class="link-icon" title="Overleaf">📝</a> }
                  @else { <span>---</span> }
                </td>
                <td class="col-link-lg">
                  @if (item.paperUrl) { <a [href]="item.paperUrl" target="_blank" class="link-icon" title="Online">🌐</a> }
                  @else { <span>---</span> }
                </td>
                <td class="col-link-lg">
                  @if (item.driveUrl) { <a [href]="item.driveUrl" target="_blank" class="link-icon" title="Drive">📁</a> }
                  @else { <span>---</span> }
                </td>
                <td class="col-link-lg">
                  @if (item.datasetUrl) { <a [href]="item.datasetUrl" target="_blank" class="link-icon" title="Dataset">📊</a> }
                  @else { <span>---</span> }
                </td>
                <td class="col-vis">
                  <span class="view-pill" [class.is-public]="item.publicVisibility === 'PUBLIC'">
                    {{ item.publicVisibility === 'PUBLIC' ? 'Public' : 'Private' }}
                  </span>
                </td>
                <td class="actions sticky-col">
                  <button class="btn-icon edit" (click)="onEdit.emit(item)" title="Edit">✏️</button>
                  <button class="btn-icon delete" (click)="onDelete.emit(item.id!)" title="Delete">🗑</button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="16" style="text-align: center; padding: 4rem; color: var(--text-muted);">
                  No research papers found in this view.
                </td>
              </tr>
            }
          </tbody>
        </table>
        @if (totalPapersCount > 0) {
          <div class="archive-footer">
            <div class="footer-left">
              <p class="footer-hint">Showing {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalFilteredCount) }} of {{ totalFilteredCount }} papers.</p>
            </div>

            @if (totalPages > 1) {
              <div class="pagination">
                <button class="btn-pg" [disabled]="currentPage === 1" (click)="onPageChange.emit(currentPage - 1)">Prev</button>
                
                <div class="pg-numbers">
                  @for (p of pages; track p) {
                    <button class="btn-pg-num" [class.active]="p === currentPage()" (click)="onPageChange.emit(p)">
                      {{ p }}
                    </button>
                  }
                </div>

                <button class="btn-pg" [disabled]="currentPage === totalPages" (click)="onPageChange.emit(currentPage + 1)">Next</button>
              </div>
            }

            <div class="footer-right">
              <button class="btn-danger-outline" (click)="onClearDatabase.emit()">🚩 Clear Database</button>
            </div>
          </div>
        }
      </div>
    </section>
  `,
    styles: [`
    :host { display: contents; }
  `]
})
export class ArchiveTabComponent {
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

    onFilterChange(key: string, event: any) {
        this.filterChange.emit({ key, value: event.target.value });
    }

    getAuthorList(item: Research): string {
        return (item.authors || []).map(a => a.name).join(', ');
    }
}
