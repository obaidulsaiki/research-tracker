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
        <div class="title-meta">HISTORY & PROGRESS</div>
        <h2>Academic Timeline</h2>
      </div>

      <div class="timeline-wrapper">
        <div class="glow-line"></div>
        
        @for (item of items; track item.id; let i = $index) {
          <div class="timeline-unit animate-reveal" [style.animation-delay]="(i * 0.05) + 's'">
            <div class="unit-marker">
              <span class="year-stamp">{{ item.publication?.year || '2024' }}</span>
              <div class="node-glow"></div>
              <div class="node-core"></div>
            </div>
            
            <div class="unit-card">
              <div class="unit-status">
                <span class="status-dot" [class]="item.status.toLowerCase()"></span>
                {{ item.status }}
              </div>
              <h4 class="unit-title">{{ item.title }}</h4>
              <div class="unit-info">
                <span class="type-tag">{{ item.publication?.type || 'ARTICLE' }}</span>
                @if (item.publication?.impactFactor && +item.publication!.impactFactor !== 0) {
                  <span class="dot-sep"></span>
                  <span class="if-tag">IF {{ item.publication!.impactFactor }}</span>
                }
                @if (item.publication?.quartile && item.publication!.quartile !== 'N/A') {
                  <span class="dot-sep"></span>
                  <span class="q-tag" [class]="item.publication!.quartile.toLowerCase()">{{ item.publication!.quartile }}</span>
                }
                <span class="dot-sep"></span>
                <span class="venue-name">{{ formatPublisher(item.publication?.name || '---') }}</span>
              </div>

              @if (item.synopsis) {
                <div class="unit-synopsis">
                  {{ item.synopsis.slice(0, 150) }}...
                </div>
              }

              <div class="unit-authors">
                @for (author of item.authors; track author.name) {
                  <span class="mini-author">{{ author.name }}</span>
                }
              </div>

              <div class="unit-links">
                @if (item.status.toUpperCase() === 'PUBLISHED') {
                  @if (item.publication?.url || item.paperUrl) {
                    <a [href]="item.publication?.url || item.paperUrl" target="_blank" rel="noopener noreferrer" class="t-link pdf" title="View Publication">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                      {{ item.publication?.url ? 'View on Web' : 'Full Text' }}
                    </a>
                  }
                } @else if (item.status.toUpperCase() === 'ACCEPTED') {
                  <span class="not-available">Link: Not available right now</span>
                }
              </div>
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            <div class="empty-icon">📂</div>
            <p>The academic archive is currently being updated.</p>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    :host { display: contents; }
    .archive-section { position: relative; padding-bottom: 4rem; margin-top: 4rem; }
    
    .section-title { margin-bottom: 5rem; }
    .title-meta { 
      font-size: 0.65rem; font-weight: 800; color: var(--p-accent); 
      letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 1rem;
    }
    .section-title h2 { 
      font-family: var(--font-display);
      font-size: 2.75rem; font-weight: 800; color: var(--p-text); letter-spacing: -0.03em; 
    }

    .timeline-wrapper { position: relative; padding-left: 3rem; }
    .glow-line {
      position: absolute; left: 3.5rem; top: 0; bottom: 0; width: 2px;
      background: linear-gradient(to bottom, 
        transparent 0%, 
        var(--p-accent) 5%, 
        var(--p-accent) 95%, 
        transparent 100%);
      opacity: 0.1;
    }

    .timeline-unit { display: flex; gap: 4rem; margin-bottom: 5rem; position: relative; }
    
    .unit-marker { 
      position: relative; width: 100px; display: flex; flex-direction: column; align-items: flex-end; padding-top: 0.75rem;
    }
    .year-stamp { 
      font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; 
      color: var(--p-text); opacity: 0.15; letter-spacing: -1px; transition: opacity 0.3s ease;
    }
    .timeline-unit:hover .year-stamp { opacity: 0.6; color: var(--p-accent); }

    .node-core {
      position: absolute; right: -4rem; top: 1.65rem; width: 12px; height: 12px; 
      background: var(--p-bg); border: 3px solid var(--p-accent); border-radius: 50%; z-index: 10;
    }
    .node-glow {
      position: absolute; right: -4.4rem; top: 1.25rem; width: 25px; height: 25px;
      background: var(--p-accent); border-radius: 50%; opacity: 0; filter: blur(8px);
      transition: opacity 0.3s ease;
    }
    .timeline-unit:hover .node-glow { opacity: 0.4; }

    .unit-card {
      flex: 1; padding: 2.5rem; background: var(--p-surface); 
      border: 1px solid var(--p-border); border-radius: 20px;
      backdrop-filter: var(--p-glass); transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
      box-shadow: var(--p-shadow);
    }
    .unit-card:hover { 
      border-color: var(--p-accent); 
      transform: translateX(12px);
      box-shadow: var(--p-shadow-lg);
    }

    .unit-status { 
      display: flex; align-items: center; gap: 0.6rem; font-size: 0.7rem; font-weight: 800; 
      color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem;
    }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; }
    .status-dot.published { background: var(--p-success); box-shadow: 0 0 10px var(--p-success); }
    .status-dot.working { background: var(--p-warning); box-shadow: 0 0 10px var(--p-warning); }
    .status-dot.accepted { background: var(--p-info); box-shadow: 0 0 10px var(--p-info); }

    .unit-title { 
      font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; color: var(--p-text); 
      margin-bottom: 1rem; line-height: 1.35;
    }
    
    .unit-info { display: flex; align-items: center; flex-wrap: wrap; gap: 0.8rem; margin-bottom: 1.5rem; }
    .type-tag { font-size: 0.75rem; font-weight: 800; color: var(--p-accent); text-transform: uppercase; }
    .if-tag { font-size: 0.75rem; font-weight: 700; color: #d97706; }
    .q-tag { font-size: 0.7rem; font-weight: 800; padding: 0.2rem 0.5rem; border-radius: 4px; }
    .q-tag.q1 { background: var(--p-gold-gradient); color: white; }
    .q-tag.q2 { background: #f1f5f9; color: #475569; }
    .dot-sep { width: 4px; height: 4px; background: rgba(15, 23, 42, 0.1); border-radius: 50%; }
    .venue-name { font-size: 0.85rem; color: #64748b; font-weight: 600; }

    .unit-synopsis { 
      font-size: 0.85rem; color: var(--p-muted); line-height: 1.6; margin-bottom: 1.5rem;
      font-family: var(--font-body); border-left: 2px solid rgba(15, 23, 42, 0.05); padding-left: 1rem;
    }

    .unit-authors { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-top: 1px solid rgba(15, 23, 42, 0.05); padding-top: 1rem; }
    .mini-author { 
      font-size: 0.7rem; font-weight: 600; color: #475569; background: #f1f5f9; padding: 0.25rem 0.6rem; border-radius: 6px;
    }

    .unit-links { display: flex; gap: 1rem; }
    .t-link {
      display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 700; text-decoration: none;
      color: var(--p-muted); transition: all 0.2s ease;
    }
    .t-link svg { color: var(--p-accent); }
    .t-link:hover { color: var(--p-accent); transform: translateY(-1px); }
    .not-available { font-size: 0.7rem; font-weight: 700; color: #94a3b8; font-style: italic; opacity: 0.8; }

    .empty-state { text-align: center; padding: 6rem; background: rgba(15, 23, 42, 0.01); border-radius: 30px; border: 1px dashed rgba(15, 23, 42, 0.1); }
    .empty-icon { font-size: 4rem; margin-bottom: 1.5rem; opacity: 0.2; }
    .empty-state p { color: #64748b; font-size: 1.1rem; }

    @media (max-width: 768px) {
      .timeline-unit { gap: 1.5rem; }
      .year-stamp { font-size: 1.25rem; }
      .unit-marker { width: 60px; }
      .node-core { right: -1.5rem; }
      .node-glow { right: -1.9rem; }
      .glow-line { left: 1rem; }
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
