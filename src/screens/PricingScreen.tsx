import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';
import { useSubscriptionStore } from '../store/subscriptionStore';

// Built from Figma frames 661:16339 (dark, monthly) / 661:16340 (dark,
// yearly) / 654:22417 (light, monthly) / 654:22409 (light, yearly), plus
// the "Subscription made" modal (661:16343 dark / 654:22412 light).
//
// Only one plan ("Complete Academic Journey") exists in the design — the
// Monthly/Yearly control changes that single card's price, not which
// plan is shown, so this is built as one card with a tab-driven price
// rather than multiple plan cards.
//
// The yearly card's diagonal gradient background isn't reproduced (a
// decorative CSS gradient with no simple RN equivalent) — using a flat
// themed card background for both tabs instead. The Figma "Skip for now"
// link in dark mode is literally colored near-black (#181818) — invisible
// on the dark background, evidently a copy/paste leftover from the light
// variant — so it's rendered with a real visible color here instead.
//
// Repurposed (continuing the Profile -> Subscriptions flow) to also serve
// as the "manage an existing subscription" screen via route param
// `mode: 'manage'` (661:43930 "Cancel Subscription" on your active
// cycle's tab, 661:43929 "Switch Subscription Here" on the other tab),
// reached from SubscriptionScreen's "Manage Subscription" button —
// default `mode: 'subscribe'` (undefined) keeps the original signup/
// premium-gate behavior ("Get Started Now") unchanged. Cancelling opens
// an "Are You Sure" confirm modal (661:16761) before actually cancelling;
// switching reuses the existing PaystackCheckout flow and shows a
// "switched" variant of the success modal (661:16732) instead of
// "subscribed". Successful subscribe/switch now also writes the result
// into subscriptionStore (previously only the dev toggle did this).

type Props = NativeStackScreenProps<RootStackParamList, 'Pricing'>;

const MONTHLY_PRICE = 4500;
const YEARLY_MONTHLY_EQUIVALENT = 4050; // 10% off, shown as a strike-through vs MONTHLY_PRICE

const FEATURES = [
  'Encourages consistent study habits',
  'One-time payment, no monthly reminders',
  'Saves money compared to monthly plan',
  'More revision time for assessment',
  'Cancel or upgrade anytime',
];

export function PricingScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const mode = route.params?.mode ?? 'subscribe';
  const activeCycle = useSubscriptionStore((s) => s.cycle);
  const setSubscription = useSubscriptionStore((s) => s.setSubscription);

  const [cycle, setCycle] = useState<'monthly' | 'yearly'>(route.params?.cycle ?? (mode === 'manage' ? activeCycle ?? 'monthly' : 'monthly'));
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  useEffect(() => {
    if (route.params?.justSubscribed) {
      setShowSuccess(true);
      if (route.params.cycle) {
        setCycle(route.params.cycle);
        setSubscription('active', route.params.cycle);
      }
    }
  }, [route.params?.justSubscribed, route.params?.cycle]);

  const price = cycle === 'yearly' ? YEARLY_MONTHLY_EQUIVALENT : MONTHLY_PRICE;
  const isCurrentPlan = mode === 'manage' && cycle === activeCycle;

  function primaryActionPress() {
    navigation.navigate('PaystackCheckout', { amount: price, cycle, mode });
  }

  function confirmCancel() {
    setSubscription('expired', null);
    setConfirmingCancel(false);
    navigation.navigate('Tabs', { screen: 'Profile' });
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="Pricing" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl2, paddingBottom: theme.spacing.xl3 }}>
        <View style={{ gap: theme.spacing.xs }}>
          <Text style={{ ...theme.typography.display.xl4.semibold, color: theme.colors.greyscale.textPrimary, textTransform: 'uppercase' }}>
            Pricing
          </Text>
          <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
            Your learning journey starts with the right membership
          </Text>
        </View>
        <View style={{ height: 1, backgroundColor: theme.colors.greyscale.stroke }} />

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: theme.colors.greyscale.textPrimary,
            borderRadius: theme.radii.full,
            padding: 2,
          }}
        >
          {(['monthly', 'yearly'] as const).map((c) => {
            const selected = cycle === c;
            return (
              <Pressable
                key={c}
                onPress={() => setCycle(c)}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={c === 'monthly' ? 'Monthly billing' : 'Yearly billing'}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: theme.radii.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: selected ? theme.colors.accent1.primary : 'transparent',
                }}
              >
                <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.white, textTransform: 'uppercase' }}>
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View
          style={{
            borderRadius: theme.radii.lg,
            borderWidth: 1,
            borderColor: theme.colors.greyscale.stroke,
            backgroundColor: theme.colors.greyscale.bgDarken,
            padding: theme.spacing.xl,
            gap: theme.spacing.xl,
          }}
        >
          <Ionicons name="rocket-outline" size={40} color={theme.colors.accent1.primary} />
          <View style={{ gap: theme.spacing.xs }}>
            <Text style={{ ...theme.typography.header.lg.bold, color: theme.colors.greyscale.textPrimary }}>Complete Academic Journey</Text>
            <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textSecondary }}>
              Students committed to consistent learning and long-term academic improvement.
            </Text>
          </View>

          <View style={{ gap: theme.spacing.lg }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.xs }}>
              {cycle === 'yearly' && (
                <Text
                  style={{
                    ...theme.typography.display.xl4.semibold,
                    color: theme.colors.greyscale.textSecondary,
                    textDecorationLine: 'line-through',
                  }}
                >
                  ₦{MONTHLY_PRICE.toLocaleString()}
                </Text>
              )}
              <Text style={{ ...theme.typography.display.xl4.semibold, color: theme.colors.greyscale.textPrimary }}>
                ₦{price.toLocaleString()}
              </Text>
              <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textSecondary }}>/Month</Text>
            </View>

            {isCurrentPlan ? (
              <Pressable
                onPress={() => setConfirmingCancel(true)}
                accessibilityRole="button"
                accessibilityLabel="Cancel Subscription"
                style={{
                  height: theme.sizes.ctaButtonHeight,
                  borderRadius: theme.radii.full,
                  borderWidth: 1,
                  borderColor: theme.colors.accent1.primary,
                  backgroundColor: theme.colors.greyscale.bgLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.accent1.primary }}>Cancel Subscription</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={primaryActionPress}
                accessibilityRole="button"
                accessibilityLabel={mode === 'manage' ? 'Switch Subscription Here' : 'Get Started Now'}
                style={{
                  height: theme.sizes.ctaButtonHeight,
                  borderRadius: theme.radii.full,
                  backgroundColor: theme.colors.accent1.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...theme.shadows.xs,
                }}
              >
                <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>
                  {mode === 'manage' ? 'Switch Subscription Here' : 'Get Started Now'}
                </Text>
              </Pressable>
            )}
          </View>

          <View style={{ gap: theme.spacing.md }}>
            {FEATURES.map((f) => (
              <View key={f} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
                <Ionicons name="checkmark" size={16} color={theme.colors.accent1.primary} />
                <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textSecondary, flex: 1 }}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          onPress={() => navigation.replace('Tabs')}
          accessibilityRole="button"
          accessibilityLabel="Skip for now"
          style={{ alignSelf: 'center' }}
        >
          <Text style={{ ...theme.typography.header.base.bold, color: theme.colors.greyscale.textSecondary, textTransform: 'uppercase' }}>
            Skip for now ›
          </Text>
        </Pressable>
      </ScrollView>

      <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={() => setShowSuccess(false)}>
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
              onPress={() => setShowSuccess(false)}
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
              <Text style={{ ...theme.typography.header.xl2.bold, color: theme.colors.greyscale.textPrimary }}>Congratulation!</Text>
              <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary, textAlign: 'center' }}>
                {mode === 'manage' ? (
                  <>
                    You have successfully Switched to a <Text style={{ fontWeight: '700' }}>{cycle === 'yearly' ? 'yearly' : 'monthly'}</Text>{' '}
                    subscription! Check your profile tab to view your subscription.
                  </>
                ) : (
                  <>
                    You have successfully subscribed to the{' '}
                    <Text style={{ fontWeight: '700' }}>{cycle === 'yearly' ? 'Yearly' : 'Monthly'} Subscription</Text> of IBrary! Check your
                    profile tab to view your subscription.
                  </>
                )}
              </Text>
            </View>

            {mode === 'manage' ? (
              <Pressable
                onPress={() => {
                  setShowSuccess(false);
                  navigation.navigate('Tabs', { screen: 'Profile' });
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
            ) : (
              <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
                <Pressable
                  onPress={() => {
                    setShowSuccess(false);
                    navigation.navigate('TransactionReceipt', { amount: price, cycle });
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="View Receipt"
                  style={{
                    height: 56,
                    paddingHorizontal: theme.spacing.xl,
                    borderRadius: theme.radii.full,
                    borderWidth: 1.2,
                    borderColor: theme.colors.accent1.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ ...theme.typography.header.lg.semibold, color: theme.colors.accent1.primary }}>View Receipt</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setShowSuccess(false);
                    navigation.replace('Tabs');
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Go to Dashboard"
                  style={{
                    height: 56,
                    paddingHorizontal: theme.spacing.xl,
                    borderRadius: theme.radii.full,
                    backgroundColor: theme.colors.accent1.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ ...theme.typography.header.lg.semibold, color: theme.colors.greyscale.white }}>Go to Dashboard</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={confirmingCancel} transparent animationType="fade" onRequestClose={() => setConfirmingCancel(false)}>
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
              onPress={() => setConfirmingCancel(false)}
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
                Cancelling your membership status subscription will deactivate your status, and you will no longer have access to premium
                activities
              </Text>
            </View>

            <Pressable
              onPress={confirmCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancel Membership"
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
              <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>Cancel Membership</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
