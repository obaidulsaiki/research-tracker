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
        <button class="btn-back-hero" (click)="onBack.emit()">
          <span class="back-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </span> 
          Return to Dashboard
        </button>
        <div class="nav-brand">Research <b>Tracker</b> <span class="brand-dot"></span></div>
      </div>
    </nav>

    <!-- HERO HEADER -->
    <section class="hero-section">
      <div class="bg-grid"></div>
      <div class="bg-glow"></div>
      
      <div class="container">
        <div class="hero-content">
          <div class="profile-meta animate-reveal" style="animation-delay: 0.1s">
            <div class="profile-badge">ACADEMIC PROFILE</div>
            <div class="availability-tag">
              <span class="pulse-dot"></span> Open for Collaboration
            </div>
          </div>

          <h1 class="animate-reveal" style="animation-delay: 0.2s">Research Insights <span>&</span> Contributions</h1>
          <p class="hero-subtext animate-reveal" style="animation-delay: 0.3s">
            Exploring the frontiers of technology and science. 
            Documenting a journey of academic excellence through published breakthroughs and milestones.
          </p>
          
          <div class="specialization-cloud animate-reveal" style="animation-delay: 0.4s">
            <span class="tag">Machine Learning</span>
            <span class="tag">Distributed Systems</span>
            <span class="tag">Cyber Security</span>
            <span class="tag">Data Privacy</span>
            <span class="tag">Cloud Architecture</span>
          </div>

          <div class="stats-ribbon animate-reveal" style="animation-delay: 0.5s">
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
      
      <div class="scroll-indicator">
        <div class="mouse"></div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: contents; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }

    /* NAVIGATION */
    .public-nav {
      position: sticky; top: 0; z-index: 1000;
      background: var(--p-surface-glass);
      backdrop-filter: var(--p-glass);
      border-bottom: 1px solid var(--p-border);
      padding: 1.25rem 0;
    }
    .nav-wrap { display: flex; justify-content: space-between; align-items: center; }
    .btn-back-hero {
      background: var(--p-accent); border: 1px solid var(--p-accent); 
      font-weight: 700; color: white;
      padding: 0.6rem 1.4rem; border-radius: 12px;
      cursor: pointer; display: flex; align-items: center; gap: 0.75rem;
      font-size: 0.8rem; transition: all 0.3s ease;
      font-family: var(--font-main);
      box-shadow: 0 4px 12px var(--p-accent-glow);
    }
    .btn-back-hero:hover { 
      background: var(--p-accent-deep); border-color: var(--p-accent-deep);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px var(--p-accent-glow);
    }
    .nav-brand { 
      font-weight: 800; font-size: 1.1rem; color: var(--p-text); 
      display: flex; align-items: center; gap: 0.5rem; letter-spacing: -0.5px;
    }
    .brand-dot { width: 6px; height: 6px; background: var(--p-accent); border-radius: 50%; }

    /* HERO SECTION */
    .hero-section {
      background: var(--p-bg);
      padding: 6rem 0 8rem; color: var(--p-text);
      text-align: center; position: relative;
      overflow: hidden;
    }
    
    .bg-grid {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    .bg-glow {
      position: absolute; top: -20%; right: -10%; width: 60%; height: 80%;
      background: radial-gradient(circle, var(--p-accent-glow) 0%, transparent 70%);
      filter: blur(80px);
    }

    .hero-content { position: relative; z-index: 1; }
    
    .profile-meta { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-bottom: 2.5rem; }
    .profile-badge {
      display: inline-block; padding: 0.5rem 1.25rem; background: var(--p-gradient-soft);
      border: 1px solid var(--p-accent-glow); border-radius: 50px;
      font-size: 0.65rem; font-weight: 800; letter-spacing: 0.15em;
      color: var(--p-accent); text-transform: uppercase; font-family: var(--font-display);
    }
    .availability-tag {
      font-size: 0.75rem; font-weight: 600; color: var(--p-success);
      display: flex; align-items: center; gap: 0.5rem;
    }
    .pulse-dot {
      width: 8px; height: 8px; background: var(--p-success); border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .hero-section h1 { 
      font-family: var(--font-display);
      font-size: 4.5rem; font-weight: 800; letter-spacing: -0.04em; 
      margin-bottom: 1.5rem; line-height: 1;
      color: var(--p-text);
    }
    .hero-section h1 span { 
      color: var(--p-accent); 
      font-weight: 400; font-style: italic; font-size: 4rem;
    }
    
    .hero-subtext { 
      font-family: var(--font-main);
      font-size: 1.25rem; color: var(--p-text-muted); 
      max-width: 650px; margin: 0 auto 3.5rem; line-height: 1.6; font-weight: 400;
    }

    .specialization-cloud { display: flex; justify-content: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 2rem; }
    .tag {
      padding: 0.5rem 1rem; background: var(--p-bg-subtle); 
      border: 1px solid var(--p-border); border-radius: 12px;
      font-size: 0.75rem; font-weight: 600; color: var(--p-text-muted);
      transition: all 0.3s ease;
    }
    .tag:hover { background: var(--p-text); color: white; border-color: var(--p-text); transform: translateY(-3px); }

    /* STATS RIBBON */
    .stats-ribbon {
      display: inline-flex; align-items: center; gap: 4rem;
      background: var(--p-surface-glass); padding: 1.25rem 4rem;
      border: 1px solid var(--p-border); border-radius: 20px;
      backdrop-filter: var(--p-glass); 
      box-shadow: var(--p-shadow-lg);
    }
    .stat-item { display: flex; flex-direction: column; align-items: center; }
    .stat-val { 
      font-family: var(--font-display);
      font-size: 2.25rem; font-weight: 800; color: var(--p-text); line-height: 1; margin-bottom: 0.5rem; 
      background: var(--p-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .stat-label { 
      font-family: var(--font-main);
      font-size: 0.65rem; font-weight: 700; color: var(--p-text-muted); 
      text-transform: uppercase; letter-spacing: 0.15em; 
    }
    .stat-sep { width: 1px; height: 40px; background: var(--p-border); }

    .scroll-indicator {
      position: absolute; bottom: 3rem; left: 50%; transform: translateX(-50%);
      opacity: 0.5;
    }
    .mouse {
      width: 24px; height: 40px; border: 2px solid var(--p-text); border-radius: 20px;
      position: relative;
    }
    .mouse::before {
      content: ''; position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
      width: 4px; height: 8px; background: var(--p-text); border-radius: 2px;
      animation: mouseScroll 2s infinite;
    }
    @keyframes mouseScroll {
      0% { opacity: 1; transform: translate(-50%, 0); }
      100% { opacity: 0; transform: translate(-50%, 15px); }
    }

    @media (max-width: 768px) {
      .hero-section h1 { font-size: 3rem; }
      .hero-section h1 span { font-size: 2.5rem; }
      .stats-ribbon { gap: 1.5rem; padding: 1.25rem 2rem; flex-wrap: wrap; justify-content: center; }
      .stat-sep { display: none; }
    }
  `]
})
export class PortfolioHeroComponent {
  @Input() itemCount: number = 0;
  @Input() q1Count: number = 0;
  @Input() publishedCount: number = 0;
  @Output() onBack = new EventEmitter<void>();
}
