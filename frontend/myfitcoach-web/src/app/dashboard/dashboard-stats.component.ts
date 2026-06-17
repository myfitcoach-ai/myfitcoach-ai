import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-stats',
  template: `
    <section class="dashboard-stats">
      <div class="stats-header">
        <h2>Performance Stats</h2>
        <p>Daily and weekly activity summaries to keep your training on track.</p>
      </div>
      <div class="stats-grid">
        <mat-card>
          <mat-card-title>Calories Burned</mat-card-title>
          <mat-card-content>
            <p>3,480 kcal this week</p>
          </mat-card-content>
        </mat-card>
        <mat-card>
          <mat-card-title>Workout Sessions</mat-card-title>
          <mat-card-content>
            <p>8 sessions completed</p>
          </mat-card-content>
        </mat-card>
        <mat-card>
          <mat-card-title>Goal Progress</mat-card-title>
          <mat-card-content>
            <p>73% of monthly target</p>
          </mat-card-content>
        </mat-card>
      </div>
    </section>
  `,
  styles: [
    ".dashboard-stats { padding: 1rem 0; }",
    ".stats-header h2 { margin: 0 0 0.5rem; }",
    ".stats-header p { margin: 0 0 1.5rem; color: rgba(0, 0, 0, 0.7); }",
    ".stats-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }"
  ]
})
export class DashboardStatsComponent {}
