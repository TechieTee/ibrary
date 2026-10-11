import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { useLeadershipStore, type AvatarGender } from '../store/leadershipStore';

// Built from Figma 661:16334 (STATS tab, Badge sub-tab) / 661:16335
// (Stats sub-tab) / 661:16336 (Details sub-tab) / 661:16337 (BOARD tab).
// 661:16818 was the duplicate Profile screen (no new info).
//
// All mock — no real leaderboard/gamification backend exists. The
// current user is "Victor Emmanuel" (matching the identity already used
// across Profile/ProfileDetails) rather than Figma's literal "Madelyn
// Dias", so the Stats-tab header and the Board tab's own-rank row (#4)
// read as the same person.
//
// Avatars: per direction, one real downloaded image per gender
// (assets/images/avatar-male.png / avatar-female.png) is reused for every
// avatar slot here (own card, podium, ranked list) — see
// leadershipStore.ts and AvatarPickerScreen.tsx. Each leaderboard entry's
// gender below is an arbitrary mock assignment for visual variety, not
// derived from anything real.
//
// 661:16336's "Details" sub-tab showed an unrelated lorem-ipsum article
// in Figma (a mismatched/placeholder frame) — rebuilt here as a plausible
// "About this player" panel (mock join date / favorite subject / streak)
// instead of reproducing content that didn't belong.
//
// Badges (661:16334) are simplified from Figma's hexagon shape to rounded
// squares — a literal hexagon needs an SVG path, not worth it for a
// decorative badge shape. One badge ("Badge / 3" in Figma) is shown
// locked (lock icon, dimmed) to match the design; which badge is locked
// isn't driven by any real unlock logic.
//
// The Stats sub-tab's donut (quiz played) and bar chart (performance by
// category) are rebuilt with react-native-svg / plain Views rather than
// traced from Figma's exact vector paths — same approach as
// CircularProgress elsewhere in this app.

type Props = NativeStackScreenProps<RootStackParamList, 'LeadershipBoard'>;

type TopTab = 'stats' | 'board';
type StatsSubTab = 'badge' | 'stats' | 'details';

const CURRENT_USER = {
  name: 'Victor Emmanuel',
  points: 590,
  worldRank: '#1,438',
  localRank: '#56',
};

interface LeaderEntry {
  rank: number;
  name: string;
  points: number;
  gender: AvatarGender;
}

const PODIUM: LeaderEntry[] = [
  { rank: 1, name: 'QueenRita', points: 2569, gender: 'female' },
  { rank: 2, name: 'Avengers-X', points: 1469, gender: 'male' },
  { rank: 3, name: 'Dianna787', points: 1053, gender: 'female' },
];

const RANKED_LIST: LeaderEntry[] = [
  { rank: 4, name: CURRENT_USER.name, points: CURRENT_USER.points, gender: 'male' },
  { rank: 5, name: 'Zain Vaccaro', points: 448, gender: 'male' },
  { rank: 6, name: 'Skylar Geidt', points: 448, gender: 'female' },
  { rank: 7, name: 'Justin Bator', points: 448, gender: 'male' },
  { rank: 8, name: 'Cooper Lipshutz', points: 448, gender: 'female' },
  { rank: 9, name: 'Alfredo Septimus', points: 448, gender: 'male' },
  { rank: 10, name: 'Paityn Aminoff', points: 448, gender: 'female' },
];

const BADGES: { key: string; icon: keyof typeof Ionicons.glyphMap; bg: string; locked?: boolean }[] = [
  { key: 'time', icon: 'time', bg: '#C9F2E9' },
  { key: 'stats', icon: 'stats-chart', bg: '#FFF3CC' },
  { key: 'smile', icon: 'happy', bg: '#BFDBFE' },
  { key: 'medal', icon: 'ribbon', bg: '#FFD6DD' },
  { key: 'puzzle', icon: 'extension-puzzle', bg: '#DCD4E6' },
  { key: 'locked', icon: 'lock-closed', bg: '#9CA3AF', locked: true },
];

const CATEGORY_PERFORMANCE: { key: string; label: string; percent: number; color: string }[] = [
  { key: 'math', label: 'Math', percent: 30, color: '#F3C59E' },
  { key: 'sports', label: 'Sports', percent: 80, color: '#DCD4E6' },
  { key: 'music', label: 'Music', percent: 60, color: '#1C1C1C' },
];

function avatarSource(gender: AvatarGender) {
  return gender === 'male' ? require('../../assets/images/avatar-male.png') : require('../../assets/images/avatar-female.png');
}

export function LeadershipBoardScreen({ navigation }: Props) {
  const theme = useTheme();
  const userGender = useLeadershipStore((s) => s.avatarGender);
  const [topTab, setTopTab] = useState<TopTab>('stats');
  const [statsTab, setStatsTab] = useState<StatsSubTab>('badge');

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <View
        style={{
          height: 56,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.greyscale.stroke,
        }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={{ position: 'absolute', left: theme.spacing.lg }}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.greyscale.textPrimary} />
        </Pressable>
        <Text style={{ ...theme.typography.header.lg.semibold, color: theme.colors.greyscale.textPrimary }}>Statistic Board</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl, paddingBottom: theme.spacing.xl3 }}>
        <View style={{ flexDirection: 'row', backgroundColor: theme.colors.greyscale.stroke, borderRadius: theme.radii.full, padding: 2 }}>
          {(['stats', 'board'] as const).map((t) => {
            const selected = topTab === t;
            return (
              <Pressable
                key={t}
                onPress={() => setTopTab(t)}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={t === 'stats' ? 'Stats' : 'Board'}
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
                  {t}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {topTab === 'stats' ? (
          <>
            <View style={{ alignItems: 'center', gap: theme.spacing.md }}>
              <View>
                <View style={{ width: 110, height: 110, borderRadius: 55, backgroundColor: theme.colors.accent2.primary, overflow: 'hidden' }}>
                  <Image source={avatarSource(userGender)} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                </View>
                <Pressable
                  onPress={() => navigation.navigate('AvatarPicker')}
                  accessibilityRole="button"
                  accessibilityLabel="Change avatar"
                  style={{
                    position: 'absolute',
                    right: -4,
                    bottom: 4,
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: theme.colors.accent1.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="pencil" size={16} color={theme.colors.greyscale.white} />
                </Pressable>
              </View>
              <Text style={{ ...theme.typography.header.xl2.semibold, color: theme.colors.greyscale.textPrimary }}>{CURRENT_USER.name}</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                backgroundColor: theme.colors.accent1.primary,
                borderRadius: theme.radii.lg,
                paddingVertical: theme.spacing.lg,
              }}
            >
              {[
                { icon: 'star' as const, label: 'POINTS', value: String(CURRENT_USER.points) },
                { icon: 'globe' as const, label: 'WORLD RANK', value: CURRENT_USER.worldRank },
                { icon: 'podium' as const, label: 'LOCAL RANK', value: CURRENT_USER.localRank },
              ].map((stat, i) => (
                <View key={stat.label} style={{ flex: 1, alignItems: 'center', gap: 4, borderLeftWidth: i > 0 ? 1 : 0, borderLeftColor: 'rgba(255,255,255,0.3)' }}>
                  <Ionicons name={stat.icon} size={20} color={theme.colors.greyscale.white} />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.8)' }}>{stat.label}</Text>
                  <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>{stat.value}</Text>
                </View>
              ))}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: theme.colors.greyscale.stroke, paddingBottom: theme.spacing.sm }}>
              {(['badge', 'stats', 'details'] as const).map((t) => {
                const selected = statsTab === t;
                return (
                  <Pressable key={t} onPress={() => setStatsTab(t)} accessibilityRole="tab" accessibilityState={{ selected }} accessibilityLabel={t}>
                    <Text
                      style={{
                        ...theme.typography.body.base.medium,
                        color: selected ? theme.colors.accent1.primary : theme.colors.greyscale.textSecondary,
                        fontWeight: selected ? '700' : '400',
                        textTransform: 'capitalize',
                      }}
                    >
                      {t}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {statsTab === 'badge' && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.lg, justifyContent: 'center' }}>
                {BADGES.map((badge) => (
                  <View key={badge.key} style={{ alignItems: 'center', gap: theme.spacing.xs, width: '28%' }}>
                    <View
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: theme.radii.lg,
                        backgroundColor: badge.bg,
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: badge.locked ? 0.5 : 1,
                      }}
                    >
                      <Ionicons name={badge.icon} size={28} color={theme.colors.greyscale.bgDarken} />
                    </View>
                  </View>
                ))}
              </View>
            )}

            {statsTab === 'stats' && (
              <View style={{ gap: theme.spacing.xl }}>
                <View style={{ alignItems: 'center', gap: theme.spacing.lg }}>
                  <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
                    You have done a total <Text style={{ color: theme.colors.accent1.primary, fontWeight: '700' }}>24 quizzes</Text> this month!
                  </Text>
                  <QuizDonut played={37} total={50} />
                  <View style={{ flexDirection: 'row', gap: theme.spacing.md, width: '100%' }}>
                    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgDarken, borderRadius: theme.radii.lg, padding: theme.spacing.lg, gap: theme.spacing.xs }}>
                      <Text style={{ ...theme.typography.display.xl3.bold, color: theme.colors.greyscale.textPrimary }}>5</Text>
                      <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary }}>Quiz Created</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: theme.colors.accent1.primary, borderRadius: theme.radii.lg, padding: theme.spacing.lg, gap: theme.spacing.xs }}>
                      <Text style={{ ...theme.typography.display.xl3.bold, color: theme.colors.greyscale.bgDarken }}>21</Text>
                      <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.bgDarken }}>Quiz Won</Text>
                    </View>
                  </View>
                </View>

                <View style={{ backgroundColor: theme.colors.accent2.primary, borderRadius: theme.radii.lg, padding: theme.spacing.lg, gap: theme.spacing.lg }}>
                  <Text style={{ ...theme.typography.header.base.medium, color: theme.colors.greyscale.bgDarken }}>Top performance by category</Text>
                  <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
                    {CATEGORY_PERFORMANCE.map((cat) => (
                      <View key={cat.key} style={{ flex: 1, alignItems: 'center', gap: theme.spacing.xs }}>
                        <View style={{ height: 120, width: 32, borderRadius: theme.radii.md, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'flex-end', overflow: 'hidden' }}>
                          <View style={{ height: `${cat.percent}%`, backgroundColor: cat.color, borderRadius: theme.radii.md }} />
                        </View>
                        <Text style={{ fontSize: 12, color: theme.colors.greyscale.bgDarken }}>{cat.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {statsTab === 'details' && (
              <View style={{ gap: theme.spacing.lg }}>
                {[
                  { label: 'Joined iBrary', value: 'September 2024' },
                  { label: 'Favorite Subject', value: 'Mathematics' },
                  { label: 'Current Streak', value: '12 days' },
                  { label: 'Class', value: 'Student - SS1' },
                ].map((row) => (
                  <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderBottomColor: theme.colors.greyscale.stroke }}>
                    <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textSecondary }}>{row.label}</Text>
                    <Text style={{ ...theme.typography.body.base.semibold, color: theme.colors.greyscale.textPrimary }}>{row.value}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        ) : (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, backgroundColor: theme.colors.greyscale.bgDarken, borderRadius: theme.radii.lg, padding: theme.spacing.md }}>
              <View style={{ backgroundColor: theme.colors.accent1.primary, width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>#4</Text>
              </View>
              <Text style={{ flex: 1, ...theme.typography.body.base.medium, color: theme.colors.greyscale.textPrimary }}>
                You are doing better than 60% of other players!
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: theme.spacing.sm, marginTop: theme.spacing.lg }}>
              {[PODIUM[1], PODIUM[0], PODIUM[2]].map((leader) => (
                <PodiumSpot key={leader.rank} leader={leader} theme={theme} />
              ))}
            </View>

            <View style={{ gap: theme.spacing.md }}>
              {RANKED_LIST.map((leader) => {
                const isYou = leader.name === CURRENT_USER.name;
                return (
                  <View
                    key={leader.rank}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: theme.spacing.md,
                      backgroundColor: theme.colors.greyscale.bgDarken,
                      borderRadius: theme.radii.lg,
                      padding: theme.spacing.md,
                      borderWidth: isYou ? 1 : 0,
                      borderColor: theme.colors.accent1.primary,
                    }}
                  >
                    <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: theme.colors.greyscale.bgLight, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 12, color: theme.colors.greyscale.textSecondary }}>{leader.rank}</Text>
                    </View>
                    <View style={{ width: 48, height: 48, borderRadius: 24, overflow: 'hidden', backgroundColor: theme.colors.accent1.tertiary }}>
                      <Image source={avatarSource(leader.gender)} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={{ ...theme.typography.header.base.semibold, color: theme.colors.greyscale.textPrimary }}>
                        {leader.name}
                        {isYou ? ' (You)' : ''}
                      </Text>
                      <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>{leader.points} points</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function PodiumSpot({ leader, theme }: { leader: LeaderEntry; theme: ReturnType<typeof useTheme> }) {
  const height = leader.rank === 1 ? 160 : leader.rank === 2 ? 130 : 110;
  const avatarSize = leader.rank === 1 ? 72 : 56;
  return (
    <View style={{ alignItems: 'center', gap: theme.spacing.xs, width: 100 }}>
      <View style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2, overflow: 'hidden', backgroundColor: theme.colors.accent2.primary }}>
        <Image source={avatarSource(leader.gender)} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      </View>
      <Text numberOfLines={1} style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary }}>{leader.name}</Text>
      <View style={{ backgroundColor: theme.colors.accent1.primary, borderRadius: theme.radii.full, paddingHorizontal: theme.spacing.sm, paddingVertical: 2 }}>
        <Text style={{ fontSize: 12, color: theme.colors.greyscale.white, fontWeight: '600' }}>{leader.points.toLocaleString()} Pts</Text>
      </View>
      <View
        style={{
          width: 100,
          height,
          backgroundColor: theme.colors.accent1.primary,
          borderTopLeftRadius: theme.radii.md,
          borderTopRightRadius: theme.radii.md,
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: theme.spacing.sm,
        }}
      >
        <Text style={{ fontSize: 48, fontWeight: '800', color: theme.colors.greyscale.white }}>{leader.rank}</Text>
      </View>
    </View>
  );
}

function QuizDonut({ played, total }: { played: number; total: number }) {
  const theme = useTheme();
  const percent = Math.round((played / total) * 100);
  const size = 150;
  const strokeWidth = 14;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <DonutRing size={size} strokeWidth={strokeWidth} percent={percent} color={theme.colors.accent1.primary} trackColor={theme.colors.greyscale.stroke} />
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ ...theme.typography.display.xl3.bold, color: theme.colors.greyscale.textPrimary }}>
          {played}
          <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textSecondary }}>/{total}</Text>
        </Text>
        <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary }}>quiz played</Text>
      </View>
    </View>
  );
}

// Same technique as CircularProgress.tsx, duplicated locally since the
// center label here ("37/50 quiz played") doesn't fit that component's
// fixed "{percent}%" label format.
function DonutRing({ size, strokeWidth, percent, color, trackColor }: { size: number; strokeWidth: number; percent: number; color: string; trackColor: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percent / 100);
  return (
    <Svg width={size} height={size} style={{ position: 'absolute' }}>
      <Circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation={-90}
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
}
