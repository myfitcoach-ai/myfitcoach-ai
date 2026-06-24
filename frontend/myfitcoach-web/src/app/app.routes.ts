import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { AppShellComponent } from './layouts/app-shell.component';
import { authChildGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: WelcomeComponent, pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: '',
    component: AppShellComponent,
    canActivateChild: [authChildGuard],
    children: [
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule) },
      { path: 'workouts', loadChildren: () => import('./workouts/workouts.module').then((m) => m.WorkoutsModule) },
      { path: 'nutrition', loadChildren: () => import('./nutrition/nutrition.module').then((m) => m.NutritionModule) },
      { path: 'progress', loadChildren: () => import('./progress/progress.module').then((m) => m.ProgressModule) },
      { path: 'ai-coach', loadChildren: () => import('./ai-coach/ai-coach.module').then((m) => m.AiCoachModule) },
      { path: 'analytics', loadChildren: () => import('./analytics/analytics.module').then((m) => m.AnalyticsModule) },
      { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then((m) => m.SettingsComponent) },
      { path: 'subscription', loadComponent: () => import('./pages/subscription/subscription.component').then((m) => m.SubscriptionComponent) },
      { path: 'onboarding', loadComponent: () => import('./pages/onboarding/onboarding.component').then((m) => m.OnboardingComponent) },
      { path: 'home', loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
