import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TabParamList, RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { CircularProgress } from '../components/CircularProgress';
import {
  SubjectFilterModal,
  EMPTY_FILTERS,
  isFiltersEmpty,
  type SubjectFilters,
} from '../components/SubjectFilterModal';

// Built from Figma frames 661:16373 (dark) / 654:23976 (light) — the
// Assessment tab. Structurally close to SubjectSelectionScreen's Level A
// (search, filter modal, subject chips reused from there), plus two things
// that screen doesn't have: a 1st/2nd/3rd Term pill selector, and topic
// cards that go straight to a Quiz (no lesson content in between) tagged
// "N Questions" instead of "Video • Text • Quiz".
//
// Token note: the term-selector pill track swaps color with mode — light
// mode uses a literal #181818 (= Light/Greyscale/Text-primary) as its
// background, dark mode uses #D9D9D9 (= Dark/Grayscale/Text-primary) —
// same "reuse the opposite-mode text color as background" pattern seen
// elsewhere, mapped here to greyscale.textPrimary (not greyscale.white,
// which is what a similar-looking track elsewhere in the app used —
// flagging that difference for review, not fixing it retroactively here).
//
// No "current class" concept exists in the app yet (no profile/selected-
// class state) — className passed to ContentSelection reuses the same
// term-label convention established for the Classes flow (e.g. "1st
// Term"), driven by this screen's own term selector.
//
// Topic question counts for Mathematics are Figma-exact; other subjects
// and their single placeholder topic are fabricated filler, flagged.
// "Latest Activity" cards are static mock content (not wired to any real
// last-accessed tracking) — non-interactive here rather than faking a
// destination.

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Assessment'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface AssessmentTopic {
  topicNumber: number;
  title: string;
  questionCount: number;
}

interface AssessmentSubject {
  subject: string;
  topics: AssessmentTopic[];
}

const ASSESSMENT_SUBJECTS: AssessmentSubject[] = [
  {
    subject: 'Mathematics',
    topics: [
      { topicNumber: 1, title: 'Number Bases', questionCount: 24 },
      { topicNumber: 2, title: 'Logarithms', questionCount: 12 },
      { topicNumber: 3, title: 'Indices (Laws of Indices)', questionCount: 68 },
      { topicNumber: 4, title: 'Algebraic Processes', questionCount: 24 },
      { topicNumber: 5, title: 'Linear Equations', questionCount: 24 },
    ],
  },
  { subject: 'English', topics: [{ topicNumber: 1, title: 'Parts of Speech', questionCount: 15 }] },
  { subject: 'Chemistry', topics: [{ topicNumber: 1, title: 'States of Matter', questionCount: 15 }] },
  { subject: 'Physics', topics: [{ topicNumber: 1, title: 'Measurement and Units', questionCount: 15 }] },
];

const TERMS: { value: 1 | 2 | 3; label: string }[] = [
  { value: 1, label: '1ST TERM' },
  { value: 2, label: '2ND TERM' },
  { value: 3, label: '3RD TERM' },
];

const LATEST_ACTIVITY = [
  { title: 'Number Bases', subtitle: 'Meaning of Number Bases:', percent: 45 },
  { title: 'Logarithms', subtitle: 'Logarithmic Notation and Forms', percent: 45 },
  { title: 'Indices (Laws of Indices)', subtitle: 'Positive Integral Indices', percent: 45 },
];

export function AssessmentScreen({ navigation }: Props) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<1 | 2 | 3>(1);
  const [selectedSubject, setSelectedSubject] = useState(ASSESSMENT_SUBJECTS[0].subject);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<SubjectFilters>(EMPTY_FILTERS);
  const filtersActive = !isFiltersEmpty(filters);

  const termLabel = TERMS.find((t) => t.value === selectedTerm)!.label;
  const classNameForSelection = termLabel.charAt(0) + termLabel.slice(1).toLowerCase().replace('term', 'Term');

  const filteredSubjects = useMemo(
    () => ASSESSMENT_SUBJECTS.filter((s) => s.subject.toLowerCase().includes(searchQuery.trim().toLowerCase())),
    [searchQuery],
  );

  const currentSubjectData = ASSESSMENT_SUBJECTS.find((s) => s.subject === selectedSubject);

  const visibleTopics = useMemo(() => {
    if (!filtersActive) return currentSubjectData?.topics.map((t) => ({ subject: selectedSubject, topic: t })) ?? [];
    const subjectPool = filters.subjects.length > 0 ? filters.subjects : [selectedSubject];
    return subjectPool.flatMap((subjectName) => {
      const data = ASSESSMENT_SUBJECTS.find((s) => s.subject === subjectName);
      return data ? data.topics.map((t) => ({ subject: subjectName, topic: t })) : [];
    });
  }, [filtersActive, filters, selectedSubject]);

  function openQuiz(subject: string, topic: AssessmentTopic) {
    // No stable content-index system ties this Assessment list to real
    // backend content yet — topicNumber is reused as both themeNumber and
    // contentIndex, flagged as a placeholder.
    navigation.navigate('Quiz', {
      selection: { className: classNameForSelection, subject, themeNumber: topic.topicNumber, term: selectedTerm },
      contentIndex: topic.topicNumber,
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.lg, paddingBottom: theme.spacing.xl2 }}>
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
                  ...theme.typography.header.xl3.semibold,
                  color: theme.colors.greyscale.textPrimary,
                  textTransform: 'uppercase',
                }}
              >
                Assessment
              </Text>
              <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary }}>
                Test yourself with practice questions
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

        <View style={{ flexDirection: 'row', backgroundColor: theme.colors.greyscale.textPrimary, borderRadius: theme.radii.full, padding: 4 }}>
          {TERMS.map(({ value, label }) => {
            const selected = selectedTerm === value;
            return (
              <Pressable
                key={value}
                onPress={() => setSelectedTerm(value)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={label}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: theme.radii.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: selected ? theme.colors.accent1.primary : 'transparent',
                }}
              >
                <Text style={{ color: selected ? theme.colors.greyscale.white : theme.colors.greyscale.bgLight, fontWeight: selected ? '700' : '500' }}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for Classes"
            placeholderTextColor={theme.colors.greyscale.textTertiary}
            accessibilityLabel="Search for classes"
            style={{
              flex: 1,
              height: 48,
              borderWidth: 1,
              borderColor: theme.colors.greyscale.stroke,
              borderRadius: theme.radii.md,
              paddingHorizontal: theme.spacing.md,
              color: theme.colors.greyscale.textPrimary,
              backgroundColor: theme.colors.greyscale.bgDarken,
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

        <View style={{ gap: theme.spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <View style={{ gap: theme.spacing.xs }}>
              <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.textPrimary }}>
                Academic Subjects
              </Text>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
                Choose a subject you would like to focus on
              </Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="See all subjects">
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary, fontWeight: '600' }}>
                See All
              </Text>
            </Pressable>
          </View>

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
                    <Text style={{ ...theme.typography.body.sm.medium, color: selected ? theme.colors.greyscale.white : theme.colors.greyscale.textPrimary }}>
                      {subject}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {filtersActive && (
            <View accessibilityRole="list" accessibilityLabel="Active filters" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
              {(['video', 'text', 'quiz'] as const)
                .filter((key) => filters.contentTypes[key])
                .map((key) => (
                  <View
                    key={key}
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
                    <Text style={{ color: theme.colors.greyscale.textPrimary, fontSize: 14 }}>
                      {key === 'video' ? 'Video Included' : key === 'text' ? 'Text Included' : 'Quiz Included'}
                    </Text>
                    <Pressable
                      onPress={() => setFilters((f) => ({ ...f, contentTypes: { ...f.contentTypes, [key]: false } }))}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${key} filter`}
                    >
                      <Ionicons name="close" size={16} color={theme.colors.system.error} />
                    </Pressable>
                  </View>
                ))}
              {filters.subjects.map((subject) => (
                <View
                  key={subject}
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
                  <Text style={{ color: theme.colors.greyscale.textPrimary, fontSize: 14 }}>{subject}</Text>
                  <Pressable
                    onPress={() => setFilters((f) => ({ ...f, subjects: f.subjects.filter((s) => s !== subject) }))}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${subject} filter`}
                  >
                    <Ionicons name="close" size={16} color={theme.colors.system.error} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <View accessibilityRole="list" accessibilityLabel="Topics" style={{ gap: theme.spacing.md }}>
            {visibleTopics.map(({ subject, topic }) => (
              <Pressable
                key={`${subject}-${topic.topicNumber}`}
                onPress={() => openQuiz(subject, topic)}
                accessibilityRole="button"
                accessibilityLabel={`${topic.title}, ${topic.questionCount} questions`}
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
                    {topic.title}
                  </Text>
                  <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
                    {topic.questionCount} Questions
                  </Text>
                </View>
                <Text style={{ color: theme.colors.accent1.primary, fontSize: 18 }}>›</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ gap: theme.spacing.md }}>
          <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.textPrimary }}>
            Latest Activity
          </Text>
          {LATEST_ACTIVITY.map((item) => (
            <View
              key={item.title}
              accessibilityRole="text"
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
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
                    {item.title}
                  </Text>
                  <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary }}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>
              <CircularProgress percent={item.percent} color={theme.colors.accent1.primary} trackColor={theme.colors.greyscale.stroke} />
            </View>
          ))}
        </View>
      </ScrollView>

      <SubjectFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onApply={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
        subjectOptions={ASSESSMENT_SUBJECTS.map((s) => ({ subject: s.subject, topicCount: s.topics.length }))}
      />
    </View>
  );
}
