import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-authors-tab',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="view-tab animate-fade-in">
      <div class="data-card monitor-box" style="margin-bottom: 2rem; max-width: 400px;">
        <div class="card-header">
          <h3>Network Insights</h3>
        </div>
        <div class="monitor-content">
          <div class="monitor-row">
            <span class="m-label">Total Collaborators</span>
            <span class="m-val">{{ coAuthors.length }}</span>
          </div>
        </div>
      </div>

      <div class="stat-dense-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
        @for (author of coAuthors; track author.name) {
          <div class="data-card author-stat-card slide-up">
            <div class="author-avatar">{{ author.name.charAt(0) }}</div>
            <div class="author-info">
              <h4 class="author-name">{{ author.name }}</h4>
              <div class="author-metrics">
                <span class="metric-pill"><b>{{ author.count }}</b> {{ author.count === 1 ? 'Paper' : 'Papers' }}</span>
              </div>
            </div>
          </div>
        } @empty {
          <div class="empty-state" style="grid-column: 1 / -1; padding: 4rem;">
            No co-authors found in your records yet.
          </div>
        }
      </div>
    </section>
  `,
    styles: [`
    :host { display: contents; }
  `]
})
export class AuthorsTabComponent {
    @Input() coAuthors: any[] = [];
}
