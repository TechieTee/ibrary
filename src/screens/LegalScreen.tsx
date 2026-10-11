import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';

// Built from Figma 661:16754 ("Legal") — reached from Profile's "Legal" row
// (previously inert). Both rows share one generic icon in Figma
// (hugeicons:note-05); differentiated here with distinct real Ionicons
// glyphs per destination instead for clearer affordance.

type Props = NativeStackScreenProps<RootStackParamList, 'Legal'>;

interface LegalRow {
  key: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
}

export function LegalScreen({ navigation }: Props) {
  const theme = useTheme();

  const rows: LegalRow[] = [
    {
      key: 'privacy',
      icon: 'shield-checkmark-outline',
      title: 'Privacy Policy',
      subtitle: 'Read about our Privacy Policy',
      onPress: () => navigation.navigate('PrivacyPolicy'),
    },
    {
      key: 'terms',
      icon: 'document-text-outline',
      title: 'Terms & Conditions',
      subtitle: 'Read about our Terms and Conditions',
      onPress: () => navigation.navigate('TermsConditions'),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="Legal" onBack={() => navigation.goBack()} />
      <ScrollView>
        {rows.map((row, i) => (
          <Pressable
            key={row.key}
            onPress={row.onPress}
            accessibilityRole="button"
            accessibilityLabel={row.title}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.spacing.md,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.lg,
              borderBottomWidth: i === rows.length - 1 ? 0 : 1,
              borderBottomColor: theme.colors.greyscale.stroke,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: `${theme.colors.accent1.primary}33`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name={row.icon} size={20} color={theme.colors.accent1.primary} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ ...theme.typography.header.base.medium, color: theme.colors.greyscale.textPrimary }}>
                {row.title}
              </Text>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
                {row.subtitle}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.greyscale.textSecondary} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
