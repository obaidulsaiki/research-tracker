import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { ResearchResultsComponent } from './components/research-results/research-results.component';

import { OverviewTabComponent } from './components/dashboard/tabs/overview-tab.component';
import { ArchiveTabComponent } from './components/dashboard/tabs/archive-tab.component';
import { DeadlinesTabComponent } from './components/dashboard/tabs/deadlines-tab.component';
import { AuthorsTabComponent } from './components/dashboard/tabs/authors-tab.component';
import { AuthorDetailComponent } from './components/dashboard/tabs/author-detail.component';
import { AnalyticsTabComponent } from './components/dashboard/tabs/analytics-tab.component';
import { HistoryTabComponent } from './components/dashboard/tabs/history-tab.component';
import { DownloadTabComponent } from './components/dashboard/tabs/download-tab.component';

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            { path: 'overview', component: OverviewTabComponent },
            { path: 'archive', component: ArchiveTabComponent },
            { path: 'deadlines', component: DeadlinesTabComponent },
            { path: 'authors', component: AuthorsTabComponent },
            { path: 'author/:name', component: AuthorDetailComponent },
            { path: 'analytics', component: AnalyticsTabComponent },
            { path: 'history', component: HistoryTabComponent },
            { path: 'download', component: DownloadTabComponent },
        ]
    },
    { path: 'portfolio', component: PortfolioComponent },
    { path: 'research-list/:status', component: ResearchResultsComponent }
];
