import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal, Share } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';

// Built from Figma 661:16766/16765 (Promo & Referrals, "Promotion" tab —
// no-promotions empty state vs the two example promo banners, same
// section in two states) and 661:16767/16768 (the "Daily Usage" tab's
// check-in card before/after tapping "Check In") — one screen with a tab
// + local check-in state, not four. 661:16740 was the duplicate Profile
// screen (no new info). 661:16769 ("Invite Friends") is the share
// bottom-sheet opened from "Share" on the referral card.
//
// Points/referral-code/check-in data is all mock — no loyalty/referral
// backend exists. Defaults to showing the two example promo banners
// rather than Figma's "There's no promotion" empty state, since nothing
// would ever populate real promos and an always-empty section would make
// most of this screen pointless; the empty-state copy is unused but not
// deleted, flagged here rather than wired to anything.
//
// The daily check-in gold palette (#FFEEB3/#FFF9E6/#FFF3CC/#FFC501/
// #D69400) has no equivalent in the shared theme tokens (only greyscale/
// accent1/accent2/system exist) — kept as local literal constants,
// matching the precedent elsewhere (PaystackCheckoutScreen's COLORS,
// ChangePasswordScreen's STRENGTH_COPY). "Today" is hardcoded as day 5 of
// 7 (matching Figma), not derived from a real date — there's no real
// streak-tracking backend to compute it from.
//
// Icons use @expo/vector-icons throughout, including the share-sheet's
// brand icons (Facebook/WhatsApp/X/LinkedIn/Telegram/Email/TikTok/Gmail)
// — real icons, not downloaded Figma brand assets. The modal's "contacts"
// row (Figma shows real profile photos) is decorative/non-functional —
// no contacts API integration exists — using initials-circle placeholders
// instead, consistent with Avatar in LessonReaderScreen. Tapping an app
// icon or a contact calls React Native's real Share.share() (same API
// LessonReaderScreen already uses), which opens the OS's actual share
// sheet — there's no way to deep-link into a specific app's share target
// without that app's SDK, so this is the honest simplification rather
// than faking per-app behavior. "Copy Link" uses real expo-clipboard.

type Props = NativeStackScreenProps<RootStackParamList, 'PromoReferrals'>;

type Tab = 'daily' | 'promotion';

const REFERRAL_CODE = '909879742';
const REFERRAL_MESSAGE = `I use IBrary for the best experience in all things learning. It's intuitive, reliable, and affordable. Sign up with my referral code ${REFERRAL_CODE} and enjoy 10% off your first membership!`;
const REFERRAL_LINK = `https://ibrary.app/r/${REFERRAL_CODE}`;

const GOLD = {
  filled: '#FFEEB3',
  today: '#FFF9E6',
  upcoming: '#FFF3CC',
  badgeText: '#FFC501',
  todayLabel: '#D69400',
};

const CHECKIN_DAYS = [
  { day: 1, points: 100 },
  { day: 2, points: 100 },
  { day: 3, points: 100 },
  { day: 4, points: 100 },
  { day: 5, points: 100 },
  { day: 6, points: 100 },
  { day: 7, points: 400 },
];
const TODAY_INDEX = 4; // Day 5, matching Figma's "Today" marker.

const PROMO_BANNERS = [
  {
    key: 'black-friday',
    bg: '#E26F0E',
    tag: '30% OFF',
    title: 'Black Friday deal',
    description: 'Get 20% off for your subscription you invite 8 people to iBrary and they do a subcription',
  },
  {
    key: 'book-subscription',
    bg: '#A67ADC',
    tag: null,
    title: 'Book a Subscription worth ₦6,000 (6 months)',
    description: 'Get discount on your next 3 month subscriptions',
  },
] as const;

const SHARE_ICONS: { key: string; icon: React.ReactNode; bg: string }[] = [
  { key: 'facebook', icon: <Ionicons name="logo-facebook" size={20} color="#fff" />, bg: '#E26F0E' },
  { key: 'whatsapp', icon: <Ionicons name="logo-whatsapp" size={18} color="#fff" />, bg: '#E26F0E' },
  { key: 'x', icon: <Ionicons name="logo-twitter" size={16} color="#fff" />, bg: '#E26F0E' },
  { key: 'linkedin', icon: <Ionicons name="logo-linkedin" size={20} color="#fff" />, bg: '#E26F0E' },
  { key: 'telegram', icon: <FontAwesome5 name="telegram-plane" size={18} color="#fff" />, bg: '#E26F0E' },
  { key: 'email', icon: <Ionicons name="mail" size={18} color="#fff" />, bg: '#E26F0E' },
];

function shareReferral() {
  Share.share({ message: REFERRAL_MESSAGE }).catch(() => {});
}

export function PromoReferralsScreen({ navigation }: Props) {
  const theme = useTheme();
  const [tab, setTab] = useState<Tab>('promotion');
  const [checkedIn, setCheckedIn] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="Promo & Referrals" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl2, paddingBottom: theme.spacing.xl3 }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: theme.colors.greyscale.stroke,
            borderRadius: theme.radii.full,
            padding: 2,
          }}
        >
          {(['daily', 'promotion'] as const).map((t) => {
            const selected = tab === t;
            return (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={t === 'daily' ? 'Daily usage' : 'Promotion'}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: theme.radii.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: selected ? theme.colors.accent1.primary : 'transparent',
                }}
              >
                <Text
                  style={{
                    ...theme.typography.body.base.medium,
                    color: selected ? theme.colors.greyscale.white : theme.colors.greyscale.textPrimary,
                    textTransform: 'uppercase',
                    fontWeight: selected ? '700' : '500',
                  }}
                >
                  {t === 'daily' ? 'Daily Usage' : 'Promotion'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {tab === 'promotion' ? (
          <>
            <View style={{ backgroundColor: theme.colors.accent2.primary, borderRadius: theme.radii.md, padding: theme.spacing.lg, gap: theme.spacing.md }}>
              <Text style={{ ...theme.typography.body.sm.bold, color: theme.colors.greyscale.bgDarken }}>
                (2,000pts = 10% Monthly Discount)
              </Text>
              <Text style={{ ...theme.typography.display.xl3.bold, color: theme.colors.greyscale.bgDarken }}>1450 POINT</Text>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.bgDarken }}>
                You get 300pts for invitee that subscribes on iBrary
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: theme.colors.accent2.tertiary,
                  borderWidth: 1,
                  borderColor: theme.colors.greyscale.bgDarken,
                  borderRadius: theme.radii.md,
                  padding: theme.spacing.md,
                }}
              >
                <View style={{ gap: 2 }}>
                  <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.accent2.primary }}>{REFERRAL_CODE}</Text>
                  <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.accent2.primary }}>Your iBrary Referral Code</Text>
                </View>
                <Pressable
                  onPress={() => setInviteOpen(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Share referral code"
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: theme.colors.greyscale.white,
                    borderRadius: theme.radii.md,
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.sm,
                  }}
                >
                  <Text style={{ ...theme.typography.body.sm.bold, color: theme.colors.accent1.primary }}>Share</Text>
                  <Ionicons name="share-social-outline" size={16} color={theme.colors.accent1.primary} />
                </Pressable>
              </View>
            </View>

            <View style={{ gap: theme.spacing.lg }}>
              <Text style={{ ...theme.typography.header.lg.semibold, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
                👇🏻 Share Your Link 👇🏻
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.spacing.md, justifyContent: 'center', flexWrap: 'wrap' }}>
                {SHARE_ICONS.map((s) => (
                  <Pressable
                    key={s.key}
                    onPress={shareReferral}
                    accessibilityRole="button"
                    accessibilityLabel={`Share via ${s.key}`}
                    style={{ width: 38, height: 38, borderRadius: theme.radii.md, backgroundColor: s.bg, alignItems: 'center', justifyContent: 'center' }}
                  >
                    {s.icon}
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View
            style={{
              backgroundColor: theme.colors.accent2.primary,
              borderRadius: theme.radii.md,
              padding: theme.spacing.lg,
              gap: theme.spacing.lg,
            }}
          >
            <View style={{ gap: 4 }}>
              <Text style={{ ...theme.typography.body.base.semibold, color: theme.colors.greyscale.bgDarken }}>
                (2,000pts = 10% Monthly Discount)
              </Text>
              <Text style={{ ...theme.typography.body.xs.regular, color: theme.colors.greyscale.white }}>
                Check in everyday on the iBrary app to earn 100 each day and get a total of 1000 point after 7 consecutive days.
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 6 }}>
              {CHECKIN_DAYS.map((d, i) => {
                const isToday = i === TODAY_INDEX;
                const isPast = i < TODAY_INDEX || (i === TODAY_INDEX && checkedIn);
                const isFuture = i > TODAY_INDEX;
                return (
                  <View
                    key={d.day}
                    style={{
                      flex: 1,
                      height: 57,
                      borderRadius: theme.radii.md / 3,
                      borderWidth: 1,
                      borderColor: '#FFF4E6',
                      backgroundColor: isToday ? GOLD.today : isFuture ? GOLD.upcoming : GOLD.filled,
                      opacity: isFuture ? 0.5 : 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                    }}
                  >
                    <Ionicons name="pricetag" size={16} color={GOLD.badgeText} />
                    <Text style={{ fontSize: 8, fontWeight: '700', color: '#fff3d1' }}>+{d.points}</Text>
                    <Text
                      style={{
                        fontSize: isToday ? 11 : 9,
                        fontWeight: '600',
                        color: isToday ? GOLD.todayLabel : theme.colors.greyscale.textSecondary,
                      }}
                    >
                      {isToday ? 'Today' : `Day ${d.day}`}
                    </Text>
                  </View>
                );
              })}
            </View>

            <Pressable
              onPress={() => setCheckedIn(true)}
              disabled={checkedIn}
              accessibilityRole="button"
              accessibilityLabel={checkedIn ? "You've checked in" : 'Check in'}
              accessibilityState={{ disabled: checkedIn }}
              style={{
                height: theme.sizes.ctaButtonHeight,
                borderRadius: theme.radii.full,
                borderWidth: 1,
                borderColor: theme.colors.accent1.primary,
                backgroundColor: theme.colors.greyscale.bgDarken,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: theme.spacing.md,
              }}
            >
              <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.accent1.primary, textAlign: 'center' }}>
                {checkedIn ? "You've Checked In Successfully" : 'Check In'}
              </Text>
            </Pressable>
          </View>
        )}

        <View style={{ gap: theme.spacing.lg }}>
          <Text style={{ ...theme.typography.header.lg.semibold, color: theme.colors.greyscale.textPrimary }}>Promo & Discount</Text>
          {PROMO_BANNERS.map((banner) => (
            <View key={banner.key} style={{ backgroundColor: banner.bg, borderRadius: theme.radii.md, padding: theme.spacing.lg, gap: theme.spacing.sm, overflow: 'hidden' }}>
              {banner.tag && (
                <Text style={{ ...theme.typography.body.sm.bold, color: theme.colors.greyscale.white }}>{banner.tag}</Text>
              )}
              <Text style={{ ...theme.typography.display.xl2.semibold, color: theme.colors.greyscale.white }}>{banner.title}</Text>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.white }}>{banner.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <InviteFriendsModal visible={inviteOpen} onClose={() => setInviteOpen(false)} />
    </View>
  );
}

const MOCK_CONTACTS = ['Mike Adenuga', 'Chioma Mathew', 'Idris Abdul', 'Sofia Lemuel', 'Joseph Green'];

const SHARE_APPS: { key: string; label: string; icon: React.ReactNode; bg: string }[] = [
  { key: 'quick-share', label: 'Quick Share', icon: <Ionicons name="share-social" size={18} color="#fff" />, bg: '#3B82F6' },
  { key: 'whatsapp', label: 'Whatsapp', icon: <Ionicons name="logo-whatsapp" size={18} color="#fff" />, bg: '#25D366' },
  { key: 'tiktok', label: 'TikTok Lite', icon: <Ionicons name="logo-tiktok" size={18} color="#fff" />, bg: '#000000' },
  { key: 'files', label: 'File by Google', icon: <MaterialCommunityIcons name="folder-google-drive" size={18} color="#fff" />, bg: '#4285F4' },
  { key: 'gmail', label: 'Gmail', icon: <Ionicons name="mail" size={18} color="#fff" />, bg: '#EA4335' },
];

function InviteFriendsModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await Clipboard.setStringAsync(REFERRAL_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
        <View
          accessibilityViewIsModal
          style={{
            backgroundColor: theme.colors.greyscale.bgLight,
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
            paddingTop: theme.spacing.md,
            paddingBottom: theme.spacing.xl2,
            gap: theme.spacing.xl,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 111, height: 5, borderRadius: 8, backgroundColor: theme.colors.greyscale.stroke }} />
          </View>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={{ position: 'absolute', right: theme.spacing.lg, top: theme.spacing.md }}
          >
            <Ionicons name="close-circle" size={28} color={theme.colors.system.error} />
          </Pressable>

          <Text style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textSecondary, paddingHorizontal: theme.spacing.lg }}>
            I use IBrary for the best experience in all things learning. It's intuitive, reliable, and affordable. Sign up with my
            referral code <Text style={{ fontWeight: '700' }}>{REFERRAL_CODE}</Text> and enjoy{' '}
            <Text style={{ fontWeight: '700' }}>10%</Text> off your first membership!
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: theme.spacing.lg, gap: theme.spacing.lg }}>
            {MOCK_CONTACTS.map((name) => (
              <Pressable
                key={name}
                onPress={shareReferral}
                accessibilityRole="button"
                accessibilityLabel={`Share with ${name}`}
                style={{ alignItems: 'center', gap: 2, width: 76 }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.accent2.tertiary, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ ...theme.typography.body.sm.bold, color: theme.colors.accent2.primary }}>
                    {name.charAt(0)}
                  </Text>
                </View>
                <Text numberOfLines={1} style={{ fontSize: 12, color: theme.colors.greyscale.textPrimary }}>
                  {name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={{ height: 1, backgroundColor: theme.colors.greyscale.stroke }} />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: theme.spacing.lg, gap: theme.spacing.lg }}>
            {SHARE_APPS.map((app) => (
              <Pressable
                key={app.key}
                onPress={shareReferral}
                accessibilityRole="button"
                accessibilityLabel={`Share via ${app.label}`}
                style={{ alignItems: 'center', gap: 2, width: 76 }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: app.bg, alignItems: 'center', justifyContent: 'center' }}>
                  {app.icon}
                </View>
                <Text numberOfLines={1} style={{ fontSize: 12, color: theme.colors.greyscale.textPrimary }}>
                  {app.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={{ height: 1, backgroundColor: theme.colors.greyscale.stroke }} />

          <Pressable
            onPress={copyLink}
            accessibilityRole="button"
            accessibilityLabel="Copy referral link"
            style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.accent1.primary, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="link" size={22} color={theme.colors.greyscale.white} />
            </View>
            <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textPrimary }}>
              {copied ? 'Link copied!' : 'Copy Link'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
