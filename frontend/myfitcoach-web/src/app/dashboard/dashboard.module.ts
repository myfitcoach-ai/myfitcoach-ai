import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { DashboardStatsComponent } from './dashboard-stats.component';
import { DashboardReportsComponent } from './dashboard-reports.component';

const dashboardRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'stats', component: DashboardStatsComponent },
  { path: 'reports', component: DashboardReportsComponent }
];

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardStatsComponent,
    DashboardReportsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(dashboardRoutes),
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatProgressBarModule
  ]
})
export class DashboardModule {}
