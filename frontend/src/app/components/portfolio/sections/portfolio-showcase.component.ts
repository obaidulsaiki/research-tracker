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
                <span class="type-pill">{{ item.publication?.type || 'ARTICLE' }}</span>
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
                <span class="pub-name">{{ item.publication?.name || '---' }}</span>
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
    .section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2.5rem; }
    .section-icon { font-size: 2rem; }
    .section-header h2 { font-size: 1.75rem; font-weight: 900; color: #4338ca; letter-spacing: -0.02em; }

    .gems-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(440px, 1fr)); gap: 2rem; margin-bottom: 8rem; }
    .gem-card {
      position: relative; background: white; padding: 2.5rem; border-radius: 24px;
      border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 10px 30px rgba(0,0,0,0.03);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: default;
    }
    .gem-card:hover { transform: translateY(-8px); box-shadow: 0 30px 60px rgba(0,0,0,0.08); border-color: #4338ca; }
    .gem-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .type-pill { 
      padding: 0.35rem 0.85rem; background: #f1f5f9; color: #64748b; 
      font-size: 0.7rem; font-weight: 800; border-radius: 100px; text-transform: uppercase;
    }
    .q-badge { 
      padding: 0.35rem 0.85rem; border-radius: 100px; font-size: 0.75rem; font-weight: 900;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .q-badge.q1 { background: linear-gradient(135deg, #fbbf24, #d97706); color: white; }
    .q-badge.q2 { background: linear-gradient(135deg, #94a3b8, #475569); color: white; }
    .q-badge.q3 { background: linear-gradient(135deg, #10b981, #047857); color: white; }
    .q-badge.q4 { background: linear-gradient(135deg, #f43f5e, #be123c); color: white; }
    .q-badge.non-predatory { background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; }
    .q-badge.non-indexed { background: linear-gradient(135deg, #64748b, #334155); color: white; }
    .gem-title { font-size: 1.35rem; font-weight: 800; color: #1e293b; line-height: 1.4; margin-bottom: 1.5rem; }
    .gem-authors { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; }
    .author-tag { font-size: 0.875rem; font-weight: 600; color: #64748b; }
    .gem-footer { 
      display: flex; justify-content: space-between; align-items: center; 
      padding-top: 1.5rem; border-top: 1px solid #f1f5f9;
    }
    .pub-name { font-weight: 700; color: #4338ca; font-size: 0.9375rem; }
    .pub-year { font-weight: 800; color: #94a3b8; font-family: monospace; }

    .slide-up { animation: slideUp 0.6s ease-out both; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class PortfolioShowcaseComponent {
  @Input() items: Research[] = [];
}
