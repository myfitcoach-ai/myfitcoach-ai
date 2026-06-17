import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-reports',
  template: `
    <section class="dashboard-reports">
      <div class="reports-header">
        <h2>Reports</h2>
        <p>Export your activity history and review performance trends.</p>
      </div>
      <mat-card>
        <mat-card-title>Weekly progress report</mat-card-title>
        <mat-card-content>
          <p>Download PDFs for training summaries, meal plans, and progress charts.</p>
        </mat-card-content>
      </mat-card>
    </section>
  `,
  styles: [
    ".dashboard-reports { padding: 1rem 0; }",
    ".reports-header h2 { margin: 0 0 0.5rem; }",
    ".reports-header p { margin: 0 0 1.5rem; color: rgba(0, 0, 0, 0.7); }"
  ]
})
export class DashboardReportsComponent {}
