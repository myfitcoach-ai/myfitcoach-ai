import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

import { WorkoutsComponent } from '../pages/workouts/workouts.component';
import { TodayWorkoutComponent } from '../pages/workouts/today.component';
import { WorkoutExerciseDialogComponent } from '../pages/workouts/dialogs/workout-exercise-dialog.component';
import { WorkoutPlanDialogComponent } from '../pages/workouts/dialogs/workout-plan-dialog.component';
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
    PlansComponent,
    WorkoutPlanDialogComponent,
    WorkoutExerciseDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatDividerModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatToolbarModule
  ]
})
export class WorkoutsModule {}
