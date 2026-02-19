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
          <div class="title-meta">CURATED EXHIBITS</div>
          <h2>Featured Publications</h2>
        </div>
        
        <div class="featured-grid">
          @for (item of items; track item.id; let i = $index) {
            <div class="featured-card-wrap animate-reveal" [style.animation-delay]="(i * 0.15) + 's'">
              <div class="featured-card">
                <div class="card-glow"></div>
                <div class="card-inner">
                  <div class="card-header">
                    <div class="quartile-wrap">
                      @if (item.publication?.quartile && item.publication!.quartile !== 'N/A') {
                        <span class="q-badge" [class]="item.publication!.quartile.toLowerCase().replace(' ', '-')">
                          {{ item.publication!.quartile }}
                        </span>
                      } @else {
                        <span class="q-badge research">RESEARCH</span>
                      }
                    </div>
                    @if (item.publication?.impactFactor && +item.publication!.impactFactor !== 0) {
                      <div class="impact-factor">
                        <span class="if-val">{{ item.publication!.impactFactor }}</span>
                        <span class="if-label">IMPACT</span>
                      </div>
                    }
                  </div>

                  <div class="card-body">
                    <h3 class="research-title">{{ item.title }}</h3>
                    <p class="synopsis-snippet">
                      {{ (item.synopsis || item.title).slice(0, 140) }}...
                    </p>
                    
                    <div class="authors-list">
                      @for (author of item.authors; track author.name) {
                        <span class="author-tag">
                          {{ author.name }}
                        </span>
                      }
                    </div>
                  </div>

                  <div class="card-footer">
                    <div class="pub-info">
                      <span class="pub-type">{{ item.publication?.type || 'ARTICLE' }}</span>
                      <span class="pub-name">{{ formatPublisher(item.publication?.name || '---') }}</span>
                    </div>
                    <div class="resource-links">
                      @if (item.status.toUpperCase() === 'PUBLISHED') {
                         @if (item.publication?.url || item.paperUrl) {
                            <a [href]="item.publication?.url || item.paperUrl" target="_blank" rel="noopener noreferrer" class="res-link" title="Explore Publication">
                               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            </a>
                         }
                      } @else {
                         <span class="pending-tag">UNDER REVIEW</span>
                      }
                    </div>
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
    .showcase-section { padding-bottom: 10rem; }

    .section-title { margin-bottom: 5rem; text-align: left; }
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

    .featured-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(500px, 1fr)); gap: 3rem; }
    
    .featured-card-wrap { perspective: 1200px; }

    .featured-card {
      position: relative; border-radius: 32px; overflow: hidden;
      background: #ffffff; border: 1px solid var(--p-glass-border);
      backdrop-filter: var(--p-blur);
      transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
      height: 100%;
      box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.05);
    }
    
    .card-glow {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(37, 99, 235, 0.05), transparent 60%);
      opacity: 0; transition: opacity 0.5s;
    }

    .featured-card:hover { 
      transform: translateY(-10px) rotateX(2deg) rotateY(-1deg);
      border-color: rgba(37, 99, 235, 0.2);
      box-shadow: 0 40px 80px -20px rgba(15, 23, 42, 0.12);
    }
    .featured-card:hover .card-glow { opacity: 1; }

    .card-inner { padding: 3rem; display: flex; flex-direction: column; height: 100%; position: relative; z-index: 2; }

    .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; }
    .q-badge { 
      padding: 0.5rem 1.25rem; border-radius: 12px; font-size: 0.7rem; font-weight: 800; 
      letter-spacing: 0.15em; text-transform: uppercase;
    }
    .q-badge.q1 { background: var(--p-gold-gradient); color: #ffffff; }
    .q-badge.q2 { background: rgba(15, 23, 42, 0.03); color: var(--p-text); border: 1px solid var(--p-glass-border); }
    .q-badge.research { background: rgba(37, 99, 235, 0.08); color: var(--p-accent); }
    
    .impact-factor { text-align: right; }
    .if-val { display: block; font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: var(--p-accent); line-height: 1; }
    .if-label { font-size: 0.65rem; font-weight: 800; color: var(--p-text-muted); letter-spacing: 0.2em; }

    .research-title { 
      font-family: var(--font-display);
      font-size: 1.8rem; font-weight: 800; color: var(--p-text); 
      line-height: 1.2; margin-bottom: 1.5rem;
      letter-spacing: -0.02em;
    }
    
    .synopsis-snippet {
      font-size: 1rem; color: var(--p-text-muted); line-height: 1.7; margin-bottom: 3rem;
      font-weight: 500; opacity: 0.9;
    }

    .authors-list { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: auto; padding-bottom: 2.5rem; }
    .author-tag { 
      font-size: 0.75rem; font-weight: 700; color: var(--p-text); 
      background: rgba(15, 23, 42, 0.03); padding: 0.5rem 1rem; border-radius: 10px;
      border: 1px solid var(--p-glass-border);
    }

    .card-footer { 
      display: flex; justify-content: space-between; align-items: flex-end; 
      padding-top: 2rem; border-top: 1px solid var(--p-glass-border);
    }
    .pub-info { display: flex; flex-direction: column; gap: 0.25rem; }
    .pub-type { font-size: 0.65rem; font-weight: 800; color: var(--p-accent); letter-spacing: 0.15em; text-transform: uppercase; }
    .pub-name { font-weight: 700; color: var(--p-text-muted); font-size: 0.85rem; }

    .res-link {
      width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center;
      background: var(--p-accent); color: #ffffff; transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
      box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
    }
    .res-link:hover { transform: scale(1.1) rotate(5deg); background: var(--p-text); color: white; }
    .pending-tag { font-size: 0.7rem; font-weight: 800; color: var(--p-text-muted); font-style: italic; background: rgba(15, 23, 42, 0.05); padding: 0.5rem 1rem; border-radius: 8px; }

    @media (max-width: 1100px) {
      .featured-grid { grid-template-columns: 1fr; }
      .section-title h2 { font-size: 2.5rem; }
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
