import React, { useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

// Built from Figma frames 661:16349 (dark) / 654:22405 (light) —
// "Transaction Receipt". The decorative confetti banner and ticket-edge
// scalloping aren't reproduced (raster/vector decoration, not
// functional) — using a plain card. Recipient/Sender/reference/session
// values are mocked (no real payment backend), formatted the same way
// the design shows them; the transaction date uses the real current
// date/time instead of Figma's placeholder date.
//
// Download/Share are non-functional placeholders — there's no PDF/image
// generation wired up, flagged rather than faked further.

type Props = NativeStackScreenProps<RootStackParamList, 'TransactionReceipt'>;

function formatDate(d: Date): string {
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${weekday} ${month} ${d.getDate()}, ${d.getFullYear()}, ${time}`;
}

function randomRef(): string {
  return Math.random().toString(36).slice(2, 12).toUpperCase();
}

export function TransactionReceiptScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { amount, cycle } = route.params;
  const ref = useMemo(() => randomRef(), []);
  const date = useMemo(() => formatDate(new Date()), []);

  const rows: Array<[string, string]> = [
    ['Recipient :', 'iBrary'],
    ['Sender :', 'You'],
    ['Transaction Date:', date],
    ['Transaction Type:', 'Debit'],
    ['Plan:', cycle === 'yearly' ? 'Yearly Subscription' : 'Monthly Subscription'],
    ['Transaction Ref.:', ref],
    ['Status', 'Successful'],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgDarken }}>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.greyscale.stroke,
          backgroundColor: theme.colors.greyscale.bgLight,
        }}
      >
        <View style={{ height: insets.top }} />
        <View
          style={{
            height: 56,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: theme.spacing.lg,
          }}
        >
          <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back" style={{ width: 24, height: 24, justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, color: theme.colors.greyscale.textPrimary }}>‹</Text>
          </Pressable>
          <Text
            style={{
              ...theme.typography.header.lg.semibold,
              color: theme.colors.greyscale.textPrimary,
              position: 'absolute',
              left: 0,
              right: 0,
              textAlign: 'center',
            }}
          >
            Receipt
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl2, paddingBottom: theme.spacing.xl3 }}>
        <View
          style={{
            borderRadius: theme.radii.xl,
            backgroundColor: theme.colors.greyscale.bgLight,
            padding: theme.spacing.xl,
            gap: theme.spacing.xl,
            ...theme.shadows.lg,
          }}
        >
          <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
            {/* Stand-in for the confetti banner mentioned above — a
                decorative illustration, not a simple icon, so flagged for
                a real downloaded asset rather than swapped to a vector icon. */}
            <Text style={{ fontSize: 28 }}>🎉</Text>
            <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.textPrimary }}>Transaction Receipt</Text>
            <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textSecondary, marginTop: theme.spacing.sm }}>
              Payment
            </Text>
            <Text style={{ ...theme.typography.display.xl3.bold, color: theme.colors.accent1.primary }}>₦{amount.toLocaleString()}.00</Text>
          </View>

          <View style={{ height: 1, borderStyle: 'dashed', borderTopWidth: 1, borderTopColor: theme.colors.greyscale.stroke }} />

          <View style={{ gap: theme.spacing.lg }}>
            {rows.map(([label, value]) => (
              <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textSecondary }}>{label}</Text>
                <Text style={{ ...theme.typography.body.base.semibold, color: theme.colors.greyscale.textPrimary }}>{value}</Text>
              </View>
            ))}
          </View>

          <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
            For enquiries / support, email us hello@ibrarysupport.com
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Download receipt"
            style={{
              flex: 1,
              height: theme.sizes.ctaButtonHeight,
              borderRadius: theme.radii.full,
              borderWidth: 1.2,
              borderColor: theme.colors.accent1.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ ...theme.typography.header.lg.semibold, color: theme.colors.accent1.primary }}>Download</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Share receipt"
            style={{
              flex: 1,
              height: theme.sizes.ctaButtonHeight,
              borderRadius: theme.radii.full,
              backgroundColor: theme.colors.accent1.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ ...theme.typography.header.lg.semibold, color: theme.colors.greyscale.white }}>Share</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
