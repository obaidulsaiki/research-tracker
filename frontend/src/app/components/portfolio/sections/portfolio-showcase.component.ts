import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Research } from '../../../services/research.service';

@Component({
  selector: 'app-portfolio-showcase',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (items.length > 0) {
      <section class="showcase-section">
        <div class="section-title animate-reveal">
          <div class="title-meta">SELECTED WORK</div>
          <h2>Featured Publications</h2>
        </div>
        
        <div class="featured-grid">
          @for (item of items; track item.id; let i = $index) {
            <div class="featured-card animate-reveal" [style.animation-delay]="(i * 0.1) + 's'">
              <div class="card-inner">
                <div class="card-header">
                  <div class="quartile-wrap">
                    @if (item.publication?.quartile && item.publication!.quartile !== 'N/A') {
                      <span class="q-badge" [class]="item.publication!.quartile.toLowerCase().replace(' ', '-')">
                        {{ item.publication!.quartile }}
                      </span>
                    } @else {
                      <span class="q-badge unknown">RESEARCH</span>
                    }
                  </div>
                  <div class="impact-factor">
                    @if (item.publication?.impactFactor && +item.publication!.impactFactor !== 0) {
                      <span class="if-label">IF {{ item.publication!.impactFactor }}</span>
                    }
                  </div>
                </div>

                <div class="card-body">
                  <h3 class="research-title">{{ item.title }}</h3>
                  <div class="synopsis-snippet">
                    {{ (item.synopsis || item.title).slice(0, 160) }}...
                  </div>
                  
                  <div class="authors-list">
                    @for (author of item.authors; track author.name) {
                      <span class="author-tag">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        {{ author.name }}
                      </span>
                    }
                  </div>
                </div>

                <div class="card-footer">
                  <div class="pub-info">
                    <span class="pub-type">{{ item.publication?.type || 'ARTICLE' }}</span>
                    <span class="pub-sep">/</span>
                    <span class="pub-name">{{ formatPublisher(item.publication?.name || '---') }}</span>
                  </div>
                  <div class="resource-links">
                    @if (item.status.toUpperCase() === 'PUBLISHED') {
                       @if (item.publication?.url || item.paperUrl) {
                          <a [href]="item.publication?.url || item.paperUrl" target="_blank" rel="noopener noreferrer" class="res-link pdf" [title]="item.publication?.url ? 'View Publication' : 'View PDF'">
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                          </a>
                       }
                    } @else if (item.status.toUpperCase() === 'ACCEPTED') {
                       <span class="res-not-available">Not Available</span>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </section>
    }
  `,
  styles: [`
    :host { display: contents; }
    .showcase-section { padding-bottom: 8rem; }

    .section-title { margin-bottom: 4rem; position: relative; }
    .title-meta { 
      font-size: 0.65rem; font-weight: 800; color: var(--p-accent); 
      letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 1rem;
    }
    .section-title h2 { 
      font-family: var(--font-display);
      font-size: 2.75rem; font-weight: 800; color: var(--p-text); letter-spacing: -0.03em; 
    }

    .featured-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(480px, 1fr)); gap: 2.5rem; }
    
    .featured-card {
      position: relative; border-radius: 20px; overflow: hidden;
      background: var(--p-surface); border: 1px solid var(--p-border);
      backdrop-filter: var(--p-glass);
      transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
      box-shadow: var(--p-shadow);
    }
    
    .featured-card:hover { 
      transform: translateY(-8px) scale(1.01);
      border-color: var(--p-accent);
      box-shadow: var(--p-shadow-premium);
    }

    .card-inner { padding: 2.5rem; display: flex; flex-direction: column; height: 100%; }

    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .q-badge { 
      padding: 0.35rem 0.9rem; border-radius: 8px; font-size: 0.6rem; font-weight: 800; 
      letter-spacing: 0.05em; text-transform: uppercase;
    }
    .q-badge.q1 { background: var(--p-gold-gradient); color: white; }
    .q-badge.q2 { background: #f1f5f9; color: #475569; }
    .q-badge.unknown { background: rgba(15, 23, 42, 0.03); color: var(--p-muted); border: 1px solid rgba(15, 23, 42, 0.05); }
    
    .if-label { font-size: 0.75rem; font-weight: 700; color: var(--p-accent); background: var(--p-gradient-soft); padding: 0.35rem 0.75rem; border-radius: 8px; }

    .research-title { 
      font-family: var(--font-display);
      font-size: 1.6rem; font-weight: 800; color: var(--p-text); 
      line-height: 1.25; margin-bottom: 1.25rem;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    
    .synopsis-snippet {
      font-size: 0.95rem; color: var(--p-muted); line-height: 1.65; margin-bottom: 2.5rem;
      font-weight: 400; font-family: var(--font-body);
    }

    .authors-list { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: auto; padding-bottom: 2rem; }
    .author-tag { 
      font-size: 0.75rem; font-weight: 600; color: #475569; 
      background: rgba(15, 23, 42, 0.03); padding: 0.4rem 0.8rem; border-radius: 8px;
      display: flex; align-items: center; gap: 0.4rem; border: 1px solid rgba(15, 23, 42, 0.05);
    }

    .card-footer { 
      display: flex; justify-content: space-between; align-items: center; 
      padding-top: 1.5rem; border-top: 1px solid rgba(15, 23, 42, 0.05);
    }
    .pub-info { display: flex; align-items: center; gap: 0.6rem; }
    .pub-type { font-size: 0.7rem; font-weight: 800; color: var(--p-accent); letter-spacing: 0.1em; }
    .pub-sep { color: rgba(15, 23, 42, 0.1); font-size: 0.7rem; }
    .pub-name { font-weight: 600; color: var(--p-muted); font-size: 0.75rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }

    .resource-links { display: flex; gap: 0.75rem; }
    .res-link {
      width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
      background: rgba(15, 23, 42, 0.03); color: var(--p-muted); transition: all 0.3s ease; border: 1px solid rgba(15, 23, 42, 0.05);
    }
    .res-link:hover { background: var(--p-accent); color: white; border-color: var(--p-accent); transform: scale(1.1); }
    .res-not-available { font-size: 0.65rem; font-weight: 700; color: #94a3b8; font-style: italic; white-space: nowrap; }

    @media (max-width: 1024px) {
      .featured-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class PortfolioShowcaseComponent {
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
