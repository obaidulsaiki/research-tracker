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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </span> 
          System Dashboard
        </button>
        <div class="nav-brand">
          <span class="brand-text">RESEARCH <b>TRACKER</b></span>
        </div>
      </div>
    </nav>

    <!-- HERO HEADER -->
    <section class="hero-section">
      <div class="mesh-gradient"></div>
      <div class="glass-overlay"></div>
      
      <div class="container hero-container">
        <div class="hero-content">
          <div class="profile-meta animate-reveal" style="animation-delay: 0.1s">
            <div class="profile-badge">PRINCIPAL INVESTIGATOR</div>
            <div class="availability-tag">
              <span class="pulse-dot"></span> Available for Research Engineering
            </div>
          </div>

          <h1 class="animate-reveal" style="animation-delay: 0.2s">
            Unveiling Digital <span>Frontiers</span>
          </h1>
          
          <div class="specialization-cloud animate-reveal" style="animation-delay: 0.4s">
            <span class="tag">AI/ML Engineering</span>
            <span class="tag">System Architecture</span>
            <span class="tag">Information Security</span>
            <span class="tag">Edge Computing</span>
            <span class="tag">Neural Networks</span>
          </div>

          <div class="stats-ribbon animate-reveal" style="animation-delay: 0.5s">
            <div class="stat-inner">
              <div class="stat-item">
                <span class="stat-val">{{ itemCount }}</span>
                <span class="stat-label">Total Archival Works</span>
              </div>
              <div class="stat-sep"></div>
              <div class="stat-item">
                <span class="stat-val">{{ q1Count }}</span>
                <span class="stat-label">Q1 Publications</span>
              </div>
              <div class="stat-sep"></div>
              <div class="stat-item">
                <span class="stat-val">{{ publishedCount }}</span>
                <span class="stat-label">Works Published</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="scroll-indicator">
        <div class="mouse-wrap">
          <div class="mouse"></div>
        </div>
        <span class="scroll-text">EXPLORE ARCHIVE</span>
      </div>
    </section>
  `,
  styles: [`
    :host { display: contents; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 2.5rem; }

    /* NAVIGATION */
    .public-nav {
      position: sticky; top: 0; z-index: 1000;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(24px);
      border-bottom: 1px solid var(--p-glass-border);
      padding: 1rem 0;
    }
    .nav-wrap { display: flex; justify-content: space-between; align-items: center; }
    .btn-back-hero {
      background: #ffffff; border: 1px solid var(--p-glass-border); 
      font-weight: 700; color: var(--p-text);
      padding: 0.75rem 1.5rem; border-radius: 14px;
      cursor: pointer; display: flex; align-items: center; gap: 0.75rem;
      font-size: 0.75rem; transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
      font-family: var(--font-body);
      text-transform: uppercase; letter-spacing: 0.05em;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
    }
    .btn-back-hero:hover { 
      background: var(--p-accent); border-color: var(--p-accent);
      transform: translateX(-5px);
      box-shadow: 0 10px 30px rgba(37, 99, 235, 0.2);
      color: white;
    }
    .nav-brand { display: flex; flex-direction: column; align-items: flex-end; }
    .brand-text { font-weight: 800; font-size: 1rem; color: var(--p-text); letter-spacing: 0.1em; }
    .brand-version { font-size: 0.6rem; font-weight: 800; color: var(--p-accent); margin-top: -2px; }

    /* HERO SECTION */
    .hero-section {
      padding: 8rem 0 12rem; color: var(--p-text);
      text-align: center; position: relative;
      overflow: hidden;
      display: flex; align-items: center;
      background: #ffffff;
    }
    
    .mesh-gradient {
      position: absolute; top: -20%; left: -10%; width: 120%; height: 140%;
      background: 
        radial-gradient(circle at 20% 30%, rgba(37, 99, 235, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(124, 58, 237, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 10% 80%, rgba(217, 119, 6, 0.03) 0%, transparent 30%);
      filter: blur(120px);
      z-index: 0;
    }
    .glass-overlay {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: radial-gradient(circle at 50% 50%, transparent 0%, rgba(248, 250, 252, 0.4) 100%);
      z-index: 1;
    }

    .hero-container { position: relative; z-index: 10; }
    .hero-content { max-width: 900px; margin: 0 auto; }
    
    .profile-meta { display: flex; align-items: center; justify-content: center; gap: 2rem; margin-bottom: 3rem; }
    .profile-badge {
      display: inline-block; padding: 0.6rem 1.5rem; 
      background: rgba(37, 99, 235, 0.05);
      border: 1px solid rgba(37, 99, 235, 0.1); border-radius: 50px;
      font-size: 0.7rem; font-weight: 800; letter-spacing: 0.2em;
      color: var(--p-accent); text-transform: uppercase; font-family: var(--font-display);
    }
    .availability-tag {
      font-size: 0.8rem; font-weight: 700; color: #059669;
      display: flex; align-items: center; gap: 0.6rem;
    }
    .pulse-dot {
      width: 10px; height: 10px; background: #059669; border-radius: 50%;
      box-shadow: 0 0 15px rgba(5, 150, 105, 0.4);
      animation: pulse 2.5s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.9); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.5; }
      100% { transform: scale(0.9); opacity: 1; }
    }

    .hero-section h1 { 
      font-family: var(--font-display);
      font-size: 5.5rem; font-weight: 800; letter-spacing: -0.05em; 
      margin-bottom: 2rem; line-height: 1.1;
      color: var(--p-text);
    }
    .hero-section h1 span { 
      background: var(--p-brand-gradient);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      font-style: italic; font-weight: 300;
    }
    
    .hero-subtext { 
      font-family: var(--font-body);
      font-size: 1.4rem; color: var(--p-text-muted); 
      max-width: 700px; margin: 0 auto 4rem; line-height: 1.6; font-weight: 500;
    }
    .hero-subtext b { color: var(--p-text); font-weight: 700; }

    .specialization-cloud { display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 3rem; }
    .tag {
      padding: 0.6rem 1.4rem; background: #ffffff; 
      border: 1px solid var(--p-glass-border); border-radius: 16px;
      font-size: 0.8rem; font-weight: 800; color: var(--p-text-muted);
      transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
      cursor: default;
      box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.05);
    }
    .tag:hover { 
      background: var(--p-text); color: #ffffff; 
      border-color: var(--p-text); transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(15, 23, 42, 0.15);
    }

    /* STATS RIBBON */
    .stats-ribbon {
      display: inline-block; padding: 1px;
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(124, 58, 237, 0.2));
      border-radius: 24px; margin-top: 2rem;
    }
    .stat-inner {
      display: flex; align-items: center; gap: 4rem;
      background: #ffffff; padding: 1.5rem 5rem;
      border-radius: 23px; backdrop-filter: var(--p-blur);
      box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.08);
    }
    .stat-item { display: flex; flex-direction: column; align-items: center; }
    .stat-val { 
      font-family: var(--font-display);
      font-size: 3rem; font-weight: 800; color: var(--p-text); line-height: 1; margin-bottom: 0.5rem; 
      letter-spacing: -0.02em;
    }
    .stat-label { 
      font-family: var(--font-body);
      font-size: 0.75rem; font-weight: 800; color: var(--p-text-muted); 
      text-transform: uppercase; letter-spacing: 0.15em; 
    }
    .stat-sep { width: 1px; height: 50px; background: var(--p-glass-border); }

    .scroll-indicator {
      position: absolute; bottom: 4rem; left: 50%; transform: translateX(-50%);
      display: flex; flex-direction: column; align-items: center; gap: 1rem;
      z-index: 10;
    }
    .scroll-text { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.3em; color: var(--p-accent); }
    .mouse-wrap {
      width: 28px; height: 48px; border: 2px solid var(--p-glass-border); border-radius: 20px;
      padding-top: 8px; display: flex; justify-content: center;
      background: #ffffff;
    }
    .mouse {
      width: 4px; height: 10px; background: var(--p-accent); border-radius: 2px;
      animation: mouseScroll 2.2s infinite ease-out;
    }
    @keyframes mouseScroll {
      0% { transform: translateY(0); opacity: 1; }
      80% { transform: translateY(20px); opacity: 0; }
      100% { transform: translateY(0); opacity: 0; }
    }

    @media (max-width: 900px) {
      .hero-section h1 { font-size: 3.5rem; }
      .stat-inner { gap: 2rem; padding: 1.5rem 2.5rem; }
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
