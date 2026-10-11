import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';
import { LEARNING_TODO_CATEGORIES } from '../data/learningTodos';
import { LEARNING_TODOS_LOCK_SVG } from '../assets/learningTodosLockIllustration';

// Built from Figma 661:16827 ("Learning To-Dos") — reached from Profile's
// "Learning To-Dos" row (previously inert). 661:16826 was the duplicate
// Profile screen (no new info), skipped.
//
// The header banner's lock illustration is the real exported Figma SVG; the
// diagonal orange stripes beside it are plain colored shapes in Figma (not
// an image), reproduced the same way here. "Call Emergency" has no real
// phone number anywhere in this design or project (no emergency-contact
// field exists in any store/profile data) — left as a visible but inert
// button rather than wired to a fabricated number, flagged here rather than
// silently dropped since it's clearly an intentional design element.

type Props = NativeStackScreenProps<RootStackParamList, 'LearningTodos'>;

const CATEGORY_ICON: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  ready: 'body-outline',
  'right-way': 'school-outline',
  'good-habits': 'ribbon-outline',
};

export function LearningTodosScreen({ navigation }: Props) {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="Learning To-Dos" onBack={() => navigation.goBack()} />

      <ScrollView>
        <View style={{ height: 146, backgroundColor: theme.colors.greyscale.stroke, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <View style={{ position: 'absolute', right: -10, top: -20, flexDirection: 'row', gap: 10, transform: [{ rotate: '43deg' }] }}>
            <View style={{ width: 20, height: 100, borderRadius: 14, backgroundColor: theme.colors.accent1.primary }} />
            <View style={{ width: 20, height: 140, borderRadius: 14, backgroundColor: theme.colors.accent1.primary }} />
            <View style={{ width: 20, height: 130, borderRadius: 14, backgroundColor: theme.colors.accent1.primary }} />
          </View>
          <SvgXml xml={LEARNING_TODOS_LOCK_SVG} width={150} height={100} />
        </View>

        <View style={{ padding: theme.spacing.lg, gap: theme.spacing.xl }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Call Emergency"
            style={{
              height: 56,
              borderRadius: theme.radii.full,
              borderWidth: 1,
              borderColor: theme.colors.greyscale.stroke,
              backgroundColor: theme.colors.greyscale.bgDarken,
              padding: 4,
              justifyContent: 'center',
              opacity: 0.6,
            }}
          >
            <View
              style={{
                height: 46,
                borderRadius: theme.radii.full,
                backgroundColor: theme.colors.accent1.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.white }}>
                Call Emergency
              </Text>
            </View>
          </Pressable>

          <View style={{ gap: theme.spacing.sm }}>
            <Text style={{ ...theme.typography.header.lg.medium, color: theme.colors.greyscale.textPrimary }}>
              Learn Better, Every Day
            </Text>
            <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary, lineHeight: 22 }}>
              This guide helps you prepare to learn, use the app properly, and build Learningy habits that support understanding, accessibility, confidence, and long-term academic success.
            </Text>
          </View>

          <View style={{ gap: theme.spacing.lg }}>
            {LEARNING_TODO_CATEGORIES.map((cat, i) => (
              <Pressable
                key={cat.id}
                onPress={() => navigation.navigate('LearningTodoDetail', { category: cat.id })}
                accessibilityRole="button"
                accessibilityLabel={cat.hubTitle}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: theme.spacing.md,
                  paddingBottom: i === LEARNING_TODO_CATEGORIES.length - 1 ? 0 : theme.spacing.lg,
                  borderBottomWidth: i === LEARNING_TODO_CATEGORIES.length - 1 ? 0 : 1,
                  borderBottomColor: theme.colors.greyscale.stroke,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: `${theme.colors.accent1.tertiary}33`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name={CATEGORY_ICON[cat.id]} size={20} color={theme.colors.accent1.primary} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ ...theme.typography.header.base.medium, color: theme.colors.greyscale.textPrimary }}>
                    {cat.hubTitle}
                  </Text>
                  <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
                    {cat.hubSubtitle}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.greyscale.textSecondary} />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
