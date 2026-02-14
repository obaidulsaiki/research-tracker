import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authors-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="reveal">
      <div class="p-card" style="margin-bottom: 2.5rem; display: flex; align-items: center; gap: 2rem;">
        <div class="brand-icon" style="flex-shrink: 0;">🌐</div>
        <div>
          <h2 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.25rem;">Research Network</h2>
          <p style="color: var(--p-text-muted); font-size: 0.95rem;">You have collaborated with <b>{{ coAuthors.length }}</b> unique researchers across all projects.</p>
        </div>
      </div>

      <div class="stat-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
        @for (author of coAuthors; track author.name) {
          <div class="p-card" style="display: flex; gap: 1.25rem; align-items: center; padding: 1.25rem;">
            <div class="p-avatar">{{ author.name.charAt(0) }}</div>
            <div style="flex: 1;">
              <div style="font-weight: 700; font-size: 1rem; color: var(--p-text);">{{ author.name }}</div>
              <div style="font-size: 0.85rem; color: var(--p-text-muted); font-weight: 600;">
                {{ author.count }} {{ author.count === 1 ? 'Collaboration' : 'Collaborations' }}
              </div>
            </div>
            <div class="p-badge" style="background: var(--p-bg-alt); color: var(--p-accent);">VIEW</div>
          </div>
        } @empty {
          <div style="grid-column: 1 / -1; text-align: center; padding: 5rem;">
            <div style="font-size: 3rem; margin-bottom: 1.5rem;">🤝</div>
            <p style="color: var(--p-text-muted); font-weight: 600;">No co-authors found in your records yet.</p>
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
