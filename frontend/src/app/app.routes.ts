import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { ResearchResultsComponent } from './components/research-results/research-results.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'portfolio', component: PortfolioComponent },
    { path: 'research-list/:status', component: ResearchResultsComponent }
];
