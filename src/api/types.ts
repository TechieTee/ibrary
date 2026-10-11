// --- Core content shapes ---

export interface Topic {
  topicNumber: number;
  title: string;
  description?: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}

// Lightweight — used for the lesson list screen, before a lesson is opened
export interface LessonSummary {
  contentIndex: number; // derived from upstream SK — never expose the raw DynamoDB key
  title: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface CommentSubmission {
  contentIndex: number;
  text: string;
}

// Full lesson — only fetched when a learner actually opens one
export interface Lesson {
  contentIndex: number;
  title: string;
  contentMarkdown: string;
  keyTakeaways: string[];
  glossary: GlossaryEntry[];
  activities: string[];
  accessibilityContext?: string;
  audioUrl?: string;
  videoUrl?: string;
  comments: Comment[];
}

// --- Selection params, sent to every content endpoint ---

export interface ContentSelection {
  className: string;
  subject: string;
  themeNumber: number;
  // Exact backend param name is still being confirmed — assumed `term` for
  // now; may need to change to match the real API contract.
  term: number;
}

// --- Quiz ---

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  // Flag: correctOptionId may not actually be sent by the backend for
  // security reasons (it would let a client read answers before
  // submitting) — confirm before relying on it client-side. Currently
  // relied on client-side for scoring since quiz data is fixture-only
  // (see src/api/fixtures.ts) — revisit once a real endpoint exists.
  correctOptionId: string;
  // Shown as the right/wrong-answer feedback message. Optional since not
  // every question may have one from the backend.
  explanation?: string;
}

export interface Quiz {
  contentIndex: number;
  questions: QuizQuestion[];
}

export interface QuizSubmission {
  contentIndex: number;
  answers: { questionId: string; selectedOptionId: string }[];
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: string[];
}

// --- Lesson rating ---

export interface LessonRating {
  contentIndex: number;
  // Scale (e.g. 1-5) needs confirming against the contract.
  rating: number;
}

// --- Error handling ---

export type IbraryError =
  | { type: 'not_found' }
  | { type: 'invalid_upstream' }
  | { type: 'temporary_outage' };

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: IbraryError };