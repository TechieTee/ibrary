import { create } from 'zustand';
import { Topic, LessonSummary, Lesson, Quiz, ContentSelection } from '../api/types';

// Cache keys are built from the selection so switching class/subject/theme
// doesn't collide with or overwrite a different selection's cached data.
function selectionKey(selection: ContentSelection): string {
  return `${selection.className}|${selection.subject}|${selection.themeNumber}`;
}

interface ContentState {
  topicsByKey: Record<string, Topic[]>;
  lessonSummariesByKey: Record<string, LessonSummary[]>;
  lessonsByIndex: Record<number, Lesson>;
  quizzesByIndex: Record<number, Quiz>;

  setTopics: (selection: ContentSelection, topics: Topic[]) => void;
  setLessonSummaries: (selection: ContentSelection, topicNumber: number, summaries: LessonSummary[]) => void;
  setLesson: (lesson: Lesson) => void;
  setQuiz: (quiz: Quiz) => void;

  getTopics: (selection: ContentSelection) => Topic[] | undefined;
  getLessonSummaries: (selection: ContentSelection, topicNumber: number) => LessonSummary[] | undefined;
  getLesson: (contentIndex: number) => Lesson | undefined;
  getQuiz: (contentIndex: number) => Quiz | undefined;
}

export const useContentStore = create<ContentState>((set, get) => ({
  topicsByKey: {},
  lessonSummariesByKey: {},
  lessonsByIndex: {},
  quizzesByIndex: {},

  setTopics: (selection, topics) =>
    set((state) => ({
      topicsByKey: { ...state.topicsByKey, [selectionKey(selection)]: topics },
    })),

  setLessonSummaries: (selection, topicNumber, summaries) =>
    set((state) => ({
      lessonSummariesByKey: {
        ...state.lessonSummariesByKey,
        [`${selectionKey(selection)}|${topicNumber}`]: summaries,
      },
    })),

  setLesson: (lesson) =>
    set((state) => ({
      lessonsByIndex: { ...state.lessonsByIndex, [lesson.contentIndex]: lesson },
    })),

  setQuiz: (quiz) =>
    set((state) => ({
      quizzesByIndex: { ...state.quizzesByIndex, [quiz.contentIndex]: quiz },
    })),

  getTopics: (selection) => get().topicsByKey[selectionKey(selection)],
  getLessonSummaries: (selection, topicNumber) =>
    get().lessonSummariesByKey[`${selectionKey(selection)}|${topicNumber}`],
  getLesson: (contentIndex) => get().lessonsByIndex[contentIndex],
  getQuiz: (contentIndex) => get().quizzesByIndex[contentIndex],
}));
