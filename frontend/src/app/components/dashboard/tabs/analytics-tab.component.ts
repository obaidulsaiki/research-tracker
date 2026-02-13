import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Research } from '../../../services/research.service';

@Component({
    selector: 'app-analytics-tab',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="view-tab animate-fade-in">
      <div class="analytics-grid">
        <!-- PAPER TYPES -->
        <div class="data-card analytics-card">
          <div class="card-header">
            <h3>Types of Paper</h3>
            <span class="badge-count">{{ totalCount }} Total</span>
          </div>
          <div class="analytics-content">
            @for (entry of typeDist | keyvalue; track entry.key) {
              <div class="dist-row">
                <div class="dist-info">
                  <span class="dist-name">{{ entry.key }}</span>
                  <span class="dist-val">{{ entry.value }}</span>
                </div>
                <div class="dist-progress">
                  <div class="fill" [style.width.%]="(+(entry.value || 0)) / totalCount * 100"></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- AUTHOR POSITION -->
        <div class="data-card analytics-card">
          <div class="card-header">
            <h3>Author Position</h3>
          </div>
          <div class="analytics-content">
            @for (entry of positionDist | keyvalue; track entry.key) {
              <div class="dist-row">
                <div class="dist-info">
                  <span class="dist-name">{{ entry.key }}</span>
                  <span class="dist-val">{{ entry.value }}</span>
                </div>
                <div class="dist-progress">
                  <div class="fill" [style.width.%]="(+(entry.value || 0)) / totalCount * 100" style="background: var(--accent-secondary)"></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- STATUS DISTRIBUTION -->
        <div class="data-card analytics-card">
          <div class="card-header">
            <h3>Status Distribution</h3>
          </div>
          <div class="analytics-content">
            @for (entry of statusDist | keyvalue; track entry.key) {
              <div class="dist-row">
                <div class="dist-info">
                  <span class="dist-name">{{ entry.key | titlecase }}</span>
                  <span class="dist-val">{{ entry.value }}</span>
                </div>
                <div class="dist-progress">
                  <div class="fill" [style.width.%]="(+(entry.value || 0)) / totalCount * 100" style="background: #10b981"></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- JOURNAL QUARTILE -->
        <div class="data-card analytics-card">
          <div class="card-header">
            <h3>Journal Quartiles</h3>
          </div>
          <div class="analytics-content">
            @for (entry of quartileDist | keyvalue; track entry.key) {
              <div class="dist-row">
                <div class="dist-info">
                  <span class="dist-name">{{ entry.key }}</span>
                  <span class="dist-val">{{ entry.value }}</span>
                </div>
                <div class="dist-progress">
                  <div class="fill" [style.width.%]="(+(entry.value || 0)) / totalCount * 100" style="background: #f59e0b"></div>
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
}
