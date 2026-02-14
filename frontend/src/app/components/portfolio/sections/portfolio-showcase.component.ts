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
        <div class="section-header">
          <span class="section-icon">💎</span>
          <h2>Key Publications</h2>
        </div>
        
        <div class="gems-grid">
          @for (item of items; track item.id) {
            <div class="gem-card slide-up">
              <div class="card-glass"></div>
              <div class="gem-header">
                <span class="type-pill">{{ formatPublisher(item.publication?.type || 'ARTICLE') }}</span>
                @if (item.publication?.quartile && item.publication!.quartile !== 'N/A') {
                  <span class="q-badge" [class]="item.publication!.quartile.toLowerCase().replace(' ', '-')">
                    {{ item.publication!.quartile }}
                  </span>
                }
                @if (item.publication?.impactFactor && +item.publication!.impactFactor !== 0) {
                   <span class="type-pill" style="background: rgba(37, 99, 235, 0.1); color: var(--p-accent);">IF: {{ item.publication!.impactFactor }}</span>
                }
              </div>
              <h3 class="gem-title">{{ item.title }}</h3>
              <div class="gem-authors">
                @for (author of item.authors; track author.name; let last = $last) {
                  <span class="author-tag">{{ author.name }}{{ !last ? ',' : '' }}</span>
                }
              </div>
              <div class="gem-footer">
                <span class="pub-name">{{ formatPublisher(item.publication?.name || '---') }}</span>
                <span class="pub-year">{{ item.publication?.year || '---' }}</span>
              </div>
            </div>
          }
        </div>
      </section>
    }
  `,
  styles: [`
    :host { display: contents; }
    /* SHOWCASE */
    .section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 3rem; }
    .section-icon { font-size: 1.5rem; color: var(--p-gold); }
    .section-header h2 { 
      font-family: var(--font-heading);
      font-size: 2rem; font-weight: 700; color: var(--p-text); letter-spacing: -0.02em; 
    }

    .gems-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 2rem; margin-bottom: 8rem; }
    .gem-card {
      position: relative; background: var(--p-surface); padding: 2.5rem; 
      border: 1px solid rgba(255,255,255,0.05); border-radius: 2px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: default;
    }
    .gem-card:hover { 
      transform: translateY(-4px); 
      border-color: var(--p-gold); box-shadow: 0 20px 40px rgba(0,0,0,0.2); 
    }
    .gem-card::before {
      content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    }

    .gem-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 2rem; }
    .type-pill { 
      padding: 0.35rem 0.85rem; background: rgba(255,255,255,0.05); color: var(--p-muted); 
      font-size: 0.65rem; font-weight: 600; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.1em;
      border: 1px solid rgba(255,255,255,0.05);
    }
    
    .q-badge { 
      padding: 0.25rem 0.75rem; border-radius: 2px; font-size: 0.7rem; font-weight: 700; 
      color: #0f172a; border: 1px solid rgba(255,255,255,0.1);
    }
    .q-badge.q1 { background: var(--p-gold); }
    .q-badge.q2 { background: #e2e8f0; color: #475569; }
    .q-badge.q3 { background: #94a3b8; color: #0f172a; }
    .q-badge.q4 { background: #475569; color: #cbd5e1; }
    
    .gem-title { 
      font-family: var(--font-heading);
      font-size: 1.5rem; font-weight: 700; color: var(--p-text); 
      line-height: 1.3; margin-bottom: 1.5rem; 
    }
    .gem-authors { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2.5rem; line-height: 1.6; }
    .author-tag { font-family: var(--font-body); font-size: 0.9rem; color: var(--p-muted); }
    
    .gem-footer { 
      display: flex; justify-content: space-between; align-items: center; 
      padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05);
    }
    .pub-name { font-weight: 600; color: var(--p-gold); font-size: 0.85rem; letter-spacing: 0.02em; text-transform: uppercase;}
    .pub-year { font-family: var(--font-heading); font-weight: 700; color: var(--p-muted); opacity: 0.5; }

    .slide-up { animation: slideUp 0.6s ease-out both; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class PortfolioShowcaseComponent {
  @Input() items: Research[] = [];

  formatPublisher(name: string): string {
    if (!name) return '';
    const acronyms = new Set(['ICCIT', 'ICECTE', 'ICEFRONT', 'PECCII', 'QPAIN', 'IEEE', 'ACM', 'SN', 'MDPI', 'IUBAT', 'IF']);

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
