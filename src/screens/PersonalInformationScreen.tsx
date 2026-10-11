import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';

// Built from Figma 661:16746 ("My Personal Information") — a menu hub
// reached from Profile's "My Personal Information" row, not the details
// view itself (that's ProfileDetailsScreen / 661:16747 — both frames share
// the same title in Figma, flagged rather than treated as duplicates).
//
// "Account Settings" now navigates to AccountSettingsScreen (661:16748),
// pulled in a follow-up continuation of this flow. "Notification" still has
// no Figma screen and stays inert. "Onboarding Assessment" reuses the
// existing SignUpAssessment flow to let a user re-answer their
// learning-profile survey, since no separate "edit assessment" screen
// exists in Figma either.

type Props = NativeStackScreenProps<RootStackParamList, 'PersonalInformation'>;

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const ROWS: { key: string; icon: IconName; title: string; subtitle: string; action?: keyof RootStackParamList }[] = [
  { key: 'details', icon: 'person-outline', title: 'Your Profile Details', subtitle: 'Your information on IBrary', action: 'ProfileDetails' },
  { key: 'account', icon: 'settings-outline', title: 'Account Settings', subtitle: 'Delete/Deactivate your account', action: 'AccountSettings' },
  { key: 'notification', icon: 'notifications-outline', title: 'Notification', subtitle: 'Toggle on/off your notification' },
  { key: 'assessment', icon: 'create-outline', title: 'Onboarding Assessment', subtitle: 'Edit Your assessment', action: 'SignUpAssessment' },
];

export function PersonalInformationScreen({ navigation }: Props) {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="My Personal Information" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
        {ROWS.map((row, index) => (
          <Pressable
            key={row.key}
            onPress={
              row.key === 'assessment'
                ? () => navigation.navigate('SignUpAssessment', { mode: 'edit' })
                : row.action
                  ? () => navigation.navigate(row.action as any)
                  : undefined
            }
            accessibilityRole={row.action ? 'button' : undefined}
            accessibilityLabel={row.title}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.spacing.md,
              paddingVertical: theme.spacing.lg,
              borderBottomWidth: index === ROWS.length - 1 ? 0 : 1,
              borderBottomColor: theme.colors.greyscale.stroke,
              opacity: row.action ? 1 : 0.5,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: theme.colors.greyscale.bgDarken,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name={row.icon} size={18} color={theme.colors.greyscale.textPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ ...theme.typography.header.base.medium, color: theme.colors.greyscale.textPrimary }}>
                {row.title}
              </Text>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
                {row.subtitle}
              </Text>
            </View>
            {row.action && (
              <Text style={{ fontSize: 20, color: theme.colors.greyscale.textSecondary }}>›</Text>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
