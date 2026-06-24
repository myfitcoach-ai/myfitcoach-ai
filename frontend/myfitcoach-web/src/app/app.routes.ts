import { Routes } from '@angular/router';
import { AppShellComponent } from './layouts/app-shell.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  
  // Main app routes with sidebar/topbar
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'workouts',
        loadChildren: () => import('./workouts/workouts.module').then((m) => m.WorkoutsModule)
      },
      {
        path: 'nutrition',
        loadChildren: () => import('./nutrition/nutrition.module').then((m) => m.NutritionModule)
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent)
      }
    ]
  },

  // Auth routes without sidebar/topbar
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
  },

  { path: '**', redirectTo: 'dashboard' }
];
