import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

import { CreateWorkoutExerciseDto, UpdateWorkoutExerciseDto, WorkoutExerciseResponseDto } from '../../../models/workout-exercise.model';
import { WorkoutExerciseService } from '../../../services/workout-exercise.service';

export interface WorkoutExerciseDialogData {
  planId: number | string;
  planTitle: string;
  exercise?: WorkoutExerciseResponseDto;
}

@Component({
  selector: 'app-workout-exercise-dialog',
  templateUrl: './workout-exercise-dialog.component.html',
  styleUrls: ['./workout-exercise-dialog.component.scss']
})
export class WorkoutExerciseDialogComponent {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    exerciseName: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(120)]),
    muscleGroup: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(80)]),
    sets: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    reps: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(40)]),
    restSeconds: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    notes: this.fb.nonNullable.control('', [Validators.maxLength(500)])
  });

  isSaving = false;

  constructor(
    private readonly workoutExerciseService: WorkoutExerciseService,
    private readonly dialogRef: MatDialogRef<WorkoutExerciseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: WorkoutExerciseDialogData
  ) {
    if (this.data.exercise) {
      this.form.patchValue({
        exerciseName: this.data.exercise.exerciseName,
        muscleGroup: this.data.exercise.muscleGroup,
        sets: this.data.exercise.sets,
        reps: this.data.exercise.reps,
        restSeconds: this.data.exercise.restSeconds,
        notes: this.data.exercise.notes || ''
      });
    }
  }

  get isEdit(): boolean {
    return !!this.data.exercise;
  }

  save(): void {
    if (this.form.invalid || this.isSaving) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    const request$ = this.isEdit && this.data.exercise
      ? this.workoutExerciseService.updateExercise(this.data.exercise.id, payload as UpdateWorkoutExerciseDto)
      : this.workoutExerciseService.createExercise(this.data.planId, payload);

    this.isSaving = true;

    request$
      .pipe(finalize(() => {
        this.isSaving = false;
      }))
      .subscribe({
        next: async () => {
          await Swal.fire({
            title: this.isEdit ? 'Exercise Updated' : 'Exercise Added',
            text: this.isEdit ? 'Workout exercise has been updated successfully.' : 'Workout exercise has been added successfully.',
            icon: 'success',
            confirmButtonColor: '#4338ca'
          });

          this.dialogRef.close(true);
        },
        error: async (error: { message?: string }) => {
          await Swal.fire({
            title: this.isEdit ? 'Update Failed' : 'Create Failed',
            text: error.message?.trim() || 'Unable to save this exercise right now.',
            icon: 'error',
            confirmButtonColor: '#d32f2f'
          });
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  shouldShowError(controlName: 'exerciseName' | 'muscleGroup' | 'sets' | 'reps' | 'restSeconds' | 'notes'): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  private buildPayload(): CreateWorkoutExerciseDto {
    const value = this.form.getRawValue();

    return {
      exerciseName: value.exerciseName.trim(),
      muscleGroup: value.muscleGroup.trim(),
      sets: Number(value.sets ?? 0),
      reps: value.reps.trim(),
      restSeconds: Number(value.restSeconds ?? 0),
      notes: value.notes.trim()
    };
  }
}