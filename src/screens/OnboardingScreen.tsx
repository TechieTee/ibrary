import React, { useState } from 'react';
import { View, Text, Pressable, Image, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { ThemeTogglePill } from '../components/ThemeTogglePill';

// Built from Figma frames 661:16380-16383 (dark) / 654:22398, 22397, 22396,
// 22395 (light) — one node per slide. All four background photos are
// byte-identical between light/dark links (same asset filenames on
// Figma's CDN), so a single set of 4 images is reused for both modes; only
// the theme-toggle glyph, card background, and text/button colors differ,
// and those all map onto existing tokens (see below) with no new ones
// needed.
//
// Card bg / title / description / pill colors follow the theme's own
// values directly (no cross-mode swap needed here, unlike some other
// screens in this app): card bg = greyscale.bgLight, title =
// greyscale.textPrimary, description = greyscale.textSecondary. The
// bottom button row's pill background swaps textPrimary/bgLight within
// the *same* theme (pill = textPrimary, SKIP text = bgLight) — confirmed
// against the Figma-exact hex per mode.
//
// The top-right theme toggle is wired to the real useThemeStore instead of
// reproducing Figma's exact multi-layer switch graphic (mountain/sky scene
// + tiny star icons) — that asset isn't a single exportable image and the
// SVG pipeline isn't wired up in this project yet, so it's approximated as
// a themed sun/moon pill that actually switches mode.
//
// Onboarding "seen before" persistence (so Splash could skip straight to
// Tabs on a later launch) hasn't been discussed with the user yet — this
// screen is reachable but nothing gates re-showing it. Flagged, not built.

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const SLIDES = [
  {
    title: 'Learn Easily',
    description:
      'Understand every topic with simple explanations, real-life examples, and step-by-step guidance made for SS1–SS3 students.',
    image: require('../../assets/images/onboarding-1.jpg'),
  },
  {
    title: 'Listen Freely',
    description:
      'Play audio lessons for every topic, control the pace, rewind anytime, or download to learn offline with ease.',
    image: require('../../assets/images/onboarding-2.jpg'),
  },
  {
    title: 'Built Accessible',
    description:
      'Designed for blind learners and students with learning differences—clear navigation, screen-reader support, large text, and high contrast.',
    image: require('../../assets/images/onboarding-3.jpg'),
  },
  {
    title: 'Practice Confidently',
    description:
      'Test your understanding with quizzes from WAEC, NECO, and JAMB to build confidence and exam readiness.',
    image: require('../../assets/images/onboarding-4.jpg'),
  },
];

export function OnboardingScreen({ navigation }: Props) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  function finish() {
    navigation.replace('SignUpInfo');
  }

  function nextPress() {
    if (isLast) {
      finish();
    } else {
      setIndex((i) => i + 1);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <Image
        source={slide.image}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: width * 1.58 }}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />

      <View style={{ position: 'absolute', top: theme.spacing.xl, right: theme.spacing.lg }}>
        <ThemeTogglePill />
      </View>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme.colors.greyscale.bgLight,
          borderTopLeftRadius: theme.radii.lg * 2,
          borderTopRightRadius: theme.radii.lg * 2,
          padding: theme.spacing.xl,
          paddingTop: theme.spacing.xl3,
          gap: theme.spacing.xl2,
        }}
      >
        <View style={{ gap: theme.spacing.md }}>
          <Text style={{ ...theme.typography.display.xl4.semibold, color: theme.colors.greyscale.textPrimary }}>
            {slide.title}
          </Text>
          <Text style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textSecondary }}>
            {slide.description}
          </Text>

          <View
            accessibilityLabel={`Slide ${index + 1} of ${SLIDES.length}`}
            style={{ flexDirection: 'row', gap: theme.spacing.xs, marginTop: theme.spacing.sm }}
          >
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === index ? 24 : 8,
                  height: 4,
                  borderRadius: theme.radii.full,
                  backgroundColor: i === index ? theme.colors.accent1.primary : theme.colors.greyscale.stroke,
                }}
              />
            ))}
          </View>
        </View>

        <View style={{ height: theme.sizes.ctaButtonHeight, position: 'relative' }}>
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              borderRadius: theme.radii.full,
              backgroundColor: theme.colors.greyscale.textPrimary,
            }}
          />
          <Pressable
            onPress={finish}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '46%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ ...theme.typography.header.lg.semibold, color: theme.colors.greyscale.bgLight }}>
              SKIP
            </Text>
          </Pressable>
          <Pressable
            onPress={nextPress}
            accessibilityRole="button"
            accessibilityLabel={isLast ? 'Finish onboarding' : 'Next slide'}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '48%',
              borderRadius: theme.radii.full,
              backgroundColor: theme.colors.accent1.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ ...theme.typography.header.lg.semibold, color: theme.colors.greyscale.white }}>
              {isLast ? 'GET STARTED' : 'NEXT'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
