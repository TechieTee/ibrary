import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';

// Built from Figma frames 661:16392 (dark, empty) / 661:16393 (dark,
// filled) / 661:16394 (dark, expired) and their light equivalents
// (654:22435 / 654:22434 / 654:22432) — three states of the same OTP
// screen, not three separate screens. Plus the "OTP not Correct" modal
// (661:16710 dark / 654:22437 light) shown on a wrong submission — Figma's
// own button label reads "Dimiss" (typo), corrected to "Dismiss" here.
//
// Mock OTP verification (no backend): the code shown filled-in in Figma's
// own "filled" state, "535190", is treated as correct; anything else
// shows the wrong-OTP modal. "Resend Code" just resets the countdown —
// no real code is sent.

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPasswordVerify'>;

const CODE_LENGTH = 6;
const EXPIRY_SECONDS = 59;
const VALID_CODE = '535190';

export function ForgotPasswordVerifyScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { email } = route.params;
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_SECONDS);
  const [showWrongOtpModal, setShowWrongOtpModal] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const code = digits.join('');
  const canSubmit = code.length === CODE_LENGTH;
  const expired = secondsLeft <= 0;

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

  function resendCode() {
    setSecondsLeft(EXPIRY_SECONDS);
    setDigits(Array(CODE_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
  }

  function submitPress() {
    if (!canSubmit) return;
    if (code === VALID_CODE) {
      navigation.navigate('ResetPassword', { email });
    } else {
      setShowWrongOtpModal(true);
    }
  }

  const timerLabel = `00:${String(Math.max(secondsLeft, 0)).padStart(2, '0')}`;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <View style={{ padding: theme.spacing.lg, paddingTop: theme.spacing.xl3, gap: theme.spacing.xl2 }}>
        <View style={{ gap: theme.spacing.xs }}>
          <Text style={{ ...theme.typography.header.xl2.bold, color: theme.colors.greyscale.textPrimary }}>
            Verify Your Email
          </Text>
          <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
            We&rsquo;ve sent a 6-digit code to{' '}
            <Text style={{ fontWeight: '700', color: theme.colors.greyscale.textSecondary }}>{email}</Text>. It expires in 1 minute
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
              backgroundColor: canSubmit ? theme.colors.accent1.primary : `${theme.colors.accent1.tertiary}33`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ ...theme.typography.body.base.medium, color: canSubmit ? theme.colors.greyscale.white : theme.colors.accent1.primary }}>
              Submit
            </Text>
          </Pressable>
        </View>

        {expired ? (
          <Pressable onPress={resendCode} accessibilityRole="button" accessibilityLabel="Resend code" style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.textPrimary }}>
              Didn&rsquo;t Receive Code?
            </Text>
            <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.accent1.primary }}>
              <Text style={{ color: theme.colors.system.error }}>{timerLabel}</Text> - Resend Code
            </Text>
          </Pressable>
        ) : (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.textPrimary }}>
              Didn&rsquo;t Receive Code?
            </Text>
            <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.accent1.primary }}>{timerLabel}</Text>
          </View>
        )}
      </View>

      <Modal visible={showWrongOtpModal} transparent animationType="fade" onRequestClose={() => setShowWrongOtpModal(false)}>
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
              onPress={() => setShowWrongOtpModal(false)}
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
              <Ionicons name="warning" size={32} color={theme.colors.accent1.primary} />
            </View>

            <View style={{ gap: theme.spacing.sm, alignItems: 'center' }}>
              <Text style={{ ...theme.typography.header.xl2.bold, color: theme.colors.greyscale.textPrimary }}>OTP not Correct</Text>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary, textAlign: 'center' }}>
                Please use the right OTP
              </Text>
            </View>

            <Pressable
              onPress={() => setShowWrongOtpModal(false)}
              accessibilityRole="button"
              accessibilityLabel="Dismiss"
              style={{
                width: '100%',
                height: theme.sizes.ctaButtonHeight,
                borderRadius: theme.radii.full,
                backgroundColor: theme.colors.accent1.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>Dismiss</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
