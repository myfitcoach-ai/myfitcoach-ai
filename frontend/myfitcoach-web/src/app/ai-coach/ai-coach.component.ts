import { Component } from '@angular/core';

interface StatCard {
  label: string;
  value: string;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

interface Insight {
  title: string;
  value: string;
  description: string;
}

interface ActionItem {
  icon: string;
  label: string;
}

@Component({
  selector: 'app-ai-coach',
  templateUrl: './ai-coach.component.html',
  styleUrls: ['./ai-coach.component.scss']
})
export class AiCoachComponent {
  stats: StatCard[] = [
    { label: 'Weekly consistency', value: '87%' },
    { label: 'Protein target', value: '122 / 150g' },
    { label: 'Weight trend', value: 'Down 4 lbs' },
    { label: 'Workouts this week', value: '5' }
  ];

  messages: ChatMessage[] = [
    { sender: 'user', text: 'Why is my weight stuck this week?' },
    {
      sender: 'ai',
      text: 'Your weight can fluctuate from water, sodium, sleep, and training soreness. Keep protein high and compare weekly averages.'
    }
  ];

  suggestedPrompts = [
    'Create my workout plan',
    'What should I eat today?',
    'Why am I not losing weight?',
    'How much protein do I need?',
    'Review my weekly progress',
    'Help me recover faster'
  ];

  insights: Insight[] = [
    { title: 'Today’s recommendation', value: 'Stay consistent with your meals and hydration.', description: 'A stable routine will support your next strength cycle.' },
    { title: 'Recovery note', value: 'Focus on sleep quality.', description: 'Aim for 7-8 hours and avoid late-night carbs to reduce bloating.' },
    { title: 'Nutrition tip', value: 'Hold protein steady.', description: 'Maintain at least 120g while lowering carbs slowly.' },
    { title: 'Workout focus', value: 'Lower body strength', description: 'Add one extra rep to your squat and press days.' }
  ];

  actions: ActionItem[] = [
    { icon: 'fitness_center', label: 'Generate Workout Plan' },
    { icon: 'restaurant', label: 'Generate Meal Plan' },
    { icon: 'analytics', label: 'Analyze Progress' },
    { icon: 'check_circle', label: 'Start Weekly Check-in' }
  ];

  sendQuestion(questionInput: HTMLInputElement) {
    const question = questionInput.value.trim();
    if (!question) {
      return;
    }

    console.log('AI Coach request:', question);
    this.messages.push({ sender: 'user', text: question });
    this.messages.push({
      sender: 'ai',
      text: 'Thanks for your question! Your coach will review this soon and provide a personalized tip.'
    });
    questionInput.value = '';
    setTimeout(() => {
      const chatWindow = document.querySelector('.chat-window');
      chatWindow?.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
    }, 0);
  }
}
