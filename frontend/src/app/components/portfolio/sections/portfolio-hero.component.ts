import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-portfolio-hero',
    standalone: true,
    imports: [CommonModule],
    template: `
    <!-- NAVIGATION -->
    <nav class="public-nav">
      <div class="container nav-wrap">
        <button class="btn-back" (click)="onBack.emit()">
          <span class="back-arrow">←</span> Dashboard
        </button>
        <div class="nav-brand">Res<b>Track</b></div>
      </div>
    </nav>

    <!-- HERO HEADER -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="profile-badge">RESEARCHER PORTFOLIO</div>
          <h1>Academic Contributions</h1>
          <p class="hero-subtext">A comprehensive archive of scientific publications, research breakthroughs, and academic milestones.</p>
          
          <div class="stats-ribbon">
            <div class="stat-item">
              <span class="stat-val">{{ itemCount }}</span>
              <span class="stat-label">Total Works</span>
            </div>
            <div class="stat-sep"></div>
            <div class="stat-item">
              <span class="stat-val">{{ q1Count }}</span>
              <span class="stat-label">Q1 Journals</span>
            </div>
            <div class="stat-sep"></div>
            <div class="stat-item">
              <span class="stat-val">{{ publishedCount }}</span>
              <span class="stat-label">Published</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
    styles: [`
    :host { display: contents; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 2rem; }

    /* NAVIGATION */
    .public-nav {
      position: sticky; top: 0; z-index: 1000;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      padding: 1rem 0;
    }
    .nav-wrap { display: flex; justify-content: space-between; align-items: center; }
    .btn-back {
      background: none; border: none; font-weight: 800; color: #4338ca;
      cursor: pointer; display: flex; align-items: center; gap: 0.5rem;
      font-size: 0.875rem; transition: opacity 0.2s;
    }
    .btn-back:hover { opacity: 0.7; }
    .nav-brand { font-weight: 800; font-size: 1rem; color: #1e293b; }

    /* HERO SECTION */
    .hero-section {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
      padding: 8rem 0 10rem; color: white;
      text-align: center; position: relative;
      overflow: hidden;
    }
    .hero-section::before {
      content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: radial-gradient(circle at 20% 30%, rgba(67, 56, 202, 0.4) 0%, transparent 50%),
                  radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.2) 0%, transparent 50%);
    }
    .hero-content { position: relative; z-index: 1; }
    .profile-badge {
      display: inline-block; padding: 0.5rem 1.25rem; background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2); border-radius: 100px;
      font-size: 0.75rem; font-weight: 800; letter-spacing: 0.1em; margin-bottom: 2rem;
      backdrop-filter: blur(4px);
    }
    .hero-section h1 { font-size: 4rem; font-weight: 900; letter-spacing: -0.04em; margin-bottom: 1.5rem; line-height: 1; }
    .hero-subtext { font-size: 1.25rem; color: rgba(255,255,255,0.7); max-width: 600px; margin: 0 auto 4rem; line-height: 1.6; }

    /* STATS RIBBON */
    .stats-ribbon {
      display: inline-flex; align-items: center; gap: 3rem;
      background: rgba(255,255,255,0.05); padding: 1.5rem 3rem;
      border: 1px solid rgba(255,255,255,0.1); border-radius: 20px;
      backdrop-filter: blur(12px); box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    .stat-item { display: flex; flex-direction: column; align-items: center; }
    .stat-val { font-size: 2rem; font-weight: 900; color: white; line-height: 1; margin-bottom: 0.25rem; }
    .stat-label { font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.05em; }
    .stat-sep { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }
  `]
})
export class PortfolioHeroComponent {
    @Input() itemCount: number = 0;
    @Input() q1Count: number = 0;
    @Input() publishedCount: number = 0;
    @Output() onBack = new EventEmitter<void>();
}
