import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Research } from '../../../services/research.service';

@Component({
  selector: 'app-portfolio-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="timeline-section">
      <div class="section-header">
        <span class="section-icon">📚</span>
        <h2>Research Archive</h2>
      </div>

      <div class="timeline-container">
        @for (item of items; track item.id) {
          <div class="timeline-item slide-up">
            <div class="item-year">
              <span class="year-line"></span>
              <span class="year-text">{{ item.publication?.year || '2024' }}</span>
            </div>
            <div class="item-node"></div>
            <div class="item-card">
              <div class="item-meta">
                <span class="status-indicator" [class]="item.status.toLowerCase()"></span>
                {{ item.status }} • {{ item.publication?.type || 'ARTICLE' }}
              </div>
              <h4 class="item-title">{{ item.title }}</h4>
              <p class="item-pub">{{ formatPublisher(item.publication?.name || '---') }}</p>
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            <div class="empty-icon">📂</div>
            <p>No public research items found in the archive yet.</p>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    :host { display: contents; }
    /* TIMELINE */
    .timeline-section { position: relative; padding-bottom: 4rem; }
    .section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 3rem; }
    .section-icon { font-size: 1.5rem; color: var(--p-gold); }
    .section-header h2 { 
      font-family: var(--font-heading);
      font-size: 2rem; font-weight: 700; color: var(--p-text); letter-spacing: -0.02em; 
    }

    .timeline-container { position: relative; padding-left: 2rem; }
    .timeline-container::before {
      content: ''; position: absolute; left: 1.5rem; top: 0; bottom: 0; width: 1px;
      background: linear-gradient(to bottom, var(--p-gold), #1e293b);
    }
    .timeline-item { display: flex; gap: 3rem; margin-bottom: 4rem; position: relative; }
    .item-year { width: 80px; text-align: right; position: relative; padding-top: 1.25rem; }
    .year-text { 
      font-family: var(--font-heading);
      font-size: 1.5rem; font-weight: 700; color: var(--p-gold); opacity: 0.8; 
    }
    .year-line {
      position: absolute; right: -2rem; top: 1.5rem; width: 20px; height: 1px;
      background: var(--p-gold); opacity: 0.5;
    }
    .item-node {
      width: 12px; height: 12px; background: var(--p-bg); border: 2px solid var(--p-gold);
      border-radius: 50%; position: absolute; left: -1rem; top: 1.85rem; z-index: 5;
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2);
    }
    .item-card {
      flex: 1; background: var(--p-surface); padding: 2rem; border-radius: 2px;
      border: 1px solid rgba(255,255,255,0.05);
      transition: all 0.3s ease;
    }
    .item-card:hover { 
      border-color: var(--p-gold); transform: translateX(8px); 
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .item-meta { 
      font-size: 0.7rem; font-weight: 600; color: var(--p-muted); 
      text-transform: uppercase; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.75rem; letter-spacing: 0.1em;
    }
    .status-indicator { width: 6px; height: 6px; border-radius: 50%; }
    .status-indicator.published { background: #10b981; box-shadow: 0 0 8px #10b981; }
    .status-indicator.accepted { background: #3b82f6; box-shadow: 0 0 8px #3b82f6; }
    
    .item-title { 
      font-family: var(--font-heading);
      font-size: 1.25rem; font-weight: 700; color: var(--p-text); 
      margin-bottom: 0.5rem; line-height: 1.4;
    }
    .item-pub { font-size: 0.9rem; color: var(--p-muted); font-weight: 400; font-family: var(--font-body); }

    .empty-state { text-align: center; padding: 4rem; background: rgba(255,255,255,0.02); border-radius: 20px; border: 1px dashed rgba(255,255,255,0.1); }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }

    .slide-up { animation: slideUp 0.6s ease-out both; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class PortfolioTimelineComponent {
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
