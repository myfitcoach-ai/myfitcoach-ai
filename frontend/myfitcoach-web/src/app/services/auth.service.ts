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
  token?: string;
  user?: AuthUser;
  success?: boolean;
  message?: string;
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

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const payload = this.decodeJwtPayload(token);
    const exp = payload?.['exp'];

    if (!payload || typeof exp !== 'number') {
      return true;
    }

    const now = Math.floor(Date.now() / 1000);
    return exp > now;
  }

  private decodeJwtPayload(token: string): Record<string, unknown> | null {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    try {
      const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, '=');
      const decoded = atob(padded);
      return JSON.parse(decoded) as Record<string, unknown>;
    } catch {
      return null;
    }
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
