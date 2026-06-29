import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

import { CreateWorkoutDto, UpdateWorkoutDto, WorkoutResponseDto } from '../../../models/workout.model';
import { WorkoutService } from '../../../services/workout.service';

export interface WorkoutPlanDialogData {
  workout?: WorkoutResponseDto;
}

@Component({
  selector: 'app-workout-plan-dialog',
  templateUrl: './workout-plan-dialog.component.html',
  styleUrls: ['./workout-plan-dialog.component.scss']
})
export class WorkoutPlanDialogComponent {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    title: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(100)]),
    goal: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(100)]),
    durationWeeks: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    description: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(500)])
  });

  isSaving = false;

  constructor(
    private readonly workoutService: WorkoutService,
    private readonly dialogRef: MatDialogRef<WorkoutPlanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: WorkoutPlanDialogData
  ) {
    if (this.data.workout) {
      this.form.patchValue({
        title: this.data.workout.title,
        goal: this.data.workout.goal,
        durationWeeks: this.data.workout.durationWeeks,
        description: this.data.workout.description
      });
    }
  }

  get isEdit(): boolean {
    return !!this.data.workout;
  }

  save(): void {
    if (this.form.invalid || this.isSaving) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    const request$ = this.isEdit && this.data.workout
      ? this.workoutService.updateWorkout(this.data.workout.id, payload as UpdateWorkoutDto)
      : this.workoutService.createWorkout(payload);

    this.isSaving = true;

    request$
      .pipe(finalize(() => {
        this.isSaving = false;
      }))
      .subscribe({
        next: async () => {
          await Swal.fire({
            title: this.isEdit ? 'Workout Plan Updated' : 'Workout Plan Created',
            text: this.isEdit ? 'Your workout plan has been updated successfully.' : 'Your workout plan has been created successfully.',
            icon: 'success',
            confirmButtonColor: '#4338ca'
          });

          this.dialogRef.close(true);
        },
        error: async (error: { message?: string }) => {
          await Swal.fire({
            title: this.isEdit ? 'Update Failed' : 'Create Failed',
            text: error.message?.trim() || 'Unable to save this workout plan right now.',
            icon: 'error',
            confirmButtonColor: '#d32f2f'
          });
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  shouldShowError(controlName: 'title' | 'goal' | 'durationWeeks' | 'description'): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  private buildPayload(): CreateWorkoutDto {
    const value = this.form.getRawValue();

    return {
      title: value.title.trim(),
      goal: value.goal.trim(),
      durationWeeks: Number(value.durationWeeks ?? 0),
      description: value.description.trim()
    };
  }
}