import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

interface SidebarUser {
  fullName: string;
  email: string;
  initials: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatExpansionModule
  ],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent {
  isHandset$!: Observable<boolean>;
  currentUser: SidebarUser = {
    fullName: 'Guest User',
    email: 'guest@myfitcoach.ai',
    initials: 'GU'
  };

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthService
  ) {
    this.isHandset$ = this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(
        map((result) => result.matches),
        shareReplay({ bufferSize: 1, refCount: true })
      );

      this.loadCurrentUser();
  }

  isWorkoutsOpen(): boolean {
    try {
      return this.router.url.startsWith('/workouts');
    } catch {
      return false;
    }
  }

  async logout(): Promise<void> {
    this.authService.logout();
    await this.router.navigate(['/welcome']);

    await Swal.fire({
      title: 'Logged Out',
      text: 'You have been logged out successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#4338ca'
    });
  }

  private loadCurrentUser(): void {
    const user = this.authService.getCurrentUser() as {
      fullName?: string;
      email?: string;
    } | null;

    if (!user) {
      return;
    }

    const fullName = (user.fullName || 'Guest User').trim();
    const email = (user.email || 'guest@myfitcoach.ai').trim();

    this.currentUser = {
      fullName,
      email,
      initials: this.createInitials(fullName)
    };
  }

  private createInitials(fullName: string): string {
    const parts = fullName.split(/\s+/).filter(Boolean);
    if (!parts.length) {
      return 'GU';
    }

    const first = parts[0].charAt(0) || '';
    const second = parts.length > 1 ? parts[1].charAt(0) : '';
    const initials = `${first}${second}`.toUpperCase();
    return initials || 'GU';
  }
}
