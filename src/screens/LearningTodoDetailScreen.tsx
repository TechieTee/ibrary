import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';
import { LEARNING_TODO_CATEGORIES } from '../data/learningTodos';

// Built from Figma 661:16828/16831 (Get Learning-Ready, 2 slides),
// 661:16829/16832/16835 (Learn the Right Way, 3 slides), and
// 661:16830/16833/16836 (Build Good Habits, 3 slides) — each category's
// slide-by-slide carousel, reached from LearningTodosScreen's category rows.
//
// Figma's slides advance via a real swipe gesture (the "< Swipe left" label
// + a circular arrow button that appears to be decorative/always-present).
// This project has no swipe-gesture library installed (see NotificationScreen
// for the same constraint), so both are reimplemented as taps: the arrow
// button advances to the next slide (or returns to the hub after the last
// one), and the "< Swipe left" label — shown only once a previous slide
// exists, matching Figma — taps back one slide instead of requiring an
// actual swipe.

type Props = NativeStackScreenProps<RootStackParamList, 'LearningTodoDetail'>;

export function LearningTodoDetailScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const category = LEARNING_TODO_CATEGORIES.find((c) => c.id === route.params.category)!;
  const [index, setIndex] = useState(0);
  const slide = category.slides[index];
  const isLast = index === category.slides.length - 1;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="Learning To-Dos" onBack={() => navigation.goBack()} />

      <Image
        source={slide.image}
        style={{ width: '100%', height: 280, borderBottomLeftRadius: theme.radii.lg, borderBottomRightRadius: theme.radii.lg }}
        resizeMode="cover"
      />

      <View style={{ flex: 1, padding: theme.spacing.lg, gap: theme.spacing.md }}>
        <Text style={{ ...theme.typography.header.xl2.semibold, color: theme.colors.greyscale.textPrimary }}>
          {slide.title}
        </Text>
        <Text style={{ ...theme.typography.header.base.medium, color: theme.colors.greyscale.textPrimary }}>
          {slide.subtitle}
        </Text>
        <Text style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textSecondary, lineHeight: 22, textAlign: 'justify' }}>
          {slide.body}
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: theme.spacing.xs, marginTop: theme.spacing.md }}>
          {category.slides.map((_, i) => (
            <View
              key={i}
              style={{
                height: 4,
                width: i === index ? 24 : 8,
                borderRadius: 2,
                backgroundColor: i === index ? theme.colors.accent1.primary : theme.colors.greyscale.stroke,
              }}
            />
          ))}
        </View>

        <View style={{ flex: 1 }} />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {index > 0 ? (
            <Pressable
              onPress={() => setIndex((i) => i - 1)}
              accessibilityRole="button"
              accessibilityLabel="Previous slide"
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <Ionicons name="chevron-back" size={16} color={theme.colors.greyscale.textPrimary} />
              <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.textPrimary }}>
                Swipe left
              </Text>
            </Pressable>
          ) : (
            <View />
          )}

          <Pressable
            onPress={() => {
              if (isLast) {
                navigation.goBack();
              } else {
                setIndex((i) => i + 1);
              }
            }}
            accessibilityRole="button"
            accessibilityLabel={isLast ? 'Finish' : 'Next slide'}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              borderWidth: 2,
              borderColor: theme.colors.accent1.primary,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.greyscale.bgDarken,
            }}
          >
            <Ionicons name={isLast ? 'checkmark' : 'arrow-forward'} size={24} color={theme.colors.accent1.primary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
