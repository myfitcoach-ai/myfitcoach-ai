import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;
  isLoading = false;
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Custom validator to check if passwords match
   */
  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return password && confirmPassword && password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  /**
   * Toggle confirm password visibility
   */
  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalidControl();
      return;
    }

    // Prevent multiple submissions
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    // Extract form data and trim whitespace
    const formData = {
      fullName: this.form.get('fullName')?.value?.trim() || '',
      email: this.form.get('email')?.value?.trim() || '',
      password: this.form.get('password')?.value || ''
    };

    // Call auth service
    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Show success notification
        this.snackBar.open(
          'Registration successful. Please sign in.',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          }
        );

        // Navigate to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        
        // Extract error message from API or use default
        const errorMessage = error.message || 'Something went wrong. Please try again.';
        
        // Show error notification
        this.snackBar.open(
          errorMessage,
          'Close',
          {
            duration: 4000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  /**
   * Focus the first invalid control for better UX
   */
  private focusFirstInvalidControl(): void {
    const firstInvalidControl = document.querySelector('input.ng-invalid');
    if (firstInvalidControl) {
      (firstInvalidControl as HTMLElement).focus();
    }
  }

  /**
   * Check if a form control should display an error
   */
  shouldShowError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Get password mismatch error visibility
   */
  get showPasswordMismatchError(): boolean {
    const confirmPassword = this.form.get('confirmPassword');
    return !!(
      this.form.hasError('passwordMismatch') && 
      confirmPassword?.touched && 
      !confirmPassword?.hasError('required')
    );
  }
}
