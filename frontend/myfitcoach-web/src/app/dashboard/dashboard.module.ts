import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { DashboardLayoutComponent } from './dashboard-layout.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { DashboardStatsComponent } from './dashboard-stats.component';
import { DashboardReportsComponent } from './dashboard-reports.component';

const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'stats', component: DashboardStatsComponent },
      { path: 'reports', component: DashboardReportsComponent }
    ]
  }
];

@NgModule({
  declarations: [
    DashboardLayoutComponent,
    DashboardComponent,
    DashboardStatsComponent,
    DashboardReportsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(dashboardRoutes),
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule
  ]
})
export class DashboardModule {}
