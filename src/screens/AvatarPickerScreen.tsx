import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { useLeadershipStore, type AvatarGender } from '../store/leadershipStore';

// Built from Figma 661:16764 ("Male Avatar") / 661:16763 ("Female
// Avatar") — a Male/Female toggle over a 5-column grid of ~50 distinct
// animoji illustrations per gender. Per direction, this project downloads
// exactly one real image per gender (assets/images/avatar-male.png,
// avatar-female.png) and loops it across every grid cell instead of
// downloading 50+ individual assets — every cell within a gender is
// visually identical, so "selecting" one is purely a local highlight;
// only the gender is actually persisted (leadershipStore).
//
// Header title: Figma literally reuses "Statistic Board" as this screen's
// header text too (same as the board it's reached from) — flagged as a
// copy/paste leftover rather than reproduced; "Choose Avatar" is used
// instead, since this is a materially different screen.
//
// 661:16734 ("Video Uploaded", a mislabeled Figma frame name) is actually
// this screen's "Profile Saved" success modal, shown after "Save Avatar".

type Props = NativeStackScreenProps<RootStackParamList, 'AvatarPicker'>;

const GRID_SIZE = 25; // 5 columns x 5 rows — a representative grid, not Figma's full ~50-cell set.

export function AvatarPickerScreen({ navigation }: Props) {
  const theme = useTheme();
  const storedGender = useLeadershipStore((s) => s.avatarGender);
  const setStoredGender = useLeadershipStore((s) => s.setAvatarGender);

  const [gender, setGender] = useState<AvatarGender>(storedGender);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [saved, setSaved] = useState(false);

  const avatarSource = gender === 'male' ? require('../../assets/images/avatar-male.png') : require('../../assets/images/avatar-female.png');

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
        <Text style={{ ...theme.typography.header.lg.semibold, color: theme.colors.greyscale.textPrimary }}>Choose Avatar</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl, paddingBottom: theme.spacing.xl3 }}>
        <View style={{ flexDirection: 'row', backgroundColor: theme.colors.greyscale.stroke, borderRadius: theme.radii.full, padding: 2 }}>
          {(['male', 'female'] as const).map((g) => {
            const selected = gender === g;
            return (
              <Pressable
                key={g}
                onPress={() => {
                  setGender(g);
                  setSelectedIndex(0);
                }}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={g === 'male' ? 'Male avatars' : 'Female avatars'}
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
                  {g}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, justifyContent: 'space-between' }}>
          {Array.from({ length: GRID_SIZE }).map((_, i) => {
            const selected = i === selectedIndex;
            return (
              <Pressable
                key={i}
                onPress={() => setSelectedIndex(i)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={`${gender} avatar ${i + 1}`}
                style={{
                  width: '18%',
                  aspectRatio: 1,
                  borderRadius: theme.radii.md,
                  overflow: 'hidden',
                  borderWidth: selected ? 2 : 0,
                  borderColor: theme.colors.accent1.primary,
                }}
              >
                <Image source={avatarSource} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={{ padding: theme.spacing.lg }}>
        <Pressable
          onPress={() => {
            setStoredGender(gender);
            setSaved(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Save Avatar"
          style={{
            height: theme.sizes.ctaButtonHeight,
            borderRadius: theme.radii.full,
            backgroundColor: theme.colors.accent1.primary,
            alignItems: 'center',
            justifyContent: 'center',
            ...theme.shadows.xs,
          }}
        >
          <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.white }}>Save Avatar</Text>
        </Pressable>
      </View>

      <Modal visible={saved} transparent animationType="fade" onRequestClose={() => setSaved(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl }}>
          <View
            style={{
              width: '100%',
              maxWidth: 390,
              backgroundColor: theme.colors.greyscale.bgDarken,
              borderRadius: theme.radii.xl,
              padding: theme.spacing.xl,
              gap: theme.spacing.xl,
              alignItems: 'center',
              ...theme.shadows.lg,
            }}
          >
            <Pressable
              onPress={() => setSaved(false)}
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
              <Ionicons name="checkmark-circle" size={40} color={theme.colors.accent1.primary} />
            </View>

            <View style={{ gap: theme.spacing.sm, alignItems: 'center' }}>
              <Text style={{ ...theme.typography.header.xl2.bold, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
                Profile Saved
              </Text>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary, textAlign: 'center' }}>
                You have successfully set your leadership avatar. Goodluck coming on top
              </Text>
            </View>

            <Pressable
              onPress={() => {
                setSaved(false);
                navigation.goBack();
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
