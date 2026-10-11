import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';

// Built from Figma 661:16757 ("Privacy Policy") — reached from Legal's
// "Privacy Policy" row. Real copy verbatim from the design (generic
// legal-boilerplate text, not app-specific — reproduced as-is since it's
// the actual design content, not placeholder lorem ipsum).

type Props = NativeStackScreenProps<RootStackParamList, 'PrivacyPolicy'>;

const CLAUSES = [
  'Information Collection: We collect data necessary for app functionality, including personal and Learning-related information. This may include your name, contact details, medical history, and usage data.',
  'Data Usage: We use your data to provide personalized Learning services, improve user experience, and comply with legal obligations.',
  'Data Security: We employ robust security measures to protect your information from unauthorized access or disclosure.',
  'Data Sharing: We may share your data with trusted partners for specific purposes such as medical consultations. We do not sell your data.',
  'User Rights: You can access, correct, or delete your data. Contact us for assistance.',
  'Policy Updates: We may update this policy to reflect changes in our services or regulatory requirements. Please review it periodically.',
];

export function PrivacyPolicyScreen({ navigation }: Props) {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="Privacy Policy" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.lg }}>
        <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textPrimary, lineHeight: 26 }}>
          Welcome to IBrary, your trusted Learning mobile app platform. We are committed to safeguarding your privacy and ensuring the security of your personal information. By using our services, you agree to the following privacy policy:
        </Text>

        <View style={{ gap: theme.spacing.md }}>
          {CLAUSES.map((clause, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
              <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textPrimary }}>
                {i + 1}.
              </Text>
              <Text style={{ flex: 1, ...theme.typography.body.base.medium, color: theme.colors.greyscale.textPrimary, lineHeight: 26 }}>
                {clause}
              </Text>
            </View>
          ))}
        </View>

        <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textPrimary, lineHeight: 26 }}>
          By using IBrary, you consent to this policy. Your privacy is essential to us. If you have any questions, contact our support team.
        </Text>
      </ScrollView>
    </View>
  );
}
