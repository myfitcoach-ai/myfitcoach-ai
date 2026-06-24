import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

interface DashboardUser {
  id?: string;
  userId?: string;
  fullName?: string;
  email?: string;
  role?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  greeting = 'Welcome Back';
  motivationalMessage = "Let's continue your fitness journey today.";
  currentDate = '';
  firstName = 'Athlete';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentDate = this.formatCurrentDate();
    this.setPersonalizedGreeting();
  }

  private setPersonalizedGreeting(): void {
    const user = this.authService.getCurrentUser() as DashboardUser | null;
    this.firstName = this.extractFirstName(user?.fullName);

    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting = `Good Morning, ${this.firstName} 👋`;
      this.motivationalMessage = 'Welcome back to MyFitCoach AI';
      return;
    }

    if (hour < 17) {
      this.greeting = `Good Afternoon, ${this.firstName} 👋`;
      this.motivationalMessage = "Let's keep your momentum going today.";
      return;
    }

    this.greeting = `Good Evening, ${this.firstName} 👋`;
    this.motivationalMessage = "Let's finish today strong with smart coaching.";
  }

  private extractFirstName(fullName?: string): string {
    const cleanedName = (fullName || '').trim();
    if (!cleanedName) {
      return 'Athlete';
    }

    const first = cleanedName.split(/\s+/)[0] || 'Athlete';
    return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  }

  private formatCurrentDate(): string {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date());
  }
}
