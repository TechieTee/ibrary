import { useState, useEffect, useCallback } from 'react';
import { useContentStore } from '../store/contentStore';
import { getTopics, getLessonSummaries, getLesson, getQuiz } from '../api/client';
import { Topic, LessonSummary, Lesson, Quiz, ContentSelection, IbraryError } from '../api/types';

// Shared shape every screen using these hooks can render against —
// matches the loading/empty/unavailable/retry states from the doc.
interface FetchState<T> {
  status: 'loading' | 'success' | 'empty' | 'error';
  data?: T;
  error?: IbraryError;
}

export function useTopics(selection: ContentSelection) {
  const cached = useContentStore((s) => s.getTopics(selection));
  const setTopics = useContentStore((s) => s.setTopics);
  const [state, setState] = useState<FetchState<Topic[]>>(
    cached ? { status: cached.length ? 'success' : 'empty', data: cached } : { status: 'loading' }
  );

  const fetchTopics = useCallback(async () => {
    setState({ status: 'loading' });
    const result = await getTopics(selection);
    if (!result.ok) {
      setState({ status: 'error', error: result.error });
      return;
    }
    setTopics(selection, result.data);
    setState({ status: result.data.length ? 'success' : 'empty', data: result.data });
  }, [selection, setTopics]);

  useEffect(() => {
    if (!cached) fetchTopics();
  }, [cached, fetchTopics]);

  return { ...state, retry: fetchTopics };
}

export function useLessonSummaries(selection: ContentSelection, topicNumber: number) {
  const cached = useContentStore((s) => s.getLessonSummaries(selection, topicNumber));
  const setLessonSummaries = useContentStore((s) => s.setLessonSummaries);
  const [state, setState] = useState<FetchState<LessonSummary[]>>(
    cached ? { status: cached.length ? 'success' : 'empty', data: cached } : { status: 'loading' }
  );

  const fetchSummaries = useCallback(async () => {
    setState({ status: 'loading' });
    const result = await getLessonSummaries(selection, topicNumber);
    if (!result.ok) {
      setState({ status: 'error', error: result.error });
      return;
    }
    setLessonSummaries(selection, topicNumber, result.data);
    setState({ status: result.data.length ? 'success' : 'empty', data: result.data });
  }, [selection, topicNumber, setLessonSummaries]);

  useEffect(() => {
    if (!cached) fetchSummaries();
  }, [cached, fetchSummaries]);

  return { ...state, retry: fetchSummaries };
}

export function useLesson(selection: ContentSelection, contentIndex: number) {
  const cached = useContentStore((s) => s.getLesson(contentIndex));
  const setLesson = useContentStore((s) => s.setLesson);
  const [state, setState] = useState<FetchState<Lesson>>(
    cached ? { status: 'success', data: cached } : { status: 'loading' }
  );

  const fetchLesson = useCallback(async () => {
    setState({ status: 'loading' });
    const result = await getLesson(selection, contentIndex);
    if (!result.ok) {
      setState({ status: 'error', error: result.error });
      return;
    }
    setLesson(result.data);
    setState({ status: 'success', data: result.data });
  }, [selection, contentIndex, setLesson]);

  useEffect(() => {
    if (!cached) fetchLesson();
  }, [cached, fetchLesson]);

  return { ...state, retry: fetchLesson };
}

export function useQuiz(selection: ContentSelection, contentIndex: number) {
  const cached = useContentStore((s) => s.getQuiz(contentIndex));
  const setQuiz = useContentStore((s) => s.setQuiz);
  const [state, setState] = useState<FetchState<Quiz>>(
    cached ? { status: 'success', data: cached } : { status: 'loading' }
  );

  const fetchQuiz = useCallback(async () => {
    setState({ status: 'loading' });
    const result = await getQuiz(selection, contentIndex);
    if (!result.ok) {
      setState({ status: 'error', error: result.error });
      return;
    }
    setQuiz(result.data);
    setState({ status: result.data.questions.length ? 'success' : 'empty', data: result.data });
  }, [selection, contentIndex, setQuiz]);

  useEffect(() => {
    if (!cached) fetchQuiz();
  }, [cached, fetchQuiz]);

  return { ...state, retry: fetchQuiz };
}