import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';

// Built from Figma 661:16750 ("Change Password" form, internally still
// named "Create Your Account" in its layer tree — a leftover from being
// duplicated off the signup flow) and 661:16731 ("Password Changed" —
// the same form frame at 60% opacity behind a success modal). Same
// password-strength-meter pattern as CreatePasswordScreen.tsx /
// ResetPasswordScreen.tsx (see those files' comments for why the strength
// colors are local constants and the eye icon is an emoji placeholder);
// duplicated here rather than extracted, consistent with how those two
// screens already duplicate it instead of sharing a component.
//
// The account email field is read-only mock text (no real auth backend),
// using the same Victor Emmanuel identity as ProfileDetailsScreen rather
// than Figma's literal josephokpara4563@gmail.com. "Old password" isn't
// checked against anything real — any non-empty value is accepted.

type Props = NativeStackScreenProps<RootStackParamList, 'ChangePassword'>;

const MOCK_EMAIL = 'victor.emmanuel@example.com';

type Strength = 'empty' | 'weak' | 'moderate' | 'strong';

function evaluateStrength(password: string): { strength: Strength; checks: { length: boolean; upper: boolean; lower: boolean; special: boolean } } {
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  if (password.length === 0) return { strength: 'empty', checks };
  if (passed <= 1) return { strength: 'weak', checks };
  if (passed <= 3) return { strength: 'moderate', checks };
  return { strength: 'strong', checks };
}

const STRENGTH_COPY: Record<Strength, { label: string; color: string; hint: string; width: `${number}%` }> = {
  empty: { label: 'Meter', color: '#48A109', hint: 'Password should be long enough, unique to you, and difficult for others to guess.', width: '0%' },
  weak: { label: 'Weak', color: '#F76411', hint: "Try a longer, more unique password that's harder to guess", width: '20%' },
  moderate: { label: 'Moderate', color: '#114EF7', hint: 'Getting stronger! Add some symbols or numbers for better protection', width: '55%' },
  strong: { label: 'Strong', color: '#48A109', hint: 'Great job! 🔐 This password is strong and secure', width: '100%' },
};

export function ChangePasswordScreen({ navigation }: Props) {
  const theme = useTheme();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changed, setChanged] = useState(false);

  const { strength, checks } = useMemo(() => evaluateStrength(newPassword), [newPassword]);
  const copy = STRENGTH_COPY[strength];
  const canContinue = oldPassword.length > 0 && strength !== 'weak' && newPassword === confirmPassword;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="Change Password" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl2, paddingBottom: theme.spacing.xl3 }}>
        <View style={{ gap: theme.spacing.xs }}>
          <Text style={{ ...theme.typography.header.xl2.bold, color: theme.colors.greyscale.textPrimary }}>
            Change Password
          </Text>
          <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary }}>
            Reset Your Password
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${theme.colors.accent1.tertiary}33`,
            borderWidth: 2,
            borderColor: theme.colors.greyscale.stroke,
            borderRadius: theme.radii.md,
            padding: theme.spacing.md,
          }}
        >
          <Text style={{ ...theme.typography.header.lg.bold, color: theme.colors.accent1.primary }}>{MOCK_EMAIL}</Text>
        </View>

        <View style={{ gap: theme.spacing.lg }}>
          <PasswordField
            label="Enter Old Password"
            value={oldPassword}
            onChangeText={setOldPassword}
            visible={showOld}
            onToggleVisible={() => setShowOld((v) => !v)}
          />
          <PasswordField
            label="Enter New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            visible={showNew}
            onToggleVisible={() => setShowNew((v) => !v)}
          />
          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            visible={showConfirm}
            onToggleVisible={() => setShowConfirm((v) => !v)}
          />
        </View>

        <View style={{ gap: theme.spacing.lg }}>
          <View style={{ gap: theme.spacing.sm }}>
            <Text style={{ ...theme.typography.header.sm.semibold, color: theme.colors.greyscale.textPrimary }}>{copy.label}</Text>
            <View style={{ height: 6, borderRadius: 2, backgroundColor: theme.colors.greyscale.bgDarken, overflow: 'hidden' }}>
              <View style={{ height: '100%', width: copy.width, backgroundColor: copy.color }} />
            </View>
            <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary }}>{copy.hint}</Text>
          </View>

          <View style={{ gap: theme.spacing.sm }}>
            <Text style={{ ...theme.typography.header.sm.semibold, color: theme.colors.greyscale.textPrimary }}>Password must contain</Text>
            <PasswordCheck label="Contain at least 8 characters" met={checks.length} />
            <PasswordCheck label="1 upper case character" met={checks.upper} />
            <PasswordCheck label="1 lower case character" met={checks.lower} />
            <PasswordCheck label="1 special character" met={checks.special} />
          </View>
        </View>

        <Pressable
          onPress={() => canContinue && setChanged(true)}
          disabled={!canContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue"
          accessibilityState={{ disabled: !canContinue }}
          style={{
            height: theme.sizes.ctaButtonHeight,
            borderRadius: theme.radii.full,
            backgroundColor: theme.colors.accent1.primary,
            opacity: canContinue ? 1 : 0.5,
            alignItems: 'center',
            justifyContent: 'center',
            ...theme.shadows.xs,
          }}
        >
          <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>Continue</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={changed} transparent animationType="fade" onRequestClose={() => setChanged(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl }}>
          <View
            style={{
              width: '100%',
              maxWidth: 390,
              backgroundColor: theme.colors.greyscale.bgLight,
              borderRadius: theme.radii.xl,
              padding: theme.spacing.xl,
              gap: theme.spacing.xl,
              alignItems: 'center',
              ...theme.shadows.lg,
            }}
          >
            <Pressable
              onPress={() => setChanged(false)}
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={{ position: 'absolute', right: theme.spacing.sm, top: theme.spacing.md }}
            >
              <Ionicons name="close" size={18} color={theme.colors.greyscale.textPrimary} />
            </Pressable>

            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: `${theme.colors.accent1.primary}22`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="checkmark-circle" size={32} color={theme.colors.accent1.primary} />
            </View>

            <View style={{ gap: theme.spacing.sm, alignItems: 'center' }}>
              <Text style={{ ...theme.typography.header.xl2.bold, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
                Password Changed
              </Text>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary, textAlign: 'center' }}>
                You have successfully changed your password
              </Text>
            </View>

            <Pressable
              onPress={() => {
                setChanged(false);
                navigation.goBack();
              }}
              accessibilityRole="button"
              accessibilityLabel="Okay"
              style={{
                width: '100%',
                height: theme.sizes.ctaButtonHeight,
                borderRadius: theme.radii.full,
                backgroundColor: theme.colors.accent1.primary,
                alignItems: 'center',
                justifyContent: 'center',
                ...theme.shadows.xs,
              }}
            >
              <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>Okay</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function PasswordField({
  label,
  value,
  onChangeText,
  visible,
  onToggleVisible,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.md }}>
      <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary }}>{label}</Text>
      <View
        style={{
          backgroundColor: theme.colors.greyscale.bgDarken,
          borderRadius: theme.radii.md,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          placeholder={label}
          placeholderTextColor={theme.colors.greyscale.textSecondary}
          autoCapitalize="none"
          style={{ flex: 1, ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textPrimary }}
          accessibilityLabel={label}
        />
        <Pressable onPress={onToggleVisible} accessibilityRole="button" accessibilityLabel={visible ? 'Hide password' : 'Show password'}>
          <Ionicons name={visible ? "eye-off" : "eye"} size={18} color={theme.colors.greyscale.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}

function PasswordCheck({ label, met }: { label: string; met: boolean }) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.xs }}>
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: met ? theme.colors.accent1.primary : theme.colors.greyscale.textTertiary,
          backgroundColor: met ? `${theme.colors.accent1.primary}33` : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {met && <Ionicons name="checkmark" size={10} color={theme.colors.accent1.primary} />}
      </View>
      <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textPrimary }}>{label}</Text>
    </View>
  );
}
