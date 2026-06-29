import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { WorkoutResponseDto } from '../../models/workout.model';
import { WorkoutExerciseResponseDto } from '../../models/workout-exercise.model';
import { WorkoutExerciseService } from '../../services/workout-exercise.service';
import { WorkoutService } from '../../services/workout.service';
import { WorkoutExerciseDialogComponent } from './dialogs/workout-exercise-dialog.component';
import { WorkoutPlanDialogComponent } from './dialogs/workout-plan-dialog.component';

interface WorkoutSummary {
  title: string;
  value: string;
  subtitle: string;
}

interface WorkoutHighlight {
  title: string;
  meta: string;
  emphasized: boolean;
}

interface RecentWorkout {
  id: number | string;
  title: string;
  goal: string;
  durationWeeks: number;
  description: string;
  createdAt?: string;
}

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.scss']
})
export class WorkoutsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);

  workouts: WorkoutResponseDto[] = [];
  exercisesByPlan: Record<string, WorkoutExerciseResponseDto[]> = {};
  isLoading = false;
  deletingWorkoutId: number | string | null = null;
  deletingExerciseId: number | string | null = null;
  expandedExercisesPlanId: number | string | null = null;
  loadingExercisesPlanId: number | string | null = null;

  constructor(
    private readonly workoutService: WorkoutService,
    private readonly workoutExerciseService: WorkoutExerciseService
  ) {}

  ngOnInit(): void {
    this.loadWorkouts();
  }

  get summaries(): WorkoutSummary[] {
    const totalWeeks = this.workouts.reduce((sum, workout) => sum + workout.durationWeeks, 0);
    const averageWeeks = this.workouts.length > 0
      ? Math.round((totalWeeks / this.workouts.length) * 10) / 10
      : 0;
    const uniqueGoals = new Set(
      this.workouts
        .map((workout) => workout.goal.trim())
        .filter((goal) => goal.length > 0)
    );

    return [
      { title: 'Plans', value: String(this.workouts.length), subtitle: 'Saved' },
      { title: 'Weeks', value: String(totalWeeks), subtitle: 'Total duration' },
      { title: 'Average', value: `${averageWeeks}`, subtitle: 'Weeks per plan' },
      { title: 'Goals', value: String(uniqueGoals.size), subtitle: 'Plan categories' }
    ];
  }

  get highlights(): WorkoutHighlight[] {
    return this.sortWorkouts(this.workouts)
      .slice(0, 6)
      .map((workout) => ({
        title: workout.title,
        meta: `${workout.goal} · ${workout.durationWeeks} week${workout.durationWeeks === 1 ? '' : 's'}`,
        emphasized: true
      }));
  }

  get recent(): RecentWorkout[] {
    return this.sortWorkouts(this.workouts)
      .slice(0, 6)
      .map((workout) => ({
        id: workout.id,
        title: workout.title,
        goal: workout.goal,
        durationWeeks: workout.durationWeeks,
        description: workout.description,
        createdAt: workout.createdAt
      }));
  }

  get isBusy(): boolean {
    return this.isLoading || this.deletingWorkoutId !== null;
  }

  startCreate(): void {
    this.openWorkoutDialog();
  }

  editWorkout(workout: WorkoutResponseDto): void {
    this.openWorkoutDialog(workout);
  }

  editWorkoutById(id: number | string): void {
    const workout = this.findWorkoutById(id);
    if (workout) {
      this.editWorkout(workout);
    }
  }

  async deleteWorkout(workout: WorkoutResponseDto): Promise<void> {
    if (this.deletingWorkoutId !== null) {
      return;
    }

    const result = await Swal.fire({
      title: 'Delete Workout Plan?',
      text: `Remove ${workout.title} from your workout plans?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d32f2f'
    });

    if (!result.isConfirmed) {
      return;
    }

    this.deletingWorkoutId = workout.id;

    this.workoutService.deleteWorkout(workout.id)
      .pipe(
        finalize(() => {
          this.deletingWorkoutId = null;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: async () => {
          if (this.expandedExercisesPlanId === workout.id) {
            this.expandedExercisesPlanId = null;
            delete this.exercisesByPlan[this.planKey(workout.id)];
          }

          await Swal.fire({
            title: 'Workout Plan Deleted',
            text: 'The workout plan has been removed successfully.',
            icon: 'success',
            confirmButtonColor: '#4338ca'
          });

          this.loadWorkouts(false);
        },
        error: async (error: { message?: string }) => {
          await Swal.fire({
            title: 'Delete Failed',
            text: error.message?.trim() || 'Unable to delete this workout plan right now.',
            icon: 'error',
            confirmButtonColor: '#d32f2f'
          });
        }
      });
  }

  async deleteWorkoutById(id: number | string): Promise<void> {
    const workout = this.findWorkoutById(id);
    if (workout) {
      await this.deleteWorkout(workout);
    }
  }

  trackByWorkout(index: number, workout: RecentWorkout): number | string {
    return workout.id || index;
  }

  trackByExercise(index: number, exercise: WorkoutExerciseResponseDto): number | string {
    return exercise.id || index;
  }

  isExercisesExpanded(planId: number | string): boolean {
    return this.expandedExercisesPlanId === planId;
  }

  isExercisesLoading(planId: number | string): boolean {
    return this.loadingExercisesPlanId === planId;
  }

  getExercisesForPlan(planId: number | string): WorkoutExerciseResponseDto[] {
    return this.exercisesByPlan[this.planKey(planId)] || [];
  }

  toggleExercises(planId: number | string): void {
    if (this.expandedExercisesPlanId === planId) {
      this.expandedExercisesPlanId = null;
      return;
    }

    this.expandedExercisesPlanId = planId;
    this.loadExercisesForPlan(planId);
  }

  startAddExercise(planId: number | string): void {
    this.openExerciseDialog(planId);
  }

  editExercise(planId: number | string, exercise: WorkoutExerciseResponseDto): void {
    this.openExerciseDialog(planId, exercise);
  }

  async deleteExercise(planId: number | string, exercise: WorkoutExerciseResponseDto): Promise<void> {
    if (this.deletingExerciseId !== null) {
      return;
    }

    const result = await Swal.fire({
      title: 'Delete Exercise?',
      text: `Remove ${exercise.exerciseName} from this workout plan?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d32f2f'
    });

    if (!result.isConfirmed) {
      return;
    }

    this.deletingExerciseId = exercise.id;

    this.workoutExerciseService.deleteExercise(exercise.id)
      .pipe(
        finalize(() => {
          this.deletingExerciseId = null;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: async () => {
          await Swal.fire({
            title: 'Exercise Deleted',
            text: 'The exercise has been removed successfully.',
            icon: 'success',
            confirmButtonColor: '#4338ca'
          });

          this.loadExercisesForPlan(planId, false);
        },
        error: async (error: { message?: string }) => {
          await Swal.fire({
            title: 'Delete Failed',
            text: error.message?.trim() || 'Unable to delete this exercise right now.',
            icon: 'error',
            confirmButtonColor: '#d32f2f'
          });
        }
      });
  }

    private openWorkoutDialog(workout?: WorkoutResponseDto): void {
      const dialogRef = this.dialog.open(WorkoutPlanDialogComponent, {
        width: '640px',
        maxWidth: '95vw',
        disableClose: true,
        autoFocus: 'first-tabbable',
        data: { workout }
      });

      dialogRef.afterClosed()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((saved: boolean | undefined) => {
          if (saved) {
            this.loadWorkouts(false);
          }
        });
    }

    private openExerciseDialog(planId: number | string, exercise?: WorkoutExerciseResponseDto): void {
      const dialogRef = this.dialog.open(WorkoutExerciseDialogComponent, {
        width: '720px',
        maxWidth: '95vw',
        disableClose: true,
        autoFocus: 'first-tabbable',
        data: {
          planId,
          planTitle: this.findWorkoutById(planId)?.title || 'Workout Plan',
          exercise
        }
      });

      dialogRef.afterClosed()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((saved: boolean | undefined) => {
          if (saved) {
            this.loadExercisesForPlan(planId, false);
          }
        });
    }

  private loadWorkouts(showAlert = true): void {
    this.isLoading = true;

    this.workoutService.getWorkouts()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (workouts) => {
          this.workouts = this.sortWorkouts(workouts);
        },
        error: async (error: { message?: string }) => {
          this.workouts = [];

          if (showAlert) {
            await Swal.fire({
              title: 'Unable to Load Workout Plans',
              text: error.message?.trim() || 'Please try again in a moment.',
              icon: 'error',
              confirmButtonColor: '#d32f2f'
            });
          }
        }
      });
  }

  private loadExercisesForPlan(planId: number | string, showAlert = true): void {
    this.loadingExercisesPlanId = planId;

    this.workoutExerciseService.getExercises(planId)
      .pipe(
        finalize(() => {
          if (this.loadingExercisesPlanId === planId) {
            this.loadingExercisesPlanId = null;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (exercises) => {
          this.exercisesByPlan[this.planKey(planId)] = exercises;
        },
        error: async (error: { message?: string }) => {
          this.exercisesByPlan[this.planKey(planId)] = [];

          if (showAlert) {
            await Swal.fire({
              title: 'Unable to Load Exercises',
              text: error.message?.trim() || 'Please try again in a moment.',
              icon: 'error',
              confirmButtonColor: '#d32f2f'
            });
          }
        }
      });
  }

  private planKey(planId: number | string): string {
    return String(planId);
  }

  private sortWorkouts(workouts: WorkoutResponseDto[]): WorkoutResponseDto[] {
    return [...workouts].sort((left, right) => {
      const rightTime = right.createdAt ? Date.parse(right.createdAt) : 0;
      const leftTime = left.createdAt ? Date.parse(left.createdAt) : 0;
      return rightTime - leftTime;
    });
  }

  private findWorkoutById(id: number | string): WorkoutResponseDto | undefined {
    return this.workouts.find((workout) => workout.id === id);
  }
}
