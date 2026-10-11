import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';
import { useFavoritesStore } from '../store/favoritesStore';

// Built from Figma 661:16825 ("Favorite/Saved") — reached from Profile's
// "Favorite/Saved" row (previously inert, no screen existed). 661:16824
// ("Classes") turned out to be the existing LessonReaderScreen itself
// (same Explanation/Video/Comments lesson view, shown here with its
// favorite heart already filled) — confirming it as the detail screen
// favoriting leads back to, not a separate screen to build.
//
// Figma groups favorited lesson cards by week/term with per-lesson
// progress bars, status, dates and student counts — but that metadata
// belongs to SubjectSelectionScreen's local lesson fixtures, not to
// favoritesStore (which only knows what was actually favorited: a topic
// or a lesson, by id). Reproducing per-item progress/status here would
// mean fabricating data for items the store doesn't track, so this
// renders a flatter list instead — title, subtitle, and a type badge,
// tappable to jump back into that topic or lesson. QuizScreen has no
// favorite affordance yet (Figma's "Quiz" card is just an example item),
// so quiz entries won't appear here until one exists.

type Props = NativeStackScreenProps<RootStackParamList, 'FavoriteSaved'>;

const KIND_LABEL: Record<'topic' | 'lesson', string> = {
  topic: 'Topic',
  lesson: 'Lesson',
};

const KIND_ICON: Record<'topic' | 'lesson', React.ComponentProps<typeof Ionicons>['name']> = {
  topic: 'book-outline',
  lesson: 'document-text-outline',
};

export function FavoriteSavedScreen({ navigation }: Props) {
  const theme = useTheme();
  const items = useFavoritesStore((s) => s.items);
  const favorites = Object.values(items);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgDarken }}>
      <SignUpHeader title="Favorite/Saved" onBack={() => navigation.goBack()} />
      {favorites.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.md, padding: theme.spacing.xl }}>
          <Ionicons name="heart-outline" size={48} color={theme.colors.greyscale.textSecondary} />
          <Text style={{ ...theme.typography.header.lg.semibold, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
            Nothing saved yet
          </Text>
          <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary, textAlign: 'center' }}>
            Tap the ♡ on a topic or lesson to save it here.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.md }}>
          {favorites.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => navigation.navigate(item.navigate.screen as any, item.navigate.params as any)}
              accessibilityRole="button"
              accessibilityLabel={item.title}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing.md,
                backgroundColor: theme.colors.greyscale.bgLight,
                borderWidth: 1,
                borderColor: theme.colors.greyscale.stroke,
                borderRadius: theme.radii.md,
                padding: theme.spacing.lg,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: theme.radii.md,
                  backgroundColor: theme.colors.greyscale.bgDarken,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name={KIND_ICON[item.kind]} size={20} color={theme.colors.greyscale.textPrimary} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.textPrimary }}>{item.title}</Text>
                <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
                  {KIND_LABEL[item.kind]} · {item.subtitle}
                </Text>
              </View>
              <Text style={{ fontSize: 20, color: theme.colors.greyscale.textSecondary }}>›</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
