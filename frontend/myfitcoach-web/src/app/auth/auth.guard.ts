import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

const redirectToLogin = () => {
  const router = inject(Router);
  return router.createUrlTree(['/auth/login']);
};

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.isLoggedIn() ? true : redirectToLogin();
};

export const authChildGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);
  return authService.isLoggedIn() ? true : redirectToLogin();
};
