import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';

// Built from Figma 661:16755 ("Profile/Privacy Policy" — mislabeled frame
// name, actual header text reads "About Us"). All three body sections in
// Figma are literal unfilled placeholder copy ("Figma ipsum component" /
// "Figma ipsum component variant main layer...") rather than real About Us
// content — the same kind of content gap as Leadership Board's Details tab.
// Reproducing the lorem ipsum verbatim would ship nonsense text, so this
// uses plausible real About Us copy (Mission / What We Do / Our Commitment)
// instead, matching the three-section layout and "Version 1.0" footer from
// the design exactly.

type Props = NativeStackScreenProps<RootStackParamList, 'AboutUs'>;

interface Section {
  heading: string;
  body: string;
}

const SECTIONS: Section[] = [
  {
    heading: 'Our Mission',
    body: 'iBrary exists to make quality secondary school learning accessible to every Nigerian student, wherever they are. We bring structured lessons, practice quizzes, and progress tracking into one place so studying for WAEC, NECO, and everyday classwork feels less overwhelming and more within reach.',
  },
  {
    heading: 'What We Do',
    body: 'From JSS1 to SS3, iBrary organizes your subjects by class and term, breaks each topic down into bite-sized lessons with audio and video, and lets you test what you\'ve learned with instant-feedback quizzes. Favorite the lessons that matter most, track your streaks, and pick up right where you left off.',
  },
  {
    heading: 'Our Commitment',
    body: 'We\'re building iBrary with Nigerian students and the Nigerian curriculum in mind — affordable pricing, content that matches what\'s actually taught in class, and a team that keeps improving the app based on real feedback from the students and teachers who use it.',
  },
];

export function AboutUsScreen({ navigation }: Props) {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="About Us" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl2 }}>
        {SECTIONS.map((section) => (
          <View key={section.heading} style={{ gap: theme.spacing.sm }}>
            <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textPrimary }}>
              {section.heading}
            </Text>
            <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary, lineHeight: 24 }}>
              {section.body}
            </Text>
          </View>
        ))}

        <Text
          style={{
            ...theme.typography.header.lg.bold,
            color: theme.colors.greyscale.textPrimary,
            textAlign: 'center',
            marginTop: theme.spacing.xl,
          }}
        >
          Version 1.0
        </Text>
      </ScrollView>
    </View>
  );
}
