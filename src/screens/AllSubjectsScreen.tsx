import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';

// Built from Figma frames 661:16698 (dark, no selection) / 661:16699 (dark,
// "Mathematics" selected). Light-mode links sent (654:22442 "all", and
// 654:22441 reused for both "selected" and "filter") — the light "selected"
// and "filter" links are the same node, flagging rather than guessing at a
// separate one; not re-pulled since colors here already follow the same
// light/dark token mapping established everywhere else in this file.
//
// The 14 subjects are Figma-exact (Mathematics, English, Physics,
// Chemistry, Biology, Further Math, Agric Science, Comp Studies / ICT,
// Geography, Technical Drawing, Learning Education, Physical Education,
// Food & Nutrition — the 14th cell is blank in Figma's own mock, so 13
// real names + no 14th tile here).
//
// Single-select only (tapping a tile replaces the selection, matching
// Figma's fill/outline toggle) — "Continue" returns the choice to
// HomeScreen via TabParamList.Home's optional selectedSubject param.

type Props = NativeStackScreenProps<RootStackParamList, 'AllSubjects'>;

const ALL_SUBJECTS = [
  'Mathematics',
  'English',
  'Physics',
  'Chemistry',
  'Biology',
  'Further Math',
  'Agric Science',
  'Comp Studies / ICT',
  'Geography',
  'Technical Drawing',
  'Learning Education',
  'Physical Education',
  'Food & Nutrition',
];

export function AllSubjectsScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState(route.params.initialSubject ?? ALL_SUBJECTS[0]);

  const visibleSubjects = useMemo(
    () => ALL_SUBJECTS.filter((s) => s.toLowerCase().includes(searchQuery.trim().toLowerCase())),
    [searchQuery],
  );

  function continuePress() {
    // Goes to the Classes flow's Subject Selection screen (Level A) with
    // the chosen subject pre-selected. No term context exists on this
    // screen (reached from Home, not from a term-specific flow), so this
    // uses the same "1st Term" default other Home entry points already
    // use — flagged as a placeholder default, not a real "current term".
    navigation.navigate('SubjectSelection', { className: '1st Term', term: 1, initialSubject: selected });
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.lg, paddingBottom: theme.sizes.ctaButtonHeight + theme.spacing.xl2 }}>
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
                Academic Subjects
              </Text>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
                Choose a subject you would like to focus on
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

        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for Subjects"
          placeholderTextColor={theme.colors.greyscale.textTertiary}
          accessibilityLabel="Search for subjects"
          style={{
            height: 48,
            borderWidth: 1,
            borderColor: theme.colors.greyscale.stroke,
            borderRadius: theme.radii.md,
            paddingHorizontal: theme.spacing.md,
            color: theme.colors.greyscale.textPrimary,
            backgroundColor: theme.colors.greyscale.bgDarken,
          }}
        />

        <View
          accessibilityRole="radiogroup"
          accessibilityLabel="Subjects"
          style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md }}
        >
          {visibleSubjects.map((subject) => {
            const isSelected = subject === selected;
            return (
              <Pressable
                key={subject}
                onPress={() => setSelected(subject)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={subject}
                style={{
                  width: '47%',
                  height: 72,
                  borderRadius: theme.radii.md,
                  borderWidth: 1,
                  borderColor: isSelected ? theme.colors.accent1.primary : theme.colors.greyscale.stroke,
                  backgroundColor: isSelected ? theme.colors.accent1.primary : theme.colors.greyscale.bgLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: theme.spacing.sm,
                }}
              >
                <Text
                  style={{
                    ...theme.typography.body.lg.medium,
                    color: isSelected ? theme.colors.greyscale.white : theme.colors.greyscale.textPrimary,
                    textAlign: 'center',
                  }}
                >
                  {subject}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: theme.spacing.lg }}>
        <Pressable
          onPress={continuePress}
          accessibilityRole="button"
          accessibilityLabel={`Continue with ${selected}`}
          style={{
            height: theme.sizes.ctaButtonHeight,
            borderRadius: theme.radii.full,
            backgroundColor: theme.colors.accent1.primary,
            alignItems: 'center',
            justifyContent: 'center',
            ...theme.shadows.xs,
          }}
        >
          <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>
            Continue
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
