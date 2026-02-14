import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Research } from '../../../services/research.service';

@Component({
  selector: 'app-analytics-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="reveal">
      <div class="stat-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
        <!-- PAPER TYPES -->
        <div class="p-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h3 style="font-family: var(--font-display); font-size: 1.15rem;">Distribution by Type</h3>
            <span class="p-badge" style="background: var(--p-bg-alt);">{{ totalCount }} Total</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            @for (entry of typeDist | keyvalue; track entry.key) {
              <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                  <span>{{ entry.key }}</span>
                  <span style="color: var(--p-accent);">{{ entry.value }}</span>
                </div>
                <div class="p-progress-wrap">
                  <div class="p-progress-fill" [style.width.%]="(+(entry.value || 0)) / totalCount * 100"></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- AUTHOR POSITION -->
        <div class="p-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h3 style="font-family: var(--font-display); font-size: 1.15rem;">Author Ownership</h3>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            @for (entry of positionDist | keyvalue; track entry.key) {
              <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                  <span>{{ getOrdinalLabel(+entry.key) + ' Author' }}</span>
                  <span style="color: #6366f1;">{{ entry.value }}</span>
                </div>
                <div class="p-progress-wrap">
                  <div class="p-progress-fill" [style.width.%]="(+(entry.value || 0)) / totalCount * 100" style="background: #6366f1;"></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- STATUS DISTRIBUTION -->
        <div class="p-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h3 style="font-family: var(--font-display); font-size: 1.15rem;">Current Pipeline</h3>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            @for (entry of statusDist | keyvalue; track entry.key) {
              <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                  <span>{{ entry.key | titlecase }}</span>
                  <span style="color: #10b981;">{{ entry.value }}</span>
                </div>
                <div class="p-progress-wrap">
                  <div class="p-progress-fill" [style.width.%]="(+(entry.value || 0)) / totalCount * 100" style="background: #10b981;"></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- JOURNAL QUARTILE -->
        <div class="p-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h3 style="font-family: var(--font-display); font-size: 1.15rem;">Impact Highlights</h3>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            @for (entry of quartileDist | keyvalue; track entry.key) {
              <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                  <span>{{ entry.key }}</span>
                  <span style="color: #f59e0b;">{{ entry.value }}</span>
                </div>
                <div class="p-progress-wrap">
                  <div class="p-progress-fill" [style.width.%]="(+(entry.value || 0)) / totalCount * 100" style="background: #f59e0b;"></div>
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
  `]
})
export class AnalyticsTabComponent {
  @Input() totalCount: number = 0;
  @Input() typeDist: Record<string, number> = {};
  @Input() positionDist: Record<string, number> = {};
  @Input() statusDist: Record<string, number> = {};
  @Input() quartileDist: Record<string, number> = {};

  getOrdinalLabel(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    const suffix = (s[(v - 20) % 10] || s[v] || s[0]);
    return `${n}${suffix}`;
  }
}
