import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { ThemeTogglePill } from '../components/ThemeTogglePill';
import { SignUpHeader } from '../components/SignUpHeader';
import { useAssessmentStore, DEFAULT_ASSESSMENT_ANSWERS, type AssessmentAnswers } from '../store/assessmentStore';
import {
  GenderStep,
  ClassStep,
  ClassPathStep,
  InterestedSubjectsStep,
  LearningLevelStep,
  PhysicalLimitationsStep,
  DaysToCommitStep,
} from '../components/assessment/AssessmentStepViews';

// The 7-step "Assessment" survey, used in two places sharing this one
// screen (repurposed, not duplicated, per direction):
//  - Signup (mode: 'signup', the default): between email verification and
//    pricing. Answers start from DEFAULT_ASSESSMENT_ANSWERS; the last
//    step's CTA reads "Continue to Pricing" and hands off to PricingScreen.
//  - Edit (mode: 'edit'), reached from Personal Information -> "Onboarding
//    Assessment" (661:16314/16326/16328/16330/16318/16322/16324 — the
//    same 7 step frames as signup, each additionally showing a bottom
//    CANCEL/NEXT(UPDATE) pill and a separate outline "Update Assessment"
//    button). Per direction, those two controls collapse into the single
//    existing CTA (relabeled "Next" / "Update Assessment" per step)
//    instead of rendering both — the outline button only differed from
//    the bottom pill because Figma reused the same template on every
//    step regardless of position. Edit mode additionally renders a
//    Cancel button next to the CTA (discards and returns to Personal
//    Information immediately, unlike the header back arrow which steps
//    back one question at a time) and starts from the shared
//    assessmentStore's current answers instead of the defaults.
//
// 661:16733 ("Assessment Updated" success modal, shown only in edit mode
// on the last step) had an unrelated Pricing/Subscription screen as its
// Figma background — flagged as a mismatch and ignored; only the modal
// content itself (title/description/Okay) is used, styled like this
// app's other success modals (e.g. ChangePasswordScreen's).
//
// See AssessmentStepViews.tsx for the per-step Figma sourcing notes.

type Props = NativeStackScreenProps<RootStackParamList, 'SignUpAssessment'>;

const STEPS = [
  { title: 'What is your gender?', Body: GenderStep, canContinue: (a: AssessmentAnswers) => a.gender != null },
  { title: 'What class are you currently in?', Body: ClassStep, canContinue: (a: AssessmentAnswers) => a.className != null },
  { title: 'What is your Class Path?', Body: ClassPathStep, canContinue: (a: AssessmentAnswers) => a.classPath != null },
  { title: 'Pick Your Interested Subjects', Body: InterestedSubjectsStep, canContinue: (a: AssessmentAnswers) => a.subjects.length > 0 },
  { title: 'Rate Your Learning Level', Body: LearningLevelStep, canContinue: () => true },
  { title: 'Do you have any physical limitations?', Body: PhysicalLimitationsStep, canContinue: () => true },
  { title: 'How many days/wk will you commit?', Body: DaysToCommitStep, canContinue: () => true },
];

export function SignUpAssessmentScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const mode = route.params?.mode ?? 'signup';
  const storedAnswers = useAssessmentStore((s) => s.answers);
  const setStoredAnswers = useAssessmentStore((s) => s.setAnswers);

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>(mode === 'edit' ? storedAnswers : DEFAULT_ASSESSMENT_ANSWERS);
  const [updated, setUpdated] = useState(false);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const canContinue = step.canContinue(answers);

  function backPress() {
    if (stepIndex === 0) {
      navigation.goBack();
    } else {
      setStepIndex((i) => i - 1);
    }
  }

  function continuePress() {
    if (!canContinue) return;
    if (isLast) {
      setStoredAnswers(answers);
      if (mode === 'edit') {
        setUpdated(true);
      } else {
        navigation.replace('Pricing');
      }
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  const ctaLabel = mode === 'edit' ? (isLast ? 'Update Assessment' : 'Next') : isLast ? 'Continue to Pricing' : 'Continue';

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="Assessment" onBack={backPress} />

      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl2, paddingBottom: theme.spacing.xl3 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View
            style={{
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.xs,
              borderRadius: theme.radii.md,
              backgroundColor: `${theme.colors.accent1.tertiary}33`,
            }}
          >
            <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.accent1.primary }}>
              {stepIndex + 1} of {STEPS.length}
            </Text>
          </View>
          <ThemeTogglePill />
        </View>

        <Text style={{ ...theme.typography.header.xl2.semibold, color: theme.colors.greyscale.textPrimary }}>{step.title}</Text>

        <step.Body answers={answers} setAnswers={setAnswers} />

        <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
          {mode === 'edit' && (
            <Pressable
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              style={{
                flex: 1,
                height: theme.sizes.ctaButtonHeight,
                borderRadius: theme.radii.full,
                backgroundColor: theme.colors.greyscale.stroke,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.textPrimary }}>Cancel</Text>
            </Pressable>
          )}
          <Pressable
            onPress={continuePress}
            disabled={!canContinue}
            accessibilityRole="button"
            accessibilityLabel={ctaLabel}
            accessibilityState={{ disabled: !canContinue }}
            style={{
              flex: mode === 'edit' ? 1.5 : undefined,
              width: mode === 'edit' ? undefined : '100%',
              height: theme.sizes.ctaButtonHeight,
              borderRadius: theme.radii.full,
              backgroundColor: theme.colors.accent1.primary,
              opacity: canContinue ? 1 : 0.5,
              alignItems: 'center',
              justifyContent: 'center',
              ...theme.shadows.xs,
            }}
          >
            <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>{ctaLabel}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={updated} transparent animationType="fade" onRequestClose={() => setUpdated(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl }}>
          <View
            style={{
              width: '100%',
              maxWidth: 390,
              backgroundColor: theme.colors.greyscale.bgLight,
              borderRadius: theme.radii.xl,
              padding: theme.spacing.xl,
              gap: theme.spacing.xl,
              alignItems: 'center',
              ...theme.shadows.lg,
            }}
          >
            <Pressable
              onPress={() => setUpdated(false)}
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={{ position: 'absolute', right: theme.spacing.sm, top: theme.spacing.md }}
            >
              <Ionicons name="close" size={18} color={theme.colors.greyscale.textPrimary} />
            </Pressable>

            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: `${theme.colors.accent1.primary}22`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="checkmark-circle" size={32} color={theme.colors.accent1.primary} />
            </View>

            <View style={{ gap: theme.spacing.sm, alignItems: 'center' }}>
              <Text style={{ ...theme.typography.header.xl2.bold, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
                Assessment Updated
              </Text>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary, textAlign: 'center' }}>
                Your account will now be tailored based on the information provided
              </Text>
            </View>

            <Pressable
              onPress={() => {
                setUpdated(false);
                navigation.goBack();
              }}
              accessibilityRole="button"
              accessibilityLabel="Okay"
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
              <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>Okay</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
