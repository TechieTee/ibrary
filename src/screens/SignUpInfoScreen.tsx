import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';
import { ThemeTogglePill } from '../components/ThemeTogglePill';
import { FormField } from '../components/FormField';

// Built from Figma frames 661:16389 (dark) / 654:22419 (light) — "Enter
// Information" personal-details form.
//
// Referral modals: the dark-mode links sent for these ("Referral Code
// Accepted" and "Wrong Referral Code") both turned out to be duplicates of
// other screens rather than real dark frames — 654:22419 (given as
// "accepted, dark") is the same node as the light info screen, and
// 654:22411 (given as "wrong code, dark") resolved to the light
// "Referral Code Accepted" modal. So only light-mode content for both
// modals was actually reachable. Reconstructed dark versions below using
// the same theme tokens the rest of the app already swaps on — flagged
// rather than silently presented as pulled from Figma.
//
// Referral code validation is mocked (no backend yet): "IBRARY10" is
// treated as valid, any other non-empty code as wrong, matching the two
// modal states in the design. Paystack integration was mentioned as a
// future step — this form intentionally stops at "Continue" (no payment
// step here), ready for that to slot in later without restructuring.

type Props = NativeStackScreenProps<RootStackParamList, 'SignUpInfo'>;

const VALID_REFERRAL_CODE = 'IBRARY10';

export function SignUpInfoScreen({ navigation }: Props) {
  const theme = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [modal, setModal] = useState<'accepted' | 'wrong' | null>(null);

  function continuePress() {
    if (referralCode.trim().length === 0) {
      navigation.navigate('CreatePassword', { email });
      return;
    }
    setModal(referralCode.trim().toUpperCase() === VALID_REFERRAL_CODE ? 'accepted' : 'wrong');
  }

  function closeModalAndContinue() {
    const wasAccepted = modal === 'accepted';
    setModal(null);
    if (wasAccepted) {
      navigation.navigate('CreatePassword', { email });
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="Enter Information" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl2, paddingBottom: theme.spacing.xl3 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Image
            source={require('../../assets/images/ibrary-logo.png')}
            style={{ width: 100, height: 28 }}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
          <ThemeTogglePill />
        </View>

        <View style={{ gap: theme.spacing.xs }}>
          <Text style={{ ...theme.typography.header.xl2.bold, color: theme.colors.greyscale.textPrimary }}>
            Personal Details
          </Text>
          <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary }}>
            We just need you to fill in some details.
          </Text>
        </View>

        <View style={{ gap: theme.spacing.lg }}>
          <FormField label="First Name" value={firstName} onChangeText={setFirstName} placeholder="Enter First Name" maxLength={100} />
          <FormField label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Enter Last Name" maxLength={100} />
          <FormField label="Username" value={username} onChangeText={setUsername} placeholder="Enter Username" maxLength={100} autoCapitalize="none" />
          <FormField label="Phone Number (Optional)" value={phone} onChangeText={setPhone} placeholder="Enter Phone Number" maxLength={11} keyboardType="phone-pad" />
          <FormField label="Email" value={email} onChangeText={setEmail} placeholder="Enter Email" maxLength={100} keyboardType="email-address" autoCapitalize="none" />
          <FormField label="Referral Code (Optional)" value={referralCode} onChangeText={setReferralCode} placeholder="Enter Code" maxLength={100} autoCapitalize="characters" />
        </View>

        <Text style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
          By continuing you agree to IBrary&rsquo;s{' '}
          <Text style={{ color: theme.colors.accent1.primary }}>Terms and Condition</Text>
        </Text>

        <Pressable
          onPress={continuePress}
          accessibilityRole="button"
          accessibilityLabel="Continue"
          style={{
            height: theme.sizes.ctaButtonHeight,
            borderRadius: theme.radii.full,
            backgroundColor: theme.colors.accent1.primary,
            alignItems: 'center',
            justifyContent: 'center',
            ...theme.shadows.xs,
          }}
        >
          <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>Continue</Text>
        </Pressable>

        <Text style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
          Already have an account?{' '}
          <Text
            accessibilityRole="link"
            accessibilityLabel="Login Here"
            style={{ fontWeight: '700', textDecorationLine: 'underline' }}
            onPress={() => navigation.navigate('SignIn')}
          >
            Login Here
          </Text>
        </Text>
      </ScrollView>

      <Modal visible={modal != null} transparent animationType="fade" onRequestClose={() => setModal(null)}>
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
              onPress={() => setModal(null)}
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
              <Ionicons name={modal === 'accepted' ? 'checkmark-circle' : 'warning'} size={32} color={theme.colors.accent1.primary} />
            </View>

            <View style={{ gap: theme.spacing.sm, alignItems: 'center' }}>
              <Text style={{ ...theme.typography.header.xl2.bold, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
                {modal === 'accepted' ? 'Referral Code Accepted' : 'Wrong Referral Code'}
              </Text>
              <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary, textAlign: 'center' }}>
                {modal === 'accepted' ? (
                  <>
                    You have been given <Text style={{ color: theme.colors.accent1.primary, fontWeight: '700' }}>10%</Text> off on Monthly
                    Subscription and <Text style={{ color: theme.colors.accent1.primary, fontWeight: '700' }}>5%</Text> off on your Yearly
                    Subscription
                  </>
                ) : (
                  'You entered a wrong code. Please try again'
                )}
              </Text>
            </View>

            <Pressable
              onPress={closeModalAndContinue}
              accessibilityRole="button"
              accessibilityLabel="Continue"
              style={{
                width: '100%',
                height: theme.sizes.ctaButtonHeight,
                borderRadius: theme.radii.full,
                backgroundColor: theme.colors.accent1.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ ...theme.typography.header.lg.semibold, color: theme.colors.greyscale.white }}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
