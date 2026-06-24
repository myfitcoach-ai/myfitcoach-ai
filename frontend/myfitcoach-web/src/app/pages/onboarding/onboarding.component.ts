import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

interface OnboardingStep {
  title: string;
  subtitle: string;
  details: string[];
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent {
  activeStep = 1;

  steps: OnboardingStep[] = [
    { title: 'Choose goal', subtitle: 'Pick the right target', details: ['Lose Fat', 'Build Muscle', 'Maintain'] },
    { title: 'Body info', subtitle: 'Add your current metrics', details: ['Height', 'Weight', 'Goal weight'] },
    { title: 'Training level', subtitle: 'Choose your experience', details: ['Beginner', 'Intermediate', 'Advanced'] },
    { title: 'Nutrition preference', subtitle: 'Select your diet style', details: ['Vegetarian with eggs', 'Vegetarian', 'Non-vegetarian'] },
    { title: 'AI coach setup', subtitle: 'Choose your support', details: ['Weekly check-in', 'Motivation style', 'Focus areas'] }
  ];

  nextStep() {
    if (this.activeStep < this.steps.length) {
      this.activeStep += 1;
    }
  }

  prevStep() {
    if (this.activeStep > 1) {
      this.activeStep -= 1;
    }
  }
}
