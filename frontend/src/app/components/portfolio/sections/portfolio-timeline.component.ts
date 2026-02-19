import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Research } from '../../../services/research.service';

@Component({
  selector: 'app-portfolio-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="archive-section">
      <div class="section-title animate-reveal">
        <div class="title-meta">PROGRESSION ARCHIVE</div>
        <h2>Academic Timeline</h2>
      </div>

      <div class="timeline-wrapper">
        <div class="glow-line-track"></div>
        <div class="glow-line-active"></div>
        
        @for (item of items; track item.id; let i = $index) {
          <div class="timeline-unit animate-reveal" [style.animation-delay]="(i * 0.08) + 's'">
            <div class="unit-marker">
              <span class="year-stamp">{{ item.publication?.year || '2024' }}</span>
              <div class="node-system">
                <div class="node-glow"></div>
                <div class="node-core"></div>
                <div class="node-pulse"></div>
              </div>
            </div>
            
            <div class="unit-card">
              <div class="card-header-mini">
                <div class="unit-status">
                  <span class="status-dot" [class]="item.status.toLowerCase()"></span>
                  {{ item.status }}
                </div>
                <span class="type-badge">{{ item.publication?.type || 'ARTICLE' }}</span>
              </div>

              <h4 class="unit-title">{{ item.title }}</h4>
              
              <div class="unit-metadata">
                @if (item.publication?.impactFactor && +item.publication!.impactFactor !== 0) {
                  <span class="meta-tag impact">IF {{ item.publication!.impactFactor }}</span>
                }
                @if (item.publication?.quartile && item.publication!.quartile !== 'N/A') {
                  <span class="meta-tag quartile" [class]="item.publication!.quartile.toLowerCase()">{{ item.publication!.quartile }}</span>
                }
                <span class="meta-venue">{{ formatPublisher(item.publication?.name || '---') }}</span>
              </div>

              @if (item.synopsis) {
                <p class="unit-synopsis">
                  {{ item.synopsis.slice(0, 160) }}...
                </p>
              }

              <div class="unit-authors">
                @for (author of item.authors; track author.name) {
                  <span class="mini-author">{{ author.name }}</span>
                }
              </div>

              <div class="unit-actions">
                @if (item.status.toUpperCase() === 'PUBLISHED') {
                  @if (item.publication?.url || item.paperUrl) {
                    <a [href]="item.publication?.url || item.paperUrl" target="_blank" rel="noopener noreferrer" class="action-btn" title="View Publication">
                      <span>Source</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  }
                } @else {
                  <span class="pending-status">Access Restricted</span>
                }
              </div>
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            <div class="empty-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            </div>
            <p>Archive synchronization in progress...</p>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    :host { display: contents; }
    .archive-section { position: relative; padding-bottom: 6rem; margin-top: 6rem; }
    
    .section-title { margin-bottom: 6rem; }
    .title-meta { 
      font-size: 0.75rem; font-weight: 800; color: var(--p-accent); 
      letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 1.25rem;
      display: flex; align-items: center; gap: 1rem;
    }
    .title-meta::after { content: ''; height: 1px; width: 60px; background: var(--p-accent); opacity: 0.3; }

    .section-title h2 { 
      font-family: var(--font-display);
      font-size: 3.5rem; font-weight: 800; color: var(--p-text); letter-spacing: -0.04em; 
    }

    .timeline-wrapper { position: relative; padding-left: 5rem; }
    
    .glow-line-track {
      position: absolute; left: 6rem; top: 0; bottom: 0; width: 2px;
      background: var(--p-glass-border); opacity: 0.6;
    }
    .glow-line-active {
      position: absolute; left: 6rem; top: 0; bottom: 0; width: 2px;
      background: linear-gradient(to bottom, var(--p-accent), #f59e0b, var(--p-accent));
      opacity: 0.4; filter: blur(4px);
    }

    .timeline-unit { display: flex; gap: 6rem; margin-bottom: 6rem; position: relative; }
    
    .unit-marker { 
      position: relative; width: 120px; display: flex; flex-direction: column; align-items: flex-end; padding-top: 1.5rem;
    }
    .year-stamp { 
      font-family: var(--font-display); font-size: 2.25rem; font-weight: 800; 
      color: var(--p-text); opacity: 0.08; letter-spacing: -1px; transition: all 0.4s ease;
    }
    .timeline-unit:hover .year-stamp { opacity: 0.6; color: var(--p-accent); transform: scale(1.1); }

    .node-system { position: absolute; right: -6rem; top: 2.25rem; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; z-index: 100; }
    
    .node-core {
      width: 12px; height: 12px; background: #ffffff; border: 3px solid var(--p-accent); 
      border-radius: 50%; position: relative; z-index: 2; transition: all 0.4s ease;
      box-shadow: 0 0 10px rgba(37, 99, 235, 0.2);
    }
    .node-glow {
      position: absolute; width: 30px; height: 30px; background: var(--p-accent);
      border-radius: 50%; opacity: 0; filter: blur(10px); transition: opacity 0.4s ease;
    }
    .node-pulse {
      position: absolute; width: 100%; height: 100%; border: 2px solid var(--p-accent);
      border-radius: 50%; opacity: 0;
    }

    .timeline-unit:hover .node-core { background: var(--p-accent); border-color: #ffffff; transform: scale(1.3); }
    .timeline-unit:hover .node-glow { opacity: 0.3; }
    .timeline-unit:hover .node-pulse { animation: nodePulse 1.5s infinite; opacity: 1; }

    @keyframes nodePulse {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(3.5); opacity: 0; }
    }

    .unit-card {
      flex: 1; padding: 3rem; background: #ffffff; 
      border: 1px solid var(--p-glass-border); border-radius: 32px;
      backdrop-filter: var(--p-blur); transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
      box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.05);
    }
    .unit-card:hover { 
      border-color: rgba(37, 99, 235, 0.2);
      transform: translateX(15px);
      box-shadow: 0 30px 60px -15px rgba(15, 23, 42, 0.1);
    }

    .card-header-mini { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .unit-status { 
      display: flex; align-items: center; gap: 0.75rem; font-size: 0.75rem; font-weight: 800; 
      color: var(--p-text-muted); text-transform: uppercase; letter-spacing: 0.1em;
    }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; }
    .status-dot.published { background: #059669; box-shadow: 0 0 10px rgba(5, 150, 105, 0.4); }
    .status-dot.working { background: #d97706; box-shadow: 0 0 10px rgba(217, 119, 6, 0.4); }
    .status-dot.accepted { background: #2563eb; box-shadow: 0 0 10px rgba(37, 99, 235, 0.4); }

    .type-badge { font-size: 0.65rem; font-weight: 800; color: var(--p-accent); border: 1px solid rgba(37, 99, 235, 0.1); padding: 0.3rem 0.8rem; border-radius: 8px; text-transform: uppercase; }

    .unit-title { 
      font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: var(--p-text); 
      margin-bottom: 1.25rem; line-height: 1.3; letter-spacing: -0.01em;
    }
    
    .unit-metadata { display: flex; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; }
    .meta-tag { font-size: 0.75rem; font-weight: 700; padding: 0.3rem 0.8rem; border-radius: 6px; }
    .meta-tag.impact { background: rgba(217, 119, 6, 0.08); color: #b45309; }
    .meta-tag.quartile.q1 { background: var(--p-gold-gradient); color: #ffffff; }
    .meta-tag.quartile.q2 { background: rgba(15, 23, 42, 0.05); color: var(--p-text-muted); }
    .meta-venue { font-size: 0.9rem; color: var(--p-text-muted); font-weight: 700; }

    .unit-synopsis { 
      font-size: 0.95rem; color: var(--p-text-muted); line-height: 1.7; margin-bottom: 2.5rem;
      font-family: var(--font-body); font-weight: 500;
    }

    .unit-authors { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--p-glass-border); }
    .mini-author { 
      font-size: 0.75rem; font-weight: 700; color: var(--p-text-muted); background: rgba(15, 23, 42, 0.03); padding: 0.4rem 0.9rem; border-radius: 8px;
    }

    .unit-actions { display: flex; }
    .action-btn {
      display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; font-weight: 800; text-decoration: none;
      color: var(--p-text); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.05em;
    }
    .action-btn svg { color: var(--p-accent); transition: transform 0.3s ease; }
    .action-btn:hover { color: var(--p-accent); }
    .action-btn:hover svg { transform: translate(3px, -3px); }
    .pending-status { font-size: 0.7rem; font-weight: 700; color: #94a3b8; font-style: italic; }

    .empty-state { text-align: center; padding: 8rem; border-radius: 40px; border: 2px dashed var(--p-glass-border); opacity: 0.6; }
    .empty-icon { margin-bottom: 2rem; color: var(--p-accent); opacity: 0.5; }
    .empty-state p { color: var(--p-text-muted); font-size: 1.1rem; font-weight: 700; }

    @media (max-width: 900px) {
      .timeline-wrapper { padding-left: 2rem; }
      .timeline-unit { gap: 2rem; flex-direction: column; }
      .unit-marker { width: auto; align-items: flex-start; padding-top: 0; margin-bottom: -1rem; }
      .year-stamp { font-size: 3rem; }
      .node-system { left: -2.7rem; top: 1.5rem; }
      .glow-line-track, .glow-line-active { left: -2.1rem; }
    }
  `]
})
export class PortfolioTimelineComponent {
  @Input() items: Research[] = [];

  formatPublisher(name: string): string {
    if (!name) return '';
    const acronyms = new Set(['ICCIT', 'ICECTE', 'ICEFRONT', 'PECCII', 'QPAIN', 'IEEE', 'ACM', 'SN', 'MDPI', 'IUBAT', 'IF']);
    if (acronyms.has(name.trim().toUpperCase())) return name.trim().toUpperCase();
    if (name === name.toUpperCase() && name.length > 4) {
      return name.split(' ').map(w => {
        if (acronyms.has(w.toUpperCase())) return w.toUpperCase();
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      }).join(' ');
    }
    return name;
  }
}
