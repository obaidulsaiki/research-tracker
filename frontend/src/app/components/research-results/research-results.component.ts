import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ResearchService, Research } from '../../services/research.service';

@Component({
  selector: 'app-research-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="results-page animate-fade-in">
      <header class="results-header">
        <div class="header-content">
          <button class="btn-back" (click)="goBack()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Dashboard
          </button>
          <div class="title-group">
            <h1 class="page-title">{{ statusDisplay }} Research</h1>
            @if (loading()) {
              <p class="page-count">Updating records...</p>
            } @else {
              <p class="page-count">Found {{ filteredPapers().length }} papers in this category</p>
            }
          </div>
        </div>
      </header>

      <main class="results-main">
        @if (loading() && filteredPapers().length === 0) {
          <div class="p-card empty-state">
            <div class="loader">🧊</div>
            <h2>Fetching your research archive...</h2>
            <p>Please wait while we sync with the backend.</p>
          </div>
        } @else {
          <div class="p-card list-card">
            <div class="table-container">
              <table class="results-table">
                <thead>
                  <tr>
                    <th class="col-idx">#</th>
                    <th class="col-status">Status</th>
                    <th class="col-pid">PID</th>
                    <th class="col-project">Project Details</th>
                    <th class="col-pub">Publication / Venue</th>
                    <th class="col-year">Year</th>
                    <th class="col-links">Resources</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of filteredPapers(); track item.id; let i = $index) {
                    <tr class="result-row">
                      <td class="col-idx">{{ i + 1 }}</td>
                      <td>
                        <span class="p-badge status-badge" [attr.data-status]="item.status">
                          {{ item.status }}
                        </span>
                      </td>
                      <td class="col-pid">{{ item.pid || '0' }}</td>
                      <td>
                        <div class="project-details">
                          <div class="paper-title">{{ item.title }}</div>
                          <div class="author-list">{{ getAuthorList(item) }}</div>
                        </div>
                      </td>
                      <td>
                        <div class="pub-info">
                          <div class="pub-name">{{ item.publication?.name || 'NONE' }}</div>
                          <div class="pub-meta">
                            @if (item.publication?.type === 'CONFERENCE') {
                              <span class="venue-tag">📍 {{ item.publication?.venue }}</span>
                            } @else if (item.publication?.impactFactor) {
                              <span class="if-tag">IF: {{ item.publication?.impactFactor }}</span>
                            }
                          </div>
                        </div>
                      </td>
                      <td class="col-year">{{ item.publication?.year || 'NONE' }}</td>
                      <td>
                        <div class="resource-links">
                          @if (item.paperUrl) {
                            <a [href]="item.paperUrl" target="_blank" class="link-circle" title="View Article">📄</a>
                          }
                          @if (item.overleafUrl) {
                            <a [href]="item.overleafUrl" target="_blank" class="link-circle" title="Overleaf">🖋️</a>
                          }
                          @if (item.driveUrl) {
                            <a [href]="item.driveUrl" target="_blank" class="link-circle" title="Drive">☁️</a>
                          }
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="7" class="empty-state">
                        <div class="empty-icon">🧊</div>
                        <h2>No results found</h2>
                        <p>There are no research papers with the status "{{ statusDisplay }}"</p>
                        @if (statusParam() !== 'ALL') {
                          <button class="btn-back" style="margin: 1.5rem auto;" (click)="statusParam.set('ALL')">View All Papers Instead</button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .results-page {
      min-height: 100vh;
      background: #f8fafc;
      color: #0f172a;
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 2rem 4rem;
    }
    .results-header {
      margin-bottom: 3rem;
      animation: slideDown 0.5s ease-out;
    }
    .header-content {
      display: flex;
      align-items: center;
      gap: 2.5rem;
    }
    .btn-back {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: white;
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 12px;
      font-weight: 700;
      color: #64748b;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    .btn-back:hover {
      background: #f1f5f9;
      transform: translateX(-4px);
    }
    .page-title {
      font-family: 'Outfit', sans-serif;
      font-size: 2.25rem;
      font-weight: 800;
      letter-spacing: -1px;
      margin: 0;
    }
    .page-count {
      color: #64748b;
      font-weight: 600;
      margin-top: 0.25rem;
    }

    .p-card {
      background: white;
      border-radius: 24px;
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.1);
      overflow: hidden;
    }

    .table-container { overflow-x: auto; }
    .results-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .results-table th {
      padding: 1.25rem 1.5rem;
      background: #f8fafc;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      border-bottom: 1px solid #f1f5f9;
    }
    .results-table td {
      padding: 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }
    .result-row { transition: background 0.2s ease; }
    .result-row:hover { background: #f8fafc; }

    .paper-title {
      font-weight: 800;
      font-size: 1rem;
      color: #0f172a;
      line-height: 1.4;
      margin-bottom: 0.4rem;
    }
    .author-list {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 500;
    }
    .pub-name {
      font-weight: 700;
      font-size: 0.9rem;
      color: #1e293b;
      margin-bottom: 0.3rem;
    }
    .pub-meta { display: flex; gap: 0.5rem; }
    
    .p-badge {
      display: inline-flex;
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-badge[data-status="PUBLISHED"] { background: #dcfce7; color: #166534; }
    .status-badge[data-status="ACCEPTED"] { background: #dbeafe; color: #1e40af; }
    .status-badge[data-status="RUNNING"] { background: #fef9c3; color: #854d0e; }
    .status-badge[data-status="HYPOTHESIS"] { background: #f3e8ff; color: #6b21a8; }
    .status-badge[data-status="WORKING"] { background: #f1f5f9; color: #475569; }

    .venue-tag { background: #fff1f2; color: #9f1239; padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; font-weight: 700; }
    .if-tag { background: #eff6ff; color: #1d4ed8; padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; font-weight: 700; }

    .col-idx { width: 50px; text-align: center; color: #94a3b8; font-weight: 700; }
    .col-pid { font-family: 'Outfit'; font-weight: 800; color: #2563eb; }
    .col-year { font-weight: 900; color: #0f172a; }

    .resource-links { display: flex; gap: 0.75rem; }
    .link-circle {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 50%;
      text-decoration: none;
      transition: all 0.2s;
    }
    .link-circle:hover {
      background: #eff6ff;
      border-color: #2563eb;
      transform: scale(1.1);
    }

    .empty-state {
      padding: 8rem 0;
      text-align: center;
    }
    .empty-icon { font-size: 4rem; margin-bottom: 1.5rem; }
    .empty-state h2 { font-family: 'Outfit'; font-weight: 800; margin-bottom: 0.5rem; }
    .empty-state p { color: #64748b; font-weight: 500; }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fade-in { animation: fade-in 0.6s ease-out; }
  `]
})
export class ResearchResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected researchService = inject(ResearchService);

  statusParam = signal('');
  loading = this.researchService.loading;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const s = params['status'] || '';
      this.statusParam.set(s);
      console.log('RESULTS_PAGE: Status param set to', s);
      if (this.researchService.researchItems().length === 0) {
        this.researchService.loadAll();
      }
    });
  }

  filteredPapers = computed(() => {
    const rawItems = this.researchService.researchItems();
    const currentStatus = this.statusParam();
    console.log('RESULTS_PAGE: Filtering papers...', { total: rawItems.length, target: currentStatus });
    if (currentStatus === 'ALL') return rawItems;
    return rawItems.filter(i => (i.status || '').toUpperCase() === currentStatus.toUpperCase());
  });

  get statusDisplay() {
    const s = this.statusParam();
    if (s === 'ALL') return 'Total';
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  getAuthorList(item: Research) {
    return (item.authors || []).map(a => a.name).join(', ');
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
