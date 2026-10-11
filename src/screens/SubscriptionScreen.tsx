import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';
import { useSubscriptionStore } from '../store/subscriptionStore';

// Built from Figma 661:16762 ("MONTHLY SUBSCRIPTION") — reached from
// Profile's "Subscriptions" row (previously inert, no screen existed).
// Figma only shows the monthly-active state; this renders the same card
// for 'yearly' too (swapping the label), driven by subscriptionStore's
// `cycle`, rather than hardcoding "Monthly" regardless of the real mock
// state. The card's bank/contactless-card graphic is simplified to a flat
// themed card (no real asset for it), and "Next Billing Date" is a fixed
// mock value — there's no real billing system to compute one from.
//
// If there's no active subscription (status !== 'active' — reachable via
// ProfileScreen's dev toggle, or after cancelling), this shows a simple
// empty state with a link to Pricing instead of Figma's card, since no
// Figma frame covers that state.

type Props = NativeStackScreenProps<RootStackParamList, 'Subscription'>;

const FEATURES = [
  'Practice questions with guided solutions',
  'Regular quizzes to track improvement',
  'Exam-focused revision content',
  'Easy-to-understand explanations',
  'Cancel or upgrade anytime',
];

const MOCK_NEXT_BILLING_DATE = '12/08/2025';

export function SubscriptionScreen({ navigation }: Props) {
  const theme = useTheme();
  const status = useSubscriptionStore((s) => s.status);
  const cycle = useSubscriptionStore((s) => s.cycle);

  const isActive = status === 'active' && cycle != null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="Subscription" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl2 }}>
        {isActive ? (
          <>
            <View
              style={{
                borderRadius: theme.radii.lg,
                backgroundColor: theme.colors.greyscale.white,
                padding: theme.spacing.xl,
                gap: theme.spacing.xl2,
                borderWidth: 2,
                borderColor: theme.colors.accent1.primary,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Ionicons name="card" size={24} color={theme.colors.accent1.primary} />
                <Ionicons name="wifi" size={18} color={theme.colors.greyscale.textSecondary} />
              </View>
              <View style={{ gap: 2 }}>
                <Text style={{ ...theme.typography.header.lg.medium, color: theme.colors.greyscale.textPrimary }}>Premium</Text>
                <Text style={{ ...theme.typography.header.lg.bold, color: theme.colors.greyscale.textPrimary, textTransform: 'uppercase' }}>
                  {cycle} subscription
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => navigation.navigate('Pricing', { mode: 'manage', cycle: cycle ?? 'monthly' })}
              accessibilityRole="button"
              accessibilityLabel="Manage Subscription"
              style={{
                alignSelf: 'center',
                paddingHorizontal: theme.spacing.xl2,
                paddingVertical: theme.spacing.md,
                borderRadius: theme.radii.full,
                backgroundColor: theme.colors.accent1.primary,
                marginTop: -theme.spacing.xl,
              }}
            >
              <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.white }}>Manage Subcription</Text>
            </Pressable>

            <View style={{ gap: theme.spacing.md }}>
              {FEATURES.map((f) => (
                <View key={f} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
                  <Ionicons name="checkmark" size={16} color={theme.colors.accent1.primary} />
                  <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textSecondary, flex: 1 }}>{f}</Text>
                </View>
              ))}
            </View>

            <View style={{ gap: theme.spacing.md }}>
              <Text style={{ ...theme.typography.header.lg.medium, color: theme.colors.greyscale.textPrimary }}>Next Billing Date</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
                <Ionicons name="calendar-outline" size={18} color={theme.colors.greyscale.textSecondary} />
                <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.textSecondary }}>
                  {MOCK_NEXT_BILLING_DATE}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View style={{ alignItems: 'center', gap: theme.spacing.lg, paddingTop: theme.spacing.xl3 }}>
            <Ionicons name="lock-closed-outline" size={48} color={theme.colors.greyscale.textSecondary} />
            <Text style={{ ...theme.typography.header.lg.semibold, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
              No active subscription
            </Text>
            <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary, textAlign: 'center' }}>
              Subscribe to a plan to unlock premium learning features.
            </Text>
            <Pressable
              onPress={() => navigation.navigate('Pricing', { mode: 'subscribe' })}
              accessibilityRole="button"
              accessibilityLabel="View Plans"
              style={{
                paddingHorizontal: theme.spacing.xl2,
                paddingVertical: theme.spacing.md,
                borderRadius: theme.radii.full,
                backgroundColor: theme.colors.accent1.primary,
              }}
            >
              <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.white }}>View Plans</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
