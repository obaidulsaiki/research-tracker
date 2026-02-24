import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../services/analytics.service';
import { ResearchService } from '../../../services/research.service';

@Component({
  selector: 'app-analytics-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="analytics-container animate-reveal">
      <div class="stat-grid">
        <!-- PAPER TYPES -->
        <div class="p-card analytics-card glass-premium">
          <div class="card-header">
            <div class="title-group">
              <span class="header-icon type">🔖</span>
              <h3 class="card-title">Distribution by Type</h3>
            </div>
            <span class="p-badge count-badge">{{ totalCount() }} Total</span>
          </div>
          <div class="analytics-list">
            @for (entry of stats.typeDistribution() | keyvalue; track entry.key) {
              <div class="analytics-item hov-expand">
                <div class="item-meta">
                  <span class="item-label">{{ entry.key }}</span>
                  <span class="item-value accent">{{ entry.value }}</span>
                </div>
                <div class="p-progress-wrap accent-glow">
                  <div class="p-progress-fill variant-accent" [style.width.%]="(+(entry.value || 0)) / totalCount() * 100"></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- AUTHOR POSITION -->
        <div class="p-card analytics-card glass-premium">
          <div class="card-header">
            <div class="title-group">
              <span class="header-icon pos">👑</span>
              <h3 class="card-title">Author Ownership</h3>
            </div>
          </div>
          <div class="analytics-list">
            @for (entry of stats.positionDistribution() | keyvalue; track entry.key) {
              <div class="analytics-item hov-expand">
                <div class="item-meta">
                  <span class="item-label">{{ getOrdinalLabel(+entry.key) + ' Author' }}</span>
                  <span class="item-value indigo">{{ entry.value }}</span>
                </div>
                <div class="p-progress-wrap indigo-glow">
                  <div class="p-progress-fill variant-indigo" [style.width.%]="(+(entry.value || 0)) / totalCount() * 100"></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- STATUS DISTRIBUTION -->
        <div class="p-card analytics-card glass-premium">
          <div class="card-header">
            <div class="title-group">
              <span class="header-icon pipe">⏳</span>
              <h3 class="card-title">Current Pipeline</h3>
            </div>
          </div>
          <div class="analytics-list">
            @for (entry of stats.statusDistribution() | keyvalue; track entry.key) {
              <div class="analytics-item hov-expand">
                <div class="item-meta">
                  <span class="item-label">{{ entry.key | titlecase }}</span>
                  <span class="item-value success">{{ entry.value }}</span>
                </div>
                <div class="p-progress-wrap success-glow">
                  <div class="p-progress-fill variant-success" [style.width.%]="(+(entry.value || 0)) / totalCount() * 100"></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- JOURNAL QUARTILE -->
        <div class="p-card analytics-card glass-premium">
          <div class="card-header">
            <div class="title-group">
              <span class="header-icon impact">⭐</span>
              <h3 class="card-title">Impact Highlights</h3>
            </div>
          </div>
          <div class="analytics-list">
            @for (entry of stats.quartileDistribution() | keyvalue; track entry.key) {
              <div class="analytics-item hov-expand">
                <div class="item-meta">
                  <span class="item-label">{{ entry.key }}</span>
                  <span class="item-value warning">{{ entry.value }}</span>
                </div>
                <div class="p-progress-wrap warning-glow">
                  <div class="p-progress-fill variant-warning" [style.width.%]="(+(entry.value || 0)) / totalCount() * 100"></div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: contents; }
    .analytics-container { padding: 0.5rem 0; }
    .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
    
    .glass-premium {
      background: var(--p-panel);
      backdrop-filter: var(--p-glass);
      border: 1px solid var(--p-border-bright);
      box-shadow: var(--p-shadow-lg);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .glass-premium:hover { transform: translateY(-4px); box-shadow: var(--p-shadow-premium); }

    .analytics-card { padding: 1.25rem; border-radius: 20px; position: relative; overflow: hidden; }
    .analytics-card::before {
      content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%;
      background: var(--p-accent); opacity: 0.1;
    }

    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .title-group { display: flex; align-items: center; gap: 0.6rem; }
    .header-icon { 
      font-size: 1.2rem; width: 32px; height: 32px; 
      display: flex; align-items: center; justify-content: center;
      background: var(--p-bg-subtle); border-radius: 8px;
    }
    .card-title { font-family: var(--font-display); font-size: 1rem; font-weight: 800; color: var(--p-text); letter-spacing: -0.2px; }
    .count-badge { background: var(--p-accent-glow); color: var(--p-accent); padding: 0.25rem 0.6rem; font-size: 0.65rem; border-radius: 6px; }

    .analytics-list { display: flex; flex-direction: column; gap: 1rem; }
    .analytics-item { display: flex; flex-direction: column; gap: 0.4rem; padding: 0.25rem 0; }
    .hov-expand { transition: transform 0.2s ease; }
    .hov-expand:hover { transform: translateX(4px); }

    .item-meta { display: flex; justify-content: space-between; align-items: baseline; }
    .item-label { font-size: 0.75rem; font-weight: 700; color: var(--p-text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
    .item-value { font-size: 0.9rem; font-weight: 900; font-family: var(--font-display); }
    
    .item-value.accent { color: var(--p-accent); }
    .item-value.indigo { color: #6366f1; }
    .item-value.success { color: var(--p-success); }
    .item-value.warning { color: var(--p-warning); }

    .p-progress-wrap { height: 8px; background: var(--p-bg-subtle); border-radius: 10px; overflow: hidden; position: relative; }
    .p-progress-fill { height: 100%; border-radius: 10px; transition: width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
    
    /* VARIANT GRADIENTS */
    .variant-accent { background: linear-gradient(90deg, #3b82f6, #2563eb); }
    .variant-indigo { background: linear-gradient(90deg, #818cf8, #6366f1); }
    .variant-success { background: linear-gradient(90deg, #34d399, #10b981); }
    .variant-warning { background: linear-gradient(90deg, #fbbf24, #f59e0b); }

    /* GLOW EFFECTS */
    .accent-glow { box-shadow: 0 0 10px rgba(37, 99, 235, 0.1); }
    .indigo-glow { box-shadow: 0 0 10px rgba(99, 102, 241, 0.1); }
    .success-glow { box-shadow: 0 0 10px rgba(16, 185, 129, 0.1); }
    .warning-glow { box-shadow: 0 0 10px rgba(245, 158, 11, 0.1); }
  `]
})
export class AnalyticsTabComponent {
  private analyticsService = inject(AnalyticsService);
  private researchService = inject(ResearchService);

  public stats = this.analyticsService.getStatDistributions(this.researchService.researchItems);
  public totalCount = computed(() => this.researchService.researchItems().length);

  getOrdinalLabel(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    const suffix = (s[(v - 20) % 10] || s[v] || s[0]);
    return `${n}${suffix}`;
  }
}
