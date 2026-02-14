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
      background: radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%);
      padding: 8rem 0 10rem; color: white;
      text-align: center; position: relative;
      overflow: hidden;
    }
    .hero-section::before {
      content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2394a3b8' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      opacity: 0.5;
    }
    .hero-content { position: relative; z-index: 1; }
    .profile-badge {
      display: inline-block; padding: 0.5rem 1.5rem; background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 2px;
      font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; margin-bottom: 2rem;
      color: var(--p-gold); text-transform: uppercase; font-family: var(--font-body);
    }
    .hero-section h1 { 
      font-family: var(--font-heading);
      font-size: 4.5rem; font-weight: 700; letter-spacing: -0.02em; 
      margin-bottom: 1.5rem; line-height: 1.1;
      background: linear-gradient(to bottom, #fff, #94a3b8);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .hero-subtext { 
      font-family: var(--font-body);
      font-size: 1.15rem; color: var(--p-muted); 
      max-width: 600px; margin: 0 auto 5rem; line-height: 1.7; font-weight: 300;
    }

    /* STATS RIBBON */
    .stats-ribbon {
      display: inline-flex; align-items: center; gap: 4rem;
      background: rgba(15, 23, 42, 0.6); padding: 1.5rem 4rem;
      border: 1px solid rgba(255,255,255,0.05); border-radius: 0;
      backdrop-filter: blur(12px); 
      box-shadow: 0 0 0 1px rgba(255,255,255,0.02), 0 20px 40px rgba(0,0,0,0.4);
    }
    .stat-item { display: flex; flex-direction: column; align-items: center; }
    .stat-val { 
      font-family: var(--font-heading);
      font-size: 2.5rem; font-weight: 700; color: white; line-height: 1; margin-bottom: 0.5rem; 
    }
    .stat-label { 
      font-family: var(--font-body);
      font-size: 0.7rem; font-weight: 600; color: var(--p-gold); 
      text-transform: uppercase; letter-spacing: 0.1em; 
    }
    .stat-sep { width: 1px; height: 50px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent); }
  `]
})
export class PortfolioHeroComponent {
  @Input() itemCount: number = 0;
  @Input() q1Count: number = 0;
  @Input() publishedCount: number = 0;
  @Output() onBack = new EventEmitter<void>();
}
