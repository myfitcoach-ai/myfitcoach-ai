import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, AuthUser, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    const payload = {
      email: this.form.get('email')?.value?.trim() || '',
      password: this.form.get('password')?.value || ''
    };

    this.authService.login(payload).subscribe({
      next: (response: LoginResponse) => {
        this.isLoading = false;

        const user = this.extractUser(response);
        localStorage.setItem('currentUser', JSON.stringify(user));

        this.snackBar.open('Login successful. Welcome back!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        this.router.navigate(['/dashboard']);
      },
      error: (error: { message?: string }) => {
        this.isLoading = false;

        const backendMessage = error?.message?.trim();
        const message = backendMessage && backendMessage !== 'An error occurred. Please try again.'
          ? backendMessage
          : 'Invalid email or password.';

        this.snackBar.open(message, 'Close', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private extractUser(response: LoginResponse): AuthUser {
    if (response.user && typeof response.user === 'object') {
      return response.user;
    }

    if (response.data && typeof response.data === 'object') {
      return response.data;
    }

    return response as AuthUser;
  }
}
