import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

// Built from Figma frames 661:16706 ("Subscription Expired") and
// 661:16707 ("Unlock with Pro") — two copy variants of the same modal
// shell shown over Home for premium-gated actions. 661:16692 (the third
// link sent) is just the plain Home screen with no modal — included as
// background context, not a distinct third state.
//
// Both "Choose a Plan" buttons navigate to PricingScreen.

export type PremiumGateVariant = 'expired' | 'unlock';

const COPY: Record<PremiumGateVariant, { title: string; description: string }> = {
  expired: {
    title: 'Subscription Expired',
    description: "You've used up your plan. Renew now to continue enjoying premium learning features.",
  },
  unlock: {
    title: 'Unlock with Pro',
    description: 'Subscribe to the Pro plan to use this feature and more.',
  },
};

interface Props {
  variant: PremiumGateVariant | null;
  onClose: () => void;
  onChoosePlan: () => void;
}

export function PremiumGateModal({ variant, onClose, onChoosePlan }: Props) {
  const theme = useTheme();
  if (!variant) return null;
  const copy = COPY[variant];

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
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
            onPress={onClose}
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
            <Ionicons name={variant === 'expired' ? 'hourglass-outline' : 'lock-closed-outline'} size={32} color={theme.colors.accent1.primary} />
          </View>

          <View style={{ gap: theme.spacing.sm, alignItems: 'center' }}>
            <Text style={{ ...theme.typography.header.xl2.bold, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
              {copy.title}
            </Text>
            <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary, textAlign: 'center' }}>
              {copy.description}
            </Text>
          </View>

          <Pressable
            onPress={onChoosePlan}
            accessibilityRole="button"
            accessibilityLabel="Choose a Plan"
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
            <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>Choose a Plan</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
