import React from 'react';
import { View, Text, Pressable, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

// Built from Figma 661:16756 ("Are You Sure you want to Sign out?") —
// Profile's "Logout" row (previously inert). Real downloaded illustration
// (undraw_Throw_away_re_x60k, a real image asset in Figma, not an SVG —
// assets/images/signout-illustration.png). Confirming resets the whole
// navigation stack back to Splash (per "sign out modal that leads to splash
// screen") rather than just navigating there, so the back button can't
// return into the signed-in app after signing out.

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function SignOutModal({ visible, onCancel, onConfirm }: Props) {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl }}>
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
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={{ position: 'absolute', right: theme.spacing.sm, top: theme.spacing.md }}
          >
            <Ionicons name="close" size={20} color={theme.colors.greyscale.textPrimary} />
          </Pressable>

          <Image
            source={require('../../assets/images/signout-illustration.png')}
            style={{ width: 124, height: 72 }}
            resizeMode="contain"
          />

          <View style={{ gap: theme.spacing.xl2, alignItems: 'center', width: '100%' }}>
            <Text style={{ ...theme.typography.header.xl2.bold, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
              Are You Sure You Want To Sign Out?
            </Text>

            <Pressable
              onPress={onConfirm}
              accessibilityRole="button"
              accessibilityLabel="Sign Out"
              style={{
                width: '100%',
                height: theme.sizes.ctaButtonHeight,
                borderRadius: theme.radii.full,
                backgroundColor: theme.colors.system.error,
                alignItems: 'center',
                justifyContent: 'center',
                ...theme.shadows.xs,
              }}
            >
              <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>Sign Out</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
