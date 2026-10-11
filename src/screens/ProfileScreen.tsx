import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { TabParamList, RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { useThemeStore } from '../store/themeStore';
import { useSubscriptionStore, type SubscriptionStatus } from '../store/subscriptionStore';
import { SignOutModal } from '../components/SignOutModal';

// Built from Figma 661:16738 ("Profile"). Mock identity "Victor Emmanuel /
// Student - SS1" — no real user/profile backend exists (same fabrication
// pattern as Home's "Hi, JOEL" greeting, which is a separate unrelated
// stand-in name; not reconciled here since Home wasn't part of this task).
// The "Monthly Subscription" and "SS 1" class pills are informational only
// (not wired to the subscriptionStore's actual status) and the avatar edit
// badge is decorative — no image-picker pipeline exists.
//
// Every row is now wired to real navigation. "Logout" opens SignOutModal
// (661:16756); confirming resets the whole nav stack back to Splash.
//
// The header's Dark/Light switch (new control, not seen on any other
// screen) is wired to the real useThemeStore toggle rather than kept
// decorative, since it's a natural, low-risk home for it.

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

const STATUS_OPTIONS: { value: SubscriptionStatus; label: string }[] = [
  { value: 'none', label: 'None (never subscribed)' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
];

type IconRenderer = (props: { size: number; color: string }) => React.ReactNode;

interface RowItem {
  key: string;
  icon: IconRenderer;
  title: string;
  onPress?: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.textPrimary }}>
        {title}
      </Text>
      <View
        style={{
          backgroundColor: theme.colors.greyscale.bgLight,
          borderRadius: theme.radii.md,
        }}
      >
        {children}
      </View>
    </View>
  );
}

function Row({ item, isLast }: { item: RowItem; isLast: boolean }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={item.onPress}
      accessibilityRole={item.onPress ? 'button' : undefined}
      accessibilityLabel={item.title}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: theme.colors.greyscale.stroke,
        opacity: item.onPress ? 1 : 0.5,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: theme.colors.greyscale.bgDarken,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {item.icon({ size: 16, color: theme.colors.greyscale.textPrimary })}
      </View>
      <Text style={{ flex: 1, ...theme.typography.body.base.medium, color: theme.colors.greyscale.textSecondary }}>
        {item.title}
      </Text>
      <Text style={{ fontSize: 20, color: theme.colors.greyscale.textSecondary }}>›</Text>
    </Pressable>
  );
}

export function ProfileScreen({ navigation }: Props) {
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);
  const toggleMode = useThemeStore((s) => s.toggleMode);
  const status = useSubscriptionStore((s) => s.status);
  const setStatus = useSubscriptionStore((s) => s.setStatus);
  const [signOutVisible, setSignOutVisible] = React.useState(false);

  const accountRows: RowItem[] = [
    { key: 'personal-info', icon: (p) => <Ionicons name="person-outline" {...p} />, title: 'My Personal Information', onPress: () => navigation.navigate('PersonalInformation') },
    { key: 'subscriptions', icon: (p) => <Ionicons name="card-outline" {...p} />, title: 'Subscriptions', onPress: () => navigation.navigate('Subscription') },
    { key: 'favorites', icon: (p) => <Ionicons name="heart-outline" {...p} />, title: 'Favorite/Saved', onPress: () => navigation.navigate('FavoriteSaved') },
  ];
  const incentiveRows: RowItem[] = [
    { key: 'promotions', icon: (p) => <Ionicons name="gift-outline" {...p} />, title: 'Promotions', onPress: () => navigation.navigate('PromoReferrals') },
    { key: 'leaderboard', icon: (p) => <Ionicons name="trophy-outline" {...p} />, title: 'iBrary Leadership Board', onPress: () => navigation.navigate('LeadershipBoard') },
  ];
  const supportRows: RowItem[] = [
    { key: 'todos', icon: (p) => <Ionicons name="checkbox-outline" {...p} />, title: 'Learning To-Dos', onPress: () => navigation.navigate('LearningTodos') },
    { key: 'help', icon: (p) => <Ionicons name="help-circle-outline" {...p} />, title: 'Help & Support', onPress: () => navigation.navigate('HelpSupport') },
    { key: 'legal', icon: (p) => <MaterialCommunityIcons name="scale-balance" {...p} />, title: 'Legal', onPress: () => navigation.navigate('Legal') },
  ];
  const miscRows: RowItem[] = [
    { key: 'about', icon: (p) => <Ionicons name="information-circle-outline" {...p} />, title: 'About us', onPress: () => navigation.navigate('AboutUs') },
    { key: 'logout', icon: (p) => <Ionicons name="log-out-outline" {...p} />, title: 'Logout', onPress: () => setSignOutVisible(true) },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgDarken }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, gap: theme.spacing.xs }}>
            <Text style={{ ...theme.typography.display.xl3.bold, color: theme.colors.greyscale.textPrimary, textTransform: 'uppercase' }}>
              Profile
            </Text>
            <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary }}>
              Ready to improve your knowledge today?
            </Text>
          </View>
          <Pressable
            onPress={toggleMode}
            accessibilityRole="switch"
            accessibilityState={{ checked: mode === 'dark' }}
            accessibilityLabel="Toggle dark mode"
            style={{
              width: 64,
              height: 36,
              borderRadius: 18,
              backgroundColor: theme.colors.greyscale.white,
              padding: 3,
              justifyContent: 'center',
              ...theme.shadows.xs,
            }}
          >
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: mode === 'dark' ? theme.colors.accent2.primary : theme.colors.accent1.secondary,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: mode === 'dark' ? 'flex-end' : 'flex-start',
              }}
            >
              <Ionicons name={mode === 'dark' ? 'moon' : 'sunny'} size={14} color={theme.colors.greyscale.white} />
            </View>
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.md,
            backgroundColor: theme.colors.greyscale.bgLight,
            borderRadius: theme.radii.md,
            padding: theme.spacing.lg,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: theme.colors.accent1.tertiary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.white }}>VE</Text>
          </View>
          <View style={{ flex: 1, gap: theme.spacing.xs }}>
            <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.textPrimary }}>
              Victor Emmanuel
            </Text>
            <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary }}>
              Student - SS1
            </Text>
            <View style={{ flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.xs }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: theme.spacing.xs,
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: 4,
                  borderRadius: theme.radii.full,
                  backgroundColor: `${theme.colors.accent1.tertiary}33`,
                }}
              >
                <Ionicons name="star" size={12} color={theme.colors.accent1.primary} />
                <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.accent1.primary }}>
                  Monthly Subcription
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: 4,
                  borderRadius: theme.radii.full,
                  backgroundColor: theme.colors.accent2.quaternary,
                }}
              >
                <Text style={{ ...theme.typography.header.xs.semibold, color: theme.colors.accent2.primary }}>SS 1 ⌄</Text>
              </View>
            </View>
          </View>
        </View>

        <Section title="Account Information:">
          {accountRows.map((row, i) => (
            <Row key={row.key} item={row} isLast={i === accountRows.length - 1} />
          ))}
        </Section>

        <Section title="iBrary Incentives">
          {incentiveRows.map((row, i) => (
            <Row key={row.key} item={row} isLast={i === incentiveRows.length - 1} />
          ))}
        </Section>

        <Section title="Support & Safety">
          {supportRows.map((row, i) => (
            <Row key={row.key} item={row} isLast={i === supportRows.length - 1} />
          ))}
        </Section>

        <View style={{ backgroundColor: theme.colors.greyscale.bgLight, borderRadius: theme.radii.md }}>
          {miscRows.map((row, i) => (
            <Row key={row.key} item={row} isLast={i === miscRows.length - 1} />
          ))}
        </View>

        <View style={{ gap: theme.spacing.md, alignItems: 'center', marginTop: theme.spacing.xl }}>
          <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary, textAlign: 'center' }}>
            Dev: subscription status (drives Home's premium-gate modals)
          </Text>
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm, flexWrap: 'wrap', justifyContent: 'center' }}>
            {STATUS_OPTIONS.map((opt) => {
              const selected = status === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setStatus(opt.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={opt.label}
                  style={{
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.sm,
                    borderRadius: theme.radii.md,
                    backgroundColor: selected ? theme.colors.accent1.primary : theme.colors.greyscale.bgLight,
                  }}
                >
                  <Text style={{ ...theme.typography.body.sm.medium, color: selected ? theme.colors.greyscale.white : theme.colors.greyscale.textPrimary }}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <SignOutModal
        visible={signOutVisible}
        onCancel={() => setSignOutVisible(false)}
        onConfirm={() => {
          setSignOutVisible(false);
          navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.reset({
            index: 0,
            routes: [{ name: 'Splash' }],
          });
        }}
      />
    </View>
  );
}
