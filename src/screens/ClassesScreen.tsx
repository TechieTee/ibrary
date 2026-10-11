import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TabParamList, RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';

// Built from Figma frame 654:22449 ("Classes", light) / 661:16703 (dark) —
// originally also used to build a separate TermSelectionScreen (removed;
// see below).
//
// Confirmed by product: these cards ARE the class/course-material items —
// 1st/2nd/3rd Term, matching Figma's literal card copy. The redundant
// middle step (a separate TermSelection screen showing the same three
// labels again) has been collapsed — tapping a card here navigates
// straight to SubjectSelection, and TermSelectionScreen/TermSelection
// route no longer exist.
//

// Card metadata (subject count, participants, rating) is placeholder data
// matching the frame's example numbers — it looks backend-driven (no API
// type/endpoint exists for it yet), not static design content.
//
// Not reproduced: the frame's decorative status-bar header and bottom tab
// bar (already owned by OS chrome / TabNavigator), and the card cover
// photos / icon glyphs (Figma-exported assets — no asset pipeline wired in
// yet). Card content area uses auto-height instead of Figma's fixed
// 138px, so it won't clip when Bigger Text / Line Height are on.

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Classes'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface ClassCardData {
  className: string;
  term: number;
  subjectCount: number;
  participantsLabel: string;
  rating: number;
}

// Class/course-material labels, confirmed by product: these ARE the terms
// (1st/2nd/3rd Term), matching Figma's literal card copy — not grade-level
// names like "JSS 1". `term` is the numeric value SubjectSelection needs.
// Metadata (subjectCount/participantsLabel/rating) remains placeholder,
// matching the frame's example values — flag before treating it as real
// content.
const CLASSES: ClassCardData[] = [
  { className: '1st Term', term: 1, subjectCount: 12, participantsLabel: '20+ People Participating', rating: 4.5 },
  { className: '2nd Term', term: 2, subjectCount: 17, participantsLabel: '20+ People Participating', rating: 4.5 },
  { className: '3rd Term', term: 3, subjectCount: 9, participantsLabel: '20+ People Participating', rating: 4.5 },
];

export function ClassesScreen({ navigation }: Props) {
  const theme = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}
      contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl }}
    >
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
              Classes
            </Text>
            <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
              Ready to improve your knowledge today?
            </Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Legibility')}
            accessibilityRole="button"
            accessibilityLabel="Open legibility settings"
            style={{
              width: theme.sizes.closeButton,
              height: theme.sizes.closeButton,
              borderRadius: theme.radii.lg,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${theme.colors.accent1.tertiary}33`, // ~20% alpha, matches Figma
            }}
          >
            <Ionicons name="accessibility-outline" size={20} color={theme.colors.accent1.primary} />
          </Pressable>
        </View>
        <View style={{ height: 1, backgroundColor: theme.colors.greyscale.stroke }} />
      </View>

      <View accessibilityRole="list" accessibilityLabel="Classes" style={{ gap: 27 }}>
        {CLASSES.map(({ className, term, subjectCount, participantsLabel, rating }) => (
          <Pressable
            key={className}
            onPress={() => navigation.navigate('SubjectSelection', { className, term })}
            accessibilityRole="button"
            accessibilityLabel={`${className}, ${subjectCount} subjects, rated ${rating} out of 5`}
            style={{ borderRadius: theme.radii.xl, overflow: 'hidden' }}
          >
            <View
              style={{
                height: 240,
                backgroundColor: theme.colors.greyscale.bgDarken,
                borderTopLeftRadius: theme.radii.xl,
                borderTopRightRadius: theme.radii.xl,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Figma shows a real cover photo here — not an icon, so
                  left as this emoji placeholder; still needs a real
                  downloaded asset, not an icon-font swap. */}
              <Text style={{ fontSize: 40 }}>🎓</Text>
            </View>
            <View
              style={{
                backgroundColor: theme.colors.greyscale.bgDarken,
                borderBottomLeftRadius: theme.radii.xl,
                borderBottomRightRadius: theme.radii.xl,
                padding: theme.spacing.md,
                gap: theme.spacing.lg,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: theme.spacing.sm,
                }}
              >
                <View style={{ gap: theme.spacing.xs, flex: 1 }}>
                  <Text style={{ ...theme.typography.header.lg.semibold, color: theme.colors.greyscale.textPrimary }}>
                    {className}
                  </Text>
                  <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary }}>
                    {subjectCount} Subjects
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: theme.spacing.xs,
                    paddingHorizontal: theme.spacing.sm,
                    paddingVertical: theme.spacing.xs,
                    borderRadius: theme.radii.md / 2,
                    backgroundColor: `${theme.colors.accent1.tertiary}33`,
                  }}
                >
                  <Ionicons name="star" size={14} color={theme.colors.accent1.primary} />
                  <Text style={{ ...theme.typography.display.xs.semibold, color: theme.colors.greyscale.textPrimary }}>
                    {rating}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: theme.spacing.sm,
                }}
              >
                <Text
                  style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textPrimary, flex: 1 }}
                >
                  {participantsLabel}
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
                  <Ionicons name="arrow-forward" size={18} color={theme.colors.greyscale.white} />
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
