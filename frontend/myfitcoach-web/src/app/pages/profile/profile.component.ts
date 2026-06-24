import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  name = 'Avery Morgan';
  age = 29;
  gender = 'Female';
  height = '5 ft 8 in';
  currentWeight = '174 lbs';
  goalWeight = '168 lbs';
  fitnessGoal = 'Weight Loss';
  activityLevel = 'Intermediate';
  fatLossGoal = 'Yes';
  weeklyTarget = '0.8 lbs/week';
  proteinTarget = '150g/day';
  preferences = ['Vegetarian with eggs', 'Intermediate training', '5 workouts/week', 'lbs/in units'];
  coachSetup = ['Strength', 'Nutrition', 'Consistency', 'Weekly check-in'];
  actions = ['Edit Profile', 'Update Goals', 'Change Units', 'Manage Subscription'];
}
