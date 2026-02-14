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
              <p class="item-pub">{{ item.publication?.name || '---' }}</p>
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
    .section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2.5rem; }
    .section-icon { font-size: 2rem; }
    .section-header h2 { font-size: 1.75rem; font-weight: 900; color: #4338ca; letter-spacing: -0.02em; }

    /* TIMELINE */
    .timeline-container { position: relative; padding-left: 2rem; }
    .timeline-container::before {
      content: ''; position: absolute; left: 1.5rem; top: 0; bottom: 0; width: 2px;
      background: linear-gradient(to bottom, #4338ca, #e2e8f0);
    }
    .timeline-item { display: flex; gap: 3rem; margin-bottom: 3rem; position: relative; }
    .item-year { width: 80px; text-align: right; position: relative; padding-top: 1.25rem; }
    .year-text { font-size: 1.125rem; font-weight: 900; color: #4338ca; opacity: 0.7; }
    .item-node {
      width: 14px; height: 14px; background: white; border: 3px solid #4338ca;
      border-radius: 50%; position: absolute; left: -1.05rem; top: 1.5rem; z-index: 5;
    }
    .item-card {
      flex: 1; background: white; padding: 1.5rem 2rem; border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.02); border: 1px solid #f1f5f9;
      transition: all 0.3s ease;
    }
    .item-card:hover { border-color: #4338ca; transform: translateX(8px); }
    .item-meta { font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.50rem; display: flex; align-items: center; gap: 0.5rem; }
    .status-indicator { width: 6px; height: 6px; border-radius: 50%; }
    .status-indicator.published { background: #10b981; box-shadow: 0 0 8px #10b981; }
    .status-indicator.accepted { background: #3b82f6; box-shadow: 0 0 8px #3b82f6; }
    .item-title { font-size: 1.125rem; font-weight: 700; color: #1e293b; margin-bottom: 0.25rem; }
    .item-pub { font-size: 0.875rem; color: #64748b; font-weight: 500; }

    .empty-state { text-align: center; padding: 4rem; background: white; border-radius: 20px; border: 2px dashed #e2e8f0; }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }

    .slide-up { animation: slideUp 0.6s ease-out both; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class PortfolioTimelineComponent {
  @Input() items: Research[] = [];
}
