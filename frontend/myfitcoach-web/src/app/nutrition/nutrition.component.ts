import { Component } from '@angular/core';

interface Meal {
  name: string;
  items: string[];
  calories: number;
  protein: number;
}

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.scss']
})
export class NutritionComponent {
  remainingCalories = 450;
  remainingProtein = 28;

  summary = [
    { title: 'Calories', value: 1950, target: 2400, suffix: '' },
    { title: 'Protein', value: 122, target: 150, suffix: 'g' },
    { title: 'Carbs', value: 180, target: 250, suffix: 'g' },
    { title: 'Fat', value: 55, target: 70, suffix: 'g' }
  ];

  meals: Meal[] = [
    {
      name: 'Breakfast',
      items: ['Oatmeal with berries', 'Scrambled eggs', 'Black coffee'],
      calories: 520,
      protein: 22
    },
    {
      name: 'Lunch',
      items: ['Grilled chicken salad', 'Quinoa', 'Avocado'],
      calories: 620,
      protein: 38
    },
    {
      name: 'Dinner',
      items: ['Salmon fillet', 'Roasted vegetables', 'Sweet potato'],
      calories: 560,
      protein: 36
    },
    {
      name: 'Snacks',
      items: ['Greek yogurt', 'Almonds', 'Apple slices'],
      calories: 250,
      protein: 26
    }
  ];

  coachSuggestion = 'You need 28g more protein today. Add Greek yogurt or whey protein.';

  actions = [
    { icon: 'restaurant', label: 'Add Meal' },
    { icon: 'auto_awesome', label: 'Generate Meal Plan' },
    { icon: 'support_agent', label: 'Ask AI Coach' },
    { icon: 'history', label: 'View History' }
  ];
}
