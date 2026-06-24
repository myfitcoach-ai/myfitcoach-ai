import { Component } from '@angular/core';

interface WorkoutSummary {
  title: string;
  value: string;
  subtitle: string;
}

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.scss']
})
export class WorkoutsComponent {
  summaries: WorkoutSummary[] = [
    { title: 'Workouts', value: '5', subtitle: 'Completed' },
    { title: 'Minutes', value: '225', subtitle: 'Trained' },
    { title: 'Calories', value: '3,420 kcal', subtitle: 'Burned' },
    { title: 'Streak', value: '12', subtitle: 'Days' }
  ];

  weekly = [
    { day: 'Mon', name: 'Legs', done: true },
    { day: 'Tue', name: 'Push', done: false },
    { day: 'Wed', name: 'Pull', done: false },
    { day: 'Thu', name: 'Cardio', done: false },
    { day: 'Fri', name: 'Full Body', done: false },
    { day: 'Sat', name: 'Active Rest', done: true },
    { day: 'Sun', name: 'Mobility', done: true }
  ];

  recent = [
    { title: 'Upper Strength', minutes: 42, calories: 420 },
    { title: 'Interval Run', minutes: 28, calories: 360 },
    { title: 'Full Body', minutes: 55, calories: 620 }
  ];
}
