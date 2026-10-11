import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';

// Built from Figma 661:16751 ("Deactivate/Delete Account") and 661:16760
// ("Are You Sure" — the same screen at 70% opacity behind a confirm
// modal). The undraw illustration (a person throwing a folder in the
// trash) is swapped for a large emoji stand-in (🗑️), matching this
// codebase's existing convention for decorative undraw-style illustrations
// (see HomeScreen's "No Filtered Result" empty state using 🗂️) rather than
// downloading the real asset bytes.
//
// No real account/auth backend exists, so "deactivating" just simulates a
// logout: confirming resets the stack back to SignIn, consistent with how
// mocked auth is handled elsewhere in this app (no actual data is deleted,
// there's none to delete).

type Props = NativeStackScreenProps<RootStackParamList, 'DeactivateAccount'>;

export function DeactivateAccountScreen({ navigation }: Props) {
  const theme = useTheme();
  const [confirming, setConfirming] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="Deactivate/Delete Account" onBack={() => navigation.goBack()} />
      <View style={{ flex: 1, padding: theme.spacing.lg, gap: theme.spacing.xl2 }}>
        <View
          style={{
            height: 185,
            borderRadius: theme.radii.md,
            backgroundColor: theme.colors.greyscale.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 72 }}>🗑️</Text>
        </View>

        <View style={{ gap: theme.spacing.sm, alignItems: 'center' }}>
          <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.system.error }}>
            Deactivate/Delete Account
          </Text>
          <Text style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textSecondary, textAlign: 'center' }}>
            Are you sure that you want to delete or deactivate your account? This decision cannot be reversed.
          </Text>
        </View>

        <Pressable
          onPress={() => setConfirming(true)}
          accessibilityRole="button"
          accessibilityLabel="Deactivate or delete account"
          style={{
            height: theme.sizes.ctaButtonHeight,
            borderRadius: theme.radii.full,
            backgroundColor: theme.colors.system.error,
            alignItems: 'center',
            justifyContent: 'center',
            ...theme.shadows.xs,
          }}
        >
          <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>
            Deactivate/Delete Account
          </Text>
        </Pressable>
      </View>

      <Modal visible={confirming} transparent animationType="fade" onRequestClose={() => setConfirming(false)}>
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
              onPress={() => setConfirming(false)}
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
                backgroundColor: `${theme.colors.system.error}22`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="help-circle" size={32} color={theme.colors.accent1.primary} />
            </View>

            <View style={{ gap: theme.spacing.sm, alignItems: 'center' }}>
              <Text style={{ ...theme.typography.header.xl2.bold, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
                Are You Sure
              </Text>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary, textAlign: 'center' }}>
                Deactivating your account means you will no longer have access to any material or recourse related to iBrary
              </Text>
            </View>

            <Pressable
              onPress={() => {
                setConfirming(false);
                navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
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
