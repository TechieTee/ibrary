// Content for Learning To-Dos (Figma 661:16827-16836). Static copy pulled
// directly from the design — not fetched from any backend.

export type LearningTodoCategoryId = 'ready' | 'right-way' | 'good-habits';

export interface LearningTodoSlide {
  title: string;
  subtitle: string;
  body: string;
  image: ReturnType<typeof require>;
}

export interface LearningTodoCategory {
  id: LearningTodoCategoryId;
  hubTitle: string;
  hubSubtitle: string;
  slides: LearningTodoSlide[];
}

export const LEARNING_TODO_CATEGORIES: LearningTodoCategory[] = [
  {
    id: 'ready',
    hubTitle: 'Get Learning-Ready',
    hubSubtitle: 'Prepare your mind and body to learn',
    slides: [
      {
        title: 'Get Learning-Ready',
        subtitle: 'Rest Well',
        body: 'Good sleep helps your brain focus, remember, and process information clearly, making it easier to understand lessons and stay alert.',
        image: require('../../assets/images/todos-rest-well.jpg'),
      },
      {
        title: 'Get Learning-Ready',
        subtitle: 'Eat and Hydrate',
        body: 'Learningy food and enough water give your brain energy to learn well, helping you stay active and think more clearly.',
        image: require('../../assets/images/todos-eat-hydrate.jpg'),
      },
    ],
  },
  {
    id: 'right-way',
    hubTitle: 'Learn the Right Way',
    hubSubtitle: 'Use the app effectively to understand',
    slides: [
      {
        title: 'Learn the Right Way',
        subtitle: 'Finish What You Start',
        body: 'Completing topics fully helps ideas connect and stay clear, making learning smoother and reducing future confusion.',
        image: require('../../assets/images/todos-finish-what-you-start.jpg'),
      },
      {
        title: 'Learn the Right Way',
        subtitle: 'Use Accessibility Tools',
        body: 'Audio, large text, and screen readers make learning easier, especially for students with visual or learning challenges.',
        image: require('../../assets/images/todos-accessibility-tools.jpg'),
      },
      {
        title: 'Learn the Right Way',
        subtitle: 'Protect Your Eyes',
        body: 'Lower brightness and rest often to avoid eye strain, keeping your eyes comfortable during longer study time.',
        image: require('../../assets/images/todos-protect-eyes.jpg'),
      },
    ],
  },
  {
    id: 'good-habits',
    hubTitle: 'Build Good Habits',
    hubSubtitle: 'Develop habits that support better learning',
    slides: [
      {
        title: 'Build Good Habits',
        subtitle: 'Learn Little by Little',
        body: 'Studying small parts daily reduces stress and confusion, making it easier to remember what you learn.',
        image: require('../../assets/images/todos-little-by-little.jpg'),
      },
      {
        title: 'Build Good Habits',
        subtitle: 'Ask for Help Early',
        body: 'Getting help early prevents small problems from becoming bigger, saving time and reducing frustration later.',
        image: require('../../assets/images/todos-ask-for-help.jpg'),
      },
      {
        title: 'Build Good Habits',
        subtitle: 'Stay Consistent',
        body: 'Regular study builds confidence and improves long-term understanding, helping you perform better in exams.',
        image: require('../../assets/images/todos-stay-consistent.jpg'),
      },
    ],
  },
];
