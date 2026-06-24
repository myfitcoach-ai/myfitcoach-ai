import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';

import { WorkoutsComponent } from '../pages/workouts/workouts.component';
import { TodayWorkoutComponent } from '../pages/workouts/today.component';
import { PlansComponent } from '../pages/workouts/plans.component';

const routes: Routes = [
  { path: '', component: WorkoutsComponent },
  { path: 'today', component: TodayWorkoutComponent },
  { path: 'plans', component: PlansComponent }
];

@NgModule({
  declarations: [
    WorkoutsComponent,
    TodayWorkoutComponent,
    PlansComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatDividerModule
  ]
})
export class WorkoutsModule {}
