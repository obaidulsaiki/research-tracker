import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResearchService, Research } from '../../../services/research.service';

@Component({
  selector: 'app-history-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="reveal audit-container">
      <div class="p-card audit-card">

        <!-- HEADER -->
        <div class="audit-header">
          <div>
            <h2 class="audit-title">System Audit Log</h2>
            <p class="audit-subtitle">Complete record of all database mutations</p>
          </div>
          <div class="header-stats">
            <div class="stat-chip creates">
              <span class="stat-icon">✦</span>
              <span class="stat-val">{{ createCount }}</span>
              <span class="stat-lbl">Created</span>
            </div>
            <div class="stat-chip updates">
              <span class="stat-icon">✎</span>
              <span class="stat-val">{{ updateCount }}</span>
              <span class="stat-lbl">Updated</span>
            </div>
            <div class="stat-chip deletes">
              <span class="stat-icon">✕</span>
              <span class="stat-val">{{ deleteCount }}</span>
              <span class="stat-lbl">Deleted</span>
            </div>
            <div class="stat-chip total">
              <span class="stat-val">{{ totalEvents() }}</span>
              <span class="stat-lbl">Total Events</span>
            </div>
          </div>
        </div>

        <!-- FILTER BAR -->
        <div class="filter-bar">
          <div class="search-wrap">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input class="search-input" type="text" placeholder="Search by paper title or field..." [(ngModel)]="searchQuery" />
          </div>
          <div class="type-pills">
            <button class="pill" [class.active]="filterType === 'all'" (click)="filterType = 'all'">All</button>
            <button class="pill create-pill" [class.active]="filterType === 'CREATED'" (click)="filterType = 'CREATED'">Created</button>
            <button class="pill update-pill" [class.active]="filterType === 'UPDATED'" (click)="filterType = 'UPDATED'">Updated</button>
            <button class="pill delete-pill" [class.active]="filterType === 'DELETED'" (click)="filterType = 'DELETED'">Deleted</button>
          </div>
        </div>

        <!-- TIMELINE -->
        <div class="timeline">
          @for (group of filteredGroups; track group.date) {
            <div class="day-group">
              <div class="day-header">
                <div class="day-badge">{{ group.date }}</div>
                <div class="day-line"></div>
                <span class="day-count">{{ group.items.length }} event{{ group.items.length !== 1 ? 's' : '' }}</span>
              </div>

              <div class="log-list">
                @for (log of group.items; track log.id) {
                  <div class="log-row" [attr.data-type]="log.changeType">
                    <div class="log-time">{{ formatTime(log.timestamp) }}</div>
                    <div class="log-icon-wrap">
                      <div class="log-icon" [attr.data-type]="getCategory(log.changeType)">
                        @if (getCategory(log.changeType) === 'CREATED') { <span>✦</span> }
                        @else if (getCategory(log.changeType) === 'DELETED') { <span>✕</span> }
                        @else { <span>✎</span> }
                      </div>
                      <div class="log-connector"></div>
                    </div>
                    <div class="log-body">
                      <div class="log-top">
                        <span class="log-type-badge" [attr.data-type]="getCategory(log.changeType)">{{ getCategoryLabel(log.changeType) }}</span>
                        <span class="log-pid">PID #{{ log.researchId }}</span>
                        @if (getPaperTitle(log.researchId)) {
                          <span class="log-title">{{ getPaperTitle(log.researchId) }}</span>
                        }
                      </div>
                      <div class="log-detail">
                        @if (getCategory(log.changeType) === 'CREATED') {
                          <span class="detail-text">New research record added to the database.</span>
                        } @else if (getCategory(log.changeType) === 'DELETED') {
                          <span class="detail-text">Record permanently removed: <b>{{ log.oldValue }}</b></span>
                        } @else {
                          <span class="field-name">{{ humanizeField(log.fieldName) }}</span>
                          <span class="old-val">{{ truncate(log.oldValue || 'empty') }}</span>
                          <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                          <span class="new-val">{{ truncate(log.newValue || 'empty') }}</span>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <div class="empty-icon">🕒</div>
              <p class="empty-text">No audit events match your filters.</p>
            </div>
          }
        </div>

      </div>
    </section>
  `,
  styles: [`
    :host { display: contents; }
    .audit-container { }
    .audit-card { padding: 2rem 2.5rem; }

    /* HEADER */
    .audit-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem; }
    .audit-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -0.5px; color: var(--p-text); margin: 0 0 0.25rem; }
    .audit-subtitle { color: var(--p-text-muted); font-size: 0.8rem; font-weight: 500; margin: 0; }
    .header-stats { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .stat-chip {
      display: flex; align-items: center; gap: 0.4rem;
      padding: 0.45rem 0.85rem; border-radius: 10px; border: 1px solid;
      font-size: 0.75rem; font-weight: 700;
    }
    .stat-chip .stat-icon { font-size: 0.7rem; }
    .stat-chip .stat-val { font-size: 1rem; font-weight: 900; }
    .stat-chip .stat-lbl { font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.75; }
    .stat-chip.creates { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
    .stat-chip.updates { background: #eff6ff; border-color: #bfdbfe; color: #1e40af; }
    .stat-chip.deletes { background: #fff1f2; border-color: #fecdd3; color: #9f1239; }
    .stat-chip.total { background: var(--p-bg-subtle); border-color: var(--p-border); color: var(--p-text); }

    /* FILTER BAR */
    .filter-bar { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .search-wrap { position: relative; flex: 1; min-width: 200px; }
    .search-icon { position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: var(--p-text-muted); pointer-events: none; }
    .search-input {
      width: 100%; padding: 0.6rem 1rem 0.6rem 2.25rem;
      border: 1px solid var(--p-border); border-radius: 10px;
      font-family: inherit; font-size: 0.8rem; font-weight: 500; color: var(--p-text);
      background: white; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
    }
    .search-input:focus { border-color: var(--p-accent); box-shadow: 0 0 0 3px var(--p-accent-muted); }
    .type-pills { display: flex; gap: 0.4rem; }
    .pill {
      padding: 0.45rem 0.9rem; border-radius: 8px; border: 1px solid var(--p-border);
      background: white; font-size: 0.75rem; font-weight: 700; color: var(--p-text-muted);
      cursor: pointer; transition: all 0.15s;
    }
    .pill:hover { border-color: var(--p-accent); color: var(--p-accent); }
    .pill.active { background: var(--p-text); color: white; border-color: var(--p-text); }
    .pill.create-pill.active { background: #166534; border-color: #166534; }
    .pill.update-pill.active { background: #1e40af; border-color: #1e40af; }
    .pill.delete-pill.active { background: #9f1239; border-color: #9f1239; }

    /* TIMELINE */
    .timeline { display: flex; flex-direction: column; gap: 2rem; }
    .day-group { }
    .day-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
    .day-badge { padding: 3px 12px; background: var(--p-text); color: white; border-radius: 8px; font-size: 0.7rem; font-weight: 800; white-space: nowrap; }
    .day-line { flex: 1; height: 1px; background: var(--p-border); }
    .day-count { font-size: 0.65rem; font-weight: 700; color: var(--p-text-muted); text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }

    .log-list { display: flex; flex-direction: column; gap: 0; }
    .log-row { display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.5rem 0; }
    .log-row:hover .log-body { background: var(--p-bg-subtle); }

    .log-time { width: 52px; font-size: 0.68rem; font-weight: 700; color: var(--p-text-muted); padding-top: 0.55rem; flex-shrink: 0; text-align: right; }

    .log-icon-wrap { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
    .log-icon {
      width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-size: 0.65rem; font-weight: 900; flex-shrink: 0; border: 2px solid;
    }
    .log-icon[data-type="CREATED"] { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
    .log-icon[data-type="UPDATED"] { background: #eff6ff; border-color: #bfdbfe; color: #1e40af; }
    .log-icon[data-type="DELETED"] { background: #fff1f2; border-color: #fecdd3; color: #9f1239; }
    .log-connector { flex: 1; width: 2px; background: var(--p-border); min-height: 8px; }
    .log-row:last-child .log-connector { display: none; }

    .log-body { flex: 1; padding: 0.4rem 0.75rem; border-radius: 10px; transition: background 0.15s; min-width: 0; }
    .log-top { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.3rem; }
    .log-type-badge {
      font-size: 0.58rem; font-weight: 800; padding: 2px 7px; border-radius: 5px;
      text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid;
    }
    .log-type-badge[data-type="CREATED"] { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
    .log-type-badge[data-type="UPDATED"] { background: #eff6ff; border-color: #bfdbfe; color: #1e40af; }
    .log-type-badge[data-type="DELETED"] { background: #fff1f2; border-color: #fecdd3; color: #9f1239; }
    .log-pid { font-size: 0.68rem; font-weight: 800; color: var(--p-accent); letter-spacing: 0.5px; }
    .log-title { font-size: 0.75rem; font-weight: 700; color: var(--p-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 400px; }

    .log-detail { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; font-size: 0.78rem; }
    .detail-text { color: var(--p-text-muted); font-weight: 500; }
    .field-name { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: var(--p-text-muted); background: var(--p-bg-subtle); padding: 2px 7px; border-radius: 5px; border: 1px solid var(--p-border); }
    .old-val { color: var(--p-text-muted); text-decoration: line-through; font-size: 0.75rem; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .arrow-icon { color: var(--p-text-muted); flex-shrink: 0; }
    .new-val { color: var(--p-accent); font-weight: 700; font-size: 0.75rem; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* EMPTY */
    .empty-state { text-align: center; padding: 4rem 2rem; }
    .empty-icon { font-size: 2.5rem; margin-bottom: 1rem; }
    .empty-text { color: var(--p-text-muted); font-weight: 600; font-size: 0.9rem; }
  `]
})
export class HistoryTabComponent {
  private researchService = inject(ResearchService);

  public researchItems = this.researchService.researchItems;
  public totalEvents = computed(() => this.researchService.history().length);

  public groupedHistory = computed(() => {
    const logs = this.researchService.history();
    const groups = new Map<string, any[]>();
    for (const log of logs) {
      if (!log.timestamp) continue;
      const d = new Date(log.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      if (!groups.has(d)) groups.set(d, []);
      groups.get(d)!.push(log);
    }
    return Array.from(groups.entries()).map(([date, items]) => ({ date, items }));
  });

  searchQuery = '';
  filterType = 'all';

  get createCount(): number {
    return this.groupedHistory().flatMap(g => g.items).filter((l: any) => l.changeType === 'CREATED').length;
  }
  get updateCount(): number {
    return this.groupedHistory().flatMap(g => g.items).filter((l: any) => l.changeType?.endsWith('_CHANGE')).length;
  }
  get deleteCount(): number {
    return this.groupedHistory().flatMap(g => g.items).filter((l: any) => l.changeType === 'DELETED').length;
  }

  get filteredGroups(): any[] {
    const q = this.searchQuery.toLowerCase().trim();
    return this.groupedHistory()
      .map(group => ({
        ...group,
        items: group.items.filter((log: any) => {
          if (this.filterType !== 'all') {
            const cat = this.getCategory(log.changeType);
            if (cat !== this.filterType) return false;
          }
          if (q) {
            const title = this.getPaperTitle(log.researchId)?.toLowerCase() || '';
            const field = (log.fieldName || '').toLowerCase();
            const oldVal = (log.oldValue || '').toLowerCase();
            const newVal = (log.newValue || '').toLowerCase();
            return title.includes(q) || field.includes(q) || oldVal.includes(q) || newVal.includes(q);
          }
          return true;
        })
      }))
      .filter(group => group.items.length > 0);
  }

  getCategory(changeType: string): string {
    if (!changeType) return 'UPDATED';
    if (changeType === 'CREATED') return 'CREATED';
    if (changeType === 'DELETED') return 'DELETED';
    return 'UPDATED'; // all *_CHANGE types
  }

  getCategoryLabel(changeType: string): string {
    const cat = this.getCategory(changeType);
    if (cat === 'CREATED') return 'CREATED';
    if (cat === 'DELETED') return 'DELETED';
    return 'UPDATED';
  }

  getPaperTitle(researchId: number): string {
    const item = this.researchItems().find(r => r.id === researchId);
    return item?.title || '';
  }

  humanizeField(field: string): string {
    if (!field) return '';
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
      .trim();
  }

  truncate(val: string, max = 60): string {
    if (!val) return '';
    return val.length > max ? val.slice(0, max) + '…' : val;
  }

  formatTime(dateStr: string): string {
    if (!dateStr) return '---';
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
