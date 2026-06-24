import { Component } from '@angular/core';

interface Plan {
  title: string;
  days: number;
  level: string;
  duration: string;
  description: string;
}

@Component({
  selector: 'app-workout-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent {
  plans: Plan[] = [
    { title: 'Weight Loss', days: 4, level: 'Intermediate', duration: '12 weeks', description: 'Calorie-focused training with HIIT and strength to accelerate fat loss.' },
    { title: 'Muscle Gain', days: 5, level: 'Advanced', duration: '16 weeks', description: 'Periodized hypertrophy program to build size with progressive overload.' },
    { title: 'Beginner Strength', days: 3, level: 'Beginner', duration: '8 weeks', description: 'Fundamentals of strength training with simple compound lifts.' },
    { title: 'Hyrox Conditioning', days: 4, level: 'Advanced', duration: '10 weeks', description: 'Conditioning and technical work tailored to Hyrox style events.' }
  ];
}
