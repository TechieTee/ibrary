import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { ThemeTogglePill } from '../components/ThemeTogglePill';
import { FormField } from '../components/FormField';

// Built from Figma frame 654:22438 (light) — "Personal Details" / Sign
// In screen, plus its "Invalid Username/Password" modal (654:22431,
// light). The dark-mode links sent for both actually resolved to
// unrelated screens (Transaction Receipt and this same Sign In frame,
// respectively) — flagged in navigation/types.ts. Since colors here are
// pulled through useTheme() like every other screen, this single
// implementation already renders correctly in both light and dark; no
// separate dark build was needed regardless.
//
// Login is mocked (no backend yet): username "demo" + password
// "demo1234" is treated as valid, anything else shows the Invalid
// Username/Password modal — matching the two states in the design.
//
// "Forgot Password" (both the modal's CTA and the inline link) goes to
// ForgotPasswordVerifyScreen. No "enter your email" screen exists in this
// flow's Figma frames, so a placeholder email is passed straight through
// (matching Figma's own placeholder "johndoe@gmail.com") — flagged, not a
// real lookup.
//
// justReset (set by ResetPasswordScreen on completion) shows the
// "Congratulations, you can now Login" modal (661:16709 dark / 654:22430
// light) — its own "Login" button just dismisses it, matching Figma;
// the user still submits real credentials via the screen's own Login button.

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const VALID_USERNAME = 'demo';
const VALID_PASSWORD = 'demo1234';
const FORGOT_PASSWORD_EMAIL = 'johndoe@gmail.com';

export function SignInScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const [showResetSuccessModal, setShowResetSuccessModal] = useState(false);

  useEffect(() => {
    if (route.params?.justReset) {
      setShowResetSuccessModal(true);
    }
  }, [route.params?.justReset]);

  function loginPress() {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      navigation.replace('Tabs');
    } else {
      setShowInvalidModal(true);
    }
  }

  function forgotPasswordPress() {
    setShowInvalidModal(false);
    navigation.navigate('ForgotPasswordVerify', { email: FORGOT_PASSWORD_EMAIL });
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl2, paddingTop: theme.spacing.xl3, paddingBottom: theme.spacing.xl3 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Image
            source={require('../../assets/images/ibrary-logo.png')}
            style={{ width: 100, height: 28 }}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
          <ThemeTogglePill />
        </View>
        <View style={{ height: 1, backgroundColor: theme.colors.greyscale.stroke }} />

        <View style={{ gap: theme.spacing.xs }}>
          <Text style={{ ...theme.typography.header.xl2.bold, color: theme.colors.greyscale.textPrimary }}>Personal Details</Text>
          <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary }}>
            We just need you to fill in some details.
          </Text>
        </View>

        <View style={{ gap: theme.spacing.lg }}>
          <FormField label="Username" value={username} onChangeText={setUsername} placeholder="Enter Username" maxLength={100} autoCapitalize="none" />
          <View style={{ gap: theme.spacing.md }}>
            <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary }}>Password</Text>
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
              <View style={{ flex: 1 }}>
                <FormFieldPasswordInput value={password} onChangeText={setPassword} visible={showPassword} />
              </View>
              <Pressable onPress={() => setShowPassword((v) => !v)} accessibilityRole="button" accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={theme.colors.greyscale.textSecondary} />
              </Pressable>
            </View>
          </View>
          <Pressable
            onPress={forgotPasswordPress}
            accessibilityRole="link"
            accessibilityLabel="Forgot Password"
            style={{ alignSelf: 'flex-end' }}
          >
            <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textPrimary }}>Forgot Password?</Text>
          </Pressable>
        </View>

        <Text style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
          By continuing you agree to IBrary&rsquo;s{' '}
          <Text style={{ color: theme.colors.accent1.primary }}>Terms and Condition</Text>
        </Text>

        <Pressable
          onPress={loginPress}
          accessibilityRole="button"
          accessibilityLabel="Login"
          style={{
            height: theme.sizes.ctaButtonHeight,
            borderRadius: theme.radii.full,
            backgroundColor: theme.colors.accent1.primary,
            alignItems: 'center',
            justifyContent: 'center',
            ...theme.shadows.xs,
          }}
        >
          <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>Login</Text>
        </Pressable>

        <Text style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
          Don&rsquo;t have an account?{' '}
          <Text
            accessibilityRole="link"
            accessibilityLabel="Signup Here"
            style={{ fontWeight: '700', textDecorationLine: 'underline' }}
            onPress={() => navigation.navigate('SignUpInfo')}
          >
            Signup Here
          </Text>
        </Text>
      </ScrollView>

      <Modal visible={showInvalidModal} transparent animationType="fade" onRequestClose={() => setShowInvalidModal(false)}>
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
              onPress={() => setShowInvalidModal(false)}
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
              <Text style={{ ...theme.typography.header.xl2.bold, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
                Invalid Username/ Password
              </Text>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary, textAlign: 'center' }}>
                Please cross check your information and try again or forgot password
              </Text>
            </View>

            <Pressable
              onPress={forgotPasswordPress}
              accessibilityRole="button"
              accessibilityLabel="Forgot Password"
              style={{
                width: '100%',
                height: theme.sizes.ctaButtonHeight,
                borderRadius: theme.radii.full,
                backgroundColor: theme.colors.accent1.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>Forgot Password</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={showResetSuccessModal} transparent animationType="fade" onRequestClose={() => setShowResetSuccessModal(false)}>
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
              onPress={() => setShowResetSuccessModal(false)}
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
              <Text style={{ ...theme.typography.header.xl2.bold, color: theme.colors.greyscale.textPrimary }}>Congratulations</Text>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary, textAlign: 'center' }}>
                You can now Login
              </Text>
            </View>

            <Pressable
              onPress={() => setShowResetSuccessModal(false)}
              accessibilityRole="button"
              accessibilityLabel="Login"
              style={{
                width: '100%',
                height: theme.sizes.ctaButtonHeight,
                borderRadius: theme.radii.full,
                backgroundColor: theme.colors.accent1.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>Login</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Small inline password TextInput — kept local since it needs the eye
// toggle to sit as a sibling within the same field row (unlike FormField,
// which renders its rightAccessory inside the same row already, but this
// mirrors CreatePasswordScreen's PasswordField pattern instead for
// consistency with the other password fields in this app).
function FormFieldPasswordInput({ value, onChangeText, visible }: { value: string; onChangeText: (v: string) => void; visible: boolean }) {
  const theme = useTheme();
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!visible}
      placeholder="Enter Password"
      placeholderTextColor={theme.colors.greyscale.textSecondary}
      autoCapitalize="none"
      style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textPrimary }}
      accessibilityLabel="Password"
    />
  );
}
