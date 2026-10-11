import React from 'react';
import { View, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';

// Built from Figma 661:16747 ("My Personal Information" — the read-only
// details card, reached via PersonalInformationScreen's "Your Profile
// Details" row; it shares its frame title with that hub, flagged rather
// than treated as the same screen).
//
// Figma's own mock data is broken (Last Name and Username both literally
// read "Male") and doesn't match the "Victor Emmanuel / Student - SS1"
// identity already shown on the Profile screen. Per direction, this screen
// uses consistent Victor Emmanuel mock values instead of reproducing the
// broken Figma placeholders — there's no real account/profile backend, so
// this is just a static display either way.

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileDetails'>;

const FIELDS: { label: string; value: string }[] = [
  { label: 'First Name', value: 'Victor' },
  { label: 'Last Name', value: 'Emmanuel' },
  { label: 'Username', value: 'victor_emmanuel' },
  { label: 'Phone No.', value: '08132589712' },
  { label: 'Email', value: 'victor.emmanuel@example.com' },
];

export function ProfileDetailsScreen({ navigation }: Props) {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="My Personal Information" onBack={() => navigation.goBack()} />
      <View style={{ padding: theme.spacing.lg }}>
        <View
          style={{
            backgroundColor: theme.colors.greyscale.bgDarken,
            borderWidth: 1,
            borderColor: theme.colors.greyscale.stroke,
            borderRadius: theme.radii.xl,
            paddingHorizontal: theme.spacing.lg,
          }}
        >
          {FIELDS.map((field, index) => (
            <View
              key={field.label}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: theme.spacing.lg,
                borderBottomWidth: index === FIELDS.length - 1 ? 0 : 1,
                borderBottomColor: theme.colors.greyscale.stroke,
              }}
            >
              <Text style={{ ...theme.typography.header.base.medium, color: theme.colors.greyscale.textPrimary }}>
                {field.label}
              </Text>
              <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textSecondary, opacity: 0.8 }}>
                {field.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
