import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Research } from '../../../services/research.service';

@Component({
  selector: 'app-author-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="reveal author-detail-container">

      <!-- BACK BUTTON + HEADER -->
      <div class="detail-header">
        <button class="back-btn" (click)="back.emit()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Network
        </button>
      </div>

      <!-- AUTHOR HERO CARD -->
      <div class="p-card author-hero">
        <div class="hero-left">
          <div class="author-avatar-lg">{{ authorName.charAt(0).toUpperCase() }}</div>
          <div class="author-meta">
            <h1 class="author-name">{{ authorName }}</h1>
            <p class="author-sub">Research Collaborator</p>
            <div class="author-chips">
              <button class="chip" [class.active]="activeFilter === 'all'" (click)="setFilter('all')">{{ papers.length }} {{ papers.length === 1 ? 'Paper' : 'Papers' }}</button>
              <button class="chip accent" [class.active]="activeFilter === 'published'" (click)="setFilter('published')">{{ publishedCount }} Published</button>
              <button class="chip blue" [class.active]="activeFilter === 'accepted'" (click)="setFilter('accepted')">{{ acceptedCount }} Accepted</button>
              <button class="chip yellow" [class.active]="activeFilter === 'inprogress'" (click)="setFilter('inprogress')">{{ inProgressCount }} In Progress</button>
            </div>
          </div>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="hs-val">{{ papers.length }}</span>
            <span class="hs-lbl">Total Papers</span>
          </div>
          <div class="hero-stat">
            <span class="hs-val">{{ publishedCount }}</span>
            <span class="hs-lbl">Published</span>
          </div>
          <div class="hero-stat">
            <span class="hs-val">{{ uniqueVenues }}</span>
            <span class="hs-lbl">Venues</span>
          </div>
          <div class="hero-stat">
            <span class="hs-val">{{ latestYear }}</span>
            <span class="hs-lbl">Latest Year</span>
          </div>
        </div>
      </div>

      <!-- PAPER CARDS -->
      <div class="papers-section">
        <div class="section-title">
          <h2>Collaborative Papers</h2>
          <span class="count-badge">{{ filteredPapers.length }} {{ activeFilter === 'all' ? 'total' : 'filtered' }}</span>
          @if (activeFilter !== 'all') {
            <button class="clear-filter-btn" (click)="setFilter('all')">✕ Clear filter</button>
          }
        </div>

        @if (filteredPapers.length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📄</div>
            <p>{{ activeFilter === 'all' ? 'No papers found for this author.' : 'No papers match this filter.' }}</p>
          </div>
        }

        <div class="papers-grid">
          @for (paper of filteredPapers; track paper.id) {
            <div class="paper-card p-card">
              <!-- Status stripe -->
              <div class="status-stripe" [attr.data-status]="paper.status"></div>

              <div class="paper-body">
                <!-- Top row -->
                <div class="paper-top">
                  <div class="paper-badges">
                    <span class="p-badge" [attr.data-status]="paper.status" style="font-size: 0.6rem; padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 800;">{{ paper.status }}</span>
                    @if (paper.publication?.type) {
                      <span class="type-chip">{{ paper.publication?.type }}</span>
                    }
                    @if (paper.featured) {
                      <span class="featured-chip">⭐ Featured</span>
                    }
                  </div>
                  <span class="pid-label">PID #{{ paper.pid }}</span>
                </div>

                <!-- Title -->
                <h3 class="paper-title">{{ paper.title }}</h3>

                <!-- Publication info -->
                @if (paper.publication?.name) {
                  <div class="pub-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                    <span class="pub-name">{{ paper.publication?.name }}</span>
                    @if (paper.publication?.year) {
                      <span class="pub-year">{{ paper.publication?.year }}</span>
                    }
                    @if (paper.publication?.quartile) {
                      <span class="quartile-chip" [attr.data-q]="paper.publication?.quartile">{{ paper.publication?.quartile }}</span>
                    }
                    @if (paper.publication?.impactFactor && paper.publication?.impactFactor !== '0.0') {
                      <span class="if-chip">IF {{ paper.publication?.impactFactor }}</span>
                    }
                  </div>
                }

                <!-- Authors list -->
                <div class="authors-row">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <div class="author-chips-row">
                    @for (a of paper.authors; track a.name) {
                      <span class="author-chip" [class.highlight]="isThisAuthor(a.name)">{{ a.name }}</span>
                    }
                  </div>
                </div>

                <!-- Tags -->
                @if (paper.tags && paper.tags.length > 0) {
                  <div class="tags-row">
                    @for (tag of paper.tags.slice(0, 5); track tag) {
                      <span class="tag-chip">#{{ tag }}</span>
                    }
                    @if (paper.tags.length > 5) {
                      <span class="tag-more">+{{ paper.tags.length - 5 }}</span>
                    }
                  </div>
                }

                <!-- Links row -->
                <div class="links-row">
                  @if (paper.paperUrl) {
                    <a class="link-btn paper-link" [href]="paper.paperUrl" target="_blank">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                      Paper
                    </a>
                  }
                  @if (paper.overleafUrl) {
                    <a class="link-btn overleaf-link" [href]="paper.overleafUrl" target="_blank">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                      Overleaf
                    </a>
                  }
                  @if (paper.driveUrl) {
                    <a class="link-btn drive-link" [href]="paper.driveUrl" target="_blank">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                      Drive
                    </a>
                  }
                  @if (paper.datasetUrl) {
                    <a class="link-btn dataset-link" [href]="paper.datasetUrl" target="_blank">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
                      Dataset
                    </a>
                  }
                  @if (paper.submissionDate) {
                    <span class="date-chip">📅 Submitted {{ paper.submissionDate }}</span>
                  }
                </div>

                <!-- Notes -->
                @if (paper.notes) {
                  <div class="notes-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <span class="notes-text">{{ paper.notes }}</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>

    </section>
  `,
  styles: [`
    :host { display: contents; }
    .author-detail-container { display: flex; flex-direction: column; gap: 1.5rem; }

    /* BACK BUTTON */
    .back-btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.5rem 1rem; border-radius: 10px;
      border: 1px solid var(--p-border); background: white;
      font-size: 0.8rem; font-weight: 700; color: var(--p-text-muted);
      cursor: pointer; transition: all 0.2s;
    }
    .back-btn:hover { border-color: var(--p-accent); color: var(--p-accent); background: #eff6ff; }

    /* HERO CARD */
    .author-hero {
      display: flex; align-items: center; justify-content: space-between;
      gap: 2rem; flex-wrap: wrap; padding: 2rem 2.5rem;
    }
    .hero-left { display: flex; align-items: center; gap: 1.5rem; }
    .author-avatar-lg {
      width: 72px; height: 72px; border-radius: 50%;
      background: var(--p-gradient); color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 2rem; font-weight: 900; flex-shrink: 0;
      box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
    }
    .author-name { font-family: var(--font-display); font-size: 1.6rem; font-weight: 900; color: var(--p-text); margin: 0 0 0.2rem; }
    .author-sub { color: var(--p-text-muted); font-size: 0.8rem; font-weight: 600; margin: 0 0 0.75rem; }
    .author-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .chip {
      padding: 0.3rem 0.75rem; border-radius: 8px; font-size: 0.72rem; font-weight: 700;
      background: var(--p-bg-subtle); color: var(--p-text-muted); border: 1px solid var(--p-border);
      cursor: pointer; transition: all 0.15s; outline: none;
    }
    .chip:hover { transform: translateY(-1px); box-shadow: 0 3px 8px rgba(0,0,0,0.08); }
    .chip.active { box-shadow: 0 0 0 2.5px currentColor; }
    .chip.accent { background: #dcfce7; color: #166534; border-color: #bbf7d0; }
    .chip.blue { background: #eff6ff; color: #1e40af; border-color: #bfdbfe; }
    .chip.yellow { background: #fef9c3; color: #854d0e; border-color: #fef08a; }

    .hero-stats { display: flex; gap: 2rem; flex-wrap: wrap; }
    .hero-stat { display: flex; flex-direction: column; align-items: center; gap: 0.2rem; }
    .hs-val { font-family: var(--font-display); font-size: 2rem; font-weight: 900; color: var(--p-text); line-height: 1; }
    .hs-lbl { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--p-text-muted); }

    .section-title { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
    .section-title h2 { font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; color: var(--p-text); margin: 0; }
    .count-badge { padding: 0.25rem 0.75rem; background: var(--p-bg-subtle); border: 1px solid var(--p-border); border-radius: 8px; font-size: 0.7rem; font-weight: 700; color: var(--p-text-muted); }
    .clear-filter-btn {
      padding: 0.25rem 0.65rem; border-radius: 8px; border: 1px solid #fca5a5;
      background: #fff1f2; color: #9f1239; font-size: 0.7rem; font-weight: 700;
      cursor: pointer; transition: all 0.15s;
    }
    .clear-filter-btn:hover { background: #fecdd3; }

    /* PAPERS GRID */
    .papers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(520px, 1fr)); gap: 1.25rem; }

    /* PAPER CARD */
    .paper-card { padding: 0; overflow: hidden; display: flex; flex-direction: row; gap: 0; }
    .status-stripe { width: 5px; flex-shrink: 0; border-radius: 0; }
    .status-stripe[data-status="PUBLISHED"] { background: #22c55e; }
    .status-stripe[data-status="ACCEPTED"] { background: #3b82f6; }
    .status-stripe[data-status="RUNNING"] { background: #eab308; }
    .status-stripe[data-status="WORKING"] { background: #f97316; }
    .status-stripe[data-status="HYPOTHESIS"] { background: #a855f7; }
    .status-stripe[data-status="REJECTED"] { background: #ef4444; }
    .status-stripe[data-status="WITHDRAWN"] { background: #94a3b8; }

    .paper-body { flex: 1; padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; min-width: 0; }

    .paper-top { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
    .paper-badges { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
    .type-chip { font-size: 0.6rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 5px; background: var(--p-bg-subtle); color: var(--p-text-muted); border: 1px solid var(--p-border); text-transform: uppercase; }
    .featured-chip { font-size: 0.6rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 5px; background: #fef9c3; color: #854d0e; border: 1px solid #fef08a; }
    .pid-label { font-size: 0.68rem; font-weight: 800; color: var(--p-accent); letter-spacing: 0.5px; white-space: nowrap; }

    .paper-title { font-size: 0.95rem; font-weight: 800; color: var(--p-text); line-height: 1.4; margin: 0; }

    .pub-info { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; color: var(--p-text-muted); font-size: 0.78rem; }
    .pub-info svg { flex-shrink: 0; }
    .pub-name { font-weight: 700; color: var(--p-text); }
    .pub-year { font-weight: 600; }
    .quartile-chip { font-size: 0.6rem; font-weight: 800; padding: 2px 6px; border-radius: 5px; border: 1px solid; }
    .quartile-chip[data-q="Q1"] { background: #fef3c7; color: #92400e; border-color: #fcd34d; }
    .quartile-chip[data-q="Q2"] { background: #f1f5f9; color: #475569; border-color: #cbd5e1; }
    .quartile-chip[data-q="Q3"] { background: #ecfdf5; color: #065f46; border-color: #6ee7b7; }
    .quartile-chip[data-q="Q4"] { background: #fff1f2; color: #9f1239; border-color: #fda4af; }
    .quartile-chip[data-q="NON-PREDATORY"] { background: #eff6ff; color: #1e40af; border-color: #93c5fd; }
    .if-chip { font-size: 0.6rem; font-weight: 700; padding: 2px 6px; border-radius: 5px; background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }

    .authors-row { display: flex; align-items: flex-start; gap: 0.5rem; }
    .authors-row svg { flex-shrink: 0; margin-top: 3px; color: var(--p-text-muted); }
    .author-chips-row { display: flex; flex-wrap: wrap; gap: 0.35rem; }
    .author-chip {
      display: inline-flex; align-items: center; padding: 0.2rem 0.55rem;
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px;
      font-size: 0.68rem; font-weight: 600; color: #475569;
    }
    .author-chip.highlight {
      background: var(--p-gradient); color: white; border-color: transparent;
      font-weight: 800; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
    }

    .tags-row { display: flex; flex-wrap: wrap; gap: 0.35rem; }
    .tag-chip { font-size: 0.65rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 6px; background: var(--p-bg-subtle); color: var(--p-text-muted); border: 1px solid var(--p-border); }
    .tag-more { font-size: 0.65rem; font-weight: 700; color: var(--p-accent); }

    .links-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    .link-btn {
      display: inline-flex; align-items: center; gap: 0.3rem;
      padding: 0.3rem 0.65rem; border-radius: 7px; font-size: 0.7rem; font-weight: 700;
      text-decoration: none; transition: all 0.15s;
    }
    .paper-link { background: #eff6ff; color: #1e40af; }
    .paper-link:hover { background: #dbeafe; }
    .overleaf-link { background: #f0fdf4; color: #166534; }
    .overleaf-link:hover { background: #dcfce7; }
    .drive-link { background: #fef9c3; color: #854d0e; }
    .drive-link:hover { background: #fef08a; }
    .dataset-link { background: #fdf4ff; color: #7e22ce; }
    .dataset-link:hover { background: #f3e8ff; }
    .date-chip { font-size: 0.68rem; font-weight: 600; color: var(--p-text-muted); }

    .notes-row { display: flex; align-items: flex-start; gap: 0.4rem; padding: 0.6rem 0.75rem; background: var(--p-bg-subtle); border-radius: 8px; border: 1px solid var(--p-border); }
    .notes-row svg { flex-shrink: 0; margin-top: 2px; color: var(--p-text-muted); }
    .notes-text { font-size: 0.75rem; color: var(--p-text-muted); line-height: 1.5; font-style: italic; }

    /* EMPTY */
    .empty-state { text-align: center; padding: 4rem; }
    .empty-icon { font-size: 2.5rem; margin-bottom: 1rem; }
    .empty-state p { color: var(--p-text-muted); font-weight: 600; }
  `]
})
export class AuthorDetailComponent {
  @Input() authorName: string = '';
  @Input() allPapers: Research[] = [];
  @Output() back = new EventEmitter<void>();
  @Output() filterReset = new EventEmitter<void>();

  activeFilter: 'all' | 'published' | 'accepted' | 'inprogress' = 'all';

  setFilter(f: 'all' | 'published' | 'accepted' | 'inprogress') {
    const newFilter = (this.activeFilter === f && f !== 'all') ? 'all' : f;
    this.activeFilter = newFilter;
    if (newFilter === 'all') {
      this.filterReset.emit();
    }
  }

  get papers(): Research[] {
    if (!this.authorName) return [];
    const target = this.authorName.toLowerCase();
    return this.allPapers.filter(p =>
      p.authors?.some(a => a.name.toLowerCase().includes(target) || target.includes(a.name.toLowerCase()))
    ).sort((a, b) => {
      const weights: Record<string, number> = { PUBLISHED: 1, ACCEPTED: 2, RUNNING: 3, WORKING: 4, HYPOTHESIS: 5, REJECTED: 6, WITHDRAWN: 7 };
      return (weights[a.status || ''] || 9) - (weights[b.status || ''] || 9);
    });
  }

  get filteredPapers(): Research[] {
    switch (this.activeFilter) {
      case 'published': return this.papers.filter(p => p.status === 'PUBLISHED');
      case 'accepted': return this.papers.filter(p => p.status === 'ACCEPTED');
      case 'inprogress': return this.papers.filter(p => ['RUNNING', 'WORKING', 'HYPOTHESIS'].includes(p.status || ''));
      default: return this.papers;
    }
  }

  get publishedCount(): number { return this.papers.filter(p => p.status === 'PUBLISHED').length; }
  get acceptedCount(): number { return this.papers.filter(p => p.status === 'ACCEPTED').length; }
  get inProgressCount(): number { return this.papers.filter(p => ['RUNNING', 'WORKING', 'HYPOTHESIS'].includes(p.status || '')).length; }
  get uniqueVenues(): number {
    const venues = new Set(this.papers.map(p => p.publication?.name).filter(Boolean));
    return venues.size;
  }
  get latestYear(): string {
    const years = this.papers.map(p => p.publication?.year).filter(y => y && /^\d{4}$/.test(y!)) as string[];
    return years.length ? years.sort().reverse()[0] : '—';
  }

  isThisAuthor(name: string): boolean {
    const target = this.authorName.toLowerCase();
    const n = name.toLowerCase();
    return n.includes(target) || target.includes(n);
  }
}
