import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';

// Built from Figma 661:16759 ("Terms & Conditions") — reached from Legal's
// "Terms & Conditions" row. Real copy from the design, restructured into
// section components instead of reproducing the raw "**N. Heading**"
// markdown-style asterisks verbatim (which was clearly meant to render as
// bold, not literal asterisks, in the source doc this was pasted from).

type Props = NativeStackScreenProps<RootStackParamList, 'TermsConditions'>;

interface Section {
  heading: string;
  clauses: string[];
}

const SECTIONS: Section[] = [
  {
    heading: '1. User Responsibilities',
    clauses: [
      'You must use the IBrary app for lawful and legitimate purposes only.',
      'You are responsible for maintaining the security of your account and any associated passwords.',
    ],
  },
  {
    heading: '2. Privacy',
    clauses: [
      'We respect your privacy and handle your data in accordance with our Privacy Policy.',
      'You consent to the collection and use of your data as described in our Privacy Policy.',
    ],
  },
  {
    heading: '3. Medical Information',
    clauses: [
      'The content provided on IBrary is for informational purposes only and not a substitute for professional medical advice.',
      'Consult a Learning care professional for any medical concerns.',
    ],
  },
  {
    heading: '4. Intellectual Property',
    clauses: [
      'All content and materials on IBrary are protected by intellectual property laws.',
      'You may not use, reproduce, or distribute content without our written permission.',
    ],
  },
  {
    heading: '5. Termination',
    clauses: ['We reserve the right to terminate or suspend your access to IBrary at our discretion.'],
  },
  {
    heading: '6. Disclaimer of Warranties',
    clauses: [
      'IBrary is provided "as is" without any warranties.',
      'We do not guarantee the accuracy, reliability, or availability of our services.',
    ],
  },
  {
    heading: '7. Limitation of Liability',
    clauses: ['We are not liable for any direct or indirect damages related to your use of IBrary.'],
  },
  {
    heading: '8. Governing Law',
    clauses: ['These terms are governed by the laws of the Federal Republic of Nigeria.'],
  },
];

export function TermsConditionsScreen({ navigation }: Props) {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="Terms & Conditions" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl }}>
        <Text style={{ ...theme.typography.header.lg.semibold, color: theme.colors.greyscale.textPrimary }}>
          IBrary Learning App — Terms and Conditions
        </Text>

        {SECTIONS.map((section) => (
          <View key={section.heading} style={{ gap: theme.spacing.sm }}>
            <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.textPrimary }}>
              {section.heading}
            </Text>
            {section.clauses.map((clause, i) => (
              <Text key={i} style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textSecondary, lineHeight: 26 }}>
                {clause}
              </Text>
            ))}
          </View>
        ))}

        <Text style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textSecondary, lineHeight: 26 }}>
          By using IBrary, you acknowledge and accept these Terms and Conditions. If you have any questions or concerns, please contact us through Help & Support. Thank you for choosing IBrary for your Learning needs.
        </Text>
      </ScrollView>
    </View>
  );
}
