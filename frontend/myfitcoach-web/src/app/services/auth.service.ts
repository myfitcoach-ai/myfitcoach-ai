import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    email: string;
    fullName: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  userId?: string;
  id?: string;
  email?: string;
  fullName?: string;
  token?: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  success?: boolean;
  message?: string;
  user?: AuthUser;
  data?: AuthUser;
  [key: string]: unknown;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7179/api/Auth';

  constructor(private http: HttpClient) {}

  /**
   * Register a new user
   * @param request - Registration request with fullName, email, password
   * @returns Observable with registration response
   */
  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, request).pipe(
      catchError((error) => {
        return throwError(() => this.handleError(error));
      })
    );
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      catchError((error) => {
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Handle HTTP errors and extract meaningful messages
   * @param error - HTTP error object
   * @returns ApiError with extracted message
   */
  private handleError(error: any): ApiError {
    let errorMessage = 'An error occurred. Please try again.';
    
    // Check for API error response
    if (error.error && typeof error.error === 'object') {
      if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error.errors) {
        // Handle validation errors from API
        const firstError = Object.values(error.error.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          errorMessage = firstError[0];
        }
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      message: errorMessage,
      errors: error.error?.errors || undefined
    };
  }
}
