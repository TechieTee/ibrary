import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

// Built from Figma frames 661:16712 ("Filter By" modal, dark) and
// 661:16700 ("No Filtered Result" — the empty state this filter can
// produce, shown on the main screen, not inside the modal itself).
//
// FLAG: `Color/Secondary/500: #FFC244` (the gold star icon next to each
// subject row) has no equivalent in ColorTokens — using accent1.tertiary
// as the closest existing stand-in rather than inventing a new token.
// Two other resolved variables (`Color/Accent 2/500: #E6E6E6`,
// `Color/Error/500: #BE4646`) didn't clearly surface in the pulled
// markup — not mapped, flagged rather than guessed at.
//
// Not reproduced: the decorative "Star" glyphs are an Ionicons "star"
// stand-in, not the exact exported Figma SVG (no asset pipeline wired in).

export interface ContentTypeFilters {
  video: boolean;
  text: boolean;
  quiz: boolean;
}

export interface SubjectFilters {
  contentTypes: ContentTypeFilters;
  subjects: string[];
}

export const EMPTY_FILTERS: SubjectFilters = {
  contentTypes: { video: false, text: false, quiz: false },
  subjects: [],
};

export function isFiltersEmpty(filters: SubjectFilters): boolean {
  return !filters.contentTypes.video && !filters.contentTypes.text && !filters.contentTypes.quiz && filters.subjects.length === 0;
}

interface SubjectOption {
  subject: string;
  topicCount: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  filters: SubjectFilters;
  onApply: (filters: SubjectFilters) => void;
  onClear: () => void;
  subjectOptions: SubjectOption[];
}

const CONTENT_TYPE_ROWS: { key: keyof ContentTypeFilters; label: string }[] = [
  { key: 'video', label: 'Video Included' },
  { key: 'text', label: 'Text Included' },
  { key: 'quiz', label: 'Quiz Included' },
];

export function SubjectFilterModal({ visible, onClose, filters, onApply, onClear, subjectOptions }: Props) {
  const theme = useTheme();
  // Local draft so Apply commits and the X (close) discards — matches the
  // Figma footer having both an "Apply Filter" and a separate close (✕).
  const [draft, setDraft] = useState<SubjectFilters>(filters);

  useEffect(() => {
    if (visible) setDraft(filters);
  }, [visible, filters]);

  function toggleContentType(key: keyof ContentTypeFilters) {
    setDraft((d) => ({ ...d, contentTypes: { ...d.contentTypes, [key]: !d.contentTypes[key] } }));
  }

  function selectAllContentTypes() {
    setDraft((d) => ({ ...d, contentTypes: { video: false, text: false, quiz: false } }));
  }

  function toggleSubject(subject: string) {
    setDraft((d) => ({
      ...d,
      subjects: d.subjects.includes(subject) ? d.subjects.filter((s) => s !== subject) : [...d.subjects, subject],
    }));
  }

  const allSelected = !draft.contentTypes.video && !draft.contentTypes.text && !draft.contentTypes.quiz;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
        <View
          accessibilityViewIsModal
          style={{
            backgroundColor: theme.colors.greyscale.bgLight,
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
            maxHeight: '85%',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: theme.spacing.lg,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.greyscale.stroke,
            }}
          >
            <Text style={{ ...theme.typography.header.lg.semibold, color: theme.colors.accent1.primary }}>
              Filter By
            </Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close filter">
              <Ionicons name="close" size={18} color={theme.colors.greyscale.textSecondary} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.lg }}>
            <View style={{ gap: theme.spacing.md }}>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary }}>
                Content Type
              </Text>
              <Pressable
                onPress={selectAllContentTypes}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: allSelected }}
                accessibilityLabel="All content types"
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Text style={{ color: theme.colors.accent1.primary, fontSize: 16 }}>All</Text>
                <RadioDot theme={theme} checked={allSelected} />
              </Pressable>
              {CONTENT_TYPE_ROWS.map(({ key, label }) => (
                <Pressable
                  key={key}
                  onPress={() => toggleContentType(key)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: draft.contentTypes[key] }}
                  accessibilityLabel={label}
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Text style={{ color: theme.colors.greyscale.textPrimary, fontSize: 16 }}>{label}</Text>
                  <RadioDot theme={theme} checked={draft.contentTypes[key]} />
                </Pressable>
              ))}
            </View>

            <View style={{ height: 1, backgroundColor: theme.colors.greyscale.stroke }} />

            <View style={{ gap: theme.spacing.lg }}>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary }}>
                Subjects
              </Text>
              {subjectOptions.map(({ subject, topicCount }) => {
                const checked = draft.subjects.includes(subject);
                return (
                  <Pressable
                    key={subject}
                    onPress={() => toggleSubject(subject)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked }}
                    accessibilityLabel={`${subject}, ${topicCount} topics`}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
                      <Ionicons name="star" size={16} color={theme.colors.accent1.tertiary} />
                      <Text style={{ color: theme.colors.greyscale.textPrimary, fontSize: 16 }}>
                        {subject} ({topicCount} Topics)
                      </Text>
                    </View>
                    <RadioDot theme={theme} checked={checked} />
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <View
            style={{
              backgroundColor: theme.colors.greyscale.bgDarken,
              borderTopWidth: 1,
              borderTopColor: theme.colors.greyscale.stroke,
              padding: theme.spacing.lg,
              gap: theme.spacing.md,
            }}
          >
            <Pressable
              onPress={() => {
                onApply(draft);
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel="Apply filter"
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
                Apply Filter
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setDraft(EMPTY_FILTERS);
                onClear();
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel="Clear filter"
              style={{
                height: theme.sizes.ctaButtonHeight,
                borderRadius: theme.radii.full,
                borderWidth: 1,
                borderColor: theme.colors.accent1.primary,
                backgroundColor: theme.colors.greyscale.white,
                alignItems: 'center',
                justifyContent: 'center',
                ...theme.shadows.xs,
              }}
            >
              <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.accent1.primary }}>
                Clear Filter
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function RadioDot({ theme, checked }: { theme: ReturnType<typeof useTheme>; checked: boolean }) {
  return (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: theme.colors.accent1.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {checked && (
        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: theme.colors.accent1.primary }} />
      )}
    </View>
  );
}
