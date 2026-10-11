import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';

// Built from Figma frames 661:16379 (dark) / 654:22403 (light) — "Verify
// Your Email" 6-digit OTP screen, with a live 1-minute countdown matching
// the Figma copy ("It expires in 1 minute").
//
// "Back to Sign In" goes to SignInScreen. "Submit" continues into the
// 7-step signup assessment survey (SignUpAssessmentScreen).
//
// OTP verification itself is not real — any 6 digits are accepted, since
// there's no backend wired up yet.

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyEmail'>;

const CODE_LENGTH = 6;
const EXPIRY_SECONDS = 59;

export function VerifyEmailScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { email } = route.params;
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_SECONDS);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const code = digits.join('');
  const canSubmit = code.length === CODE_LENGTH;

  function setDigit(index: number, value: string) {
    const char = value.slice(-1).replace(/[^0-9]/g, '');
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(index: number, key: string) {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function submitPress() {
    if (!canSubmit) return;
    navigation.replace('SignUpAssessment');
  }

  const timerLabel = `00:${String(Math.max(secondsLeft, 0)).padStart(2, '0')}`;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="Enter Information" onBack={() => navigation.goBack()} />
      <View style={{ padding: theme.spacing.lg, gap: theme.spacing.xl2 }}>
        <View style={{ gap: theme.spacing.xs }}>
          <Text style={{ ...theme.typography.header.xl2.bold, color: theme.colors.greyscale.textPrimary }}>
            Verify Your Email
          </Text>
          <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary }}>
            We&rsquo;ve sent a 6-digit code to{' '}
            <Text style={{ fontWeight: '700', color: theme.colors.greyscale.textSecondary }}>{email || 'your email'}</Text>. It expires in 1
            minute
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }} accessibilityLabel="One-time passcode input">
          {digits.slice(0, 3).map((digit, i) => (
            <OtpBox key={i} value={digit} onChangeText={(v) => setDigit(i, v)} onKeyPressBackspace={() => handleKeyPress(i, 'Backspace')} inputRef={(r) => (inputRefs.current[i] = r)} />
          ))}
          <Text style={{ ...theme.typography.header.xl2.semibold, color: theme.colors.accent1.primary }}>-</Text>
          {digits.slice(3, 6).map((digit, i) => {
            const index = i + 3;
            return (
              <OtpBox key={index} value={digit} onChangeText={(v) => setDigit(index, v)} onKeyPressBackspace={() => handleKeyPress(index, 'Backspace')} inputRef={(r) => (inputRefs.current[index] = r)} />
            );
          })}
        </View>

        <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
          <Pressable
            onPress={() => navigation.navigate('SignIn')}
            accessibilityRole="button"
            accessibilityLabel="Back to Sign In"
            style={{
              flex: 1,
              height: 56,
              borderRadius: theme.radii.md,
              borderWidth: 1.2,
              borderColor: theme.colors.accent1.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.accent1.primary }}>Back to Sign In</Text>
          </Pressable>
          <Pressable
            onPress={submitPress}
            disabled={!canSubmit}
            accessibilityRole="button"
            accessibilityLabel="Submit"
            accessibilityState={{ disabled: !canSubmit }}
            style={{
              flex: 1,
              height: 56,
              borderRadius: theme.radii.md,
              borderWidth: 1.2,
              borderColor: theme.colors.accent1.primary,
              backgroundColor: `${theme.colors.accent1.tertiary}33`,
              opacity: canSubmit ? 1 : 0.5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.accent1.primary }}>Submit</Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.textPrimary }}>
            Didn&rsquo;t Receive Code?
          </Text>
          <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.system.error }}>{timerLabel}</Text>
        </View>
      </View>
    </View>
  );
}

function OtpBox({
  value,
  onChangeText,
  onKeyPressBackspace,
  inputRef,
}: {
  value: string;
  onChangeText: (v: string) => void;
  onKeyPressBackspace: () => void;
  inputRef: (r: TextInput | null) => void;
}) {
  const theme = useTheme();
  return (
    <TextInput
      ref={inputRef}
      value={value}
      onChangeText={onChangeText}
      onKeyPress={({ nativeEvent }) => {
        if (nativeEvent.key === 'Backspace') onKeyPressBackspace();
      }}
      keyboardType="number-pad"
      maxLength={1}
      accessibilityLabel="Digit"
      style={{
        width: 48,
        height: 56,
        borderRadius: theme.radii.md,
        borderWidth: 1,
        borderColor: theme.colors.accent1.primary,
        backgroundColor: theme.colors.greyscale.bgLight,
        textAlign: 'center',
        ...theme.typography.header.xl1.semibold,
        color: theme.colors.accent1.primary,
      }}
    />
  );
}
