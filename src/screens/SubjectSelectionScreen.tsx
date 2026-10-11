import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { Topic, LessonSummary } from '../api/types';
import { useTheme } from '../theme';
import { StateView } from '../components/StateView';
import { CircularProgress } from '../components/CircularProgress';
import { useFavoritesStore } from '../store/favoritesStore';
import {
  SubjectFilterModal,
  EMPTY_FILTERS,
  isFiltersEmpty,
  type SubjectFilters,
} from '../components/SubjectFilterModal';

// Built from Figma frame 661:16697 ("Classes", dark) — the REAL Subject
// Selection screen. Two levels, both handled inline in this one component
// (no separate SubjectDetail route, per earlier decision):
//
//  Level A — this frame: a search bar, a horizontal row of subject chips
//  (the actual "pick a subject" UI), and below it a list of that subject's
//  TOPIC cards (Number Bases, Logarithms, Indices, ...) — Topic-shaped.
//
//  Level B — reached by tapping a topic card: that topic's Week 1/2/3 +
//  Quiz lesson breakdown, plus a "Continue From Last Lesson" banner for
//  returning students. This is what frames 647:25618 / 661:16701 (first-
//  time) and 654:23965 / 661:16724 (returning) actually show — they are
//  NOT the subject picker, they're this topic-detail level. (An earlier
//  build of this screen mistakenly used them as if they were Level A;
//  this version corrects that.)
//
// Not reproduced: decorative status-bar header (OS chrome), cover photos /
// icon glyphs (no asset pipeline wired in — themed placeholders stand in).

type Props = NativeStackScreenProps<RootStackParamList, 'SubjectSelection'>;

// STUB: hardcoded rather than derived from any real signal. Flip manually
// to test both variants until backend confirms what actually drives this
// (e.g. "has the learner opened any lesson in this topic before").
const isReturningStudent = true;

type LessonStatus = 'completed' | 'in_progress' | 'not_started';

// Per-lesson display metadata Figma's card shows (status, progress bar,
// date/streak, student count) — has NO backing type in src/api/types.ts
// (LessonSummary is just {contentIndex, title}). Kept as a local wrapper,
// not added to LessonSummary itself. Flag before relying on it as real
// content — see per-lesson comments below for what's Figma-exact vs
// neutral filler.
interface LessonEntry {
  summary: LessonSummary;
  status: LessonStatus;
  progress: number; // 0–1, approximate — Figma shows a dot position, not a number
  date?: string;
  streakDays?: number;
  studentCount: number;
}

interface WeekGroup {
  label: string; // "Week 1" / "Week 2" / "Week 3" / "Quiz" — display grouping only, not a Topic
  lessons: LessonEntry[];
}

interface TopicFixture {
  topic: Topic;
  tagLine: string; // Figma's static "<Term> - Video • Text • Quiz" tag
  // Content-type flags for the filter modal. All fixture topics currently
  // have all three, so content-type filtering is correctly wired but
  // functionally inert against this data — flag before relying on it to
  // demonstrate narrowing results.
  hasVideo: boolean;
  hasText: boolean;
  hasQuiz: boolean;
  weeks: WeekGroup[];
}

interface SubjectFixture {
  subject: string;
  topics: TopicFixture[];
}

let nextContentIndex = 1;

// Neutral default: not started, no progress, Figma's example student count
// (127) reused as filler. Pass overrides for the "Number Bases" entries
// that have Figma-exact status/progress/date.
function lesson(title: string, overrides: Partial<Omit<LessonEntry, 'summary'>> = {}): LessonEntry {
  return {
    summary: { contentIndex: nextContentIndex++, title },
    status: 'not_started',
    progress: 0,
    studentCount: 127,
    ...overrides,
  };
}

// Fabricated fixture data. Subject chip labels and the six Mathematics
// topic names/order are exactly what Figma shows. Only "Number Bases" has
// Figma-sourced week/lesson detail (from the earlier-pulled topic-detail
// frames) — the other five topics, and all non-Mathematics subjects, are
// minimal placeholder content flagged as illustrative-only, not design-
// sourced.
const SUBJECTS: SubjectFixture[] = [
  {
    subject: 'Mathematics',
    topics: [
      {
        topic: { topicNumber: 1, title: 'Number Bases' },
        tagLine: '1st Term - Video • Text • Quiz',
        hasVideo: true,
        hasText: true,
        hasQuiz: true,
        weeks: [
          {
            label: 'Week 1',
            lessons: [
              lesson('Introduction to Number Bases', { status: 'completed', progress: 1, date: '13 Jan, 2026' }),
              lesson('Base Ten System', { status: 'in_progress', progress: 0.5, streakDays: 23 }),
            ],
          },
          {
            label: 'Week 2',
            lessons: [
              lesson('Other Number Bases'),
              lesson('Conversion to Base Ten', { status: 'in_progress', progress: 0.85, date: '13 Jan, 2026' }),
              lesson('Conversion from Base Ten', { status: 'in_progress', progress: 0.5, date: '13 Jan, 2026' }),
            ],
          },
          {
            label: 'Week 3',
            lessons: [
              lesson('Addition in Other Bases'),
              lesson('Subtraction in Other Bases', { status: 'in_progress', progress: 0.85, date: '13 Jan, 2026' }),
              lesson('Word Problems on Number Bases', { status: 'in_progress', progress: 0.5, date: '13 Jan, 2026' }),
            ],
          },
          { label: 'Quiz', lessons: [lesson('Number Bases Quiz')] },
        ],
      },
      {
        topic: { topicNumber: 2, title: 'Logarithms' },
        tagLine: '1st Term - Video • Text • Quiz',
        hasVideo: true,
        hasText: true,
        hasQuiz: true,
        weeks: [{ label: 'Week 1', lessons: [lesson('Introduction to Logarithms')] }],
      },
      {
        topic: { topicNumber: 3, title: 'Indices (Laws of Indices)' },
        tagLine: '1st Term - Video • Text • Quiz',
        hasVideo: true,
        hasText: true,
        hasQuiz: true,
        weeks: [{ label: 'Week 1', lessons: [lesson('Positive Integral Indices')] }],
      },
      {
        topic: { topicNumber: 4, title: 'Algebraic Processes' },
        tagLine: '1st Term - Video • Text • Quiz',
        hasVideo: true,
        hasText: true,
        hasQuiz: true,
        weeks: [{ label: 'Week 1', lessons: [lesson('Introduction to Algebra')] }],
      },
      {
        topic: { topicNumber: 5, title: 'Linear Equations' },
        tagLine: '1st Term - Video • Text • Quiz',
        hasVideo: true,
        hasText: true,
        hasQuiz: true,
        weeks: [{ label: 'Week 1', lessons: [lesson('Solving Linear Equations')] }],
      },
      {
        topic: { topicNumber: 6, title: 'Sets' },
        tagLine: '1st Term - Video • Text • Quiz',
        hasVideo: true,
        hasText: true,
        hasQuiz: true,
        weeks: [{ label: 'Week 1', lessons: [lesson('Introduction to Sets')] }],
      },
    ],
  },
  {
    subject: 'English',
    topics: [
      {
        topic: { topicNumber: 1, title: 'Parts of Speech' },
        tagLine: '1st Term - Video • Text • Quiz',
        hasVideo: true,
        hasText: true,
        hasQuiz: true,
        weeks: [{ label: 'Week 1', lessons: [lesson('Nouns and Pronouns')] }],
      },
    ],
  },
  {
    subject: 'Chemistry',
    topics: [
      {
        topic: { topicNumber: 1, title: 'Introduction to Chemistry' },
        tagLine: '1st Term - Video • Text • Quiz',
        hasVideo: true,
        hasText: true,
        hasQuiz: true,
        weeks: [{ label: 'Week 1', lessons: [lesson('States of Matter')] }],
      },
    ],
  },
  {
    subject: 'Physics',
    topics: [
      {
        topic: { topicNumber: 1, title: 'Introduction to Physics' },
        tagLine: '1st Term - Video • Text • Quiz',
        hasVideo: true,
        hasText: true,
        hasQuiz: true,
        weeks: [{ label: 'Week 1', lessons: [lesson('Measurement and Units')] }],
      },
    ],
  },
];

type LoadStatus = 'loading' | 'success' | 'empty';

export function SubjectSelectionScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { className, term, initialSubject, initialTopicNumber } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(
    () => SUBJECTS.find((s) => s.subject === initialSubject)?.subject ?? SUBJECTS[0].subject,
  );
  // When initialSubject/initialTopicNumber are both set (e.g. returning
  // from a lesson or quiz), open straight into that topic's detail view
  // (Level B) instead of the subject list.
  const [selectedTopic, setSelectedTopic] = useState<TopicFixture | null>(() => {
    if (!initialSubject || initialTopicNumber === undefined) return null;
    const subjectData = SUBJECTS.find((s) => s.subject === initialSubject);
    return subjectData?.topics.find((t) => t.topic.topicNumber === initialTopicNumber) ?? null;
  });
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<SubjectFilters>(EMPTY_FILTERS);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorited = useFavoritesStore((s) => s.isFavorited);
  const filtersActive = !isFiltersEmpty(filters);

  // Simulates what useTopics() (src/hooks/useIbraryContent.ts) would give a
  // screen once this is wired to the real fetch — a brief 'loading' state
  // before resolving, so StateView's loading/empty paths are genuinely
  // exercised even though the data itself is local.
  const [status, setStatus] = useState<LoadStatus>('success');

  useEffect(() => {
    setStatus('loading');
    const timer = setTimeout(() => {
      const data = SUBJECTS.find((s) => s.subject === selectedSubject);
      setStatus(data && data.topics.length > 0 ? 'success' : 'empty');
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedSubject]);

  const filteredSubjects = useMemo(
    () => SUBJECTS.filter((s) => s.subject.toLowerCase().includes(searchQuery.trim().toLowerCase())),
    [searchQuery],
  );

  const currentSubjectData = SUBJECTS.find((s) => s.subject === selectedSubject);

  // When any filter is active, results are drawn from every subject the
  // filter's Subjects section matches (or just the currently browsed
  // subject if none are checked there) — matching Figma's "Filter Result"
  // chip row, which can combine a subject constraint with content-type
  // constraints across subjects.
  const filteredTopics = useMemo(() => {
    if (!filtersActive) return null;
    const subjectPool = filters.subjects.length > 0 ? filters.subjects : [selectedSubject];
    const results: { subject: string; topic: TopicFixture }[] = [];
    for (const subjectName of subjectPool) {
      const data = SUBJECTS.find((s) => s.subject === subjectName);
      if (!data) continue;
      for (const t of data.topics) {
        const matchesContentType =
          (!filters.contentTypes.video || t.hasVideo) &&
          (!filters.contentTypes.text || t.hasText) &&
          (!filters.contentTypes.quiz || t.hasQuiz);
        if (matchesContentType) results.push({ subject: subjectName, topic: t });
      }
    }
    return results;
  }, [filtersActive, filters, selectedSubject]);

  function removeContentTypeFilter(key: keyof SubjectFilters['contentTypes']) {
    setFilters((f) => ({ ...f, contentTypes: { ...f.contentTypes, [key]: false } }));
  }

  function removeSubjectFilter(subject: string) {
    setFilters((f) => ({ ...f, subjects: f.subjects.filter((s) => s !== subject) }));
  }

  function clearAllFilters() {
    setFilters(EMPTY_FILTERS);
  }

  function openLesson(subject: string, topic: Topic, weekLabel: string, entry: LessonEntry) {
    if (weekLabel === 'Quiz') {
      navigation.navigate('Quiz', {
        selection: { className, term, subject, themeNumber: topic.topicNumber },
        contentIndex: entry.summary.contentIndex,
      });
      return;
    }
    navigation.navigate('LessonReader', {
      selection: { className, term, subject, themeNumber: topic.topicNumber },
      contentIndex: entry.summary.contentIndex,
    });
  }

  // --- Level B: a single topic's week/lesson breakdown ---
  if (selectedTopic) {
    const firstWeek = selectedTopic.weeks[0];
    const lastLesson = firstWeek?.lessons[0];
    const favoriteId = `topic:${className}:${selectedSubject}:${selectedTopic.topic.topicNumber}`;
    const favorited = isFavorited(favoriteId);

    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}
        contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl }}
      >
        <View style={{ gap: theme.spacing.md }}>
          <Pressable
            onPress={() => setSelectedTopic(null)}
            accessibilityRole="button"
            accessibilityLabel={`Back to ${selectedSubject} topics`}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
          >
            <Ionicons name="arrow-back" size={16} color={theme.colors.accent1.primary} />
            <Text style={{ color: theme.colors.accent1.primary, fontSize: 16 }}>Back</Text>
          </Pressable>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: theme.spacing.md,
            }}
          >
            <View style={{ flex: 1, gap: theme.spacing.xs }}>
              <Text
                style={{
                  ...theme.typography.header.xl1.semibold,
                  color: theme.colors.greyscale.textPrimary,
                  textTransform: 'uppercase',
                }}
              >
                {selectedSubject}
              </Text>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
                {selectedTopic.topic.title}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
              <Pressable
                onPress={() =>
                  toggleFavorite({
                    id: favoriteId,
                    kind: 'topic',
                    title: selectedTopic.topic.title,
                    subtitle: selectedSubject,
                    navigate: {
                      screen: 'SubjectSelection',
                      params: { className, term, initialSubject: selectedSubject, initialTopicNumber: selectedTopic.topic.topicNumber },
                    },
                  })
                }
                accessibilityRole="button"
                accessibilityLabel={favorited ? 'Remove from favorites' : 'Add to favorites'}
                accessibilityState={{ selected: favorited }}
                style={{
                  width: theme.sizes.closeButton,
                  height: theme.sizes.closeButton,
                  borderRadius: theme.radii.lg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${theme.colors.accent1.tertiary}33`,
                }}
              >
                <Ionicons name={favorited ? 'heart' : 'heart-outline'} size={20} color={theme.colors.accent1.primary} />
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate('Tabs', { screen: 'Legibility' })}
                accessibilityRole="button"
                accessibilityLabel="Open legibility settings"
                style={{
                  width: theme.sizes.closeButton,
                  height: theme.sizes.closeButton,
                  borderRadius: theme.radii.lg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${theme.colors.accent1.tertiary}33`,
                }}
              >
                <Ionicons name="accessibility-outline" size={20} color={theme.colors.accent1.primary} />
              </Pressable>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: theme.colors.greyscale.stroke }} />
        </View>

        {isReturningStudent && lastLesson && (
          <View style={{ gap: theme.spacing.md }}>
            <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary }}>
              Continue From Last Lesson
            </Text>
            <Pressable
              onPress={() => openLesson(selectedSubject, selectedTopic.topic, firstWeek.label, lastLesson)}
              accessibilityRole="button"
              accessibilityLabel={`Continue ${selectedTopic.topic.title}, ${lastLesson.summary.title}, ${Math.round(lastLesson.progress * 100)} percent complete`}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.md }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, flex: 1 }}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: theme.radii.md,
                    backgroundColor: theme.colors.greyscale.bgDarken,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="book-outline" size={24} color={theme.colors.greyscale.textPrimary} />
                </View>
                <View style={{ gap: theme.spacing.xs, flex: 1 }}>
                  <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.textPrimary }}>
                    {selectedTopic.topic.title}
                  </Text>
                  <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary }}>
                    {lastLesson.summary.title}
                  </Text>
                  <Text style={{ color: theme.colors.accent1.primary, fontWeight: '600', fontSize: 13 }}>
                    Continue ›
                  </Text>
                </View>
              </View>
              <CircularProgress
                percent={Math.round(lastLesson.progress * 100)}
                color={theme.colors.accent1.primary}
                trackColor={theme.colors.greyscale.stroke}
              />
            </Pressable>
            <View style={{ height: 1, backgroundColor: theme.colors.greyscale.stroke }} />
          </View>
        )}

        <View style={{ gap: theme.spacing.lg }}>
          {selectedTopic.weeks.map((week) => (
            <View key={week.label} style={{ gap: theme.spacing.sm }}>
              <Text
                accessibilityRole="header"
                style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary }}
              >
                {week.label}
              </Text>
              <View style={{ gap: theme.spacing.sm }}>
                {week.lessons.map((entry) => (
                  <LessonCard
                    key={entry.summary.contentIndex}
                    theme={theme}
                    entry={entry}
                    week={week.label}
                    isQuiz={week.label === 'Quiz'}
                    onPress={() => openLesson(selectedSubject, selectedTopic.topic, week.label, entry)}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  // --- Level A: search + subject chips + topic-card list ---
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <View style={{ padding: theme.spacing.lg, gap: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.md }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: theme.spacing.md,
            }}
          >
            <View style={{ flex: 1, gap: theme.spacing.xs }}>
              <Text
                style={{
                  ...theme.typography.header.xl1.semibold,
                  color: theme.colors.greyscale.textPrimary,
                  textTransform: 'uppercase',
                }}
              >
                {className}
              </Text>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
                {SUBJECTS.length} Subjects
              </Text>
            </View>
            <Pressable
              onPress={() => navigation.navigate('Tabs', { screen: 'Legibility' })}
              accessibilityRole="button"
              accessibilityLabel="Open legibility settings"
              style={{
                width: theme.sizes.closeButton,
                height: theme.sizes.closeButton,
                borderRadius: theme.radii.lg,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${theme.colors.accent1.tertiary}33`,
              }}
            >
              <Ionicons name="accessibility-outline" size={20} color={theme.colors.accent1.primary} />
            </Pressable>
          </View>
          <View style={{ height: 1, backgroundColor: theme.colors.greyscale.stroke }} />
        </View>

        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for Subjects"
            placeholderTextColor={theme.colors.greyscale.textTertiary}
            accessibilityLabel="Search for subjects"
            style={{
              flex: 1,
              height: 48,
              borderWidth: 1,
              borderColor: theme.colors.greyscale.stroke,
              borderRadius: theme.radii.md,
              paddingHorizontal: theme.spacing.md,
              color: theme.colors.greyscale.textPrimary,
              backgroundColor: theme.colors.greyscale.bgLight,
            }}
          />
          <Pressable
            onPress={() => setFilterModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Filter subjects"
            style={{
              width: 48,
              height: 48,
              borderWidth: 1,
              borderColor: theme.colors.greyscale.stroke,
              borderRadius: theme.radii.md,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="options-outline" size={20} color={theme.colors.greyscale.textPrimary} />
          </Pressable>
        </View>

        {filtersActive && (
          <View
            accessibilityRole="list"
            accessibilityLabel="Active filters"
            style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}
          >
            {(['video', 'text', 'quiz'] as const)
              .filter((key) => filters.contentTypes[key])
              .map((key) => (
                <FilterChip
                  key={key}
                  theme={theme}
                  label={key === 'video' ? 'Video Included' : key === 'text' ? 'Text Included' : 'Quiz Included'}
                  onRemove={() => removeContentTypeFilter(key)}
                />
              ))}
            {filters.subjects.map((subject) => (
              <FilterChip key={subject} theme={theme} label={subject} onRemove={() => removeSubjectFilter(subject)} />
            ))}
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View accessibilityRole="tablist" accessibilityLabel="Subjects" style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            {filteredSubjects.map(({ subject }) => {
              const selected = subject === selectedSubject;
              return (
                <Pressable
                  key={subject}
                  onPress={() => setSelectedSubject(subject)}
                  accessibilityRole="button"
                  accessibilityLabel={`${subject}${selected ? ', selected' : ''}`}
                  accessibilityState={{ selected }}
                  style={{
                    height: 40,
                    paddingHorizontal: theme.spacing.md,
                    borderRadius: theme.radii.md,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: selected ? theme.colors.accent1.primary : theme.colors.greyscale.bgLight,
                    borderWidth: selected ? 0 : 1,
                    borderColor: theme.colors.greyscale.stroke,
                  }}
                >
                  <Text
                    style={{
                      ...theme.typography.body.sm.medium,
                      color: selected ? theme.colors.greyscale.bgLight : theme.colors.greyscale.textPrimary,
                    }}
                  >
                    {subject}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xl, gap: theme.spacing.md }}>
        {filtersActive ? (
          filteredTopics && filteredTopics.length === 0 ? (
            // Built from Figma frame 661:16700 ("No Filtered Result").
            // Illustration is a themed placeholder — no asset pipeline
            // wired in for Figma's Freepik character/folder graphic.
            <View style={{ alignItems: 'center', gap: theme.spacing.md, paddingTop: theme.spacing.xl2 }}>
              <Text style={{ fontSize: 64 }}>🗂️</Text>
              <Text style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textPrimary }}>
                No Filtered Result
              </Text>
              <Pressable onPress={clearAllFilters} accessibilityRole="button" accessibilityLabel="Clear filter">
                <Text style={{ color: theme.colors.system.error, fontWeight: '600' }}>Clear Filter</Text>
              </Pressable>
            </View>
          ) : (
            <View accessibilityRole="list" accessibilityLabel="Filtered topics" style={{ gap: theme.spacing.md }}>
              {filteredTopics?.map(({ subject, topic: t }) => (
                <TopicCard
                  key={`${subject}-${t.topic.topicNumber}`}
                  theme={theme}
                  topic={t}
                  onPress={() => {
                    setSelectedSubject(subject);
                    setSelectedTopic(t);
                  }}
                />
              ))}
            </View>
          )
        ) : status !== 'success' ? (
          <StateView status={status === 'loading' ? 'loading' : 'empty'} />
        ) : (
          <View accessibilityRole="list" accessibilityLabel={`${selectedSubject} topics`} style={{ gap: theme.spacing.md }}>
            {currentSubjectData?.topics.map((t) => (
              <TopicCard key={t.topic.topicNumber} theme={theme} topic={t} onPress={() => setSelectedTopic(t)} />
            ))}
          </View>
        )}
      </ScrollView>

      <SubjectFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onApply={setFilters}
        onClear={clearAllFilters}
        subjectOptions={SUBJECTS.map((s) => ({ subject: s.subject, topicCount: s.topics.length }))}
      />
    </View>
  );
}

function TopicCard({
  theme,
  topic: t,
  onPress,
}: {
  theme: ReturnType<typeof useTheme>;
  topic: TopicFixture;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${t.topic.title}, ${t.tagLine}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        height: 80,
        paddingHorizontal: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.greyscale.stroke,
        borderRadius: theme.radii.xl,
        backgroundColor: theme.colors.greyscale.bgLight,
      }}
    >
      <View
        style={{
          width: 48,
          height: 60,
          borderRadius: theme.radii.xl,
          backgroundColor: theme.colors.accent2.tertiary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="bar-chart-outline" size={20} color={theme.colors.greyscale.textPrimary} />
      </View>
      <View style={{ flex: 1, gap: theme.spacing.xs }}>
        <Text style={{ ...theme.typography.header.base.bold, color: theme.colors.greyscale.textPrimary }}>
          {t.topic.title}
        </Text>
        <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
          {t.tagLine}
        </Text>
      </View>
      <Text style={{ color: theme.colors.accent1.primary, fontSize: 18 }}>›</Text>
    </Pressable>
  );
}

const STATUS_LABEL: Record<LessonStatus, string> = {
  completed: 'Completed',
  in_progress: 'In Progress',
  not_started: 'Not Started',
};

function statusColor(theme: ReturnType<typeof useTheme>, status: LessonStatus): string {
  if (status === 'completed') return theme.colors.system.success;
  if (status === 'in_progress') return theme.colors.accent1.primary;
  return theme.colors.greyscale.textSecondary;
}

function LessonCard({
  theme,
  entry,
  week,
  isQuiz,
  onPress,
}: {
  theme: ReturnType<typeof useTheme>;
  entry: LessonEntry;
  week: string;
  isQuiz: boolean;
  onPress: () => void;
}) {
  const color = statusColor(theme, entry.status);
  const dateLabel = entry.date ?? (entry.streakDays !== undefined ? `days : ${entry.streakDays}` : undefined);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${entry.summary.title}, ${week}, ${STATUS_LABEL[entry.status]}`}
      style={{
        flexDirection: 'row',
        gap: theme.spacing.md,
        padding: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.greyscale.dividers,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.greyscale.bgDarken,
      }}
    >
      <View
        style={{
          width: 96,
          height: 96,
          borderRadius: theme.radii.md,
          backgroundColor: theme.colors.greyscale.white,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={isQuiz ? 'help-circle-outline' : 'book-outline'} size={28} color={theme.colors.greyscale.textPrimary} />
      </View>
      <View style={{ flex: 1, gap: theme.spacing.xs, justifyContent: 'center' }}>
        <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.textPrimary }}>
          {entry.summary.title}
        </Text>
        <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary }}>
          {isQuiz ? 'Quiz' : week} · Student: {entry.studentCount} · Text & Video
        </Text>
        <View
          style={{
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.colors.greyscale.dividers,
            overflow: 'hidden',
          }}
        >
          <View style={{ width: `${entry.progress * 100}%`, height: '100%', backgroundColor: color }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color, fontSize: 12 }}>{STATUS_LABEL[entry.status]}</Text>
          {dateLabel && (
            <Text style={{ ...theme.typography.body.xs.regular, color: theme.colors.greyscale.textSecondary }}>
              {dateLabel}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

function FilterChip({
  theme,
  label,
  onRemove,
}: {
  theme: ReturnType<typeof useTheme>;
  label: string;
  onRemove: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderWidth: 2,
        borderColor: theme.colors.accent1.tertiary,
        borderRadius: theme.radii.full,
        backgroundColor: theme.colors.greyscale.bgDarken,
      }}
    >
      <Text style={{ color: theme.colors.greyscale.textPrimary, fontSize: 14 }}>{label}</Text>
      <Pressable onPress={onRemove} accessibilityRole="button" accessibilityLabel={`Remove ${label} filter`}>
        <Ionicons name="close" size={14} color={theme.colors.system.error} />
      </Pressable>
    </View>
  );
}
