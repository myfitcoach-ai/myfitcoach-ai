import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthUser, LoginResponse } from '../../services/auth.service';
import Swal from 'sweetalert2';

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

        const token = this.extractToken(response);
        const user = this.extractUser(response);

        if (token) {
          localStorage.setItem('token', token);
        }
        localStorage.setItem('currentUser', JSON.stringify(user));

        this.router.navigate(['/dashboard']);
      },
      error: async (error: { message?: string }) => {
        this.isLoading = false;

        const backendMessage = error?.message?.trim();
        const message = backendMessage && backendMessage !== 'An error occurred. Please try again.'
          ? backendMessage
          : 'Invalid email or password.';

        await Swal.fire({
          title: 'Login Failed',
          text: message,
          icon: 'error',
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#d32f2f'
        });
      }
    });
  }

  private extractToken(response: LoginResponse): string | null {
    const directToken = response?.token;
    if (typeof directToken === 'string' && directToken.trim()) {
      return directToken;
    }

    const dataToken = (response?.data as { token?: unknown } | undefined)?.token;
    if (typeof dataToken === 'string' && dataToken.trim()) {
      return dataToken;
    }

    const userToken = (response?.user as { token?: unknown } | undefined)?.token;
    if (typeof userToken === 'string' && userToken.trim()) {
      return userToken;
    }

    return null;
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
