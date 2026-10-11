import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TabParamList, RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { CircularProgress } from '../components/CircularProgress';
import {
  SubjectFilterModal,
  EMPTY_FILTERS,
  isFiltersEmpty,
  type SubjectFilters,
} from '../components/SubjectFilterModal';
import { PremiumGateModal, type PremiumGateVariant } from '../components/PremiumGateModal';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { VoiceSearchPanel, type VoiceSearchMode } from '../components/VoiceSearchPanel';

// Built from Figma frames 661:16368 (dark, initial viewport) and 586:30611
// (light — the full scrollable content; both "on scroll" links sent
// pointed to this same node, and it resolves only Light/* variables, so
// there's no separate dark "on scroll" frame — flagging rather than
// guessing one). Together they cover the whole screen: greeting header,
// search + voice + filter, gamification pills, a Term-card carousel,
// Academic Subjects (chips + topic cards), and Latest Activity.
//
// FABRICATED / DECORATIVE, no backing data model in api/types.ts — flagged
// rather than invented as real:
//  - "Hi, JOEL" — no user/profile concept exists yet; name is a stand-in.
//  - Leader's Board / Points / class badge pills — no gamification system.
//  - Voice-search mic button — decorative, no speech-to-text wired.
//  - Term-card carousel's rating/participant-avatar numbers — static mock
//    values matching Figma's example data (avatars are colored circles,
//    no image asset pipeline).
//
// Voice search (built from 753:45965/66/67 — see VoiceSearchPanel.tsx):
// tapping the mic swaps the search/voice/filter row for the panel, which
// auto-advances from "listening" to "speaking" after a few seconds and
// closes on interrupt/cancel. No real speech recognition is wired up.
//
// Real integrations (not just decoration):
//  - Term cards navigate to SubjectSelection({ className: <term label>,
//    term: N }) — same entry point ClassesScreen already uses.
//  - Topic cards navigate to SubjectSelection with initialSubject /
//    initialTopicNumber (src/navigation/types.ts) to jump straight into
//    that topic's Week/lesson breakdown, same mechanism QuizScreen's
//    "Next Assessment" uses.
//  - "Continue" on a Latest Activity row opens LessonReader (via the
//    existing single-fixture useLesson path, same as everywhere else).
//  - Search/filter reuse SubjectFilterModal from the Classes flow rather
//    than a new implementation.
//
// Premium gating (built from 661:16706 "Subscription Expired" / 661:16707
// "Unlock with Pro" — see PremiumGateModal.tsx): opening a term, a topic,
// or "Continue" on Latest Activity all go through requirePremium() first.
// There's no real payment backend, so this checks a mock
// useSubscriptionStore status instead — toggle it from ProfileScreen's
// dev controls to test each state. 'active' lets the action through;
// 'none'/'expired' show the matching modal instead.

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface TermCardData {
  term: 1 | 2 | 3;
  label: string;
  subjectCount: number;
  participantsLabel: string;
  rating: number;
}

const TERM_CARDS: TermCardData[] = [
  { term: 1, label: '1st Term', subjectCount: 12, participantsLabel: '20+ People Participating', rating: 4.5 },
  { term: 2, label: '2nd Term', subjectCount: 17, participantsLabel: '20+ People Participating', rating: 4.5 },
  { term: 3, label: '3rd Term', subjectCount: 9, participantsLabel: '20+ People Participating', rating: 4.5 },
];

interface HomeSubject {
  subject: string;
  topics: { topicNumber: number; title: string }[];
}

const HOME_SUBJECTS: HomeSubject[] = [
  {
    subject: 'Mathematics',
    topics: [
      { topicNumber: 1, title: 'Number Bases' },
      { topicNumber: 2, title: 'Logarithms' },
      { topicNumber: 3, title: 'Indices (Laws of Indices)' },
    ],
  },
  { subject: 'English', topics: [{ topicNumber: 1, title: 'Parts of Speech' }] },
  { subject: 'Chemistry', topics: [{ topicNumber: 1, title: 'States of Matter' }] },
  { subject: 'Physics', topics: [{ topicNumber: 1, title: 'Measurement and Units' }] },
];

const LATEST_ACTIVITY = [
  { title: 'Number Bases', subtitle: 'Meaning of Number Bases:', percent: 45 },
  { title: 'Logarithms', subtitle: 'Logarithmic Notation and Forms', percent: 45 },
  { title: 'Indices (Laws of Indices)', subtitle: 'Positive Integral Indices', percent: 45 },
];

export function HomeScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(
    () => route.params?.selectedSubject ?? HOME_SUBJECTS[0].subject,
  );
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<SubjectFilters>(EMPTY_FILTERS);
  const [favorited, setFavorited] = useState(false);
  const filtersActive = !isFiltersEmpty(filters);
  const subscriptionStatus = useSubscriptionStore((s) => s.status);
  const [premiumGate, setPremiumGate] = useState<PremiumGateVariant | null>(null);
  const [voiceMode, setVoiceMode] = useState<VoiceSearchMode | null>(null);

  useEffect(() => {
    if (voiceMode !== 'listening') return;
    const timer = setTimeout(() => setVoiceMode('speaking'), 2500);
    return () => clearTimeout(timer);
  }, [voiceMode]);

  function requirePremium(action: () => void) {
    if (subscriptionStatus === 'active') {
      action();
    } else {
      setPremiumGate(subscriptionStatus === 'expired' ? 'expired' : 'unlock');
    }
  }

  // Picks up a subject chosen on AllSubjectsScreen after "Continue" —
  // route.params.selectedSubject changes on that return navigation even
  // though this screen stays mounted (it's a tab), so the lazy useState
  // initializer above only catches the very first mount.
  useEffect(() => {
    if (route.params?.selectedSubject) setSelectedSubject(route.params.selectedSubject);
  }, [route.params?.selectedSubject]);

  const currentSubjectData = HOME_SUBJECTS.find((s) => s.subject === selectedSubject);

  const visibleTopics = useMemo(() => {
    if (!filtersActive) return currentSubjectData?.topics.map((t) => ({ subject: selectedSubject, topic: t })) ?? [];
    const subjectPool = filters.subjects.length > 0 ? filters.subjects : [selectedSubject];
    return subjectPool.flatMap((subjectName) => {
      const data = HOME_SUBJECTS.find((s) => s.subject === subjectName);
      return data ? data.topics.map((t) => ({ subject: subjectName, topic: t })) : [];
    });
  }, [filtersActive, filters, selectedSubject, currentSubjectData]);

  function openTerm(term: TermCardData) {
    requirePremium(() => navigation.navigate('SubjectSelection', { className: term.label, term: term.term }));
  }

  function openTopic(subject: string, topicNumber: number) {
    requirePremium(() =>
      navigation.navigate('SubjectSelection', {
        className: '1st Term',
        term: 1,
        initialSubject: subject,
        initialTopicNumber: topicNumber,
      }),
    );
  }

  function continueLesson() {
    requirePremium(() =>
      navigation.navigate('LessonReader', {
        selection: { className: '1st Term', subject: 'Mathematics', themeNumber: 1, term: 1 },
        contentIndex: 1,
      }),
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl, paddingBottom: theme.spacing.xl2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: theme.spacing.md }}>
          <View style={{ flex: 1, gap: theme.spacing.xs }}>
            <Text style={{ ...theme.typography.display.xl4.semibold, color: theme.colors.greyscale.textPrimary }}>
              Hi, <Text style={{ color: theme.colors.accent1.primary }}>JOEL</Text>
            </Text>
            <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
              Ready to improve your knowledge today?
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
            <Pressable
              onPress={() => setFavorited((v) => !v)}
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
              onPress={() => navigation.navigate('Notification')}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              style={{
                width: theme.sizes.closeButton,
                height: theme.sizes.closeButton,
                borderRadius: theme.radii.lg,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${theme.colors.accent1.tertiary}33`,
              }}
            >
              <Ionicons name="notifications-outline" size={20} color={theme.colors.accent1.primary} />
            </Pressable>
          </View>
        </View>

        {voiceMode ? (
          <VoiceSearchPanel
            mode={voiceMode}
            onInterrupt={() => setVoiceMode(null)}
            onClose={() => setVoiceMode(null)}
          />
        ) : (
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
              onPress={() => setVoiceMode('listening')}
              accessibilityRole="button"
              accessibilityLabel="Voice search"
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
              <Ionicons name="mic-outline" size={20} color={theme.colors.greyscale.textPrimary} />
            </Pressable>
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
        )}

        {/* Gamification pills — decorative, no backing data model. */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing.xs,
                height: 40,
                paddingHorizontal: theme.spacing.md,
                borderWidth: 1,
                borderColor: theme.colors.system.success,
                borderRadius: theme.radii.full,
              }}
            >
              <Ionicons name="trophy" size={16} color={theme.colors.system.success} />
              <Text style={{ color: theme.colors.system.success, fontWeight: '600' }}>Leader's Board : 12/50 ›</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing.xs,
                height: 40,
                paddingHorizontal: theme.spacing.md,
                borderWidth: 1,
                borderColor: theme.colors.accent1.primary,
                borderRadius: theme.radii.full,
              }}
            >
              <Ionicons name="flame" size={16} color={theme.colors.accent1.primary} />
              <Text style={{ color: theme.colors.greyscale.textPrimary, fontWeight: '600' }}>560 Pts</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing.xs,
                height: 40,
                paddingHorizontal: theme.spacing.md,
                borderWidth: 1,
                borderColor: theme.colors.accent2.primary,
                borderRadius: theme.radii.full,
              }}
            >
              <Ionicons name="water" size={16} color={theme.colors.accent2.primary} />
              <Text style={{ color: theme.colors.greyscale.textPrimary, fontWeight: '600' }}>SS 2 ▾</Text>
            </View>
          </View>
        </ScrollView>

        <View style={{ gap: theme.spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <View style={{ gap: theme.spacing.xs }}>
              <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.textPrimary }}>
                Secondary School Terms
              </Text>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
                Choose a term you would like to focus on
              </Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="See all terms">
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary, fontWeight: '600' }}>
                See All
              </Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
              {TERM_CARDS.map((term) => (
                <Pressable
                  key={term.term}
                  onPress={() => openTerm(term)}
                  accessibilityRole="button"
                  accessibilityLabel={`${term.label}, ${term.subjectCount} subjects, rated ${term.rating} out of 5`}
                  style={{ width: 300, borderRadius: theme.radii.xl, overflow: 'hidden' }}
                >
                  <View
                    style={{
                      height: 200,
                      backgroundColor: theme.colors.greyscale.bgDarken,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Figma shows a real cover photo here — not an icon,
                        so left as this emoji placeholder; still needs a
                        real downloaded asset, not an icon-font swap. */}
                    <Text style={{ fontSize: 40 }}>📚</Text>
                  </View>
                  <View style={{ backgroundColor: theme.colors.greyscale.bgDarken, padding: theme.spacing.md, gap: theme.spacing.md }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ gap: theme.spacing.xs }}>
                        <Text style={{ ...theme.typography.header.lg.semibold, color: theme.colors.greyscale.textPrimary }}>
                          {term.label}
                        </Text>
                        <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary }}>
                          {term.subjectCount} Subjects
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4,
                          paddingHorizontal: theme.spacing.sm,
                          paddingVertical: theme.spacing.xs,
                          borderRadius: theme.radii.md / 2,
                          backgroundColor: `${theme.colors.accent1.tertiary}33`,
                        }}
                      >
                        <Ionicons name="star" size={14} color={theme.colors.accent1.primary} />
                        <Text style={{ ...theme.typography.display.xs.semibold, color: theme.colors.greyscale.textPrimary }}>
                          {term.rating}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textPrimary, flex: 1 }}>
                        {term.participantsLabel}
                      </Text>
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: theme.colors.accent1.primary,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Ionicons name="arrow-forward" size={16} color={theme.colors.greyscale.white} />
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>
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
            <Pressable
              onPress={() => navigation.navigate('AllSubjects', { initialSubject: selectedSubject })}
              accessibilityRole="button"
              accessibilityLabel="See all subjects"
            >
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary, fontWeight: '600' }}>
                See All
              </Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View accessibilityRole="tablist" accessibilityLabel="Subjects" style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
              {HOME_SUBJECTS.map(({ subject }) => {
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

          {filtersActive && visibleTopics.length === 0 ? (
            // Built from Figma frame 661:16705 ("No Filtered Result").
            // Illustration is a themed placeholder — no asset pipeline
            // wired in for Figma's Freepik character/folder graphic.
            <View style={{ alignItems: 'center', gap: theme.spacing.md, paddingVertical: theme.spacing.xl2 }}>
              <Text style={{ fontSize: 64 }}>🗂️</Text>
              <Text style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textPrimary }}>
                No Filtered Result
              </Text>
              <Pressable
                onPress={() => setFilters(EMPTY_FILTERS)}
                accessibilityRole="button"
                accessibilityLabel="Clear filter"
              >
                <Text style={{ color: theme.colors.system.error, fontWeight: '600' }}>Clear Filter</Text>
              </Pressable>
            </View>
          ) : (
            <View accessibilityRole="list" accessibilityLabel="Topics" style={{ gap: theme.spacing.md }}>
              {visibleTopics.map(({ subject, topic }) => (
                <Pressable
                  key={`${subject}-${topic.topicNumber}`}
                  onPress={() => openTopic(subject, topic.topicNumber)}
                  accessibilityRole="button"
                  accessibilityLabel={`${topic.title}, 1st Term - Video, Text, Quiz`}
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
                      1st Term - Video • Text • Quiz
                    </Text>
                  </View>
                  <Text style={{ color: theme.colors.accent1.primary, fontSize: 18 }}>›</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={{ gap: theme.spacing.md }}>
          <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.textPrimary }}>
            Latest Activity
          </Text>
          {LATEST_ACTIVITY.map((item) => (
            <Pressable
              key={item.title}
              onPress={continueLesson}
              accessibilityRole="button"
              accessibilityLabel={`Continue ${item.title}, ${item.percent} percent complete`}
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
                  <Text style={{ color: theme.colors.accent1.primary, fontWeight: '600', fontSize: 13 }}>Continue ›</Text>
                </View>
              </View>
              <CircularProgress percent={item.percent} color={theme.colors.accent1.primary} trackColor={theme.colors.greyscale.stroke} />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <SubjectFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onApply={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
        subjectOptions={HOME_SUBJECTS.map((s) => ({ subject: s.subject, topicCount: s.topics.length }))}
      />

      <PremiumGateModal
        variant={premiumGate}
        onClose={() => setPremiumGate(null)}
        onChoosePlan={() => {
          setPremiumGate(null);
          navigation.navigate('Pricing');
        }}
      />
    </View>
  );
}
