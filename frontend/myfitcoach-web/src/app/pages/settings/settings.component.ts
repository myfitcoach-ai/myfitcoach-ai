import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  theme = 'Light mode';
  units = 'lbs/in';
  notifications = [
    { label: 'Email updates', value: 'On' },
    { label: 'Push alerts', value: 'On' },
    { label: 'Workout reminders', value: 'On' },
    { label: 'Meal reminders', value: 'Off' }
  ];

  privacy = [
    { label: 'Data sharing', value: 'Allowed' },
    { label: 'AI recommendations', value: 'Enabled' },
    { label: 'Progress visibility', value: 'Private' }
  ];
}
