import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'portfolio', component: PortfolioComponent }
];
