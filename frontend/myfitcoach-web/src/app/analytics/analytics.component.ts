import { Component } from '@angular/core';

interface SummaryCard {
  label: string;
  value: string;
}

interface TrendCard {
  title: string;
  meta: string;
  trend: string;
}

interface Insight {
  title: string;
  description: string;
}

interface ActionItem {
  icon: string;
  label: string;
}

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent {
  summary: SummaryCard[] = [
    { label: 'Weight change', value: '-4 lbs' },
    { label: 'Average calories', value: '2,150' },
    { label: 'Protein average', value: '128g' },
    { label: 'Workout consistency', value: '87%' }
  ];

  trendCards: TrendCard[] = [
    { title: 'Weight trend', meta: 'Past 4 weeks', trend: 'Consistent downward progress' },
    { title: 'Calories trend', meta: 'Daily average', trend: 'Balanced intake with slight deficit' },
    { title: 'Protein trend', meta: 'Weekly average', trend: 'Stable at premium levels' },
    { title: 'Workout frequency', meta: 'This month', trend: '5 sessions per week' }
  ];

  insight: Insight = {
    title: 'AI Analytics Insight',
    description: 'Your weight is trending down steadily while workout consistency remains high.'
  };

  actions: ActionItem[] = [
    { icon: 'download', label: 'Export Report' },
    { icon: 'calendar_view_week', label: 'View Weekly Summary' },
    { icon: 'smart_toy', label: 'Ask AI Coach' },
    { icon: 'edit', label: 'Update Goals' }
  ];
}
