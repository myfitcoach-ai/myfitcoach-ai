import { Component } from '@angular/core';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

@Component({
  selector: 'app-today-workout',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss']
})
export class TodayWorkoutComponent {
  workout = {
    name: 'Full Body Strength',
    duration: '45 min',
    difficulty: 'Intermediate',
    muscles: ['Legs', 'Back', 'Core']
  };

  exercises: Exercise[] = [
    { name: 'Barbell Squat', sets: 4, reps: '6-8', rest: '90s' },
    { name: 'Bench Press', sets: 4, reps: '6-8', rest: '90s' },
    { name: 'Deadlift', sets: 3, reps: '5', rest: '120s' },
    { name: 'Hanging Leg Raise', sets: 3, reps: '10-15', rest: '60s' }
  ];
}
