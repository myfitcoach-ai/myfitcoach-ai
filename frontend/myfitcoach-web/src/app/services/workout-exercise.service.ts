import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  CreateWorkoutExerciseDto,
  UpdateWorkoutExerciseDto,
  WorkoutExerciseResponseDto
} from '../models/workout-exercise.model';

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

type ExerciseApiResponse =
  | WorkoutExerciseResponseDto[]
  | WorkoutExerciseResponseDto
  | { data?: unknown; items?: unknown; value?: unknown };

@Injectable({
  providedIn: 'root'
})
export class WorkoutExerciseService {
  private readonly apiUrl = 'https://localhost:7179/api/workout';

  constructor(private readonly http: HttpClient) {}

  getExercises(workoutPlanId: number | string): Observable<WorkoutExerciseResponseDto[]> {
    return this.http.get<ExerciseApiResponse>(`${this.apiUrl}/${workoutPlanId}/exercises`).pipe(
      map((response) => this.extractExerciseList(response)),
      catchError((error) => throwError(() => this.handleError(error)))
    );
  }

  createExercise(workoutPlanId: number | string, payload: CreateWorkoutExerciseDto): Observable<WorkoutExerciseResponseDto> {
    return this.http.post<ExerciseApiResponse>(`${this.apiUrl}/${workoutPlanId}/exercises`, payload).pipe(
      map((response) => this.extractExercise(response)),
      catchError((error) => throwError(() => this.handleError(error)))
    );
  }

  updateExercise(exerciseId: number | string, payload: UpdateWorkoutExerciseDto): Observable<WorkoutExerciseResponseDto> {
    return this.http.put<ExerciseApiResponse>(`${this.apiUrl}/exercises/${exerciseId}`, payload).pipe(
      map((response) => this.extractExercise(response)),
      catchError((error) => throwError(() => this.handleError(error)))
    );
  }

  deleteExercise(exerciseId: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/exercises/${exerciseId}`).pipe(
      catchError((error) => throwError(() => this.handleError(error)))
    );
  }

  private extractExerciseList(response: ExerciseApiResponse): WorkoutExerciseResponseDto[] {
    if (Array.isArray(response)) {
      return response.map((item) => this.normalizeExercise(item));
    }

    const nested = this.extractCollection(response);
    if (Array.isArray(nested)) {
      return nested.map((item) => this.normalizeExercise(item));
    }

    if (response && typeof response === 'object') {
      return [this.normalizeExercise(response)];
    }

    return [];
  }

  private extractExercise(response: ExerciseApiResponse): WorkoutExerciseResponseDto {
    if (Array.isArray(response)) {
      return this.normalizeExercise(response[0] ?? {});
    }

    const nested = this.extractCollection(response);
    if (Array.isArray(nested)) {
      return this.normalizeExercise(nested[0] ?? {});
    }

    return this.normalizeExercise(response ?? {});
  }

  private extractCollection(response: ExerciseApiResponse): unknown[] | null {
    if (!response || typeof response !== 'object' || Array.isArray(response)) {
      return null;
    }

    const container = response as { data?: unknown; items?: unknown; value?: unknown };
    if (Array.isArray(container.data)) {
      return container.data;
    }

    if (Array.isArray(container.items)) {
      return container.items;
    }

    if (Array.isArray(container.value)) {
      return container.value;
    }

    return null;
  }

  private normalizeExercise(raw: unknown): WorkoutExerciseResponseDto {
    const exercise = raw && typeof raw === 'object'
      ? raw as Record<string, unknown>
      : {};

    return {
      id: this.readIdentifier(exercise),
      workoutPlanId: this.readPlanIdentifier(exercise),
      exerciseName: this.readString(exercise, ['exerciseName', 'name'], 'Exercise'),
      muscleGroup: this.readString(exercise, ['muscleGroup'], 'General'),
      sets: this.readNumber(exercise, ['sets']),
      reps: this.readString(exercise, ['reps'], ''),
      restSeconds: this.readNumber(exercise, ['restSeconds']),
      notes: this.readString(exercise, ['notes'], ''),
      createdAt: this.readOptionalString(exercise, ['createdAt']),
      updatedAt: this.readOptionalString(exercise, ['updatedAt'])
    };
  }

  private readIdentifier(source: Record<string, unknown>): number | string {
    const identifier = source['id'] ?? source['exerciseId'] ?? source['workoutExerciseId'];
    return typeof identifier === 'number' || typeof identifier === 'string' ? identifier : '';
  }

  private readPlanIdentifier(source: Record<string, unknown>): number | string | undefined {
    const identifier = source['workoutPlanId'] ?? source['planId'];
    return typeof identifier === 'number' || typeof identifier === 'string' ? identifier : undefined;
  }

  private readString(source: Record<string, unknown>, keys: string[], fallback: string): string {
    const value = this.readOptionalString(source, keys);
    return value && value.trim() ? value.trim() : fallback;
  }

  private readOptionalString(source: Record<string, unknown>, keys: string[]): string | undefined {
    for (const key of keys) {
      const value = source[key];
      if (typeof value === 'string') {
        return value;
      }
    }

    return undefined;
  }

  private readNumber(source: Record<string, unknown>, keys: string[]): number {
    for (const key of keys) {
      const value = source[key];
      if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
      }

      if (typeof value === 'string' && value.trim()) {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }
    }

    return 0;
  }

  private handleError(error: any): ApiError {
    let errorMessage = 'Unable to complete the exercise request. Please try again.';

    if (error.error && typeof error.error === 'object') {
      if (typeof error.error.message === 'string' && error.error.message.trim()) {
        errorMessage = error.error.message;
      } else if (error.error.errors) {
        const firstError = Object.values(error.error.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          errorMessage = firstError[0];
        }
      }
    } else if (typeof error.message === 'string' && error.message.trim()) {
      errorMessage = error.message;
    }

    return {
      message: errorMessage,
      errors: error.error?.errors || undefined
    };
  }
}