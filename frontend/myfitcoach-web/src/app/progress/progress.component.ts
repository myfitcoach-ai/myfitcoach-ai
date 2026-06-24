import { Component } from '@angular/core';

interface ProgressMetric {
  label: string;
  value: string;
  detail: string;
}

interface StrengthMetric {
  label: string;
  previous: string;
  current: string;
}

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent {
  highlights = [
    { label: 'Current weight', value: '174 lbs' },
    { label: 'Goal weight', value: '168 lbs' },
    { label: 'Total lost', value: '12 lbs' },
    { label: 'Streak', value: '18 days' }
  ];

  summary = [
    { label: 'Weight', value: '174 lbs', detail: 'Goal 168 lbs' },
    { label: 'Body Fat', value: '18.5%', detail: 'Target 15%' },
    { label: 'Workouts Completed', value: '21', detail: 'This month' },
    { label: 'Average Steps', value: '10,400', detail: 'Per day' }
  ];

  weightTimeline = [
    { week: 'Week 1', weight: '184 lbs' },
    { week: 'Week 2', weight: '181 lbs' },
    { week: 'Week 3', weight: '178 lbs' },
    { week: 'Week 4', weight: '174 lbs' }
  ];

  measurements = [
    { label: 'Waist', value: '32 in' },
    { label: 'Chest', value: '39 in' },
    { label: 'Arms', value: '14.5 in' },
    { label: 'Legs', value: '22 in' }
  ];

  strengthProgress: StrengthMetric[] = [
    { label: 'Incline DB Press', previous: '70 lbs', current: '85 lbs' },
    { label: 'Hack Squat', previous: '180 lbs', current: '225 lbs' },
    { label: 'Hammer Curl', previous: '25 lbs', current: '32 lbs' },
    { label: 'Leg Curl', previous: '95 lbs', current: '120 lbs' }
  ];

  coachTip = 'You are trending down steadily. Keep protein high and maintain 3-5 workouts this week.';

  actions = [
    { icon: 'monitor_weight', label: 'Add Weight' },
    { icon: 'stroller', label: 'Add Measurement' },
    { icon: 'photo_camera', label: 'Upload Progress Photo' },
    { icon: 'support_agent', label: 'Ask AI Coach' }
  ];
}
