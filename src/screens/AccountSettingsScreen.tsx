import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';

// Built from Figma 661:16748 ("Account Settings") — reached from
// PersonalInformationScreen's "Account Settings" row, which this now
// replaces as the real destination (was inert, no design existed yet).

type Props = NativeStackScreenProps<RootStackParamList, 'AccountSettings'>;

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const ROWS: { key: string; icon: IconName; title: string; subtitle: string; action: keyof RootStackParamList; danger?: boolean }[] = [
  { key: 'change-password', icon: 'lock-closed-outline', title: 'Change Password', subtitle: 'Update your Password', action: 'ChangePassword' },
  { key: 'deactivate', icon: 'trash-outline', title: 'Deactivate/Delete Account', subtitle: 'Deactivation & Deletion of Account', action: 'DeactivateAccount', danger: true },
];

export function AccountSettingsScreen({ navigation }: Props) {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="Account Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
        {ROWS.map((row, index) => (
          <Pressable
            key={row.key}
            onPress={() => navigation.navigate(row.action as any)}
            accessibilityRole="button"
            accessibilityLabel={row.title}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.spacing.md,
              paddingVertical: theme.spacing.lg,
              borderBottomWidth: index === ROWS.length - 1 ? 0 : 1,
              borderBottomColor: theme.colors.greyscale.stroke,
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
              <Ionicons name={row.icon} size={18} color={row.danger ? theme.colors.system.error : theme.colors.greyscale.textPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ ...theme.typography.header.base.medium, color: row.danger ? theme.colors.system.error : theme.colors.greyscale.textPrimary }}>
                {row.title}
              </Text>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
                {row.subtitle}
              </Text>
            </View>
            <Text style={{ fontSize: 20, color: theme.colors.greyscale.textSecondary }}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
