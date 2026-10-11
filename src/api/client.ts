import { Topic, LessonSummary, Lesson, Quiz, ContentSelection, Result, IbraryError } from './types';
import { fixtureTopics, fixtureLessonSummaries, fixtureLesson, fixtureQuiz } from './fixtures';

const BASE_URL = process.env.EXPO_PUBLIC_IBRARY_API_URL ?? '';

// Single point of translation from our internal shape to the wire format.
// If className/subject/themeNumber ever get renamed or restructured upstream,
// this is the only function that changes — no screen or store touches this.
function toQueryParams(selection: ContentSelection): Record<string, string> {
  return {
    class_name: selection.className,
    subject: selection.subject,
    theme_number: String(selection.themeNumber),
    term: String(selection.term), // TODO: confirm actual backend param name for term
  };
}

function toIbraryError(status: number): IbraryError {
  if (status === 404) return { type: 'not_found' };
  if (status >= 500) return { type: 'temporary_outage' };
  return { type: 'invalid_upstream' };
}

async function request<T>(path: string, params?: Record<string, string>): Promise<Result<T>> {
  try {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${BASE_URL}${path}${query}`);
    if (!res.ok) return { ok: false, error: toIbraryError(res.status) };
    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch {
    return { ok: false, error: { type: 'temporary_outage' } };
  }
}

// --- Public API, one function per endpoint ---

const ENDPOINTS_LIVE = {
  topics: false, // flip to true as each route ships
  lessonSummaries: false,
  lesson: false,
  quiz: false,
};

export async function getTopics(selection: ContentSelection): Promise<Result<Topic[]>> {
  if (!ENDPOINTS_LIVE.topics) return { ok: true, data: fixtureTopics };
  return request<Topic[]>('/topics', toQueryParams(selection));
}

export async function getLessonSummaries(
  selection: ContentSelection,
  topicNumber: number
): Promise<Result<LessonSummary[]>> {
  if (!ENDPOINTS_LIVE.lessonSummaries) return { ok: true, data: fixtureLessonSummaries };
  return request<LessonSummary[]>(`/topics/${topicNumber}`, toQueryParams(selection));
}

export async function getLesson(
  selection: ContentSelection,
  contentIndex: number
): Promise<Result<Lesson>> {
  if (!ENDPOINTS_LIVE.lesson) return { ok: true, data: fixtureLesson };
  return request<Lesson>(`/lessons/${contentIndex}`, toQueryParams(selection));
}

export async function getQuiz(
  selection: ContentSelection,
  contentIndex: number
): Promise<Result<Quiz>> {
  if (!ENDPOINTS_LIVE.quiz) return { ok: true, data: fixtureQuiz };
  return request<Quiz>(`/quizzes/${contentIndex}`, toQueryParams(selection));
}