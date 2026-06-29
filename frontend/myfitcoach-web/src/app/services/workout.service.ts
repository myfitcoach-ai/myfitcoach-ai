import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  CreateWorkoutDto,
  UpdateWorkoutDto,
  WorkoutResponseDto
} from '../models/workout.model';

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

type WorkoutApiResponse =
  | WorkoutResponseDto[]
  | WorkoutResponseDto
  | { data?: unknown; items?: unknown; value?: unknown };

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private readonly apiUrl = 'https://localhost:7179/api/workout';

  constructor(private readonly http: HttpClient) {}

  getWorkouts(): Observable<WorkoutResponseDto[]> {
    return this.http.get<WorkoutApiResponse>(this.apiUrl).pipe(
      map((response) => this.extractWorkoutList(response)),
      catchError((error) => throwError(() => this.handleError(error)))
    );
  }

  createWorkout(payload: CreateWorkoutDto): Observable<WorkoutResponseDto> {
    return this.http.post<WorkoutApiResponse>(this.apiUrl, payload).pipe(
      map((response) => this.extractWorkout(response)),
      catchError((error) => throwError(() => this.handleError(error)))
    );
  }

  updateWorkout(id: number | string, payload: UpdateWorkoutDto): Observable<WorkoutResponseDto> {
    return this.http.put<WorkoutApiResponse>(`${this.apiUrl}/${id}`, payload).pipe(
      map((response) => this.extractWorkout(response)),
      catchError((error) => throwError(() => this.handleError(error)))
    );
  }

  deleteWorkout(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => throwError(() => this.handleError(error)))
    );
  }

  private extractWorkoutList(response: WorkoutApiResponse): WorkoutResponseDto[] {
    if (Array.isArray(response)) {
      return response.map((item) => this.normalizeWorkout(item));
    }

    const nested = this.extractCollection(response);
    if (Array.isArray(nested)) {
      return nested.map((item) => this.normalizeWorkout(item));
    }

    if (response && typeof response === 'object') {
      return [this.normalizeWorkout(response)];
    }

    return [];
  }

  private extractWorkout(response: WorkoutApiResponse): WorkoutResponseDto {
    if (Array.isArray(response)) {
      return this.normalizeWorkout(response[0] ?? {});
    }

    const nested = this.extractCollection(response);
    if (Array.isArray(nested)) {
      return this.normalizeWorkout(nested[0] ?? {});
    }

    return this.normalizeWorkout(response ?? {});
  }

  private extractCollection(response: WorkoutApiResponse): unknown[] | null {
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

  private normalizeWorkout(raw: unknown): WorkoutResponseDto {
    const workout = raw && typeof raw === 'object'
      ? raw as Record<string, unknown>
      : {};

    return {
      id: this.readIdentifier(workout),
      title: this.readString(workout, ['title', 'name'], 'Untitled plan'),
      description: this.readString(workout, ['description'], ''),
      goal: this.readString(workout, ['goal'], 'General fitness'),
      durationWeeks: this.readNumber(workout, ['durationWeeks']),
      createdAt: this.readOptionalString(workout, ['createdAt']),
      updatedAt: this.readOptionalString(workout, ['updatedAt'])
    };
  }

  private readIdentifier(source: Record<string, unknown>): number | string {
    const identifier = source['id'] ?? source['workoutId'] ?? source['workoutID'];

    if (typeof identifier === 'number' || typeof identifier === 'string') {
      return identifier;
    }

    return '';
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
    let errorMessage = 'Unable to complete the workout request. Please try again.';

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