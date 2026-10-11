import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';

// Built from Figma frame 661:16385 (dark) / 654:22433 (light) — "Set Your
// Password" / re-create-password step of the forgot-password flow. Same
// password-strength-meter pattern as CreatePasswordScreen.tsx (signup) —
// see that file's comment for why the strength colors are local constants
// rather than theme tokens.

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

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

export function ResetPasswordScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { email } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { strength, checks } = useMemo(() => evaluateStrength(password), [password]);
  const copy = STRENGTH_COPY[strength];
  const canContinue = password.length > 0 && password === confirmPassword && strength !== 'weak';

  function continuePress() {
    if (!canContinue) return;
    navigation.replace('SignIn', { justReset: true });
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl2, paddingTop: theme.spacing.xl3, paddingBottom: theme.spacing.xl3 }}>
        <View style={{ gap: theme.spacing.xs }}>
          <Text style={{ ...theme.typography.header.xl2.bold, color: theme.colors.greyscale.textPrimary }}>Set Your Password</Text>
          <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary }}>
            Re-Create the Password to your iBrary Account
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
          <Text style={{ ...theme.typography.header.lg.bold, color: theme.colors.accent1.primary }}>{email}</Text>
        </View>

        <View style={{ gap: theme.spacing.lg }}>
          <PasswordField
            label="Create Password"
            value={password}
            onChangeText={setPassword}
            visible={showPassword}
            onToggleVisible={() => setShowPassword((v) => !v)}
          />
          <PasswordField
            label="Confirm Password"
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
          onPress={continuePress}
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
