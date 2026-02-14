import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ResearchService } from '../../services/research.service';
import { PortfolioHeroComponent } from './sections/portfolio-hero.component';
import { PortfolioShowcaseComponent } from './sections/portfolio-showcase.component';
import { PortfolioTimelineComponent } from './sections/portfolio-timeline.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, PortfolioHeroComponent, PortfolioShowcaseComponent, PortfolioTimelineComponent],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  private researchService = inject(ResearchService);
  private router = inject(Router);

  publicResearches = computed(() =>
    [...this.researchService.researchItems()]
      .filter(i => i.publicVisibility === 'PUBLIC')
      .sort((a, b) => parseInt(b.publication?.year || '0') - parseInt(a.publication?.year || '0'))
  );

  featured = computed(() => this.publicResearches().filter(i => i.featured));

  q1Count = computed(() => this.publicResearches().filter(i => i.publication?.quartile === 'Q1').length);
  publishedCount = computed(() => this.publicResearches().filter(i => i.status === 'PUBLISHED').length);

  currentYear = new Date().getFullYear();

  ngOnInit() {
    this.researchService.loadAll();
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
