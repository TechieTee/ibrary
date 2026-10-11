import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { useThemeStore } from '../store/themeStore';
import { StateView } from '../components/StateView';
import { useQuiz } from '../hooks/useIbraryContent';

// Built from Figma frames:
//  - 661:16331 base question, 661:16332 correct-answer state (dark).
//  - The "wrong answer state" link sent was a duplicate of 661:16332
//    (only shows correct). Its dimmed background, and 661:16679's dimmed
//    background, both incidentally show the real wrong-answer visual
//    (red fill, ring, ✕ icon) — reconstructed from those rather than
//    blocking on a fresh link.
//  - 661:16676 "Congratulations!" pass modal, 661:16677 reaction-selected
//    state (reveals a "Next Assessment" button once a reaction is tapped),
//    661:16679 "You Did not Pass" modal.
//
// Uses the real fetch path (useQuiz → getQuiz → fixtureQuiz, per
// src/api/client.ts's ENDPOINTS_LIVE.quiz === false), same architecture as
// LessonReaderScreen's useLesson. QuizQuestion gained an `explanation?`
// field (src/api/types.ts) — genuine content the backend would provide,
// not a local-only UI hack. Only question 1 is Figma-exact; questions 2–7
// are fabricated filler so "1 of 7" has something real to count through
// (see src/api/fixtures.ts).
//
// The native stack header already shows "Quiz" + back (RootNavigator sets
// title: 'Quiz'), matching Figma's header exactly — no custom header
// built here.
//
// Scoring is fully client-side using the fixture's correctOptionId — the
// type comment already flags that a real backend may not send this to
// clients; revisit once quiz submission is a real endpoint.
//
// Inferred, not shown in Figma: what happens if the 29s timer hits zero
// unanswered — treated as an automatic wrong answer with a "Time's up!"
// message, flagged as my own reasonable addition. Pass/fail threshold
// (score ≥ 50%) is also inferred — Figma's own "22/34" example numbers
// don't correspond to this 7-question fixture quiz, so they're not
// reusable as a real threshold.
//
// Reaction row ("How do you feel?"), timer/question stats, and dark-mode
// switch reuse patterns already established elsewhere (useThemeStore
// toggle, RN Switch instead of the illustrated day/night graphic — same
// simplification as LegibilityScreen). Badge icon, folder-fail icon, and
// emoji reactions are text/emoji placeholders — no asset pipeline wired
// in.

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

const QUESTION_SECONDS = 29;
type Reaction = 'too_hard' | 'just_right' | 'too_easy';

export function QuizScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { selection, contentIndex } = route.params;
  const { status, data: quiz, error, retry } = useQuiz(selection, contentIndex);
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [resultModal, setResultModal] = useState<'pass' | 'fail' | null>(null);
  const [reaction, setReaction] = useState<Reaction | null>(null);

  const currentQuestion = quiz?.questions[currentIndex];
  const selectedOptionId = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isAnswered = selectedOptionId !== undefined;
  const isLastQuestion = quiz ? currentIndex === quiz.questions.length - 1 : false;

  // Countdown — pauses once the current question is answered; auto-marks
  // wrong (no selection) if it reaches zero unanswered.
  useEffect(() => {
    if (!currentQuestion || isAnswered) return;
    if (timeLeft <= 0) {
      setAnswers((a) => ({ ...a, [currentQuestion.id]: null }));
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isAnswered, currentQuestion]);

  function selectOption(optionId: string) {
    if (!currentQuestion || isAnswered) return;
    setAnswers((a) => ({ ...a, [currentQuestion.id]: optionId }));
  }

  function goToNextQuestion() {
    if (!quiz) return;
    setElapsedSeconds((s) => s + (QUESTION_SECONDS - timeLeft));
    if (isLastQuestion) {
      const correctCount = quiz.questions.filter((q) => answers[q.id] === q.correctOptionId).length;
      // Threshold inferred — see file-header comment.
      setResultModal(correctCount / quiz.questions.length >= 0.5 ? 'pass' : 'fail');
      return;
    }
    setCurrentIndex((i) => i + 1);
    setTimeLeft(QUESTION_SECONDS);
  }

  const correctCount = useMemo(
    () => (quiz ? quiz.questions.filter((q) => answers[q.id] === q.correctOptionId).length : 0),
    [quiz, answers],
  );

  if (status !== 'success' || !quiz || !currentQuestion) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight, paddingHorizontal: theme.spacing.xl, paddingTop: theme.spacing.xl2 }}>
        <StateView status={status === 'loading' ? 'loading' : status === 'empty' ? 'empty' : 'error'} error={error} onRetry={retry} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.xl,
          paddingTop: theme.spacing.xl2,
          paddingBottom: theme.spacing.xl,
          gap: theme.spacing.xl,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View
            style={{
              backgroundColor: `${theme.colors.accent1.tertiary}33`,
              borderRadius: theme.radii.md,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.xs,
            }}
          >
            <Text style={{ color: theme.colors.accent1.primary, fontWeight: '600' }}>
              {currentIndex + 1} of {quiz.questions.length}
            </Text>
          </View>
          <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.textPrimary }}>
            {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
          </Text>
          <Switch
            value={mode === 'dark'}
            onValueChange={(v) => setMode(v ? 'dark' : 'light')}
            trackColor={{ false: theme.colors.greyscale.stroke, true: theme.colors.accent1.primary }}
            thumbColor={theme.colors.greyscale.white}
            accessibilityLabel="Switch to dark theme"
            accessibilityRole="switch"
          />
        </View>

        <Text style={{ ...theme.typography.header.xl2.semibold, color: theme.colors.greyscale.textPrimary }}>
          {currentQuestion.prompt}
        </Text>

        <View accessibilityRole="radiogroup" accessibilityLabel="Answer options" style={{ gap: theme.spacing.md }}>
          {currentQuestion.options.map((option, i) => {
            const letter = String.fromCharCode(65 + i);
            const isSelected = selectedOptionId === option.id;
            const isCorrectOption = option.id === currentQuestion.correctOptionId;
            let bg = theme.colors.greyscale.bgDarken;
            let border = theme.colors.greyscale.stroke;
            let textColor = theme.colors.greyscale.textPrimary;
            if (isAnswered && isCorrectOption) {
              bg = theme.colors.system.success;
              border = theme.colors.system.success;
              textColor = theme.colors.greyscale.bgLight;
            } else if (isAnswered && isSelected && !isCorrectOption) {
              bg = theme.colors.system.error;
              border = theme.colors.system.error;
              textColor = theme.colors.greyscale.bgLight;
            }
            return (
              <View key={option.id} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
                <Text style={{ ...theme.typography.header.xl2.semibold, color: theme.colors.greyscale.textPrimary, width: 24 }}>
                  {letter}
                </Text>
                <Pressable
                  onPress={() => selectOption(option.id)}
                  disabled={isAnswered}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected, disabled: isAnswered }}
                  accessibilityLabel={`Option ${letter}, ${option.text}`}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: 64,
                    paddingHorizontal: theme.spacing.md,
                    borderWidth: 1,
                    borderColor: border,
                    borderRadius: theme.radii.xl,
                    backgroundColor: bg,
                  }}
                >
                  <Text style={{ ...theme.typography.body.lg.semibold, color: textColor, flex: 1 }}>{option.text}</Text>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: isAnswered && (isCorrectOption || isSelected) ? theme.colors.greyscale.bgLight : theme.colors.accent1.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isAnswered && isSelected && (
                      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: theme.colors.greyscale.bgLight }} />
                    )}
                  </View>
                </Pressable>
              </View>
            );
          })}
        </View>

        <View style={{ alignItems: 'center', gap: theme.spacing.xl }}>
          {isAnswered && (
            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
              <Text
                style={{
                  ...theme.typography.header.base.semibold,
                  color: selectedOptionId === currentQuestion.correctOptionId ? theme.colors.system.success : theme.colors.system.error,
                }}
              >
                {selectedOptionId === null
                  ? "Time's up!"
                  : selectedOptionId === currentQuestion.correctOptionId
                    ? "That's the RIGHT Answer  (+10 Coins)"
                    : "That's the WRONG Answer"}
              </Text>
              {currentQuestion.explanation && (
                <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
                  {currentQuestion.explanation}
                </Text>
              )}
            </View>
          )}

          <Pressable
            onPress={goToNextQuestion}
            disabled={!isAnswered}
            accessibilityRole="button"
            accessibilityLabel={isLastQuestion ? 'Finish quiz' : 'Next question'}
            style={{
              width: '100%',
              height: theme.sizes.ctaButtonHeight,
              borderRadius: theme.radii.full,
              backgroundColor: theme.colors.accent1.primary,
              opacity: isAnswered ? 1 : 0.4,
              alignItems: 'center',
              justifyContent: 'center',
              ...theme.shadows.xs,
            }}
          >
            <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {resultModal && (
        <QuizResultModal
          theme={theme}
          passed={resultModal === 'pass'}
          score={correctCount}
          total={quiz.questions.length}
          elapsedSeconds={elapsedSeconds}
          reaction={reaction}
          onSelectReaction={setReaction}
          onNextAssessment={() => {
            // Close the modal too — QuizScreen stays mounted underneath
            // the pushed SubjectSelection screen, so without this the
            // modal would still be open if the learner navigates back.
            setResultModal(null);
            // Returns to the topic content screen (SubjectSelectionScreen's
            // Level B — the Week/lesson breakdown) this quiz was opened
            // from, via the optional initialSubject/initialTopicNumber
            // params (src/navigation/types.ts). Still a placeholder in the
            // sense that there's no real "next assessment" queue — it just
            // goes back to where the learner came from.
            navigation.navigate('SubjectSelection', {
              className: selection.className,
              term: selection.term,
              initialSubject: selection.subject,
              initialTopicNumber: selection.themeNumber,
            });
          }}
        />
      )}
    </View>
  );
}

function formatElapsed(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}s`;
}

// These stay real unicode emoji on purpose (a reaction picker, like Slack/
// Discord reactions) rather than being swapped for vector icons — the
// expressive face is the point, a monochrome icon would be a downgrade.
const REACTIONS: { key: Reaction; emoji: string; label: string }[] = [
  { key: 'too_hard', emoji: '🥵', label: 'Too Hard' },
  { key: 'just_right', emoji: '🙂', label: 'Just Right' },
  { key: 'too_easy', emoji: '😋', label: 'Too Easy' },
];

function QuizResultModal({
  theme,
  passed,
  score,
  total,
  elapsedSeconds,
  reaction,
  onSelectReaction,
  onNextAssessment,
}: {
  theme: ReturnType<typeof useTheme>;
  passed: boolean;
  score: number;
  total: number;
  elapsedSeconds: number;
  reaction: Reaction | null;
  onSelectReaction: (r: Reaction) => void;
  onNextAssessment: () => void;
}) {
  return (
    <Modal visible transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
        <View
          accessibilityViewIsModal
          style={{
            backgroundColor: theme.colors.greyscale.bgLight,
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
            padding: theme.spacing.xl,
            gap: theme.spacing.xl2,
            alignItems: 'center',
          }}
        >
          <View style={{ alignItems: 'center', gap: theme.spacing.md }}>
            <Ionicons
              name={passed ? 'ribbon' : 'sad-outline'}
              size={64}
              color={passed ? theme.colors.accent1.primary : theme.colors.greyscale.textSecondary}
            />
            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
              <Text
                style={{
                  ...theme.typography.display.xl2.semibold,
                  color: passed ? theme.colors.system.success : theme.colors.system.error,
                  textAlign: 'center',
                }}
              >
                {passed ? `You Passed - ${score}/${total} (Outstanding)` : `You Did not Pass - ${score}/${total}`}
              </Text>
              {passed ? (
                <Text style={{ ...theme.typography.body.base.semibold, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
                  You have earned the iBrary{' '}
                  <Text style={{ color: theme.colors.accent1.primary, fontWeight: '700' }}>Most Dedicated</Text> Badge
                </Text>
              ) : (
                <Text style={{ ...theme.typography.body.base.semibold, color: theme.colors.greyscale.textPrimary }}>
                  Please try again.
                </Text>
              )}
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: theme.colors.greyscale.stroke,
              borderRadius: theme.radii.xl,
              width: '100%',
              paddingVertical: theme.spacing.lg,
            }}
          >
            <View style={{ flex: 1, alignItems: 'center', gap: theme.spacing.xs }}>
              <Text style={{ ...theme.typography.header.xl2.semibold, color: theme.colors.greyscale.textPrimary }}>{total}</Text>
              <Text style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textSecondary }}>Questions</Text>
            </View>
            <View style={{ width: 1, backgroundColor: theme.colors.greyscale.dividers }} />
            <View style={{ flex: 1, alignItems: 'center', gap: theme.spacing.xs }}>
              <Text style={{ ...theme.typography.header.xl2.semibold, color: theme.colors.greyscale.textPrimary }}>
                {formatElapsed(elapsedSeconds)}
              </Text>
              <Text style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textSecondary }}>Timer</Text>
            </View>
          </View>

          <View
            style={{
              width: '100%',
              borderWidth: 1,
              borderColor: theme.colors.greyscale.stroke,
              borderRadius: theme.radii.xl,
              padding: theme.spacing.lg,
              gap: theme.spacing.lg,
            }}
          >
            <View style={{ gap: theme.spacing.xs }}>
              <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.textPrimary }}>
                How do you feel?
              </Text>
              <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary }}>
                Your feedback will help us provide more suitable Learnings for you
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              {REACTIONS.map(({ key, emoji, label }) => {
                const selected = reaction === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => onSelectReaction(key)}
                    accessibilityRole="button"
                    accessibilityLabel={label}
                    accessibilityState={{ selected }}
                    style={{ alignItems: 'center', gap: theme.spacing.xs }}
                  >
                    <Text style={{ fontSize: 28, opacity: selected ? 1 : 0.5 }}>{emoji}</Text>
                    <Text
                      style={{
                        ...theme.typography.header.base.semibold,
                        color: selected ? theme.colors.greyscale.textPrimary : theme.colors.greyscale.textSecondary,
                      }}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {reaction && (
            <Pressable
              onPress={onNextAssessment}
              // Still a placeholder in spirit — there's no real "next
              // assessment" queue, so this returns to the topic content
              // screen the quiz was opened from rather than advancing to
              // an actual next assessment.
              accessibilityRole="button"
              accessibilityLabel="Next assessment"
              style={{
                width: '100%',
                height: theme.sizes.ctaButtonHeight,
                borderRadius: theme.radii.full,
                backgroundColor: theme.colors.accent1.primary,
                alignItems: 'center',
                justifyContent: 'center',
                ...theme.shadows.xs,
              }}
            >
              <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.bgLight }}>
                Next Assessment
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}
