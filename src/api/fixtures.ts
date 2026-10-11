import { Topic, LessonSummary, Lesson, Quiz } from './types';

export const fixtureTopics: Topic[] = [
  { topicNumber: 1, title: 'Cell Structure', description: 'Introduction to cell biology' },
];

export const fixtureLessonSummaries: LessonSummary[] = [
  { contentIndex: 1, title: 'What is a Cell?' },
];

// Matches Figma frame 661:16725 (LessonReaderScreen, "Base Ten System").
// Note: getLesson() in api/client.ts returns this same fixture regardless
// of contentIndex — a pre-existing simplification (not introduced here),
// so every lesson currently opens this content until the real endpoint
// ships.
export const fixtureLesson: Lesson = {
  contentIndex: 1,
  title: 'Base Ten System',
  contentMarkdown:
    '# Discover how numbers are built from simple place values.\n\n' +
    '**Lesson 1**\n\n' +
    'The number system we use every day is called Base Ten. It helps us understand the value of each digit in a number.\n\n' +
    '**What is Base Ten?**\n\n' +
    'Base Ten, also called the decimal system, is the way we write and understand numbers using ten digits: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9. Each digit in a number has a place value depending on its position.\n\n' +
    '**Place Value**\n\n' +
    'In Base Ten, every position in a number is ten times the value of the position to its right.\n\n' +
    'For example, in the number 345:\n\n' +
    'The 5 is in the ones place, so its value is 5 × 1 = 5.\n' +
    'The 4 is in the tens place, so its value is 4 × 10 = 40.\n' +
    'The 3 is in the hundreds place, so its value is 3 × 100 = 300.\n\n' +
    'So, 345 = 300 + 40 + 5.\n\n' +
    '**How It Works**\n\n' +
    'Start from the rightmost digit, which is the ones place. Move left, and each place is multiplied by 10, 100, 1000, and so on.\n\n' +
    '**Why Base Ten?**\n\n' +
    'We have 10 fingers, which is why humans naturally count in tens. It makes adding, subtracting, multiplying, and dividing numbers easier. Every number can be built from powers of ten.\n\n' +
    'For example, 1,234 = 1 × 1000 + 2 × 100 + 3 × 10 + 4 × 1.\n\n' +
    '**Quick Tip**\n\n' +
    'Each step to the left multiplies the place by 10. Each step to the right divides the place by 10.\n\n' +
    'For example, in 3450, 3 is in the thousands place, 4 is in the hundreds place, 5 is in the tens place, and 0 is in the ones place.',
  keyTakeaways: [
    'Base Ten uses ten digits (0–9) and place value to represent numbers.',
    'Each position is ten times the value of the position to its right.',
  ],
  glossary: [{ term: 'Place value', definition: 'The value of a digit based on its position in a number.' }],
  activities: ['Break 1,234 down into its place-value parts.'],
  accessibilityContext: 'This lesson is text-based with a worked numeric example (345 broken into place values).',
  audioUrl: 'https://example.com/audio/base-ten-system.mp3', // placeholder — no real asset
  videoUrl: 'https://example.com/video/base-ten-system.mp4', // placeholder — no real asset
  // Matches Figma frame 661:16729 (Comments tab) — three example comments.
  // Comment has no like/dislike/reply-count fields (see LessonReaderScreen
  // for how those are handled: a local, non-persisted display map, not
  // added here).
  comments: [
    { id: 'c1', author: 'Chidinma A.', text: 'This finally made place value click for me!', createdAt: '2026-01-13T10:00:00Z' },
    {
      id: 'c2',
      author: 'Tunde B.',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      createdAt: '2026-01-12T09:00:00Z',
    },
    {
      id: 'c3',
      author: 'Amara K.',
      text: 'Tempor orci dapibus ultrices in iaculis nunc sed augue?? 😖😖',
      createdAt: '2026-01-11T08:00:00Z',
    },
  ],
};

// Matches Figma frames 661:16331 (base question), 661:16332 (correct-
// answer state). Question 1 is Figma-exact (prompt, all 5 options,
// correctOptionId, explanation). Questions 2–7 only exist to give the
// "1 of 7" progress counter something real to count through — they are
// fabricated filler, not Figma-sourced, flagged for review before
// treating as real content.
export const fixtureQuiz: Quiz = {
  contentIndex: 1,
  questions: [
    {
      id: 'q1',
      prompt: 'In the number 472, what is the value of 7 in base ten?',
      options: [
        { id: 'a', text: 'Seven tens or seventy' },
        { id: 'b', text: 'Just the number seven' },
        { id: 'c', text: 'Seven hundreds or seven hundred' },
        { id: 'd', text: 'Forty-two' },
        { id: 'e', text: 'Seven thousand' },
      ],
      correctOptionId: 'a',
      explanation: 'The 7 is in the tens place, so its value is 7 × 10 = 70.',
    },
    {
      id: 'q2',
      prompt: 'What is the value of 3 in the number 345?',
      options: [
        { id: 'a', text: 'Three' },
        { id: 'b', text: 'Thirty' },
        { id: 'c', text: 'Three hundred' },
        { id: 'd', text: 'Three thousand' },
      ],
      correctOptionId: 'c',
      explanation: 'The 3 is in the hundreds place, so its value is 3 × 100 = 300.',
    },
    {
      id: 'q3',
      prompt: 'How many digits are used in the Base Ten (decimal) system?',
      options: [
        { id: 'a', text: '5' },
        { id: 'b', text: '8' },
        { id: 'c', text: '10' },
        { id: 'd', text: '12' },
      ],
      correctOptionId: 'c',
      explanation: 'Base Ten uses ten digits: 0 through 9.',
    },
    {
      id: 'q4',
      prompt: 'Moving one place to the left multiplies a digit’s value by:',
      options: [
        { id: 'a', text: '1' },
        { id: 'b', text: '5' },
        { id: 'c', text: '10' },
        { id: 'd', text: '100' },
      ],
      correctOptionId: 'c',
      explanation: 'Each step to the left multiplies the place value by 10.',
    },
    {
      id: 'q5',
      prompt: 'In 1,234, what is 2 × 100 + 3 × 10 + 4 × 1 equal to?',
      options: [
        { id: 'a', text: '234' },
        { id: 'b', text: '1,234' },
        { id: 'c', text: '243' },
        { id: 'd', text: '324' },
      ],
      correctOptionId: 'a',
      explanation: '2 hundreds + 3 tens + 4 ones = 234.',
    },
    {
      id: 'q6',
      prompt: 'Which place is immediately to the right of the tens place?',
      options: [
        { id: 'a', text: 'Hundreds' },
        { id: 'b', text: 'Ones' },
        { id: 'c', text: 'Thousands' },
        { id: 'd', text: 'Tenths' },
      ],
      correctOptionId: 'b',
      explanation: 'The ones place sits immediately to the right of the tens place.',
    },
    {
      id: 'q7',
      prompt: 'Why do humans commonly count in Base Ten?',
      options: [
        { id: 'a', text: 'It was chosen at random' },
        { id: 'b', text: 'We have ten fingers' },
        { id: 'c', text: 'Computers require it' },
        { id: 'd', text: 'It is the smallest possible base' },
      ],
      correctOptionId: 'b',
      explanation: 'We have 10 fingers, which is why humans naturally count in tens.',
    },
  ],
};