import { create } from 'zustand';

// Mock assessment-answers store — there's no real backend to save these
// to. Exists so SignUpAssessmentScreen (used both at signup and, in
// 'edit' mode from Personal Information, to revise an existing profile)
// has somewhere to read prior answers from and write new ones to, rather
// than every visit silently resetting to hardcoded defaults. No
// persistence middleware (matches subscriptionStore, not themeStore) —
// resets on app restart like the rest of this app's mocked state.

export interface AssessmentAnswers {
  gender: 'Male' | 'Female' | null;
  className: string | null;
  classPath: string | null;
  subjects: string[];
  learningLevel: number;
  physicalLimitations: string[];
  daysPerWeek: number;
}

export const DEFAULT_ASSESSMENT_ANSWERS: AssessmentAnswers = {
  gender: null,
  className: null,
  classPath: null,
  subjects: [],
  learningLevel: 3,
  physicalLimitations: [],
  daysPerWeek: 7,
};

interface AssessmentState {
  answers: AssessmentAnswers;
  setAnswers: (answers: AssessmentAnswers) => void;
}

export const useAssessmentStore = create<AssessmentState>((set) => ({
  answers: DEFAULT_ASSESSMENT_ANSWERS,
  setAnswers: (answers) => set({ answers }),
}));
